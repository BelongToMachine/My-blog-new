import { create } from "zustand"

export type CursorVariant = "arrow" | "pointer"

interface CursorStateStore {
  isMagicCursor: boolean
  switchMagicCursor: (value: boolean) => void
}

interface VirtualCursorStore {
  position:
    | {
        x: number
        y: number
      }
    | undefined
  targetPosition:
    | {
        x: number
        y: number
      }
    | undefined
  cursorRect: DOMRect | null
  cursorVariant: CursorVariant
  isOverlapping: boolean
  isOverlappingMinusOffset: boolean
  updateCursorPosition: (
    updateFn: (prev: { x: number; y: number }) => { x: number; y: number }
  ) => void
  setCursorPosition: (userInputPosition: { x: number; y: number }) => void
  setCursorTargetPosition: (userInputPosition: { x: number; y: number }) => void
  setCursorRect: (cursorReact: DOMRect | null) => void
  setCursorVariant: (variant: CursorVariant) => void
  setIsOverlapping: (
    isOverlapping: boolean,
    isOverlappingMinusOffset: boolean
  ) => void
}

interface ScrollableStore {
  isInScrollable: boolean
  setIsInScrollable: (param: boolean) => void
}

export const useDefaultCursorStore = create<CursorStateStore>((set) => ({
  isMagicCursor: false,

  switchMagicCursor: (value: boolean) => {
    set({ isMagicCursor: value })
  },
}))

export const useVirtualCursorStore = create<VirtualCursorStore>((set) => ({
  position: undefined,

  targetPosition: undefined,

  cursorRect: null,

  cursorVariant: "arrow",

  isOverlapping: false,

  isOverlappingMinusOffset: false,

  updateCursorPosition: (updateFn) => {
    set((state) => {
      const currentPosition = state.position ?? { x: 0, y: 0 }
      const updatedPosition = updateFn(currentPosition)

      return { position: updatedPosition }
    })
  },

  setCursorPosition: (userInputPosition) => {
    set({ position: userInputPosition, targetPosition: userInputPosition })
  },

  setCursorTargetPosition: (userInputPosition) => {
    set({ targetPosition: userInputPosition })
  },

  setCursorRect: (cursorReact) => {
    if (cursorReact instanceof DOMRect) {
      set({ cursorRect: cursorReact })
    } else console.warn("Invalid DOMRect passed to setCursorRect")
  },

  setCursorVariant: (variant) => set({ cursorVariant: variant }),

  setIsOverlapping: (isOverlapping, isOverlappingMinusOffset) =>
    set({
      isOverlapping,
      isOverlappingMinusOffset,
    }),
}))

export const useScrollableStore = create<ScrollableStore>((set) => ({
  isInScrollable: true,
  setIsInScrollable: (userInputBoolean) => {
    set({ isInScrollable: userInputBoolean })
  },
}))

interface ReadingFontStore {
  isNormalFont: boolean
  setNormalFont: (value: boolean) => void
}

export const useReadingFontStore = create<ReadingFontStore>((set) => ({
  isNormalFont: true,
  setNormalFont: (value: boolean) => {
    const root = document.documentElement
    root.classList.toggle("font-normal-mode", value)
    localStorage.setItem("reading-font-mode", value ? "normal" : "pixel")
    set({ isNormalFont: value })
  },
}))
