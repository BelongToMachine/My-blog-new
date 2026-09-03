"use client"

import { useState, useCallback, useRef } from "react"
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
  const [hasAttemptedGenerate, setHasAttemptedGenerate] = useState(false)
  const [hasAttemptedSend, setHasAttemptedSend] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const subjectRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const trimmedEmail = userEmail.trim()
  const emailIsInvalid =
    Boolean(trimmedEmail) && !emailPattern.test(trimmedEmail)
  const emailError = trimmedEmail
    ? emailIsInvalid && (hasBlurredEmail || hasAttemptedGenerate)
      ? t("invalidEmail")
      : undefined
    : hasAttemptedGenerate
      ? t("emailRequired")
      : undefined
  const showEmailError = Boolean(emailError)
  const canGenerate = Boolean(
    name.trim() && trimmedEmail && !emailIsInvalid && customPrompt.trim(),
  )
  const canSend = Boolean(editedSubject.trim() && editedBody.trim())
  const generateErrorMessage = !name.trim()
    ? t("nameRequired")
    : emailError
      ? emailError
      : !customPrompt.trim()
        ? t("messageRequired")
        : undefined
  const sendErrorMessage = !editedSubject.trim()
    ? t("subjectRequired")
    : !editedBody.trim()
      ? t("bodyRequired")
      : undefined

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
    setHasAttemptedGenerate(true)
    if (!canGenerate) {
      setHasBlurredEmail(true)
      if (!name.trim()) {
        nameRef.current?.focus()
      } else if (!trimmedEmail || emailIsInvalid) {
        emailRef.current?.focus()
      } else {
        promptRef.current?.focus()
      }
      const validationError = !name.trim()
        ? t("nameRequired")
        : !trimmedEmail
          ? t("emailRequired")
          : emailIsInvalid
            ? t("invalidEmail")
            : t("messageRequired")
      notify("error", validationError)
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
        throw new Error(
          typeof data.error === "string" ? data.error : t("generateError"),
        )
      }

      setGenerated(data)
      setEditedSubject(data.subject)
      setEditedBody(data.body)
      setHasAttemptedSend(false)
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
    setHasAttemptedSend(true)
    if (!canSend) {
      if (!editedSubject.trim()) {
        subjectRef.current?.focus()
      } else {
        bodyRef.current?.focus()
      }
      notify("error", sendErrorMessage ?? t("emailContentRequired"))
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
        throw new Error(
          typeof data.error === "string" ? data.error : t("emailError"),
        )
      }

      notify("success", t("emailSent"))
    } catch (error) {
      notify("error", error instanceof Error ? error.message : t("emailError"))
    } finally {
      setIsSending(false)
    }
  }, [
    canSend,
    name,
    userEmail,
    editedSubject,
    editedBody,
    sendErrorMessage,
    notify,
    t,
  ])

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
          <form
            className="space-y-5"
            aria-labelledby="contact-info-heading contact-prompt-heading"
            aria-busy={isGenerating}
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              void handleGenerate()
            }}
          >
            {hasAttemptedGenerate && !canGenerate && generateErrorMessage ? (
              <p
                className="border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-danger"
                role="alert"
              >
                {generateErrorMessage}
              </p>
            ) : null}

            {/* About You card */}
            <section className={contactCardClass}>
              <header className={contactCardHeaderClass}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h2
                    id="contact-info-heading"
                    className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground"
                  >
                    {t("infoSection")}
                  </h2>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {t("infoHint")}
                </p>
              </header>
              <div className="space-y-4 px-4 py-3.5 sm:px-5 sm:py-4">
                <InputWithIcon
                  htmlFor="contact-name"
                  label={t("nameLabel")}
                  icon={<User className="h-4 w-4" aria-hidden="true" />}
                  required
                  requiredLabel={t("requiredLabel")}
                  error={
                    hasAttemptedGenerate && !name.trim()
                      ? t("nameRequired")
                      : undefined
                  }
                  errorId="contact-name-error"
                >
                  <Input
                    ref={nameRef}
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={hasAttemptedGenerate && !name.trim()}
                    aria-describedby={
                      hasAttemptedGenerate && !name.trim()
                        ? "contact-name-error"
                        : undefined
                    }
                    placeholder={t("namePlaceholder")}
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </InputWithIcon>
                <InputWithIcon
                  htmlFor="contact-company"
                  label={t("companyLabel")}
                  icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
                  optionalLabel={t("optionalLabel")}
                >
                  <Input
                    id="contact-company"
                    name="company"
                    autoComplete="organization"
                    placeholder={t("companyPlaceholder")}
                    maxLength={100}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </InputWithIcon>
                <InputWithIcon
                  htmlFor="contact-email"
                  label={t("emailLabel")}
                  icon={<Mail className="h-4 w-4" aria-hidden="true" />}
                  required
                  requiredLabel={t("requiredLabel")}
                  error={emailError}
                  errorId="contact-email-error"
                >
                  <Input
                    ref={emailRef}
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    placeholder={t("emailPlaceholder")}
                    maxLength={200}
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    onBlur={() => setHasBlurredEmail(true)}
                    aria-describedby={
                      showEmailError ? "contact-email-error" : undefined
                    }
                    aria-invalid={showEmailError}
                    className={
                      showEmailError
                        ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40"
                        : undefined
                    }
                  />
                </InputWithIcon>
                <InputWithIcon
                  htmlFor="contact-business"
                  label={t("businessLabel")}
                  icon={<Briefcase className="h-4 w-4" aria-hidden="true" />}
                  optionalLabel={t("optionalLabel")}
                >
                  <Input
                    id="contact-business"
                    name="business"
                    placeholder={t("businessPlaceholder")}
                    maxLength={200}
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                  />
                </InputWithIcon>
              </div>
            </section>

            {/* Custom prompt card */}
            <section className={contactCardClass}>
              <header className={contactCardHeaderClass}>
                <div className="flex items-center gap-2">
                  <MessageSquare
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  <h2
                    id="contact-prompt-heading"
                    className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground"
                  >
                    {t("customPromptLabel")}
                  </h2>
                </div>
              </header>
              <div className="px-4 py-3.5 sm:px-5 sm:py-4">
                <label
                  htmlFor="contact-prompt"
                  className="mb-2 block text-xs font-medium text-muted-foreground"
                >
                  {t("customPromptLabel")}
                  <span aria-hidden="true" className="ml-1 text-danger">
                    *
                  </span>
                  <span className="sr-only">{t("requiredLabel")}</span>
                </label>
                <Textarea
                  ref={promptRef}
                  id="contact-prompt"
                  name="message"
                  required
                  aria-required="true"
                  aria-invalid={hasAttemptedGenerate && !customPrompt.trim()}
                  aria-describedby={
                    hasAttemptedGenerate && !customPrompt.trim()
                      ? "contact-message-error"
                      : undefined
                  }
                  className={`min-h-[100px] ${hasAttemptedGenerate && !customPrompt.trim() ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40" : ""}`}
                  placeholder={t("customPromptPlaceholder")}
                  maxLength={500}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                />
                {hasAttemptedGenerate && !customPrompt.trim() ? (
                  <p
                    id="contact-message-error"
                    className="mt-1.5 text-xs text-danger"
                    role="alert"
                  >
                    {t("messageRequired")}
                  </p>
                ) : null}
              </div>
            </section>

            {/* Generate button */}
            <button
              type="submit"
              disabled={isGenerating}
              aria-busy={isGenerating}
              className="inline-flex w-full items-center justify-center gap-2 border-2 border-border/60 bg-background/80 px-5 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-colors duration-200 hover:border-primary/50 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {t("generating")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {t("generateButton")}
                </>
              )}
            </button>
            <p
              className={`text-center text-xs leading-5 ${canGenerate ? "text-primary" : "text-muted-foreground"}`}
              aria-live="polite"
              aria-atomic="true"
            >
              {canGenerate ? t("readyToGenerate") : t("requiredFieldsHint")}
            </p>
          </form>

          {/* Right: Email preview */}
          <div>
            <form
              className="sticky top-24 space-y-5"
              aria-labelledby="contact-preview-heading"
              aria-busy={isSending}
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                void handleSend()
              }}
            >
              <section className={contactCardClass}>
                <header
                  className={`${contactCardHeaderClass} flex items-center gap-2`}
                >
                  <Pencil className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h2
                    id="contact-preview-heading"
                    className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground"
                  >
                    {t("previewSection")}
                  </h2>
                </header>

                {generated ? (
                  <div className="space-y-4 px-4 py-3.5 sm:px-5 sm:py-4">
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="mb-1.5 block text-xs font-medium text-muted-foreground"
                      >
                        {t("subjectLabel")}
                        <span aria-hidden="true" className="ml-1 text-danger">
                          *
                        </span>
                        <span className="sr-only">{t("requiredLabel")}</span>
                      </label>
                      <Input
                        ref={subjectRef}
                        id="contact-subject"
                        name="subject"
                        required
                        aria-required="true"
                        aria-invalid={hasAttemptedSend && !editedSubject.trim()}
                        aria-describedby={
                          hasAttemptedSend && !editedSubject.trim()
                            ? "contact-subject-error"
                            : undefined
                        }
                        value={editedSubject}
                        maxLength={200}
                        onChange={(e) => setEditedSubject(e.target.value)}
                      />
                      {hasAttemptedSend && !editedSubject.trim() ? (
                        <p
                          id="contact-subject-error"
                          className="mt-1.5 text-xs text-danger"
                          role="alert"
                        >
                          {t("subjectRequired")}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor="contact-body"
                        className="mb-1.5 block text-xs font-medium text-muted-foreground"
                      >
                        {t("bodyLabel")}
                        <span aria-hidden="true" className="ml-1 text-danger">
                          *
                        </span>
                        <span className="sr-only">{t("requiredLabel")}</span>
                      </label>
                      <Textarea
                        ref={bodyRef}
                        id="contact-body"
                        name="message"
                        required
                        aria-required="true"
                        aria-invalid={hasAttemptedSend && !editedBody.trim()}
                        aria-describedby={
                          hasAttemptedSend && !editedBody.trim()
                            ? "contact-body-error"
                            : undefined
                        }
                        className="min-h-[260px]"
                        maxLength={5000}
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                      />
                      {hasAttemptedSend && !editedBody.trim() ? (
                        <p
                          id="contact-body-error"
                          className="mt-1.5 text-xs text-danger"
                          role="alert"
                        >
                          {t("bodyRequired")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
                    <Sparkles
                      className="mb-4 h-6 w-6 text-muted-foreground/30"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-5 text-muted-foreground">
                      {t("emptyPreview")}
                    </p>
                  </div>
                )}
              </section>

              {hasAttemptedSend && !canSend && sendErrorMessage ? (
                <p
                  className="border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-danger"
                  role="alert"
                >
                  {sendErrorMessage}
                </p>
              ) : null}

              {/* Send button */}
              <button
                type="submit"
                disabled={!generated || isSending}
                aria-busy={isSending}
                className="inline-flex w-full items-center justify-center gap-2 border-2 border-primary/40 bg-primary/10 px-5 py-3 text-sm font-medium text-primary backdrop-blur-sm transition-colors duration-200 hover:border-primary/60 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {t("sendButton")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Icon wrapper for inputs ─── */

function InputWithIcon({
  icon,
  htmlFor,
  label,
  required = false,
  requiredLabel,
  optionalLabel,
  error,
  errorId,
  children,
}: {
  icon: React.ReactNode
  htmlFor: string
  label: string
  required?: boolean
  requiredLabel?: string
  optionalLabel?: string
  error?: string
  errorId?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
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
        <div className={required ? "[&_input]:pl-12" : "[&_input]:pl-9"}>
          {children}
        </div>
      </div>
      {error ? (
        <p id={errorId ?? `${htmlFor}-error`} className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
