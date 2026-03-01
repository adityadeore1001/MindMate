"""
MindMate ML Engine
NLP-based sentiment analysis and mental health risk detection.
"""

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
import emoji
from typing import List
from dataclasses import dataclass


@dataclass
class MentalHealthAnalysis:
    """Data class for mental health analysis results."""
    risk_level: str
    sentiment_score: float
    detected_keywords: List[str]
    emoji_count: int
    recommendation: str
    explanation: str


# Initialize VADER sentiment analyzer
vader_analyzer = SentimentIntensityAnalyzer()

# Negative keywords that may indicate mental health concerns
NEGATIVE_KEYWORDS = [
    "sad", "depressed", "alone", "hopeless", "tired", "anxious",
    "worthless", "empty", "crying", "suicide", "suicidal", "hurt",
    "pain", "suffering", "despair", "lonely", "isolated", "numb",
    "overwhelmed", "stressed", "panic", "fear", "scared", "terrified"
]


def detect_keywords(text: str) -> List[str]:
    """
    Detect negative keywords in the text.
    
    Args:
        text: Input text to analyze
        
    Returns:
        List of detected keywords
    """
    text_lower = text.lower()
    detected = []
    
    for keyword in NEGATIVE_KEYWORDS:
        if keyword in text_lower:
            detected.append(keyword)
    
    return detected


def count_emojis(text: str) -> int:
    """
    Count emoji occurrences in the text.
    
    Args:
        text: Input text to analyze
        
    Returns:
        Number of emojis found
    """
    emoji_list = emoji.emoji_list(text)
    return len(emoji_list)


def get_sentiment_score(text: str) -> float:
    """
    Calculate sentiment score using VADER.
    
    Args:
        text: Input text to analyze
        
    Returns:
        Compound sentiment score (-1 to 1)
    """
    scores = vader_analyzer.polarity_scores(text)
    return scores['compound']


def determine_risk_level(sentiment_score: float, keyword_count: int, emoji_count: int) -> tuple[str, str]:
    """
    Determine risk level based on sentiment score and keyword count.
    
    Args:
        sentiment_score: VADER compound sentiment score
        keyword_count: Number of negative keywords detected
        emoji_count: Number of emojis detected
        
    Returns:
        Tuple of (risk_level, explanation)
    """
    # High risk indicators
    if sentiment_score < -0.5 or keyword_count > 2:
        if sentiment_score < -0.5 and keyword_count > 2:
            explanation = (
                f"The text shows very negative sentiment (score: {sentiment_score:.2f}) "
                f"and contains {keyword_count} concerning keywords. "
                f"This combination suggests elevated mental health risk."
            )
        elif sentiment_score < -0.5:
            explanation = (
                f"The text shows very negative sentiment (score: {sentiment_score:.2f}), "
                f"indicating strong negative emotional expression."
            )
        else:
            explanation = (
                f"The text contains {keyword_count} concerning keywords related to mental health, "
                f"which may indicate distress."
            )
        return "High", explanation
    
    # Moderate risk indicators
    elif sentiment_score < 0 or keyword_count > 0:
        if sentiment_score < 0 and keyword_count > 0:
            explanation = (
                f"The text shows negative sentiment (score: {sentiment_score:.2f}) "
                f"and contains {keyword_count} concerning keyword(s). "
                f"This suggests moderate mental health risk."
            )
        elif sentiment_score < 0:
            explanation = (
                f"The text shows negative sentiment (score: {sentiment_score:.2f}), "
                f"indicating some negative emotional expression."
            )
        else:
            explanation = (
                f"The text contains {keyword_count} concerning keyword(s), "
                f"suggesting potential mental health concerns."
            )
        return "Moderate", explanation
    
    # Low risk
    else:
        explanation = (
            f"The text shows neutral to positive sentiment (score: {sentiment_score:.2f}) "
            f"with minimal concerning keywords detected."
        )
        return "Low", explanation


def get_recommendation(risk_level: str) -> str:
    """
    Get recommendation message based on risk level.
    
    Args:
        risk_level: Risk level (Low, Moderate, High)
        
    Returns:
        Recommendation message
    """
    recommendations = {
        "High": (
            "We recommend speaking with a mental health professional or counselor. "
            "Consider reaching out to a crisis helpline if you're in immediate distress. "
            "Remember, you're not alone, and help is available."
        ),
        "Moderate": (
            "It may be helpful to talk to someone you trust or consider speaking with "
            "a mental health professional. Self-care activities and support networks "
            "can be beneficial during difficult times."
        ),
        "Low": (
            "Your text suggests relatively stable mental health. Continue practicing "
            "self-care and maintaining healthy relationships. If concerns arise, "
            "don't hesitate to seek professional support."
        )
    }
    return recommendations.get(risk_level, recommendations["Low"])


def analyze_text(text: str) -> MentalHealthAnalysis:
    """
    Main analysis function that processes text and returns comprehensive results.
    
    Args:
        text: User input text to analyze
        
    Returns:
        MentalHealthAnalysis object with all analysis results
    """
    # Calculate sentiment score
    sentiment_score = get_sentiment_score(text)
    
    # Detect keywords
    detected_keywords = detect_keywords(text)
    keyword_count = len(detected_keywords)
    
    # Count emojis
    emoji_count = count_emojis(text)
    
    # Determine risk level and explanation
    risk_level, explanation = determine_risk_level(sentiment_score, keyword_count, emoji_count)
    
    # Get recommendation
    recommendation = get_recommendation(risk_level)
    
    return MentalHealthAnalysis(
        risk_level=risk_level,
        sentiment_score=sentiment_score,
        detected_keywords=detected_keywords,
        emoji_count=emoji_count,
        recommendation=recommendation,
        explanation=explanation
    )
