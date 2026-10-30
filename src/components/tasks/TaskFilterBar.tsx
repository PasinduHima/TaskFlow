import { Search, X } from 'lucide-react'
import type { TaskFilters } from '@/types/task'
import { DEFAULT_FILTERS } from '@/utils/tasks'
import { inputClass } from '@/utils/styles'
import { cn } from '@/utils/cn'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'

interface TaskFilterBarProps {
  filters: TaskFilters
  onChange: (filters: TaskFilters) => void
  search: string
  onSearchChange: (value: string) => void
  showStatus?: boolean
  showDue?: boolean
}

export function TaskFilterBar({
  filters,
  onChange,
  search,
  onSearchChange,
  showStatus = true,
  showDue = true,
}: TaskFilterBarProps) {
  const set = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => onChange({ ...filters, [key]: value })
  const hasActiveFilters =
    filters.priority !== 'all' || filters.status !== 'all' || filters.due !== 'all' || search.trim() !== ''

  return (
    <div className="mb-6 space-y-3">
      {/* The header search covers larger screens. */}
      <div className="relative md:hidden">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
          className={cn(inputClass, 'h-10 pl-9')}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter and sort tasks">
        <Select
          aria-label="Filter by priority"
          value={filters.priority}
          active={filters.priority !== 'all'}
          onChange={(e) => set('priority', e.target.value as TaskFilters['priority'])}
          className="min-w-0 flex-1 sm:flex-none"
        >
          <option value="all">All priorities</option>
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </Select>

        {showStatus && (
          <Select
            aria-label="Filter by status"
            value={filters.status}
            active={filters.status !== 'all'}
            onChange={(e) => set('status', e.target.value as TaskFilters['status'])}
            className="min-w-0 flex-1 sm:flex-none"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </Select>
        )}

        {showDue && (
          <Select
            aria-label="Filter by due date"
            value={filters.due}
            active={filters.due !== 'all'}
            onChange={(e) => set('due', e.target.value as TaskFilters['due'])}
            className="min-w-0 flex-1 sm:flex-none"
          >
            <option value="all">Any due date</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due today</option>
            <option value="week">Next 7 days</option>
            <option value="none">No due date</option>
          </Select>
        )}

        <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange({ ...DEFAULT_FILTERS, sort: filters.sort })
                onSearchChange('')
              }}
            >
              <X />
              Clear
            </Button>
          )}
          <Select
            aria-label="Sort tasks"
            value={filters.sort}
            onChange={(e) => set('sort', e.target.value as TaskFilters['sort'])}
            className="ml-auto min-w-0 flex-1 sm:flex-none"
          >
            <option value="created-desc">Newest first</option>
            <option value="created-asc">Oldest first</option>
            <option value="priority">Priority</option>
            <option value="due">Due date</option>
          </Select>
        </div>
      </div>
    </div>
  )
}
