"use client"

import { Theme } from "@radix-ui/themes"
import { ReactNode } from "react"
import { useTheme } from "../hooks/useTheme"

const RadixThemeProvider = ({ children }: { children: ReactNode }) => {
  const { colorMode } = useTheme()

  return (
    <Theme appearance={colorMode} accentColor="sky" radius="small">
      {children}
    </Theme>
  )
}

export default RadixThemeProvider
