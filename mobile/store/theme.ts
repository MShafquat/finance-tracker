import { create } from 'zustand'
import { useColorScheme } from 'react-native'

type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  toggle: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',
  toggle: () =>
    set((s) => ({
      theme: s.theme === 'dark' ? 'light' : 'dark',
    })),
}))

// Hook to get current theme (respects system preference initially)
export function useTheme() {
  const systemTheme = useColorScheme()
  const { theme } = useThemeStore()
  return theme ?? systemTheme ?? 'dark'
}
