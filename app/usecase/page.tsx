"use client"

import React, { useState } from "react"
import ChatBot from "../components/Chatbot"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"

const ImageUploadPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert("Please select a file")
      return
    }

    const formData = new FormData()
    formData.append("file", file) // 👈 Use "file" not "image"
    formData.append("prompt", prompt)

    setIsLoading(true)
    try {
      const res = await fetch("/api/usecase", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      setResponse(
        typeof data === "string" ? data : JSON.stringify(data, null, 2)
      )
    } catch (error) {
      console.error("Error uploading file:", error)
      setResponse("Error uploading file")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Upload Image + Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          {!isAuthenticated ? (
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secret password"
              />
              <Button
                onClick={() => {
                  if (password === process.env.NEXT_PUBLIC_DEV_SECRET_TOKEN) {
                    setIsAuthenticated(true)
                  } else {
                    alert("Invalid password")
                  }
                }}
              >
                Authenticate
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              <Input
                type="text"
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Enter your prompt"
              />
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Submit"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <div className="mt-8">
        <ChatBot input={response} />
      </div>
    </div>
  )
}

export default ImageUploadPage
