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
      className="w-full p-2 mt-4 border rounded-md dark:border-gray-700"
      style={{
        backgroundColor: "transparent",
        border: "none",
        overflow: "auto",
        resize: "none",
        ...xTheme.chatbotText,
      }}
    >
      {text}
    </div>
  )
}

export default UnrelatedTextDisplay
