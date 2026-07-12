import jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
import app.models as models

# Secret keys for JWT signing
SECRET_KEY = "KRISHIBODHI_SUPER_SECRET_JWT_KEY_WEEK_6"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

security_scheme = HTTPBearer()

# 🔑 Generate JWT Token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 🛡️ Protected Route Dependency (401 Unauthorized Validator)
def get_current_supervisor(credentials: HTTPAuthorizationCredentials = Depends(security_scheme), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        supervisor_id: int = payload.get("sub")
        if supervisor_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token credentials")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired Bearer Token")

    supervisor = db.query(models.Supervisor).filter(models.Supervisor.id == supervisor_id).first()
    if supervisor is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Supervisor not found")
        
    return supervisor