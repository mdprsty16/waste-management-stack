import pandas as pd
import numpy as np
import joblib
from datetime import timedelta
import os

# Ini mendeteksi lokasi file .pkl di folder /models
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "ridge_waste_model.pkl")

def load_model():
    """Load atau reload model dari disk. Dipanggil saat start & reload."""
    global model
    try:
        model = joblib.load(MODEL_PATH)
        print("Model ML berhasil diload!")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
        return None

# Memuat model saat aplikasi pertama kali di-start
model = load_model()

def run_recursive_forecast(threshold_m3: float, current_fill_m3: float, raw_transactions: list):
    """
    Menjalankan algoritma recursive forecasting berdasarkan dokumen arsitektur BSSB
    """
    if not model:
        raise Exception("Model ML belum diload atau file .pkl tidak ditemukan!")

    # 1. Konversi data JSON input ke DataFrame Pandas
    df_raw = pd.DataFrame([t.model_dump() for t in raw_transactions])
    
    # 2. Hitung volume riil = berat / densitas
    df_raw['volume_m3'] = df_raw['berat_kg'] / df_raw['densitas_kg_m3']
    
    # Buang outlier aneh (misal transaksi lebih dari 10m3) sesuai detail.txt
    df_raw = df_raw[df_raw['volume_m3'] <= 10]
    
    # 3. Agregasi Harian (jumlahkan semua volume di hari yang sama)
    df_raw['tanggal'] = pd.to_datetime(df_raw['tanggal'])
    df_daily = df_raw.groupby('tanggal')['volume_m3'].sum().reset_index()
    df_daily = df_daily.sort_values('tanggal').reset_index(drop=True)
    
    # ═══════════════════════════════════════════════════════════
    # PREPROCESSING SYNC: Merge Sunday → Monday (sama seperti training)
    # Model dilatih dengan data Minggu tergabung ke Senin,
    # maka inference harus melakukan hal yang sama.
    # ═══════════════════════════════════════════════════════════
    is_sunday = df_daily['tanggal'].dt.dayofweek == 6
    df_daily.loc[is_sunday, 'tanggal'] = df_daily.loc[is_sunday, 'tanggal'] + pd.Timedelta(days=1)
    df_daily = df_daily.groupby('tanggal')['volume_m3'].sum().reset_index()
    df_daily = df_daily.sort_values('tanggal').reset_index(drop=True)
    
    # Tambahkan fitur transformasi dasar logaritmik (Log)
    df_daily['log_volume_m3'] = np.log1p(df_daily['volume_m3'])
    
    last_date = df_daily['tanggal'].max()
    
    # Set tracker penampungan (berapa meter kubik sampah sekarang)
    total_accum_m3 = current_fill_m3
    days_count = 0
    forecast_steps = []
    current_df = df_daily.copy()
    
    # Simulasi maju (Loop), berhenti jika penuh atau maksimal 30 hari prediksi
    while total_accum_m3 < threshold_m3 and days_count < 30:
        days_count += 1
        new_date = last_date + timedelta(days=days_count)
        
        # Ekstraksi fitur kalender
        day_name = new_date.day_name()
        is_monday = 1 if day_name == 'Monday' else 0
        is_saturday = 1 if day_name == 'Saturday' else 0
        is_low_traffic = 1 if day_name in ['Wednesday', 'Friday'] else 0
        
        # Ekstraksi Fitur Lag (6 dan 9 hari ke belakang)
        vol_values = current_df['volume_m3'].values
        lag_6d = vol_values[-6] if len(vol_values) >= 6 else np.mean(vol_values)
        lag_9d = vol_values[-9] if len(vol_values) >= 9 else np.mean(vol_values)
        
        # EWM 3D (Exponential moving average) dari nilai log
        ewm_3d = current_df['log_volume_m3'].ewm(span=3, adjust=False).mean().iloc[-1]
        
        # Susun fitur persis sesuai urutan training Ridge (6 kolom)
        X_new = pd.DataFrame([{
            "is_monday": is_monday,
            "is_saturday": is_saturday,
            "is_low_traffic": is_low_traffic,
            "lag_6d": lag_6d,
            "lag_9d": lag_9d,
            "ewm_3d": ewm_3d
        }])
        
        # Prediksi nilai Log
        pred_log = model.predict(X_new)[0]
        
        # Inversi balik (Kembalikan log ke m3)
        pred_m3 = np.expm1(pred_log)
        pred_m3 = max(0.0, pred_m3) # Jangan sampai minus
            
        total_accum_m3 += pred_m3
        
        # Simpan jejak rekaman setiap harinya
        forecast_steps.append({
            "hari": f"T+{days_count}",
            "tanggal": new_date.strftime("%Y-%m-%d"),
            "prediksi_masuk_m3": round(pred_m3, 2),
            "akumulasi_total_m3": round(total_accum_m3, 2)
        })
        
        # Tambahkan hari esok (baris baru) ke keranjang agar lusa bisa membaca hari ini (Loop Recurrent)
        new_row = pd.DataFrame([{
            'tanggal': new_date,
            'volume_m3': pred_m3,
            'log_volume_m3': np.log1p(pred_m3)
        }])
        current_df = pd.concat([current_df, new_row], ignore_index=True)
        
    # Buat kalimat rekomendasi (DSS)
    if days_count <= 3:
        rek = f"KRITIS: Gudang penuh dalam {days_count} hari. Segera hubungi Pengepul hari ini juga!"
    elif days_count <= 7:
        rek = f"PERINGATAN: Gudang diprediksi penuh dalam {days_count} hari. Jadwalkan pengangkutan minggu ini."
    else:
        rek = f"AMAN: Kapasitas saat ini mencukupi untuk sekitar {days_count} hari operasional ke depan."
        
    return {
        "status": "success",
        "current_fill_m3": round(current_fill_m3, 2),
        "threshold_m3": round(threshold_m3, 2),
        "days_until_threshold": days_count,
        "estimated_full_date": (last_date + timedelta(days=days_count)).strftime("%Y-%m-%d"),
        "recommendation": rek,
        "forecast_simulation_steps": forecast_steps
    }

