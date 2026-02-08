import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'

interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (v: string) => void
  options: Option[]
  placeholder?: string
  required?: boolean
  className?: string
}

export function Select({ value, onChange, options, placeholder = 'Select…', className = '' }: Props) {
  const selected = options.find((o) => o.value === value)

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        <ListboxButton className="w-full bg-[var(--surface-alt)] border border-[var(--border-4)] rounded-xl px-3.5 py-2.5 text-sm text-left flex items-center justify-between focus:outline-none focus:border-emerald-500/60 transition-colors cursor-pointer">
          <span className={selected ? 'text-[var(--t1)]' : 'text-[var(--t4)]'}>
            {selected?.label ?? placeholder}
          </span>
          <svg className="w-4 h-4 text-[var(--t4)] shrink-0" fill="none" viewBox="0 0 20 20">
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          className="w-[var(--button-width)] bg-[var(--surface-alt)] border border-[var(--border-4)] rounded-xl mt-1 overflow-hidden shadow-2xl shadow-black/30 focus:outline-none z-50"
        >
          {options.map((opt) => (
            <ListboxOption
              key={opt.value}
              value={opt.value}
              className="px-3.5 py-2.5 text-sm cursor-pointer select-none data-[focus]:bg-[var(--hover)] data-[selected]:text-emerald-500 text-[var(--t2)] transition-colors"
            >
              {opt.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
