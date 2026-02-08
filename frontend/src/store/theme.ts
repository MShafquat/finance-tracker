import { create } from 'zustand'

type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  toggle: () => void
}

function applyTheme(theme: Theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light')
  } else {
    document.documentElement.classList.remove('light')
  }
  localStorage.setItem('theme', theme)
}

const saved = localStorage.getItem('theme') as Theme | null
const initial: Theme = saved ?? 'dark'

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initial,
  toggle: () =>
    set((s) => {
      const next = s.theme === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      return { theme: next }
    }),
}))
