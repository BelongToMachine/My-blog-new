import { cn } from "@/lib/utils"

/* ── Database + Money (Financial / Trading) ── */

export function DatabaseDollarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className={cn("h-10 w-10 sm:h-12 sm:w-12", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="miter"
    >
      <rect x="3" y="4" width="12" height="5" rx="0" />
      <rect x="3" y="10" width="12" height="5" rx="0" />
      <rect x="3" y="16" width="12" height="5" rx="0" />
      <rect x="18" y="6" width="4" height="5" rx="0" />
      <path d="M18 10h4M20 6v5" />
    </svg>
  )
}

/* ── Human + AI Interaction (UX Agent) ── */

export function HumanAgentIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className={cn("h-10 w-10 sm:h-12 sm:w-12", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="miter"
    >
      <rect x="4" y="3" width="6" height="6" rx="0" />
      <rect x="3" y="10" width="8" height="3" rx="0" />
      <rect x="4" y="14" width="6" height="8" rx="0" />
      <rect x="15" y="3" width="7" height="6" rx="0" />
      <path d="M17 5h3M17 7h3" />
      <rect x="15" y="12" width="7" height="2" rx="0" />
      <rect x="15" y="15" width="7" height="2" rx="0" />
      <path d="M12 7v6" />
    </svg>
  )
}

/* ── Shopping Cart + Package (E-Commerce) ── */

export function CartBoxIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className={cn("h-10 w-10 sm:h-12 sm:w-12", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="miter"
    >
      <rect x="2" y="6" width="16" height="10" rx="0" />
      <path d="M6 16v4h14v-4" />
      <path d="M2 10h18" />
      <rect x="16" y="2" width="4" height="4" rx="0" />
    </svg>
  )
}

/* ── Chat Bubble + Neural Nodes (AI Application) ── */

export function ChatAIIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      shapeRendering="crispEdges"
      className={cn("h-10 w-10 sm:h-12 sm:w-12", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="miter"
    >
      <rect x="2" y="3" width="18" height="12" rx="0" />
      <path d="M4 15v4l4-4" />
      <circle cx="22" cy="6" r="2" />
      <circle cx="22" cy="13" r="2" />
      <path d="M20 6h-2M20 13h-2" />
      <path d="M9 9h6M9 12h4" />
    </svg>
  )
}
