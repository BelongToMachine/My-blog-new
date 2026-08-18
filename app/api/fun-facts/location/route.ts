import {
  GUANGZHOU_LOCATION,
  MOCK_VISITOR_NYC,
  getDevGeoPreset,
  haversineKm,
  type DistanceCardLocationResponse,
} from "@/app/lib/funFactsGeo"

export const dynamic = "force-dynamic"
export const revalidate = 0

const isDevMode =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_DEV_MODE === "dev"

export function GET(request: Request) {
  const vercelVisitor = {
    city: decodeHeaderValue(request.headers.get("x-vercel-ip-city")),
    country: request.headers.get("x-vercel-ip-country"),
    countryRegion: decodeHeaderValue(
      request.headers.get("x-vercel-ip-country-region"),
    ),
    latitude: parseCoordinate(request.headers.get("x-vercel-ip-latitude")),
    longitude: parseCoordinate(request.headers.get("x-vercel-ip-longitude")),
    timezone: request.headers.get("x-vercel-ip-timezone"),
  }

  const vercelHasCoordinates =
    vercelVisitor.latitude !== null && vercelVisitor.longitude !== null
  const requestedMock = isDevMode
    ? getDevGeoPreset(new URL(request.url).searchParams.get("mock"))
    : null
  const fallbackMock = !vercelHasCoordinates && isDevMode
    ? MOCK_VISITOR_NYC
    : null
  const visitor = requestedMock ?? fallbackMock ?? vercelVisitor
  const source = requestedMock || fallbackMock ? "mock" : "vercel-ip"
  const latitude = visitor.latitude
  const longitude = visitor.longitude
  const hasCoordinates = latitude != null && longitude != null
  let distanceKm: number | null = null

  if (hasCoordinates) {
    distanceKm = haversineKm(
      latitude,
      longitude,
      GUANGZHOU_LOCATION.latitude,
      GUANGZHOU_LOCATION.longitude,
    )
  }

  const response: DistanceCardLocationResponse = {
    status: hasCoordinates ? "ok" : "unavailable",
    source,
    visitor,
    home: GUANGZHOU_LOCATION,
    distanceKm,
  }

  return Response.json(response, {
    headers: {
      "Cache-Control":
        source === "mock"
          ? "no-store"
          : "private, max-age=300, stale-while-revalidate=600",
    },
  })
}

function parseCoordinate(value: string | null) {
  if (!value) {
    return null
  }

  const coordinate = Number.parseFloat(value)
  return Number.isFinite(coordinate) ? coordinate : null
}

function decodeHeaderValue(value: string | null) {
  if (!value) {
    return null
  }

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
