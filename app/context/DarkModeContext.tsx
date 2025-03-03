"use client"
import React, { createContext, ReactNode, useState, useEffect } from "react"

export type colorMode = "light" | "dark"

interface ThemeContextType {
  colorMode: colorMode
  setColorMode: (value: colorMode) => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorMode, setColorMode] = useState<colorMode>("light") // 先默认 light

  useEffect(() => {
    const persistedColorPreference = window.localStorage.getItem("color-mode")
    if (persistedColorPreference) {
      setColorMode(persistedColorPreference as colorMode)
      return
    }

    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    setColorMode(mql.matches ? "dark" : "light")
  }, [])

  const updateColorMode = (value: colorMode) => {
    setColorMode(value)
    window.localStorage.setItem("color-mode", value)
  }

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode: updateColorMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
