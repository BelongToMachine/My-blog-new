import React from "react"
import NextLink from "next/link"
import { Link as RadixLink } from "@radix-ui/themes"
import style from "../service/ThemeService"

interface Props {
  href: string
  children: string
}

const Link = ({ href, children }: Props) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <RadixLink
        style={{
          color: style.link,
        }}
      >
        {children}
      </RadixLink>
    </NextLink>
  )
}

export default Link
