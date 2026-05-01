"use client"

import { useTranslations } from "next-intl"
import type { ComparisonTableArtifactData } from "@/app/types/ai-workspace"

export default function ComparisonTableBlock({
  title,
  data,
}: {
  title?: string
  data: ComparisonTableArtifactData
}) {
  const t = useTranslations("ai")
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
                {headers[0] ?? t("comparisonFirstColumn")}
              </th>
              {headers.slice(1).map((header, index) => (
                <th
                  key={index}
                  className="px-3 py-2.5 text-left font-pixel text-[10px] uppercase tracking-[0.2em] text-primary"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-border/40 last:border-0"
              >
                <td className="px-3 py-2.5 font-medium text-foreground">
                  {row.label}
                </td>
                {row.values.map((value, valueIndex) => (
                  <td
                    key={valueIndex}
                    className="px-3 py-2.5 text-muted-foreground"
                  >
                    {value}
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
