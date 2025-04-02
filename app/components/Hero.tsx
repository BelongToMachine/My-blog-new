"use client"
import React, { useContext, useEffect, useState } from "react"
import selfie from "@/public/images/me2.png" // Update the image import
import Image from "next/image"
import { TypeAnimation } from "react-type-animation"
import { motion } from "framer-motion"
import { ThemeContext } from "../context/DarkModeContext"
import { CodeBlocker } from "shiki-test"

const Hero = () => {
  const themeContext = useContext(ThemeContext)
  let timeoutId: NodeJS.Timeout | null = null

  if (!themeContext) {
    throw new Error("ThemeToggle must be used within a ThemeProvider")
  }

  const { colorMode } = themeContext

  const code = `
    const coder = {
      name: "Jie",
      role: ["Front-end developer"]
      skill: ["React", "Next.js"]
      location: "Hangzhou, China",
      problemSolver: true,
      welcomeMessage: () => {
        return "Happy to meet you!"
      }
    }
  `
  return (
    <div id="about-me-section" className="pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="sm:col-start-2 sm:col-end-7 flex items-start relative"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-yellow-500">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
                {`Heya I'm `}
              </span>
              <TypeAnimation
                sequence={[
                  "Jie",
                  1500,
                  "a web developer",
                  1500,
                  "廖永杰",
                  1500,
                ]}
                wrapper="div"
                speed={50}
                repeat={Infinity}
                className="mt-3" /** To offset image top space */
              />
            </h1>
            <div className="w-[370px] md:w-[440px] lg:w-[500px]">
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
          <div className="w-[500px] relative bottom-[60px]">
            <Image
              src={selfie}
              alt="Jie is standing firm"
              width={350}
              height={300}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
