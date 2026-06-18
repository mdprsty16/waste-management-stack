import os
import joblib
from fastapi import FastAPI, HTTPException
from app.schemas import PredictRequest, PredictResponse, WeeklyPredictRequest, WeeklyPredictResponse
from app.services import run_recursive_forecast, load_model

app = FastAPI(
    title="Waste Management ML Engine",
    description="Microservice Python untuk Sistem Pendukung Keputusan",
    version="1.0.0"
)

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "rf_waste_model.pkl")

# Endpoint Pengecekan server hidup atau mati
@app.get("/")
def root():
    return {"status": "ok", "message": "ML FastAPI is running!"}

# Endpoint Utama untuk dipanggil oleh Next.js
@app.post("/api/v1/predict/threshold-dss", response_model=PredictResponse)
def predict_threshold(request: PredictRequest):
    try:
        # Kirim data request dari web ke otak layanan (services)
        result = run_recursive_forecast(
            threshold_m3=request.threshold_m3,
            current_fill_m3=request.current_fill_m3,
            raw_transactions=request.raw_transactions
        )
        return result
    except Exception as e:
        # Kembalikan HTTP 500 kalau ada Error Data Processing
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/predict/weekly", response_model=WeeklyPredictResponse)
def predict_weekly(request: WeeklyPredictRequest):
    try:
        from app.services import run_weekly_forecast
        result = run_weekly_forecast(tren_mingguan=request.tren_mingguan)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint untuk reload model tanpa restart server
# Dipanggil oleh Next.js setelah retraining selesai
@app.post("/api/v1/admin/reload-model")
def reload_model():
    global model
    try:
        model = load_model()
        return {"status": "ok", "message": "Model berhasil di-reload", "path": MODEL_PATH}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
