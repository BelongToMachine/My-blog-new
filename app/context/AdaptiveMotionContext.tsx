"use client"

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useReducedMotion } from "framer-motion"

export type MotionLevel = "full" | "limited" | "reduced"
export type MotionPreference = "system" | "full" | "reduced"

interface AdaptiveNetworkInformation extends EventTarget {
  effectiveType?: string
  saveData?: boolean
}

interface AdaptiveNavigator extends Navigator {
  connection?: AdaptiveNetworkInformation
}

interface DeviceMotionContext {
  hasFinePointer: boolean
  isResolved: boolean
  isSaveDataEnabled: boolean
  isSlowConnection: boolean
  supportsHover: boolean
}

export interface AdaptiveMotionValue {
  canUseFinePointerMotion: boolean
  isMotionReady: boolean
  motionLevel: MotionLevel
  motionPreference: MotionPreference
  shouldAnimateDecorations: boolean
  shouldAnimateSpatialMotion: boolean
  shouldReduceMotion: boolean
  shouldUseLimitedMotion: boolean
  setMotionPreference: (preference: MotionPreference) => void
}

const initialDeviceContext: DeviceMotionContext = {
  hasFinePointer: false,
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
  const [motionPreference, setMotionPreferenceState] =
    useState<MotionPreference>("system")

  const setMotionPreference = useCallback((preference: MotionPreference) => {
    setMotionPreferenceState(preference)
    try {
      window.localStorage.setItem("motion-preference", preference)
    } catch {
      // A privacy-restricted storage context should not prevent the preference from applying.
    }
  }, [])

  useEffect(() => {
    let storedPreference: string | null = null
    try {
      storedPreference = window.localStorage.getItem("motion-preference")
    } catch {
      return
    }

    if (
      storedPreference === "system" ||
      storedPreference === "full" ||
      storedPreference === "reduced"
    ) {
      setMotionPreferenceState(storedPreference)
    }
  }, [])

  useEffect(() => {
    const finePointerQuery = window.matchMedia("(pointer: fine)")
    const hoverQuery = window.matchMedia("(hover: hover)")
    const connection = (window.navigator as AdaptiveNavigator).connection

    const syncDeviceContext = () => {
      setDeviceContext({
        hasFinePointer: finePointerQuery.matches,
        isResolved: true,
        isSaveDataEnabled: connection?.saveData === true,
        isSlowConnection: slowConnectionTypes.has(
          connection?.effectiveType ?? "",
        ),
        supportsHover: hoverQuery.matches,
      })
    }

    syncDeviceContext()
    finePointerQuery.addEventListener("change", syncDeviceContext)
    hoverQuery.addEventListener("change", syncDeviceContext)
    connection?.addEventListener("change", syncDeviceContext)

    return () => {
      finePointerQuery.removeEventListener("change", syncDeviceContext)
      hoverQuery.removeEventListener("change", syncDeviceContext)
      connection?.removeEventListener("change", syncDeviceContext)
    }
  }, [])

  const value = useMemo<AdaptiveMotionValue>(() => {
    const systemMotionLevel: MotionLevel = prefersReducedMotion
      ? "reduced"
      : deviceContext.isSaveDataEnabled || deviceContext.isSlowConnection
        ? "limited"
        : "full"
    const motionLevel: MotionLevel =
      motionPreference === "full"
        ? "full"
        : motionPreference === "reduced"
          ? "reduced"
          : systemMotionLevel
    const isFullMotionReady = deviceContext.isResolved && motionLevel === "full"

    return {
      isMotionReady: deviceContext.isResolved,
      motionLevel,
      motionPreference,
      shouldAnimateDecorations: isFullMotionReady,
      shouldAnimateSpatialMotion: isFullMotionReady,
      shouldReduceMotion: motionLevel === "reduced",
      shouldUseLimitedMotion: motionLevel === "limited",
      setMotionPreference,
      canUseFinePointerMotion:
        isFullMotionReady &&
        deviceContext.hasFinePointer &&
        deviceContext.supportsHover,
    }
  }, [deviceContext, motionPreference, prefersReducedMotion, setMotionPreference])

  useEffect(() => {
    document.documentElement.dataset.motionLevel = value.motionLevel

    return () => {
      if (document.documentElement.dataset.motionLevel === value.motionLevel) {
        delete document.documentElement.dataset.motionLevel
      }
    }
  }, [value.motionLevel])

  return (
    <AdaptiveMotionContext.Provider value={value}>
      {children}
    </AdaptiveMotionContext.Provider>
  )
}
