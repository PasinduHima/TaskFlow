import { useState } from 'react'
import { Calendar, ChevronDown, Flag, ListChecks, Pencil, Star, Trash2 } from 'lucide-react'
import { useTaskEditor, useTasks } from '@/hooks/useContexts'
import { useTaskActions } from '@/hooks/useTaskActions'
import type { Task } from '@/types/task'
import { cn } from '@/utils/cn'
import { formatDueDate, todayKey } from '@/utils/date'
import { getCategoryColor, PRIORITY_STYLES } from '@/utils/styles'
import { isOverdue } from '@/utils/tasks'
import { TaskCheckbox } from './TaskCheckbox'

const MAX_VISIBLE_TAGS = 2

interface TaskItemProps {
  task: Task
  compact?: boolean
}

export function TaskItem({ task, compact = false }: TaskItemProps) {
  const { toggleImportant, toggleSubtask } = useTasks()
  const { openEdit } = useTaskEditor()
  const { removeTask, toggleTask } = useTaskActions()
  const [expanded, setExpanded] = useState(false)

  const today = todayKey()
  const overdue = isOverdue(task, today)
  const doneSubtasks = task.subtasks.filter((s) => s.completed).length
  const hiddenTags = task.tags.length - MAX_VISIBLE_TAGS
  const priority = PRIORITY_STYLES[task.priority]

  return (
    <article
      className={cn(
        'group relative rounded-xl border transition-all duration-200',
        task.completed
          ? 'border-zinc-200/60 bg-zinc-50/70 dark:border-zinc-800/60 dark:bg-zinc-900/30'
          : 'border-zinc-200/80 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-900/[0.04] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:shadow-black/20',
      )}
    >
      <div className={cn('flex items-start gap-3', compact ? 'px-3.5 py-3' : 'p-4')}>
        <TaskCheckbox
          checked={task.completed}
          onChange={() => toggleTask(task)}
          priority={task.priority}
          label={`Mark "${task.title}" as ${task.completed ? 'not completed' : 'completed'}`}
          className="mt-0.5"
        />

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => openEdit(task)}
            className="block w-full cursor-pointer rounded text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <span
              className={cn(
                'block text-sm leading-5 font-medium break-words transition-colors',
                task.completed
                  ? 'text-zinc-400 line-through decoration-zinc-300 dark:text-zinc-500 dark:decoration-zinc-600'
                  : 'text-zinc-900 dark:text-zinc-100',
              )}
            >
              {task.title}
            </span>
            {!compact && task.description && (
              <span className="mt-1 line-clamp-2 block text-[13px] leading-5 text-zinc-500 dark:text-zinc-400">
                {task.description}
              </span>
            )}
          </button>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-500 empty:hidden dark:text-zinc-400">
            {task.dueDate && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 font-medium',
                  overdue && 'text-rose-600 dark:text-rose-400',
                  !overdue && task.dueDate === today && !task.completed && 'text-indigo-600 dark:text-indigo-400',
                )}
              >
                <Calendar className="size-3.5" />
                {formatDueDate(task.dueDate, today)}
              </span>
            )}
            {task.priority !== 'low' && (
              <span className={cn('inline-flex items-center gap-1 font-medium', priority.text)}>
                <Flag className="size-3.5" />
                {priority.label}
              </span>
            )}
            {task.category && (
              <span className="inline-flex items-center gap-1.5">
                <span className={cn('size-2 rounded-full', getCategoryColor(task.category).dot)} />
                {task.category}
              </span>
            )}
            {!compact &&
              task.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  #{tag}
                </span>
              ))}
            {!compact && hiddenTags > 0 && <span className="font-medium">+{hiddenTags}</span>}
            {task.subtasks.length > 0 && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-label={`${expanded ? 'Hide' : 'Show'} subtasks (${doneSubtasks} of ${task.subtasks.length} done)`}
                className="-mx-1 inline-flex cursor-pointer items-center gap-1 rounded-md px-1 py-0.5 font-medium transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <ListChecks className="size-3.5" />
                {doneSubtasks}/{task.subtasks.length}
                <ChevronDown className={cn('size-3 transition-transform duration-200', expanded && 'rotate-180')} />
              </button>
            )}
          </div>
        </div>

        <div className="-mt-1 -mr-1.5 flex items-center">
          <IconAction
            label={task.important ? 'Remove from important' : 'Mark as important'}
            onClick={() => toggleImportant(task.id)}
            tone={task.important ? 'starred' : 'default'}
            pressed={task.important}
          >
            <Star className={cn(task.important && 'fill-current')} />
          </IconAction>
          {!compact && (
            <>
              <IconAction label="Edit task" onClick={() => openEdit(task)}>
                <Pencil />
              </IconAction>
              <IconAction
                label="Delete task"
                onClick={() => removeTask(task)}
                tone="danger"
              >
                <Trash2 />
              </IconAction>
            </>
          )}
        </div>
      </div>

      {expanded && task.subtasks.length > 0 && (
        <ul className="animate-fade-in space-y-1 border-t border-zinc-100 px-4 py-3 pl-12 dark:border-zinc-800">
          {task.subtasks.map((subtask) => (
            <li key={subtask.id} className="flex items-center gap-2.5 py-0.5">
              <TaskCheckbox
                size="sm"
                checked={subtask.completed}
                onChange={() => toggleSubtask(task.id, subtask.id)}
                label={`Mark subtask "${subtask.title}" as ${subtask.completed ? 'not completed' : 'completed'}`}
              />
              <span
                className={cn(
                  'text-[13px] break-words',
                  subtask.completed ? 'text-zinc-400 line-through dark:text-zinc-500' : 'text-zinc-700 dark:text-zinc-300',
                )}
              >
                {subtask.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

const ACTION_TONES = {
  default:
    'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200',
  danger:
    'text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400',
  starred: 'text-amber-500 hover:bg-amber-50 hover:text-amber-600 dark:text-amber-400 dark:hover:bg-amber-500/10',
}

interface IconActionProps {
  label: string
  onClick: () => void
  children: React.ReactNode
  tone?: keyof typeof ACTION_TONES
  pressed?: boolean
}

function IconAction({ label, onClick, children, tone = 'default', pressed }: IconActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn(
        'flex size-8 cursor-pointer items-center justify-center rounded-lg transition duration-150 active:scale-90 [&_svg]:size-4',
        // On hover-capable layouts, reveal secondary actions on hover/focus; starred stays visible.
        tone !== 'starred' && 'focus-visible:opacity-100 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100',
        ACTION_TONES[tone],
      )}
    >
      {children}
    </button>
  )
}
