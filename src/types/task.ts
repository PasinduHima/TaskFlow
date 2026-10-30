export type Priority = 'low' | 'medium' | 'high'

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  /** Local calendar date in `YYYY-MM-DD` format. */
  dueDate: string | null
  priority: Priority
  category: string | null
  tags: string[]
  subtasks: Subtask[]
  important: boolean
  completed: boolean
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

/** The user-editable fields of a task. */
export type TaskDraft = Pick<
  Task,
  'title' | 'description' | 'dueDate' | 'priority' | 'category' | 'tags' | 'subtasks' | 'important'
>

export type StatusFilter = 'all' | 'active' | 'completed'
export type DueFilter = 'all' | 'overdue' | 'today' | 'week' | 'none'
export type SortOption = 'created-desc' | 'created-asc' | 'priority' | 'due'

export interface TaskFilters {
  priority: Priority | 'all'
  status: StatusFilter
  due: DueFilter
  sort: SortOption
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  dueToday: number
  completionRate: number
}
