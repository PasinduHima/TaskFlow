import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Flag, Plus, Star, Trash2, X } from 'lucide-react'
import { useTasks, useToast } from '@/hooks/useContexts'
import { useTaskActions } from '@/hooks/useTaskActions'
import type { Priority, Task, TaskDraft } from '@/types/task'
import { cn, createId } from '@/utils/cn'
import { addDays, todayKey } from '@/utils/date'
import { inputClass, PRIORITIES, PRIORITY_STYLES } from '@/utils/styles'
import { Button } from '../ui/Button'
import { Kbd } from '../ui/Kbd'
import { Select } from '../ui/Select'

interface TaskFormProps {
  task: Task | null
  defaults?: Partial<TaskDraft>
  onClose: () => void
}

const EMPTY_DRAFT: TaskDraft = {
  title: '',
  description: '',
  dueDate: null,
  priority: 'medium',
  category: null,
  tags: [],
  subtasks: [],
  important: false,
}

function toDraft(task: Task): TaskDraft {
  const { title, description, dueDate, priority, category, tags, subtasks, important } = task
  return { title, description, dueDate, priority, category, tags, subtasks, important }
}

export function TaskForm({ task, defaults, onClose }: TaskFormProps) {
  const { addTask, updateTask, categories } = useTasks()
  const { removeTask } = useTaskActions()
  const toast = useToast()
  const [draft, setDraft] = useState<TaskDraft>(() => (task ? toDraft(task) : { ...EMPTY_DRAFT, ...defaults }))
  const [error, setError] = useState<string | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) => setDraft((d) => ({ ...d, [key]: value }))
  const today = todayKey()
  const quickDates = [
    { label: 'Today', value: today },
    { label: 'Tomorrow', value: addDays(today, 1) },
    { label: 'Next week', value: addDays(today, 7) },
  ]
  // Keep a category that was deleted elsewhere selectable while editing.
  const categoryOptions =
    draft.category && !categories.includes(draft.category) ? [...categories, draft.category] : categories

  function handleSubmit(event?: FormEvent) {
    event?.preventDefault()
    const title = draft.title.trim()
    if (!title) {
      setError('Give your task a title.')
      titleRef.current?.focus()
      return
    }

    const clean: TaskDraft = {
      ...draft,
      title,
      description: draft.description.trim(),
      subtasks: draft.subtasks.map((s) => ({ ...s, title: s.title.trim() })).filter((s) => s.title),
    }

    if (task) {
      updateTask(task.id, clean)
      toast({ title: 'Changes saved', description: title })
    } else {
      addTask(clean)
      toast({ title: 'Task created', description: title })
    }
    onClose()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) handleSubmit()
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex min-h-0 flex-1 flex-col" noValidate>
      <header className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 sm:px-6 dark:border-zinc-800">
        <div>
          <h2 id="task-form-title" className="text-base font-semibold text-zinc-900 dark:text-white">
            {task ? 'Edit task' : 'New task'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {task ? 'Update the details below.' : 'Capture what needs to get done.'}
          </p>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
          <X />
        </Button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
        <div>
          <input
            ref={titleRef}
            data-autofocus
            value={draft.title}
            onChange={(e) => {
              set('title', e.target.value)
              if (error) setError(null)
            }}
            placeholder="What needs to be done?"
            aria-label="Task title"
            aria-invalid={error !== null}
            aria-describedby={error ? 'title-error' : undefined}
            maxLength={200}
            className="w-full border-0 bg-transparent p-0 text-xl font-semibold tracking-tight text-zinc-900 placeholder:text-zinc-300 focus:ring-0 focus:outline-none dark:text-white dark:placeholder:text-zinc-600"
          />
          {error && (
            <p id="title-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
              {error}
            </p>
          )}
          <textarea
            value={draft.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Add a description..."
            aria-label="Description"
            rows={3}
            className="mt-3 w-full resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-zinc-600 placeholder:text-zinc-400 focus:ring-0 focus:outline-none dark:text-zinc-300 dark:placeholder:text-zinc-600"
          />
        </div>

        <Field label="Due date" htmlFor="task-due">
          <div className="flex flex-wrap gap-2">
            {quickDates.map((option) => (
              <Chip key={option.label} active={draft.dueDate === option.value} onClick={() => set('dueDate', option.value)}>
                {option.label}
              </Chip>
            ))}
            {draft.dueDate && <Chip onClick={() => set('dueDate', null)}>No date</Chip>}
          </div>
          <input
            id="task-due"
            type="date"
            value={draft.dueDate ?? ''}
            onChange={(e) => set('dueDate', e.target.value || null)}
            className={cn(inputClass, 'mt-2.5 h-10')}
          />
        </Field>

        <Field label="Priority" as="fieldset">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/70">
            {PRIORITIES.map((p: Priority) => (
              <label key={p} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={draft.priority === p}
                  onChange={() => set('priority', p)}
                  className="peer sr-only"
                />
                <span className="flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-medium text-zinc-500 transition peer-checked:bg-white peer-checked:text-zinc-900 peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 hover:text-zinc-900 dark:text-zinc-400 dark:peer-checked:bg-zinc-700 dark:peer-checked:text-white dark:hover:text-white">
                  <Flag className={cn('size-3.5', PRIORITY_STYLES[p].text)} />
                  {PRIORITY_STYLES[p].label}
                </span>
              </label>
            ))}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" htmlFor="task-category">
            <Select
              id="task-category"
              value={draft.category ?? ''}
              onChange={(e) => set('category', e.target.value || null)}
              className="[&_select]:h-10"
            >
              <option value="">No category</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Importance">
            <button
              type="button"
              role="switch"
              aria-checked={draft.important}
              onClick={() => set('important', !draft.important)}
              className={cn(
                'flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium shadow-xs transition',
                draft.important
                  ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700',
              )}
            >
              <Star className={cn('size-4', draft.important && 'fill-current')} />
              {draft.important ? 'Marked important' : 'Mark as important'}
            </button>
          </Field>
        </div>

        <Field label="Tags" htmlFor="task-tags">
          <TagInput tags={draft.tags} onChange={(tags) => set('tags', tags)} />
        </Field>

        <Field label="Subtasks">
          <SubtaskEditor subtasks={draft.subtasks} onChange={(subtasks) => set('subtasks', subtasks)} />
        </Field>
      </div>

      <footer className="flex items-center gap-2 border-t border-zinc-100 bg-zinc-50/60 px-5 py-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-900/60">
        {task && (
          <Button
            variant="ghost-danger"
            onClick={() => {
              onClose()
              void removeTask(task)
            }}
          >
            <Trash2 />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        )}
        <span className="mr-auto hidden items-center gap-1 text-xs text-zinc-400 sm:flex">
          {!task && (
            <>
              <Kbd>Ctrl</Kbd>
              <Kbd>Enter</Kbd>
              <span className="ml-0.5">to save</span>
            </>
          )}
        </span>
        <Button variant="secondary" onClick={onClose} className="ml-auto sm:ml-0">
          Cancel
        </Button>
        <Button type="submit">{task ? 'Save changes' : 'Create task'}</Button>
      </footer>
    </form>
  )
}

