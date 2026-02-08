import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'

interface SavingPlan {
  id: string
  name: string
  target_amount: string
  current_amount: string
  target_date?: string
  status: string
  monthly_contribution?: string
  suggestion_rule: string
}

interface Suggestion {
  rule: string
  suggested_monthly_amount: number
  feasible: boolean
  description: string
}

interface SuggestionsData {
  monthly_income: number
  monthly_expenses: number
  surplus: number
  suggestions: Suggestion[]
}

const RULE_LABELS: Record<string, string> = { '50_30_20': '50/30/20', '10_percent': '10% Rule', 'surplus': 'Surplus' }
const card = 'bg-[var(--surface)] border border-[var(--border-2)] rounded-2xl'
const inputCls = 'w-full bg-[var(--surface-alt)] border border-[var(--border-4)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-emerald-500/60 transition-colors'

export default function SavingsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', target_amount: '', target_date: '', monthly_contribution: '' })
  const [error, setError] = useState('')

  const { data: plans, isLoading } = useQuery<{ results: SavingPlan[] }>({
    queryKey: ['savings'],
    queryFn: () => api.get('/savings/plans/').then((r) => r.data),
  })
  const { data: suggestions } = useQuery<SuggestionsData>({
    queryKey: ['savings-suggestions'],
    queryFn: () => api.get('/savings/suggestions/').then((r) => r.data),
  })

  const create = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.post('/savings/plans/', payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['savings'] }); setShowForm(false); setError('') },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: Record<string, string[]> } }
      setError(Object.values(err.response?.data ?? {}).flat().join(' ') || 'Failed')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload: Record<string, unknown> = { name: form.name, target_amount: form.target_amount }
    if (form.target_date) payload.target_date = form.target_date
    if (form.monthly_contribution) payload.monthly_contribution = form.monthly_contribution
    create.mutate(payload)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-xl font-semibold text-[var(--t1)] tracking-tight">Savings</h1>
          <p className="text-sm text-[var(--t3)] mt-0.5">Build towards your goals</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-150">
          + New goal
        </button>
      </div>

      {suggestions && (
        <div className={`${card} p-5 mb-5 animate-fade-in-up stagger-1`}>
          <h2 className="text-sm font-medium text-[var(--t1)] mb-1">Smart Suggestions</h2>
          <p className="text-xs text-[var(--t4)] mb-4">৳{suggestions.monthly_income.toLocaleString()} income · ৳{suggestions.monthly_expenses.toLocaleString()} expenses · ৳{suggestions.surplus.toLocaleString()} surplus</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {suggestions.suggestions.map((s) => (
              <div key={s.rule} className={`rounded-xl p-4 border ${s.feasible ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-[var(--border-1)] bg-[var(--skeleton)]'}`}>
                <p className="text-xs font-medium text-[var(--t3)]">{RULE_LABELS[s.rule] ?? s.rule}</p>
                <p className="text-lg font-semibold text-[var(--t1)] mt-1">৳{s.suggested_monthly_amount.toLocaleString()}<span className="text-xs text-[var(--t3)] font-normal">/mo</span></p>
                <p className={`text-xs mt-1 ${s.feasible ? 'text-emerald-500' : 'text-[var(--t4)]'}`}>{s.feasible ? '✓ Feasible' : '✗ Not feasible'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={`${card} p-5 mb-5 animate-fade-in`}>
          <h2 className="text-sm font-medium text-[var(--t1)] mb-4">New Saving Goal</h2>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Goal name (e.g. Emergency fund)" required className={inputCls} />
            <input type="number" value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} placeholder="Target amount" required min="1" className={inputCls} />
            <input type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} className={inputCls} />
            <input type="number" value={form.monthly_contribution} onChange={(e) => setForm({ ...form, monthly_contribution: e.target.value })} placeholder="Monthly contribution (optional)" min="0" className={inputCls} />
          </div>
          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[var(--ghost)] hover:bg-[var(--ghost-h)] text-[var(--t3)] hover:text-[var(--t1)] text-sm py-2.5 rounded-xl transition-all duration-150">Cancel</button>
            <button type="submit" disabled={create.isPending} className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-150">{create.isPending ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[...Array(2)].map((_, i) => <div key={i} className="h-28 bg-[var(--skeleton)] rounded-2xl animate-pulse" />)}</div>
      ) : !plans?.results.length ? (
        <div className="text-center py-16 text-[var(--t4)] text-sm animate-fade-in-up">No saving goals yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in-up stagger-2">
          {plans.results.map((plan) => {
            const pct = parseFloat(plan.target_amount) > 0 ? (parseFloat(plan.current_amount) / parseFloat(plan.target_amount)) * 100 : 0
            return (
              <div key={plan.id} className={`${card} p-5 card-hover`}>
                <div className="flex justify-between items-start mb-3">
                  <p className="text-sm font-medium text-[var(--t1)]">{plan.name}</p>
                  <span className={`text-[10px] px-2 py-1 rounded-lg ${plan.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[var(--overlay)] text-[var(--t3)]'}`}>{plan.status}</span>
                </div>
                <div className="flex justify-between text-xs text-[var(--t3)] mb-2">
                  <span>৳{parseFloat(plan.current_amount).toLocaleString()}</span>
                  <span>৳{parseFloat(plan.target_amount).toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-[var(--overlay)] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <p className="text-xs text-[var(--t4)] mt-1.5">{pct.toFixed(1)}% complete{plan.target_date ? ` · Target: ${plan.target_date}` : ''}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
