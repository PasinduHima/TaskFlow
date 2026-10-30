import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { cn, createId } from '@/utils/cn'
import { ToastContext, type ToastOptions } from './contexts'

type Toast = ToastOptions & { id: string }

const MAX_TOASTS = 3

const ICONS = {
  success: <CircleCheck className="size-4.5 text-emerald-400" />,
  info: <Info className="size-4.5 text-indigo-300" />,
  error: <CircleAlert className="size-4.5 text-rose-400" />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef(new Map<string, number>())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = createId()
      setToasts((prev) => [...prev, { ...options, id }].slice(-MAX_TOASTS))
      timers.current.set(id, window.setTimeout(() => dismiss(id), options.action ? 5000 : 3000))
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-24 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end lg:bottom-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-xl bg-zinc-900 px-4 py-3 text-white shadow-2xl ring-1 shadow-zinc-950/20 ring-white/10 dark:bg-zinc-800"
          >
            <span className="mt-0.5 shrink-0">{ICONS[t.variant ?? 'success']}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{t.title}</p>
              {t.description && <p className="mt-0.5 truncate text-xs text-zinc-400">{t.description}</p>}
            </div>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick()
                  dismiss(t.id)
                }}
                className="shrink-0 rounded-md px-2 py-0.5 text-sm font-semibold text-indigo-300 transition hover:bg-white/10 hover:text-indigo-200"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismiss(t.id)}
              className={cn('-mr-1 shrink-0 rounded-md p-0.5 text-zinc-500 transition hover:bg-white/10 hover:text-zinc-200')}
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  )
}
