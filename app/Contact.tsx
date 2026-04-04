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
import {
  FormMessage,
  SectionHeading,
  StatusMessage,
  SurfaceCard,
} from "./components/system"

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
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!, // template_id
          form.current,
          process.env.NEXT_PUBLIC_PUBLIC_KEY
        )
        .then(
          () => {
            setFormStatus("SUCCESS!")
            setErrors({})
            form.current!.reset()
            localStorage.setItem("lastSubmissionTime", now.toString())
          },
          (error: any) => {
            console.log("FAILED...", error.text)
            setFormStatus(t("failureMsg"))
          }
        )
    }
  }

  return (
    <>
      <div
        id="contact"
        className="mt-10"
      >
        <SectionHeading
          title={t("heading")}
          action={<TooltipIcon />}
          className="mb-0"
          align="center"
        />
      </div>

      <SurfaceCard className="mx-auto mt-5 max-w-2xl" padding="lg">
          {formStatus && (
            <StatusMessage
              className="mb-4"
              tone={formStatus === "SUCCESS!" ? "success" : "error"}
              title={formStatus === "SUCCESS!" ? t("successMsg") : t("failureMsg")}
            >
              {formStatus === "SUCCESS!" ? t("successMsg") : formStatus}
            </StatusMessage>
          )}

          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div className="space-y-2">
              <Label.Root
                htmlFor="name"
                className="block text-sm font-medium text-foreground/80"
              >
                {t("yourName")}
              </Label.Root>
              <Input
                type="text"
                name="user_name"
                id="name"
                required
                state={errors.user_name ? "error" : "default"}
              />
              {errors.user_name && (
                <FormMessage tone="error" className="border-none bg-transparent px-0 py-0">
                  {errors.user_name}
                </FormMessage>
              )}
            </div>

            <div className="space-y-2">
              <Label.Root
                htmlFor="email"
                className="block text-sm font-medium text-foreground/80"
              >
                {t("yourEmail")}
              </Label.Root>
              <Input
                type="email"
                name="user_email"
                id="email"
                required
                state={errors.user_email ? "error" : "default"}
              />
              {errors.user_email && (
                <FormMessage tone="error" className="border-none bg-transparent px-0 py-0">
                  {errors.user_email}
                </FormMessage>
              )}
            </div>

            <div className="space-y-2">
              <Label.Root
                htmlFor="message"
                className="block text-sm font-medium text-foreground/80"
              >
                {t("message")}
              </Label.Root>
              <Textarea
                name="message"
                id="message"
                required
                state={errors.message ? "error" : "default"}
              />
              {errors.message && (
                <FormMessage tone="error" className="border-none bg-transparent px-0 py-0">
                  {errors.message}
                </FormMessage>
              )}
            </div>

            <div>
              <Button type="submit" className="w-full rounded-xl">
                {t("send")}
              </Button>
            </div>
          </form>
      </SurfaceCard>
    </>
  )
}

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

  const validation = createContactSchema((key) => messages[key as keyof typeof messages]).safeParse(formData)
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
  )
    return true

  return false
}

export default Contact
