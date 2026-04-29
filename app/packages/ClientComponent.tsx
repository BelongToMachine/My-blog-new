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
