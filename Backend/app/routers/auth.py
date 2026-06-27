from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
import app.models as models
import app.schemas as schemas
from passlib.context import CryptContext

# CryptContext initialization (Password hashing engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/auth",
    tags=["Authentication (Supervisors)"]
)

# Utility functions for hashing verification
def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# ==========================================
# 📝 ROUTE 1: SUPERVISOR SIGNUP / REGISTRATION
# ==========================================
@router.post("/register", response_model=schemas.SupervisorResponse, status_code=status.HTTP_201_CREATED)
def register_supervisor(supervisor: schemas.SupervisorCreate, db: Session = Depends(get_db)):
    # Check karo ki email pehle se exist toh nahi karti
    db_user = db.query(models.Supervisor).filter(models.Supervisor.email == supervisor.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Check karo ki Intern ID unique hai ya nahi
    db_intern = db.query(models.Supervisor).filter(models.Supervisor.intern_id == supervisor.intern_id).first()
    if db_intern:
        raise HTTPException(status_code=400, detail="Intern ID already in use")

    # Password encrypt karo aur user save karo
    hashed_pwd = get_password_hash(supervisor.password)
    new_supervisor = models.Supervisor(
        name=supervisor.name,
        email=supervisor.email,
        intern_id=supervisor.intern_id,
        hashed_password=hashed_pwd
    )
    
    db.add(new_supervisor)
    db.commit()
    db.refresh(new_supervisor)
    return new_supervisor


# ==========================================
# 🔑 ROUTE 2: SUPERVISOR LOGIN
# ==========================================
@router.post("/login")
def login_supervisor(credentials: schemas.SupervisorLogin, db: Session = Depends(get_db)):
    # User dhoondo email se
    user = db.query(models.Supervisor).filter(models.Supervisor.email == credentials.email).first()
    if not user:
        raise HTTPException(status_code=403, detail="Invalid Credentials")

    # Password match karke check karo
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=403, detail="Invalid Credentials")

    # Success response
    return {
        "message": "Login successful",
        "supervisor_id": user.id,
        "name": user.name,
        "intern_id": user.intern_id
    }