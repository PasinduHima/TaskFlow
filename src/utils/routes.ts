import type { Route } from '@/types/route'

const SIMPLE_VIEWS = ['dashboard', 'tasks', 'today', 'upcoming', 'completed', 'important', 'categories'] as const

export function parseRoute(hash: string): Route {
  const [view, ...rest] = hash.replace(/^#\/?/, '').split('/')

  if (view === 'category' && rest.length) {
    return { view: 'category', category: decodeURIComponent(rest.join('/')) }
  }

  const match = SIMPLE_VIEWS.find((v) => v === view)
  return match ? { view: match } : { view: 'dashboard' }
}

export function routeToHash(route: Route) {
  return route.view === 'category' ? `#/category/${encodeURIComponent(route.category)}` : `#/${route.view}`
}

export function navigate(route: Route) {
  window.location.hash = routeToHash(route)
}
