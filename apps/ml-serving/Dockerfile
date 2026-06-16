# =========================================================================
# ML Serving — FastAPI untuk prediksi threshold & weekly trend
# =========================================================================
FROM python:3.11-slim

WORKDIR /app

# Install dependencies + curl untuk healthcheck
RUN apt-get update -qq && apt-get install -y -qq curl && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY app/ ./app/
COPY models/ ./models/

# Expose port
EXPOSE 8000

# Run FastAPI dengan uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
