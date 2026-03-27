import { useEffect } from "react"
import { useScrollableStore } from "../service/Store"

const useIsInScrollable = (scrolledInVH: number, SCROLLABLE_HEIGHT_IN_VH: number) => {
  const setIsInScrollable = useScrollableStore((state) => state.setIsInScrollable)

  useEffect(() => {
    setIsInScrollable(scrolledInVH < SCROLLABLE_HEIGHT_IN_VH)

    return () => {
      setIsInScrollable(false)
    }
  }, [SCROLLABLE_HEIGHT_IN_VH, scrolledInVH, setIsInScrollable])
}

export default useIsInScrollable
