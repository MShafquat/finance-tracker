import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { Select } from '../../components/ui/Select'
import { useAuthStore } from '../../store/auth'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [profile, setProfile] = useState({
    full_name: user?.user_metadata?.full_name || '',
    currency_code: 'BDT',
    monthly_income: '',
    income_category: 'salary',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/sync/', {
        ...profile,
        monthly_income: profile.monthly_income ? parseFloat(profile.monthly_income) : null,
        onboarding_completed: true,
      })
      await api.post('/categories/seed_defaults/')
      navigate('/dashboard')
    } catch {
      setError('Failed to save profile. Please try again.')
    }
    setLoading(false)
  }

  const inputCls = 'w-full bg-[var(--surface-alt)] border border-[var(--border-4)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-emerald-500/60 transition-colors'

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-[var(--t1)]">Set up your account</h2>
          <p className="text-[var(--t3)] mt-1 text-sm">Step {step} of 2</p>
          <div className="flex gap-1.5 justify-center mt-3">
            <div className={`h-1 w-8 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-[var(--overlay)]'}`} />
            <div className={`h-1 w-8 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-[var(--overlay)]'}`} />
          </div>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border-3)] p-6">
          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2) }} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm text-[var(--t3)] mb-1.5">Your name</label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    required
                    placeholder="Full name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--t3)] mb-1.5">Currency</label>
                  <Select
                    value={profile.currency_code}
                    onChange={(v) => setProfile({ ...profile, currency_code: v })}
                    options={[
                      { value: 'BDT', label: 'BDT — Bangladeshi Taka' },
                      { value: 'USD', label: 'USD — US Dollar' },
                      { value: 'EUR', label: 'EUR — Euro' },
                      { value: 'GBP', label: 'GBP — British Pound' },
                      { value: 'INR', label: 'INR — Indian Rupee' },
                    ]}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm text-[var(--t3)] mb-1.5">Monthly income (optional)</label>
                  <input
                    type="number"
                    value={profile.monthly_income}
                    onChange={(e) => setProfile({ ...profile, monthly_income: e.target.value })}
                    placeholder="0"
                    min="0"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--t3)] mb-1.5">Income type</label>
                  <Select
                    value={profile.income_category}
                    onChange={(v) => setProfile({ ...profile, income_category: v })}
                    options={[
                      { value: 'salary', label: 'Salary' },
                      { value: 'business', label: 'Business' },
                      { value: 'freelance', label: 'Freelance' },
                      { value: 'investment', label: 'Investment' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                </div>
              </>
            )}

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <div className="flex gap-2 pt-1">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-[var(--ghost)] hover:bg-[var(--ghost-h)] text-[var(--t2)] text-sm font-medium py-2.5 rounded-xl transition-all duration-150"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-150"
              >
                {step === 1 ? 'Continue' : loading ? 'Saving…' : 'Get started'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
