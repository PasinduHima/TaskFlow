import { useMemo, useState } from 'react'
import { CircleCheckBig, Folder, Plus, SearchX, Sparkles, Star, Trash2, type LucideIcon } from 'lucide-react'
import { VIEW_META } from '@/components/layout/navigation'
import { TaskFilterBar } from '@/components/tasks/TaskFilterBar'
import { GroupedTaskList, TaskList } from '@/components/tasks/TaskList'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/Progress'
import { useTaskEditor, useTasks } from '@/hooks/useContexts'
import { useTaskActions } from '@/hooks/useTaskActions'
import type { Route } from '@/types/route'
import type { TaskFilters } from '@/types/task'
import { todayKey } from '@/utils/date'
import {
  DEFAULT_FILTERS,
  getCreateDefaults,
  groupTasks, matchesFilters, matchesSearch, selectRouteTasks, sortTasks } from '@/utils/tasks'

type TaskRoute = Exclude<Route, { view: 'dashboard' } | { view: 'categories' }>

interface TasksPageProps {
  route: TaskRoute
  search: string
  onSearchChange: (value: string) => void
}

const EMPTY_STATES: Record<TaskRoute['view'], { icon: LucideIcon; title: string; description: string }> = {
  tasks: { icon: Sparkles, title: 'Your list is empty', description: 'Create your first task and start getting things done.' },
  today: { icon: Sparkles, title: 'Nothing due today', description: 'Enjoy the free time, or plan something for today.' },
  upcoming: { icon: Sparkles, title: 'No upcoming tasks', description: 'Give tasks a future due date to see them here.' },
  important: { icon: Star, title: 'No important tasks', description: 'Star a task to keep it front and center.' },
  completed: { icon: CircleCheckBig, title: 'No completed tasks yet', description: 'Tasks you finish will be recorded here.' },
  category: { icon: Folder, title: 'This category is empty', description: 'Add a task to this category to get started.' },
}

export function TasksPage({ route, search, onSearchChange }: TasksPageProps) {
  const { tasks } = useTasks()
  const { openCreate } = useTaskEditor()
  const { removeCompleted } = useTaskActions()
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS)

  const meta =
    route.view === 'category'
      ? { title: route.category, description: 'Tasks in this category.', icon: Folder }
      : VIEW_META[route.view]

  const today = todayKey()
  const defaults = getCreateDefaults(route, today)

  const { viewTasks, visible, groups } = useMemo(() => {
    const viewTasks = selectRouteTasks(tasks, route, today)
    const filtered = viewTasks.filter((t) => matchesSearch(t, search) && matchesFilters(t, filters, today))
    let visible = sortTasks(filtered, filters.sort)
    // Keep finished work below open tasks, except in the completed history.
    if (route.view !== 'completed') visible = [...visible.filter((t) => !t.completed), ...visible.filter((t) => t.completed)]
    return { viewTasks, visible, groups: groupTasks(visible, route, today) }
  }, [tasks, route, search, filters, today])

  const done = viewTasks.filter((t) => t.completed).length
  const percent = viewTasks.length ? Math.round((done / viewTasks.length) * 100) : 0
  const showProgress = route.view !== 'completed' && route.view !== 'upcoming' && viewTasks.length > 0
  const emptyState = EMPTY_STATES[route.view]

  return (
    <>
      <PageHeader
        title={meta.title}
        description={meta.description}
        icon={meta.icon}
        actions={
          route.view === 'completed' ? (
            viewTasks.length > 0 && (
              <Button variant="secondary" onClick={() => removeCompleted(viewTasks.length)}>
                <Trash2 />
                Clear completed
              </Button>
            )
          ) : (
            <div className="hidden lg:block">
              <Button onClick={() => openCreate(defaults)}>
                <Plus />
                Add task
              </Button>
            </div>
          )
        }
      />

      {showProgress && (
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-zinc-200/80 bg-white px-4 py-3 shadow-xs dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <ProgressBar value={percent} label={`${meta.title} progress`} className="flex-1" />
          <span className="shrink-0 text-xs font-medium text-zinc-500 tabular-nums dark:text-zinc-400">
            {done}/{viewTasks.length} done · {percent}%
          </span>
        </div>
      )}

      {viewTasks.length > 0 && (
        <TaskFilterBar
          filters={filters}
          onChange={setFilters}
          search={search}
          onSearchChange={onSearchChange}
          showStatus={route.view !== 'completed' && route.view !== 'upcoming'}
          showDue={route.view !== 'today'}
        />
      )}

      {viewTasks.length === 0 ? (
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          action={
            route.view !== 'completed' && (
              <Button onClick={() => openCreate(defaults)}>
                <Plus />
                Add task
              </Button>
            )
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No matching tasks"
          description={search ? `Nothing matches "${search.trim()}" with the current filters.` : 'Try adjusting your filters.'}
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setFilters({ ...DEFAULT_FILTERS, sort: filters.sort })
                onSearchChange('')
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <p className="mb-3 px-1 text-xs text-zinc-500 dark:text-zinc-400" aria-live="polite">
            Showing {visible.length} of {viewTasks.length} {viewTasks.length === 1 ? 'task' : 'tasks'}
          </p>
          {groups ? <GroupedTaskList groups={groups} /> : <TaskList tasks={visible} />}
        </>
      )}
    </>
  )
}
