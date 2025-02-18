"use client"
import React, { useRef, FormEvent, useState } from "react"
import emailjs from "@emailjs/browser"
import * as Label from "@radix-ui/react-label"
import { contactSchema, ContactFormErrors } from "./validationSchema"
import { Box } from "@radix-ui/themes"
import * as Tooltip from "@radix-ui/react-tooltip"
import TooltipIcon from "./components/TooltipIcon"

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null)
  const [formStatus, setFormStatus] = useState<string>("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const sendEmail = (e: FormEvent) => {
    e.preventDefault()
    const now = new Date().getTime()

    if (isOverLimitation(now)) {
      setFormStatus("You can only send one message per day.")
      return
    }

    if (form.current) {
      const validationErrors = formValidate(form.current)
      setErrors(validationErrors)

      if (Object.keys(validationErrors).length > 0) return

      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_SERVICE_ID!,
          "template_02pba33", // template_id
          form.current,
          process.env.NEXT_PUBLIC_PUBLIC_KEY
        )
        .then(
          () => {
            setFormStatus("SUCCESS!")
            form.current!.reset()
            localStorage.setItem("lastSubmissionTime", now.toString())
          },
          (error: any) => {
            console.log("FAILED...", error.text)
            setFormStatus("FAILED...")
          }
        )
    }
  }

  return (
    <>
      <Box
        id="projects"
        className="flex mb-3 mt-10 justify-center items-center"
      >
        <h1 id="contact-me" className="home-page-heading">
          联系我
        </h1>
        <TooltipIcon />
      </Box>

      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-5">
        {formStatus && (
          <div
            className={`p-4 mb-4 text-sm ${
              formStatus === "SUCCESS!"
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            } rounded-lg`}
          >
            {formStatus === "SUCCESS!" ? "您的邮件已送达!" : formStatus}
          </div>
        )}

        <form ref={form} onSubmit={sendEmail} className="space-y-6">
          <div className="space-y-2">
            <Label.Root
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              您的名字
            </Label.Root>
            <input
              type="text"
              name="user_name"
              id="name"
              required
              className={`block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.user_name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.user_name && (
              <p className="text-red-500 text-sm">{errors.user_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label.Root
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              您的邮箱
            </Label.Root>
            <input
              type="email"
              name="user_email"
              id="email"
              required
              className={`block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.user_email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.user_email && (
              <p className="text-red-500 text-sm">{errors.user_email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label.Root
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              消息
            </Label.Root>
            <textarea
              name="message"
              id="message"
              required
              className={`block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.message ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
          </div>

          <div>
            <input
              type="submit"
              value="Send"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </form>
      </div>
    </>
  )
}

const formValidate = (form: HTMLFormElement) => {
  const formData = {
    user_name: form.user_name.value,
    user_email: form.user_email.value,
    message: form.message.value,
  }

  const validation = contactSchema.safeParse(formData)
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
