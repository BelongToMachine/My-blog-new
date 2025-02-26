"use client"
import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const useBlogIdChangeInterceptor = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [hasIdChanged, setHasIdChanged] = useState(false)
  const [previousId, setPreviousId] = useState<string | null>(null)

  useEffect(() => {
    // Extract current ID from pathname
    const currentId = pathname.split("/")[2] // Assuming the URL is in the pattern "/blogs/[id]"

    // Check if the 'id' has changed
    if (previousId !== null && currentId !== previousId) {
      setHasIdChanged(true)
    } else {
      setHasIdChanged(false)
    }

    // Update previous ID
    setPreviousId(currentId)
  }, [pathname])

  return hasIdChanged
}

export default useBlogIdChangeInterceptor
