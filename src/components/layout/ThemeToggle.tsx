import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useContexts'
import { cn } from '@/utils/cn'
import { Button } from '../ui/Button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="relative overflow-hidden"
    >
      <Sun
        className={cn(
          'absolute transition-all duration-300',
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0',
        )}
      />
      <Moon
        className={cn(
          'absolute transition-all duration-300',
          isDark ? 'scale-50 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
        )}
      />
    </Button>
  )
}
