"use client"
import React, { useState } from "react"
import ChatBot from "../components/Chatbot"
import { xTheme } from "../service/ThemeService"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"

const Examples = () => {
  const [inputCode, setInputCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [responseText, setResponseText] = useState("")

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
        setResponseText(data.response || data)
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
    <>
      <div
        className="p-6"
        style={{ ...xTheme.chatbotBackground, minHeight: "100vh" }}
      >
        <div className="flex gap-4 mb-6">
          {isLoading ? (
            <div className="flex-1 p-2 border rounded-md dark:border-gray-700 h-36 flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <Textarea
              placeholder="..."
              className="flex-1 h-36 resize-none"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
          )}
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={handleSubmit}
          >
            X
          </Button>
        </div>
        <ChatBot input={responseText} />
      </div>
    </>
  )
}

export default Examples
