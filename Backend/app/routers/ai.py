import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Environment variables load karo (.env file se)
load_dotenv()

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Recommendation Engine"]
)

# Gemini SDK Configure karo
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

# Data verification schema
class SoilDataInput(BaseModel):
    moisture: float
    temperature: float
    npk_status: str

@router.post("/recommendation")
def get_agricultural_recommendation(data: SoilDataInput):
    if not API_KEY:
        raise HTTPException(
            status_code=500, 
            detail="AI Key Configuration Error: GEMINI_API_KEY missing in .env layer."
        )
    
    try:
        # High-speed model initialize kiya
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"max_output_tokens": 100}
        )
        
        # Expert advice logic structure
        prompt = (
            f"Act as an agronomy expert. Based on soil moisture ({data.moisture}%), "
            f"temperature ({data.temperature}°C), and NPK status ({data.npk_status}), "
            f"generate a concise 2-sentence structural advisory block for the dashboard. "
            f"Format strictly as: **Status Alert:** [problem statement], **Action Required:** [precise mitigation solution]."
        )
        
        response = model.generate_content(prompt)
        
        return {
            "success": True,
            "recommendation": response.text.strip()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=502, 
            detail=f"AI Engine Gateway failure: {str(e)}"
        )