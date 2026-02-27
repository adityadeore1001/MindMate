"""
MindMate Backend - FastAPI Application
Main entry point for the AI-powered mental health risk detection API.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import uvicorn
from ml_engine import analyze_text, MentalHealthAnalysis
from report_generator import generate_pdf_report
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="MindMate API",
    description="AI-Powered Mental Health Risk Detection System",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextAnalysisRequest(BaseModel):
    """Request model for text analysis."""
    text: str = Field(..., min_length=1, max_length=10000, description="User text to analyze")


class AnalysisResponse(BaseModel):
    """Response model for text analysis."""
    risk_level: str
    sentiment_score: float
    detected_keywords: list[str]
    emoji_count: int
    recommendation: str
    explanation: str


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "MindMate API",
        "version": "1.0.0"
    }


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_user_text(request: TextAnalysisRequest):
    """
    Analyze user text for mental health risk indicators.
    
    Args:
        request: TextAnalysisRequest containing the text to analyze
        
    Returns:
        AnalysisResponse with risk level, sentiment score, and recommendations
    """
    try:
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Perform analysis using ML engine
        analysis: MentalHealthAnalysis = analyze_text(request.text)
        
        return AnalysisResponse(
            risk_level=analysis.risk_level,
            sentiment_score=analysis.sentiment_score,
            detected_keywords=analysis.detected_keywords,
            emoji_count=analysis.emoji_count,
            recommendation=analysis.recommendation,
            explanation=analysis.explanation
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/generate-report")
async def generate_report(request: TextAnalysisRequest):
    """
    Generate a PDF report for the analyzed text.
    
    Args:
        request: TextAnalysisRequest containing the text to analyze
        
    Returns:
        PDF file as response
    """
    try:
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Perform analysis
        analysis: MentalHealthAnalysis = analyze_text(request.text)
        
        # Generate PDF report
        pdf_bytes = generate_pdf_report(request.text, analysis)
        
        from fastapi.responses import Response
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=mindmate_report.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
