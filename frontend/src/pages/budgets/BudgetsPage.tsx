import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { Select } from '../../components/ui/Select'

interface BudgetProgress {
  category_id: string
  category_name: string
  planned_amount: number
  actual_amount: number
  remaining: number
  percentage_used: number
}

interface Category { id: string; name: string; type: string }

const card = 'bg-[var(--surface)] border border-[var(--border-2)] rounded-2xl'
const inputCls = 'w-full bg-[var(--surface-alt)] border border-[var(--border-4)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-emerald-500/60 transition-colors'

export default function BudgetsPage() {
  const qc = useQueryClient()
  const now = new Date()
  const [month] = useState(now.getMonth() + 1)
  const [year] = useState(now.getFullYear())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category_id: '', planned_amount: '', month: String(month), year: String(year) })
  const [error, setError] = useState('')

  const { data: progressData, isLoading } = useQuery<{ month: number; year: number; progress: BudgetProgress[] }>({
    queryKey: ['budgets-progress', month, year],
    queryFn: () => api.get(`/budgets/progress/?month=${month}&year=${year}`).then((r) => r.data),
  })
  const { data: catData } = useQuery<{ results: Category[] }>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories/').then((r) => r.data),
  })

  const create = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.post('/budgets/', payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['budgets-progress'] }); setShowForm(false); setError('') },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: Record<string, string[]> } }
      setError(Object.values(err.response?.data ?? {}).flat().join(' ') || 'Failed')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    create.mutate({ category_id: form.category_id, planned_amount: form.planned_amount, month: parseInt(form.month), year: parseInt(form.year) })
  }

  const expenseCategories = catData?.results.filter((c) => c.type === 'expense') ?? []
  const budgets = progressData?.progress ?? []

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-xl font-semibold text-[var(--t1)] tracking-tight">Budgets</h1>
          <p className="text-sm text-[var(--t3)] mt-0.5">{new Date(year, month - 1).toLocaleString('en', { month: 'long', year: 'numeric' })}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-150">
          + Set budget
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`${card} p-5 mb-5 animate-fade-in`}>
          <h2 className="text-sm font-medium text-[var(--t1)] mb-4">New Budget</h2>
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={form.category_id}
              onChange={(v) => setForm({ ...form, category_id: v })}
              placeholder="Select category"
              options={expenseCategories.map((c) => ({ value: c.id, label: c.name }))}
            />
            <input type="number" value={form.planned_amount} onChange={(e) => setForm({ ...form, planned_amount: e.target.value })} placeholder="Planned amount" required min="0" className={inputCls} />
          </div>
          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[var(--ghost)] hover:bg-[var(--ghost-h)] text-[var(--t3)] hover:text-[var(--t1)] text-sm py-2.5 rounded-xl transition-all duration-150">Cancel</button>
            <button type="submit" disabled={create.isPending} className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-150">{create.isPending ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-[var(--skeleton)] rounded-2xl animate-pulse" />)}</div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-16 text-[var(--t4)] text-sm animate-fade-in-up">No budgets set for this month.</div>
      ) : (
        <div className="space-y-3 animate-fade-in-up stagger-1">
          {budgets.map((b) => (
            <div key={b.category_id} className={`${card} p-5`}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-[var(--t1)]">{b.category_name}</span>
                <span className="text-xs text-[var(--t3)]">৳{b.actual_amount.toLocaleString()} / ৳{b.planned_amount.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-[var(--overlay)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${b.percentage_used > 90 ? 'bg-rose-500' : b.percentage_used > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(b.percentage_used, 100)}%` }}
                />
              </div>
              <p className="text-xs text-[var(--t4)] mt-1.5">{b.percentage_used.toFixed(1)}% used · ৳{b.remaining.toLocaleString()} remaining</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
