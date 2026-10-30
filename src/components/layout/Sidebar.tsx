import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useTasks } from '@/hooks/useContexts'
import type { Route } from '@/types/route'
import { cn } from '@/utils/cn'
import { todayKey } from '@/utils/date'
import { routeToHash } from '@/utils/routes'
import { getCategoryColor } from '@/utils/styles'
import { isInToday, isUpcoming } from '@/utils/tasks'
import { Button } from '../ui/Button'
import { Kbd } from '../ui/Kbd'
import { ProgressBar } from '../ui/Progress'
import { Logo } from './Logo'
import { NAV_ITEMS } from './navigation'

interface SidebarProps {
  route: Route
  onNavigate?: () => void
  onCreate: () => void
}

export function Sidebar({ route, onNavigate, onCreate }: SidebarProps) {
  const { tasks, categories } = useTasks()

  const counts = useMemo(() => {
    const today = todayKey()
    const active = tasks.filter((t) => !t.completed)
    return {
      tasks: active.length,
      today: active.filter((t) => isInToday(t, today)).length,
      upcoming: tasks.filter((t) => isUpcoming(t, today)).length,
      important: active.filter((t) => t.important).length,
      completed: tasks.length - active.length,
      categories: categories.length,
    } as Partial<Record<Route['view'], number>>
  }, [tasks, categories])

  const todayProgress = useMemo(() => {
    const today = todayKey()
    const todays = tasks.filter((t) => t.dueDate === today)
    const done = todays.filter((t) => t.completed).length
    return { done, total: todays.length, percent: todays.length ? Math.round((done / todays.length) * 100) : 0 }
  }, [tasks])

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of tasks) if (t.category && !t.completed) map.set(t.category, (map.get(t.category) ?? 0) + 1)
    return map
  }, [tasks])

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Logo />
      </div>

      <div className="px-3 pb-2">
        <Button onClick={onCreate} className="w-full">
          <span className="flex items-center gap-2">
            <Plus />
            New task
          </span>
          <Kbd className="ml-auto">N</Kbd>
        </Button>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:thin]">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <NavLink
                href={routeToHash(item.route)}
                active={route.view === item.route.view}
                icon={<item.icon />}
                label={item.label}
                count={counts[item.route.view]}
                onClick={onNavigate}
              />
            </li>
          ))}
        </ul>

        {categories.length > 0 && (
          <div className="mt-7">
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              Categories
            </p>
            <ul className="space-y-0.5">
              {categories.map((name) => (
                <li key={name}>
                  <NavLink
                    href={routeToHash({ view: 'category', category: name })}
                    active={route.view === 'category' && route.category === name}
                    icon={
                      <span className="flex size-[18px] items-center justify-center">
                        <span className={cn('size-2 rounded-full', getCategoryColor(name).dot)} />
                      </span>
                    }
                    label={name}
                    count={categoryCounts.get(name)}
                    onClick={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="m-3 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-900 dark:text-white">Today's progress</span>
          <span className="text-zinc-500 tabular-nums dark:text-zinc-400">
            {todayProgress.done}/{todayProgress.total}
          </span>
        </div>
        <ProgressBar value={todayProgress.percent} label="Today's progress" className="mt-2.5" />
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {todayProgress.total === 0
            ? 'Nothing scheduled for today.'
            : todayProgress.done === todayProgress.total
              ? 'All done for today. Nice work!'
              : `${todayProgress.total - todayProgress.done} left to go`}
        </p>
      </div>
    </div>
  )
}

interface NavLinkProps {
  href: string
  active: boolean
  icon: React.ReactNode
  label: string
  count?: number
  onClick?: () => void
}

function NavLink({ href, active, icon, label, count, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      // When the sidebar opens as a mobile drawer, start focus on the current page.
      data-autofocus={active ? true : undefined}
      className={cn(
        'group flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-150 [&_svg]:size-[18px] [&_svg]:shrink-0',
        active
          ? 'bg-white text-zinc-900 shadow-xs ring-1 ring-zinc-200/80 dark:bg-zinc-800/80 dark:text-white dark:ring-zinc-700/60'
          : 'text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100',
      )}
    >
      <span
        className={cn(
          'transition-colors',
          active ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300',
        )}
      >
        {icon}
      </span>
      <span className="truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'ml-auto text-xs tabular-nums',
            active ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500',
          )}
        >
          {count}
        </span>
      )}
    </a>
  )
}
