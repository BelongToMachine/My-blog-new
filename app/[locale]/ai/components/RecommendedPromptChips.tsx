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
            "h-auto max-w-full border border-border/50 bg-background/76 px-3.5 py-2.5 text-left font-pixel text-[10px] uppercase tracking-[0.12em] text-foreground shadow-none",
            "hover:border-primary/40 hover:bg-primary/[0.05] hover:text-primary",
          )}
        >
          <span className="block whitespace-normal leading-6">
            {prompt.label}
          </span>
        </Button>
      ))}
    </div>
  )
}
