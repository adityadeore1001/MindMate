import React from 'react'
import './WordCloud.css'

function WordCloud({ words }) {
  if (!words || words.length === 0) {
    return <div className="wordcloud-empty">No keywords detected</div>
  }

  // Sort by value and take top 30
  const sortedWords = [...words].sort((a, b) => b.value - a.value).slice(0, 30)
  
  // Calculate size range
  const maxValue = Math.max(...sortedWords.map(w => w.value))
  const minValue = Math.min(...sortedWords.map(w => w.value))
  const range = maxValue - minValue || 1

  const getFontSize = (value) => {
    const normalized = (value - minValue) / range
    return 14 + normalized * 36 // Range from 14px to 50px
  }

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444']

  return (
    <div className="wordcloud-wrapper">
      {sortedWords.map((word, index) => (
        <span
          key={index}
          className="wordcloud-word"
          style={{
            fontSize: `${getFontSize(word.value)}px`,
            color: colors[index % colors.length],
            opacity: 0.7 + (word.value / maxValue) * 0.3,
          }}
        >
          {word.text}
        </span>
      ))}
    </div>
  )
}

export default WordCloud
