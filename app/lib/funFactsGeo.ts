export const HANGZHOU_LOCATION = {
  city: "Hangzhou",
  country: "CN",
  latitude: 30.2741,
  longitude: 120.1551,
} as const

export interface ApproximateGeoPoint {
  city?: string | null
  country?: string | null
  countryRegion?: string | null
  latitude?: number | null
  longitude?: number | null
  timezone?: string | null
}

export interface DistanceCardLocationResponse {
  status: "ok" | "unavailable"
  source: "vercel-ip"
  visitor: ApproximateGeoPoint
  home: typeof HANGZHOU_LOCATION
  distanceKm: number | null
}

export function haversineKm(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
) {
  const earthRadiusKm = 6371
  const toRadians = (value: number) => (value * Math.PI) / 180

  const latitudeDelta = toRadians(latitudeB - latitudeA)
  const longitudeDelta = toRadians(longitudeB - longitudeA)

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(latitudeA)) *
      Math.cos(toRadians(latitudeB)) *
      Math.sin(longitudeDelta / 2) ** 2

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
