"use client"
import React from "react"
import { cn } from "@/lib/utils"
import { ClientComponent } from "./ClientComponent"

interface Props {
  colorMode: string
  code: string
  className?: string
  compact?: boolean
  filename?: string
}

export const CodeBlocker = ({
  colorMode,
  code,
  className,
  compact = false,
  filename = "coder.ts",
}: Props) => {
  const isDark = colorMode === "dark"
  const taskbarBg = isDark ? "#2d2d2d" : "#f0f0f0"
  const bodyBg = isDark ? "hsl(265 55% 8%)" : "hsl(215 30% 10%)"

  return (
    <div className={cn("overflow-hidden border-2 border-border", className)}>
      {/* Taskbar */}
      <div
        className={cn(
          "flex items-center border-b-2 border-border",
          compact ? "h-9 px-3" : "h-11 px-4"
        )}
        style={{ background: taskbarBg }}
      >
        <div className="flex items-center gap-1.5">
          <span className="block h-3 w-3" style={{ background: "#ff5f57" }} />
          <span className="block h-3 w-3" style={{ background: "#ffbd2e" }} />
          <span className="block h-3 w-3" style={{ background: "#28c840" }} />
        </div>
      </div>

      {/* Code body */}
      <div style={{ background: bodyBg }}>
        <ClientComponent lang="ts" colorMode={colorMode}>
          {code}
        </ClientComponent>
      </div>
    </div>
  )
}
