import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { Select } from '../../components/ui/Select'

interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
  is_default: boolean
}

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#10b981', '#06b6d4', '#3b82f6',
  '#94a3b8', '#64748b',
]

const inputCls = 'w-full bg-[var(--surface-alt)] border border-[var(--border-4)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--t1)] placeholder-[var(--t4)] focus:outline-none focus:border-emerald-500/60 transition-colors'

export default function CategoriesPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'expense', color: PRESET_COLORS[0] })
  const [error, setError] = useState('')

  const { data, isLoading } = useQuery<{ results: Category[] }>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories/').then((r) => r.data),
  })

  const create = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.post('/categories/', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      setShowForm(false)
      setError('')
      setForm({ name: '', type: 'expense', color: PRESET_COLORS[0] })
    },
    onError: (e: unknown) => {
      const err = e as { response?: { data?: Record<string, string[]> } }
      setError(Object.values(err.response?.data ?? {}).flat().join(' ') || 'Failed')
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    create.mutate({ name: form.name, type: form.type, color: form.color })
  }

  const categories = data?.results ?? []
  const income = categories.filter((c) => c.type === 'income')
  const expense = categories.filter((c) => c.type === 'expense')

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[var(--t1)] tracking-tight">Categories</h1>
          <p className="text-sm text-[var(--t3)] mt-0.5">Organize your income and expenses</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-150">
          + New category
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--surface)] border border-[var(--border-3)] rounded-2xl p-5 mb-6 animate-fade-in"
        >
          <h2 className="text-sm font-medium text-[var(--t1)] mb-4">New Category</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Category name"
                required
                className={inputCls}
              />
              <Select
                value={form.type}
                onChange={(v) => setForm({ ...form, type: v })}
                options={[
                  { value: 'expense', label: 'Expense' },
                  { value: 'income', label: 'Income' },
                ]}
              />
            </div>
            <div>
              <p className="text-xs text-[var(--t3)] mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm({ ...form, color })}
                    className="w-7 h-7 rounded-lg transition-all duration-150"
                    style={{
                      backgroundColor: color,
                      outline: form.color === color ? `2px solid ${color}` : 'none',
                      outlineOffset: '2px',
                      opacity: form.color === color ? 1 : 0.5,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={() => setShowForm(false)} className="bg-[var(--ghost)] hover:bg-[var(--ghost-h)] text-[var(--t3)] hover:text-[var(--t1)] text-sm py-2.5 px-4 rounded-xl transition-all duration-150">
              Cancel
            </button>
            <button type="submit" disabled={create.isPending} className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-150">
              {create.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-[var(--skeleton)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {[{ label: 'Income', items: income }, { label: 'Expense', items: expense }].map(({ label, items }) => (
            <div key={label} className="stagger-1 animate-fade-in-up">
              <p className="text-xs font-medium text-[var(--t3)] uppercase tracking-wider mb-2">{label}</p>
              {items.length === 0 ? (
                <p className="text-sm text-[var(--t4)] py-3 pl-1">No {label.toLowerCase()} categories yet.</p>
              ) : (
                <div className="bg-[var(--surface)] border border-[var(--border-3)] rounded-2xl divide-y divide-[var(--divide)]">
                  {items.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color || '#94a3b8' }}
                        />
                        <span className="text-sm text-[var(--t2)]">{cat.name}</span>
                        {cat.is_default && (
                          <span className="text-[10px] text-[var(--t4)] bg-[var(--overlay)] px-1.5 py-0.5 rounded-md">default</span>
                        )}
                      </div>
                      {!cat.is_default && (
                        <button
                          onClick={() => remove.mutate(cat.id)}
                          className="text-[var(--t4)] hover:text-red-400 transition-colors text-xs p-1"
                          title="Delete"
                        >
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
