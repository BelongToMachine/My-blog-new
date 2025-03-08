"use client"
import React, { createContext, ReactNode, useState, useEffect } from "react"

export type colorMode = "light" | "dark"

const COLORS = {
  light: {
    primary: "#ffffff",
    text: "#000000",
    background: "#ffffff",
  },
  dark: {
    primary: "#000000",
    text: "#ffffff",
    background: "#000000",
  },
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

    root.style.setProperty(
      "--color-text",
      value === "light" ? COLORS.light.text : COLORS.dark.text
    )
    root.style.setProperty(
      "--color-background",
      value === "light" ? COLORS.light.background : COLORS.dark.background
    )
    root.style.setProperty(
      "--color-primary",
      value === "light" ? COLORS.light.primary : COLORS.dark.primary
    )
  }

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
