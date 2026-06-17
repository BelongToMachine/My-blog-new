"use client"

import { useEffect } from "react"
import { geistMono } from "@/lib/fonts"

const FONT_READY_EVENT = "deferred-fonts-ready"

export default function DeferredFontLoader() {
  useEffect(() => {
    const root = document.documentElement
    let firstFrame = 0
    let secondFrame = 0
    let timeoutId: ReturnType<typeof setTimeout> | number = 0
    let idleId: number | ReturnType<typeof requestIdleCallback> = 0
    let cancelled = false

    const markReady = () => {
      if (cancelled) {
        return
      }

      root.dataset.fontStage = "ready"
      window.dispatchEvent(new Event(FONT_READY_EVENT))
    }

    const loadFonts = () => {
      if (cancelled) {
        return
      }

      root.dataset.fontStage = "loading"
      root.classList.add(geistMono.variable)

      if ("fonts" in document && document.fonts?.ready) {
        void document.fonts.ready.then(markReady)
        return
      }

      timeoutId = globalThis.setTimeout(markReady, 600)
    }

    const scheduleFonts = () => {
      if (cancelled) {
        return
      }

      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(loadFonts, { timeout: 1200 })
        return
      }

      timeoutId = globalThis.setTimeout(loadFonts, 240)
    }

    root.dataset.fontStage = "pending"
    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(scheduleFonts)
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
      window.clearTimeout(timeoutId)

      if ("cancelIdleCallback" in window && idleId) {
        window.cancelIdleCallback(idleId)
      }
    }
  }, [])

  return null
}
