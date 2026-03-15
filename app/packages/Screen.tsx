import React from "react"
import { ClientComponent } from "./ClientComponent"

interface Props {
  colorMode: string
  code: string
}

export const CodeBlocker = ({ colorMode, code }: Props) => {
  const taskbarBackground =
    colorMode === "dark"
      ? "color-mix(in srgb, var(--card-background-color) 88%, black)"
      : "color-mix(in srgb, var(--card-background-color) 92%, var(--background-color))"

  return (
    <div className="overflow-auto rounded-2xl border" style={{ borderColor: "var(--border-color)" }}>
      <div
        className="flex h-10 items-center px-4"
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
