import { create } from "zustand"

interface CursorStateStore {
  isMagicCursor: boolean
  switchMagicCursor: (value: boolean) => void
}

export const useCursorStore = create<CursorStateStore>((set) => ({
  isMagicCursor: false,
  switchMagicCursor: (value: boolean) => {
    set(() => ({ isMagicCursor: value }))
  },
}))
