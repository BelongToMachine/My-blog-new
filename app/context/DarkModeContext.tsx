"use client"
import React, { createContext, ReactNode, useState, useEffect } from "react"
import { PostCssProperties } from "../service/ThemeService"

export type colorMode = "light" | "dark"
const THEME_STORAGE_KEY = "color-mode"

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
  const readColorModeFromDom = (): colorMode => {
    const root = window.document.documentElement
    const datasetValue = root.dataset.colorMode
    const initialColorValue = root.style.getPropertyValue("--initial-color-mode")

    if (datasetValue === "light" || datasetValue === "dark") {
      return datasetValue
    }

    if (initialColorValue === "light" || initialColorValue === "dark") {
      return initialColorValue
    }

    return root.classList.contains("dark") ? "dark" : "light"
  }

  const applyColorMode = (value: colorMode) => {
    const properties = window.GET_JIE_BLOG_CSS_PROPERTIES(value)
    const root = document.documentElement

    root.classList.toggle("dark", value === "dark")
    root.style.colorScheme = value
    root.dataset.colorMode = value

    Object.entries(properties).forEach(([key, propertyValue]) => {
      root.style.setProperty(key, propertyValue as string)
    })
  }

  const [colorMode, rawSetColorMode] = useState<colorMode>(() => {
    if (typeof window === "undefined") {
      return "light"
    }

    return readColorModeFromDom()
  })

  useEffect(() => {
    rawSetColorMode(readColorModeFromDom())
  }, [])

  const setColorMode = (value: colorMode) => {
    rawSetColorMode(value)
    window.localStorage.setItem(THEME_STORAGE_KEY, value)
    applyColorMode(value)
  }

  return (
    <ThemeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
