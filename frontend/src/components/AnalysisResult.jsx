import React from 'react'
import './AnalysisResult.css'

function AnalysisResult({ analysis }) {
  const getRiskClass = (riskLevel) => {
    return `risk-${riskLevel.toLowerCase()}`
  }

  return (
    <div className="analysis-result">
      <h2 className="result-title">Analysis Results</h2>
      
      <div className="risk-level-section">
        <span className={`risk-badge ${getRiskClass(analysis.risk_level)}`}>
          {analysis.risk_level} Risk
        </span>
      </div>

      <div className="result-grid">
        <div className="result-item">
          <span className="result-label">Sentiment Score</span>
          <span className="result-value">
            {analysis.sentiment_score.toFixed(3)}
          </span>
        </div>

        <div className="result-item">
          <span className="result-label">Detected Keywords</span>
          <span className="result-value">
            {analysis.detected_keywords.length > 0 
              ? analysis.detected_keywords.join(', ')
              : 'None detected'
            }
          </span>
        </div>

        <div className="result-item">
          <span className="result-label">Emoji Count</span>
          <span className="result-value">{analysis.emoji_count}</span>
        </div>
      </div>

      <div className="explanation-section">
        <h3 className="section-title">Explanation</h3>
        <p className="explanation-text">{analysis.explanation}</p>
      </div>

      <div className="recommendation-section">
        <h3 className="section-title">Recommendation</h3>
        <p className="recommendation-text">{analysis.recommendation}</p>
      </div>
    </div>
  )
}

export default AnalysisResult
