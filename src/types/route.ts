export type TaskViewId = 'tasks' | 'today' | 'upcoming' | 'completed' | 'important'

export type Route =
  | { view: 'dashboard' }
  | { view: 'categories' }
  | { view: TaskViewId }
  | { view: 'category'; category: string }

export type Theme = 'light' | 'dark'
