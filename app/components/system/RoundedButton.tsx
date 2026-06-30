"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const roundedButtonVariants = cva(
  "group inline-flex items-center justify-center rounded-full border font-medium transition-[transform,background-color,color,border-color,box-shadow] duration-200 ease-out hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      tone: {
        hero:
          "border-primary/40 bg-primary/[0.06] text-primary shadow-[0_12px_28px_hsl(var(--primary)/0.13)] hover:border-primary/75 hover:bg-primary/[0.12] hover:text-foreground hover:shadow-[0_16px_34px_hsl(var(--primary)/0.18)] active:translate-y-0",
        accent:
          "border-primary/30 bg-primary/[0.06] text-primary shadow-[0_10px_24px_hsl(var(--primary)/0.12)] hover:border-primary/50 hover:bg-primary/[0.1] hover:text-foreground hover:shadow-[0_14px_28px_hsl(var(--primary)/0.16)] active:translate-y-0",
        nav:
          "border-transparent bg-transparent text-muted-foreground hover:border-border/60 hover:bg-background/16 hover:text-foreground",
        navActive:
          "border-primary/80 bg-primary/12 text-foreground shadow-[0_10px_24px_hsl(var(--primary)/0.14)]",
        dropdown:
          "w-full justify-between border-border/60 bg-background/36 text-foreground hover:border-primary/35 hover:bg-accent/90 hover:text-accent-foreground",
        dropdownActive:
          "w-full justify-between border-primary/45 bg-primary/10 text-foreground shadow-[0_12px_28px_hsl(var(--primary)/0.1)]",
        reaction:
          "border-transparent bg-transparent text-foreground shadow-[0_12px_26px_hsl(var(--foreground)/0.07)] hover:shadow-[0_16px_32px_hsl(var(--foreground)/0.1)] active:translate-y-0",
      },
      size: {
        hero:
          "min-h-10 gap-2 px-4 py-2.5 text-sm tracking-[0.02em] min-[480px]:min-h-11 min-[480px]:px-5 min-[480px]:py-3 md:px-4 md:py-2.5 lg:min-h-0 lg:px-4 lg:py-2",
        accent: "gap-1.5 px-3 py-1.5 text-sm leading-none",
        nav: "px-4 py-2 font-sans text-[14px] uppercase leading-none tracking-[0.08em]",
        dropdown:
          "px-4 py-3 font-sans text-[14px] uppercase tracking-[0.08em]",
        reaction: "h-9 px-3 font-pixel text-[10px] uppercase tracking-[0.22em]",
      },
    },
    defaultVariants: {
      tone: "accent",
      size: "accent",
    },
  },
)

export interface RoundedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof roundedButtonVariants> {
  asChild?: boolean
}

const RoundedButton = React.forwardRef<HTMLButtonElement, RoundedButtonProps>(
  ({ className, tone, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(roundedButtonVariants({ tone, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)

RoundedButton.displayName = "RoundedButton"

export { RoundedButton, roundedButtonVariants }
