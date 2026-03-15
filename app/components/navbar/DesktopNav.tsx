/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import classNames from "classnames"
import { useParams } from "next/navigation"
import NextLink from "next/link"
import React, { useEffect, useMemo, useState } from "react"
import { PiGithubLogoFill } from "react-icons/pi"
import axios from "axios"
import toast from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"
import DisappearingText from "../DisappearText"
import { colorMode } from "@/app/context/DarkModeContext"
import { xTheme } from "@/app/service/ThemeService"
import { useTheme } from "@/app/hooks/useTheme"
import { Link, usePathname } from "@/app/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"

interface Link {
  label: string
  href: string
}

const DesktopNav = () => {
  const { colorMode } = useTheme()

  return (
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-6">
        <NextLink
          href="http://github.com/JieLuis"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70 text-[color:var(--text-color)] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <PiGithubLogoFill style={xTheme.iconColor} />
        </NextLink>
        <NavLinks colorMode={colorMode} />
      </div>
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  )
}
export default DesktopNav

const NavLinks = ({ colorMode }: { colorMode: colorMode }) => {
  const t = useTranslations("nav")
  const locale = useLocale()
  const currentPath = usePathname()
  const { id }: { id?: string | null } = useParams()
  const [metaTitle, setMetaTitle] = useState<string>("")
  const [isCollapse, setIsCollapse] = useState<boolean>(false)

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        if (id) {
          const res = await axios.get(`/api/blogs/${parseInt(id)}?locale=${locale}`)
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
      { label: t("blogs"), href: "/blogs" },
      { label: t("aboutMe"), href: "/" },
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
  }, [metaTitle, t, id])

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
            duration: 0.15,
            delay: (custom.textLength - custom.index - 1) * 0.05,
          },
        }
      }

      return {}
    },
  }

  return (
    <ul className="relative top-1 flex space-x-6">
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
              <motion.li
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link className={styledTag(link)} href={link.href}>
                  <DisappearingText
                    text={link.label}
                    variant={variants}
                    isCollapse={isCollapse}
                  />
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-x-3 bottom-1 h-px origin-left bg-current"
                    initial={{ scaleX: 0, opacity: 0.45 }}
                    whileHover={{ scaleX: 1, opacity: 0.9 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  />
                </Link>
              </motion.li>
            </React.Fragment>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}
