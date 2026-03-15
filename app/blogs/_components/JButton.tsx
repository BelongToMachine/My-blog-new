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
        padding: "0.65rem 0.75rem",
        borderRadius: "12px",
        backgroundColor: "color-mix(in srgb, var(--card-background-color) 76%, transparent)",
        fontSize: "0.8rem",
        transition: "background-color 0.2s, transform 0.2s, border-color 0.2s",
        cursor: "none",
        textAlign: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100px",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
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
          e.currentTarget.style.transform = "translateY(-2px)"
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor =
          "color-mix(in srgb, var(--card-background-color) 76%, transparent)"
        e.currentTarget.style.transform = "translateY(0)"
      }}
    >
      {children}
    </div>
  )
}

export default JButton
