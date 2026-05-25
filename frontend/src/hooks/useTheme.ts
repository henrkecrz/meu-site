import { useEffect, useState } from 'react'

export type ThemeName = 'dark' | 'light'

const STORAGE_KEY = 'nexus-theme'

function getInitialTheme(): ThemeName {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'light' ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme(current => current === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}
