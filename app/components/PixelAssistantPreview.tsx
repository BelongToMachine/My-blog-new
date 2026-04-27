"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

type AssistantFrame =
  | "idle"
  | "blink"
  | "thinkA"
  | "thinkB"
  | "talkA"
  | "talkB"

const SEQUENCE: Array<{ frame: AssistantFrame; duration: number }> = [
  { frame: "idle", duration: 1500 },
  { frame: "blink", duration: 140 },
  { frame: "idle", duration: 1200 },
  { frame: "thinkA", duration: 700 },
  { frame: "thinkB", duration: 700 },
  { frame: "thinkA", duration: 700 },
  { frame: "idle", duration: 800 },
  { frame: "talkA", duration: 160 },
  { frame: "talkB", duration: 160 },
  { frame: "talkA", duration: 160 },
  { frame: "talkB", duration: 160 },
  { frame: "idle", duration: 1800 },
]

const OUTLINE = "#160f1f"
const METAL = "#b8bec9"
const METAL_SHADE = "#8d97a8"
const FUR = "#b98c69"
const FUR_SHADE = "#8f6a57"
const CREAM = "#f7dcc2"
const COAT = "#322a3b"
const COAT_SHADE = "#261f30"
const RED = "#ff5563"
const RED_GLOW = "#ffb08d"
const BLUE = "#27b9ff"
const BLUE_GLOW = "#ddf8ff"
const ORANGE = "#eb8641"

function PixelCircle({
  x,
  y,
  fill,
}: {
  x: number
  y: number
  fill: string
}) {
  return <rect x={x} y={y} width="4" height="4" fill={fill} />
}

