"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  DEV_GEO_PRESETS,
  GUANGZHOU_LOCATION,
  type DevGeoPresetId,
  type ApproximateGeoPoint,
  type DistanceCardLocationResponse,
} from "@/app/lib/funFactsGeo"
import { useAdaptiveMotion } from "@/app/hooks/useAdaptiveMotion"
import { cn } from "@/lib/utils"

const cardShell =
  "pixel-panel !shadow-none overflow-hidden border border-border/80 bg-card/88 transition-colors duration-200 hover:border-primary/50"
const mapWidth = 800
const mapHeight = 400
const markerColor = "#f09150"
const markerOutlineWidth = 0.5
const nearbyPointThreshold = 120
const nearbyPointTargetDistance = 220
const maxNearbyMapZoom = 2.4
const veryNearbyPointThreshold = 60
const veryNearbyPointTargetDistance = 300
const maxVeryNearbyMapZoom = 3.6
const mobileMarkerScale = 2
const mapZoomAnimationDurationMs = 900
const limitedMapZoomAnimationDurationMs = 320
const isDevMode =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_DEV_MODE === "dev"
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
  const [selectedDevLocation, setSelectedDevLocation] =
    useState<DevGeoPresetId | null>(isDevMode ? "beijing" : null)
  const articleRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    let isMounted = true
    const abortController = new AbortController()
    let timeoutId: number | null = null
    let idleCallbackId: number | null = null
    let observer: IntersectionObserver | null = null
    const mockLocationId = isDevMode ? selectedDevLocation : null

    async function loadGeo() {
      if (!mockLocationId && navigator.connection?.saveData) {
        if (isMounted) {
          setLoadState("unavailable")
        }
        return
      }

      const effectiveType = navigator.connection?.effectiveType
      if (
        !mockLocationId &&
        (effectiveType === "slow-2g" || effectiveType === "2g")
      ) {
        if (isMounted) {
          setLoadState("unavailable")
        }
        return
      }

      try {
        const endpoint = mockLocationId
          ? `/api/fun-facts/location?mock=${encodeURIComponent(mockLocationId)}`
          : "/api/fun-facts/location"
        const response = await fetch(endpoint, {
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

    const cleanup = () => {
      isMounted = false
      observer?.disconnect()
      abortController.abort()

      if (idleCallbackId !== null) {
        window.cancelIdleCallback?.(idleCallbackId)
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }

    const scheduleLoad = () => {
      if (abortController.signal.aborted) {
        return
      }

      if (typeof window.requestIdleCallback === "function") {
        idleCallbackId = window.requestIdleCallback(
          () => {
            void loadGeo()
          },
          { timeout: 1500 },
        )
        return
      }

      timeoutId = window.setTimeout(() => {
        void loadGeo()
      }, 300)
    }

    if (mockLocationId) {
      void loadGeo()
      return cleanup
    }

    observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting) {
          return
        }

        observer?.disconnect()
        scheduleLoad()
      },
      {
        rootMargin: "240px 0px",
      },
    )

    const currentArticle = articleRef.current

    if (currentArticle) {
      observer?.observe(currentArticle)
    } else {
      scheduleLoad()
    }

    return cleanup
  }, [selectedDevLocation])

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
      ? t.rich("bodyReady", {
          city: (chunks) => <Highlight>{chunks}</Highlight>,
          distance: (chunks) => <Highlight>{chunks}</Highlight>,
          distanceValue: formattedDistance ?? t("distancePendingValue"),
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
    <article
      ref={articleRef}
      className={cn(cardShell, "flex h-full flex-col p-0")}
    >
      {isDevMode ? (
        <div className="border-b border-border/60 bg-background/40 px-3 py-2 sm:px-4 md:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-pixel text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("devToolsLabel")}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("devToolsHint")}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {DEV_GEO_PRESETS.map((preset) => {
              const isSelected = selectedDevLocation === preset.id

              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setGeoData(null)
                    setLoadState("loading")
                    setSelectedDevLocation(preset.id)
                  }}
                  className={cn(
                    "border px-2 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isSelected
                      ? "border-[#fcc31e] bg-[#fcc31e]/15 text-foreground"
                      : "border-border/60 bg-background/60 text-muted-foreground hover:border-primary/60 hover:text-foreground",
                  )}
                >
                  {t(preset.labelKey)}
                </button>
              )
            })}
            <button
              type="button"
              aria-pressed={selectedDevLocation === null}
              onClick={() => {
                setGeoData(null)
                setLoadState("loading")
                setSelectedDevLocation(null)
              }}
              className={cn(
                "border px-2 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                selectedDevLocation === null
                  ? "border-primary/70 bg-primary/10 text-foreground"
                  : "border-border/60 bg-background/60 text-muted-foreground hover:border-primary/60 hover:text-foreground",
              )}
            >
              {t("devToolsReset")}
            </button>
          </div>
        </div>
      ) : null}
      <div className="bg-[linear-gradient(180deg,hsl(var(--accent))/0.44,transparent)] p-3 sm:p-4 md:p-5">
        <div className="overflow-hidden bg-[linear-gradient(180deg,#cfe6f2_0%,#d9ecf6_100%)]">
          <DistanceMapGraphic
            ariaLabel={ariaLabel}
            loadState={loadState}
            visitor={visitor}
          />
        </div>
      </div>

      <div className="flex flex-1 items-center p-5 sm:p-6 md:p-6">
        <div className="w-full space-y-3">
          <p className="mx-auto max-w-[60ch] text-center text-pretty text-lg leading-8 text-foreground md:text-xl md:leading-9">
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
  const { isMotionReady, motionLevel } = useAdaptiveMotion()
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapTransformRef = useRef<HTMLDivElement | null>(null)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [mapViewport, setMapViewport] = useState({ width: 0, height: 0 })
  const [isMapSettled, setIsMapSettled] = useState(false)
  const homePoint = projectPoint(
    GUANGZHOU_LOCATION.latitude,
    GUANGZHOU_LOCATION.longitude,
  )
  const visitorPoint =
    visitor?.latitude != null && visitor?.longitude != null
      ? projectPoint(visitor.latitude, visitor.longitude)
      : null

  const routePaths = visitorPoint
    ? buildRoutePaths(visitorPoint, homePoint)
    : []
  const mapView = getMapView(visitorPoint, homePoint)
  const baseMapTransform = "translate(0%, 0%) scale(1)"
  const mapTargetTransform = mapView.shouldZoom
    ? `translate(${mapView.translateX}%,${mapView.translateY}%) scale(${mapView.scale})`
    : baseMapTransform

  useEffect(() => {
    const mapElement = mapRef.current

    if (!mapElement) {
      return
    }

    if (typeof IntersectionObserver === "undefined") {
      setHasBeenViewed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return
        }

        setHasBeenViewed(true)
        observer.disconnect()
      },
      { threshold: 0.25 },
    )

    observer.observe(mapElement)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)")
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches)

    updateViewport()
    mediaQuery.addEventListener("change", updateViewport)

    return () => mediaQuery.removeEventListener("change", updateViewport)
  }, [])

  useEffect(() => {
    const mapElement = mapRef.current

    if (!mapElement) {
      return
    }

    const updateViewport = () => {
      const { width, height } = mapElement.getBoundingClientRect()

      setMapViewport((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      )
    }

    updateViewport()

    if (typeof ResizeObserver === "undefined") {
      return
    }

    const observer = new ResizeObserver(updateViewport)
    observer.observe(mapElement)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mapElement = mapTransformRef.current

    if (!isMotionReady || !mapElement) {
      return
    }

    if (!hasBeenViewed) {
      mapElement.style.transform = baseMapTransform
      setIsMapSettled(false)
      return
    }

    if (!mapView.shouldZoom) {
      mapElement.style.transform = baseMapTransform
      setIsMapSettled(true)
      return
    }

    setIsMapSettled(false)

    const duration =
      motionLevel === "reduced"
        ? 0
        : motionLevel === "limited"
          ? limitedMapZoomAnimationDurationMs
          : mapZoomAnimationDurationMs

    if (duration === 0 || typeof mapElement.animate !== "function") {
      mapElement.style.transform = mapTargetTransform
      setIsMapSettled(true)
      return
    }

    const animation = mapElement.animate(
      [{ transform: baseMapTransform }, { transform: mapTargetTransform }],
      {
        duration,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both",
      },
    )
    animation.onfinish = () => setIsMapSettled(true)

    return () => {
      animation.onfinish = null
      animation.cancel()
    }
  }, [
    baseMapTransform,
    hasBeenViewed,
    isMotionReady,
    mapTargetTransform,
    mapView.shouldZoom,
    motionLevel,
  ])

  const markerScale = isMobileViewport ? mobileMarkerScale : 1
  const showMapMarkerOverlay =
    hasBeenViewed &&
    isMapSettled &&
    mapView.shouldZoom &&
    mapViewport.width > 0 &&
    mapViewport.height > 0
  const avatarPoint = showMapMarkerOverlay
    ? getMapOverlayPoint(homePoint, mapView, mapViewport)
    : homePoint
  const visitorOverlayPoint =
    showMapMarkerOverlay && visitorPoint
      ? getMapOverlayPoint(visitorPoint, mapView, mapViewport)
      : visitorPoint

  return (
    <div
      ref={mapRef}
      role="img"
      aria-label={ariaLabel}
      className="relative aspect-[1.72/1] w-full overflow-hidden bg-[#121b26] sm:aspect-[1.9/1] md:aspect-[2/1] lg:aspect-[1.84/1]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(67,92,126,0.2),transparent_30%),linear-gradient(180deg,#192432_0%,#111a25_100%)]" />
      <div
        ref={mapTransformRef}
        className="absolute inset-0"
        style={{
          transform: baseMapTransform,
          transformOrigin: "50% 50%",
        }}
      >
        <div
          aria-hidden
          style={worldMapMaskStyle}
          className="absolute inset-[4.5%_0_4%_0] bg-[#2c3d54] opacity-95"
        />

        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          aria-hidden
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <filter
              id="map-avatar-outline"
              x="-25%"
              y="-25%"
              width="150%"
              height="150%"
              colorInterpolationFilters="sRGB"
            >
              <feMorphology
                in="SourceAlpha"
                operator="dilate"
                radius={markerOutlineWidth}
                result="expanded"
              />
              <feFlood
                floodColor="#ffffff"
                floodOpacity="1"
                result="outlineColor"
              />
              <feComposite
                in="outlineColor"
                in2="expanded"
                operator="in"
                result="outline"
              />
              <feMerge>
                <feMergeNode in="outline" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {routePaths.length > 0 ? (
            <g>
              {routePaths.map((path) => (
                <path
                  key={path}
                  d={path}
                  fill="none"
                  stroke="#fcc31e"
                  strokeWidth={7 / mapView.scale}
                  strokeLinecap="round"
                  strokeDasharray={`${4 / mapView.scale} ${16 / mapView.scale}`}
                  opacity={loadState === "loading" ? 0.55 : 0.92}
                />
              ))}
            </g>
          ) : null}

          {visitorPoint ? (
            !showMapMarkerOverlay ? (
              <MapPinMarker
                point={visitorPoint}
                fill={markerColor}
                mapScale={mapView.scale}
                sizeMultiplier={markerScale}
              />
            ) : null
          ) : null}

          {!showMapMarkerOverlay ? (
            <MapAvatarMarker
              point={homePoint}
              mapScale={mapView.scale}
              sizeMultiplier={markerScale}
            />
          ) : null}
        </svg>
      </div>
      {showMapMarkerOverlay ? (
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <defs>
            <filter
              id="map-avatar-outline-overlay"
              x="-25%"
              y="-25%"
              width="150%"
              height="150%"
              colorInterpolationFilters="sRGB"
            >
              <feMorphology
                in="SourceAlpha"
                operator="dilate"
                radius={markerOutlineWidth}
                result="expanded"
              />
              <feFlood
                floodColor="#ffffff"
                floodOpacity="1"
                result="outlineColor"
              />
              <feComposite
                in="outlineColor"
                in2="expanded"
                operator="in"
                result="outline"
              />
              <feMerge>
                <feMergeNode in="outline" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {visitorOverlayPoint ? (
            <MapPinMarker
              point={visitorOverlayPoint}
              fill={markerColor}
              mapScale={1}
              sizeMultiplier={markerScale}
            />
          ) : null}
          <MapAvatarMarker
            point={avatarPoint}
            mapScale={1}
            sizeMultiplier={markerScale}
            outlineFilterId="map-avatar-outline-overlay"
          />
        </svg>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(180deg,transparent,rgba(9,14,20,0.48))]" />
    </div>
  )
}

function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="bg-[#fcc31e] px-1.5 py-0.5 font-bold text-black">
      {children}
    </span>
  )
}

