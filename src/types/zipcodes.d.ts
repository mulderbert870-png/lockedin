declare module 'zipcodes' {
  export type ZipInfo = {
    zip: string
    latitude: number
    longitude: number
    city: string
    state: string
    country: string
  }

  export function lookup(zip: string | number): ZipInfo | undefined
  export function random(): ZipInfo
  export function lookupByName(city: string, state: string): ZipInfo[]
  export function lookupByState(state: string): ZipInfo[]
  export function distance(zipA: string, zipB: string): number | null
  export function radius(zip: string, miles: number, full?: boolean): string[] | ZipInfo[]
  export const codes: Record<string, ZipInfo>
}
