import {
  HANGZHOU_LOCATION,
  MOCK_VISITOR_NYC,
  haversineKm,
  type DistanceCardLocationResponse,
} from "@/app/lib/funFactsGeo"

export const dynamic = "force-dynamic"
export const revalidate = 0

const isDevMode =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_DEV_MODE === "dev"

export function GET(request: Request) {
  const visitor = {
    city: decodeHeaderValue(request.headers.get("x-vercel-ip-city")),
    country: request.headers.get("x-vercel-ip-country"),
    countryRegion: decodeHeaderValue(
      request.headers.get("x-vercel-ip-country-region"),
    ),
    latitude: parseCoordinate(request.headers.get("x-vercel-ip-latitude")),
    longitude: parseCoordinate(request.headers.get("x-vercel-ip-longitude")),
    timezone: request.headers.get("x-vercel-ip-timezone"),
  }

  const latitude = visitor.latitude
  const longitude = visitor.longitude
  const hasCoordinates = latitude !== null && longitude !== null
  let distanceKm: number | null = null

  if (hasCoordinates) {
    distanceKm = haversineKm(
      latitude,
      longitude,
      HANGZHOU_LOCATION.latitude,
      HANGZHOU_LOCATION.longitude,
    )
  }

  if (!hasCoordinates && isDevMode) {
    const mockDistanceKm = haversineKm(
      MOCK_VISITOR_NYC.latitude!,
      MOCK_VISITOR_NYC.longitude!,
      HANGZHOU_LOCATION.latitude,
      HANGZHOU_LOCATION.longitude,
    )

    const response: DistanceCardLocationResponse = {
      status: "ok",
      source: "mock",
      visitor: MOCK_VISITOR_NYC,
      home: HANGZHOU_LOCATION,
      distanceKm: mockDistanceKm,
    }

    return Response.json(response, {
      headers: {
        "Cache-Control": "no-store",
      },
    })
  }

  const response: DistanceCardLocationResponse = {
    status: hasCoordinates ? "ok" : "unavailable",
    source: "vercel-ip",
    visitor,
    home: HANGZHOU_LOCATION,
    distanceKm,
  }

  return Response.json(response, {
    headers: {
      "Cache-Control": "private, max-age=300, stale-while-revalidate=600",
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
