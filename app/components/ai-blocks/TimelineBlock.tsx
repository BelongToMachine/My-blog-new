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
        <p className="font-pixel text-xs uppercase tracking-[0.22em] text-primary">
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
              <span className="font-pixel mb-1 block text-[10px] uppercase tracking-[0.2em] text-primary/80">
                {item.period}
              </span>
              <p className="mb-1 text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
