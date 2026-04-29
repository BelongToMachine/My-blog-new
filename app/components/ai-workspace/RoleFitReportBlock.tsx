"use client"

interface RoleFitReportData {
  fitScore?: number
  strengths?: string[]
  matchedProjects?: { title: string; reason: string }[]
  matchedArticles?: { title: string; reason: string }[]
  possibleRisks?: string[]
  recommendedTalkingPoints?: string[]
}

export default function RoleFitReportBlock({
  title,
  data,
}: {
  title?: string
  data: RoleFitReportData
}) {
  const {
    fitScore,
    strengths = [],
    matchedProjects = [],
    matchedArticles = [],
    possibleRisks = [],
    recommendedTalkingPoints = [],
  } = data

  return (
    <div className="space-y-5">
      {title ? (
        <p className="font-pixel text-xs uppercase tracking-[0.22em] text-primary">
          {title}
        </p>
      ) : null}

      {typeof fitScore === "number" ? (
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[10px] uppercase tracking-[0.2em] text-primary/80">
            Fit Score
          </span>
          <div className="h-2 flex-1 bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.max(0, Math.min(100, fitScore))}%` }}
            />
          </div>
          <span className="font-pixel text-xs text-primary">{fitScore}%</span>
        </div>
      ) : null}

      {strengths.length > 0 ? (
        <div>
          <p className="font-pixel mb-2 text-[10px] uppercase tracking-[0.24em] text-primary/80">
            Strengths
          </p>
          <ul className="space-y-1.5">
            {strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm leading-6 text-foreground/90"
              >
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 bg-primary" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {matchedProjects.length > 0 ? (
        <div>
          <p className="font-pixel mb-2 text-[10px] uppercase tracking-[0.24em] text-primary/80">
            Matched Projects
          </p>
          <div className="space-y-2">
            {matchedProjects.map((p, i) => (
              <div
                key={i}
                className="border-l-2 border-primary/30 bg-primary/[0.04] py-2 pl-3 pr-2"
              >
                <p className="text-sm font-medium text-foreground">{p.title}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {p.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {matchedArticles.length > 0 ? (
        <div>
          <p className="font-pixel mb-2 text-[10px] uppercase tracking-[0.24em] text-primary/80">
            Matched Articles
          </p>
          <div className="space-y-2">
            {matchedArticles.map((a, i) => (
              <div
                key={i}
                className="border-l-2 border-primary/30 bg-primary/[0.04] py-2 pl-3 pr-2"
              >
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {a.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {possibleRisks.length > 0 ? (
        <div>
          <p className="font-pixel mb-2 text-[10px] uppercase tracking-[0.24em] text-primary/80">
            Possible Risks
          </p>
          <ul className="space-y-1.5">
            {possibleRisks.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm leading-6 text-foreground/90"
              >
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 bg-destructive" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {recommendedTalkingPoints.length > 0 ? (
        <div>
          <p className="font-pixel mb-2 text-[10px] uppercase tracking-[0.24em] text-primary/80">
            Recommended Talking Points
          </p>
          <ul className="space-y-1.5">
            {recommendedTalkingPoints.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm leading-6 text-foreground/90"
              >
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 bg-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
