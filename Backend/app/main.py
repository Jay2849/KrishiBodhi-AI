from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, metrics  # Dono routers import kiye

# Auto table initialization layers
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KrishiBodhi AI - Central Backend Engine",
    description="Production-ready asynchronous API supporting agricultural insights.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active routing channels mounting sequence
app.include_router(auth.router)
app.include_router(metrics.router)  # Naya metric system include kiya

@app.get("/")
async def root():
    return {
        "project": "KrishiBodhi AI",
        "status": "Active",
        "message": "All Engines Operational. Authentication and Agricultural Matrix Live!"
    }