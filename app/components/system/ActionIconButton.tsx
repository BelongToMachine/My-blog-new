"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const actionIconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      tone: {
        quiet: "bg-transparent hover:bg-accent/70",
        surface:
          "bg-background/70 hover:bg-accent/80 border-border/60 shadow-[var(--shadow-elevated)]",
      },
      size: {
        sm: "h-8 w-8",
        default: "h-9 w-9",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      tone: "quiet",
      size: "default",
    },
  }
)

export interface ActionIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionIconButtonVariants> {
  asChild?: boolean
}

const ActionIconButton = React.forwardRef<
  HTMLButtonElement,
  ActionIconButtonProps
>(({ className, tone, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(actionIconButtonVariants({ tone, size, className }))}
      ref={ref}
      {...props}
    />
  )
})

ActionIconButton.displayName = "ActionIconButton"

export { ActionIconButton, actionIconButtonVariants }
