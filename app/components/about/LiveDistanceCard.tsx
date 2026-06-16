"use client"

import { useEffect, useRef, useState } from "react"
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
const mapHeight = 400
const worldMapMaskStyle = {
  WebkitMaskImage: "url('/maps/world-equirectangular.svg')",
  WebkitMaskPosition: "center",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "100% 100%",
  maskImage: "url('/maps/world-equirectangular.svg')",
  maskPosition: "center",
  maskRepeat: "no-repeat",
  maskSize: "100% 100%",
} as const

type LoadState = "loading" | "ready" | "unavailable"

declare global {
  interface Navigator {
    connection?: {
      effectiveType?: string
      saveData?: boolean
    }
  }
}

export default function LiveDistanceCard() {
  const t = useTranslations("funFacts.map")
  const locale = useLocale()
  const [loadState, setLoadState] = useState<LoadState>("loading")
  const [geoData, setGeoData] = useState<DistanceCardLocationResponse | null>(
    null,
  )
  const articleRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()
    let timeoutId: number | null = null
    let idleCallbackId: number | null = null

    async function loadGeo() {
      if (navigator.connection?.saveData) {
        if (isMounted) {
          setLoadState("unavailable")
        }
        return
      }

      const effectiveType = navigator.connection?.effectiveType
      if (effectiveType === "slow-2g" || effectiveType === "2g") {
        if (isMounted) {
          setLoadState("unavailable")
        }
        return
      }

      try {
        const response = await fetch("/api/fun-facts/location", {
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

    const scheduleLoad = () => {
      if (abortController.signal.aborted) {
        return
      }

      if (typeof window.requestIdleCallback === "function") {
        idleCallbackId = window.requestIdleCallback(() => {
          void loadGeo()
        }, { timeout: 1500 })
        return
      }

      timeoutId = window.setTimeout(() => {
        void loadGeo()
      }, 300)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting) {
          return
        }

        observer.disconnect()
        scheduleLoad()
      },
      {
        rootMargin: "240px 0px",
      },
    )

    const currentArticle = articleRef.current

    if (currentArticle) {
      observer.observe(currentArticle)
    } else {
      scheduleLoad()
    }

    return () => {
      isMounted = false
      observer.disconnect()
      abortController.abort()

      if (idleCallbackId !== null) {
        window.cancelIdleCallback?.(idleCallbackId)
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  const visitor = geoData?.visitor
  const visitorLabel = formatVisitorLocation(
    visitor,
    locale,
    t("toUnknownValue"),
  )
  const formattedDistance =
    geoData?.distanceKm != null
      ? new Intl.NumberFormat(locale).format(Math.round(geoData.distanceKm))
      : null

  const body =
    loadState === "ready"
      ? t("bodyReady", {
          distance: formattedDistance ?? t("distancePendingValue"),
        })
      : loadState === "loading"
        ? t("bodyLoading")
        : t("bodyUnavailable")
  const ariaLabel =
    loadState === "ready"
      ? t("mapAriaReady", { visitor: visitorLabel })
      : loadState === "loading"
        ? t("mapAriaLoading")
        : t("mapAriaUnavailable")

  return (
    <article ref={articleRef} className={cn(cardShell, "grid h-full gap-0 p-0")}>
      <div className="bg-[linear-gradient(180deg,hsl(var(--accent))/0.44,transparent)] p-3 sm:p-4 md:p-5">
        <div className="overflow-hidden bg-[linear-gradient(180deg,#cfe6f2_0%,#d9ecf6_100%)]">
          <DistanceMapGraphic
            ariaLabel={ariaLabel}
            loadState={loadState}
            visitor={visitor}
          />
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 md:p-6">
        <div className="space-y-3">
          <p className="max-w-[60ch] text-pretty text-[15px] leading-7 text-foreground/82 md:text-base md:leading-8">
            {body}
          </p>
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
    <div
      role="img"
      aria-label={ariaLabel}
      className="relative aspect-[1.72/1] w-full overflow-hidden bg-[#121b26] sm:aspect-[1.9/1] md:aspect-[2/1]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(67,92,126,0.2),transparent_30%),linear-gradient(180deg,#192432_0%,#111a25_100%)]" />
      <div
        aria-hidden
        style={worldMapMaskStyle}
        className="absolute inset-[4.5%_0_4%_0] bg-[#2c3d54] opacity-95"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(180deg,transparent,rgba(9,14,20,0.48))]" />

      <svg
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        aria-hidden
        className="absolute inset-0 h-full w-full"
      >
        {routePaths.length > 0 ? (
          <g>
            {routePaths.map((path) => (
              <path
                key={path}
                d={path}
                fill="none"
                stroke="#ff235d"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="4 16"
                opacity={loadState === "loading" ? 0.55 : 0.92}
              />
            ))}
          </g>
        ) : null}

        <HomePinMarker point={homePoint} />
      </svg>
    </div>
  )
}

function HomePinMarker({ point }: { point: { x: number; y: number } }) {
  const pinTop = point.y - 24

  return (
    <g>
      <ellipse
        cx={point.x}
        cy={point.y + 11}
        rx="8"
        ry="4.5"
        fill="#05080d"
        opacity="0.42"
      />
      <path
        d={`M ${point.x} ${point.y + 2} L ${point.x - 10} ${pinTop + 24} A 22 22 0 1 1 ${point.x + 10} ${pinTop + 24} Z`}
        fill="#aeb7c0"
        stroke="#6c7885"
        strokeWidth="2"
      />
      <circle cx={point.x} cy={pinTop + 16} r="9.5" fill="#f7f7f6" />
    </g>
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
