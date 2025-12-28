// src/contexts/ThemeContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'
import { useLocalStorage } from '@hooks/useLocalStorage'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('zalldi-theme', 'light')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    }
  }, [theme, mounted])
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  
  if (!mounted) {
    return null
  }
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}