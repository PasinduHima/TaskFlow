import { useEffect, useRef } from 'react'

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

/** Registers single-key shortcuts that are ignored while typing or when a dialog is open. */
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  const shortcutsRef = useRef(shortcuts)
  useEffect(() => {
    shortcutsRef.current = shortcuts
  })

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return
      if (document.querySelector('[aria-modal="true"]')) return
      const handler = shortcutsRef.current[event.key.toLowerCase()]
      if (!handler) return
      event.preventDefault()
      handler()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
