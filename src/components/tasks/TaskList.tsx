import type { Task } from '@/types/task'
import { cn } from '@/utils/cn'
import type { TaskGroup } from '@/utils/tasks'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  compact?: boolean
}

export function TaskList({ tasks, compact = false }: TaskListProps) {
  return (
    <ul className={compact ? 'space-y-2' : 'space-y-2.5'}>
      {tasks.map((task, index) => (
        <li key={task.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(index, 10) * 25}ms` }}>
          <TaskItem task={task} compact={compact} />
        </li>
      ))}
    </ul>
  )
}

export function GroupedTaskList({ groups }: { groups: TaskGroup[] }) {
  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`group-${group.id}`}>
          <div className="mb-3 flex items-baseline gap-2 px-1">
            <h2
              id={`group-${group.id}`}
              className={cn(
                'text-sm font-semibold',
                group.tone === 'danger' ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-white',
              )}
            >
              {group.label}
            </h2>
            {group.hint && group.hint !== group.label && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{group.hint}</span>
            )}
            <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 tabular-nums dark:bg-zinc-800 dark:text-zinc-400">
              {group.tasks.length}
            </span>
          </div>
          <TaskList tasks={group.tasks} />
        </section>
      ))}
    </div>
  )
}
