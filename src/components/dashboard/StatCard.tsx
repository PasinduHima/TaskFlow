import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/utils/cn'

const TONES = {
  indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20',
  emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
  rose: 'bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20',
}

interface StatCardProps {
  label: string
  value: number
  hint: string
  icon: LucideIcon
  tone: keyof typeof TONES
  href: string
}

export function StatCard({ label, value, hint, icon: Icon, tone, href }: StatCardProps) {
  return (
    <a
      href={href}
      className="group relative flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:p-5 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:shadow-black/20"
    >
      <div className="flex items-center justify-between">
        <span className={cn('flex size-9 items-center justify-center rounded-xl ring-1', TONES[tone])}>
          <Icon className="size-[18px]" />
        </span>
        <ArrowUpRight className="size-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400" />
      </div>
      <p className="mt-4 text-[28px] leading-none font-semibold tracking-tight text-zinc-900 tabular-nums dark:text-white">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</p>
      <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
    </a>
  )
}
