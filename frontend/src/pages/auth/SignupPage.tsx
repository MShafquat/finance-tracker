import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [awaitingEmail, setAwaitingEmail] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
    } else if (data.session) {
      setTimeout(() => window.location.replace('/onboarding'), 100)
    } else {
      setAwaitingEmail(true)
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (awaitingEmail) {
    return (
      <div className="w-full max-w-sm text-center animate-fade-in-up">
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-3)] p-10">
          <div className="text-3xl mb-3">✉️</div>
          <h2 className="text-lg font-semibold text-[var(--t1)]">Check your email</h2>
          <p className="text-[var(--t3)] text-sm mt-2">
            We sent a confirmation link to <span className="text-[var(--t2)]">{email}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#10b981" opacity="0.9" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#10b981" opacity="0.6" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#10b981" opacity="0.6" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#10b981" opacity="0.3" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-[var(--t1)] tracking-tight">Create account</h2>
        <p className="text-[var(--t3)] mt-1.5 text-sm">Start tracking your finances</p>
      </div>

      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-3)] p-6 space-y-4">
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2.5 bg-[var(--ghost)] hover:bg-[var(--ghost-h)] text-[var(--t1)] text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-150"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-3)]" />
          </div>
          <div className="relative flex justify-center text-xs text-[var(--t4)]">
            <span className="bg-[var(--surface)] px-3">or</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full bg-[var(--surface-alt)] border border-[var(--border-4)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-emerald-500/60 transition-colors"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[var(--surface-alt)] border border-[var(--border-4)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-emerald-500/60 transition-colors"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-[var(--surface-alt)] border border-[var(--border-4)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-emerald-500/60 transition-colors"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-150"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-[var(--t4)] mt-5">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-emerald-500 hover:text-emerald-400 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
