import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/auth'
import { AuthLayout } from './components/layout/AuthLayout'
import { AppLayout } from './components/layout/AppLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import CallbackPage from './pages/auth/CallbackPage'
import OnboardingPage from './pages/onboarding/OnboardingPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import AccountsPage from './pages/accounts/AccountsPage'
import TransactionsPage from './pages/transactions/TransactionsPage'
import CategoriesPage from './pages/categories/CategoriesPage'
import BudgetsPage from './pages/budgets/BudgetsPage'
import SavingsPage from './pages/savings/SavingsPage'

export default function App() {
  const { setSession, setLoading } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession, setLoading])

  return (
    <Routes>
      <Route path="/auth/callback" element={<CallbackPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/savings" element={<SavingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  )
}
