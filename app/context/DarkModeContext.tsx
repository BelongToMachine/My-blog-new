"use client"
import React, { createContext, ReactNode, useState, useEffect } from "react"

export type colorMode = "light" | "dark"

interface ThemeColors {
  text: string
  background: string
  primary: string
  scrollableBackground: string
}

interface ThemeObject {
  light: ThemeColors
  dark: ThemeColors
}

declare global {
  interface Window {
    COLORS_JIE_BLOG_THEME: ThemeObject
  }
}

interface ThemeContextType {
  colorMode: colorMode
  setColorMode: (value: colorMode) => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorMode, rawSetColorMode] = useState<colorMode>("light")

  useEffect(() => {
    const root = window.document.documentElement
    const initialColorValue = root.style.getPropertyValue(
      "--initial-color-mode"
    )
    setColorMode(initialColorValue as colorMode, false)
  }, [])

  const setColorMode = (value: colorMode, ifInitialLoad = true) => {
    const root = window.document.documentElement
    rawSetColorMode(value)

    if (ifInitialLoad) {
      window.localStorage.setItem("color-mode", value)
    }

    const COLORS = window.COLORS_JIE_BLOG_THEME

    root.style.setProperty(
      "--text-color",
      value === "light" ? COLORS.light.text : COLORS.dark.text
    )
    root.style.setProperty(
      "--background-color",
      value === "light" ? COLORS.light.background : COLORS.dark.background
    )
    // root.style.setProperty(
    //   "--color-primary",
    //   value === "light" ? COLORS.light.primary : COLORS.dark.primary
    // )
    root.style.setProperty(
      "--scrollable-background-color",
      value === "light"
        ? COLORS.light.scrollableBackground
        : COLORS.dark.scrollableBackground
    )
  }

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
