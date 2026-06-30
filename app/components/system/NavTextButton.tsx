"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { roundedButtonVariants } from "./RoundedButton"

export interface NavTextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof roundedButtonVariants> {
  asChild?: boolean
}

const NavTextButton = React.forwardRef<HTMLButtonElement, NavTextButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(roundedButtonVariants({ tone: "nav", size: "nav", className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

NavTextButton.displayName = "NavTextButton"

export { NavTextButton }
