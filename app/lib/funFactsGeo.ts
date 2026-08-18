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

export const DEV_GEO_PRESETS = [
  {
    id: "new-york",
    labelKey: "devLocations.newYork",
    ...MOCK_VISITOR_NYC,
  },
  {
    id: "london",
    labelKey: "devLocations.london",
    city: "London",
    country: "GB",
    countryRegion: "England",
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: "Europe/London",
  },
  {
    id: "tokyo",
    labelKey: "devLocations.tokyo",
    city: "Tokyo",
    country: "JP",
    countryRegion: "Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
  },
  {
    id: "beijing",
    labelKey: "devLocations.beijing",
    city: "Beijing",
    country: "CN",
    countryRegion: "Beijing",
    latitude: 39.9042,
    longitude: 116.4074,
    timezone: "Asia/Shanghai",
  },
  {
    id: "sydney",
    labelKey: "devLocations.sydney",
    city: "Sydney",
    country: "AU",
    countryRegion: "New South Wales",
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: "Australia/Sydney",
  },
  {
    id: "singapore",
    labelKey: "devLocations.singapore",
    city: "Singapore",
    country: "SG",
    countryRegion: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: "Asia/Singapore",
  },
  {
    id: "guangzhou",
    labelKey: "devLocations.guangzhou",
    city: "Guangzhou",
    country: "CN",
    countryRegion: "Guangdong",
    latitude: GUANGZHOU_LOCATION.latitude,
    longitude: GUANGZHOU_LOCATION.longitude,
    timezone: "Asia/Shanghai",
  },
] as const

export type DevGeoPresetId = (typeof DEV_GEO_PRESETS)[number]["id"]

export function getDevGeoPreset(id: string | null) {
  if (!id) {
    return null
  }

  return DEV_GEO_PRESETS.find((preset) => preset.id === id) ?? null
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
