"use client"
import React, { useCallback, useEffect, useState } from "react"
import DesktopNav from "./components/navbar/DesktopNav"
import MobileNav from "./components/navbar/MobileNav"
import { useScrollableStore } from "./service/Store"

const NavBar = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const isInScrollable = useScrollableStore((state) => state.isInScrollable)

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

  if (windowWidth === 0) {
    return null
  }

  const backgroundColor = isInScrollable
    ? "var(--scrollable-background-color)"
    : "color-mix(in srgb, var(--background-color) 88%, transparent)"

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor,
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid color-mix(in srgb, var(--border-color) 72%, transparent)",
      }}
    >
      {windowWidth > 768 ? <DesktopNav /> : <MobileNav />}
    </nav>
  )
}

export default NavBar
