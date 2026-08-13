export const GUANGZHOU_LOCATION = {
  city: "Guangzhou",
  country: "CN",
  latitude: 23.1291,
  longitude: 113.2644,
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
  source: "vercel-ip" | "mock"
  visitor: ApproximateGeoPoint
  home: typeof GUANGZHOU_LOCATION
  distanceKm: number | null
}

export const MOCK_VISITOR_NYC: ApproximateGeoPoint = {
  city: "New York",
  country: "US",
  countryRegion: "New York",
  latitude: 40.7128,
  longitude: -74.006,
  timezone: "America/New_York",
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
