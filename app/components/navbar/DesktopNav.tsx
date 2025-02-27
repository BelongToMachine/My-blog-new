/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { PiGithubLogoFill } from "react-icons/pi"
import { AuthStatus } from "./AuthStatus"
import axios from "axios"
import toast from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"
import DisappearingText from "../DisappearText"

interface Link {
  label: string
  href: string
}

const DesktopNav = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-6 py-6 px-5 h-14 items-center">
        <Link href="http://github.com/JieLuis">
          <PiGithubLogoFill />
        </Link>
        <NavLinks />
      </div>
      <AuthStatus />
    </div>
  )
}
export default DesktopNav

const NavLinks = () => {
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

  const StyledLi = useMemo(() => {
    return (link: Link) =>
      classNames({
        "nav-link": true,
        "!text-zinc-950": link.href === currentPath,
      })
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
            duration: 0.5,
            delay: (custom.textLength - custom.index - 1) * 0.05,
          },
        }
      }

      return {}
    },
  }

  return (
    <ul className="flex space-x-6">
      <AnimatePresence>
        {links.map((link, index) => {
          return (
            <React.Fragment key={link.href}>
              {index === 1 && metaTitle && (
                <motion.span
                  variants={variants}
                  className={StyledLi(link)}
                  onClick={handleArrowButtonClick}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover={{
                    scale: 1.3,
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
                <Link className={StyledLi(link)} href={link.href}>
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
