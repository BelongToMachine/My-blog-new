"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Send, Sparkles, Pencil, Mail, User, Building2, Briefcase, MessageSquare, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"

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
    } catch {
      toast.error(t("emailError"))
    } finally {
      setIsSending(false)
    }
  }, [canSend, name, userEmail, editedSubject, editedBody, t])

  return (
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
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Input panel */}
        <div className="space-y-6">
          {/* About You card */}
          <section className="pixel-panel panel-grid overflow-hidden border border-border/80 bg-card/88 text-card-foreground">
            <header className="border-b border-border/70 px-3 py-3.5 sm:px-4 sm:py-4 md:px-5">
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
            <div className="space-y-4 px-3 py-3.5 sm:px-4 sm:py-4 md:px-5 md:py-5">
              <InputWithIcon icon={<User className="h-4 w-4" />}>
                <Input
                  placeholder={t("namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label={t("nameLabel")}
                />
              </InputWithIcon>
              <InputWithIcon icon={<Building2 className="h-4 w-4" />}>
                <Input
                  placeholder={t("companyPlaceholder")}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  aria-label={t("companyLabel")}
                />
              </InputWithIcon>
              <InputWithIcon icon={<Mail className="h-4 w-4" />}>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  aria-label={t("emailLabel")}
                />
              </InputWithIcon>
              <InputWithIcon icon={<Briefcase className="h-4 w-4" />}>
                <Input
                  placeholder={t("businessPlaceholder")}
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  aria-label={t("businessLabel")}
                />
              </InputWithIcon>
            </div>
          </section>

          {/* Custom prompt card */}
          <section className="pixel-panel panel-grid overflow-hidden border border-border/80 bg-card/88 text-card-foreground">
            <header className="border-b border-border/70 px-3 py-3.5 sm:px-4 sm:py-4 md:px-5">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                  {t("customPromptLabel")}
                </div>
              </div>
            </header>
            <div className="px-3 py-3.5 sm:px-4 sm:py-4 md:px-5 md:py-5">
              <Textarea
                className="min-h-[100px]"
                placeholder={t("customPromptPlaceholder")}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>
          </section>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="inline-flex w-full items-center justify-center gap-2 border-2 border-primary bg-primary/18 px-5 py-3 text-sm font-medium text-primary shadow-[4px_4px_0_hsl(var(--foreground)/0.28)] transition-[background-color,color,border-color,box-shadow] duration-200 ease-out hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
        </div>

        {/* Right: Email preview */}
        <div>
          <div className="sticky top-24 space-y-6">
            <section className="pixel-panel panel-grid overflow-hidden border border-border/80 bg-card/88 text-card-foreground">
              <header className="flex items-center gap-2 border-b border-border/70 px-3 py-3.5 sm:px-4 sm:py-4 md:px-5">
                <Pencil className="h-4 w-4 text-primary" />
                <div className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                  {t("previewSection")}
                </div>
              </header>

              {generated ? (
                <div className="space-y-4 px-3 py-3.5 sm:px-4 sm:py-4 md:px-5 md:py-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      {t("subjectLabel")}
                    </label>
                    <Input
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      {t("bodyLabel")}
                    </label>
                    <Textarea
                      className="min-h-[260px]"
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-3 py-16 text-center sm:px-4 md:px-5">
                  <div className="mb-4 border-2 border-muted-foreground/20 bg-muted/50 p-4">
                    <Sparkles className="h-6 w-6 text-muted-foreground/40" />
                  </div>
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
              className="inline-flex w-full items-center justify-center gap-2 border-2 border-border/80 bg-card/70 px-5 py-3 text-sm font-medium text-foreground shadow-[4px_4px_0_hsl(var(--foreground)/0.16)] transition-[background-color,color,border-color,box-shadow] duration-200 ease-out hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
  )
}

/* ─── Icon wrapper for inputs ─── */

function InputWithIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
        {icon}
      </div>
      <div className="[&_input]:pl-9">{children}</div>
    </div>
  )
}
