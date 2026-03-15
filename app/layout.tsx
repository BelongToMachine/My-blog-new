import "./globals.css"
import type { Metadata } from "next"
import Script from "next/script"
// import { Inter } from "next/font/google";
import NavBar from "./NavBar"
import "@radix-ui/themes/styles.css"
import { Theme } from "@radix-ui/themes"
import AuthProvider from "./auth/Provider"
import QueryClientProvider from "./QueryClientProvider"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import CursorManager from "./CursorManager"
import "@pigment-css/react/styles.css"
import { ThemeProvider } from "./context/DarkModeContext"
import { xTheme } from "./service/ThemeService"

// const inter = Inter({ subsets: ["latin"] });

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script id="theme-script" src="/index.js" strategy="beforeInteractive" />
      </head>
      <body style={xTheme.layoutBackground}>
        {/* className={inter.className} */}
        <QueryClientProvider>
          <AuthProvider>
            <ThemeProvider>
              <Theme appearance="light" accentColor="sky" radius="small">
                <NavBar />
                <CursorManager />
                <main className="pt-14">{children}</main>
              </Theme>
              <ReactQueryDevtools />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
