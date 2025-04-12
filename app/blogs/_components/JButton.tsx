import { xTheme } from "@/app/service/ThemeService"
import React from "react"

interface Props {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  attri?: React.CSSProperties
}

const JButton = ({ children, onClick, disabled, attri }: Props) => {
  return (
    <div
      style={{
        padding: "0.5rem 1.6rem",
        borderRadius: "12px",
        backgroundColor: "transparent",
        fontSize: "0.8rem",
        transition: "background-color 0.2s",
        cursor: "none",
        ...xTheme.likeButton,
        ...attri,
      }}
      onClick={(e) => {
        if (!disabled && onClick) {
          onClick(e as unknown as React.MouseEvent<HTMLButtonElement>)
        }
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = xTheme.likeButtonHover[
            "background"
          ] as string
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent"
      }}
    >
      {children}
    </div>
  )
}

export default JButton
