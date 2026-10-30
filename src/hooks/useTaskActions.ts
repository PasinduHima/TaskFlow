import { useCallback } from 'react'
import type { Task } from '@/types/task'
import { useConfirm, useTasks, useToast } from './useContexts'

/** Task actions that involve confirmation or feedback, shared by every view. */
export function useTaskActions() {
  const { deleteTask, restoreTask, toggleComplete, clearCompleted, restoreTasks } = useTasks()
  const confirm = useConfirm()
  const toast = useToast()

  const removeTask = useCallback(
    async (task: Task) => {
      const confirmed = await confirm({
        title: 'Delete this task?',
        description: `"${task.title}" and its subtasks will be removed.`,
      })
      if (!confirmed) return
      deleteTask(task.id)
      toast({
        title: 'Task deleted',
        description: task.title,
        variant: 'info',
        action: { label: 'Undo', onClick: () => restoreTask(task) },
      })
    },
    [confirm, deleteTask, restoreTask, toast],
  )

  const toggleTask = useCallback(
    (task: Task) => {
      toggleComplete(task.id)
      if (!task.completed) {
        toast({
          title: 'Task completed',
          description: task.title,
          action: { label: 'Undo', onClick: () => toggleComplete(task.id) },
        })
      }
    },
    [toggleComplete, toast],
  )

  const removeCompleted = useCallback(
    async (count: number) => {
      const confirmed = await confirm({
        title: `Clear ${count} completed ${count === 1 ? 'task' : 'tasks'}?`,
        description: 'Completed tasks will be permanently removed from your history.',
        confirmLabel: 'Clear all',
      })
      if (!confirmed) return
      const removed = clearCompleted()
      toast({
        title: `Cleared ${removed.length} ${removed.length === 1 ? 'task' : 'tasks'}`,
        variant: 'info',
        action: { label: 'Undo', onClick: () => restoreTasks(removed) },
      })
    },
    [confirm, clearCompleted, restoreTasks, toast],
  )

  return { removeTask, toggleTask, removeCompleted }
}
