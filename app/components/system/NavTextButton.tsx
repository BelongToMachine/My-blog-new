"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const navTextButtonVariants = cva(
  "font-pixel inline-flex min-h-9 items-center justify-center border border-transparent px-3 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground transition-[background-color,color,border-color] duration-200 hover:border-border/70 hover:bg-accent/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
)

export interface NavTextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof navTextButtonVariants> {
  asChild?: boolean
}

const NavTextButton = React.forwardRef<HTMLButtonElement, NavTextButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(navTextButtonVariants({ className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

NavTextButton.displayName = "NavTextButton"

export { NavTextButton, navTextButtonVariants }
