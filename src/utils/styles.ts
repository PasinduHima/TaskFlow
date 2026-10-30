import type { Priority } from '@/types/task'

export const PRIORITIES: Priority[] = ['low', 'medium', 'high']

export const PRIORITY_STYLES: Record<Priority, { label: string; text: string; dot: string; checkbox: string }> = {
  high: {
    label: 'High',
    text: 'text-rose-500 dark:text-rose-400',
    dot: 'bg-rose-500',
    checkbox: 'border-rose-400 bg-rose-50/60 dark:border-rose-400/80 dark:bg-rose-500/10',
  },
  medium: {
    label: 'Medium',
    text: 'text-amber-500 dark:text-amber-400',
    dot: 'bg-amber-500',
    checkbox: 'border-amber-400 bg-amber-50/60 dark:border-amber-400/80 dark:bg-amber-500/10',
  },
  low: {
    label: 'Low',
    text: 'text-sky-500 dark:text-sky-400',
    dot: 'bg-sky-500',
    checkbox: 'border-zinc-300 dark:border-zinc-600',
  },
}

const CATEGORY_COLORS = [
  { dot: 'bg-indigo-500', soft: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300' },
  { dot: 'bg-violet-500', soft: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300' },
  { dot: 'bg-emerald-500', soft: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300' },
  { dot: 'bg-amber-500', soft: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300' },
  { dot: 'bg-rose-500', soft: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300' },
  { dot: 'bg-sky-500', soft: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300' },
  { dot: 'bg-fuchsia-500', soft: 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300' },
  { dot: 'bg-teal-500', soft: 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-300' },
]

/** Picks a stable color for a category based on its name. */
export function getCategoryColor(name: string) {
  let hash = 0
  for (const char of name.toLowerCase()) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length]
}

export const inputClass =
  'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-xs transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-700 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/15'
