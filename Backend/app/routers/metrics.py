from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
import app.models as models
import app.schemas as schemas
from typing import List

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
    # Ab supervisor_id query string se nahi, direct authenticated token layer se secure milegi
    supervisor_id = current_user.id

    # Rule-Based AI Engine Placeholder Logic
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
        
    # Input validation extraction
    updated_name = payload.get("farmer_name")
    if not updated_name:
        raise HTTPException(status_code=400, detail="Farmer name field required for update validation")
        
    # Commit update logic to SQLite engine
    metric.farmer_name = updated_name
    db.commit()
    
    return {"status": "success", "message": "Telemetry entry successfully altered"}


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