function MapPinMarker({
  point,
  fill,
  mapScale,
  sizeMultiplier,
}: {
  point: { x: number; y: number }
  fill: string
  mapScale: number
  sizeMultiplier: number
}) {
  const markerSize = (44 * sizeMultiplier) / mapScale
  const markerX = point.x - markerSize / 2
  const markerY = point.y - markerSize * (22 / 24)

  return (
    <g>
      <LocationPin
        x={markerX}
        y={markerY + 1.5 / mapScale}
        size={markerSize}
        fill="#05080d"
        opacity={0.38}
      />
      <g className="group pointer-events-auto cursor-pointer">
        <g className="origin-center transition-transform duration-200 ease-out [transform-box:fill-box] group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <LocationPin
            x={markerX}
            y={markerY}
            size={markerSize}
            fill={fill}
            className="transition-[stroke,stroke-width] duration-200 group-hover:stroke-white group-hover:[stroke-width:1.35px] motion-reduce:transition-none"
          />
        </g>
      </g>
    </g>
  )
}

function MapAvatarMarker({
  point,
  mapScale,
  sizeMultiplier,
  outlineFilterId = "map-avatar-outline",
}: {
  point: { x: number; y: number }
  mapScale: number
  sizeMultiplier: number
  outlineFilterId?: string
}) {
  // Keep the source image large inside the SVG, then compensate for the map
  // zoom on its wrapper. This prevents a small raster image from being
  // enlarged by the map transform on nearby mobile views.
  const avatarSize = 72 * sizeMultiplier
  const avatarX = point.x - avatarSize / 2
  const avatarY = point.y - avatarSize * (1037 / 1254)
  const avatarTransform = `translate(${point.x} ${point.y}) scale(${1 / mapScale}) translate(${-point.x} ${-point.y})`

  return (
    <g className="group pointer-events-auto cursor-pointer">
      <ellipse
        cx={point.x}
        cy={point.y + 1.5 / mapScale}
        rx={10 / mapScale}
        ry={4 / mapScale}
        fill="#05080d"
        opacity={0.42}
      />
      <g transform={avatarTransform}>
        <g className="origin-center transition-transform duration-200 ease-out [transform-box:fill-box] group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
          <image
            href="/images/map-avatar-jie.png"
            x={avatarX}
            y={avatarY}
            width={avatarSize}
            height={avatarSize}
            preserveAspectRatio="xMidYMid meet"
            filter={`url(#${outlineFilterId})`}
            className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none"
            aria-hidden="true"
          />
          <image
            href="/images/map-avatar-jie.png"
            x={avatarX}
            y={avatarY}
            width={avatarSize}
            height={avatarSize}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          />
        </g>
      </g>
    </g>
  )
}

