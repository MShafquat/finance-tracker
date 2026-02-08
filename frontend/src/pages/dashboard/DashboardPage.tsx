import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'

interface DashboardData {
  consolidated_balance: number
  credit_cards: Array<{ id: string; name: string; provider: string; current_balance: number; credit_limit: number; billing_date: number }>
  recent_transactions: Array<{ id: string; type: string; amount: string; description: string; transaction_date: string }>
  monthly_income: number
  monthly_expenses: number
  budget_overview: Array<{ category: string; planned: number; actual: number }>
  current_month: { month: number; year: number }
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const card = 'bg-[var(--surface)] border border-[var(--border-2)] rounded-2xl'

function fmt(n: number) {
  return `৳${n.toLocaleString('en', { minimumFractionDigits: 2 })}`
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard/').then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="p-8 space-y-4 max-w-5xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-[var(--skeleton)] rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  const savings = (data?.monthly_income ?? 0) - (data?.monthly_expenses ?? 0)
  const month = data?.current_month
  const monthLabel = month ? `${MONTHS[month.month - 1]} ${month.year}` : ''

  return (
    <div className="p-8 space-y-5 max-w-5xl mx-auto">
      <div className="animate-fade-in-up">
        <h1 className="text-xl font-semibold text-[var(--t1)] tracking-tight">Overview</h1>
        <p className="text-sm text-[var(--t3)] mt-0.5">{monthLabel}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in-up stagger-1">
        <div className={`${card} p-5 card-hover`}>
          <p className="text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider mb-2">Balance</p>
          <p className="text-2xl font-semibold text-[var(--t1)]">{fmt(data?.consolidated_balance ?? 0)}</p>
        </div>
        <div className={`${card} p-5 card-hover`}>
          <p className="text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider mb-2">Income</p>
          <p className="text-2xl font-semibold text-emerald-400">{fmt(data?.monthly_income ?? 0)}</p>
        </div>
        <div className={`${card} p-5 card-hover`}>
          <p className="text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider mb-2">Expenses</p>
          <p className="text-2xl font-semibold text-rose-400">{fmt(data?.monthly_expenses ?? 0)}</p>
        </div>
      </div>

      <div className={`${card} p-5 flex items-center justify-between animate-fade-in-up stagger-2`}>
        <div>
          <p className="text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider mb-1">Net this month</p>
          <p className={`text-xl font-semibold ${savings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {savings >= 0 ? '+' : ''}{fmt(savings)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium text-[var(--t3)] uppercase tracking-wider mb-1">Savings rate</p>
          <p className="text-xl font-semibold text-emerald-500">
            {data?.monthly_income ? `${((savings / data.monthly_income) * 100).toFixed(1)}%` : '—'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in-up stagger-3">
        <div className={`${card} p-5`}>
          <h2 className="text-sm font-medium text-[var(--t1)] mb-4">Recent Transactions</h2>
          {!data?.recent_transactions.length ? (
            <p className="text-sm text-[var(--t4)] py-6 text-center">No transactions yet</p>
          ) : (
            <div className="divide-y divide-[var(--divide)]">
              {data.recent_transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm text-[var(--t2)]">{tx.description || 'No description'}</p>
                    <p className="text-xs text-[var(--t4)] mt-0.5">{tx.transaction_date}</p>
                  </div>
                  <span className={`text-sm font-medium ${tx.type === 'income' ? 'text-emerald-400' : tx.type === 'expense' ? 'text-rose-400' : 'text-[var(--t3)]'}`}>
                    {tx.type === 'income' ? '+' : tx.type === 'expense' ? '−' : ''}{fmt(parseFloat(tx.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`${card} p-5`}>
          <h2 className="text-sm font-medium text-[var(--t1)] mb-4">Credit Cards</h2>
          {!data?.credit_cards.length ? (
            <p className="text-sm text-[var(--t4)] py-6 text-center">No credit cards added</p>
          ) : (
            <div className="space-y-4">
              {data.credit_cards.map((c) => {
                const used = Math.abs(c.current_balance)
                const util = c.credit_limit ? (used / c.credit_limit) * 100 : 0
                return (
                  <div key={c.id}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-[var(--t2)]">{c.name}</span>
                      <span className="text-xs text-[var(--t3)]">{fmt(used)} / {fmt(c.credit_limit)}</span>
                    </div>
                    <div className="h-1 bg-[var(--overlay)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${util > 80 ? 'bg-rose-500' : util > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(util, 100)}%` }} />
                    </div>
                    <p className="text-xs text-[var(--t4)] mt-1">Billing: {c.billing_date}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {!!data?.budget_overview?.length && (
        <div className={`${card} p-5 animate-fade-in-up stagger-4`}>
          <h2 className="text-sm font-medium text-[var(--t1)] mb-4">Budget Progress</h2>
          <div className="space-y-3">
            {data.budget_overview.map((b) => {
              const pct = b.planned > 0 ? Math.min((b.actual / b.planned) * 100, 100) : 0
              return (
                <div key={b.category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--t3)]">{b.category}</span>
                    <span className="text-[var(--t4)]">{fmt(b.actual)} / {fmt(b.planned)}</span>
                  </div>
                  <div className="h-1 bg-[var(--overlay)] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct > 90 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
