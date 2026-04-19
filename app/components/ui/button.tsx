import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "font-pixel inline-flex items-center justify-center whitespace-nowrap border text-[10px] font-medium uppercase tracking-[0.22em] ring-offset-background transition-[background-color,color,border-color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary/18 text-primary shadow-[4px_4px_0_hsl(var(--foreground)/0.28)] hover:bg-primary hover:text-primary-foreground",
        destructive:
          "border-destructive bg-destructive/12 text-destructive shadow-[4px_4px_0_hsl(var(--foreground)/0.28)] hover:bg-destructive hover:text-destructive-foreground",
        outline:
          "border-border/80 bg-card/70 text-foreground shadow-[4px_4px_0_hsl(var(--foreground)/0.16)] hover:border-primary/60 hover:bg-accent/60 hover:text-foreground",
        secondary:
          "border-border/70 bg-secondary/78 text-secondary-foreground shadow-[4px_4px_0_hsl(var(--foreground)/0.18)] hover:bg-secondary",
        ghost: "border-transparent bg-transparent text-muted-foreground hover:border-border/70 hover:bg-accent/50 hover:text-foreground",
        link: "border-transparent bg-transparent px-0 text-primary underline-offset-4 hover:text-primary/80 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-7",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
