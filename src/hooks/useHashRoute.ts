import { useMemo, useSyncExternalStore } from 'react'
import { parseRoute } from '@/utils/routes'

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

const getHash = () => window.location.hash

/** Lightweight hash-based routing so views survive refreshes and back/forward. */
export function useHashRoute() {
  const hash = useSyncExternalStore(subscribe, getHash)
  return useMemo(() => ({ route: parseRoute(hash), key: hash || '#/dashboard' }), [hash])
}
