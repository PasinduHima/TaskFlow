import type { Theme } from '@/types/route'
import type { Task } from '@/types/task'

export const STORAGE_KEYS = {
  tasks: 'taskflow:tasks',
  categories: 'taskflow:categories',
  theme: 'taskflow:theme',
} as const

function parse(raw: string | null): unknown {
  try {
    return raw === null ? null : JSON.parse(raw)
  } catch {
    return null
  }
}

function read(key: string): unknown {
  try {
    return parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be full or unavailable (e.g. private mode); the app keeps working in memory.
  }
}

/** Validates stored data and fills in any fields missing from older versions. */
function toTasks(value: unknown): Task[] | null {
  if (!Array.isArray(value)) return null
  const now = new Date().toISOString()

  return value.flatMap((item: Partial<Task> | null): Task[] => {
    if (typeof item?.id !== 'string' || typeof item.title !== 'string') return []
    return [
      {
        id: item.id,
        title: item.title,
        description: item.description ?? '',
        dueDate: item.dueDate ?? null,
        priority: item.priority === 'high' || item.priority === 'low' ? item.priority : 'medium',
        category: item.category ?? null,
        tags: Array.isArray(item.tags) ? item.tags : [],
        subtasks: Array.isArray(item.subtasks) ? item.subtasks : [],
        important: Boolean(item.important),
        completed: Boolean(item.completed),
        createdAt: item.createdAt ?? now,
        updatedAt: item.updatedAt ?? item.createdAt ?? now,
        completedAt: item.completedAt ?? null,
      },
    ]
  })
}

function toCategories(value: unknown) {
  return Array.isArray(value) ? value.filter((c): c is string => typeof c === 'string') : null
}

export const taskStorage = {
  load: () => toTasks(read(STORAGE_KEYS.tasks)),
  fromRaw: (raw: string | null) => toTasks(parse(raw)),
  save: (tasks: Task[]) => write(STORAGE_KEYS.tasks, tasks),
}

export const categoryStorage = {
  load: () => toCategories(read(STORAGE_KEYS.categories)),
  fromRaw: (raw: string | null) => toCategories(parse(raw)),
  save: (categories: string[]) => write(STORAGE_KEYS.categories, categories),
}

export const themeStorage = {
  load: (): Theme | null => {
    const value = read(STORAGE_KEYS.theme)
    return value === 'dark' || value === 'light' ? value : null
  },
  save: (theme: Theme) => write(STORAGE_KEYS.theme, theme),
}
