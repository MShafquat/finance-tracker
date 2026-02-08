import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '../store/auth'
import { StatusBar } from 'expo-status-bar'

const queryClient = new QueryClient()

function RootLayoutNav() {
  const segments = useSegments()
  const router = useRouter()
  const { user, loading, initialize } = useAuthStore()

  // Initialize auth on mount
  useEffect(() => {
    initialize()
  }, [])

  // Redirect based on auth state
  useEffect(() => {
    if (loading) return

    const inAuthGroup = segments[0] === '(auth)'
    const inAppGroup = segments[0] === '(app)'

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login')
    } else if (user && inAuthGroup) {
      // Redirect to app if authenticated
      router.replace('/(app)/(tabs)')
    }
  }, [user, loading, segments])

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="onboarding" />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  )
}
