import { useMemo } from 'react'
import { CircleCheckBig, Clock, ListTodo, Plus, Sparkles, TriangleAlert } from 'lucide-react'
import { CompletionCard } from '@/components/dashboard/CompletionCard'
import { RecentlyCompleted, UpcomingDeadlines, ViewAllLink } from '@/components/dashboard/DeadlineList'
import { StatCard } from '@/components/dashboard/StatCard'
import { WeeklyActivity } from '@/components/dashboard/WeeklyActivity'
import { TaskList } from '@/components/tasks/TaskList'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/Progress'
import { useTaskEditor, useTasks } from '@/hooks/useContexts'
import { formatLongDate, getGreeting, todayKey } from '@/utils/date'
import { getStats, isInToday, isUpcoming, sortTasks } from '@/utils/tasks'

export function DashboardPage() {
  const { tasks } = useTasks()
  const { openCreate } = useTaskEditor()

  const data = useMemo(() => {
    const today = todayKey()
    const todays = tasks.filter((t) => isInToday(t, today))
    const todayActive = sortTasks(
      todays.filter((t) => !t.completed),
      'priority',
    )
    return {
      stats: getStats(tasks, today),
      todayDone: todays.filter((t) => t.completed).length,
      todayTotal: todays.length,
      todayActive,
      upcoming: sortTasks(
        tasks.filter((t) => isUpcoming(t, today)),
        'due',
      ).slice(0, 5),
      recent: tasks
        .filter((t) => t.completed && t.completedAt)
        .sort((a, b) => b.completedAt!.localeCompare(a.completedAt!))
        .slice(0, 5),
    }
  }, [tasks])

  const { stats } = data
  const summary =
    stats.dueToday + stats.overdue === 0
      ? 'Your day is clear. A great time to plan ahead.'
      : `You have ${stats.dueToday} ${stats.dueToday === 1 ? 'task' : 'tasks'} due today${
          stats.overdue ? ` and ${stats.overdue} overdue` : ''
        }.`

  return (
    <>
      <PageHeader
        eyebrow={formatLongDate(new Date())}
        title={`${getGreeting()}!`}
        description={summary}
        actions={
          <div className="hidden lg:block">
            <Button onClick={() => openCreate()}>
              <Plus />
              New task
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <CompletionCard stats={stats} tasks={tasks} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-3">
          <StatCard label="Total tasks" value={stats.total} hint="Across all lists" icon={ListTodo} tone="indigo" href="#/tasks" />
          <StatCard
            label="Completed"
            value={stats.completed}
            hint={`${stats.completionRate}% of all tasks`}
            icon={CircleCheckBig}
            tone="emerald"
            href="#/completed"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            hint={`${stats.dueToday} due today`}
            icon={Clock}
            tone="amber"
            href="#/tasks"
          />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            hint={stats.overdue ? 'Needs your attention' : 'Nothing overdue'}
            icon={TriangleAlert}
            tone="rose"
            href="#/today"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader
            title="Today's focus"
            description={
              data.todayTotal
                ? `${data.todayDone} of ${data.todayTotal} done · overdue tasks included`
                : 'Tasks due today and anything overdue'
            }
            action={<ViewAllLink href="#/today" />}
          />
          {data.todayTotal > 0 && (
            <div className="px-5 pb-3">
              <ProgressBar value={Math.round((data.todayDone / data.todayTotal) * 100)} label="Today's progress" />
            </div>
          )}
          <div className="px-3 pb-3 sm:px-4 sm:pb-4">
            {data.todayActive.length > 0 ? (
              <TaskList tasks={data.todayActive.slice(0, 5)} compact />
            ) : (
              <EmptyState
                compact
                icon={Sparkles}
                title={data.todayTotal ? 'All caught up for today' : 'Nothing due today'}
                description={
                  data.todayTotal
                    ? 'You finished everything on today’s list.'
                    : 'Add a task for today to start building momentum.'
                }
                action={
                  <Button variant="secondary" size="sm" onClick={() => openCreate({ dueDate: todayKey() })}>
                    <Plus />
                    Add task for today
                  </Button>
                }
              />
            )}
            {data.todayActive.length > 5 && (
              <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
                +{data.todayActive.length - 5} more in <a href="#/today" className="font-medium text-indigo-600 dark:text-indigo-400">Today</a>
              </p>
            )}
          </div>
        </Card>
        <div className="lg:col-span-2">
          <UpcomingDeadlines tasks={data.upcoming} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <WeeklyActivity tasks={tasks} />
        </div>
        <div className="lg:col-span-2">
          <RecentlyCompleted tasks={data.recent} />
        </div>
      </div>
    </>
  )
}
