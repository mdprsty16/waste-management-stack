import os
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_absolute_percentage_error,
    mean_squared_error,
    r2_score,
)

from joblib import dump

# =====================================================
# LOAD DATA
# =====================================================

DATASET_PATH = "../data/processed/processed_waste_dataset.csv"

df = pd.read_csv(DATASET_PATH)

df["tanggal"] = pd.to_datetime(df["tanggal"])

df = df.sort_values("tanggal").reset_index(drop=True)


# =====================================================
# FEATURE ENGINEERING (4 FITUR UTAMA SIKLUS 6 HARI)
# =====================================================

df["nama_hari"] = df["tanggal"].dt.day_name()

# 1. Fitur Kalender Biner
df["is_monday"] = (df["nama_hari"] == "Monday").astype(int)
df["is_friday"] = (df["nama_hari"] == "Friday").astype(int)

# 2. Fitur Historis Jangka Pendek (Skala Asli untuk Interaksi & Momentum)
df["lag_1d"] = df["volume_m3"].shift(1)
df["rolling_3d"] = df["lag_1d"].rolling(window=3).mean()

# 3. Fitur Interaksi Lonjakan Senin
df["monday_weekend_interaction"] = df["is_monday"] * df["lag_1d"]

# 4. Fitur Momentum Akselerasi Volume
df["volume_acceleration"] = df["lag_1d"] / (df["rolling_3d"] + 1e-5)

# 5. Fitur Memori Historis Jangka Panjang
df["lag_10d"] = df["volume_m3"].shift(10)

# Bersihkan Baris yang Memiliki Nilai Kosong Akibat Shift Jauh (Lag 10)
df_model = df.dropna().reset_index(drop=True)


# =====================================================
# FEATURE SELECTION
# =====================================================

FEATURES = [
    "monday_weekend_interaction",  
    "lag_10d",                     
    "volume_acceleration",       
    "is_friday",                  
]

X = df_model[FEATURES]

# Target Log untuk Pelatihan, Target Aktual untuk Evaluasi Nyata
y_log = df_model["log_volume_m3"]
y_actual = df_model["volume_m3"]


# =====================================================
# TIME SERIES SPLIT (SIKLUS VALID 6 HARI)
# =====================================================

TEST_SIZE = 6

split_idx = len(df_model) - TEST_SIZE

X_train = X.iloc[:split_idx]
X_test = X.iloc[split_idx:]

y_train_log = y_log.iloc[:split_idx]
y_train_actual = y_actual.iloc[:split_idx]
y_test_actual = y_actual.iloc[split_idx:]


# =====================================================
# HYPERPARAMETER TUNING (PASUKAN ANTI-OVERFITTING)
# =====================================================

# Kandidat kombinasi parameter pembatas pertumbuhan pohon
candidate_params = [
    {"max_depth": 3, "min_samples_split": 2, "min_samples_leaf": 1},
    {"max_depth": 3, "min_samples_split": 4, "min_samples_leaf": 2},
    {"max_depth": 4, "min_samples_split": 2, "min_samples_leaf": 1},
    {"max_depth": 4, "min_samples_split": 4, "min_samples_leaf": 2},
    {"max_depth": None, "min_samples_split": 2, "min_samples_leaf": 1}, # Bawaan default
]

best_model = None
best_params = None
best_mae = float("inf")

print("\n=== Hyperparameter Tuning Random Forest ===")

for params in candidate_params:

    model = RandomForestRegressor(
        n_estimators=100, 
        random_state=42, 
        **params
    )

    model.fit(X_train, y_train_log)

    y_pred_log = model.predict(X_test)
    y_pred = np.expm1(y_pred_log)

    mae = mean_absolute_error(y_test_actual, y_pred)

    print(
        f"max_depth={str(params['max_depth']):<5} "
        f"split={params['min_samples_split']} "
        f"leaf={params['min_samples_leaf']} | "
        f"Test MAE={mae:.4f}"
    )

    if mae < best_mae:
        best_mae = mae
        best_params = params
        best_model = model

print("\n=== Best Hyperparameter ===")
print(f"Parameter terbaik : {best_params}")
print(f"MAE Test terbaik  : {best_mae:.4f}")

model = best_model

print("\nTraining final selesai.")


# =====================================================
# PREDICTION & DIAGNOSIS OVERFITTING
# =====================================================

# Prediksi Data Training (Hafalan Model)
y_train_pred_log = model.predict(X_train)
y_train_pred = np.expm1(y_train_pred_log)

# Prediksi Data Testing (Generalisasi Model)
y_pred_log = model.predict(X_test)
y_pred = np.expm1(y_pred_log)


# =====================================================
# EVALUATION (DIAGNOSIS TRAIN VS TEST BERSAMA)
# =====================================================

# Metrik Evaluasi Data Training
mae_train = mean_absolute_error(y_train_actual, y_train_pred)
r2_train = r2_score(y_train_actual, y_train_pred)

# Metrik Evaluasi Data Testing
mae_test = mean_absolute_error(y_test_actual, y_pred)
mse_test = mean_squared_error(y_test_actual, y_pred)
rmse_test = np.sqrt(mse_test)
mape_test = mean_absolute_percentage_error(y_test_actual, y_pred) * 100
r2_test = r2_score(y_test_actual, y_pred)

print("\n=== RANDOM FOREST REGRESSOR EVALUATION ===")
print(f"Best Config : {best_params}")
print("-" * 42)
print(f"Train MAE   : {mae_train:.4f}")
print(f"Test MAE    : {mae_test:.4f} (m³)")
print("-" * 42)
print(f"Train R²    : {r2_train:.4f}")
print(f"Test R²     : {r2_test:.4f}")
print("-" * 42)
print(f"Test RMSE   : {rmse_test:.4f} (m³)")
print(f"Test MAPE   : {mape_test:.2f}%")


# =====================================================
# SAVE MODEL
# =====================================================

MODEL_PATH = "../model/rf_waste_model.pkl"

os.makedirs(
    os.path.dirname(MODEL_PATH),
    exist_ok=True
)

dump(
    model,
    MODEL_PATH
)

print("\n=== Model Saved ===")
print(f"Path       : {MODEL_PATH}")