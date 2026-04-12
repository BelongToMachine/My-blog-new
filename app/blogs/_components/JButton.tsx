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
        "w-[100px] cursor-none overflow-hidden text-ellipsis whitespace-nowrap rounded-[7px] border border-border/70 bg-card/75 px-3 py-[0.65rem] text-center text-[0.8rem] text-foreground shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition-[background-color,transform,border-color] duration-200 hover:-translate-y-0.5 hover:bg-accent",
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
