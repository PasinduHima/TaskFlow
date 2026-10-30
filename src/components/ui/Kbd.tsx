import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-current/20 px-1 font-sans text-[11px] font-medium opacity-70',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
