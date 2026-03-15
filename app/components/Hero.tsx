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
    <div id="about-me-section" className="pb-4">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-start sm:col-start-2 sm:col-end-7 sm:top-[3rem]"
        >
          <div>
            <h1 className="mb-4 text-4xl font-extrabold text-foreground sm:text-5xl lg:text-6xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600 flicker">
                {`${t("greeting")} `}
              </span>
              <TypeAnimation
                sequence={typeSequence.flatMap((value) => [value, 1500])}
                wrapper="div"
                speed={50}
                repeat={Infinity}
                className="mt-3" /** To offset image top space */
              />
            </h1>
            <div className="w-full max-w-[500px]">
              <CodeBlocker code={code} colorMode={colorMode} />
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="sm:col-start-8"
        >
          <div className="relative mx-auto w-full max-w-[500px] sm:bottom-[2rem]">
            <Image
              src={selfie}
              alt={t("imageAlt")}
              width={350}
              height={300}
              className="h-auto w-full max-w-[350px]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
