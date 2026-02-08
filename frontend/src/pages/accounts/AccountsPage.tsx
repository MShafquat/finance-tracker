import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { Select } from '../../components/ui/Select'

interface Account {
  id: string
  name: string
  type: string
  provider: string
  current_balance: string
  credit_limit?: string
  billing_date?: number
  due_date?: number
  is_active: boolean
}

const TYPE_LABELS: Record<string, string> = { bank: 'Bank', mfs: 'MFS', credit_card: 'Credit Card', cash: 'Cash' }
const card = 'bg-[var(--surface)] border border-[var(--border-2)] rounded-2xl'
const inputCls = 'w-full bg-[var(--surface-alt)] border border-[var(--border-4)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-emerald-500/60 transition-colors'

export default function AccountsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'bank', provider: '', initial_balance: '0', credit_limit: '', billing_date: '', due_date: '' })
  const [error, setError] = useState('')

  const { data, isLoading } = useQuery<{ results: Account[] }>({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts/').then((r) => r.data),
  })

  const create = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.post('/accounts/', payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); setShowForm(false); setError('') },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: Record<string, string[]> } }
      setError(Object.values(err.response?.data ?? {}).flat().join(' ') || 'Failed to create account')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload: Record<string, unknown> = { name: form.name, type: form.type, provider: form.provider, initial_balance: form.initial_balance }
    if (form.type === 'credit_card') {
      payload.credit_limit = form.credit_limit
      payload.billing_date = parseInt(form.billing_date)
      if (form.due_date) payload.due_date = parseInt(form.due_date)
    }
    create.mutate(payload)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-xl font-semibold text-[var(--t1)] tracking-tight">Accounts</h1>
          <p className="text-sm text-[var(--t3)] mt-0.5">Manage your financial accounts</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-150">
          + Add account
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`${card} p-5 mb-5 animate-fade-in`}>
          <h2 className="text-sm font-medium text-[var(--t1)] mb-4">New Account</h2>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Account name" required className={inputCls} />
            <Select
              value={form.type}
              onChange={(v) => setForm({ ...form, type: v })}
              options={[
                { value: 'bank', label: 'Bank' },
                { value: 'mfs', label: 'MFS (bKash / Nagad)' },
                { value: 'credit_card', label: 'Credit Card' },
                { value: 'cash', label: 'Cash' },
              ]}
            />
            <input value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} placeholder="Provider (e.g. BRAC Bank)" className={inputCls} />
            <input type="number" value={form.initial_balance} onChange={(e) => setForm({ ...form, initial_balance: e.target.value })} placeholder="Initial balance" required className={inputCls} />
          </div>
          {form.type === 'credit_card' && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              <input type="number" value={form.credit_limit} onChange={(e) => setForm({ ...form, credit_limit: e.target.value })} placeholder="Credit limit" required className={inputCls} />
              <input type="number" value={form.billing_date} onChange={(e) => setForm({ ...form, billing_date: e.target.value })} placeholder="Billing date (1-31)" min="1" max="31" required className={inputCls} />
              <input type="number" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} placeholder="Due date (optional)" min="1" max="31" className={inputCls} />
            </div>
          )}
          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[var(--ghost)] hover:bg-[var(--ghost-h)] text-[var(--t3)] hover:text-[var(--t1)] text-sm py-2.5 rounded-xl transition-all duration-150">Cancel</button>
            <button type="submit" disabled={create.isPending} className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-150">{create.isPending ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-[var(--skeleton)] rounded-2xl animate-pulse" />)}
        </div>
      ) : !data?.results.length ? (
        <div className="text-center py-16 text-[var(--t4)] text-sm animate-fade-in-up">No accounts yet. Add your first account.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in-up stagger-1">
          {data.results.map((acc) => (
            <div key={acc.id} className={`${card} p-5 card-hover`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--t1)]">{acc.name}</p>
                  <p className="text-xs text-[var(--t4)] mt-0.5">{acc.provider} · {TYPE_LABELS[acc.type]}</p>
                </div>
                <span className="text-[10px] bg-[var(--overlay)] text-[var(--t3)] px-2 py-1 rounded-lg">{TYPE_LABELS[acc.type]}</span>
              </div>
              <p className={`text-2xl font-semibold mt-4 ${parseFloat(acc.current_balance) >= 0 ? 'text-[var(--t1)]' : 'text-rose-400'}`}>
                ৳{parseFloat(acc.current_balance).toLocaleString('en', { minimumFractionDigits: 2 })}
              </p>
              {acc.type === 'credit_card' && acc.credit_limit && (
                <p className="text-xs text-[var(--t4)] mt-1.5">Limit: ৳{parseFloat(acc.credit_limit).toLocaleString()} · Billing: {acc.billing_date}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
