import { useEffect, useRef, useState } from "react"

const useIsOnScreen = () => {
  const [isOnScreen, setIsOnScreen] = useState(false)

  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsOnScreen(entry.isIntersecting)
    })

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return [isOnScreen, elementRef]
}

export default useIsOnScreen
