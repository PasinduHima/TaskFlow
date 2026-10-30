import {
  CalendarDays,
  CircleCheckBig,
  Folder,
  LayoutDashboard,
  ListTodo,
  Star,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import type { Route, TaskViewId } from '@/types/route'

export interface NavItem {
  route: Route
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { route: { view: 'dashboard' }, label: 'Dashboard', icon: LayoutDashboard },
  { route: { view: 'tasks' }, label: 'My Tasks', icon: ListTodo },
  { route: { view: 'today' }, label: 'Today', icon: Sun },
  { route: { view: 'upcoming' }, label: 'Upcoming', icon: CalendarDays },
  { route: { view: 'important' }, label: 'Important', icon: Star },
  { route: { view: 'completed' }, label: 'Completed', icon: CircleCheckBig },
  { route: { view: 'categories' }, label: 'Categories', icon: Folder },
]

export const VIEW_META: Record<TaskViewId, { title: string; description: string; icon: LucideIcon }> = {
  tasks: { title: 'My Tasks', description: 'Everything on your list, in one place.', icon: ListTodo },
  today: {
    title: 'Today',
    description: "Focus on what's due today, plus anything that slipped.",
    icon: Sun,
  },
  upcoming: { title: 'Upcoming', description: 'Plan ahead with tasks scheduled for the days to come.', icon: CalendarDays },
  important: { title: 'Important', description: 'Starred tasks that deserve extra attention.', icon: Star },
  completed: { title: 'Completed', description: 'A history of everything you have finished.', icon: CircleCheckBig },
}

export function getRouteTitle(route: Route) {
  if (route.view === 'category') return route.category
  return NAV_ITEMS.find((item) => item.route.view === route.view)?.label ?? 'TaskFlow'
}
