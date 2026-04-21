"use client"
import React, { useContext, useState } from "react"
import { cn } from "@/lib/utils"
import selfie from "@/public/images/me2.png"
import Image from "next/image"
import { TypeAnimation } from "react-type-animation"
import { motion } from "framer-motion"
import { ThemeContext } from "../context/DarkModeContext"
import { CodeBlocker } from "../packages/index"
import { useLocale, useTranslations } from "next-intl"
import { TerminalPill } from "./system/TerminalPill"

const Hero = () => {
  const t = useTranslations("hero")
  const locale = useLocale()
  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    throw new Error("ThemeToggle must be used within a ThemeProvider")
  }

  const { colorMode } = themeContext

  const typeSequence = t.raw("typeSequence") as string[]
  const code = t.raw("code") as string
  const [typingIndex, setTypingIndex] = useState(0)
  const isEnLongText = locale === "en" && typingIndex === 1
  return (
    <div id="about-me-section" className="px-5 pb-12 pt-6 sm:px-10 md:px-14 lg:pb-12 lg:pt-2">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-8 lg:items-end">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex w-full justify-center items-start lg:justify-start lg:items-end lg:col-start-2 lg:col-end-7"
        >
          <div className="w-full max-w-[800px] lg:max-w-[560px] min-w-0 lg:mb-14">
            <div className="mb-5 flex flex-wrap gap-2">
              <TerminalPill tone="cyan">frontend log</TerminalPill>
              <TerminalPill tone="amber">next.js</TerminalPill>
              <TerminalPill tone="rose">ai notes</TerminalPill>
            </div>
            <h1 className="mb-3 min-h-[5rem] text-left text-[1.75rem] min-[375px]:text-[2rem] sm:text-[2.5rem] font-extrabold leading-[1.05] md:min-h-[7rem] md:text-5xl lg:min-h-[8rem] lg:text-6xl">
              <span className="font-pixel uppercase tracking-[0.04em] text-primary">
                {`${t("greeting")} `}
              </span>
              <TypeAnimation
                sequence={typeSequence.flatMap((value, index) => [
                  () => setTypingIndex(index),
                  value,
                  1500
                ])}
                wrapper="div"
                speed={50}
                repeat={Infinity}
                className={cn(
                  "font-pixel mt-1 block whitespace-nowrap min-h-[1.1em] text-left uppercase tracking-[0.04em] text-foreground transition-all duration-300",
                  isEnLongText && "text-[0.55em]"
                )}
              />
            </h1>
            <p className="font-pixel mb-4 mt-2 max-w-xl text-sm leading-relaxed tracking-wide text-muted-foreground sm:text-base">
              {t("shortIntro")}
            </p>
            <div className="relative mt-5 min-h-[280px] sm:min-h-[360px] lg:hidden">
              <div className="relative z-10 w-[90%] sm:w-[88%] max-w-[500px] min-w-0 pt-6">
                <CodeBlocker
                  code={code}
                  colorMode={colorMode}
                  compact
                  className="hero-codeblock-mobile h-full"
                />
              </div>
              <div
                data-mobile-hero-avatar
                className="absolute -right-2 -top-4 z-20 h-[400px] w-[62%] max-w-[300px] sm:h-[460px] sm:w-[60%] sm:max-w-[340px] sm:-right-6 sm:-top-12 overflow-visible"
              >
                <Image
                  src={selfie}
                  alt={t("imageAlt")}
                  fill
                  sizes="50vw"
                  className="object-contain object-bottom"
                  priority
                />
              </div>
            </div>
            <div className="hidden w-full max-w-[520px] min-w-0 lg:block mt-6 lg:mt-6">
              <CodeBlocker code={code} colorMode={colorMode} />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative z-0 hidden lg:col-start-7 lg:col-end-12 lg:flex lg:items-center lg:justify-end"
        >
          <div className="relative w-full max-w-[272px] lg:max-w-[380px]">
            <Image
              src={selfie}
              alt={t("imageAlt")}
              width={350}
              height={300}
              className="ml-auto h-auto w-full pixelated"
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
