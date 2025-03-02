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

  // Don't render anything until windowWidth is measured

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        background: isInScrollable
          ? "rgba(255, 255, 255, 1)"
          : "rgba(255, 255, 255, 0.3)",
        backdropFilter: isInScrollable ? "none" : "blur(10px)",
        transition: "background 0.3s ease-in-out",
      }}
    >
      {windowWidth > 768 ? <DesktopNav /> : <MobileNav />}
    </nav>
  )
}

export default NavBar
