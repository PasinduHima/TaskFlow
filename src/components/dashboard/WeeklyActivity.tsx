import type { Task } from '@/types/task'
import { cn } from '@/utils/cn'
import { getCompletionHistory } from '@/utils/tasks'
import { Card, CardHeader } from '../ui/Card'

export function WeeklyActivity({ tasks }: { tasks: Task[] }) {
  const history = getCompletionHistory(tasks, 7)
  const total = history.reduce((sum, day) => sum + day.count, 0)
  const max = Math.max(...history.map((d) => d.count), 1)
  const best = history.reduce((a, b) => (b.count > a.count ? b : a))

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Weekly activity"
        description="Tasks completed over the last 7 days"
        action={
          <div className="text-right">
            <p className="text-xl font-semibold text-zinc-900 tabular-nums dark:text-white">{total}</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">this week</p>
          </div>
        }
      />
      <div className="flex flex-1 flex-col justify-end px-5 pt-2 pb-5">
        <ol className="flex h-40 items-end gap-2 sm:gap-3" aria-label="Completed tasks per day">
          {history.map((day) => (
            <li key={day.key} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[11px] font-medium text-zinc-500 tabular-nums opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-400">
                {day.count}
              </span>
              <div
                className={cn(
                  'w-full max-w-10 rounded-lg transition-all duration-700 ease-out',
                  day.isToday
                    ? 'bg-gradient-to-t from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/25'
                    : day.count > 0
                      ? 'bg-indigo-200 group-hover:bg-indigo-300 dark:bg-indigo-500/30 dark:group-hover:bg-indigo-500/45'
                      : 'bg-zinc-100 dark:bg-zinc-800',
                )}
                style={{ height: `${Math.max((day.count / max) * 100, 6)}%` }}
                title={`${day.count} completed`}
              />
              <span
                className={cn(
                  'text-[11px] font-medium',
                  day.isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500',
                )}
              >
                {day.label}
                <span className="sr-only">: {day.count} completed</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          {total === 0
            ? 'Complete a task to start building your streak.'
            : `Most productive day: ${best.isToday ? 'today' : best.label} with ${best.count} ${best.count === 1 ? 'task' : 'tasks'}.`}
        </p>
      </div>
    </Card>
  )
}
