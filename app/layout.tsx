import "./globals.css"
import type { Metadata } from "next"
import Script from "next/script"
import "@radix-ui/themes/styles.css"
import "@pigment-css/react/styles.css"
import { getLocale } from "next-intl/server"

export const metadata: Metadata = {
  title: "Jie Liao — Front-End Developer & AI Prompt Engineer",
  description:
    "Portfolio of Jie Liao (廖永杰) — a front-end developer specializing in React, Next.js, TypeScript, and AI integrations. Open to remote opportunities worldwide.",
  keywords: [
    "front-end developer",
    "React",
    "Next.js",
    "TypeScript",
    "AI",
    "remote developer",
  ],
  openGraph: {
    title: "Jie Liao — Front-End Developer",
    description:
      "React / Next.js portfolio with AI chatbot, blog system, and project showcase",
    type: "website",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <head>
        <Script id="theme-script" src="/index.js" strategy="beforeInteractive" />
      </head>
      <body>{children}</body>
    </html>
  )
}
