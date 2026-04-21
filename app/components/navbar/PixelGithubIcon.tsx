import * as React from "react"

import { cn } from "@/lib/utils"

interface PixelGithubIconProps {
  className?: string
}

const PixelGithubIcon = ({ className }: PixelGithubIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 24 24"
    shapeRendering="crispEdges"
    className={cn("h-6 w-6", className)}
    fill="currentColor"
  >
    <path d="M23 7V5h-1V4h-1V3h-1V2h-1V1h-2V0H7v1H5v1H4v1H3v1H2v1H1v2H0v11h1v2h1v1h1v1h1v1h2v1h4v-3H7v-1h3v-3H8v-1H6v-2H5v-4h1V6h2v1h3V6h2v1h3V6h2v4h1v4h-1v2h-2v1h-2v7h4v-1h2v-1h1v-1h1v-1h1v-2h1V7z" />
  </svg>
)

export default PixelGithubIcon
