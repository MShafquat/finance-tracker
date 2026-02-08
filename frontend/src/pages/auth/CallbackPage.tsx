import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function CallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setError(error.message)
        } else {
          // Use hard redirect to avoid cross-origin history.replaceState() security error
          window.location.replace('/onboarding')
        }
      })
    } else {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          window.location.replace('/dashboard')
        } else {
          setError('No auth code found. Try signing in again.')
        }
      })
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => navigate('/auth/login')} className="mt-4 text-indigo-400 text-sm hover:text-indigo-300">
            Back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
