import { useContext, type Context } from 'react'
import {
  ConfirmContext,
  TaskEditorContext,
  TasksContext,
  ThemeContext,
  ToastContext,
} from '@/context/contexts'

function useRequiredContext<T>(context: Context<T | null>, name: string): T {
  const value = useContext(context)
  if (value === null) throw new Error(`${name} must be used inside its provider`)
  return value
}

export const useTasks = () => useRequiredContext(TasksContext, 'useTasks')
export const useTheme = () => useRequiredContext(ThemeContext, 'useTheme')
export const useToast = () => useRequiredContext(ToastContext, 'useToast').toast
export const useConfirm = () => useRequiredContext(ConfirmContext, 'useConfirm')
export const useTaskEditor = () => useRequiredContext(TaskEditorContext, 'useTaskEditor')
