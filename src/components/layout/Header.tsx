import type { RefObject } from 'react'
import { Menu, Plus, Search, X } from 'lucide-react'
import type { Route } from '@/types/route'
import { cn } from '@/utils/cn'
import { inputClass } from '@/utils/styles'
import { Button } from '../ui/Button'
import { Kbd } from '../ui/Kbd'
import { Logo } from './Logo'
import { getRouteTitle } from './navigation'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  route: Route
  search: string
  onSearchChange: (value: string) => void
  searchRef: RefObject<HTMLInputElement | null>
  onOpenMenu: () => void
  onCreate: () => void
}

export function Header({ route, search, onSearchChange, searchRef, onOpenMenu, onCreate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-zinc-50/80 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-950/80">
      <div className="flex h-16 items-center gap-2 px-4 sm:px-6 lg:px-10">
        <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" onClick={onOpenMenu} aria-label="Open navigation">
          <Menu />
        </Button>
        <div className="lg:hidden">
          <Logo />
        </div>
        <p className="hidden text-sm font-medium text-zinc-500 lg:block dark:text-zinc-400">
          TaskFlow <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-zinc-900 dark:text-white">{getRouteTitle(route)}</span>
        </p>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onSearchChange('')
                  e.currentTarget.blur()
                }
              }}
              placeholder="Search tasks..."
              aria-label="Search tasks"
              className={cn(inputClass, 'h-9 w-56 pr-14 pl-9 lg:w-72 [&::-webkit-search-cancel-button]:hidden')}
            />
            {search ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <Kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-400">/</Kbd>
            )}
          </div>
          <ThemeToggle />
          <div className="hidden sm:block lg:hidden">
            <Button onClick={onCreate}>
              <Plus />
              New task
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
