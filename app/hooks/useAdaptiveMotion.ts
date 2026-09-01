"use client"

import { useContext } from "react"
import { AdaptiveMotionContext } from "@/app/context/AdaptiveMotionContext"

export function useAdaptiveMotion() {
  const context = useContext(AdaptiveMotionContext)

  if (!context) {
    throw new Error(
      "useAdaptiveMotion must be used within an AdaptiveMotionProvider",
    )
  }

  return context
}
