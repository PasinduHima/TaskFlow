import { AppShell } from '@/components/layout/AppShell'
import { ConfirmProvider } from '@/context/ConfirmProvider'
import { TaskEditorProvider } from '@/context/TaskEditorProvider'
import { TasksProvider } from '@/context/TasksProvider'
import { ThemeProvider } from '@/context/ThemeProvider'
import { ToastProvider } from '@/context/ToastProvider'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ConfirmProvider>
          <TasksProvider>
            <TaskEditorProvider>
              <AppShell />
            </TaskEditorProvider>
          </TasksProvider>
        </ConfirmProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
