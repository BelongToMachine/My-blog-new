"use client"

interface TimelineItem {
  period: string
  title: string
  description: string
}

export default function TimelineBlock({
  title,
  data,
}: {
  title?: string
  data: { items?: TimelineItem[] }
}) {
  const items = data.items ?? []

  return (
    <div className="space-y-4">
      {title ? (
        <p className="font-pixel text-[11px] uppercase tracking-[0.16em] text-primary">
          {title}
        </p>
      ) : null}

      <div className="relative space-y-0">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 border-2 border-primary bg-background" />
              {index < items.length - 1 ? (
                <div className="mt-1 w-px flex-1 bg-border/60" />
              ) : null}
            </div>
            <div className="pb-5">
              <span className="mb-1 block font-pixel text-[10px] uppercase tracking-[0.14em] text-primary/78">
                {item.period}
              </span>
              <p className="mb-1 font-pixel text-[12px] tracking-[0.05em] text-foreground">
                {item.title}
              </p>
              <p className="text-[12px] leading-6 tracking-[0.04em] text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
