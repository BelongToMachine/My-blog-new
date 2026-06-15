import "./globals.css"
import type { Metadata } from "next"
import { headers } from "next/headers"
import Script from "next/script"
import "@radix-ui/themes/styles.css"
import "@pigment-css/react/styles.css"
import { getLocale } from "next-intl/server"
import { GlobalChatRuntimeProvider } from "./context/GlobalChatRuntimeContext"
import { Analytics } from "@vercel/analytics/next"
import DeferredFontLoader from "./DeferredFontLoader"
import { bebasNeue } from "@/lib/fonts"

const analyticsEnabled =
  process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true"

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
  const visitorCountry = headers().get("x-vercel-ip-country")
  const shouldLoadAnalytics =
    analyticsEnabled && visitorCountry !== "CN"

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={bebasNeue.variable}
    >
      <head>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html:
              "(function(){" +
              "var m=localStorage.getItem('color-mode');" +
              "if(m!=='light'&&m!=='dark'){m=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';}" +
              "document.documentElement.classList.toggle('dark',m==='dark');" +
              "document.documentElement.dataset.colorMode=m;" +
              "document.documentElement.style.colorScheme=m;" +
              "})();",
          }}
        />
        <Script id="theme-script" src="/index.js" strategy="beforeInteractive" />
      </head>
      <body>
        <GlobalChatRuntimeProvider>{children}</GlobalChatRuntimeProvider>
        <DeferredFontLoader />
        {shouldLoadAnalytics ? <Analytics /> : null}
      </body>
    </html>
  )
}
