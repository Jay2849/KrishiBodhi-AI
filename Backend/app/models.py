from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Supervisor(Base):
    __tablename__ = "supervisors"

    id = Column(Integer, primary_key=True, index=True)
    intern_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship: Ek supervisor kai saare metrics record kar sakta hai
    metrics = relationship("FieldMetric", back_populates="recorded_by_supervisor")


class FieldMetric(Base):
    __tablename__ = "field_metrics"

    id = Column(Integer, primary_key=True, index=True)
    farmer_name = Column(String, nullable=False)
    soil_moisture = Column(Float, nullable=False)
    nitrogen_level = Column(Float, nullable=False)
    phosphorus_level = Column(Float, nullable=False)
    potassium_level = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    
    # AI ki di hui unique advisory yahan store hogi
    ai_advisory = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Foreign Key tracking: Kis supervisor ne yeh data entry ki hai
    supervisor_id = Column(Integer, ForeignKey("supervisors.id"), nullable=False)
    
    # Back relation setup
    recorded_by_supervisor = relationship("Supervisor", back_populates="metrics")