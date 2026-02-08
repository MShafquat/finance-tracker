import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

export function AuthLayout() {
  const { session, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg)]">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (session) {
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}
