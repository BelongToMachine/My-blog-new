"use client"

import { Theme } from "@radix-ui/themes"
import { ReactNode } from "react"

const RadixThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Theme
      appearance="inherit"
      accentColor="cyan"
      radius="none"
    >
      {children}
    </Theme>
  )
}

export default RadixThemeProvider
