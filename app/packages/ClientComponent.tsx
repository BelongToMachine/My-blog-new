import { JSX, useEffect, useState } from "react"
import { highlight, ShikiProp } from "./shared"

const resolveInitialTheme = (colorMode: string, initialTheme: string) => {
  if (typeof window === "undefined") {
    return colorMode === "dark" ? "vitesse-black" : initialTheme
  }

  const domMode = document.documentElement.dataset.colorMode
  const effectiveMode = domMode === "dark" || domMode === "light"
    ? domMode
    : colorMode

  return effectiveMode === "dark" ? "vitesse-black" : "vitesse-light"
}

export const ClientComponent = ({
  children,
  lang,
  initialTheme = "vitesse-light",
  colorMode,
}: ShikiProp & { initialTheme?: string; colorMode: string }) => {
  const [nodes, setNodes] = useState<JSX.Element>()
  const [theme, setTheme] = useState(() =>
    resolveInitialTheme(colorMode, initialTheme)
  )
  const [isThemeSet, setIsThemeSet] = useState(true)

  useEffect(() => {
    setTheme(resolveInitialTheme(colorMode, initialTheme))
    setIsThemeSet(true)
  }, [colorMode, initialTheme])

  useEffect(() => {
    if (!isThemeSet) return

    let cancelled = false
    const timeout = window.setTimeout(() => {
      void highlight({ children, lang, theme })
        .then((nextNodes) => {
          if (!cancelled) {
            setNodes(nextNodes)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setNodes(undefined)
          }
        })
    }, 80)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [children, lang, theme, isThemeSet])

  return (
    nodes ?? (
      <pre className="codeblock-pre m-0 w-full overflow-auto p-4 font-mono text-[12px] leading-6 text-[#e7eef5]">
        <code>{children}</code>
      </pre>
    )
  )
}
