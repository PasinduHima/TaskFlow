import { useRef, useState } from 'react'
import { useTaskEditor } from '@/hooks/useContexts'
import { useHashRoute } from '@/hooks/useHashRoute'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { TasksPage } from '@/pages/TasksPage'
import { navigate } from '@/utils/routes'
import { getCreateDefaults } from '@/utils/tasks'
import { Modal } from '../ui/Modal'
import { Header } from './Header'
import { MobileTabBar } from './MobileTabBar'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const { route, key } = useHashRoute()
  const { openCreate } = useTaskEditor()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const create = () => openCreate(getCreateDefaults(route))

  function handleSearchChange(value: string) {
    setSearch(value)
    // Search lives on the task lists, so jump there when typing from other pages.
    if (value.trim() && (route.view === 'dashboard' || route.view === 'categories')) navigate({ view: 'tasks' })
  }

  useKeyboardShortcuts({
    n: create,
    '/': () => searchRef.current?.focus(),
  })

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-zinc-200/70 bg-zinc-100/50 lg:block dark:border-zinc-800/70 dark:bg-zinc-900/30">
        <Sidebar route={route} onCreate={create} />
      </aside>

      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} variant="drawer" label="Navigation">
        <Sidebar
          route={route}
          onNavigate={() => setMenuOpen(false)}
          onCreate={() => {
            setMenuOpen(false)
            create()
          }}
        />
      </Modal>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          route={route}
          search={search}
          onSearchChange={handleSearchChange}
          searchRef={searchRef}
          onOpenMenu={() => setMenuOpen(true)}
          onCreate={create}
        />
        <main className="flex-1 px-4 pt-6 pb-28 sm:px-6 sm:pt-8 lg:px-10 lg:pb-12">
          <div key={key} className="mx-auto max-w-5xl animate-fade-in">
            {route.view === 'dashboard' ? (
              <DashboardPage />
            ) : route.view === 'categories' ? (
              <CategoriesPage />
            ) : (
              <TasksPage route={route} search={search} onSearchChange={setSearch} />
            )}
          </div>
        </main>
      </div>

      <MobileTabBar route={route} onCreate={create} />
    </div>
  )
}
