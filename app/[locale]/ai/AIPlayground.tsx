"use client"

import React, { useMemo, useState } from "react"
import ChatBot from "@/app/components/Chatbot"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { useTranslations } from "next-intl"

const AIPlayground = () => {
  const t = useTranslations("ai")
  const [mode, setMode] = useState<"text" | "image">("text")
  const [prompt, setPrompt] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const canSubmit = useMemo(() => {
    if (mode === "image") {
      return Boolean(prompt.trim()) && Boolean(file)
    }

    return Boolean(prompt.trim())
  }, [file, mode, prompt])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const request =
        mode === "image"
          ? await submitImagePrompt(prompt, file)
          : await submitTextPrompt(prompt)

      setResponse(request)
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : t("errorGeneric")
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6 lg:px-8 lg:pb-24">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="section-kicker">{t("eyebrow")}</p>
            <h1 className="pixel-heading max-w-3xl text-[clamp(1.4rem,4vw,2.6rem)]">{t("title")}</h1>
            <p className="section-copy max-w-xl">{t("description")}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <ModeCard
              active={mode === "text"}
              body={t("textModeDescription")}
              title={t("textMode")}
              onClick={() => setMode("text")}
            />
            <ModeCard
              active={mode === "image"}
              body={t("imageModeDescription")}
              title={t("imageMode")}
              onClick={() => setMode("image")}
            />
          </div>

          <form
            className="section-shell space-y-5 p-5 md:p-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <label
                htmlFor="ai-prompt"
                className="font-pixel text-[10px] uppercase tracking-[0.18em] text-foreground"
              >
                {t("promptLabel")}
              </label>
              <Textarea
                id="ai-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={
                  mode === "image"
                    ? t("imagePromptPlaceholder")
                    : t("textPromptPlaceholder")
                }
                className="min-h-[180px] rounded-2xl border-border/80 bg-background/80 px-4 py-4 text-sm"
              />
            </div>

            {mode === "image" && (
              <div className="space-y-2">
                <label
                  htmlFor="ai-image"
                  className="font-pixel text-[10px] uppercase tracking-[0.18em] text-foreground"
                >
                  {t("imageLabel")}
                </label>
                <Input
                  id="ai-image"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setFile(event.target.files?.[0] ?? null)
                  }
                  className="rounded-2xl border-border/80 bg-background/80 px-4 py-3 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {t("imageHelp")}
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {mode === "image" ? t("imageHint") : t("textHint")}
              </p>
              <Button
                type="submit"
                disabled={!canSubmit || isLoading}
                className="rounded-full px-6"
              >
                {isLoading ? t("loading") : t("submit")}
              </Button>
            </div>
          </form>
        </div>

        <div className="section-shell min-h-[520px] p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker mb-2">{t("resultEyebrow")}</p>
              <h2 className="font-pixel text-sm uppercase tracking-[0.16em] text-foreground md:text-base">
                {t("resultTitle")}
              </h2>
            </div>
          </div>

          {response ? (
            <ChatBot input={response} />
          ) : (
            <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-border/80 bg-background/50 p-8 text-center text-sm leading-7 text-muted-foreground">
              {t("empty")}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const ModeCard = ({
  active,
  body,
  onClick,
  title,
}: {
  active: boolean
  body: string
  onClick: () => void
  title: string
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-5 py-5 text-left transition-all duration-300 ${
        active
          ? "border-primary/45 bg-[linear-gradient(180deg,hsl(var(--secondary)/0.55),transparent)] shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
          : "border-border/75 bg-background/70 hover:border-primary/25"
      }`}
    >
      <p className="font-pixel mb-2 text-xs uppercase tracking-[0.16em] text-foreground md:text-sm">
        {title}
      </p>
      <p className="text-sm leading-7 text-muted-foreground">{body}</p>
    </button>
  )
}

const submitTextPrompt = async (prompt: string) => {
  const response = await fetch("/api/usecase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: prompt }),
  })

  return handleApiResponse(response)
}

const submitImagePrompt = async (prompt: string, file: File | null) => {
  if (!file) {
    throw new Error("Missing image")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("prompt", prompt)

  const response = await fetch("/api/usecase", {
    method: "POST",
    body: formData,
  })

  return handleApiResponse(response)
}

const handleApiResponse = async (response: Response) => {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Request failed"
    )
  }

  return typeof data === "string" ? data : data.response ?? JSON.stringify(data)
}

export default AIPlayground
