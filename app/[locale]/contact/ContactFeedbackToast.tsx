"use client"

import { Check, TriangleAlert, X } from "lucide-react"
import toast, { type Toast } from "react-hot-toast"

type FeedbackTone = "success" | "error"

interface ContactFeedbackToastProps {
  notification: Toast
  tone: FeedbackTone
  label: string
  message: string
  dismissLabel: string
}

export function ContactFeedbackToast({
  notification,
  tone,
  label,
  message,
  dismissLabel,
}: ContactFeedbackToastProps) {
  const isSuccess = tone === "success"
  const Icon = isSuccess ? Check : TriangleAlert

  return (
    <div
      aria-live={isSuccess ? "polite" : "assertive"}
      role={isSuccess ? "status" : "alert"}
      className={`pointer-events-auto w-[min(26rem,calc(100vw-2rem))] border-2 border-border bg-card shadow-[var(--shadow-overlay)] transition-[opacity,transform] duration-200 ease-out ${
        notification.visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-2 opacity-0"
      }`}
    >
      <div
        className={`h-1 ${
          isSuccess ? "bg-[hsl(var(--signal-green))]" : "bg-destructive"
        }`}
      />
      <div className="panel-grid grid grid-cols-[2.25rem_minmax(0,1fr)_2rem] items-start gap-3 px-3 py-3">
        <div
          className={`flex h-9 w-9 items-center justify-center border ${
            isSuccess
              ? "border-[hsl(var(--signal-green)/0.6)] bg-[hsl(var(--signal-green)/0.12)] text-[hsl(var(--signal-green))]"
              : "border-destructive/60 bg-destructive/10 text-destructive"
          }`}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 pt-0.5">
          <p
            className={`font-pixel text-[10px] uppercase tracking-[0.16em] ${
              isSuccess ? "text-[hsl(var(--signal-green))]" : "text-destructive"
            }`}
          >
            {label}
          </p>
          <p className="mt-1 text-sm leading-5 text-foreground">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => toast.dismiss(notification.id)}
          className="flex h-8 w-8 items-center justify-center border border-border/80 text-muted-foreground transition-colors duration-200 hover:border-primary hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          aria-label={dismissLabel}
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
