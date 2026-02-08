import { Outlet, NavLink } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/auth'
import { useThemeStore } from '../../store/theme'

const navItems = [
  {
    to: '/dashboard', label: 'Overview',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M2 4a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2V4zM2 13a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3zM11 4a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V4zM11 13a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2v-3z" />
      </svg>
    ),
  },
  {
    to: '/accounts', label: 'Accounts',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
      </svg>
    ),
  },
  {
    to: '/transactions', label: 'Transactions',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2h11l-3 3a1 1 0 001.414 1.414l5-5a1 1 0 000-1.414l-5-5A1 1 0 0011 2.586L14 6H3zM17 17a1 1 0 000-2H6l3-3a1 1 0 10-1.414-1.414l-5 5a1 1 0 000 1.414l5 5A1 1 0 109 19.414L6 16h11z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    to: '/categories', label: 'Categories',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
      </svg>
    ),
  },
  {
    to: '/budgets', label: 'Budgets',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    to: '/savings', label: 'Savings',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const { theme, toggle } = useThemeStore()

  const name = user?.user_metadata?.full_name as string | undefined
  const initials = name
    ? name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="w-56 bg-[var(--sidebar-bg)] border-r border-[var(--border-1)] flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-4 py-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#10b981" opacity="0.9" />
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#10b981" opacity="0.6" />
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#10b981" opacity="0.6" />
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#10b981" opacity="0.3" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[var(--t1)] leading-none tracking-tight">Finance</h1>
              <p className="text-[10px] text-[var(--t4)] mt-0.5">Personal tracker</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 space-y-0.5 pb-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-500 font-medium'
                    : 'text-[var(--t4)] hover:text-[var(--t2)] hover:bg-[var(--hover)]'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom controls */}
        <div className="px-2 py-3 border-t border-[var(--border-1)] space-y-0.5">
          <button
            onClick={toggle}
            className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-xl text-[13px] text-[var(--t4)] hover:text-[var(--t2)] hover:bg-[var(--hover)] transition-all duration-150"
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-xl text-[13px] text-[var(--t4)] hover:text-[var(--t2)] hover:bg-[var(--hover)] transition-all duration-150"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Sign out
          </button>

          {/* User profile */}
          <div className="flex items-center gap-2.5 px-3 pt-2.5 mt-1 border-t border-[var(--border-1)]">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-[11px] font-semibold text-emerald-500 shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-[var(--t2)] truncate leading-none">{name ?? user?.email}</p>
              {name && <p className="text-[10px] text-[var(--t4)] truncate mt-0.5">{user?.email}</p>}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
