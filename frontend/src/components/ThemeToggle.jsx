import React from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import './ThemeToggle.css'

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <FaSun /> : <FaMoon />}
    </button>
  )
}

export default ThemeToggle
