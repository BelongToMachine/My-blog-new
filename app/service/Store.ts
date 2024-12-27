import { create } from "zustand"

interface CursorStateStore {
  isMagicCursor: boolean
  magicCursorStyle: string
  switchMagicCursor: (value: boolean) => void
  setMagicCursorStyle: (style: string) => void
}

export const useCursorStore = create<CursorStateStore>((set) => ({
  isMagicCursor: false,
  magicCursorStyle: `url('/images/cursor.png'), auto`,

  switchMagicCursor: (value: boolean) => {
    set({ isMagicCursor: value })
  },

  setMagicCursorStyle: (style: string) => {
    set({ magicCursorStyle: style })
  },
}))