interface FieldProps {
  label: string
  htmlFor?: string
  as?: 'div' | 'fieldset'
  children: React.ReactNode
}

function Field({ label, htmlFor, as = 'div', children }: FieldProps) {
  const labelClass = 'mb-2 block text-xs font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400'
  if (as === 'fieldset') {
    return (
      <fieldset>
        <legend className={labelClass}>{label}</legend>
        {children}
      </fieldset>
    )
  }
  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={labelClass}>
          {label}
        </label>
      ) : (
        <span className={labelClass}>{label}</span>
      )}
      {children}
    </div>
  )
}

function Chip({ active = false, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'h-8 cursor-pointer rounded-full border px-3 text-xs font-medium transition active:scale-95',
        active
          ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-300'
          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200',
      )}
    >
      {children}
    </button>
  )
}

function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [value, setValue] = useState('')

  function commit() {
    const tag = value.trim().replace(/^#/, '').replace(/\s+/g, '-').toLowerCase()
    if (tag && !tags.includes(tag)) onChange([...tags, tag])
    setValue('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      commit()
    } else if (event.key === 'Backspace' && !value && tags.length) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div
      className={cn(
        inputClass,
        'flex min-h-10 flex-wrap items-center gap-1.5 py-1.5 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:focus-within:border-indigo-400',
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-indigo-50 py-0.5 pr-1 pl-2 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
        >
          #{tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            aria-label={`Remove tag ${tag}`}
            className="cursor-pointer rounded p-0.5 transition hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        id="task-tags"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={tags.length ? '' : 'Type a tag and press Enter'}
        className="min-w-24 flex-1 border-0 bg-transparent p-0 text-sm focus:ring-0 focus:outline-none"
      />
    </div>
  )
}

function SubtaskEditor({
  subtasks,
  onChange,
}: {
  subtasks: TaskDraft['subtasks']
  onChange: (subtasks: TaskDraft['subtasks']) => void
}) {
  const [value, setValue] = useState('')

  function add() {
    const title = value.trim()
    if (!title) return
    onChange([...subtasks, { id: createId(), title, completed: false }])
    setValue('')
  }

  return (
    <div className="space-y-2">
      {subtasks.length > 0 && (
        <ul className="space-y-1.5">
          {subtasks.map((subtask, index) => (
            <li key={subtask.id} className="group/sub flex items-center gap-2">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() =>
                  onChange(subtasks.map((s) => (s.id === subtask.id ? { ...s, completed: !s.completed } : s)))
                }
                aria-label={`Subtask ${index + 1} completed`}
                className="size-4 shrink-0 cursor-pointer rounded accent-indigo-600"
              />
              <input
                value={subtask.title}
                onChange={(e) => onChange(subtasks.map((s) => (s.id === subtask.id ? { ...s, title: e.target.value } : s)))}
                aria-label={`Subtask ${index + 1}`}
                className={cn(inputClass, 'h-9 py-1', subtask.completed && 'text-zinc-400 line-through')}
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onChange(subtasks.filter((s) => s.id !== subtask.id))}
                aria-label={`Remove subtask ${index + 1}`}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
              e.preventDefault()
              add()
            }
          }}
          placeholder="Add a subtask"
          aria-label="New subtask"
          className={cn(inputClass, 'h-9 py-1')}
        />
        <Button variant="secondary" onClick={add} disabled={!value.trim()} aria-label="Add subtask">
          <Plus />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>
    </div>
  )
}
