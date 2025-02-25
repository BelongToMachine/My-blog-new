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

type IdRef = string | null | undefined

const getVarint = (prevIdRef: IdRef, index: number, text: string) => {
  let variant = {}

  if (!prevIdRef) {
    variant = {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { duration: 0.5, delay: index * 0.05 },
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.5,
          delay: (text.length - index - 1) * 0.05,
        },
      },
    }
  }

  return {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 5, delay: index * 0.05 },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 5,
        delay: (text.length - index - 1) * 0.05,
      },
    },
  }
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
  const prevIdRef = useRef<IdRef>(null)
  const prevIdRef2 = useRef<IdRef>(null)

  useEffect(() => {
    console.log("Previous ID:", prevIdRef.current)
    console.log("Current ID:", id)

    // If `prevIdRef.current` exists (i.e., previous ID is available)
    if (prevIdRef.current) {
      console.log("There was a previous ID:", prevIdRef.current)
    }

    prevIdRef2.current = prevIdRef.current

    // Update `prevIdRef` for next render
    prevIdRef.current = id

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
      setMetaTitle("")
    }
  }

  const StyledLi = useMemo(() => {
    return (link: Link) =>
      classNames({
        "nav-link": true,
        "!text-zinc-950": link.href === currentPath,
      })
  }, [currentPath])

  return (
    <ul className="flex space-x-6">
      {links.map((link, index) => {
        const variant = getVarint(prevIdRef2.current, index, link.label)

        return (
          <AnimatePresence key={index}>
            {index === 1 && metaTitle && (
              <motion.li
                key={`arrow-${index}`}
                variants={variant}
                className={StyledLi(link)}
                onClick={handleArrowButtonClick}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover={{
                  scale: 1.3,
                }}
              >
                {" "}
                &gt;{" "}
              </motion.li>
            )}
            <li key={link.href}>
              <Link className={StyledLi(link)} href={link.href}>
                <DisappearingText
                  text={link.label}
                  variant={variant}
                  key={`disappearing-text-${index}-${link.href}`}
                />
              </Link>
            </li>
          </AnimatePresence>
        )
      })}
    </ul>
  )
}
