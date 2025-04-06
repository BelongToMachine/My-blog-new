/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { PiGithubLogoFill } from "react-icons/pi"
import axios from "axios"
import toast from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"
import DisappearingText from "../DisappearText"
import { LuSearch } from "react-icons/lu"
import { PiSunDim } from "react-icons/pi"
import { GoMoon } from "react-icons/go"
import { colorMode, ThemeContext } from "@/app/context/DarkModeContext"

interface Link {
  label: string
  href: string
}

const DesktopNav = () => {
  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    throw new Error("ThemeToggle must be used within a ThemeProvider")
  }

  const { colorMode, setColorMode } = themeContext

  const handleSunClick = () => {
    setColorMode(colorMode === "light" ? "dark" : "light")
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-6 py-6 px-5 h-14 items-center">
        <Link href="http://github.com/JieLuis">
          <PiGithubLogoFill
            style={{
              color: "var(--text-color)",
            }}
          />
        </Link>
        <NavLinks colorMode={colorMode} />
      </div>
      <div className="flex space-x-6 items-center pr-6">
        {/* <LuSearch
          size={26}
          style={{
            color: "var(--text-color)",
          }}
        /> */}
        {colorMode === "light" ? (
          <PiSunDim
            size={32}
            onClick={handleSunClick}
            style={{
              color: "var(--text-color)",
            }}
          />
        ) : (
          <GoMoon
            size={26}
            onClick={handleSunClick}
            style={{
              color: "var(--text-color)",
            }}
          />
        )}
      </div>
    </div>
  )
}
export default DesktopNav

const NavLinks = ({ colorMode }: { colorMode: colorMode }) => {
  const currentPath = usePathname()
  const { id }: { id?: string | null } = useParams()
  const [metaTitle, setMetaTitle] = useState<string>("")
  const [isCollapse, setIsCollapse] = useState<boolean>(false)

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        if (id) {
          const res = await axios.get(`/api/blogs/${parseInt(id)}`)
          setMetaTitle(res.data.title)
        }
      } catch (error) {
        toast.error(`Error fetching MetaTitle`)
      }
    }

    fetchTitle()
  }, [id])

  const links = useMemo(() => {
    const baseLinks = [
      { label: "文章", href: "/blogs" },
      { label: "关于我", href: "/" },
    ]

    if (metaTitle) {
      const insertIndex = 1
      const metaLabel = {
        label: metaTitle,
        href: `/blogs/${parseInt(id as string)}`,
      }
      baseLinks.splice(insertIndex, 0, metaLabel)
      return baseLinks
    }

    return baseLinks
  }, [metaTitle])

  const handleArrowButtonClick = () => {
    if (!id) {
      setIsCollapse(true)
    }
  }

  const styledTag = useMemo(() => {
    return (link: Link, isArrowExist: boolean = false) =>
      // prettier-ignore
      classNames({
        "nav-link": true,
        "nav-link-dark": colorMode === "dark",
        "!text-zinc-950": link.href === currentPath && colorMode === "light",
        "!text-white": link.href === currentPath && colorMode === "dark",
        "arrowCollapsible": isArrowExist,
      })
  }, [currentPath, colorMode])

  const variants = {
    initial: { opacity: 0 },
    animate: (custom: { index: number }) => ({
      opacity: 1,
      transition: { duration: 0.5, delay: custom.index * 0.05 },
    }),
    exit: (custom: {
      index: number
      textLength: number
      isCollapse: boolean
    }) => {
      if (custom.isCollapse) {
        return {
          opacity: 0,
          transition: {
            duration: 0.5,
            delay: (custom.textLength - custom.index - 1) * 0.05,
          },
        }
      }

      return {}
    },
  }

  return (
    <ul className="flex space-x-6 relative top-1">
      <AnimatePresence>
        {links.map((link, index) => {
          const isArrowExist = Boolean(index === 1 && metaTitle)
          return (
            <React.Fragment key={link.href}>
              {isArrowExist && (
                <motion.span
                  variants={variants}
                  className={styledTag(link, isArrowExist)}
                  onClick={handleArrowButtonClick}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover={{
                    scale: 1.5,
                  }}
                  custom={{ index, textLength: link.label.length, isCollapse }}
                  onAnimationComplete={() => {
                    if (isCollapse) {
                      setMetaTitle("")
                      setIsCollapse(false)
                    }
                  }}
                >
                  {" "}
                  &gt;{" "}
                </motion.span>
              )}
              <li>
                <Link className={styledTag(link)} href={link.href}>
                  <DisappearingText
                    text={link.label}
                    variant={variants}
                    isCollapse={isCollapse}
                  />
                </Link>
              </li>
            </React.Fragment>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}
