import React from "react"
import { xTheme } from "../service/ThemeService"

interface UnrelatedTextDisplayProps {
  text: string
}

const UnrelatedTextDisplay: React.FC<UnrelatedTextDisplayProps> = ({
  text,
}) => {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <div
      className="mt-4 w-full rounded-2xl border p-4"
      style={{
        backgroundColor: "color-mix(in srgb, var(--card-background-color) 72%, transparent)",
        overflow: "auto",
        ...xTheme.chatbotText,
        ...xTheme.innerCellBorder,
      }}
    >
      <div className="space-y-4 text-sm leading-7">
        {blocks.map((block, index) => {
          const lines = block
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
          const isList = lines.every((line) => /^[-*]\s+/.test(line))

          if (isList) {
            return (
              <ul key={index} className="space-y-2 pl-5">
                {lines.map((line, lineIndex) => (
                  <li key={lineIndex}>{line.replace(/^[-*]\s+/, "")}</li>
                ))}
              </ul>
            )
          }

          return (
            <p key={index} className="whitespace-pre-wrap text-foreground/90">
              {block}
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default UnrelatedTextDisplay
