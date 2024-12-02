from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from scipy.fft import fft, fftfreq


app = FastAPI()


class SignalData(BaseModel):
    accelerometer: list[dict]  

def unbiased_autocorrelation_normalized(signal):
    N = len(signal)
    autocorr = np.correlate(signal, signal, mode='full')  
    lags = np.arange(-N + 1, N)
    normalization = np.array([N - abs(lag) for lag in lags])  
    unbiased_autocorr = autocorr / normalization
    unbiased_autocorr_normalized = unbiased_autocorr / unbiased_autocorr[N - 1]  
    return lags, unbiased_autocorr_normalized

# Endpoint
@app.post("/analyze_signal/")
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
