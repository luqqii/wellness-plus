from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np

# In a real environment, you'd load a pickled sklearn model
# e.g., model = joblib.load('recovery_model.pkl')

app = FastAPI(title="Wellness+ ML Microservice", version="1.0.0")

class MetricsInput(BaseModel):
    steps: int
    sleep_hours: float
    stress_level: int
    activity_intensity: int  # 1 to 10
    
class PredictionOutput(BaseModel):
    burnout_risk: str # Low, Medium, High
    recommended_recovery_hours: float
    confidence_score: float

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "wellness-ml-service"}

@app.post("/predict/recovery", response_model=PredictionOutput)
def predict_recovery(metrics: MetricsInput):
    try:
        # Mock ML Model Logic (Simulating a regression + classification model)
        # Higher stress, high intensity, low sleep = High Burnout Risk
        
        # Simple weighted sum representing fatigue load
        fatigue_score = (metrics.stress_level * 1.5) + (metrics.activity_intensity * 2) - (metrics.sleep_hours * 2)
        
        if fatigue_score > 15:
            risk = "High"
            recovery = 24.0 + (fatigue_score - 15) * 1.5
        elif fatigue_score > 5:
            risk = "Medium"
            recovery = 12.0 + (fatigue_score - 5)
        else:
            risk = "Low"
            recovery = max(0.0, 8.0 - metrics.sleep_hours)

        # Output mock predictions
        return PredictionOutput(
            burnout_risk=risk,
            recommended_recovery_hours=round(recovery, 1),
            confidence_score=0.89  # Mock scalar
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
