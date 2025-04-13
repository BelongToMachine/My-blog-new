import { JSX, useEffect, useState } from "react"
import { highlight, ShikiProp } from "./shared"

export const ClientComponent = ({
  children,
  lang,
  initialTheme = "vitesse-light",
  colorMode,
}: ShikiProp & { initialTheme?: string; colorMode: string }) => {
  const [nodes, setNodes] = useState<JSX.Element>()
  const [theme, setTheme] = useState(initialTheme)
  const [isThemeSet, setIsThemeSet] = useState(false)

  useEffect(() => {
    if (colorMode === "dark") {
      setTheme("vitesse-black")
    } else {
      setTheme("vitesse-light")
    }
    setIsThemeSet(true)
  }, [colorMode])

  useEffect(() => {
    if (isThemeSet) {
      void highlight({ children, lang, theme }).then(setNodes)
    }
  }, [children, lang, theme, isThemeSet])

  return nodes
}
