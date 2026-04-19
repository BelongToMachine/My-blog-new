/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useParams } from "next/navigation"
import NextLink from "next/link"
import React, { useEffect, useMemo, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"
import DisappearingText from "../DisappearText"
import { Link, usePathname } from "@/app/i18n/navigation"
import { useLocale, useTranslations } from "next-intl"
import LanguageToggle from "./LanguageToggle"
import ThemeToggle from "./ThemeToggle"
import StyleToggle from "./StyleToggle"
import { PiGithubLogoFill } from "react-icons/pi"
import { useStyleModeStore } from "@/app/service/Store"
import { ActionIconButton } from "../system/ActionIconButton"
import { cn } from "@/lib/utils"
import { NavItem } from "../system/NavItem"

const PixelGithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 24 24"
    shapeRendering="crispEdges"
    className={cn("h-6 w-6", className)}
    fill="currentColor"
  >
    <path d="M23 7V5h-1V4h-1V3h-1V2h-1V1h-2V0H7v1H5v1H4v1H3v1H2v1H1v2H0v11h1v2h1v1h1v1h1v1h2v1h4v-3H7v-1h3v-3H8v-1H6v-2H5v-4h1V6h2v1h3V6h2v1h3V6h2v4h1v4h-1v2h-2v1h-2v7h4v-1h2v-1h1v-1h1v-1h1v-2h1V7z" />
  </svg>
)

interface Link {
  label: string
  href: string
}

const DesktopNav = () => {
  const { styleMode } = useStyleModeStore()
  const isPixel = styleMode === "pixel"

  return (
    <div className="flex h-16 items-center justify-between px-5">
      <div className="flex items-center gap-6">
        <ActionIconButton
          asChild
          aria-label="Open GitHub profile"
          tone={isPixel ? "borderless" : "quiet"}
        >
          <NextLink href="http://github.com/JieLuis">
            {isPixel ? <PixelGithubIcon /> : <PiGithubLogoFill size={20} />}
          </NextLink>
        </ActionIconButton>
        <NavLinks />
      </div>
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
        <StyleToggle />
      </div>
    </div>
  )
}
export default DesktopNav

const NavLinks = () => {
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
      cn(
        "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        link.href === currentPath && "text-foreground",
        isArrowExist && "arrowCollapsible"
      )
  }, [currentPath])

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
    <ul className="relative top-1 flex flex-wrap gap-4">
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
                <NavItem asChild active={link.href === currentPath} variant="desktop">
                  <Link className={styledTag(link)} href={link.href}>
                    <DisappearingText
                      text={link.label}
                      variant={variants}
                      isCollapse={isCollapse}
                    />
                  </Link>
                </NavItem>
              </li>
            </React.Fragment>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}
