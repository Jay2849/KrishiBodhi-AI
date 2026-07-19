from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.routers import ai

from app.database import Base, engine
from app.routers import auth, metrics

# Auto table initialization layers
Base.metadata.create_all(bind=engine)

# Initialize Rate Limiter Block
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="KrishiBodhi AI - Central Backend Engine",
    description="Production-ready asynchronous API supporting agricultural insights with Advanced Auth Matrix.",
    version="2.0.0"
)

# Wire Limiter State and standard 429 handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active routing channels mounting sequence
app.include_router(auth.router)
app.include_router(metrics.router)
app.include_router(ai.router)

@app.get("/")
async def root():
    return {
        "project": "KrishiBodhi AI",
        "status": "Active",
        "message": "All Engines Operational. Advanced JWT, OAuth Flow, and Rate-Limiting Active!"
    }