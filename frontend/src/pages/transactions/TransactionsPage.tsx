import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { Select } from '../../components/ui/Select'

interface Transaction {
  id: string
  type: string
  amount: string
  description: string
  transaction_date: string
  account_id: string
}

interface Account { id: string; name: string }
interface Category { id: string; name: string; type: string }

const card = 'bg-[var(--surface)] border border-[var(--border-2)] rounded-2xl'
const inputCls = 'w-full bg-[var(--surface-alt)] border border-[var(--border-4)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-emerald-500/60 transition-colors'

export default function TransactionsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    account_id: '', type: 'expense', amount: '', transaction_date: new Date().toISOString().split('T')[0],
    description: '', category_id: '', transfer_to_account_id: '',
  })
  const [error, setError] = useState('')

  const { data: txData, isLoading } = useQuery<{ results: Transaction[] }>({
    queryKey: ['transactions'],
    queryFn: () => api.get('/transactions/').then((r) => r.data),
  })
  const { data: accData } = useQuery<{ results: Account[] }>({
    queryKey: ['accounts'],
    queryFn: () => api.get('/accounts/').then((r) => r.data),
  })
  const { data: catData } = useQuery<{ results: Category[] }>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories/').then((r) => r.data),
  })

  const create = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.post('/transactions/', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['accounts'] })
      setShowForm(false); setError('')
    },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: Record<string, string[]> } }
      setError(Object.values(err.response?.data ?? {}).flat().join(' ') || 'Failed')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload: Record<string, unknown> = {
      account_id: form.account_id, type: form.type, amount: form.amount,
      transaction_date: form.transaction_date, description: form.description,
    }
    if (form.category_id) payload.category_id = form.category_id
    if (form.type === 'transfer') payload.transfer_to_account_id = form.transfer_to_account_id
    create.mutate(payload)
  }

  const filteredCategories = catData?.results.filter((c) =>
    form.type === 'income' ? c.type === 'income' : c.type === 'expense'
  ) ?? []

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-xl font-semibold text-[var(--t1)] tracking-tight">Transactions</h1>
          <p className="text-sm text-[var(--t3)] mt-0.5">Track your income and expenses</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-150">
          + Add transaction
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={`${card} p-5 mb-5 animate-fade-in`}>
          <h2 className="text-sm font-medium text-[var(--t1)] mb-4">New Transaction</h2>
          <div className="grid grid-cols-2 gap-3">
            <Select
              value={form.type}
              onChange={(v) => setForm({ ...form, type: v })}
              options={[
                { value: 'expense', label: 'Expense' },
                { value: 'income', label: 'Income' },
                { value: 'transfer', label: 'Transfer' },
              ]}
            />
            <Select
              value={form.account_id}
              onChange={(v) => setForm({ ...form, account_id: v })}
              placeholder="Select account"
              options={accData?.results.map((a) => ({ value: a.id, label: a.name })) ?? []}
            />
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" required min="0.01" step="0.01" className={inputCls} />
            <input type="date" value={form.transaction_date} onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} required className={inputCls} />
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className={inputCls} />
            {form.type !== 'transfer' ? (
              <Select
                value={form.category_id}
                onChange={(v) => setForm({ ...form, category_id: v })}
                placeholder="Category (optional)"
                options={filteredCategories.map((c) => ({ value: c.id, label: c.name }))}
              />
            ) : (
              <Select
                value={form.transfer_to_account_id}
                onChange={(v) => setForm({ ...form, transfer_to_account_id: v })}
                placeholder="Transfer to account"
                options={accData?.results.filter((a) => a.id !== form.account_id).map((a) => ({ value: a.id, label: a.name })) ?? []}
              />
            )}
          </div>
          {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[var(--ghost)] hover:bg-[var(--ghost-h)] text-[var(--t3)] hover:text-[var(--t1)] text-sm py-2.5 rounded-xl transition-all duration-150">Cancel</button>
            <button type="submit" disabled={create.isPending} className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-150">{create.isPending ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-[var(--skeleton)] rounded-xl animate-pulse" />)}</div>
      ) : !txData?.results.length ? (
        <div className="text-center py-16 text-[var(--t4)] text-sm animate-fade-in-up">No transactions yet.</div>
      ) : (
        <div className={`${card} divide-y divide-[var(--divide)] animate-fade-in-up stagger-1`}>
          {txData.results.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm text-[var(--t2)]">{tx.description || 'No description'}</p>
                <p className="text-xs text-[var(--t4)] mt-0.5">{tx.transaction_date}</p>
              </div>
              <span className={`text-sm font-medium ${tx.type === 'income' ? 'text-emerald-400' : tx.type === 'expense' ? 'text-rose-400' : 'text-[var(--t3)]'}`}>
                {tx.type === 'income' ? '+' : tx.type === 'expense' ? '−' : ''}৳{parseFloat(tx.amount).toLocaleString('en', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
