import type { Task, TaskStats } from '@/types/task'
import { PRIORITIES, PRIORITY_STYLES } from '@/utils/styles'
import { cn } from '@/utils/cn'
import { ProgressRing } from '../ui/Progress'

function getMessage(rate: number, total: number) {
  if (total === 0) return 'Add a task to start tracking progress.'
  if (rate === 100) return 'Everything is done. Time to relax!'
  if (rate >= 75) return 'Almost there. Keep the momentum going.'
  if (rate >= 40) return "You're making steady progress."
  return 'Every finished task is a step forward.'
}

export function CompletionCard({ stats, tasks }: { stats: TaskStats; tasks: Task[] }) {
  const pending = tasks.filter((t) => !t.completed)
  const byPriority = PRIORITIES.toReversed().map((p) => ({
    priority: p,
    count: pending.filter((t) => t.priority === p).length,
  }))

  return (
    <section className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-5 text-white shadow-lg shadow-indigo-600/20 sm:p-6 dark:from-indigo-600/90 dark:via-indigo-700/90 dark:to-violet-700/90 dark:shadow-none">
      <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-violet-400/20 blur-2xl" />

      <div className="relative flex items-center gap-5">
        <div className="rounded-full bg-white/10 p-1.5 ring-1 ring-white/15">
          <ProgressRing
            value={stats.completionRate}
            size={76}
            stroke={7}
            label="Overall completion"
            trackClassName="stroke-white/15"
          >
            <span className="text-lg font-semibold tabular-nums">{stats.completionRate}%</span>
          </ProgressRing>
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-indigo-100">Completion rate</h2>
          <p className="mt-1 text-lg leading-snug font-semibold">
            {stats.completed} of {stats.total} tasks done
          </p>
          <p className="mt-1 text-xs text-indigo-100/80">{getMessage(stats.completionRate, stats.total)}</p>
        </div>
      </div>

      <div className="relative mt-6">
        <div className="flex items-center justify-between text-xs text-indigo-100">
          <span>Pending by priority</span>
          <span className="tabular-nums">{pending.length} open</span>
        </div>
        <div className="mt-2 flex h-2 gap-0.5 overflow-hidden rounded-full bg-white/15">
          {byPriority.map(({ priority, count }) =>
            count > 0 ? (
              <div
                key={priority}
                className={cn('h-full transition-all duration-700', PRIORITY_STYLES[priority].dot)}
                style={{ width: `${(count / pending.length) * 100}%` }}
              />
            ) : null,
          )}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-indigo-100">
          {byPriority.map(({ priority, count }) => (
            <li key={priority} className="flex items-center gap-1.5">
              <span className={cn('size-2 rounded-full', PRIORITY_STYLES[priority].dot)} />
              {PRIORITY_STYLES[priority].label}
              <span className="font-semibold text-white tabular-nums">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
