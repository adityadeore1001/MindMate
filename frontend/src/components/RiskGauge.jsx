import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import './RiskGauge.css'

ChartJS.register(ArcElement, Tooltip, Legend)

function RiskGauge({ riskDistribution }) {
  const data = {
    labels: ['Low', 'Moderate', 'High'],
    datasets: [
      {
        data: [
          riskDistribution.Low || 0,
          riskDistribution.Moderate || 0,
          riskDistribution.High || 0,
        ],
        backgroundColor: [
          'rgba(40, 167, 69, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(220, 53, 69, 0.8)',
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--text-primary)',
          padding: 15,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  const total = Object.values(riskDistribution).reduce((a, b) => a + b, 0)

  return (
    <div className="risk-gauge">
      {total > 0 ? (
        <div className="gauge-chart">
          <Doughnut data={data} options={options} />
        </div>
      ) : (
        <div className="no-data">
          <p>No data available</p>
        </div>
      )}
      <div className="gauge-stats">
        <div className="stat-item">
          <span className="stat-label">Low:</span>
          <span className="stat-value">{riskDistribution.Low || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Moderate:</span>
          <span className="stat-value">{riskDistribution.Moderate || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">High:</span>
          <span className="stat-value">{riskDistribution.High || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default RiskGauge
