"use client"
import React, { useState } from "react"
import { CodeBlocker } from "../packages/Screen"
import { useTheme } from "@/app/hooks/useTheme"

const Examples = () => {
  const { colorMode } = useTheme()
  const [inputCode, setInputCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [unrelatedText, setUnrelatedText] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/example", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: inputCode }),
      })

      if (response.ok) {
        const data = await response.json()
        const responseText = data

        // Extract code block
        const codeMatch = responseText.match(/```[\s\S]*?```/)
        const code = codeMatch
          ? codeMatch[0].replace(/```[\s\S]*?\n/, "").replace(/\n```/, "")
          : ""

        // Extract unrelated text
        const text = responseText.replace(/```[\s\S]*?```/, "")

        setGeneratedCode(code)
        setUnrelatedText(text)
      } else {
        console.error("Failed to fetch code")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        {isLoading ? (
          <div className="flex-1 p-2 border rounded-md dark:border-gray-700 h-36 flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <textarea
            placeholder="..."
            className="flex-1 p-2 border rounded-md dark:border-gray-700 h-36 overflow-y-auto resize-none whitespace-pre-wrap"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
        )}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleSubmit}
        >
          X
        </button>
      </div>
      {unrelatedText && (
        <textarea
          className="w-full p-2 mt-4 border rounded-md dark:border-gray-700"
          rows={4}
          value={unrelatedText}
          readOnly
        />
      )}
      <CodeBlocker code={generatedCode} colorMode={colorMode} />
    </div>
  )
}

export default Examples
