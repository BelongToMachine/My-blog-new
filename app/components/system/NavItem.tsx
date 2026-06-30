"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { roundedButtonVariants } from "./RoundedButton"

export interface NavItemProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean
  variant?: "desktop" | "dropdown"
  active?: boolean
}

const NavItem = React.forwardRef<HTMLElement, NavItemProps>(
  ({ className, variant, active, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span"
    const tone =
      variant === "dropdown"
        ? active
          ? "dropdownActive"
          : "dropdown"
        : active
          ? "navActive"
          : "nav"
    const size = variant === "dropdown" ? "dropdown" : "nav"

    return (
      <Comp
        className={cn(roundedButtonVariants({ tone, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

NavItem.displayName = "NavItem"

export { NavItem }
