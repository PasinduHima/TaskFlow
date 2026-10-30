import type { Route } from '@/types/route'
import type { Priority, SortOption, Task, TaskDraft, TaskFilters, TaskStats } from '@/types/task'
import { addDays, formatDueDate, formatShortDate, parseDateKey, toDateKey, todayKey } from './date'

export const PRIORITY_WEIGHT: Record<Priority, number> = { high: 3, medium: 2, low: 1 }

export const DEFAULT_FILTERS: TaskFilters = {
  priority: 'all',
  status: 'all',
  due: 'all',
  sort: 'created-desc',
}

export function isOverdue(task: Task, today = todayKey()) {
  return !task.completed && task.dueDate !== null && task.dueDate < today
}

export function isInToday(task: Task, today = todayKey()) {
  return task.dueDate === today || isOverdue(task, today)
}

export function isUpcoming(task: Task, today = todayKey()) {
  return !task.completed && task.dueDate !== null && task.dueDate > today
}

/** Returns the tasks that belong to a navigation view, before user filters. */
export function selectRouteTasks(tasks: Task[], route: Route, today = todayKey()) {
  switch (route.view) {
    case 'today':
      return tasks.filter((t) => isInToday(t, today))
    case 'upcoming':
      return tasks.filter((t) => isUpcoming(t, today))
    case 'completed':
      return tasks.filter((t) => t.completed)
    case 'important':
      return tasks.filter((t) => t.important)
    case 'category':
      return tasks.filter((t) => t.category === route.category)
    default:
      return tasks
  }
}

/** Pre-fills new tasks so they land in the view they were created from. */
export function getCreateDefaults(route: Route, today = todayKey()): Partial<TaskDraft> | undefined {
  if (route.view === 'today') return { dueDate: today }
  if (route.view === 'important') return { important: true }
  if (route.view === 'category') return { category: route.category }
  return undefined
}

export function matchesSearch(task: Task, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [task.title, task.description, task.category ?? '', ...task.tags, ...task.subtasks.map((s) => s.title)]
    .join(' ')
    .toLowerCase()
    .includes(q)
}

export function matchesFilters(task: Task, filters: TaskFilters, today = todayKey()) {
  if (filters.priority !== 'all' && task.priority !== filters.priority) return false
  if (filters.status === 'active' && task.completed) return false
  if (filters.status === 'completed' && !task.completed) return false

  switch (filters.due) {
    case 'overdue':
      return isOverdue(task, today)
    case 'today':
      return task.dueDate === today
    case 'week':
      return task.dueDate !== null && task.dueDate >= today && task.dueDate <= addDays(today, 7)
    case 'none':
      return task.dueDate === null
    default:
      return true
  }
}

const byCreatedDesc = (a: Task, b: Task) => b.createdAt.localeCompare(a.createdAt)
const byPriority = (a: Task, b: Task) => PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]

function byDueDate(a: Task, b: Task) {
  if (a.dueDate === b.dueDate) return 0
  if (a.dueDate === null) return 1
  if (b.dueDate === null) return -1
  return a.dueDate.localeCompare(b.dueDate)
}

export function sortTasks(tasks: Task[], sort: SortOption) {
  const sorted = [...tasks]
  switch (sort) {
    case 'created-asc':
      return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    case 'priority':
      return sorted.sort((a, b) => byPriority(a, b) || byDueDate(a, b))
    case 'due':
      return sorted.sort((a, b) => byDueDate(a, b) || byPriority(a, b))
    default:
      return sorted.sort(byCreatedDesc)
  }
}

export function getStats(tasks: Task[], today = todayKey()): TaskStats {
  const completed = tasks.filter((t) => t.completed).length
  return {
    total: tasks.length,
    completed,
    pending: tasks.length - completed,
    overdue: tasks.filter((t) => isOverdue(t, today)).length,
    dueToday: tasks.filter((t) => !t.completed && t.dueDate === today).length,
    completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
  }
}

export interface TaskGroup {
  id: string
  label: string
  hint?: string
  tone?: 'danger'
  tasks: Task[]
}

/** Splits a view's tasks into dated sections, or returns null for flat views. */
export function groupTasks(tasks: Task[], route: Route, today = todayKey()): TaskGroup[] | null {
  if (route.view === 'today') {
    const groups: TaskGroup[] = [
      { id: 'overdue', label: 'Overdue', tone: 'danger', tasks: tasks.filter((t) => isOverdue(t, today)) },
      { id: 'today', label: 'Today', hint: formatShortDate(new Date()), tasks: tasks.filter((t) => t.dueDate === today) },
    ]
    return groups.filter((g) => g.tasks.length > 0)
  }

  if (route.view === 'upcoming') {
    return groupBy(tasks, (t) => t.dueDate ?? '', 'asc').map(([key, items]) => ({
      id: key,
      label: formatDueDate(key, today),
      hint: formatShortDate(parseDateKey(key)),
      tasks: items,
    }))
  }

  if (route.view === 'completed') {
    return groupBy(tasks, (t) => toDateKey(new Date(t.completedAt ?? t.updatedAt)), 'desc').map(([key, items]) => ({
      id: key,
      label: formatDueDate(key, today),
      hint: formatShortDate(parseDateKey(key)),
      tasks: items,
    }))
  }

  return null
}

function groupBy(tasks: Task[], getKey: (task: Task) => string, order: 'asc' | 'desc') {
  const groups = new Map<string, Task[]>()
  for (const task of tasks) {
    const key = getKey(task)
    groups.set(key, [...(groups.get(key) ?? []), task])
  }
  return [...groups.entries()].sort(([a], [b]) => (order === 'asc' ? a.localeCompare(b) : b.localeCompare(a)))
}

/** Completed-task counts for each of the last `days` days, oldest first. */
export function getCompletionHistory(tasks: Task[], days = 7, today = todayKey()) {
  const counts = new Map<string, number>()
  for (const task of tasks) {
    if (!task.completed || !task.completedAt) continue
    const key = toDateKey(new Date(task.completedAt))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from({ length: days }, (_, i) => {
    const key = addDays(today, i - days + 1)
    return {
      key,
      label: parseDateKey(key).toLocaleDateString(undefined, { weekday: 'short' }),
      count: counts.get(key) ?? 0,
      isToday: key === today,
    }
  })
}
