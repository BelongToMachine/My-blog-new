import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const surfaceCardVariants = cva(
  "rounded-3xl border backdrop-blur-sm transition-colors",
  {
    variants: {
      tone: {
        default:
          "border-border/80 bg-card/95 text-card-foreground shadow-[0_18px_45px_-28px_rgba(15,23,42,0.28)]",
        muted:
          "border-border/70 bg-muted/55 text-card-foreground shadow-[0_14px_35px_-28px_rgba(15,23,42,0.2)]",
        subtle: "border-border/60 bg-background/80 text-card-foreground",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: "hover:border-primary/20 hover:shadow-[0_20px_48px_-26px_rgba(15,23,42,0.32)]",
        false: "",
      },
    },
    defaultVariants: {
      tone: "default",
      padding: "md",
      interactive: false,
    },
  }
)

interface SurfaceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceCardVariants> {}

const SurfaceCard = React.forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ className, tone, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        surfaceCardVariants({ tone, padding, interactive, className })
      )}
      {...props}
    />
  )
)

SurfaceCard.displayName = "SurfaceCard"

export default SurfaceCard
