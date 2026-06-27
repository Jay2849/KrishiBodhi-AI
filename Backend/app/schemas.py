from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ==========================================
# SUPERVISOR SCHEMAS (Auth Validation)
# ==========================================

# Base schema jo common fields share karega
class SupervisorBase(BaseModel):
    name: str
    email: EmailStr
    intern_id: str

# Data jo Registration ke waqt frontend se aayega
class SupervisorCreate(SupervisorBase):
    password: str

# Data jo Response (Output) mein wapas jayega (Security ke liye isme password nahi hota)
class SupervisorResponse(SupervisorBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Login request validation ke liye
class SupervisorLogin(BaseModel):
    email: EmailStr
    password: str


# ==========================================
# FIELD METRICS SCHEMAS (Agricultural Data)
# ==========================================

class FieldMetricBase(BaseModel):
    farmer_name: str
    soil_moisture: float
    nitrogen_level: float
    phosphorus_level: float
    potassium_level: float
    temperature: float

# Jab Supervisor naya data insert karega
class FieldMetricCreate(FieldMetricBase):
    pass

# Jab metrics ka data frontend par display ke liye bhejenge
class FieldMetricResponse(FieldMetricBase):
    id: int
    ai_advisory: Optional[str] = None  # AI ka output starting mein null ho sakta hai
    timestamp: datetime
    supervisor_id: int

    class Config:
        from_attributes = True