from pydantic import BaseModel, Field
from typing import List
from datetime import date

# Format data mentah dari transaksi historis
class TransactionItem(BaseModel):
    tanggal: date
    berat_kg: float
    densitas_kg_m3: float
    volume_m3: float = 0.0

# Format Request yang kita terima dari Next.js
class PredictRequest(BaseModel):
    threshold_m3: float = Field(..., gt=0, description="Kapasitas maksimal gudang dalam m3")
    current_fill_m3: float = Field(..., ge=0, description="Volume saat ini di dalam gudang dalam m3")
    raw_transactions: List[TransactionItem] = Field(..., description="Data transaksi historis minimal 14 hari")

# Format untuk langkah-langkah ramalan di JSON Response
class ForecastStep(BaseModel):
    hari: str
    tanggal: str
    prediksi_masuk_m3: float
    akumulasi_total_m3: float

# Format Response yang kita kembalikan ke Next.js
class PredictResponse(BaseModel):
    status: str
    current_fill_m3: float
    threshold_m3: float
    days_until_threshold: int
    estimated_full_date: str
    recommendation: str
    forecast_simulation_steps: List[ForecastStep]

class WeeklyPredictRequest(BaseModel):
    tren_mingguan: List[float]

class WeeklyPredictResponse(BaseModel):
    predicted_kg: float
    is_alert: bool
    pesan: str
