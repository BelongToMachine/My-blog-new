"use client"

import React from "react"

import { cn } from "@/lib/utils"

import DesktopNav from "./components/navbar/DesktopNav"
import MobileNav from "./components/navbar/MobileNav"
import { useScrollableStore } from "./service/Store"

const NavBar = () => {
  const isInScrollable = useScrollableStore((state) => state.isInScrollable)

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-10 border-b border-border/70 backdrop-blur-xl transition-colors",
        isInScrollable ? "bg-card/80" : "bg-background/80"
      )}
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        <div className="hidden md:block">
          <DesktopNav />
        </div>
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </nav>
  )
}

export default NavBar
