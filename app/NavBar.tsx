"use client"
import React, { cache, useCallback, useEffect, useState } from "react"
import DesktopNav from "./components/navbar/DesktopNav"
import MobileNav from "./components/navbar/MobileNav"
import { styled } from "@pigment-css/react"
import prisma from "@/prisma/client"
import { useParams, usePathname } from "next/navigation"

const StyledNav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid;
  backdrop-filter: blur(10px);
`

const NavBar = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0)

  const updateWindowValue = useCallback(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    window.addEventListener("resize", updateWindowValue)

    return () => {
      window.removeEventListener("resize", updateWindowValue)
    }
  }, [updateWindowValue])

  return (
    <StyledNav>{windowWidth > 768 ? <DesktopNav /> : <MobileNav />}</StyledNav>
  )
}

export default NavBar
