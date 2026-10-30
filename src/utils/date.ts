const DAY_MS = 86_400_000

const pad = (n: number) => String(n).padStart(2, '0')

/** Formats a Date as a local `YYYY-MM-DD` key. */
export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayKey() {
  return toDateKey(new Date())
}

export function parseDateKey(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(key: string, days: number) {
  const date = parseDateKey(key)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

export function diffInDays(from: string, to: string) {
  return Math.round((parseDateKey(to).getTime() - parseDateKey(from).getTime()) / DAY_MS)
}

/** Human-friendly label for a date key: "Today", "Tomorrow", "Friday", "Fri, Nov 14". */
export function formatDueDate(key: string, today = todayKey()) {
  const diff = diffInDays(today, key)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'

  const date = parseDateKey(key)
  if (diff > 1 && diff < 7) return date.toLocaleDateString(undefined, { weekday: 'long' })
  return formatShortDate(date)
}

export function formatShortDate(date: Date) {
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

export function formatLongDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatRelativeTime(iso: string) {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return rtf.format(-minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (hours < 24) return rtf.format(-hours, 'hour')
  const days = Math.round(hours / 24)
  if (days < 7) return rtf.format(-days, 'day')
  return formatShortDate(new Date(iso))
}

/** Describes how far away a due date is, e.g. "In 3 days" or "2 days late". */
export function formatDaysLeft(key: string, today = todayKey()) {
  const diff = diffInDays(today, key)
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  if (diff > 1) return `In ${diff} days`
  if (diff === -1) return '1 day late'
  return `${-diff} days late`
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
