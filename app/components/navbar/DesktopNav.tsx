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
import { useTheme } from "@/app/hooks/useTheme"
import { Link, usePathname } from "@/app/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import { ActionIconButton } from "../system/ActionIconButton"

interface Link {
  label: string
  href: string
}

const DesktopNav = () => {
  const { colorMode } = useTheme()

  return (
    <div className="flex h-14 items-center justify-between px-5">
      <div className="flex items-center gap-6">
        <ActionIconButton asChild aria-label="Open GitHub profile" tone="quiet">
          <NextLink href="http://github.com/JieLuis">
            <PiGithubLogoFill size={20} />
          </NextLink>
        </ActionIconButton>
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
  const isBlogDetailPage = Boolean(
    id && /^\/blogs\/\d+$/.test(currentPath)
  )

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        if (isBlogDetailPage && id) {
          const res = await axios.get(`/api/blogs/${parseInt(id)}?locale=${locale}`)
          setMetaTitle(res.data.title)
        } else {
          setMetaTitle("")
        }
      } catch (error) {
        toast.error(`Error fetching MetaTitle`)
      }
    }

    fetchTitle()
  }, [id, isBlogDetailPage, locale])

  const links = useMemo(() => {
    const baseLinks = [
      { label: t("ai"), href: "/ai" },
      { label: t("blogs"), href: "/blogs" },
      { label: t("aboutMe"), href: "/" },
    ]

    if (isBlogDetailPage && metaTitle) {
      baseLinks.splice(2, 0, {
        label: metaTitle,
        href: `/blogs/${parseInt(id as string)}`,
      })
    }

    return baseLinks
  }, [isBlogDetailPage, metaTitle, t, id])

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
          const isArrowExist = Boolean(index === 2 && isBlogDetailPage && metaTitle)
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
