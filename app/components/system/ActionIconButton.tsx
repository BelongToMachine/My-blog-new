"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { roundedIconButtonVariants } from "./RoundedIconButton"

export interface ActionIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof roundedIconButtonVariants> {
  asChild?: boolean
}

const ActionIconButton = React.forwardRef<
  HTMLButtonElement,
  ActionIconButtonProps
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

ActionIconButton.displayName = "ActionIconButton"

export { ActionIconButton }
