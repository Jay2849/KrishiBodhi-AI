from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
import app.models as models
import app.schemas as schemas
from typing import List

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

# 🛡️ Week 6 Advanced Authentication Middleware Injection
from app.security import get_current_supervisor

router = APIRouter(
    prefix="/metrics",
    tags=["Agricultural Metrics & AI Advisory"]
)

# ==========================================
# 📝 ROUTE 1: SUBMIT FIELD METRICS & GENERATE AI ADVISORY (🛡️ PROTECTED)
# ==========================================
@router.post("/submit", response_model=schemas.FieldMetricResponse, status_code=status.HTTP_201_CREATED)
def submit_field_metrics(
    metric: schemas.FieldMetricCreate, 
    db: Session = Depends(get_db),
    current_user: models.Supervisor = Depends(get_current_supervisor) # JWT Validator Guard
):
    supervisor_id = current_user.id

    recommendation = ""
    
    # 🤖 AI Engine Integration (Gemini 1.5 Flash)
    if API_KEY:
        try:
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                generation_config={"max_output_tokens": 120}
            )
            prompt = (
                f"Act as an agronomy expert. Based on soil moisture ({metric.soil_moisture}%), "
                f"temperature ({metric.temperature}°C), Nitrogen ({metric.nitrogen_level}), "
                f"Phosphorus ({metric.phosphorus_level}), and Potassium ({metric.potassium_level}), "
                f"generate a concise 2-sentence structural advisory block for the dashboard. "
                f"Format strictly as: **Status Alert:** [problem statement], **Action Required:** [precise mitigation solution]."
            )
            response = model.generate_content(prompt)
            if response and response.text:
                recommendation = response.text.strip()
        except Exception as e:
            print(f"Gemini API fallback triggered: {e}")

    # Fallback to structural rule-based agronomy logic if AI API is offline
    if not recommendation:
        if metric.soil_moisture < 30.0:
            recommendation += "**Status Alert:** Critical field dehydration detected at low moisture level. "
        else:
            recommendation += "**Status Alert:** Soil moisture levels are optimal for local high-altitude crops. "
            
        if metric.nitrogen_level < 20.0:
            recommendation += "**Action Required:** Nitrogen deficiency observed. Apply organic compost or Urea immediately."
        else:
            recommendation += "**Action Required:** Maintain balanced NPK nutrient supply and standard watering cycles."

    # Model mapping karke database mein save karo
    new_metric = models.FieldMetric(
        farmer_name=metric.farmer_name,
        soil_moisture=metric.soil_moisture,
        nitrogen_level=metric.nitrogen_level,
        phosphorus_level=metric.phosphorus_level,
        potassium_level=metric.potassium_level,
        temperature=metric.temperature,
        ai_advisory=recommendation,
        supervisor_id=supervisor_id
    )
    
    db.add(new_metric)
    db.commit()
    db.refresh(new_metric)
    return new_metric


# ==========================================
# 📊 ROUTE 2: GET ALL METRICS FOR A SUPERVISOR (🛡️ PROTECTED DASHBOARD MATRIX)
# ==========================================
@router.get("/supervisor/me", response_model=List[schemas.FieldMetricResponse])
def get_supervisor_metrics(
    db: Session = Depends(get_db),
    current_user: models.Supervisor = Depends(get_current_supervisor) # JWT Validator Guard
):
    # Data Isolation: Token configuration identity block se direct records fetch honge
    metrics = db.query(models.FieldMetric).filter(models.FieldMetric.supervisor_id == current_user.id).all()
    return metrics


# ==========================================
# 🔄 ROUTE 3: UPDATE FIELD METRICS NAME (🛡️ PROTECTED)
# ==========================================
@router.put("/update/{metric_id}", status_code=status.HTTP_200_OK)
def update_field_metric(
    metric_id: int, 
    payload: dict, 
    db: Session = Depends(get_db),
    current_user: models.Supervisor = Depends(get_current_supervisor) # JWT Validator Guard
):
    # Database matrix query lookup mixed with Strict Ownership validation
    metric_query = db.query(models.FieldMetric).filter(
        models.FieldMetric.id == metric_id,
        models.FieldMetric.supervisor_id == current_user.id
    )
    metric = metric_query.first()
    
    if not metric:
        raise HTTPException(status_code=404, detail="Relational telemetry record not found or access denied")
        
    updated_name = payload.get("farmer_name")
    if updated_name:
        metric.farmer_name = updated_name
        
    if "soil_moisture" in payload and payload["soil_moisture"] is not None:
        metric.soil_moisture = float(payload["soil_moisture"])
    if "temperature" in payload and payload["temperature"] is not None:
        metric.temperature = float(payload["temperature"])
        
    db.commit()
    db.refresh(metric)
    
    return {
        "status": "success", 
        "message": "Telemetry entry successfully altered",
        "record": {
            "id": metric.id,
            "farmer_name": metric.farmer_name,
            "soil_moisture": metric.soil_moisture,
            "temperature": metric.temperature,
            "ai_advisory": metric.ai_advisory,
            "timestamp": metric.timestamp,
            "supervisor_id": metric.supervisor_id
        }
    }


# ==========================================
# 🗑️ ROUTE 4: DELETE FIELD METRICS RECORD (🛡️ PROTECTED)
# ==========================================
@router.delete("/delete/{metric_id}", status_code=status.HTTP_200_OK)
def delete_field_metric(
    metric_id: int, 
    db: Session = Depends(get_db),
    current_user: models.Supervisor = Depends(get_current_supervisor) # JWT Validator Guard
):
    # Locate targeted database layer profile with explicit ownership verification
    metric_query = db.query(models.FieldMetric).filter(
        models.FieldMetric.id == metric_id,
        models.FieldMetric.supervisor_id == current_user.id
    )
    metric = metric_query.first()
    
    if not metric:
        raise HTTPException(status_code=404, detail="Targeted metric entry not found or access denied")
        
    # Hard drop execution
    db.delete(metric)
    db.commit()
    
    return {"status": "success", "message": "Record safely purged from persistent database"}