import { Check } from 'lucide-react'

export function Logo() {
  return (
    <a
      href="#/dashboard"
      className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
    >
      <span className="relative flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 shadow-md ring-1 shadow-indigo-500/30 ring-white/20 ring-inset">
        <Check className="size-4.5 text-white" strokeWidth={3} />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-zinc-900 dark:text-white">TaskFlow</span>
    </a>
  )
}
