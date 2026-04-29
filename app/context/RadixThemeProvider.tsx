"use client"

import { Theme } from "@radix-ui/themes"
import { ReactNode, useEffect, useState } from "react"
import { useTheme } from "../hooks/useTheme"

const RadixThemeProvider = ({ children }: { children: ReactNode }) => {
  const { colorMode } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Theme
      appearance={mounted ? colorMode : "light"}
      accentColor="sky"
      radius="small"
    >
      {children}
    </Theme>
  )
}

export default RadixThemeProvider
