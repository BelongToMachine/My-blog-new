"use client"
import React, { useContext, useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import selfie from "@/public/images/selfie-no-background.png"
import { TypeAnimation } from "react-type-animation"
import { motion } from "framer-motion"
import { ThemeContext } from "../context/DarkModeContext"
import { CodeBlocker } from "../packages/index"
import { useLocale, useTranslations } from "next-intl"
import { FloatingPixelAssistant } from "./PixelAssistantPreview"
import { Link } from "@/app/i18n/navigation"

const SHOW_FLOATING_ASSISTANT = false

interface Props {
  showBackLink?: boolean
}

const Hero = ({ showBackLink = true }: Props) => {
  const t = useTranslations("hero")
  const locale = useLocale()
  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    throw new Error("ThemeToggle must be used within a ThemeProvider")
  }

  const { colorMode } = themeContext
  const heroPortrait = selfie
  const portraitImageClass =
    "h-full w-full object-contain object-bottom scale-[1.08]"

  const typeSequence = t.raw("typeSequence") as string[]
  const code = t.raw("code") as string
  const [typingIndex, setTypingIndex] = useState(0)
  const isEnLongText = locale === "en" && typingIndex === 1

  return (
    <div
      className="relative px-5 pb-12 pt-10 md:px-10 md:pt-12 lg:px-14 lg:pb-10 lg:pt-10"
      id="about-me-section"
    >
      {/* Back to Index */}
      {showBackLink ? (
        <Link
          href="/"
          className="absolute -left-1 top-3 z-30 inline-flex items-center gap-1.5 border-2 border-primary/30 bg-background/80 px-2.5 py-1.5 font-pixel text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-sm transition-all duration-200 hover:border-primary/60 hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 md:-left-1 md:top-5"
        >
          <span>←</span>
          <span>{t("backToNav")}</span>
        </Link>
      ) : null}
      <div className="grid grid-cols-1 items-start gap-8 lg:-translate-y-4 lg:grid-cols-12 lg:items-start lg:gap-x-4 xl:-translate-y-6 xl:gap-x-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex w-full items-start justify-center lg:col-start-2 lg:col-end-8 lg:justify-start"
        >
          <div className="relative w-full min-w-0 max-w-[800px] lg:max-w-[620px] xl:max-w-[680px]">
            <h1 className="mb-3 min-h-[5rem] text-left text-[1.75rem] min-[375px]:text-[2rem] md:text-[2.5rem] font-extrabold leading-[1.05] lg:min-h-[7rem] lg:text-5xl xl:min-h-[8rem] xl:text-6xl">
              <span className="font-pixel uppercase tracking-[0.04em] text-primary">
                {`${t("greeting")} `}
              </span>
              <TypeAnimation
                sequence={typeSequence.flatMap((value, index) => [
                  () => setTypingIndex(index),
                  value,
                  1500,
                ])}
                wrapper="div"
                speed={50}
                repeat={Infinity}
                className={cn(
                  "font-pixel mt-1 block whitespace-nowrap min-h-[1.1em] text-left uppercase tracking-[0.04em] text-foreground transition-all duration-300",
                  isEnLongText && "lg:text-[0.55em]",
                )}
              />
            </h1>
            <p className="font-pixel mb-4 mt-2 max-w-xl text-sm leading-relaxed tracking-wide text-muted-foreground md:text-base">
              {t("shortIntro")}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="mb-5"
            >
              <Link
                href="/ai"
                className="ai-cta-shimmer group inline-flex items-center gap-2 border-2 border-primary/35 bg-primary/[0.04] px-3.5 py-2 font-pixel text-[11px] uppercase tracking-[0.22em] text-primary transition-all duration-200 hover:border-primary/70 hover:bg-primary/[0.09] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <span>{t("aiCtaLabel")}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </motion.div>
            {SHOW_FLOATING_ASSISTANT ? <FloatingPixelAssistant /> : null}
            <div className="relative mt-5 min-h-[280px] md:min-h-[360px] lg:hidden">
              <div className="relative z-10 w-full max-w-[500px] min-w-0 pt-6">
                <CodeBlocker
                  code={code}
                  colorMode={colorMode}
                  compact
                  className="hero-codeblock-mobile h-full"
                />
              </div>
            </div>
            <div className="mt-6 hidden w-full min-w-0 max-w-[560px] lg:block xl:max-w-[600px]">
              <CodeBlocker code={code} colorMode={colorMode} />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative z-20 hidden lg:col-start-8 lg:col-end-12 lg:flex lg:items-start lg:justify-start"
        >
          <div className="relative ml-2 mt-32 w-full max-w-[340px] lg:mt-36 lg:-translate-x-3 xl:ml-0 xl:mt-32 xl:max-w-[380px] xl:translate-x-0">
            <div className="relative aspect-square w-[276px] lg:w-[304px] xl:w-[344px]">
                <Image
                  src={heroPortrait}
                  alt={t("imageAlt")}
                  fill
                  sizes="(min-width: 1280px) 308px, 272px"
                  className={portraitImageClass}
                  priority
                />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