function MechanicalCatSvg({ frame }: { frame: AssistantFrame }) {
  const isBlink = frame === "blink"
  const isThinking = frame === "thinkA" || frame === "thinkB"
  const isTalking = frame === "talkA" || frame === "talkB"
  const talkingWide = frame === "talkB"
  const rightPupilX = frame === "thinkB" ? 54 : isThinking ? 52 : 56
  const rightPupilY = isThinking ? 34 : 36
  const lensFill = isThinking ? RED_GLOW : RED
  const antennaFill = frame === "thinkB" ? BLUE : RED
  const tailLift = frame === "thinkB" || frame === "talkB" ? -2 : 0

  return (
    <svg
      viewBox="0 0 96 96"
      role="presentation"
      className="h-auto w-full"
      shapeRendering="crispEdges"
    >
      <g stroke={OUTLINE} strokeWidth="2" strokeLinejoin="miter">
        <polygon
          fill={COAT_SHADE}
          points={`64,70 74,72 82,80 ${82 + tailLift},90 74,92 70,86 68,78`}
        />
        <polygon fill={METAL} points="24,20 32,8 44,20 40,24 28,24" />
        <polygon fill={COAT} points="52,18 64,8 76,20 72,24 56,24" />
        <polygon fill={METAL_SHADE} points="28,16 32,12 40,20 32,22 28,22" />
        <polygon fill={FUR} points="58,16 64,12 72,20 68,22 58,22" />

        <polygon
          fill={METAL}
          points="20,24 28,20 44,22 46,34 46,48 40,56 28,58 22,52 20,42"
        />
        <polygon
          fill={FUR}
          points="46,22 60,18 72,22 76,30 76,46 72,54 62,58 46,58"
        />
        <polygon
          fill={CREAM}
          points="42,26 52,24 64,26 70,32 70,44 66,52 56,56 42,56"
        />

        <polygon fill={COAT} points="34,58 58,58 66,68 66,90 28,90 28,68" />
        <polygon fill={COAT_SHADE} points="28,68 36,60 42,60 40,90 28,90" />
        <polygon fill={COAT_SHADE} points="54,60 60,60 66,68 66,90 54,90" />
        <polygon fill={CREAM} points="42,58 50,58 54,66 50,74 42,74 38,66" />

        <rect x="26" y="40" width="4" height="10" fill={METAL_SHADE} />
        <rect x="28" y="42" width="4" height="6" fill="#eef2f7" />
        <rect x="32" y="42" width="2" height="6" fill={ORANGE} />

        <polygon fill={OUTLINE} points="24,34 28,28 36,28 40,34 40,42 36,46 28,46 24,42" />
        <polygon fill={METAL} points="26,34 30,30 36,30 38,34 38,40 34,44 28,44 26,40" />
        <polygon fill={lensFill} points="28,34 30,32 34,32 36,34 36,40 34,42 30,42 28,40" />
        <rect x="30" y="34" width="4" height="4" fill="#fff3eb" />

        {isBlink ? (
          <g>
            <rect x="52" y="36" width="14" height="2" fill={OUTLINE} />
            <rect x="54" y="34" width="10" height="2" fill={FUR_SHADE} />
          </g>
        ) : (
          <g>
            <polygon fill="#fdfefe" points="50,30 60,30 66,36 66,44 60,48 50,48 46,42 46,36" />
            <polygon fill={BLUE} points={`${rightPupilX},${rightPupilY} ${rightPupilX + 4},${rightPupilY} ${rightPupilX + 6},${rightPupilY + 4} ${rightPupilX + 4},${rightPupilY + 8} ${rightPupilX},${rightPupilY + 8} ${rightPupilX - 2},${rightPupilY + 4}`} />
            <rect x={rightPupilX + 1} y={rightPupilY + 1} width="2" height="2" fill={BLUE_GLOW} />
          </g>
        )}

        <rect x="44" y="44" width="4" height="2" fill={OUTLINE} />
        <rect x="48" y="44" width="4" height="2" fill={OUTLINE} />
        <rect x="46" y="42" width="4" height="4" fill="#d66d60" />
        <rect x="47" y="43" width="2" height="2" fill="#ffd7c7" />

        {isTalking ? (
          <g>
            <rect x="42" y="48" width="2" height="4" fill={OUTLINE} />
            <rect x="52" y="48" width="2" height="4" fill={OUTLINE} />
            <rect x="44" y={talkingWide ? 50 : 49} width={talkingWide ? 8 : 6} height={talkingWide ? 4 : 3} fill={OUTLINE} />
          </g>
        ) : (
          <g>
            <rect x="42" y="48" width="2" height="4" fill={OUTLINE} />
            <rect x="52" y="48" width="2" height="4" fill={OUTLINE} />
            <rect x="44" y="50" width="4" height="2" fill={OUTLINE} />
            <rect x="48" y="50" width="4" height="2" fill={OUTLINE} />
          </g>
        )}

        <rect x="34" y="76" width="8" height="12" fill={METAL_SHADE} />
        <rect x="36" y="86" width="4" height="2" fill="#eef2f7" />
        <rect x="50" y="76" width="10" height="12" fill={CREAM} />
        <rect x="52" y="86" width="2" height="2" fill="#d66d60" />
        <rect x="56" y="86" width="2" height="2" fill="#d66d60" />

        <rect x="34" y="70" width="4" height="10" fill={COAT} />
        <rect x="58" y="70" width="4" height="10" fill={COAT} />
        <rect x="34" y="66" width="4" height="8" fill={RED} />
        <rect x="58" y="64" width="2" height="10" fill={ORANGE} />

        <rect x="42" y="18" width="6" height="2" fill="#eef2f7" />
        <rect x="20" y="24" width="2" height="12" fill="#ecf0f4" />
        <rect x="70" y="26" width="2" height="8" fill="#e5cbb0" />

        {isThinking ? (
          <g>
            <PixelCircle x={66} y={10} fill={antennaFill} />
            <PixelCircle x={72} y={6} fill={BLUE} />
            <PixelCircle x={78} y={10} fill={BLUE_GLOW} />
          </g>
        ) : null}

        {isTalking ? (
          <g>
            <rect x="58" y="48" width="4" height="2" fill={RED_GLOW} />
            <rect x="62" y="46" width="4" height="2" fill={RED_GLOW} />
          </g>
        ) : null}
      </g>
    </svg>
  )
}

export function FloatingPixelAssistant() {
  const reduceMotion = useReducedMotion()
  const [frame, setFrame] = useState<AssistantFrame>("idle")

  useEffect(() => {
    if (reduceMotion) {
      setFrame("idle")
      return
    }

    let index = 0
    let timeoutId: number | undefined

    const play = () => {
      const step = SEQUENCE[index]
      setFrame(step.frame)
      timeoutId = window.setTimeout(() => {
        index = (index + 1) % SEQUENCE.length
        play()
      }, step.duration)
    }

    play()

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [reduceMotion])

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-[17.5rem] z-20 w-[5.25rem] select-none sm:left-2 sm:top-[18rem] sm:w-[5.75rem] md:-left-1 md:top-[19rem] md:w-[6.5rem] lg:-left-16 lg:top-auto lg:bottom-0 lg:w-[7.5rem] xl:-left-20 xl:bottom-1 xl:w-[8.25rem]"
      animate={
        reduceMotion
          ? { y: 0, scale: 1 }
          : { y: [0, -4, 0], scale: [1, 1.015, 1] }
      }
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      <MechanicalCatSvg frame={frame} />
    </motion.div>
  )
}
