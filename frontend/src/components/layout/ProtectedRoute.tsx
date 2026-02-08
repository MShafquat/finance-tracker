import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

export function ProtectedRoute() {
  const { session, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#060a12]">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth/login" />
  }

  return <Outlet />
}
