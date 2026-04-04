import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const formMessageVariants = cva("rounded-2xl border px-4 py-3 text-sm", {
  variants: {
    tone: {
      info: "border-border bg-muted/60 text-foreground",
      success:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      error:
        "border-destructive/25 bg-destructive/10 text-destructive dark:text-red-300",
      warning:
        "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      quiet: "border-transparent bg-transparent px-0 py-0 text-muted-foreground",
    },
  },
  defaultVariants: {
    tone: "info",
  },
})

interface FormMessageProps extends VariantProps<typeof formMessageVariants> {
  className?: string
  children: React.ReactNode
}

const FormMessage = ({ children, className, tone }: FormMessageProps) => {
  return (
    <div className={cn(formMessageVariants({ tone }), className)}>{children}</div>
  )
}

export default FormMessage
