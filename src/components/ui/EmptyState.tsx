import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  compact?: boolean
}

export function EmptyState({ icon: Icon, title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex animate-fade-in flex-col items-center justify-center px-6 text-center',
        compact ? 'py-10' : 'py-20',
      )}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 scale-150 rounded-full bg-indigo-500/15 blur-2xl dark:bg-indigo-500/20" />
        <div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-b from-white to-zinc-50 shadow-sm ring-1 ring-zinc-200/80 dark:from-zinc-800 dark:to-zinc-900 dark:ring-zinc-700/60">
          <Icon className="size-6 text-indigo-500 dark:text-indigo-400" strokeWidth={1.75} />
        </div>
      </div>
      <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-white">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
