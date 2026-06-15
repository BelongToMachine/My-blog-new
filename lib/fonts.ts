import localFont from "next/font/local"

export const bebasNeue = localFont({
  src: "../public/fonts/bebas-neue/BebasNeue-Regular.woff2",
  display: "swap",
  variable: "--font-bebas",
  preload: true,
})

export const geistMono = localFont({
  src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  display: "swap",
  variable: "--font-geist-mono",
  weight: "100 900",
  preload: false,
  adjustFontFallback: false,
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Roboto Mono",
    "Menlo",
    "Monaco",
    "Liberation Mono",
    "DejaVu Sans Mono",
    "Courier New",
    "monospace",
  ],
})
