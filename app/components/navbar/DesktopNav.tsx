/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { useEffect, useMemo, useState } from "react"
import axios from "axios"
import NextLink from "next/link"
import { useParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { PiGithubLogoFill } from "react-icons/pi"
import toast from "react-hot-toast"
import { useLocale, useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Link, usePathname } from "@/app/i18n/navigation"

import DisappearingText from "../DisappearText"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"

interface NavLinkItem {
  label: string
  href: string
}

const DesktopNav = () => {
  return (
    <div className="flex h-16 items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <NextLink
          href="https://github.com/JieLuis"
          className="nav-control nav-control-icon"
          aria-label="Open GitHub profile"
          target="_blank"
          rel="noreferrer"
        >
          <PiGithubLogoFill className="h-[18px] w-[18px]" />
        </NextLink>
        <NavLinks />
      </div>
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  )
}

const NavLinks = () => {
  const t = useTranslations("nav")
  const locale = useLocale()
  const currentPath = usePathname()
  const { id }: { id?: string | null } = useParams()
  const [metaTitle, setMetaTitle] = useState("")
  const [isCollapse, setIsCollapse] = useState(false)
  const isBlogDetailPage = Boolean(id && /^\/blogs\/\d+$/.test(currentPath))

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        if (isBlogDetailPage && id) {
          const res = await axios.get(`/api/blogs/${parseInt(id)}?locale=${locale}`)
          setMetaTitle(res.data.title)
          return
        }

        setMetaTitle("")
      } catch {
        toast.error("Error fetching MetaTitle")
      }
    }

    fetchTitle()
  }, [id, isBlogDetailPage, locale])

  const links = useMemo(() => {
    const baseLinks: NavLinkItem[] = [
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
  }, [id, isBlogDetailPage, metaTitle, t])

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
    }) =>
      custom.isCollapse
        ? {
            opacity: 0,
            transition: {
              duration: 0.15,
              delay: (custom.textLength - custom.index - 1) * 0.05,
            },
          }
        : {},
  }

  const linkClassName = (link: NavLinkItem, isArrow = false) =>
    cn(
      "nav-link",
      link.href === currentPath && "text-foreground",
      isArrow && "arrowCollapsible"
    )

  return (
    <ul className="relative top-0.5 flex items-center gap-6">
      <AnimatePresence>
        {links.map((link, index) => {
          const isArrowExist = Boolean(index === 2 && isBlogDetailPage && metaTitle)

          return (
            <React.Fragment key={link.href}>
              {isArrowExist ? (
                <motion.span
                  variants={variants}
                  className={linkClassName(link, true)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover={{ scale: 1.15 }}
                  custom={{
                    index,
                    textLength: link.label.length,
                    isCollapse,
                  }}
                  onClick={() => {
                    setMetaTitle("")
                    setIsCollapse(true)
                  }}
                  onAnimationComplete={() => {
                    if (isCollapse) {
                      setIsCollapse(false)
                    }
                  }}
                >
                  &gt;
                </motion.span>
              ) : null}
              <li>
                <Link className={linkClassName(link)} href={link.href}>
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

export default DesktopNav
