"use client"

interface ComparisonRow {
  label: string
  values: string[]
}

export default function ComparisonTableBlock({
  title,
  data,
}: {
  title?: string
  data: { headers?: string[]; rows?: ComparisonRow[] }
}) {
  const headers = data.headers ?? []
  const rows = data.rows ?? []

  return (
    <div className="space-y-4">
      {title ? (
        <p className="font-pixel text-xs uppercase tracking-[0.22em] text-primary">
          {title}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="px-3 py-2.5 text-left font-pixel text-[10px] uppercase tracking-[0.2em] text-primary">
                {headers[0] ?? "Item"}
              </th>
              {headers.slice(1).map((h, i) => (
                <th
                  key={i}
                  className="px-3 py-2.5 text-left font-pixel text-[10px] uppercase tracking-[0.2em] text-primary"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-3 py-2.5 font-medium text-foreground">
                  {row.label}
                </td>
                {row.values.map((v, j) => (
                  <td key={j} className="px-3 py-2.5 text-muted-foreground">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
