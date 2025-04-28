"use client"
import React, { useEffect, useState } from "react"
import ChatBot from "../../components/Chatbot"
import { xTheme } from "../../service/ThemeService"
import { Dialog } from "@prisma/client"

const DialogRecord = () => {
  const [dialogs, setDialogs] = useState<Dialog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    async function fetchDialogs() {
      try {
        const response = await fetch(`/api/examples?page=1`)
        const data = await response.json()
        setDialogs(data)
      } catch (error) {
        console.error("Failed to fetch dialogs", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDialogs()
  }, [])

  return (
    <>
      <div
        className="p-6"
        style={{ ...xTheme.chatbotBackground, minHeight: "100vh" }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Dialogs</h1>
            <p className="text-sm text-gray-500">
              This is a list of all the dialogs in the database.
            </p>
            <div className="flex flex-col gap-4">
              {dialogs.map((dialog) => (
                <div
                  key={dialog.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    (window.location.href = `/examples/examples/${dialog.id}`)
                  }
                >
                  <p className="text-sm">
                    {dialog.content.substring(0, 100)}
                    {dialog.content.length > 30 ? "..." : ""}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">ID: {dialog.id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DialogRecord
