import { ArrowRight, CalendarClock, CircleCheckBig } from 'lucide-react'
import { useTaskEditor } from '@/hooks/useContexts'
import type { Task } from '@/types/task'
import { cn } from '@/utils/cn'
import { diffInDays, formatDaysLeft, formatRelativeTime, parseDateKey, todayKey } from '@/utils/date'
import { PRIORITY_STYLES } from '@/utils/styles'
import { Card, CardHeader } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

export function ViewAllLink({ href, label = 'View all' }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      className="group inline-flex shrink-0 items-center gap-1 rounded-md text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
    >
      {label}
      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
    </a>
  )
}

export function UpcomingDeadlines({ tasks }: { tasks: Task[] }) {
  const { openEdit } = useTaskEditor()
  const today = todayKey()

  return (
    <Card>
      <CardHeader
        title="Upcoming deadlines"
        description="The next tasks on your calendar"
        action={<ViewAllLink href="#/upcoming" />}
      />
      {tasks.length === 0 ? (
        <EmptyState
          compact
          icon={CalendarClock}
          title="No upcoming deadlines"
          description="Tasks with future due dates will appear here."
        />
      ) : (
        <ul className="px-2 pb-3">
          {tasks.map((task) => {
            const date = parseDateKey(task.dueDate!)
            const soon = diffInDays(today, task.dueDate!) <= 1
            return (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => openEdit(task)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <span
                    className={cn(
                      'flex size-11 shrink-0 flex-col items-center justify-center rounded-xl ring-1',
                      soon
                        ? 'bg-indigo-50 text-indigo-600 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20'
                        : 'bg-zinc-50 text-zinc-600 ring-zinc-200/80 dark:bg-zinc-800/60 dark:text-zinc-300 dark:ring-zinc-700/60',
                    )}
                  >
                    <span className="text-[10px] leading-none font-semibold uppercase">
                      {date.toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="mt-0.5 text-base leading-none font-semibold tabular-nums">{date.getDate()}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {task.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className={cn('size-1.5 rounded-full', PRIORITY_STYLES[task.priority].dot)} />
                      {formatDaysLeft(task.dueDate!, today)}
                      {task.category && <span className="truncate">· {task.category}</span>}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

export function RecentlyCompleted({ tasks }: { tasks: Task[] }) {
  const { openEdit } = useTaskEditor()

  return (
    <Card>
      <CardHeader
        title="Recently completed"
        description="Your latest wins"
        action={<ViewAllLink href="#/completed" label="History" />}
      />
      {tasks.length === 0 ? (
        <EmptyState
          compact
          icon={CircleCheckBig}
          title="Nothing completed yet"
          description="Finished tasks will show up here."
        />
      ) : (
        <ul className="px-2 pb-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => openEdit(task)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <CircleCheckBig className="size-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-zinc-700 dark:text-zinc-300">{task.title}</span>
                <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                  {task.completedAt && formatRelativeTime(task.completedAt)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
