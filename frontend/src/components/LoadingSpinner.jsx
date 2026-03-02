import React from 'react'
import './LoadingSpinner.css'

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner" aria-hidden="true"></div>
      <p className="loading-text">Analyzing your text...</p>
      <div className="loading-dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
    </div>
  )
}

export default LoadingSpinner
