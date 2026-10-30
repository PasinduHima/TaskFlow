import { useMemo, useState, type FormEvent } from 'react'
import { Folder, FolderOpen, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/Progress'
import { useConfirm, useTasks, useToast } from '@/hooks/useContexts'
import { cn } from '@/utils/cn'
import { routeToHash } from '@/utils/routes'
import { getCategoryColor, inputClass } from '@/utils/styles'

export function CategoriesPage() {
  const { tasks, categories, addCategory, deleteCategory } = useTasks()
  const confirm = useConfirm()
  const toast = useToast()
  const [name, setName] = useState('')

  const summaries = useMemo(
    () =>
      categories.map((category) => {
        const inCategory = tasks.filter((t) => t.category === category)
        const done = inCategory.filter((t) => t.completed).length
        return {
          name: category,
          total: inCategory.length,
          done,
          percent: inCategory.length ? Math.round((done / inCategory.length) * 100) : 0,
        }
      }),
    [tasks, categories],
  )
  const uncategorized = tasks.filter((t) => !t.category && !t.completed).length

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    if (addCategory(trimmed)) {
      toast({ title: 'Category created', description: trimmed })
      setName('')
    } else {
      toast({ title: 'Category already exists', description: trimmed, variant: 'error' })
    }
  }

  async function handleDelete(category: string, count: number) {
    const confirmed = await confirm({
      title: `Delete "${category}"?`,
      description: count
        ? `${count} ${count === 1 ? 'task' : 'tasks'} will be kept but become uncategorized.`
        : 'This category has no tasks.',
    })
    if (!confirmed) return
    deleteCategory(category)
    toast({ title: 'Category deleted', description: category, variant: 'info' })
  }

  return (
    <>
      <PageHeader title="Categories" description="Organize your work into focused areas." icon={Folder} />

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <label htmlFor="new-category" className="sr-only">
          New category name
        </label>
        <input
          id="new-category"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          maxLength={40}
          className={cn(inputClass, 'h-9 max-w-sm')}
        />
        <Button type="submit" disabled={!name.trim()}>
          <Plus />
          <span className="sm:hidden">Add</span>
          <span className="hidden sm:inline">Add category</span>
        </Button>
      </form>

      {summaries.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No categories yet"
          description="Create a category to group related tasks like Work or Personal."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {summaries.map((summary, index) => {
            const color = getCategoryColor(summary.name)
            return (
              <li
                key={summary.name}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <a
                  href={routeToHash({ view: 'category', category: summary.name })}
                  className="block rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
                >
                  <span className={cn('flex size-10 items-center justify-center rounded-xl', color.soft)}>
                    <Folder className="size-5" />
                  </span>
                  <h2 className="mt-4 truncate pr-8 text-[15px] font-semibold text-zinc-900 dark:text-white">
                    {summary.name}
                  </h2>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {summary.total === 0
                      ? 'No tasks yet'
                      : `${summary.total - summary.done} active · ${summary.done} completed`}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <ProgressBar value={summary.percent} label={`${summary.name} progress`} className="flex-1" />
                    <span className="text-xs font-medium text-zinc-500 tabular-nums dark:text-zinc-400">
                      {summary.percent}%
                    </span>
                  </div>
                </a>
                <Button
                  variant="ghost-danger"
                  size="icon-sm"
                  onClick={() => handleDelete(summary.name, summary.total)}
                  aria-label={`Delete category ${summary.name}`}
                  className="absolute top-4 right-4 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                >
                  <Trash2 />
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      {uncategorized > 0 && (
        <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
          {uncategorized} active {uncategorized === 1 ? 'task has' : 'tasks have'} no category. Assign one from the task
          editor.
        </p>
      )}
    </>
  )
}
