"use client"
import React, { useRef, FormEvent, useState } from "react"
import emailjs from "@emailjs/browser"
import * as Label from "@radix-ui/react-label"
import { ContactFormErrors, createContactSchema } from "./validationSchema"
import TooltipIcon from "./components/TooltipIcon"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { useTranslations } from "next-intl"

const Contact: React.FC = () => {
  const t = useTranslations("contact")
  const form = useRef<HTMLFormElement>(null)
  const [formStatus, setFormStatus] = useState<string>("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const sendEmail = (e: FormEvent) => {
    e.preventDefault()
    const now = new Date().getTime()

    if (isOverLimitation(now)) {
      setFormStatus(t("limitMsg"))
      return
    }

    if (form.current) {
      const validationErrors = formValidate(form.current, {
        nameMin: t("validation.nameMin"),
        emailInvalid: t("validation.emailInvalid"),
        messageMin: t("validation.messageMin"),
      })
      setErrors(validationErrors)

      if (Object.keys(validationErrors).length > 0) return

      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          form.current,
          process.env.NEXT_PUBLIC_PUBLIC_KEY
        )
        .then(
          () => {
            setFormStatus("SUCCESS!")
            form.current!.reset()
            localStorage.setItem("lastSubmissionTime", now.toString())
          },
          (_error: unknown) => {
            setFormStatus(t("failureMsg"))
          }
        )
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
      <div className="section-shell p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <p className="section-kicker">{t("eyebrow")}</p>
              <TooltipIcon />
            </div>
            <div className="space-y-4">
              <h2 id="contact-me" className="home-page-heading max-w-xl">
                {t("heading")}
              </h2>
              <p className="section-copy">{t("intro")}</p>
            </div>
            <div className="rounded-[1.5rem] border border-border/70 bg-[linear-gradient(180deg,hsl(var(--secondary)/0.5),transparent)] p-5 dark:bg-[linear-gradient(180deg,rgba(14,165,233,0.08),rgba(15,23,42,0.05))]">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                {t("availabilityTitle")}
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                {t("availabilityBody")}
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-background/80 p-5 shadow-[0_24px_55px_rgba(15,23,42,0.08)] sm:p-6 dark:bg-slate-950/45">
            {formStatus && (
              <div
                className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${
                  formStatus === "SUCCESS!"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
                }`}
              >
                {formStatus === "SUCCESS!" ? t("successMsg") : formStatus}
              </div>
            )}

            <form ref={form} onSubmit={sendEmail} className="space-y-5">
              <FormField
                error={errors.user_name}
                htmlFor="name"
                label={t("yourName")}
              >
                <Input
                  type="text"
                  name="user_name"
                  id="name"
                  required
                  className={fieldClassName(errors.user_name)}
                />
              </FormField>

              <FormField
                error={errors.user_email}
                htmlFor="email"
                label={t("yourEmail")}
              >
                <Input
                  type="email"
                  name="user_email"
                  id="email"
                  required
                  className={fieldClassName(errors.user_email)}
                />
              </FormField>

              <FormField
                error={errors.message}
                htmlFor="message"
                label={t("message")}
              >
                <Textarea
                  name="message"
                  id="message"
                  required
                  className={`${fieldClassName(errors.message)} min-h-[160px] resize-y`}
                />
              </FormField>

              <Button
                type="submit"
                className="h-12 w-full rounded-full text-sm font-semibold shadow-[0_14px_30px_rgba(14,165,233,0.18)]"
              >
                {t("send")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

const FormField = ({
  children,
  error,
  htmlFor,
  label,
}: {
  children: React.ReactNode
  error?: string
  htmlFor: string
  label: string
}) => {
  return (
    <div className="space-y-2">
      <Label.Root
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground/80"
      >
        {label}
      </Label.Root>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

const fieldClassName = (error?: string) =>
  [
    "rounded-2xl border bg-background/75 px-4 py-3 text-sm shadow-none transition-colors duration-200",
    "focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0",
    error
      ? "border-red-500/60 focus-visible:ring-red-500/20"
      : "border-border/80 hover:border-primary/35",
  ].join(" ")

const formValidate = (
  form: HTMLFormElement,
  messages: {
    nameMin: string
    emailInvalid: string
    messageMin: string
  }
) => {
  const formData = {
    user_name: form.user_name.value,
    user_email: form.user_email.value,
    message: form.message.value,
  }

  const validation = createContactSchema(
    (key) => messages[key as keyof typeof messages]
  ).safeParse(formData)
  const validationErrors: ContactFormErrors = {}

  if (!validation.success) {
    validation.error.errors.forEach((error) => {
      if (error.path.length > 0) {
        validationErrors[error.path[0] as string] = error.message
      }
    })
  }

  return validationErrors
}

const isOverLimitation = (time: number) => {
  const lastSubmissionTime = localStorage.getItem("lastSubmissionTime")
  if (
    lastSubmissionTime &&
    time - parseInt(lastSubmissionTime) < 24 * 60 * 60 * 1000
  ) {
    return true
  }

  return false
}

export default Contact
