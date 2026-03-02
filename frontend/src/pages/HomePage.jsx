import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AnalysisResult from '../components/AnalysisResult'
import LoadingSpinner from '../components/LoadingSpinner'
import './HomePage.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function HomePage() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        text: text.trim()
      })

      setAnalysis(response.data)
      
      // Save to local storage for history
      const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]')
      history.unshift({
        ...response.data,
        text: text.trim(),
        timestamp: new Date().toISOString()
      })
      // Keep only last 50 analyses
      localStorage.setItem('analysisHistory', JSON.stringify(history.slice(0, 50)))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze text. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setAnalysis(null)
    setError(null)
  }

  const handleDownloadPDF = async () => {
    if (!text.trim()) return

    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-report`,
        { text: text.trim() },
        { responseType: 'blob' }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'mindmate_report.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError('Failed to generate PDF report. Please try again.')
      console.error('PDF generation error:', err)
    }
  }

  return (
    <div className="home-page">
      <div className="container">
        <header className="hero">
          <h1 className="title">MindMate</h1>
          <p className="subtitle">AI-powered insight from your words. Understand sentiment and risk signals—for awareness, not diagnosis.</p>
        </header>

        <div className="glass-card main-card">
          <div className="input-section">
            <label htmlFor="text-input" className="input-label">
              Enter your text to analyze
            </label>
            <textarea
              id="text-input"
              className="input-textarea"
              placeholder="Type or paste your text here... (e.g., journal entry, social media post)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
            />
            <div className="button-group">
              <button
                className="btn btn-primary"
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
              >
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard
              </button>
            </div>
          </div>

          {loading && <LoadingSpinner />}

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {analysis && (
            <>
              <AnalysisResult analysis={analysis} />
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={handleDownloadPDF}
                >
                  Download PDF Report
                </button>
              </div>
            </>
          )}

          <div className="disclaimer">
            <p>
              <strong>⚠️ Important Disclaimer:</strong> MindMate is an early risk awareness tool 
              and does not replace professional medical advice. This analysis is for informational 
              purposes only and should not be used as a substitute for professional mental health 
              evaluation, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
