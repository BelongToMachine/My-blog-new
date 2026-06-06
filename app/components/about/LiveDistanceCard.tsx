"use client"

import { useEffect, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  HANGZHOU_LOCATION,
  type ApproximateGeoPoint,
  type DistanceCardLocationResponse,
} from "@/app/lib/funFactsGeo"
import { cn } from "@/lib/utils"

const cardShell =
  "pixel-panel overflow-hidden border border-border/80 bg-card/88 transition-colors duration-200 hover:border-primary/50"

const mapWidth = 800
const mapHeight = 420

type LoadState = "loading" | "ready" | "unavailable"

export default function LiveDistanceCard() {
  const t = useTranslations("funFacts.map")
  const locale = useLocale()
  const [loadState, setLoadState] = useState<LoadState>("loading")
  const [geoData, setGeoData] = useState<DistanceCardLocationResponse | null>(null)

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()

    async function loadGeo() {
      try {
        const response = await fetch("/api/fun-facts/location", {
          cache: "no-store",
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error("Failed to load live distance")
        }

        const data = (await response.json()) as DistanceCardLocationResponse

        if (!isMounted) {
          return
        }

        setGeoData(data)
        setLoadState(data.status === "ok" ? "ready" : "unavailable")
      } catch {
        if (!isMounted || abortController.signal.aborted) {
          return
        }

        setLoadState("unavailable")
      }
    }

    loadGeo()

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  const visitor = geoData?.visitor
  const visitorLabel = formatVisitorLocation(visitor, locale, t("toUnknownValue"))
  const formattedDistance =
    geoData?.distanceKm != null
      ? new Intl.NumberFormat(locale).format(Math.round(geoData.distanceKm))
      : null

  const title =
    loadState === "ready" && formattedDistance
      ? t("titleReady", { distance: formattedDistance })
      : loadState === "loading"
        ? t("titleLoading")
        : t("titleUnavailable")

  const body =
    loadState === "ready"
      ? t("bodyReady", { location: visitorLabel })
      : loadState === "loading"
        ? t("bodyLoading")
        : t("bodyUnavailable")

  const distanceValue =
    loadState === "ready" && formattedDistance
      ? t("distanceReadyValue", { distance: formattedDistance })
      : loadState === "loading"
        ? t("distancePendingValue")
        : t("distanceUnavailableValue")

  const statusPillLabel =
    loadState === "ready"
      ? t("sourceReady")
      : loadState === "loading"
        ? t("sourceLoading")
        : t("sourceUnavailable")

  const ariaLabel =
    loadState === "ready"
      ? t("mapAriaReady", { visitor: visitorLabel })
      : loadState === "loading"
        ? t("mapAriaLoading")
        : t("mapAriaUnavailable")

  return (
    <article className={cn(cardShell, "p-0")}>
      <div className="border-b border-border/60 bg-[linear-gradient(180deg,hsl(var(--accent))/0.44,transparent)] p-4 sm:p-5">
        <div className="overflow-hidden border-2 border-border/60 bg-[linear-gradient(180deg,#cfe6f2_0%,#d9ecf6_100%)]">
          <DistanceMapGraphic
            ariaLabel={ariaLabel}
            loadState={loadState}
            visitor={visitor}
          />
        </div>
      </div>

      <div className="grid gap-5 p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <MetaPill>{t("eyebrow")}</MetaPill>
          <MetaPill>{statusPillLabel}</MetaPill>
        </div>

        <div className="space-y-3">
          <h3 className="font-editorial max-w-[18ch] text-[clamp(1.65rem,2.3vw,2.35rem)] leading-[1.04] tracking-[-0.03em] text-foreground">
            {title}
          </h3>
          <p className="max-w-[60ch] text-pretty text-[15px] leading-7 text-foreground/82 md:text-base md:leading-8">
            {body}
          </p>
        </div>

        <div className="grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-3">
          <FactStat label={t("fromLabel")} value={t("fromValue")} />
          <FactStat label={t("toLabel")} value={visitorLabel} />
          <FactStat
            label={t("distanceLabel")}
            value={distanceValue}
            valueClassName="text-primary"
          />
        </div>
      </div>
    </article>
  )
}

function DistanceMapGraphic({
  ariaLabel,
  loadState,
  visitor,
}: {
  ariaLabel: string
  loadState: LoadState
  visitor?: ApproximateGeoPoint
}) {
  const homePoint = projectPoint(
    HANGZHOU_LOCATION.latitude,
    HANGZHOU_LOCATION.longitude,
  )
  const visitorPoint =
    visitor?.latitude != null && visitor?.longitude != null
      ? projectPoint(visitor.latitude, visitor.longitude)
      : null

  const routePaths = visitorPoint
    ? buildRoutePaths(visitorPoint, homePoint)
    : []

  return (
    <svg
      viewBox={`0 0 ${mapWidth} ${mapHeight}`}
      role="img"
      aria-label={ariaLabel}
      className="h-full w-full"
    >
      <rect width={mapWidth} height={mapHeight} fill="#cfe6f2" />

      <g opacity="0.3" stroke="#97bfd1" strokeWidth="1">
        <path d="M0 110h800" />
        <path d="M0 210h800" />
        <path d="M0 310h800" />
        <path d="M160 0v420" />
        <path d="M320 0v420" />
        <path d="M480 0v420" />
        <path d="M640 0v420" />
      </g>

      <g fill="#f6fbff">
        <path d="M44 78c36-19 97-27 152-17l25 10 31-10 47 15 13 29-17 16-34 6-27 21-58 7-28-20-31 11-29-21-15-4-11-18 8-16z" />
        <path d="M170 183l22 18 11 37-18 54-20 53-18-8-6-30 9-50 3-35 17-39z" />
        <path d="M332 95l32-16 34 4 17 17 13-2 15 10-5 17 22 14 29-6 15 21-17 8-30 2-16 17-33 3-12 30 9 46-22 42-48-7-30-51 5-48 17-25-6-26 11-25z" />
        <path d="M520 92l31-13 83 3 45 20 23-5 40 15-11 21 13 20-18 19-43 8-29 20-41 0-21 17-42 5-35-14-18-29 8-30 21-19-4-22 18-16z" />
        <path d="M660 275l33 2 24 14-6 20-29 8-35-8-8-18 21-18z" />
      </g>

      {routePaths.length > 0 ? (
        <g>
          {routePaths.map((path) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke="#4d55e2"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="6 15"
            />
          ))}
        </g>
      ) : loadState === "loading" ? (
        <g>
          <circle cx="108" cy="154" r="18" fill="#f7b500" opacity="0.16" />
          <circle cx="108" cy="154" r="8" fill="#f7b500" opacity="0.75" />
          <path
            d="M108 154C186 124 288 118 398 136"
            fill="none"
            stroke="#4d55e2"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="6 15"
            opacity="0.45"
          />
        </g>
      ) : null}

      {visitorPoint ? (
        <PointMarker color="#f7b500" point={visitorPoint} />
      ) : null}

      <PointMarker color="#00a7d1" point={homePoint} />
    </svg>
  )
}

