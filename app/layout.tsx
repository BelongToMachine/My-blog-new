import "./globals.css"
import type { Metadata } from "next"
import Script from "next/script"
import { JetBrains_Mono } from "next/font/google"
import "@radix-ui/themes/styles.css"
import "@pigment-css/react/styles.css"
import { getLocale } from "next-intl/server"
import { GlobalChatRuntimeProvider } from "./context/GlobalChatRuntimeContext"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Developer — Front-End Developer & AI Prompt Engineer",
  description:
    "Portfolio of Developer (开发者) — a front-end developer specializing in React, Next.js, TypeScript, and AI integrations. Open to remote opportunities worldwide.",
  keywords: [
    "front-end developer",
    "React",
    "Next.js",
    "TypeScript",
    "AI",
    "remote developer",
  ],
  openGraph: {
    title: "Developer — Front-End Developer",
    description:
      "React / Next.js portfolio with AI chatbot, bilingual writing, and polished front-end engineering",
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
    <html lang={locale} suppressHydrationWarning className={jetbrainsMono.variable}>
      <head>
        <Script id="theme-script" src="/index.js" strategy="beforeInteractive" />
      </head>
      <body>
        <GlobalChatRuntimeProvider>{children}</GlobalChatRuntimeProvider>
      </body>
    </html>
  )
}
