from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Local SQLite connection database engine matrix
SQLALCHEMY_DATABASE_URL = "sqlite:///./krishibodhi.db"

engine = create_engine(
    # check_same_thread sirf SQLite ke liye zaroori hota hai
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Database session yield dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()