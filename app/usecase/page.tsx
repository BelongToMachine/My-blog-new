"use client"

import React, { useState } from "react"
import ChatBot from "../components/Chatbot"

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
    <div style={{ padding: "2rem" }}>
      <h1>Upload Image + Prompt</h1>
      {!isAuthenticated ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: "400px",
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter secret password"
            style={{ padding: "0.5rem" }}
          />
          <button
            onClick={() => {
              if (password === process.env.NEXT_PUBLIC_DEV_SECRET_TOKEN) {
                setIsAuthenticated(true)
              } else {
                alert("Invalid password")
              }
            }}
            style={{ padding: "0.5rem" }}
          >
            Authenticate
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: "400px",
          }}
        >
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <input
            type="text"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Enter your prompt"
            style={{ padding: "0.5rem" }}
          />
          <button
            type="submit"
            style={{ padding: "0.5rem" }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      )}
      <ChatBot input={response} />
    </div>
  )
}

export default ImageUploadPage
