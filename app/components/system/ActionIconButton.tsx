"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const actionIconButtonVariants = cva(
  "inline-flex items-center justify-center border text-muted-foreground transition-[transform,background-color,color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      tone: {
        quiet: "border-border/70 bg-transparent shadow-[3px_3px_0_hsl(var(--foreground)/0.14)] hover:border-primary/60 hover:bg-accent/60",
        surface:
          "border-border/80 bg-background/80 shadow-[4px_4px_0_hsl(var(--foreground)/0.18)] hover:border-primary/60 hover:bg-accent/80",
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
