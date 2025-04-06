import React from "react"
import { ClientComponent } from "shiki-components"
import { colorMode } from "../context/DarkModeContext"

interface Props {
  colorMode: colorMode
  code: string
  onMouseEnter?: () => void
}

const CodeBlocker = ({ colorMode, code, onMouseEnter }: Props) => {
  return (
    <div
      id="xxxx"
      className="overflow-auto rounded-2xl"
      onMouseEnter={onMouseEnter}
      style={{
        maxWidth: "390px",
      }}
    >
      <ClientComponent lang="ts" colorMode={colorMode}>
        {code}
      </ClientComponent>
    </div>
  )
}

export default CodeBlocker
