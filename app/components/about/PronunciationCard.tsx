"use client"

import { useEffect, useState } from "react"
import { Volume2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

export default function PronunciationCard({
  className,
}: {
  className?: string
}) {
  const t = useTranslations("funFacts.pronunciation")
  const [canSpeak, setCanSpeak] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    setCanSpeak(typeof window !== "undefined" && "speechSynthesis" in window)

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleSpeak = () => {
    if (!canSpeak) return

    window.speechSynthesis.cancel()

    if (isSpeaking) {
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(
      `${t("name")}. ${t("phonetic")}.`,
    )

    utterance.lang = "en-US"
    utterance.rate = 0.82
    utterance.pitch = 1.02
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <article
      className={cn(
        className,
        "flex flex-col items-center gap-5 p-4 text-center md:p-4 lg:p-5",
      )}
    >
      <div className="grid w-full grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-start gap-3">
        <div aria-hidden className="h-11 w-11" />
        <p className="font-editorial text-[clamp(2.35rem,5vw,4.1rem)] leading-[0.9] tracking-[-0.08em] text-foreground">
          {t("phonetic")}
        </p>
        <button
          type="button"
          aria-label={t("buttonLabel")}
          onClick={handleSpeak}
          disabled={!canSpeak}
          className={cn(
            "group flex h-11 w-11 shrink-0 items-center justify-center border-2 border-primary/35 bg-primary/[0.04] text-primary transition-colors duration-200 ease-out hover:border-[color-mix(in_srgb,hsl(var(--primary))_78%,hsl(var(--border)))] hover:bg-[color-mix(in_srgb,hsl(var(--primary))_14%,hsl(var(--accent)))] hover:text-foreground focus-visible:border-[color-mix(in_srgb,hsl(var(--primary))_78%,hsl(var(--border)))] focus-visible:bg-[color-mix(in_srgb,hsl(var(--primary))_14%,hsl(var(--accent)))] focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border/60 disabled:bg-background/72 disabled:text-muted-foreground",
            isSpeaking && "border-primary/55 bg-primary/[0.09] text-foreground",
          )}
        >
          <span
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center bg-transparent transition-transform duration-200 ease-out group-hover:-translate-y-px group-hover:scale-[1.06]",
              isSpeaking && "text-foreground",
            )}
          >
            <Volume2 className="h-[18px] w-[18px]" />
          </span>
        </button>
      </div>

      <p className="mx-auto max-w-[16ch] text-balance text-[clamp(1.2rem,2.2vw,1.75rem)] leading-[1.28] tracking-[-0.03em] text-foreground/92">
        {t("sentencePrefix", { name: t("name") })}{" "}
        <span className="font-editorial text-[1.08em] italic tracking-[-0.05em] text-primary">
          {t("phonetic")}
        </span>
        {t("sentenceSuffix")}
      </p>

      <p className="mx-auto max-w-[13ch] text-balance text-base leading-[1.45] text-foreground/78">
        {t("hint")}
      </p>
    </article>
  )
}
