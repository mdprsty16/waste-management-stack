# Waste Management Stack (Bank Sampah Sampul Berkasih)

> **Organisasi:** IKMP, Kuningan, Jawa Barat

Sistem manajemen bank sampah digital berbasis web dengan fitur prediksi volume sampah menggunakan **Random Forest Regressor**. Platform ini digunakan untuk mencatat setoran nasabah, mengelola kategori/jenis sampah, memantau kapasitas gudang, dan memprediksi kapan gudang akan penuh.

---

## Fitur Utama

- **Landing Page** — Splash screen, hero, statistik, fitur, dan kategori sampah
- **Dashboard** — Statistik real-time, grafik distribusi kategori & tren mingguan, prediksi kapasitas gudang
- **Manajemen CRUD** — Nasabah, Kategori Sampah, Jenis Sampah, Transaksi, Pengangkutan
- **Prediksi ML** — Prediksi tren mingguan (Linear Regression) & prediksi batas kapasitas gudang (Random Forest)
- **Autentikasi Admin** — Login JWT
- **Dokumentasi API** — Swagger UI di `/api-docs`
- **Cetak Laporan CSV**
- **Integrasi WhatsApp** — Kontak nasabah

---

## Tech Stack

### Website (Next.js — Frontend & API)
| Teknologi | Versi | Kegunaan |
|---|---|---|
| Next.js | 16.2.6 | App Router, SSR, API routes |
| React | 19.2.4 | UI library |
| TypeScript | ^5.9 | Type safety |
| Tailwind CSS | v4 | Utility CSS |
| Prisma | ^7.8 | ORM |
| MariaDB | ^3.5 | Database driver |
| TanStack React Query | ^5.101 | Server state management |
| Zod | ^4.4 | Validasi skema |
| Jose | ^6.2 | JWT |
| Bcrypt | ^6.0 | Hashing password |

### ML Serving (FastAPI — Inference)
| Teknologi | Kegunaan |
|---|---|
| Python 3.11+ | Runtime |
| FastAPI | REST API |
| Scikit-learn | Random Forest model |
| Pandas | Data processing |
| Joblib | Model persistence |

### ML Build (Training Pipeline)
| Teknologi | Kegunaan |
|---|---|
| Python | Scripting |
| Pandas, NumPy | Data processing |
| Scikit-learn | Random Forest Regressor + hyperparameter tuning |
| Joblib | Model serialization |

### Infrastruktur
Docker, Docker Compose, GitHub Actions (CI/CD), GHCR, Traefik, Aiven Cloud (MariaDB)

---

## Struktur Direktori

```
waste-management-stack/
├── apps/
│   ├── website/           # Next.js full-stack (frontend + API)
│   │   ├── app/           # App Router pages & API routes
│   │   ├── components/    # UI components
│   │   ├── hooks/         # React Query hooks
│   │   ├── services/      # API client services
│   │   ├── prisma/        # Schema & migrations
│   │   └── .env           # Environment variables
│   ├── ml-serving/        # FastAPI inference service
│   │   ├── app/           # main.py, schemas, services
│   │   ├── models/        # Trained model (.pkl)
│   │   └── requirements.txt
│   └── ml-build/          # ML training pipeline
│       ├── data/          # Dataset (raw & processed)
│       ├── model/         # Trained model output
│       ├── notebooks/     # EDA & experiment notebooks
│       └── src/           # preprocessing.py & train.py
├── .github/workflows/     # CI/CD pipeline
└── VPS_PREPARATION.md     # Panduan deploy VPS
```

---

## Persyaratan Sistem

- **Node.js** >= 20
- **Bun** (atau npm/pnpm)
- **Python** >= 3.11
- **MariaDB** / MySQL (atau koneksi ke Aiven Cloud)
- **Docker** (opsional, untuk deployment)

---

## Setup Environment

### 1. Clone Repository

```bash
git clone https://github.com/mdprsty16/waste-management-stack.git
cd waste-management-stack
```

### 2. Setup Website (Next.js)

```bash
cd apps/website

# Salin environment variables (atau gunakan .env yang sudah ada)
cp .env.example .env  # jika tersedia

# Install dependencies
npm install
# atau
bun install

# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push

# (Opsional) Seed data awal
npx tsx prisma/seed.ts
```

**Konfigurasi `.env`:**

```env
DATABASE_URL="mysql://user:password@host:port/db_name?ssl-mode=REQUIRED"
DATABASE_USER="user"
DATABASE_PASSWORD="password"
DATABASE_NAME="db_name"
DATABASE_HOST="host"
DATABASE_PORT=3306

JWT_SECRET="your-jwt-secret-key"

ML_SERVER_URL="http://127.0.0.1:8000"
```

### 3. Setup ML Serving (FastAPI)

```bash
cd apps/ml-serving

# Buat virtual environment (opsional)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy model dari ml-build (jika belum ada)
cp ../ml-build/model/rf_waste_model.pkl models/
```

### 4. Setup ML Build (Training — Opsional)

```bash
cd apps/ml-build

# Install dependencies
pip install pandas numpy scikit-learn joblib

# Preprocessing data
python3 src/preprocessing.py

# Training model
python3 src/train.py

# Copy model ke ml-serving
cp model/rf_waste_model.pkl ../ml-serving/models/
```

---

## Model Machine Learning

### Tipe Model
**Random Forest Regressor** dengan hyperparameter tuning.

### Fitur (Features)
1. `monday_weekend_interaction` — Interaksi hari Senin dengan volume kemarin
2. `lag_10d` — Volume 10 hari lalu (long-term memory)
3. `volume_acceleration` — Rasio `lag_1d` / `rolling_3d` (momentum)
4. `is_friday` — Indikator hari Jumat

### Target
`log_volume_m3` — Volume sampah harian (log-transformed)

### Download Model
- **Google Drive:** [Download Model ML](https://drive.google.com/drive/folders/15tcjEbxuLsF_4ZsbjBl-4YLDXEBno2Yx?usp=sharing)

### Output
- **Model file:** `apps/ml-build/model/rf_waste_model.pkl`
- **Serving copy:** `apps/ml-serving/models/rf_waste_model.pkl`

### Endpoint ML API (FastAPI — port 8000)

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/v1/predict/threshold-dss` | Prediksi batas kapasitas gudang (recursive forecast) |
| POST | `/api/v1/predict/weekly` | Prediksi tren mingguan |
| POST | `/api/v1/admin/reload-model` | Reload model tanpa restart |

### Retraining Pipeline
`POST /api/ml/retrain` (melalui Next.js API) akan:
1. Ekspor dataset dari database
2. Jalankan `preprocessing.py`
3. Jalankan `train.py`
4. Copy model ke `ml-serving/models/`
5. Panggil reload endpoint ML server

---

## Cara Menjalankan Aplikasi

### Development (Local)

**Terminal 1 — Website:**
```bash
cd apps/website
npm run dev
# → http://localhost:4500
```

**Terminal 2 — ML Serving:**
```bash
cd apps/ml-serving
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# → http://localhost:8000
```

### Production (Docker)

```bash
# Build & jalankan semua service
docker compose up -d

# Atau build manual:
docker build -t waste-management-website apps/website
docker build -t waste-management-ml-serving apps/ml-serving
```

### Dokumentasi API
- **Swagger UI:** `http://localhost:4500/api-docs`

---

## Deployment

Lihat [VPS_PREPARATION.md](./VPS_PREPARATION.md) untuk panduan deployment lengkap ke VPS menggunakan Docker + Traefik + GitHub Actions.

---

## Lisensi

Hak cipta © 2026 IKMP, Kuningan. Seluruh hak dilindungi.
