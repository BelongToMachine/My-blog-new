"use client"

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useReducedMotion } from "framer-motion"

export type MotionLevel = "full" | "limited" | "reduced"

interface AdaptiveNetworkInformation extends EventTarget {
  effectiveType?: string
  saveData?: boolean
}

interface AdaptiveNavigator extends Navigator {
  connection?: AdaptiveNetworkInformation
}

interface DeviceMotionContext {
  hasFinePointer: boolean
  isCompactViewport: boolean
  isResolved: boolean
  isSaveDataEnabled: boolean
  isSlowConnection: boolean
  supportsHover: boolean
}

export interface AdaptiveMotionValue {
  canUseFinePointerMotion: boolean
  isMotionReady: boolean
  motionLevel: MotionLevel
  shouldAnimateDecorations: boolean
  shouldAnimateSpatialMotion: boolean
  shouldReduceMotion: boolean
  shouldUseLimitedMotion: boolean
}

const initialDeviceContext: DeviceMotionContext = {
  hasFinePointer: false,
  isCompactViewport: true,
  isResolved: false,
  isSaveDataEnabled: false,
  isSlowConnection: false,
  supportsHover: false,
}

const slowConnectionTypes = new Set(["slow-2g", "2g", "3g"])

export const AdaptiveMotionContext = createContext<
  AdaptiveMotionValue | undefined
>(undefined)

export function AdaptiveMotionProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [deviceContext, setDeviceContext] =
    useState<DeviceMotionContext>(initialDeviceContext)

  useEffect(() => {
    const compactViewportQuery = window.matchMedia("(max-width: 767px)")
    const finePointerQuery = window.matchMedia("(pointer: fine)")
    const hoverQuery = window.matchMedia("(hover: hover)")
    const connection = (window.navigator as AdaptiveNavigator).connection

    const syncDeviceContext = () => {
      setDeviceContext({
        hasFinePointer: finePointerQuery.matches,
        isCompactViewport: compactViewportQuery.matches,
        isResolved: true,
        isSaveDataEnabled: connection?.saveData === true,
        isSlowConnection: slowConnectionTypes.has(
          connection?.effectiveType ?? "",
        ),
        supportsHover: hoverQuery.matches,
      })
    }

    syncDeviceContext()
    compactViewportQuery.addEventListener("change", syncDeviceContext)
    finePointerQuery.addEventListener("change", syncDeviceContext)
    hoverQuery.addEventListener("change", syncDeviceContext)
    connection?.addEventListener("change", syncDeviceContext)

    return () => {
      compactViewportQuery.removeEventListener("change", syncDeviceContext)
      finePointerQuery.removeEventListener("change", syncDeviceContext)
      hoverQuery.removeEventListener("change", syncDeviceContext)
      connection?.removeEventListener("change", syncDeviceContext)
    }
  }, [])

  const value = useMemo<AdaptiveMotionValue>(() => {
    const motionLevel: MotionLevel = prefersReducedMotion
      ? "reduced"
      : deviceContext.isCompactViewport ||
          !deviceContext.hasFinePointer ||
          !deviceContext.supportsHover ||
          deviceContext.isSaveDataEnabled ||
          deviceContext.isSlowConnection
        ? "limited"
        : "full"
    const isFullMotionReady =
      deviceContext.isResolved && motionLevel === "full"

    return {
      isMotionReady: deviceContext.isResolved,
      motionLevel,
      shouldAnimateDecorations: isFullMotionReady,
      shouldAnimateSpatialMotion: isFullMotionReady,
      shouldReduceMotion: motionLevel === "reduced",
      shouldUseLimitedMotion: motionLevel === "limited",
      canUseFinePointerMotion:
        isFullMotionReady &&
        deviceContext.hasFinePointer &&
        deviceContext.supportsHover,
    }
  }, [deviceContext, prefersReducedMotion])

  return (
    <AdaptiveMotionContext.Provider value={value}>
      {children}
    </AdaptiveMotionContext.Provider>
  )
}
