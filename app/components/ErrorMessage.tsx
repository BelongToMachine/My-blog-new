import React, { PropsWithChildren } from "react"
import { RetroNotice } from "./system/RetroNotice"

const ErrorMessage = ({ children }: PropsWithChildren) => {
  if (!children) return null
  return (
    <RetroNotice tone="danger" title="validation error">
      {children}
    </RetroNotice>
  )
}

export default ErrorMessage
