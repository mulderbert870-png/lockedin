import * as zipcodes from 'zipcodes'

export type ZipRecord = {
  zip: string
  city: string
  state: string
  lat: number
  lng: number
}

/**
 * Resolve a 5-digit US ZIP to its geo coordinate via the `zipcodes` npm package
 * (ships the full US ZIP database offline — ~42k entries).
 *
 * Returns null for malformed input or ZIPs that don't exist in the dataset.
 */
export function resolveZip(zip: string | number): ZipRecord | null {
  const clean = String(zip).trim()
  if (!/^\d{5}$/.test(clean)) return null

  const rec = zipcodes.lookup(clean)
  if (!rec || rec.latitude == null || rec.longitude == null) return null

  return {
    zip: rec.zip,
    city: rec.city,
    state: rec.state,
    lat: rec.latitude,
    lng: rec.longitude,
  }
}

/** Haversine distance in miles between two lat/lng pairs. */
export function distanceMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 3958.8
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * Curated list of ZIPs used to seed mock-user clusters across major US metros.
 * Coordinates are NOT stored here — they're resolved through the npm package
 * at runtime, so there's a single source of truth for geo data.
 */
export const SEED_ZIPS: string[] = [
  // New York
  '10001', '10002', '10011', '10025', '11201', '11211', '11215',
  // SF Bay Area
  '94102', '94103', '94110', '94117', '94301', '94704',
  // Los Angeles
  '90001', '90028', '90210', '90291', '90404',
  // Chicago
  '60601', '60614', '60647',
  // Austin
  '78701', '78704', '78745',
  // Seattle
  '98101', '98109', '98115',
  // Boston / Cambridge
  '02108', '02116', '02139',
  // Miami
  '33101', '33139',
  // Denver
  '80202', '80205',
  // Washington DC
  '20001', '20009',
  // Atlanta
  '30303', '30308',
  // Portland
  '97201', '97214',
  // Nashville
  '37203',
  // Phoenix
  '85003',
  // San Diego
  '92101',
]
