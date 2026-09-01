"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import {
  Send,
  Sparkles,
  Pencil,
  Mail,
  User,
  Building2,
  Briefcase,
  MessageSquare,
  Loader2,
} from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { ContactFeedbackToast } from "./ContactFeedbackToast"

interface GeneratedEmail {
  subject: string
  body: string
}

type FeedbackTone = "success" | "error"

const contactCardClass =
  "pixel-panel panel-grid overflow-hidden border border-border/80 bg-card/88 backdrop-blur-sm"

const contactCardHeaderClass =
  "border-b border-border/70 px-4 py-3.5 sm:px-5 sm:py-4"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactForm() {
  const t = useTranslations("contact")

  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [business, setBusiness] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")

  const [generated, setGenerated] = useState<GeneratedEmail | null>(null)
  const [editedSubject, setEditedSubject] = useState("")
  const [editedBody, setEditedBody] = useState("")

  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [hasBlurredEmail, setHasBlurredEmail] = useState(false)

  const trimmedEmail = userEmail.trim()
  const emailIsInvalid =
    Boolean(trimmedEmail) && !emailPattern.test(trimmedEmail)
  const showEmailError = hasBlurredEmail && emailIsInvalid
  const canGenerate = Boolean(
    name.trim() && trimmedEmail && !emailIsInvalid && customPrompt.trim(),
  )
  const canSend = editedSubject.trim() && editedBody.trim()

  const notify = useCallback(
    (tone: FeedbackTone, message: string) => {
      toast.custom(
        (notification) => (
          <ContactFeedbackToast
            notification={notification}
            tone={tone}
            label={
              tone === "success"
                ? t("successNoticeLabel")
                : t("errorNoticeLabel")
            }
            message={message}
            dismissLabel={t("dismissNotice")}
          />
        ),
        { duration: tone === "success" ? 5000 : 6500 },
      )
    },
    [t],
  )

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) {
      notify(
        "error",
        emailIsInvalid ? t("invalidEmail") : t("requiredFieldsError"),
      )
      return
    }

    setIsGenerating(true)
    try {
      const res = await fetch("/api/contact/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: trimmedEmail,
          company: company.trim() || undefined,
          business: business.trim() || undefined,
          customPrompt: customPrompt.trim(),
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 429) throw new Error(t("rateLimitError"))
        if (res.status >= 500) throw new Error(t("serviceUnavailableError"))
        throw new Error(data.error || "Generation failed")
      }

      setGenerated(data)
      setEditedSubject(data.subject)
      setEditedBody(data.body)
      notify("success", t("generated"))
    } catch (error) {
      notify(
        "error",
        error instanceof Error ? error.message : t("generateError"),
      )
    } finally {
      setIsGenerating(false)
    }
  }, [
    name,
    company,
    business,
    customPrompt,
    trimmedEmail,
    emailIsInvalid,
    canGenerate,
    notify,
    t,
  ])

  const handleSend = useCallback(async () => {
    if (!canSend) {
      notify("error", t("emailContentRequired"))
      return
    }

    setIsSending(true)
    try {
      const res = await fetch("/api/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          fromName:
            name.trim() || userEmail.trim().split("@")[0] || "Website visitor",
          fromEmail: userEmail.trim() || undefined,
          subject: editedSubject.trim(),
          message: editedBody.trim(),
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 429) throw new Error(t("rateLimitError"))
        if (res.status >= 500) throw new Error(t("serviceUnavailableError"))
        throw new Error(data.error || "Send failed")
      }

      notify("success", t("emailSent"))
    } catch (error) {
      notify("error", error instanceof Error ? error.message : t("emailError"))
    } finally {
      setIsSending(false)
    }
  }, [canSend, name, userEmail, editedSubject, editedBody, notify, t])

  return (
    <>
      <Toaster position="top-center" gutter={10} />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center md:mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Input panel */}
          <div className="space-y-5">
            {/* About You card */}
            <section className={contactCardClass}>
              <header className={contactCardHeaderClass}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                    {t("infoSection")}
                  </div>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {t("infoHint")}
                </p>
              </header>
              <div className="space-y-4 px-4 py-3.5 sm:px-5 sm:py-4">
                <InputWithIcon
                  id="contact-name"
                  icon={<User className="h-4 w-4" />}
                  label={t("nameLabel")}
                  required
                  requiredLabel={t("requiredLabel")}
                >
                  <Input
                    id="contact-name"
                    placeholder={t("namePlaceholder")}
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label={t("nameLabel")}
                    aria-required="true"
                    required
                  />
                </InputWithIcon>
                <InputWithIcon
                  id="contact-company"
                  icon={<Building2 className="h-4 w-4" />}
                  label={t("companyLabel")}
                  optionalLabel={t("optionalLabel")}
                >
                  <Input
                    id="contact-company"
                    placeholder={t("companyPlaceholder")}
                    maxLength={100}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    aria-label={t("companyLabel")}
                  />
                </InputWithIcon>
                <InputWithIcon
                  id="contact-email"
                  icon={<Mail className="h-4 w-4" />}
                  label={t("emailLabel")}
                  required
                  requiredLabel={t("requiredLabel")}
                  error={showEmailError ? t("invalidEmail") : undefined}
                >
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    maxLength={200}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    onBlur={() => setHasBlurredEmail(true)}
                    aria-label={t("emailLabel")}
                    aria-describedby={
                      showEmailError ? "contact-email-error" : undefined
                    }
                    aria-invalid={showEmailError}
                    aria-required="true"
                    required
                    className={
                      showEmailError
                        ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40"
                        : undefined
                    }
                  />
                </InputWithIcon>
                <InputWithIcon
                  id="contact-business"
                  icon={<Briefcase className="h-4 w-4" />}
                  label={t("businessLabel")}
                  optionalLabel={t("optionalLabel")}
                >
                  <Input
                    id="contact-business"
                    placeholder={t("businessPlaceholder")}
                    maxLength={200}
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    aria-label={t("businessLabel")}
                  />
                </InputWithIcon>
              </div>
            </section>

            {/* Custom prompt card */}
            <section className={contactCardClass}>
              <header className={contactCardHeaderClass}>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                    {t("customPromptLabel")}
                  </div>
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                    {t("requiredLabel")}
                  </span>
                </div>
              </header>
              <div className="px-4 py-3.5 sm:px-5 sm:py-4">
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-2.5 z-10 text-sm font-semibold text-destructive"
                  >
                    *
                  </span>
                  <Textarea
                    id="contact-message"
                    className="min-h-[100px] pl-7"
                    maxLength={500}
                    placeholder={t("customPromptPlaceholder")}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    aria-label={t("customPromptLabel")}
                    aria-required="true"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="inline-flex w-full items-center justify-center gap-2 border-2 border-primary/50 bg-primary/10 px-5 py-3 text-sm font-medium text-primary backdrop-blur-sm transition-colors duration-200 hover:border-primary/70 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border-border/60 disabled:bg-background/80 disabled:text-muted-foreground disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("generating")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t("generateButton")}
                </>
              )}
            </button>
            <p
              className={`text-center text-xs leading-5 ${
                canGenerate ? "text-primary" : "text-muted-foreground"
              }`}
              aria-live="polite"
            >
              {canGenerate
                ? t("readyToGenerate")
                : showEmailError
                  ? t("invalidEmail")
                  : t("requiredFieldsHint")}
            </p>
          </div>

          {/* Right: Email preview */}
          <div>
            <div className="sticky top-24 space-y-5">
              <section className={contactCardClass}>
                <header
                  className={`${contactCardHeaderClass} flex items-center gap-2`}
                >
                  <Pencil className="h-4 w-4 text-primary" />
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                    {t("previewSection")}
                  </div>
                </header>

                {generated ? (
                  <div className="space-y-4 px-4 py-3.5 sm:px-5 sm:py-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        {t("subjectLabel")}
                      </label>
                      <Input
                        value={editedSubject}
                        maxLength={200}
                        onChange={(e) => setEditedSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        {t("bodyLabel")}
                      </label>
                      <Textarea
                        className="min-h-[260px]"
                        maxLength={5000}
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
                    <Sparkles className="mb-4 h-6 w-6 text-muted-foreground/30" />
                    <p className="text-sm leading-5 text-muted-foreground">
                      {t("emptyPreview")}
                    </p>
                  </div>
                )}
              </section>

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!canSend || isSending}
                className="inline-flex w-full items-center justify-center gap-2 border-2 border-primary/40 bg-primary/10 px-5 py-3 text-sm font-medium text-primary backdrop-blur-sm transition-colors duration-200 hover:border-primary/60 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t("sendButton")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Icon wrapper for inputs ─── */

function InputWithIcon({
  id,
  icon,
  label,
  required = false,
  requiredLabel,
  optionalLabel,
  error,
  children,
}: {
  id: string
  icon: React.ReactNode
  label: string
  required?: boolean
  requiredLabel?: string
  optionalLabel?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
      >
        <span>{label}</span>
        {required ? (
          <>
            <span aria-hidden="true" className="text-primary">
              *
            </span>
            <span className="sr-only">{requiredLabel}</span>
          </>
        ) : optionalLabel ? (
          <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/70">
            {optionalLabel}
          </span>
        ) : null}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          {icon}
        </div>
        {required ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-9 z-10 flex items-center text-sm font-semibold text-destructive"
          >
            *
          </span>
        ) : null}
        <div className={required ? "[&_input]:pl-12" : "[&_input]:pl-9"}>
          {children}
        </div>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
