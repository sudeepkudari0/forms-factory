import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useAtom } from "jotai"
import { useTheme } from "next-themes"
import * as React from "react"
import { atoms } from "./atoms/atom"

export function ModeToggle() {
  const { theme, setTheme: nextThemeSetter } = useTheme()
  const [_darkMode, setDarkMode] = useAtom(atoms.darkModeAtom)

  React.useEffect(() => {
    setDarkMode(theme === "dark")
  }, [setDarkMode, theme])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    nextThemeSetter(newTheme)
    setDarkMode(newTheme === "dark")
  }

  return (
    <Button variant="ghost" size="sm" className="w-10 px-0" onClick={toggleTheme}>
      <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
