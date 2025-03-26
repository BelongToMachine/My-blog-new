"use client"
import React, { createContext, ReactNode, useState, useEffect } from "react"
import { PostCssProperties } from "../service/ThemeCssProperties"

export type colorMode = "light" | "dark"

interface ThemeObject {
  light: PostCssProperties
  dark: PostCssProperties
}

declare global {
  interface Window {
    COLORS_JIE_BLOG_THEME: ThemeObject
    GET_JIE_BLOG_CSS_PROPERTIES: (value: colorMode) => any
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
  const [colorMode, rawSetColorMode] = useState<colorMode>("dark")

  useEffect(() => {
    const root = window.document.documentElement
    const initialColorValue = root.style.getPropertyValue(
      "--initial-color-mode"
    )
    rawSetColorMode(initialColorValue as colorMode)
  }, [])

  const setColorMode = (value: colorMode, ifInitialLoad = true) => {
    rawSetColorMode(value)

    if (ifInitialLoad) {
      window.localStorage.setItem("color-mode", value)
    }

    const properties = GET_JIE_BLOG_CSS_PROPERTIES(value)

    delete properties["--initial-color-mode"]

    const root = document.documentElement

    Object.entries(properties).forEach(([key, value]) => {
      root.style.setProperty(key, value as string)
    })
  }

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
