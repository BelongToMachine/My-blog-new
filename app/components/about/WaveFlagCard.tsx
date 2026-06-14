import type { CSSProperties } from "react"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import styles from "./WaveFlagCard.module.css"

const DALI_INTRO_URL =
  "https://www.fabionodariphoto.com/en/dali-yunnan-things-to-do/"
const desiredWidth = 176
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
    <article className={cn(className, "flex flex-col gap-4 p-4 md:p-5 lg:p-5")}>
      <div
        role="img"
        aria-label={t("ariaLabel")}
        className={cn(styles.flag, "mx-auto")}
        style={{ width: `min(${friendlyWidth}px, 100%)` }}
      >
        {Array.from({ length: numOfColumns }, (_, index) => (
          <div
            key={index}
            className={styles.column}
            style={getColumnStyle(index)}
          />
        ))}
      </div>

      <div className="space-y-2">
        <h3 className="font-editorial text-[clamp(1.25rem,2vw,1.55rem)] leading-[1.08] tracking-[-0.03em] text-foreground">
          {t("title")}
        </h3>
        {t("body") ? (
          <p className="text-sm leading-6 text-foreground/78">{t("body")}</p>
        ) : null}
        <a
          href={DALI_INTRO_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-sm font-medium leading-6 text-primary transition-colors hover:text-primary/75"
        >
          {t("linkLabel")}
        </a>
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
