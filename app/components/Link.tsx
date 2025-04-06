import React from "react"
import NextLink from "next/link"
import { Link as RadixLink } from "@radix-ui/themes"
import style, { xTheme } from "../service/ThemeService"
import { CSSProperties } from "styled-components"

interface Props {
  href: string
  children: string
  overrideStyle?: CSSProperties
}

const Link = ({ href, children, overrideStyle }: Props) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <RadixLink style={overrideStyle}>{children}</RadixLink>
    </NextLink>
  )
}

export default Link
