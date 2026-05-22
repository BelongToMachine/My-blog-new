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
    <div className="flex h-full items-center justify-center px-4 py-10 md:px-6 md:py-14">
      <div className="ai-lab-landing-panel mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center">
        <div className="space-y-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary/78">
            {t("eyebrow")}
          </p>
          <h1 className="font-semibold text-[clamp(1.3rem,3vw,2.2rem)] leading-[1.3] tracking-[-0.01em] text-foreground md:whitespace-nowrap">
            {t("landingTitle")}
          </h1>
          <p className="mx-auto max-w-[42rem] text-[12px] leading-8 tracking-[0.02em] text-muted-foreground/92 md:text-[13px]">
            {emptyLabel}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/68">
            {t("suggestedPromptsLabel")}
          </p>
          <RecommendedPromptChips
            prompts={prompts}
            disabled={disabled}
            onSelect={onSelectPrompt}
          />
        </div>

        <p className="text-[10px] font-medium uppercase leading-6 tracking-[0.12em] text-muted-foreground/64">
          {t("landingPromptHint")}
        </p>
      </div>
    </div>
  )
}
