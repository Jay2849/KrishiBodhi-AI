from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
import app.models as models
import app.schemas as schemas
from passlib.context import CryptContext
from slowapi import Limiter
from slowapi.util import get_remote_address

# Import token tools from security layer
from app.security import create_access_token

# Re-link the central application state limiter
limiter = Limiter(key_func=get_remote_address)

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
# 📝 ROUTE 1: SUPERVISOR SIGNUP / REGISTRATION (Rate Limited)
# ==========================================
@router.post("/register", response_model=schemas.SupervisorResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register_supervisor(request: Request, supervisor: schemas.SupervisorCreate, db: Session = Depends(get_db)):
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
# 🔑 ROUTE 2: SUPERVISOR LOGIN (JWT Token Generation & Rate Limited)
# ==========================================
@router.post("/login")
@limiter.limit("3/minute")
def login_supervisor(request: Request, credentials: schemas.SupervisorLogin, db: Session = Depends(get_db)):
    # User dhoondo email se
    user = db.query(models.Supervisor).filter(models.Supervisor.email == credentials.email).first()
    if not user:
        raise HTTPException(status_code=403, detail="Invalid Credentials")

    # Password match karke check karo
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=403, detail="Invalid Credentials")

    # Access Token pipeline generate karo (Week 6 Security Requirement)
    token_data = {"sub": str(user.id), "email": user.email, "role": "supervisor"}
    jwt_token = create_access_token(data=token_data)

    # Success response with standard access_token payload structure
    return {
        "message": "Login successful",
        "access_token": jwt_token,
        "token_type": "bearer",
        "supervisor_id": user.id,
        "name": user.name,
        "intern_id": user.intern_id
    }


# ==========================================
# 🌐 ROUTE 3: OAUTH DYNAMIC IDENTITY RESOLUTION CALLBACK
# ==========================================
@router.post("/oauth/callback")
def oauth_provider_callback(payload: dict, db: Session = Depends(get_db)):
    oauth_email = payload.get("email")
    oauth_name = payload.get("name")
    provider = payload.get("provider", "google")
    
    if not oauth_email or not oauth_name:
        raise HTTPException(status_code=400, detail="Incomplete Identity profile data received from OAuth channel")
        
    # Relational lookup to check if user profile exists
    user = db.query(models.Supervisor).filter(models.Supervisor.email == oauth_email).first()
    
    # Auto-provision user account if it doesn't exist
    if not user:
        # Email prefix lekar short secure string create karo taaki 72-byte limit hit na ho
        email_prefix = oauth_email.split('@')[0][:20]
        secure_fallback_pass = f"OAuthSafePass!{email_prefix}"
        
        user = models.Supervisor(
            name=oauth_name,
            email=oauth_email,
            intern_id=f"OAUTH-{provider.upper()}-{email_prefix}",
            hashed_password=get_password_hash(secure_fallback_pass) # 🛡️ Fixed short password constraint
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    # Authorize user session via standard system JWT
    token_data = {"sub": str(user.id), "email": user.email, "role": "supervisor"}
    jwt_token = create_access_token(data=token_data)
    
    return {
        "message": f"Successfully authenticated via {provider.capitalize()}",
        "access_token": jwt_token,
        "token_type": "bearer",
        "supervisor_id": user.id,
        "name": user.name
    }