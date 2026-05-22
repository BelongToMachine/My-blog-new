"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Send, Sparkles, Pencil, Mail, User, Building2, Briefcase, MessageSquare } from "lucide-react"
import toast from "react-hot-toast"

interface GeneratedEmail {
  subject: string
  body: string
}

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

  const canGenerate = name || company || business || customPrompt.trim()
  const canSend = editedSubject.trim() && editedBody.trim() && userEmail.trim()

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return

    setIsGenerating(true)
    try {
      const res = await fetch("/api/contact/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          company: company.trim() || undefined,
          business: business.trim() || undefined,
          customPrompt: customPrompt.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Generation failed")
      }

      setGenerated(data)
      setEditedSubject(data.subject)
      setEditedBody(data.body)
      toast.success(t("generated"))
    } catch {
      toast.error(t("generateError"))
    } finally {
      setIsGenerating(false)
    }
  }, [name, company, business, customPrompt, canGenerate, t])

  const handleSend = useCallback(async () => {
    if (!canSend) {
      toast.error(t("emailRequired"))
      return
    }

    setIsSending(true)
    try {
      const res = await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromName: name.trim() || userEmail.split("@")[0],
          fromEmail: userEmail.trim(),
          subject: editedSubject.trim(),
          message: editedBody.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Send failed")
      }

      toast.success(t("emailSent"))
    } catch (error) {
      toast.error(t("emailError"))
    } finally {
      setIsSending(false)
    }
  }, [canSend, name, userEmail, editedSubject, editedBody, t])

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-balance text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      {/* Main grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Input panel */}
        <div className="space-y-6">
          {/* Quick info */}
          <div className="rounded-2xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-foreground/70">
              <User className="h-4 w-4" />
              {t("infoSection")}
            </h2>
            <p className="mb-5 text-xs text-muted-foreground">{t("infoHint")}</p>

            <div className="space-y-4">
              <InputField
                icon={<User className="h-4 w-4" />}
                label={t("nameLabel")}
                placeholder={t("namePlaceholder")}
                value={name}
                onChange={setName}
              />
              <InputField
                icon={<Building2 className="h-4 w-4" />}
                label={t("companyLabel")}
                placeholder={t("companyPlaceholder")}
                value={company}
                onChange={setCompany}
              />
              <InputField
                icon={<Mail className="h-4 w-4" />}
                label={t("emailLabel")}
                placeholder={t("emailPlaceholder")}
                value={userEmail}
                onChange={setUserEmail}
                type="email"
              />
              <InputField
                icon={<Briefcase className="h-4 w-4" />}
                label={t("businessLabel")}
                placeholder={t("businessPlaceholder")}
                value={business}
                onChange={setBusiness}
              />
            </div>
          </div>

          {/* Custom prompt */}
          <div className="rounded-2xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-foreground/70">
              <MessageSquare className="h-4 w-4" />
              {t("customPromptLabel")}
            </h2>
            <textarea
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={4}
              placeholder={t("customPromptPlaceholder")}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="group relative w-full overflow-hidden rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  {t("generating")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {t("generateButton")}
                </>
              )}
            </span>
          </button>
        </div>

        {/* Right: Email preview */}
        <div>
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-foreground/70">
                <Pencil className="h-4 w-4" />
                {t("previewSection")}
              </h2>

              {generated ? (
                <div className="space-y-4">
                  {/* Subject */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      {t("subjectLabel")}
                    </label>
                    <input
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      {t("bodyLabel")}
                    </label>
                    <textarea
                      className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      rows={14}
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Sparkles className="h-6 w-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">{t("emptyPreview")}</p>
                </div>
              )}
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!canSend || isSending}
              className="group relative w-full overflow-hidden rounded-xl border border-primary/30 bg-primary/10 px-6 py-4 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="flex items-center justify-center gap-2">
                {isSending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    {t("sendButton")}
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Tiny local input component ─── */

function InputField({
  icon,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  icon: React.ReactNode
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
