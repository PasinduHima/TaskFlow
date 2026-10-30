import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const VARIANTS = {
  dialog:
    'inset-x-4 top-[14vh] mx-auto max-w-md animate-scale-in rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-white/10',
  panel:
    'inset-x-0 bottom-0 flex max-h-[92dvh] animate-slide-up flex-col rounded-t-2xl bg-white shadow-2xl ring-1 ring-zinc-900/5 sm:inset-y-2 sm:right-2 sm:left-auto sm:max-h-none sm:w-full sm:max-w-lg sm:animate-slide-in-right sm:rounded-2xl dark:bg-zinc-900 dark:ring-white/10',
  drawer:
    'inset-y-0 left-0 flex w-72 max-w-[85vw] animate-slide-in-left flex-col bg-zinc-50 shadow-2xl dark:bg-zinc-950 dark:ring-1 dark:ring-white/10',
}

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  variant?: keyof typeof VARIANTS
  labelledBy?: string
  label?: string
}

/** Accessible modal surface: focus trap, Escape to close, scroll lock and focus restore. */
export function Modal({ open, onClose, children, variant = 'dialog', labelledBy, label }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const container = containerRef.current
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const initial =
      container?.querySelector<HTMLElement>('[data-autofocus]') ?? container?.querySelector<HTMLElement>(FOCUSABLE)
    initial?.focus()

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !container) return
      const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
      previouslyFocused?.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 animate-fade bg-zinc-950/30 backdrop-blur-[3px] dark:bg-black/60"
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={label}
        className={cn('absolute', VARIANTS[variant])}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
