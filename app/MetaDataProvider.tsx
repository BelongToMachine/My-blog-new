"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { fetchUser } from "@/lib/api"

const MetadataContext = createContext(null)

export const MetadataProvider = ({
  children,
  issueId,
}: {
  children: React.ReactNode
  issueId: number
}) => {
  const [title, setTitle] = useState<string | null>(null)

  useEffect(() => {
    fetchUser(issueId).then((data) => setTitle(data?.title))
  }, [issueId])

  return (
    <MetadataContext.Provider value={{ title }}>
      {children}
    </MetadataContext.Provider>
  )
}

export const useMetadata = () => useContext(MetadataContext)
