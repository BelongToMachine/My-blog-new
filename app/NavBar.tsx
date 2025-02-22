"use client"
import React, { useCallback, useEffect, useState } from "react"
import DesktopNav from "./components/navbar/DesktopNav"
import MobileNav from "./components/navbar/MobileNav"

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
    <nav className="fixed top-0 left-0 right-0 z-10 bg-opacity-90 bg-gradient-to-t from-white to-transparent border-b">
      {windowWidth > 768 ? <DesktopNav /> : <MobileNav />}
    </nav>
  )
}

export default NavBar
