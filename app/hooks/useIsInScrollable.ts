import { useEffect } from "react"
import { useScrollableStore } from "../service/Store"

const useIsInScrollable = (
  scrolledInVH: number,
  scrollableHeightInVh: number
) => {
  const isInScrollable = useScrollableStore((state) => state.isInScrollable)
  const setIsInScrollable = useScrollableStore((state) => state.setIsInScrollable)

  useEffect(() => {
    const nextValue = scrolledInVH < scrollableHeightInVh

    if (isInScrollable !== nextValue) {
      setIsInScrollable(nextValue)
    }
  }, [isInScrollable, scrolledInVH, scrollableHeightInVh, setIsInScrollable])

  useEffect(() => {
    return () => {
      setIsInScrollable(false)
    }
  }, [setIsInScrollable])
}

export default useIsInScrollable
