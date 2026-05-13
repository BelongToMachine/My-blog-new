"use client"

interface Project {
  title: string
  description: string
  tech: string[]
  highlights: string[]
}

export default function ProjectGridBlock({
  title,
  data,
}: {
  title?: string
  data: { projects?: unknown[] }
}) {
  const projects = data.projects ?? []

  return (
    <div className="space-y-4">
      {title ? (
        <p className="font-pixel text-[11px] uppercase tracking-[0.16em] text-primary">
          {title}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((item, index) => {
          const project = item as Project
          return (
            <div key={index} className="space-y-3 border-b border-border/40 pb-4 last:border-0 last:pb-0">
              <p className="mb-2 font-pixel text-[13px] tracking-[0.06em] text-foreground">
                {project.title}
              </p>
              <p className="mb-3 text-[12px] leading-6 tracking-[0.04em] text-muted-foreground">
                {project.description}
              </p>

              <div className="mb-3 flex flex-wrap gap-1.5">
                {(project.tech ?? []).map((t: string, i: number) => (
                  <span
                    key={i}
                    className="border border-border/60 bg-background/70 px-2 py-0.5 font-pixel text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(project.highlights ?? []).map((h: string, i: number) => (
                  <span
                    key={i}
                    className="border border-primary/30 bg-primary/[0.06] px-2 py-0.5 font-pixel text-[10px] uppercase tracking-[0.12em] text-primary/80"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
