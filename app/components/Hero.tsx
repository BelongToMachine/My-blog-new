"use client"
import React, { useContext, useEffect, useState } from "react"
import selfie from "@/public/images/me2.png" // Update the image import
import Image from "next/image"
import { TypeAnimation } from "react-type-animation"
import { motion } from "framer-motion"
import { ServerComponent, ClientComponent } from "shiki-components"
import { useStore } from "zustand"
import { ThemeContext } from "../context/DarkModeContext"
import CodeBlocker from "./CodeBlocker"
import classNames from "classnames"

const Hero = () => {
  const themeContext = useContext(ThemeContext)
  const [isHovered, setIsHovered] = useState(false)
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
          className="col-span-7 col-start-1 flex items-center justify-start relative sm:left-40"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-yellow-500">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
              {`Heya I'm `}
            </span>
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Jie",
                1500, // wait 1s before replacing "Mice" with "Hamsters"
                "a web developer",
                1500,
                "廖永杰",
                1500,
              ]}
              wrapper="div"
              speed={50}
              repeat={Infinity}
            />
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-5 place-self-center mt-4 lg:mt-0"
        >
          <div
            style={{
              height: "500px",
              width: "500px",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={selfie}
              alt="Jie is standing firm"
              width={300}
              height={300}
              className={classNames({
                hidden: isHovered,
              })}
            />
            {isHovered && <CodeBlocker code={code} colorMode={colorMode} />}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Hero
