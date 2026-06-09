import type { CSSProperties } from "react"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import styles from "./WaveFlagCard.module.css"

const desiredWidth = 240
const numOfColumns = 10
const staggeredDelay = 100
const billow = 1.5

const friendlyWidth = Math.round(desiredWidth / numOfColumns) * numOfColumns
const columnWidth = friendlyWidth / numOfColumns

const firstColumnDelay = numOfColumns * staggeredDelay * -1
const flagStarsImage = generateFlagStarsDataUri()

export default async function WaveFlagCard({
  className,
}: {
  className?: string
}) {
  const t = await getTranslations("funFacts.flag")

  return (
    <article className={cn(className, "flex flex-col gap-5 p-6 md:p-7")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <MetaPill>{t("eyebrow")}</MetaPill>
          <MetaPill>{t("badge")}</MetaPill>
        </div>
        <div aria-hidden className="flex items-end gap-1">
          <span className="h-2.5 w-2.5 bg-[#de2910]/75" />
          <span className="h-2.5 w-2.5 bg-[#de2910]" />
          <span className="h-2.5 w-2.5 bg-[#ffde00]" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-editorial max-w-[18ch] text-[clamp(1.55rem,2.2vw,2.15rem)] leading-[1.05] tracking-[-0.03em] text-foreground">
          {t("title")}
        </h3>
        <p className="text-pretty text-[15px] leading-7 text-foreground/82 md:text-base md:leading-8">
          {t("body")}
        </p>
      </div>

      <div className="border border-border/60 bg-background/68 p-4">
        <div role="img" aria-label={t("ariaLabel")} className={styles.showcase}>
          <div className={styles.flagFrame}>
            <div
              className={styles.flag}
              style={{ width: `${friendlyWidth}px` }}
            >
              {Array.from({ length: numOfColumns }, (_, index) => (
                <div
                  key={index}
                  className={styles.column}
                  style={getColumnStyle(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-2">
        <DetailCell label={t("techniqueLabel")} value={t("techniqueValue")} />
        <DetailCell
          label={t("motionLabel")}
          value={t("motionValue")}
          valueClassName="text-primary"
        />
      </div>
    </article>
  )
}

function getColumnStyle(index: number): CSSProperties {
  return {
    ["--billow" as string]: `${index * billow}px`,
    animationDelay: `${firstColumnDelay + index * staggeredDelay}ms`,
    backgroundColor: "#de2910",
    backgroundImage: `url("${flagStarsImage}")`,
    backgroundPosition: `${index * columnWidth * -1}px 0`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${friendlyWidth}px 100%`,
  }
}

function generateFlagStarsDataUri() {
  const largeStar = createStarPath(5, 5, 3, 1.2, -Math.PI / 2)
  const smallStars = [
    createDirectedStarPath(10, 2, 1, 5, 5),
    createDirectedStarPath(12, 4, 1, 5, 5),
    createDirectedStarPath(12, 7, 1, 5, 5),
    createDirectedStarPath(10, 9, 1, 5, 5),
  ]

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" preserveAspectRatio="none">
      <path fill="#ffde00" d="${largeStar}" />
      ${smallStars.map((path) => `<path fill="#ffde00" d="${path}" />`).join("")}
    </svg>
  `.trim()

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function createDirectedStarPath(
  cx: number,
  cy: number,
  outerRadius: number,
  targetX: number,
  targetY: number,
) {
  const angleToTarget = Math.atan2(targetY - cy, targetX - cx)

  return createStarPath(cx, cy, outerRadius, outerRadius * 0.4, angleToTarget)
}

function createStarPath(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  rotation: number,
) {
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = rotation + (index * Math.PI) / 5
    const radius = index % 2 === 0 ? outerRadius : innerRadius
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius

    return `${formatCoordinate(x)},${formatCoordinate(y)}`
  })

  return `M ${points.join(" L ")} Z`
}

function formatCoordinate(value: number) {
  return value.toFixed(3).replace(/\.?0+$/, "")
}

function MetaPill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center border border-border/60 bg-background/70 px-2.5 py-1 font-pixel text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  )
}

function DetailCell({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="border border-border/60 bg-background/68 px-4 py-3">
      <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-sm leading-7 text-foreground/82",
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  )
}
