import React from "react"
import { xTheme } from "../service/ThemeService"

interface UnrelatedTextDisplayProps {
  text: string
}

const UnrelatedTextDisplay: React.FC<UnrelatedTextDisplayProps> = ({
  text,
}) => {
  return (
    <div
      className="mt-4 w-full rounded-md border p-3"
      style={{
        backgroundColor: "color-mix(in srgb, var(--card-background-color) 72%, transparent)",
        overflow: "auto",
        ...xTheme.chatbotText,
        ...xTheme.innerCellBorder,
      }}
    >
      {text}
    </div>
  )
}

export default UnrelatedTextDisplay
