"use client"

import { useTranslations } from "next-intl"
import type { ChangeEvent } from "react"
import { useAdaptiveMotion } from "@/app/hooks/useAdaptiveMotion"
import type { MotionPreference } from "@/app/context/AdaptiveMotionContext"
import { cn } from "@/lib/utils"

interface MotionPreferenceControlProps {
  className?: string
  compact?: boolean
}

export default function MotionPreferenceControl({
  className,
  compact = false,
}: MotionPreferenceControlProps) {
  const t = useTranslations("footer")
  const { motionPreference, setMotionPreference } = useAdaptiveMotion()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setMotionPreference(event.target.value as MotionPreference)
  }

  return (
    <div className={cn("flex min-w-0 items-center justify-center gap-2", className)}>
      <label
        htmlFor="motion-preference"
        className="shrink-0 font-pixel text-xs tracking-[0.08em] text-muted-foreground"
      >
        {t("motionPreferenceLabel")}
      </label>
      <select
        id="motion-preference"
        value={motionPreference}
        onChange={handleChange}
        aria-label={t("motionPreferenceLabel")}
        className={cn(
          "retro-select min-h-11 min-w-0 bg-background/80 text-xs",
          compact ? "w-[9rem] sm:w-[11rem]" : "w-auto",
        )}
      >
        <option value="system">{t("motionPreferenceSystem")}</option>
        <option value="full">{t("motionPreferenceFull")}</option>
        <option value="reduced">{t("motionPreferenceReduced")}</option>
      </select>
    </div>
  )
}
