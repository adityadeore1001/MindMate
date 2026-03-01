import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import WordCloud from '../components/WordCloud'
import RiskGauge from '../components/RiskGauge'
import './DashboardPage.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

function DashboardPage() {
  const [history, setHistory] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('analysisHistory') || '[]')
    setHistory(savedHistory)
  }, [])

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all analysis history?')) {
      localStorage.removeItem('analysisHistory')
      setHistory([])
    }
  }

  // Prepare chart data
  const chartData = {
    labels: history.slice(0, 10).reverse().map((_, index) => `Analysis ${index + 1}`),
    datasets: [
      {
        label: 'Sentiment Score',
        data: history.slice(0, 10).reverse().map(item => item.sentiment_score),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sentiment Trend (Last 10 Analyses)',
        color: 'var(--text-primary)',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: -1,
        max: 1,
        ticks: {
          color: 'var(--text-secondary)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'var(--text-secondary)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  }

  // Prepare word cloud data
  const wordCloudData = history.length > 0
    ? history
        .flatMap(item => item.detected_keywords)
        .reduce((acc, word) => {
          acc[word] = (acc[word] || 0) + 1
          return acc
        }, {})
    : {}

  const wordCloudWords = Object.entries(wordCloudData).map(([text, value]) => ({
    text,
    value: value * 10,
  }))

  // Calculate risk distribution
  const riskDistribution = history.reduce((acc, item) => {
    acc[item.risk_level] = (acc[item.risk_level] || 0) + 1
    return acc
  }, {})

  return (
    <div className="dashboard-page">
      <div className="container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Back to Home
            </button>
            {history.length > 0 && (
              <button className="btn btn-secondary" onClick={clearHistory}>
                Clear History
              </button>
            )}
          </div>
        </header>

        {history.length === 0 ? (
          <div className="glass-card empty-state">
            <h2>No Analysis History</h2>
            <p>Start analyzing text on the home page to see your dashboard data.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        ) : (
          <>
            <div className="dashboard-grid">
              <div className="glass-card chart-card">
                <div className="chart-container">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              <div className="glass-card gauge-card">
                <h3 className="card-title">Risk Level Distribution</h3>
                <RiskGauge riskDistribution={riskDistribution} />
              </div>
            </div>

            {wordCloudWords.length > 0 && (
              <div className="glass-card wordcloud-card">
                <h3 className="card-title">Keyword Frequency</h3>
                <WordCloud words={wordCloudWords} />
              </div>
            )}

            <div className="glass-card history-card">
              <h3 className="card-title">Recent Analyses</h3>
              <div className="history-list">
                {history.slice(0, 10).map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-header">
                      <span className={`risk-badge risk-${item.risk_level.toLowerCase()}`}>
                        {item.risk_level}
                      </span>
                      <span className="history-date">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="history-text">
                      {item.text.length > 100 ? `${item.text.substring(0, 100)}...` : item.text}
                    </p>
                    <div className="history-meta">
                      <span>Sentiment: {item.sentiment_score.toFixed(3)}</span>
                      {item.detected_keywords.length > 0 && (
                        <span>Keywords: {item.detected_keywords.join(', ')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
