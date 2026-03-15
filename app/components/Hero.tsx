"use client"
import React, { useContext } from "react"
import selfie from "@/public/images/me2.png"
import Image from "next/image"
import { TypeAnimation } from "react-type-animation"
import { motion } from "framer-motion"
import { ThemeContext } from "../context/DarkModeContext"
import { CodeBlocker } from "../packages/index"
import { useTranslations } from "next-intl"

const Hero = () => {
  const t = useTranslations("hero")
  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    throw new Error("ThemeToggle must be used within a ThemeProvider")
  }

  const { colorMode } = themeContext
  const typeSequence = t.raw("typeSequence") as string[]
  const code = t.raw("code") as string

  return (
    <section
      id="about-me-section"
      className="mx-auto flex max-w-6xl items-center px-4 pb-2 pt-2 sm:px-6 lg:min-h-[75vh] lg:px-8 lg:pb-4"
    >
      <div className="grid w-full grid-cols-1 items-center gap-4 lg:-translate-x-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col lg:items-end"
        >
          <div className="mb-2 w-full lg:max-w-[34rem] lg:text-right">
            <p className="section-kicker mb-2 lg:text-right">{t("eyebrow")}</p>
            <h1 className="home-page-heading max-w-4xl lg:ml-auto lg:text-right">
              <span className="block text-muted-foreground">{t("greeting")}</span>
              <span className="mt-2 block text-balance text-foreground">
                <TypeAnimation
                  sequence={typeSequence.flatMap((value) => [value, 1500])}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="inline-block min-h-[1.1em]"
                />
              </span>
            </h1>
          </div>
          <div className="grid w-full gap-3 lg:max-w-[39.75rem]">
            <div className="rounded-[1.1rem] border border-border/80 shadow-[0_12px_24px_rgba(15,23,42,0.08)] lg:ml-auto lg:max-w-[35.75rem]">
              <CodeBlocker code={code} colorMode={colorMode} />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative flex justify-center lg:h-full lg:justify-end"
        >
          <div className="relative w-full max-w-[320px]">
            <div className="absolute -left-2 top-6 h-24 w-24 rounded-full bg-[hsl(var(--secondary)/0.8)] blur-3xl dark:bg-[hsl(var(--primary)/0.18)]" />
            <div className="absolute -right-1 bottom-8 h-24 w-24 rounded-full bg-[hsl(var(--primary)/0.14)] blur-3xl" />
            <div className="pointer-events-none absolute inset-x-3 top-2 flex items-center justify-between text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span>{t("portraitLabel")}</span>
              <span>{t("locationLabel")}</span>
            </div>
            <Image
              src={selfie}
              alt={t("imageAlt")}
              width={380}
              height={340}
              className="relative z-10 ml-auto h-auto w-full object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
