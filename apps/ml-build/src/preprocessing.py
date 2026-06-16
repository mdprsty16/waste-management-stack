# preprocess_waste_data.py

import pandas as pd
import numpy as np
import os


# =====================================================
# CONFIG
# =====================================================

INPUT_PATH = "../data/raw/dataset_modelling_waste.csv"

OUTPUT_DIR = "../data/processed"
OUTPUT_FILE = "processed_waste_dataset.csv"


# =====================================================
# LOAD DATA
# =====================================================

print("Loading dataset...")

df = pd.read_csv(INPUT_PATH)

df["tanggal"] = pd.to_datetime(df["tanggal"])


# =====================================================
# DATA CLEANING
# =====================================================

print("Cleaning data...")

# Hitung volume dari densitas
df["volume_m3"] = (
    df["berat_kg"] /
    df["densitas_kg_m3"]
)

# Hapus kolom densitas
df = df.drop(columns=["densitas_kg_m3"])

# Hapus outlier volume > 10 m3
df = df[df["volume_m3"] <= 10].copy()


# =====================================================
# AGREGASI HARIAN
# =====================================================

print("Creating daily dataset...")

df_daily = (
    df.groupby("tanggal")
    .agg({
        "berat_kg": "sum",
        "volume_m3": "sum"
    })
    .reset_index()
)

df_daily = (
    df_daily
    .sort_values("tanggal")
    .reset_index(drop=True)
)


# =====================================================
# MERGE DATA HARI MINGGU KE SENIN
# =====================================================

print("Merging Sunday transactions...")

is_sunday = (
    df_daily["tanggal"]
    .dt.dayofweek == 6
)

df_daily.loc[
    is_sunday,
    "tanggal"
] = (
    df_daily.loc[
        is_sunday,
        "tanggal"
    ]
    + pd.Timedelta(days=1)
)

df_processed = (
    df_daily
    .groupby("tanggal")
    .agg({
        "berat_kg": "sum",
        "volume_m3": "sum"
    })
    .reset_index()
)

df_processed = (
    df_processed
    .sort_values("tanggal")
    .reset_index(drop=True)
)


# =====================================================
# FEATURE ENGINEERING
# =====================================================

print("Creating features...")

df_processed["is_monday"] = (
    df_processed["tanggal"]
    .dt.dayofweek == 0
).astype(int)

df_processed["log_volume_m3"] = np.log1p(
    df_processed["volume_m3"]
)


# =====================================================
# FINAL DATASET
# =====================================================

final_columns = [
    "tanggal",
    "berat_kg",
    "volume_m3",
    "log_volume_m3",
    "is_monday"
]

df_final = df_processed[
    final_columns
]


# =====================================================
# SAVE DATASET
# =====================================================

os.makedirs(
    OUTPUT_DIR,
    exist_ok=True
)

output_path = os.path.join(
    OUTPUT_DIR,
    OUTPUT_FILE
)

df_final.to_csv(
    output_path,
    index=False
)

print("\nPreprocessing selesai")
print(f"Jumlah data: {len(df_final)}")
print(f"Output: {output_path}")