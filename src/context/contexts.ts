import { createContext } from 'react'
import type { Theme } from '@/types/route'
import type { Task, TaskDraft } from '@/types/task'

export interface TasksContextValue {
  tasks: Task[]
  categories: string[]
  addTask: (draft: TaskDraft) => Task
  updateTask: (id: string, draft: TaskDraft) => void
  deleteTask: (id: string) => void
  restoreTask: (task: Task) => void
  toggleComplete: (id: string) => void
  toggleImportant: (id: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  clearCompleted: () => Task[]
  restoreTasks: (tasks: Task[]) => void
  addCategory: (name: string) => boolean
  deleteCategory: (name: string) => void
}

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

export interface ToastOptions {
  title: string
  description?: string
  variant?: 'success' | 'info' | 'error'
  action?: { label: string; onClick: () => void }
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => void
}

export interface ConfirmOptions {
  title: string
  description: string
  confirmLabel?: string
}

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

export interface TaskEditorContextValue {
  openCreate: (defaults?: Partial<TaskDraft>) => void
  openEdit: (task: Task) => void
}

export const TasksContext = createContext<TasksContextValue | null>(null)
export const ThemeContext = createContext<ThemeContextValue | null>(null)
export const ToastContext = createContext<ToastContextValue | null>(null)
export const ConfirmContext = createContext<ConfirmFn | null>(null)
export const TaskEditorContext = createContext<TaskEditorContextValue | null>(null)
