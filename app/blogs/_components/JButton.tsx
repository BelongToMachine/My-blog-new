import React from "react"
import { cn } from "@/lib/utils"

interface Props {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  attri?: React.CSSProperties
  className?: string
}

const JButton = ({ children, onClick, disabled, attri, className }: Props) => {
  return (
    <div
      className={cn(
        "font-pixel w-[100px] cursor-none overflow-hidden text-ellipsis whitespace-nowrap border-2 border-border bg-card/88 px-3 py-[0.65rem] text-center text-[10px] uppercase tracking-[0.18em] text-foreground shadow-[4px_4px_0_rgba(0,0,0,0.18)] transition-[background-color,border-color] duration-200 hover:border-primary hover:bg-accent",
        disabled && "pointer-events-none opacity-60",
        className
      )}
      style={{
        ...attri,
      }}
      onClick={(e) => {
        if (!disabled && onClick) {
          onClick(e as unknown as React.MouseEvent<HTMLButtonElement>)
        }
      }}
      aria-disabled={disabled}
    >
      {children}
    </div>
  )
}

export default JButton
