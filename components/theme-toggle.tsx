"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const emptySubscribe = () => () => {}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const toggleTheme = () => {
    const nextTheme = (resolvedTheme || theme) === "dark" ? "light" : "dark"
    setTheme(nextTheme)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`relative size-9 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors ${className ?? ""}`}
      aria-label="Toggle theme"
      title={isMounted ? `Switch to ${(resolvedTheme || theme) === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
    >
      <Sun className="size-4.5 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute size-4.5 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100 text-sky-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
