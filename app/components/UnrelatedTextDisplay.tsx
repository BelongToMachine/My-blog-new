import React from "react"

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
      className="mt-4 w-full overflow-auto rounded-2xl border border-border/70 bg-[color:color-mix(in_srgb,var(--card-background-color)_72%,transparent)] p-4 text-foreground"
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
