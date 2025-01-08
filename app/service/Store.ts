import { create } from "zustand"

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
  setCursorPosition: (userInputPosition: { x: number; y: number }) => void
}

export const useDefaultCursorStore = create<CursorStateStore>((set) => ({
  isMagicCursor: false,

  switchMagicCursor: (value: boolean) => {
    set({ isMagicCursor: value })
  },
}))

export const useVirtualCursorStore = create<VirtualCursorStore>((set) => ({
  position: undefined,

  setCursorPosition: (userInputPosition) => {
    set({ position: userInputPosition })
  },
}))
