import React from "react"
import NextLink from "next/link"
import { Link as RadixLink } from "@radix-ui/themes"
import { PostCssProperties } from "../PostSummary"

interface Props {
  href: string
  children: string
  style?: PostCssProperties
}

const Link = ({ href, children, style }: Props) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <RadixLink
        style={{
          color: style?.link,
        }}
      >
        {children}
      </RadixLink>
    </NextLink>
  )
}

export default Link
