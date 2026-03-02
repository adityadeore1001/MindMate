import React from 'react'
import { FaChartLine, FaTags, FaSmile, FaLightbulb, FaInfoCircle } from 'react-icons/fa'
import './AnalysisResult.css'

function AnalysisResult({ analysis }) {
  const getRiskClass = (riskLevel) => {
    return `risk-${riskLevel.toLowerCase()}`
  }

  /* Map risk level to segment index for the meter (0=Low, 1=Moderate, 2=High) */
  const riskSegmentIndex = analysis.risk_level === 'High' ? 2 : analysis.risk_level === 'Moderate' ? 1 : 0

  return (
    <div className="analysis-result" role="region" aria-label="Analysis results">
      <h2 className="result-title">Analysis Results</h2>

      <div className="risk-level-section">
        <span className={`risk-badge ${getRiskClass(analysis.risk_level)}`}>
          {analysis.risk_level} Risk
        </span>
        <div className="risk-meter" role="presentation" aria-hidden="true">
          <div className="risk-meter-track">
            <div
              className={`risk-meter-fill ${getRiskClass(analysis.risk_level)}`}
              style={{ width: `${(riskSegmentIndex + 1) * 33.33}%` }}
            />
          </div>
          <div className="risk-meter-labels">
            <span className={riskSegmentIndex === 0 ? 'active' : ''}>Low</span>
            <span className={riskSegmentIndex === 1 ? 'active' : ''}>Moderate</span>
            <span className={riskSegmentIndex === 2 ? 'active' : ''}>High</span>
          </div>
        </div>
      </div>

      <div className="result-grid">
        <div className="result-card">
          <div className="result-card-icon" aria-hidden="true">
            <FaChartLine />
          </div>
          <div className="result-card-content">
            <span className="result-label">Sentiment Score</span>
            <span className="result-value">{analysis.sentiment_score.toFixed(3)}</span>
          </div>
        </div>

        <div className="result-card">
          <div className="result-card-icon" aria-hidden="true">
            <FaTags />
          </div>
          <div className="result-card-content">
            <span className="result-label">Detected Keywords</span>
            <span className="result-value">
              {analysis.detected_keywords.length > 0
                ? analysis.detected_keywords.join(', ')
                : 'None detected'}
            </span>
          </div>
        </div>

        <div className="result-card">
          <div className="result-card-icon" aria-hidden="true">
            <FaSmile />
          </div>
          <div className="result-card-content">
            <span className="result-label">Emoji Count</span>
            <span className="result-value">{analysis.emoji_count}</span>
          </div>
        </div>
      </div>

      <div className="explanation-section">
        <h3 className="section-title">
          <FaInfoCircle className="section-icon" aria-hidden="true" />
          Explanation
        </h3>
        <p className="explanation-text">{analysis.explanation}</p>
      </div>

      <div className="recommendation-section">
        <h3 className="section-title">
          <FaLightbulb className="section-icon" aria-hidden="true" />
          Recommendation
        </h3>
        <p className="recommendation-text">{analysis.recommendation}</p>
      </div>
    </div>
  )
}

export default AnalysisResult
