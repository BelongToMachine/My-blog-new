import React from "react"
import { cn } from "@/lib/utils"
import { ClientComponent } from "./ClientComponent"

interface Props {
  colorMode: string
  code: string
  className?: string
  compact?: boolean
}

export const CodeBlocker = ({
  colorMode,
  code,
  className,
  compact = false,
}: Props) => {
  const taskbarBackground =
    colorMode === "dark" ? "#2d2d2d" : "#f0f0f0"

  return (
    <div className={cn("overflow-auto rounded-2xl", className)}>
      <div
        className={cn(
          "codeblock-taskbar flex items-center py-2",
          compact ? "h-10 px-3.5" : "h-11 px-4 sm:px-3"
        )}
        style={{ background: taskbarBackground }}
      >
        <span
          className="mr-2 h-3 w-3 rounded-full"
          style={{ background: "#ff5f57" }}
        />
        <span
          className="mr-2 h-3 w-3 rounded-full"
          style={{ background: "#ffbd2e" }}
        />
        <span className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
      </div>
      <ClientComponent lang="ts" colorMode={colorMode}>
        {code}
      </ClientComponent>
    </div>
  )
}
