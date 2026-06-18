import { execSync } from "child_process";
import { prisma } from "../../../lib/prisma";
import { successResponse, errorResponse } from "../../../lib/response";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // timeout 2 menit untuk training

// Path absolut ke root proyek
const ROOT = path.resolve(process.cwd(), "..", "..");
const ML_BUILD = path.join(ROOT, "apps", "ml-build");
const ML_SERVING = path.join(ROOT, "apps", "ml-serving");
const RAW_CSV = path.join(ML_BUILD, "data", "raw", "dataset_modelling_waste.csv");
const MODEL_SRC = path.join(ML_BUILD, "model", "rf_waste_model.pkl");
const MODEL_DST = path.join(ML_SERVING, "models", "rf_waste_model.pkl");
const ML_SERVER_URL = process.env.ML_SERVER_URL || "http://127.0.0.1:8000";

/**
 * POST /api/ml/retrain — Pipeline retraining ML
 *
 * 1. Export dataset dari DB → CSV
 * 2. Run preprocessing.py
 * 3. Run train.py
 * 4. Copy model ke ml-serving
 * 5. Reload model di FastAPI
 */
export async function POST() {
  try {
    const steps: string[] = [];

    // ─── Step 1: Export dataset ───
    const details = await prisma.detailTransaksi.findMany({
      select: {
        berat_kg: true,
        transaksi: { select: { tanggal: true } },
        jenis_sampah: { select: { nama_jenis: true, densitas_kg_per_m3: true, satuan: true, berat_per_pcs: true } },
      },
      orderBy: { transaksi: { tanggal: "asc" as const } },
    });

    if (details.length < 14) {
      return errorResponse(`Data tidak cukup: butuh minimal 14 transaksi, saat ini ${details.length}`, 400);
    }

    const csvRows = details.map((d) => {
      const isPcs = d.jenis_sampah?.satuan === "pcs";
      const beratKg = isPcs ? d.berat_kg * (d.jenis_sampah?.berat_per_pcs || 0) : d.berat_kg;
      return {
        tanggal: d.transaksi.tanggal ? new Date(d.transaksi.tanggal).toISOString().split("T")[0] : "",
        jenis_sampah: d.jenis_sampah?.nama_jenis || "",
        berat_kg: Number(beratKg.toFixed(2)),
        densitas_kg_m3: Number((d.jenis_sampah?.densitas_kg_per_m3 || 0).toFixed(2)),
      };
    });

    const headers = Object.keys(csvRows[0]).join(",");
    const csvContent = [headers, ...csvRows.map((r) => Object.values(r).join(","))].join("\n");

    fs.mkdirSync(path.dirname(RAW_CSV), { recursive: true });
    fs.writeFileSync(RAW_CSV, csvContent, "utf-8");
    steps.push(`✅ Dataset: ${csvRows.length} baris → ${RAW_CSV}`);

    // ─── Step 2: Preprocessing ───
    const preprocessScript = path.join(ML_BUILD, "src", "preprocessing.py");
    execSync(`python3 "${preprocessScript}"`, { cwd: path.join(ML_BUILD, "src"), timeout: 60000 });
    steps.push("✅ Preprocessing selesai");

    // ─── Step 3: Training ───
    const trainScript = path.join(ML_BUILD, "src", "train.py");
    const trainOutput = execSync(`python3 "${trainScript}"`, {
      cwd: path.join(ML_BUILD, "src"),
      timeout: 120000,
      encoding: "utf-8",
    });

    // Parse metrics dari output training
    const maeMatch = trainOutput.match(/MAE\s*:\s*([\d.]+)/);
    const rmseMatch = trainOutput.match(/RMSE\s*:\s*([\d.]+)/);
    const mapeMatch = trainOutput.match(/MAPE\s*:\s*([\d.]+)/);
    const r2Match = trainOutput.match(/R²\s*:\s*([\d.]+)/);

    steps.push("✅ Training selesai");

    // ─── Step 4: Copy model ───
    if (fs.existsSync(MODEL_SRC)) {
      fs.mkdirSync(path.dirname(MODEL_DST), { recursive: true });
      fs.copyFileSync(MODEL_SRC, MODEL_DST);
      steps.push(`✅ Model tersimpan di ${MODEL_DST}`);
    } else {
      return errorResponse("Model tidak ditemukan setelah training", 500);
    }

    // ─── Step 5: Reload ML server ───
    try {
      const reloadRes = await fetch(`${ML_SERVER_URL}/api/v1/admin/reload-model`, {
        method: "POST",
        signal: AbortSignal.timeout(5000),
      });
      if (reloadRes.ok) {
        steps.push("✅ ML server reloaded");
      } else {
        steps.push("⚠️ Gagal reload ML server (manual restart mungkin diperlukan)");
      }
    } catch {
      steps.push("⚠️ ML server tidak merespon — model tersimpan, restart manual diperlukan");
    }

    return successResponse(
      {
        steps,
        metrics: {
          mae: maeMatch ? parseFloat(maeMatch[1]) : null,
          rmse: rmseMatch ? parseFloat(rmseMatch[1]) : null,
          mape: mapeMatch ? parseFloat(mapeMatch[1]) : null,
          r2: r2Match ? parseFloat(r2Match[1]) : null,
        },
        total_samples: csvRows.length,
      },
      "Retraining berhasil",
      200
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return errorResponse(`Retraining gagal: ${msg}`, 500);
  }
}
