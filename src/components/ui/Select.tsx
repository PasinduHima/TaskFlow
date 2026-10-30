import type { ComponentProps } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

type SelectProps = ComponentProps<'select'> & { active?: boolean }

/** Native select with custom styling, so it stays accessible and mobile-friendly. */
export function Select({ className, active = false, children, ...props }: SelectProps) {
  return (
    <div className={cn('relative', className)}>
      <select
        className={cn(
          'h-9 w-full cursor-pointer appearance-none rounded-lg border bg-white py-0 pr-8 pl-3 text-sm font-medium shadow-xs transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none dark:bg-zinc-900 dark:focus:border-indigo-400',
          active
            ? 'border-indigo-300 text-indigo-700 dark:border-indigo-500/50 dark:text-indigo-300'
            : 'border-zinc-200 text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700',
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-zinc-400" />
    </div>
  )
}
