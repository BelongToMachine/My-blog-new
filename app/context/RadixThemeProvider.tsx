"use client"

import { Theme } from "@radix-ui/themes"
import { ReactNode } from "react"

const RadixThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Theme
      appearance="inherit"
      accentColor="sky"
      radius="small"
    >
      {children}
    </Theme>
  )
}

export default RadixThemeProvider
