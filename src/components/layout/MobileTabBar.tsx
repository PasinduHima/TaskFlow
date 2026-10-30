import { CalendarDays, LayoutDashboard, ListTodo, Plus, Sun } from 'lucide-react'
import type { Route } from '@/types/route'
import { cn } from '@/utils/cn'
import { routeToHash } from '@/utils/routes'

const TABS = [
  { route: { view: 'dashboard' }, label: 'Home', icon: LayoutDashboard },
  { route: { view: 'tasks' }, label: 'Tasks', icon: ListTodo },
  null,
  { route: { view: 'today' }, label: 'Today', icon: Sun },
  { route: { view: 'upcoming' }, label: 'Upcoming', icon: CalendarDays },
] as const

export function MobileTabBar({ route, onCreate }: { route: Route; onCreate: () => void }) {
  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200/70 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden dark:border-zinc-800/70 dark:bg-zinc-950/85"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
        {TABS.map((tab) =>
          tab === null ? (
            <li key="create" className="flex justify-center">
              <button
                type="button"
                onClick={onCreate}
                aria-label="New task"
                className="flex size-12 -translate-y-3 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg ring-4 shadow-indigo-500/30 ring-zinc-50 transition active:scale-95 dark:ring-zinc-950"
              >
                <Plus className="size-6" />
              </button>
            </li>
          ) : (
            <li key={tab.label}>
              <a
                href={routeToHash(tab.route)}
                aria-current={route.view === tab.route.view ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors',
                  route.view === tab.route.view
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
                )}
              >
                <tab.icon className="size-5" />
                {tab.label}
              </a>
            </li>
          ),
        )}
      </ul>
    </nav>
  )
}
