import type { Task } from '@/types/task'
import { createId } from '@/utils/cn'
import { addDays, todayKey } from '@/utils/date'

export const DEFAULT_CATEGORIES = ['Work', 'Personal', 'Health', 'Learning']

/** Starter tasks shown on first launch so the app isn't empty. They can be edited or deleted like any task. */
export function createSeedTasks(): Task[] {
  const today = todayKey()
  const now = Date.now()
  const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString()

  const task = (fields: Partial<Task> & Pick<Task, 'title'>, createdHoursAgo: number): Task => ({
    id: createId(),
    description: '',
    dueDate: null,
    priority: 'medium',
    category: null,
    tags: [],
    subtasks: [],
    important: false,
    completed: false,
    completedAt: null,
    createdAt: hoursAgo(createdHoursAgo),
    updatedAt: hoursAgo(createdHoursAgo),
    ...fields,
  })
  const subtask = (title: string, completed = false) => ({ id: createId(), title, completed })

  return [
    task(
      {
        title: 'Welcome to TaskFlow',
        description: 'Click any task to edit it. Press N anywhere to create a new one, and / to search.',
        dueDate: today,
        category: 'Personal',
        tags: ['getting-started'],
        subtasks: [
          subtask('Open this task in the editor', true),
          subtask('Create your first task'),
          subtask('Try switching to dark mode'),
        ],
      },
      0.1,
    ),
    task(
      {
        title: 'Prepare Q4 planning deck',
        description: 'Summarize roadmap progress, key metrics and hiring needs for the leadership review.',
        dueDate: addDays(today, 1),
        priority: 'high',
        category: 'Work',
        tags: ['planning', 'leadership'],
        important: true,
        subtasks: [
          subtask('Collect metrics from analytics', true),
          subtask('Draft roadmap slides'),
          subtask('Review with the team'),
        ],
      },
      26,
    ),
    task(
      {
        title: 'Review open pull requests',
        description: 'Three PRs are waiting on review in the web repo.',
        dueDate: addDays(today, -1),
        priority: 'high',
        category: 'Work',
        tags: ['code-review'],
      },
      50,
    ),
    task({ title: 'Book a dentist appointment', dueDate: addDays(today, 4), priority: 'low', category: 'Health' }, 30),
    task(
      {
        title: 'Read chapter 3 of "Designing Data-Intensive Applications"',
        priority: 'low',
        category: 'Learning',
        tags: ['reading'],
      },
      72,
    ),
    task({ title: 'Plan weekend hiking trip', dueDate: addDays(today, 6), category: 'Personal', tags: ['outdoors'] }, 8),
    task(
      {
        title: 'Send invoice to Acme Co.',
        priority: 'high',
        category: 'Work',
        dueDate: today,
        completed: true,
        completedAt: hoursAgo(1),
      },
      48,
    ),
    task({ title: 'Weekly grocery run', category: 'Personal', completed: true, completedAt: hoursAgo(26) }, 60),
    task(
      { title: '30-minute morning run', category: 'Health', priority: 'low', completed: true, completedAt: hoursAgo(50) },
      80,
    ),
  ]
}
