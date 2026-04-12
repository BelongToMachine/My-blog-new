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
    <div id="about-me-section" className="px-5 sm:px-12 md:px-16 pb-10 pt-5 lg:px-0 lg:pb-4 lg:pt-0">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex w-full justify-center items-start lg:justify-start lg:col-start-2 lg:col-end-7"
        >
          <div className="w-full max-w-[800px] lg:max-w-[560px] min-w-0">
            <h1 className="mb-3 min-h-[5rem] -translate-x-1 text-left text-[3rem] font-extrabold leading-[0.95] text-yellow-500 md:min-h-[7rem] md:translate-x-0 md:text-left md:text-5xl lg:min-h-[8rem] lg:text-6xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600 flicker">
                {`${t("greeting")} `}
              </span>
              <TypeAnimation
                sequence={typeSequence.flatMap((value) => [value, 1500])}
                wrapper="div"
                speed={50}
                repeat={Infinity}
                className="mt-2 block min-h-[1.1em] whitespace-nowrap text-left md:text-left" /** Keeps the hero width stable while text changes */
              />
            </h1>
            <div className="relative mt-3 min-h-[356px] sm:min-h-[440px] lg:hidden">
              <div className="relative z-10 w-[90%] sm:w-[88%] max-w-[500px] min-w-0 pt-10">
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
            <div className="hidden w-full max-w-[520px] min-w-0 lg:block">
              <CodeBlocker code={code} colorMode={colorMode} />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-0 hidden justify-center pt-2 lg:col-start-7 lg:col-end-12 lg:flex lg:justify-end lg:pt-0"
        >
          <div className="relative w-full max-w-[272px] lg:max-w-[380px] lg:-translate-y-8">
            <Image
              src={selfie}
              alt={t("imageAlt")}
              width={350}
              height={300}
              className="ml-auto h-auto w-full"
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
