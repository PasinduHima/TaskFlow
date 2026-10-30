import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { TaskForm } from '@/components/tasks/TaskForm'
import { Modal } from '@/components/ui/Modal'
import type { Task, TaskDraft } from '@/types/task'
import { TaskEditorContext } from './contexts'

type EditorState = { key: number; task: Task | null; defaults?: Partial<TaskDraft> }

/** Owns the create/edit slide-over so any component can open it. */
export function TaskEditorProvider({ children }: { children: ReactNode }) {
  const [editor, setEditor] = useState<EditorState | null>(null)

  const openCreate = useCallback((defaults?: Partial<TaskDraft>) => {
    setEditor({ key: Date.now(), task: null, defaults })
  }, [])
  const openEdit = useCallback((task: Task) => setEditor({ key: Date.now(), task }), [])
  const close = useCallback(() => setEditor(null), [])

  const value = useMemo(() => ({ openCreate, openEdit }), [openCreate, openEdit])

  return (
    <TaskEditorContext value={value}>
      {children}
      <Modal open={editor !== null} onClose={close} variant="panel" labelledBy="task-form-title">
        {editor && <TaskForm key={editor.key} task={editor.task} defaults={editor.defaults} onClose={close} />}
      </Modal>
    </TaskEditorContext>
  )
}
