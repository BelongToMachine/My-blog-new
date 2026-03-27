import React from "react"
import { CodeBlocker } from "../packages/Screen"
import UnrelatedTextDisplay from "./UnrelatedTextDisplay"
import { useTheme } from "../hooks/useTheme"

interface StringStore {
  content: string
  isCode: boolean
}

const parseTextIntoComponents = (input: string): StringStore[] => {
  const store: StringStore[] = []
  const sanitizedInput = input
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/^\s*<\/?think>\s*$/gim, "")
    .trim()
  const regex = /```(?:\w*\n)?([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(sanitizedInput)) !== null) {
    const index = match.index

    // Push the text before this code block (if any)
    if (index > lastIndex) {
      const textChunk = sanitizedInput.slice(lastIndex, index)
      store.push({
        content: textChunk.trim(),
        isCode: false,
      })
    }

    // Push the code block
    const codeChunk = match[1]
    store.push({
      content: codeChunk.trim(),
      isCode: true,
    })

    lastIndex = regex.lastIndex
  }

  // Push the remaining text after the last code block
  if (lastIndex < sanitizedInput.length) {
    const remainingText = sanitizedInput.slice(lastIndex)
    store.push({
      content: remainingText.trim(),
      isCode: false,
    })
  }

  return store
}

const ChatBot = ({ input }: { input: string }) => {
  const { colorMode } = useTheme()
  let key = 0
  const store = parseTextIntoComponents(input)
  const context = store.map((obj) => {
    if (obj.isCode) {
      return (
        <CodeBlocker
          key={`code-${key++}`}
          code={obj.content}
          colorMode={colorMode}
        />
      )
    } else {
      return <UnrelatedTextDisplay key={`text-${key++}`} text={obj.content} />
    }
  })

  return <div className="p-4">{context}</div>
}

export default ChatBot
