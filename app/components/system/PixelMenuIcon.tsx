import React from "react"

interface PixelMenuIconProps {
  isOpen: boolean
  className?: string
}

export default function PixelMenuIcon({ isOpen, className }: PixelMenuIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={className || "transition-opacity duration-200 ease-out"}
      aria-hidden="true"
    >
      {isOpen ? (
        <>
          <rect x="0" y="0" width="3" height="3" fill="currentColor" />
          <rect x="3" y="3" width="3" height="3" fill="currentColor" />
          <rect x="6" y="6" width="3" height="3" fill="currentColor" />
          <rect x="9" y="9" width="3" height="3" fill="currentColor" />
          <rect x="12" y="12" width="3" height="3" fill="currentColor" />
          <rect x="15" y="15" width="3" height="3" fill="currentColor" />
          <rect x="15" y="0" width="3" height="3" fill="currentColor" />
          <rect x="12" y="3" width="3" height="3" fill="currentColor" />
          <rect x="9" y="6" width="3" height="3" fill="currentColor" />
          <rect x="6" y="9" width="3" height="3" fill="currentColor" />
          <rect x="3" y="12" width="3" height="3" fill="currentColor" />
          <rect x="0" y="15" width="3" height="3" fill="currentColor" />
        </>
      ) : (
        <>
          <rect x="2" y="3" width="14" height="3" fill="currentColor" />
          <rect x="2" y="8" width="14" height="3" fill="currentColor" />
          <rect x="2" y="13" width="14" height="3" fill="currentColor" />
        </>
      )}
    </svg>
  )
}
