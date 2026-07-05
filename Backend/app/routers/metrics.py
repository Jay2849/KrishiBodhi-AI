from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
import app.models as models
import app.schemas as schemas
from typing import List

router = APIRouter(
    prefix="/metrics",
    tags=["Agricultural Metrics & AI Advisory"]
)

# ==========================================
# 📝 ROUTE 1: SUBMIT FIELD METRICS & GENERATE AI ADVISORY
# ==========================================
@router.post("/submit", response_model=schemas.FieldMetricResponse, status_code=status.HTTP_201_CREATED)
def submit_field_metrics(metric: schemas.FieldMetricCreate, supervisor_id: int, db: Session = Depends(get_db)):
    # 1. Pehle check karo ki supervisor database mein exist karta hai ya nahi
    supervisor = db.query(models.Supervisor).filter(models.Supervisor.id == supervisor_id).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found. Access Denied.")

    # 2. Rule-Based AI Engine Placeholder Logic (Week 4 Structural Requirement)
    # Baad mein yahan Gemini API call lagakar advanced insight nikalenge.
    # Abhi ke liye automated structural advisor matrix logic likhte hain:
    recommendation = ""
    if metric.soil_moisture < 30.0:
        recommendation += "Soil moisture is critically low. Immediate irrigation required. "
    else:
        recommendation += "Soil moisture levels are optimal. Maintain current watering cycle. "
        
    if metric.nitrogen_level < 20.0:
        recommendation += "Nitrogen deficiency detected. Suggest adding Nitrogen-rich organic compost or Urea. "
    else:
        recommendation += "NPK balancing is stable. "

    if metric.temperature > 35.0:
        recommendation += "High ambient temperature observed. Advise mulching to preserve ground moisture."
    else:
        recommendation += "Temperature conditions are standard for local crops."

    # 3. Model mapping karke database mein save karo
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
# 📊 ROUTE 2: GET ALL METRICS FOR A SUPERVISOR (Dashboard Matrix)
# ==========================================
@router.get("/supervisor/{supervisor_id}", response_model=List[schemas.FieldMetricResponse])
def get_supervisor_metrics(supervisor_id: int, db: Session = Depends(get_db)):
    # Check if supervisor exists
    supervisor = db.query(models.Supervisor).filter(models.Supervisor.id == supervisor_id).first()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")
        
    metrics = db.query(models.FieldMetric).filter(models.FieldMetric.supervisor_id == supervisor_id).all()
    return metrics
# ==========================================
# 🔄 ROUTE 3: UPDATE FIELD METRICS NAME (Week 5)
# ==========================================
@router.put("/update/{metric_id}", status_code=status.HTTP_200_OK)
def update_field_metric(metric_id: int, payload: dict, db: Session = Depends(get_db)):
    # Database matrix query lookup
    metric_query = db.query(models.FieldMetric).filter(models.FieldMetric.id == metric_id)
    metric = metric_query.first()
    
    if not metric:
        raise HTTPException(status_code=404, detail="Relational telemetry record not found")
        
    # Input validation extraction
    updated_name = payload.get("farmer_name")
    if not updated_name:
        raise HTTPException(status_code=400, detail="Farmer name field required for update validation")
        
    # Commit update logic to SQLite engine
    metric.farmer_name = updated_name
    db.commit()
    
    return {"status": "success", "message": "Telemetry entry successfully altered"}


# ==========================================
# 🗑️ ROUTE 4: DELETE FIELD METRICS RECORD (Week 5)
# ==========================================
@router.delete("/delete/{metric_id}", status_code=status.HTTP_200_OK)
def delete_field_metric(metric_id: int, db: Session = Depends(get_db)):
    # Locate targeted database layer profile
    metric_query = db.query(models.FieldMetric).filter(models.FieldMetric.id == metric_id)
    metric = metric_query.first()
    
    if not metric:
        raise HTTPException(status_code=404, detail="Targeted metric entry not found")
        
    # Hard drop execution
    db.delete(metric)
    db.commit()
    
    return {"status": "success", "message": "Record safely purged from persistent database"}