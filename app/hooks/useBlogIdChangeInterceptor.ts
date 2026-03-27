"use client"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

const useBlogIdChangeInterceptor = () => {
  const pathname = usePathname()
  const [hasIdChanged, setHasIdChanged] = useState(false)
  const previousIdRef = useRef<string | null>(null)

  useEffect(() => {
    const currentId = pathname.split("/")[2] // Assuming the URL is in the pattern "/blogs/[id]"
    const previousId = previousIdRef.current

    if (previousId !== null && currentId !== previousId) {
      setHasIdChanged(true)
    } else {
      setHasIdChanged(false)
    }

    previousIdRef.current = currentId
  }, [pathname])

  return hasIdChanged
}

export default useBlogIdChangeInterceptor
