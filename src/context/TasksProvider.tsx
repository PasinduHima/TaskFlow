import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createSeedTasks, DEFAULT_CATEGORIES } from '@/services/seed'
import { categoryStorage, STORAGE_KEYS, taskStorage } from '@/services/storage'
import type { Task, TaskDraft } from '@/types/task'
import { createId } from '@/utils/cn'
import { TasksContext, type TasksContextValue } from './contexts'

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => taskStorage.load() ?? createSeedTasks())
  const [categories, setCategories] = useState<string[]>(() => categoryStorage.load() ?? DEFAULT_CATEGORIES)

  useEffect(() => taskStorage.save(tasks), [tasks])
  useEffect(() => categoryStorage.save(categories), [categories])

  // Keep multiple open tabs in sync.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEYS.tasks) {
        const next = taskStorage.fromRaw(event.newValue)
        if (next) setTasks(next)
      } else if (event.key === STORAGE_KEYS.categories) {
        const next = categoryStorage.fromRaw(event.newValue)
        if (next) setCategories(next)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const updateWhere = useCallback((id: string, update: (task: Task) => Task) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? update(t) : t)))
  }, [])

  const addTask = useCallback((draft: TaskDraft) => {
    const now = new Date().toISOString()
    const task: Task = { ...draft, id: createId(), completed: false, completedAt: null, createdAt: now, updatedAt: now }
    setTasks((prev) => [task, ...prev])
    return task
  }, [])

  const updateTask = useCallback(
    (id: string, draft: TaskDraft) => updateWhere(id, (t) => ({ ...t, ...draft, updatedAt: new Date().toISOString() })),
    [updateWhere],
  )

  const toggleComplete = useCallback(
    (id: string) =>
      updateWhere(id, (t) => {
        const now = new Date().toISOString()
        return { ...t, completed: !t.completed, completedAt: t.completed ? null : now, updatedAt: now }
      }),
    [updateWhere],
  )

  const toggleImportant = useCallback(
    (id: string) => updateWhere(id, (t) => ({ ...t, important: !t.important, updatedAt: new Date().toISOString() })),
    [updateWhere],
  )

  const toggleSubtask = useCallback(
    (taskId: string, subtaskId: string) =>
      updateWhere(taskId, (t) => ({
        ...t,
        subtasks: t.subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s)),
        updatedAt: new Date().toISOString(),
      })),
    [updateWhere],
  )

  const deleteTask = useCallback((id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)), [])

  const restoreTasks = useCallback((restored: Task[]) => {
    setTasks((prev) => {
      const existing = new Set(prev.map((t) => t.id))
      return [...prev, ...restored.filter((t) => !existing.has(t.id))]
    })
  }, [])

  const restoreTask = useCallback((task: Task) => restoreTasks([task]), [restoreTasks])

  const clearCompleted = useCallback(() => {
    const removed = tasks.filter((t) => t.completed)
    setTasks((prev) => prev.filter((t) => !t.completed))
    return removed
  }, [tasks])

  const addCategory = useCallback(
    (name: string) => {
      const trimmed = name.trim()
      if (!trimmed || categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return false
      setCategories((prev) => [...prev, trimmed])
      return true
    },
    [categories],
  )

  const deleteCategory = useCallback((name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name))
    setTasks((prev) => prev.map((t) => (t.category === name ? { ...t, category: null } : t)))
  }, [])

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      categories,
      addTask,
      updateTask,
      deleteTask,
      restoreTask,
      restoreTasks,
      toggleComplete,
      toggleImportant,
      toggleSubtask,
      clearCompleted,
      addCategory,
      deleteCategory,
    }),
    [
      tasks,
      categories,
      addTask,
      updateTask,
      deleteTask,
      restoreTask,
      restoreTasks,
      toggleComplete,
      toggleImportant,
      toggleSubtask,
      clearCompleted,
      addCategory,
      deleteCategory,
    ],
  )

  return <TasksContext value={value}>{children}</TasksContext>
}
