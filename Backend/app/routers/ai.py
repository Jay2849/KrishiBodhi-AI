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
    recommendation = ""
    
    if API_KEY:
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
            if response and response.text:
                recommendation = response.text.strip()
            
        except Exception as e:
            print(f"Gemini API Exception: {e}")
    
    if not recommendation:
        if data.moisture < 30.0:
            recommendation += "**Status Alert:** Critical field dehydration detected at low moisture level. "
        else:
            recommendation += "**Status Alert:** Soil moisture levels are optimal for local high-altitude crops. "
            
        if "deficient" in data.npk_status.lower() or "low" in data.npk_status.lower():
            recommendation += "**Action Required:** Nutrient deficiency observed. Apply organic compost or Urea immediately."
        else:
            recommendation += "**Action Required:** Maintain balanced NPK nutrient supply and standard watering cycles."

    return {
        "success": True,
        "recommendation": recommendation
    }