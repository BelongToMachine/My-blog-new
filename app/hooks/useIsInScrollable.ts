import { useEffect } from "react"
import { useScrollableStore } from "../service/Store"

const useIsInScrollable = (
  scrolledInVH: number,
  SCROLLABLE_HEIGHT_IN_VH: number,
  source = "dynamic-bezier"
) => {
  const setScrollableSource = useScrollableStore((state) => state.setScrollableSource)
  const clearScrollableSource = useScrollableStore((state) => state.clearScrollableSource)

  useEffect(() => {
    setScrollableSource(source, scrolledInVH < SCROLLABLE_HEIGHT_IN_VH)

    return () => {
      clearScrollableSource(source)
    }
  }, [SCROLLABLE_HEIGHT_IN_VH, clearScrollableSource, scrolledInVH, setScrollableSource, source])
}

export default useIsInScrollable
