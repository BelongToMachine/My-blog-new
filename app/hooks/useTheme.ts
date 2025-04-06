// hooks/useTheme.ts
import { useContext } from "react"
import { ThemeContext } from "@/app/context/DarkModeContext" // update the path as needed

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
