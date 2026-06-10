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
            "flex h-11 w-11 shrink-0 items-center justify-center border border-primary/40 bg-primary/10 text-primary transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:border-border/60 disabled:bg-background/72 disabled:text-muted-foreground",
            isSpeaking && "bg-primary/18 text-primary",
          )}
        >
          <Volume2 className="h-5 w-5" />
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
