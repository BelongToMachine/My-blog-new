"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const navItemVariants = cva(
  "inline-flex items-center border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        desktop:
          "border-transparent px-2 py-1 font-pixel text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:border-border/70 hover:bg-accent/60 hover:text-foreground",
        dropdown:
          "w-full justify-between border-border/70 px-2 py-2 font-pixel text-[10px] uppercase tracking-[0.18em] text-foreground hover:bg-accent hover:text-accent-foreground",
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
        className: "border-primary/60 bg-primary/10 text-foreground",
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
