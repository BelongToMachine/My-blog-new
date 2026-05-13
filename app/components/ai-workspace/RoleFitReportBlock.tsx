"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import type {
  RoleFitReferenceItem,
  RoleFitReportArtifactData,
} from "@/app/types/ai-workspace"

function ReferenceCard({
  item,
  fallbackPrefix,
}: {
  item: RoleFitReferenceItem
  fallbackPrefix?: string
}) {
  const locale = useLocale()
  const href =
    item.href ||
    (item.slug && fallbackPrefix ? `/${locale}/${fallbackPrefix}/${item.slug}` : null)
  const titleNode = href ? (
    <Link href={href} className="transition-colors hover:text-primary">
      {item.title}
    </Link>
  ) : (
    item.title
  )

  return (
    <div className="border-l-2 border-primary/30 bg-primary/[0.04] py-2 pl-3 pr-2">
      <p className="font-pixel text-[12px] tracking-[0.05em] text-foreground">{titleNode}</p>
      <p className="text-[12px] leading-6 tracking-[0.04em] text-muted-foreground">{item.reason}</p>
    </div>
  )
}

export default function RoleFitReportBlock({
  title,
  data,
}: {
  title?: string
  data: RoleFitReportArtifactData
}) {
  const t = useTranslations("ai")
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
        <p className="font-pixel text-[11px] uppercase tracking-[0.16em] text-primary">
          {title}
        </p>
      ) : null}

      {typeof fitScore === "number" ? (
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[10px] uppercase tracking-[0.14em] text-primary/78">
            {t("roleFitScore")}
          </span>
          <div className="h-2 flex-1 bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.max(0, Math.min(100, fitScore))}%` }}
            />
          </div>
          <span className="font-pixel text-[11px] uppercase tracking-[0.08em] text-primary">
            {fitScore}%
          </span>
        </div>
      ) : null}

      {strengths.length > 0 ? (
        <div>
          <p className="mb-2 font-pixel text-[10px] uppercase tracking-[0.16em] text-primary/78">
            {t("roleFitStrengths")}
          </p>
          <ul className="space-y-1.5">
            {strengths.map((strength, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-[12px] leading-6 tracking-[0.04em] text-foreground/90"
              >
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 bg-primary" />
                {strength}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {matchedProjects.length > 0 ? (
        <div>
          <p className="mb-2 font-pixel text-[10px] uppercase tracking-[0.16em] text-primary/78">
            {t("roleFitMatchedProjects")}
          </p>
          <div className="space-y-2">
            {matchedProjects.map((project, index) => (
              <ReferenceCard
                key={index}
                item={project}
              />
            ))}
          </div>
        </div>
      ) : null}

      {matchedArticles.length > 0 ? (
        <div>
          <p className="mb-2 font-pixel text-[10px] uppercase tracking-[0.16em] text-primary/78">
            {t("roleFitMatchedArticles")}
          </p>
          <div className="space-y-2">
            {matchedArticles.map((article, index) => (
              <ReferenceCard
                key={index}
                item={article}
                fallbackPrefix="articles"
              />
            ))}
          </div>
        </div>
      ) : null}

      {possibleRisks.length > 0 ? (
        <div>
          <p className="mb-2 font-pixel text-[10px] uppercase tracking-[0.16em] text-primary/78">
            {t("roleFitPossibleRisks")}
          </p>
          <ul className="space-y-1.5">
            {possibleRisks.map((risk, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-[12px] leading-6 tracking-[0.04em] text-foreground/90"
              >
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 bg-destructive" />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {recommendedTalkingPoints.length > 0 ? (
        <div>
          <p className="mb-2 font-pixel text-[10px] uppercase tracking-[0.16em] text-primary/78">
            {t("roleFitRecommendedTalkingPoints")}
          </p>
          <ul className="space-y-1.5">
            {recommendedTalkingPoints.map((point, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-[12px] leading-6 tracking-[0.04em] text-foreground/90"
              >
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 bg-primary" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