function PointMarker({
  color,
  point,
}: {
  color: string
  point: { x: number; y: number }
}) {
  return (
    <g>
      <circle cx={point.x} cy={point.y} r="17" fill={color} opacity="0.18" />
      <circle cx={point.x} cy={point.y} r="8" fill={color} />
    </g>
  )
}

function FactStat({
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
          "mt-2 text-sm leading-7 text-foreground/84",
          valueClassName,
        )}
      >
        {value}
      </p>
    </div>
  )
}

function MetaPill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center border border-border/60 bg-background/70 px-2.5 py-1 font-pixel text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  )
}

function formatVisitorLocation(
  visitor: ApproximateGeoPoint | undefined,
  locale: string,
  fallbackLabel: string,
) {
  if (!visitor) {
    return fallbackLabel
  }

  const countryName = visitor.country
    ? getCountryName(visitor.country, locale)
    : null

  if (visitor.city && countryName) {
    return `${visitor.city}, ${countryName}`
  }

  if (visitor.city) {
    return visitor.city
  }

  if (countryName) {
    return countryName
  }

  if (visitor.countryRegion) {
    return visitor.countryRegion
  }

  return fallbackLabel
}

function getCountryName(countryCode: string, locale: string) {
  try {
    return (
      new Intl.DisplayNames([locale], { type: "region" }).of(countryCode) ??
      countryCode
    )
  } catch {
    return countryCode
  }
}

function projectPoint(latitude: number, longitude: number) {
  return {
    x: ((longitude + 180) / 360) * mapWidth,
    y: ((90 - latitude) / 180) * mapHeight,
  }
}

function buildRoutePaths(
  visitorPoint: { x: number; y: number },
  homePoint: { x: number; y: number },
) {
  const directDistance = Math.abs(homePoint.x - visitorPoint.x)

  if (directDistance <= mapWidth / 2) {
    return [buildCurvePath(visitorPoint, homePoint)]
  }

  if (visitorPoint.x < homePoint.x) {
    const wrappedHome = { x: homePoint.x - mapWidth, y: homePoint.y }
    const edgePoint = interpolateAtX(visitorPoint, wrappedHome, 0)

    return [
      buildCurvePath(visitorPoint, edgePoint),
      buildCurvePath({ x: mapWidth, y: edgePoint.y }, homePoint),
    ]
  }

  const wrappedHome = { x: homePoint.x + mapWidth, y: homePoint.y }
  const edgePoint = interpolateAtX(visitorPoint, wrappedHome, mapWidth)

  return [
    buildCurvePath(visitorPoint, edgePoint),
    buildCurvePath({ x: 0, y: edgePoint.y }, homePoint),
  ]
}

function interpolateAtX(
  start: { x: number; y: number },
  end: { x: number; y: number },
  x: number,
) {
  const progress = (x - start.x) / (end.x - start.x)

  return {
    x,
    y: start.y + (end.y - start.y) * progress,
  }
}

function buildCurvePath(
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  const deltaX = end.x - start.x
  const archHeight = Math.max(28, Math.min(96, Math.abs(deltaX) * 0.18))
  const controlY = Math.min(start.y, end.y) - archHeight
  const controlOneX = start.x + deltaX * 0.32
  const controlTwoX = start.x + deltaX * 0.68

  return `M ${start.x} ${start.y} C ${controlOneX} ${controlY}, ${controlTwoX} ${controlY}, ${end.x} ${end.y}`
}
