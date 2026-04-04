import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const actionIconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      tone: {
        default:
          "border-border/70 bg-background/70 text-muted-foreground hover:border-primary/40 hover:bg-accent hover:text-accent-foreground",
        subtle:
          "border-transparent bg-muted/70 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        solid:
          "border-primary/20 bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-11 w-11",
      },
      active: {
        true: "border-primary/35 bg-primary/10 text-primary",
        false: "",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "md",
      active: false,
    },
  }
)

interface ActionIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionIconButtonVariants> {
  asChild?: boolean
}

const ActionIconButton = React.forwardRef<
  HTMLButtonElement,
  ActionIconButtonProps
>(({ className, asChild = false, tone, size, active, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      className={cn(
        actionIconButtonVariants({ tone, size, active, className })
      )}
      {...props}
    />
  )
})

ActionIconButton.displayName = "ActionIconButton"

export default ActionIconButton
