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
    <div id="about-me-section" className="pb-4 pt-0">
      <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-12 sm:gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-start sm:col-start-2 sm:col-end-7"
        >
          <div className="w-full max-w-[560px] min-w-0">
            <h1 className="mb-2 min-h-[5.75rem] text-4xl font-extrabold text-yellow-500 sm:min-h-[7rem] sm:text-5xl lg:min-h-[8rem] lg:text-6xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600 flicker">
                {`${t("greeting")} `}
              </span>
              <TypeAnimation
                sequence={typeSequence.flatMap((value) => [value, 1500])}
                wrapper="div"
                speed={50}
                repeat={Infinity}
                className="mt-2 block min-h-[1.1em] whitespace-nowrap" /** Keeps the hero width stable while text changes */
              />
            </h1>
            <div className="w-full max-w-[520px] min-w-0">
              <CodeBlocker code={code} colorMode={colorMode} />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center sm:col-start-8 sm:col-end-12 sm:justify-end"
        >
          <div className="relative w-full max-w-[380px] sm:-translate-y-8">
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
