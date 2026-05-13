"use client"

import { useTranslations } from "next-intl"
import RecommendedPromptChips from "./RecommendedPromptChips"
import type { SuggestedPrompt } from "../recommendedPrompts"

interface ChatLandingStateProps {
  emptyLabel: string
  prompts: SuggestedPrompt[]
  disabled?: boolean
  onSelectPrompt: (prompt: SuggestedPrompt) => void | Promise<void>
}

export default function ChatLandingState({
  emptyLabel,
  prompts,
  disabled = false,
  onSelectPrompt,
}: ChatLandingStateProps) {
  const t = useTranslations("ai")

  return (
    <div className="flex h-full items-center justify-center px-4 py-10 md:px-6">
      <div className="ai-lab-landing-panel mx-auto flex w-full max-w-3xl flex-col items-center gap-7 text-center">
        <div className="space-y-4">
          <p className="section-kicker">{t("suggestedPromptsLabel")}</p>
          <div className="font-pixel text-6xl text-primary/28 md:text-7xl">&gt;_</div>
          <p className="max-w-2xl font-pixel text-sm uppercase leading-7 tracking-[0.16em] text-muted-foreground/78">
            {emptyLabel}
          </p>
        </div>

        <RecommendedPromptChips
          prompts={prompts}
          disabled={disabled}
          onSelect={onSelectPrompt}
        />

        <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-muted-foreground/48">
          {t("landingPromptHint")}
        </p>
      </div>
    </div>
  )
}
