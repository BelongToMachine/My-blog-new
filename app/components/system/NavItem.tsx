"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const navItemVariants = cva(
  "inline-flex items-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        desktop:
          "px-0 py-0 text-muted-foreground hover:text-foreground",
        dropdown:
          "w-full justify-between rounded-md px-2 py-2 text-foreground hover:bg-accent hover:text-accent-foreground",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "desktop",
        active: true,
        className: "text-foreground",
      },
      {
        variant: "dropdown",
        active: true,
        className: "bg-accent/70 text-accent-foreground",
      },
    ],
    defaultVariants: {
      variant: "desktop",
      active: false,
    },
  }
)

export interface NavItemProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navItemVariants> {
  asChild?: boolean
}

const NavItem = React.forwardRef<HTMLElement, NavItemProps>(
  ({ className, variant, active, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span"

    return (
      <Comp
        className={cn(navItemVariants({ variant, active, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

NavItem.displayName = "NavItem"

export { NavItem, navItemVariants }
