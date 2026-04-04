import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex min-h-[120px] w-full rounded-2xl border bg-background px-3 py-3 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "border-input",
        error:
          "border-destructive/60 bg-destructive/5 text-foreground placeholder:text-destructive/65 focus-visible:ring-destructive/35",
        success:
          "border-emerald-500/45 bg-emerald-500/5 text-foreground focus-visible:ring-emerald-500/35",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, state, ...props }, ref) => {
        return (
            <textarea
                className={cn(textareaVariants({ state }), className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