def run_weekly_forecast(tren_mingguan: list):
    """
    Prediksi tren mingguan menggunakan Simple Linear Regression
    """
    from sklearn.linear_model import LinearRegression
    
    if not tren_mingguan or len(tren_mingguan) == 0:
        return {"predicted_kg": 0.0, "is_alert": False, "pesan": "Data tidak cukup."}
        
    if len(tren_mingguan) == 1:
        pred = tren_mingguan[0] * 1.1 # Asumsi naik 10%
    else:
        # X adalah index minggu [0, 1, 2, ...]
        X = np.array(range(len(tren_mingguan))).reshape(-1, 1)
        y = np.array(tren_mingguan)
        
        lr = LinearRegression()
        lr.fit(X, y)
        
        # Prediksi minggu berikutnya (len(tren_mingguan))
        pred = lr.predict(np.array([[len(tren_mingguan)]]))[0]
        
    pred = max(0.0, float(pred))
    
    # Hitung rata-rata
    avg_kg = sum(tren_mingguan) / len(tren_mingguan)
    
    # Alert jika prediksi naik lebih dari 50% dari rata-rata
    is_alert = pred > avg_kg * 1.5
    
    if is_alert:
        pesan = f"Peringatan AI: Volume sampah minggu depan diprediksi melonjak ke {round(pred, 2)} Kg. Persiapkan armada lebih."
    else:
        pesan = f"Prediksi AI: Volume sampah stabil di sekitar {round(pred, 2)} Kg."
        
    return {
        "predicted_kg": round(pred, 2),
        "is_alert": bool(is_alert),
        "pesan": pesan
    }
