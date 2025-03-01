"use client"
import { createContext, ReactNode, useReducer, Dispatch } from "react"

interface Action {
  type: "SWITCH_DOES_NEED_SCROLLABLE" | "SWITCH_IS_IN_SCROLLABLE"
}

interface ScrollableState {
  doesScrollableNeeded: boolean
  isInScrollable: boolean
}

const initialState: ScrollableState = {
  doesScrollableNeeded: false,
  isInScrollable: false,
}

// Reducer function
const scrollableReducer = (
  state: ScrollableState,
  action: Action
): ScrollableState => {
  switch (action.type) {
    case "SWITCH_DOES_NEED_SCROLLABLE":
      return { ...state, doesScrollableNeeded: !state.doesScrollableNeeded }
    case "SWITCH_IS_IN_SCROLLABLE":
      return { ...state, isInScrollable: !state.isInScrollable }
    default:
      return state
  }
}

// Context type
interface ScrollableContextType {
  state: ScrollableState
  dispatch: Dispatch<Action>
}

// Provide default values
export const ScrollableContext = createContext<ScrollableContextType>({
  state: initialState,
  dispatch: () => {},
})

// Provider component
export const ScrollableProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(scrollableReducer, initialState)
  return (
    <ScrollableContext.Provider value={{ state, dispatch }}>
      {children}
    </ScrollableContext.Provider>
  )
}
