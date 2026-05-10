"use client"

import { Button } from "@/app/components/ui/button"
import { cn } from "@/lib/utils"
import type { SuggestedPrompt } from "../recommendedPrompts"

interface RecommendedPromptChipsProps {
  prompts: SuggestedPrompt[]
  disabled?: boolean
  onSelect: (prompt: SuggestedPrompt) => void | Promise<void>
}

export default function RecommendedPromptChips({
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
            "h-auto max-w-full px-3 py-2 text-left text-[9px] uppercase tracking-[0.16em]",
            "border-primary/35 bg-primary/[0.05] text-primary/90",
            "hover:border-primary/60 hover:bg-primary/[0.12] hover:text-primary",
          )}
        >
          <span className="block whitespace-normal leading-5 sm:leading-4">
            {prompt.label}
          </span>
        </Button>
      ))}
    </div>
  )
}
