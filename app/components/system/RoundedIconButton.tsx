"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const roundedIconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full border text-muted-foreground transition-[transform,background-color,color,border-color,box-shadow] duration-200 ease-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      tone: {
        accent:
          "border-primary/35 bg-primary/[0.04] text-primary shadow-[0_12px_26px_hsl(var(--primary)/0.14)] hover:border-[color-mix(in_srgb,hsl(var(--primary))_78%,hsl(var(--border)))] hover:bg-[color-mix(in_srgb,hsl(var(--primary))_14%,hsl(var(--accent)))] hover:text-foreground hover:shadow-[0_16px_30px_hsl(var(--primary)/0.18)] active:translate-y-0",
        quiet:
          "border-border/60 bg-background/12 shadow-[0_10px_24px_hsl(var(--foreground)/0.08)] hover:border-primary/55 hover:bg-background/22 hover:text-foreground hover:shadow-[0_14px_30px_hsl(var(--foreground)/0.12)]",
        surface:
          "border-border/70 bg-background/20 shadow-[0_12px_26px_hsl(var(--foreground)/0.1)] hover:border-primary/60 hover:bg-background/30 hover:text-foreground hover:shadow-[0_16px_34px_hsl(var(--foreground)/0.14)]",
        borderless:
          "border-transparent bg-transparent hover:border-border/45 hover:bg-background/16 hover:text-foreground",
      },
      size: {
        sm: "h-8 w-8",
        default: "h-9 w-9",
        lg: "h-10 w-10",
        xl: "h-11 w-11",
      },
    },
    defaultVariants: {
      tone: "quiet",
      size: "default",
    },
  },
)

export interface RoundedIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof roundedIconButtonVariants> {
  asChild?: boolean
}

const RoundedIconButton = React.forwardRef<
  HTMLButtonElement,
  RoundedIconButtonProps
>(({ className, tone, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(roundedIconButtonVariants({ tone, size, className }))}
      ref={ref}
      {...props}
    />
  )
})

RoundedIconButton.displayName = "RoundedIconButton"

export { RoundedIconButton, roundedIconButtonVariants }
