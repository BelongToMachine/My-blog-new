import React from "react"
import { ClientComponent } from "./ClientComponent"

interface Props {
  colorMode: string
  code: string
}

export const CodeBlocker = ({ colorMode, code }: Props) => {
  const taskbarBackground =
    colorMode === "dark" ? "#2d2d2d" : "#f0f0f0"

  return (
    <div className="overflow-auto rounded-2xl">
      <div
        className="flex h-10 items-center px-3 py-2"
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
