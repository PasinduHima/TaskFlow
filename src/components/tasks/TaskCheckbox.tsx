import { Check } from 'lucide-react'
import type { Priority } from '@/types/task'
import { cn } from '@/utils/cn'
import { PRIORITY_STYLES } from '@/utils/styles'

interface TaskCheckboxProps {
  checked: boolean
  onChange: () => void
  label: string
  priority?: Priority
  size?: 'md' | 'sm'
  className?: string
}

export function TaskCheckbox({ checked, onChange, label, priority = 'low', size = 'md', className }: TaskCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'group/check flex shrink-0 cursor-pointer items-center justify-center border-[1.5px] transition-all duration-200 active:scale-90',
        size === 'md' ? 'size-5 rounded-full' : 'size-4 rounded-[5px]',
        checked
          ? 'border-indigo-600 bg-indigo-600 shadow-sm shadow-indigo-600/30 dark:border-indigo-500 dark:bg-indigo-500'
          : cn(
              size === 'md' ? PRIORITY_STYLES[priority].checkbox : 'border-zinc-300 dark:border-zinc-600',
              'hover:border-indigo-500 dark:hover:border-indigo-400',
            ),
        className,
      )}
    >
      <Check
        strokeWidth={3.5}
        className={cn(
          size === 'md' ? 'size-3' : 'size-2.5',
          checked
            ? 'animate-pop text-white'
            : 'text-indigo-500 opacity-0 transition-opacity group-hover/check:opacity-60 dark:text-indigo-400',
        )}
      />
    </button>
  )
}
