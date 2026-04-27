"use client"

import { ReactNode, useCallback, useRef } from "react"
import { motion, useAnimationControls } from "framer-motion"

interface BoopProps {
  children: ReactNode
  className?: string
}

export default function Boop({ children, className }: BoopProps) {
  const controls = useAnimationControls()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    controls.start({
      scaleX: 1.12,
      scaleY: 0.88,
      transition: { type: "spring", stiffness: 400, damping: 8 },
    })

    timerRef.current = setTimeout(() => {
      controls.start({
        scaleX: 1,
        scaleY: 1,
        transition: { type: "spring", stiffness: 300, damping: 15 },
      })
    }, 150)
  }, [controls])

  return (
    <motion.span
      className={className}
      animate={controls}
      onMouseEnter={handleMouseEnter}
      style={{ display: "inline-flex" }}
    >
      {children}
    </motion.span>
  )
}
