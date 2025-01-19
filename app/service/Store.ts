import { create } from "zustand"

interface CursorStateStore {
  isMagicCursor: boolean
  switchMagicCursor: (value: boolean) => void
}

interface VirtualCursorStore {
  position:
    | {
        x: number;
        y: number;
      }
    | undefined;
  updateCursorPosition: (updateFn: (prev: { x: number; y: number }) => { x: number; y: number }) => void;
  setCursorPosition: (userInputPosition : { x : number; y : number}) => void
}

export const useDefaultCursorStore = create<CursorStateStore>((set) => ({
  isMagicCursor: false,

  switchMagicCursor: (value: boolean) => {
    set({ isMagicCursor: value })
  },
}))

export const useVirtualCursorStore = create<VirtualCursorStore>((set) => ({
  position: undefined,

  updateCursorPosition: (updateFn) => {
    set((state) => {
      const currentPosition = state.position ?? { x: 0, y: 0 };
      const updatedPosition = updateFn(currentPosition);
      
      return { position: updatedPosition };
    });
  },

  setCursorPosition: (userInputPosition) => {
    set({ position: userInputPosition })
  },
}));
