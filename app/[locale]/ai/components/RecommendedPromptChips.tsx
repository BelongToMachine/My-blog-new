"use client"

import { Button } from "@/app/components/ui/button"
import { cn } from "@/lib/utils"
import type { SuggestedPrompt } from "../recommendedPrompts"

interface RecommendedPromptChipsProps {
  articlePickerOpen?: boolean
  prompts: SuggestedPrompt[]
  disabled?: boolean
  onSelect: (prompt: SuggestedPrompt) => void | Promise<void>
}

export default function RecommendedPromptChips({
  articlePickerOpen = false,
  prompts,
  disabled = false,
  onSelect,
}: RecommendedPromptChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {prompts.map((prompt) => (
        <Button
          key={prompt.id}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => {
            void onSelect(prompt)
          }}
          className={cn(
            "ai-lab-pixel-button h-auto max-w-full border-border bg-background px-3.5 py-2.5 text-left text-[10px] text-foreground shadow-none",
            prompt.mode === "article-picker" ? "ai-lab-featured-chip" : "",
            articlePickerOpen && prompt.mode === "article-picker"
              ? "ai-lab-pixel-button--active"
              : "",
          )}
        >
          <span className="inline-flex items-center gap-2 whitespace-normal leading-6">
            {prompt.mode === "article-picker" ? (
              <span className="ai-lab-featured-chip__sparkle" aria-hidden="true" />
            ) : null}
            {prompt.label}
          </span>
        </Button>
      ))}
    </div>
  )
}
