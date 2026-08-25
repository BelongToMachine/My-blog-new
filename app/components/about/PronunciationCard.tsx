"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Volume2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { RoundedButton } from "../system/RoundedButton"

export default function PronunciationCard({
  className,
  roundedButton = false,
}: {
  className?: string
  roundedButton?: boolean
}) {
  const t = useTranslations("funFacts.pronunciation")
  const [canSpeak, setCanSpeak] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio("/audio/jie-pronunciation.mp3")
    audio.preload = "auto"
    audioRef.current = audio
    setCanSpeak(audio.canPlayType("audio/mpeg") !== "")

    const resetSpeakingState = () => setIsSpeaking(false)
    audio.addEventListener("ended", resetSpeakingState)
    audio.addEventListener("error", resetSpeakingState)

    return () => {
      audio.pause()
      audio.currentTime = 0
      audio.removeEventListener("ended", resetSpeakingState)
      audio.removeEventListener("error", resetSpeakingState)
      audioRef.current = null
    }
  }, [])

  const handleSpeak = () => {
    const audio = audioRef.current
    if (!canSpeak || !audio) return

    if (isSpeaking) {
      audio.pause()
      audio.currentTime = 0
      setIsSpeaking(false)
      return
    }

    audio.currentTime = 0
    setIsSpeaking(true)
    void audio.play().catch(() => setIsSpeaking(false))
  }

  return (
    <article
      className={cn(
        className,
        "flex flex-col items-center gap-5 p-4 text-center md:p-4 lg:p-5",
      )}
    >
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        <p className="hero-interactive origin-center font-rounded-display text-[clamp(2.1rem,4.5vw,3.6rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-foreground transition-transform hover:scale-[1.03] active:scale-[1.08] motion-reduce:hover:scale-100 motion-reduce:active:scale-100">
          <span className="whitespace-nowrap">{t("phonetic")}</span>
        </p>
        {roundedButton ? (
          <RoundedButton
            type="button"
            aria-label={t("buttonLabel")}
            onClick={handleSpeak}
            disabled={!canSpeak}
            tone="hero"
            size="accent"
            className={cn(
              "h-10 w-10 shrink-0 p-0 focus-visible:ring-black/70",
              isSpeaking && "bg-[#ffd966]",
            )}
          >
            <Volume2 className="h-[18px] w-[18px]" />
          </RoundedButton>
        ) : (
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
        )}
      </div>

      <p className="mx-auto max-w-[16ch] text-balance text-[clamp(1.2rem,2.2vw,1.75rem)] leading-[1.28] tracking-[-0.03em] text-foreground/92">
        {t.rich("sentencePrefix", {
          name: t("name"),
          highlight: (chunks) => <Highlight>{chunks}</Highlight>,
        })}{" "}
        <span className="font-rounded-display text-[1.08em] font-medium tracking-[-0.04em] text-[#eb5f8e]">
          {t("sentencePhonetic")}
        </span>
        {t("sentenceSuffix")}
      </p>

      <p className="mx-auto max-w-[13ch] text-balance text-base leading-[1.45] text-foreground/78">
        {t("hint")}
      </p>
    </article>
  )
}

function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="bg-[#fcc31e] px-1.5 py-0.5 font-bold text-black">
      {children}
    </span>
  )
}
