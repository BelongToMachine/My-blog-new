"use client"

interface CompactChatHeaderProps {
  eyebrow: string
  title: string
  description: string
}

export default function CompactChatHeader({
  eyebrow,
  title,
  description,
}: CompactChatHeaderProps) {
  return (
    <div className="min-w-0 flex-1 space-y-1 md:max-w-2xl">
      <p className="section-kicker">{eyebrow}</p>
      <div className="space-y-1">
        <h1 className="font-pixel text-[clamp(0.92rem,2.3vw,1.1rem)] uppercase tracking-[0.08em] text-foreground">
          {title}
        </h1>
        <p className="max-w-2xl font-pixel text-[11px] uppercase leading-6 tracking-[0.08em] text-muted-foreground sm:text-[12px]">
          {description}
        </p>
      </div>
    </div>
  )
}
