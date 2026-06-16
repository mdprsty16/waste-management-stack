# Persiapan VPS Azure — Deployment Waste Management Stack

> Dokumen ini berisi langkah-langkah yang perlu dilakukan di VPS Azure
> sebelum menjalankan deployment otomatis via GitHub Actions.

---

## Persyaratan VPS

| Komponen | Spesifikasi Minimal | Rekomendasi |
|----------|-------------------|-------------|
| CPU | 2 core | 4 core |
| RAM | 4 GB | 8 GB |
| Storage | 20 GB | 40 GB |
| OS | Ubuntu 22.04+ | Ubuntu 24.04 |
| Docker | v24+ | v27+ |

---

## 1. Install Docker & Docker Compose

```bash
# Update paket
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Tambah user ke group docker (biar gak perlu sudo)
sudo usermod -aG docker $USER

# Logout dan login lagi (atau jalankan: newgrp docker)
exit
# SSH lagi
```

Verifikasi:
```bash
docker --version
docker compose version
```

---

## 2. Setup Traefik (Reverse Proxy)

> Traefik akan menangani SSL (Let's Encrypt) dan routing domain.

### 2a. Buat network untuk Traefik
```bash
docker network create traefik-net
```

### 2b. Buat folder dan file konfigurasi Traefik
```bash
mkdir -p ~/traefik && cd ~/traefik
```

**File: `~/traefik/docker-compose.yml`**
```yaml
services:
  traefik:
    image: traefik:v3.1
    container_name: traefik
    restart: unless-stopped
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.websecure.address=:443"
      - "--entrypoints.web.address=:80"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=email-anda@gmail.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    networks:
      - traefik-net

networks:
  traefik-net:
    external: true
```

Jalankan:
```bash
docker compose up -d
```

---

## 3. Setup Folder Proyek

```bash
mkdir -p ~/waste-management && cd ~/waste-management
```

### 3a. Buat file `.env`
Copy isi dari `apps/website/.env` dan **sesuaikan untuk production**:

```env
# Database — Aiven Cloud (sudah terisi)
DATABASE_URL="mysql://avnadmin:password@host:21462/db_waste?ssl-mode=REQUIRED"
DATABASE_USER="avnadmin"
DATABASE_PASSWORD="password"
DATABASE_NAME="db_waste"
DATABASE_HOST="host.aivencloud.com"
DATABASE_PORT=21462

# JWT — ganti dengan secret random yang kuat
JWT_SECRET="generate-pakai-atau-pakai-yang-ada"

# ML Server URL → pake nama service docker-compose
ML_SERVER_URL="http://ml-serving:8000"
```

> **Catatan:** `ML_SERVER_URL` pakai `http://ml-serving:8000` karena docker-compose
> akan menjalankan ml-serving di network internal. Bukan `127.0.0.1`.

### 3b. Copy `docker-compose.yml`

```bash
# Dari repo, copy docker-compose.yml ke folder VPS
# Bisa via git clone atau scp
```

Atau git clone langsung di VPS:
```bash
cd ~
git clone https://github.com/mdprsty16/waste-management-stack.git waste-management
cd waste-management
```

---

## 4. Persiapan Image di GitHub Container Registry (GHCR)

GitHub Actions akan build & push image ke GHCR secara otomatis setiap push ke branch `master`.

Pastikan di VPS bisa login ke GHCR:
```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u mdprsty16 --password-stdin
```

> `GITHUB_TOKEN` diambil dari Secrets GitHub (sudah diatur di deploy.yml).

---

## 5. Jalankan Semua Service

### Pertama kali:
```bash
cd ~/waste-management

# Tarik image
docker compose pull

# Jalankan semua service
docker compose up -d

# Cek status
docker compose ps
```

### Cek apakah berjalan:
```bash
# Website
curl -f http://localhost:4500

# ML Serving
curl -f http://localhost:8000

# Test ML prediction
curl -X POST http://localhost:8000/api/v1/predict/weekly \
  -H "Content-Type: application/json" \
  -d '{"tren_mingguan": [100, 120, 110, 130]}'
```

---

## 6. Konfigurasi Domain di Traefik

Tambahkan label Traefik di service `website` pada `docker-compose.yml`:

```yaml
services:
  website:
    # ... konfigurasi lain ...
    networks:
      - traefik-net    # Tambahkan network Traefik
      - bssb-net
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.bssb.rule=Host(`domain-anda.com`)"
      - "traefik.http.routers.bssb.tls=true"
      - "traefik.http.routers.bssb.tls.certresolver=letsencrypt"
      - "traefik.http.services.bssb.loadbalancer.server.port=3000"
```

Jangan lupa add Traefik network ke service:
```yaml
networks:
  traefik-net:
    external: true
  bssb-net:
    driver: bridge
```

Restart:
```bash
docker compose up -d
```

---

## 7. Setup Cron untuk Retraining ML Otomatis

Agar model ML tetap update, jadwalkan retraining setiap bulan:

```bash
crontab -e
```

Tambahkan:
```cron
# Retraining ML setiap tanggal 1 jam 02:00
0 2 1 * * curl -X POST http://localhost:3000/api/ml/retrain >> ~/logs/retrain.log 2>&1
```

Buat folder log:
```bash
mkdir -p ~/logs
```

---

## 8. Verifikasi Semua Berfungsi

### Dashboard:
```
https://domain-anda.com/dashboard
```
→ Harus tampil semua data: ringkasan, kapasitas, grafik, transaksi.

### ML Threshold Prediction:
Buka dashboard → kartu "Kapasitas Gudang" harus muncul estimasi hari penuh.

### Retrain:
```bash
curl -X POST https://domain-anda.com/api/ml/retrain
```
→ Response success + metrics MAE/RMSE/MAPE/R².

---

## Troubleshooting

### Website error 500 — Database connection
```bash
# Cek log website
docker compose logs website

# Pastikan .env DATABASE_URL benar dan VPS bisa konek ke Aiven:
curl -I mysql://avnadmin:password@host:21462
```

### ML Serving tidak merespon
```bash
docker compose logs ml-serving
# Cek apakah model terload:
# Output harus: "Model ML berhasil diload!"
```

### Traefik SSL error
```bash
docker compose -f ~/traefik/docker-compose.yml logs
# Pastikan domain pointing ke IP VPS
```

### Retrain gagal
```bash
# Coba manual di VPS:
curl -X POST http://localhost:3000/api/ml/retrain

# Pastikan Python dependencies terinstall di container ml-serving:
# Sudah otomatis via Dockerfile
```
