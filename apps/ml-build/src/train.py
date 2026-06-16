# ridge_modelling.py

import pandas as pd
import numpy as np
import os

from sklearn.linear_model import Ridge
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
# FEATURE ENGINEERING
# =====================================================

df["lag_1d"] = df["log_volume_m3"].shift(1)

df["lag_3d"] = df["log_volume_m3"].shift(3)

df["rolling_3d"] = (
    df["log_volume_m3"]
    .shift(1)
    .rolling(3)
    .mean()
)

df["nama_hari"] = df["tanggal"].dt.day_name()

df["is_saturday"] = (
    df["nama_hari"] == "Saturday"
).astype(int)

df["is_low_traffic"] = (
    df["nama_hari"]
    .isin(["Wednesday", "Friday"])
).astype(int)

df["lag_6d"] = (
    df["volume_m3"]
    .shift(6)
)

df["lag_9d"] = (
    df["volume_m3"]
    .shift(9)
)

df["ewm_3d"] = (
    df["volume_m3"]
    .shift(1)
    .ewm(span=3)
    .mean()
)

df_model = df.dropna().reset_index(drop=True)


# =====================================================
# FEATURE SELECTION
# =====================================================

FEATURES = [
    "is_monday",
    "is_saturday",
    "is_low_traffic",
    "lag_6d",
    "lag_9d",
    "ewm_3d",
]

X = df_model[FEATURES]

y_log = df_model["log_volume_m3"]

y_actual = df_model["volume_m3"]


# =====================================================
# TIME SERIES SPLIT
# =====================================================

TEST_SIZE = 6

split_idx = len(df_model) - TEST_SIZE

X_train = X.iloc[:split_idx]
X_test = X.iloc[split_idx:]

y_train = y_log.iloc[:split_idx]
y_test_actual = y_actual.iloc[split_idx:]


# =====================================================
# HYPERPARAMETER TUNING
# =====================================================

candidate_alphas = [
    10,
    1,
    0.1,
    0.01,
    0.001,
]

best_model = None
best_alpha = None
best_mae = float("inf")

print("\n=== Hyperparameter Tuning Ridge ===")

for alpha in candidate_alphas:

    model = Ridge(alpha=alpha)

    model.fit(
        X_train,
        y_train
    )

    y_pred_log = model.predict(X_test)

    y_pred = np.expm1(y_pred_log)

    mae = mean_absolute_error(
        y_test_actual,
        y_pred
    )

    print(
        f"alpha={alpha:<8} "
        f"MAE={mae:.4f}"
    )

    if mae < best_mae:
        best_mae = mae
        best_alpha = alpha
        best_model = model

print("\n=== Best Hyperparameter ===")
print(f"Alpha terbaik : {best_alpha}")
print(f"MAE terbaik   : {best_mae:.4f}")

model = best_model

print("\nTraining final selesai.")


# =====================================================
# PREDICTION
# =====================================================

y_pred_log = model.predict(X_test)

y_pred = np.expm1(y_pred_log)


# =====================================================
# EVALUATION
# =====================================================

mae = mean_absolute_error(
    y_test_actual,
    y_pred
)

mse = mean_squared_error(
    y_test_actual,
    y_pred
)

rmse = np.sqrt(mse)

mape = (
    mean_absolute_percentage_error(
        y_test_actual,
        y_pred
    )
    * 100
)

r2 = r2_score(
    y_test_actual,
    y_pred
)

print("\n=== RIDGE REGRESSION (BEST MODEL) ===")
print(f"Alpha : {best_alpha}")
print(f"MAE   : {mae:.4f}")
print(f"RMSE  : {rmse:.4f}")
print(f"MAPE  : {mape:.2f}%")
print(f"R²    : {r2:.4f}")


# =====================================================
# SAVE MODEL
# =====================================================

MODEL_PATH = "../model/ridge_waste_model.pkl"

os.makedirs(
    os.path.dirname(MODEL_PATH),
    exist_ok=True
)

dump(
    model,
    MODEL_PATH
)

print("\n=== Model Saved ===")
print(f"Best Alpha : {best_alpha}")
print(f"Path       : {MODEL_PATH}")