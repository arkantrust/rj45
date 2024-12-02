from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from scipy.fft import fft, fftfreq  

from models import SignalData
# from auth.auth import router as auth_router
# from auth.auth import get_current_user


app = FastAPI()
# app.include_router(auth_router)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:8080",
    '*'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Reroute / to /docs because this app doesn't have a frontend here.
@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

@app.post("/")
def get_analytics():
    return "Hello, Analytics!"


def unbiased_autocorrelation_normalized(signal):
    N = len(signal)
    autocorr = np.correlate(signal, signal, mode='full')  
    lags = np.arange(-N + 1, N)
    normalization = np.array([N - abs(lag) for lag in lags])  
    unbiased_autocorr = autocorr / normalization
    unbiased_autocorr_normalized = unbiased_autocorr / unbiased_autocorr[N - 1]  
    return lags, unbiased_autocorr_normalized

# Endpoint
@app.post("/analysis")
def analyze_signal(data: SignalData):
    try:
        accelerometer_data = data.accelerometer
        timestamps = np.array([point["timestamp"] for point in accelerometer_data])
        magnitudes = np.array([point["x"] for point in accelerometer_data])

        
        time = timestamps - np.min(timestamps)  
        
        # Remover componente de DC
        detrended_magnitudes = magnitudes - np.mean(magnitudes)
        
        # Calcular FFT
        n = len(detrended_magnitudes)
        frequencies = fftfreq(n, (time[1] - time[0]))
        fft_values = fft(detrended_magnitudes)
        
        
        positive_freqs = frequencies[:n // 2]
        positive_fft_values = np.abs(fft_values[:n // 2])
        
        # Energia total
        energy_total = np.sum(positive_fft_values**2)
        
        # Rangos de frecuencia activa
        cumulative_energy = np.cumsum(positive_fft_values**2)
        threshold = 0.9 * energy_total
        min_freq = positive_freqs[np.where(cumulative_energy >= 0.05 * energy_total)[0][0]]
        max_freq = positive_freqs[np.where(cumulative_energy >= threshold)[0][0]]
        
        # Unbiased Autocorrelation
        lags, autocorr_normalized = unbiased_autocorrelation_normalized(detrended_magnitudes)
        
    
        positive_lags = lags[lags >= 0]
        positive_autocorr = autocorr_normalized[lags >= 0]
        
        # Retorna el JSON
        return {
            "fft": {
                "frequencies": positive_freqs.tolist(),
                "magnitudes": positive_fft_values.tolist()
            },
            "autocorrelation": {
                "lags": positive_lags.tolist(),
                "values": positive_autocorr.tolist()
            },
            "indicators": {
                "total_energy": energy_total,
                "min_frequency": min_freq,
                "max_frequency": max_freq
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing signal: {e}")