function LocationPin({
  x,
  y,
  size,
  fill,
  opacity,
  className,
}: {
  x: number
  y: number
  size: number
  fill: string
  opacity?: number
  className?: string
}) {
  return (
    <svg
      x={x}
      y={y}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={opacity == null ? "#0b1520" : "none"}
      strokeWidth="0.9"
      paintOrder="stroke"
      opacity={opacity}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.5 3.37 1.41 4.84.95 1.54 2.2 2.86 3.16 4.4.47.75.81 1.45 1.17 2.26.26.55.47 1.5 1.26 1.5s1-.95 1.25-1.5c.37-.81.7-1.51 1.17-2.26.96-1.53 2.21-2.85 3.16-4.4C18.5 12.37 19 10.74 19 9c0-3.87-3.13-7-7-7z" />
      {opacity == null ? (
        <circle cx="12" cy="9" r="2.5" fill="#f7f7f6" stroke="none" />
      ) : null}
    </svg>
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

function getMapOverlayPoint(
  point: { x: number; y: number },
  mapView: ReturnType<typeof getMapView>,
  viewport: { width: number; height: number },
) {
  const svgScale = Math.min(
    viewport.width / mapWidth,
    viewport.height / mapHeight,
  )
  const svgOffsetX = (viewport.width - mapWidth * svgScale) / 2
  const svgOffsetY = (viewport.height - mapHeight * svgScale) / 2
  const baseX = svgOffsetX + point.x * svgScale
  const baseY = svgOffsetY + point.y * svgScale
  const translateX = (mapView.translateX / 100) * viewport.width
  const translateY = (mapView.translateY / 100) * viewport.height
  const transformedX =
    viewport.width / 2 +
    (baseX - viewport.width / 2) * mapView.scale +
    translateX
  const transformedY =
    viewport.height / 2 +
    (baseY - viewport.height / 2) * mapView.scale +
    translateY

  return {
    x: (transformedX - svgOffsetX) / svgScale,
    y: (transformedY - svgOffsetY) / svgScale,
  }
}

function getMapView(
  visitorPoint: { x: number; y: number } | null,
  homePoint: { x: number; y: number },
) {
  if (!visitorPoint) {
    return {
      shouldZoom: false,
      scale: 1,
      translateX: 0,
      translateY: 0,
    }
  }

  const deltaX = homePoint.x - visitorPoint.x
  const deltaY = homePoint.y - visitorPoint.y
  const pointDistance = Math.hypot(deltaX, deltaY)
  const isVeryNearby = pointDistance < veryNearbyPointThreshold

  if (pointDistance >= nearbyPointThreshold) {
    return {
      shouldZoom: false,
      scale: 1,
      translateX: 0,
      translateY: 0,
    }
  }

  const midpointX = (visitorPoint.x + homePoint.x) / 2
  const midpointY = (visitorPoint.y + homePoint.y) / 2
  const targetDistance = isVeryNearby
    ? veryNearbyPointTargetDistance
    : nearbyPointTargetDistance
  const maxMapZoom = isVeryNearby ? maxVeryNearbyMapZoom : maxNearbyMapZoom
  const scale = Math.min(
    maxMapZoom,
    targetDistance / Math.max(pointDistance, 1),
  )
  const midpointXPercent = (midpointX / mapWidth) * 100
  const midpointYPercent = (midpointY / mapHeight) * 100

  return {
    shouldZoom: true,
    scale,
    translateX: (50 - midpointXPercent) * scale,
    translateY: (50 - midpointYPercent) * scale,
  }
}

function buildRoutePaths(
  visitorPoint: { x: number; y: number },
  homePoint: { x: number; y: number },
) {
  const pointDistance = Math.hypot(
    homePoint.x - visitorPoint.x,
    homePoint.y - visitorPoint.y,
  )

  return [
    pointDistance < veryNearbyPointThreshold
      ? buildStraightPath(visitorPoint, homePoint)
      : buildCurvePath(visitorPoint, homePoint),
  ]
}

function buildStraightPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
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
