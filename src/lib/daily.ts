import { GALLERY, type GalleryImage } from "./gallery"

// Postcard No. 1 launched on this date. Days are counted in UTC so every
// visitor in the world is on the same postcard number at the same time and
// shared result grids line up.
export const DAILY_LAUNCH = "2026-06-12"

// Small deterministic RNG so every visitor gets the same puzzle each day
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const DAY_MS = 86400000

function utcDayNumber(d: Date): number {
  return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / DAY_MS)
}

const [ly, lm, ld] = DAILY_LAUNCH.split("-").map(Number)
const LAUNCH_DAY = Math.floor(Date.UTC(ly, lm - 1, ld) / DAY_MS)

export function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// Milliseconds until the next postcard (UTC midnight)
export function msUntilNextPostcard(now = new Date()): number {
  const nextMidnight = (utcDayNumber(now) + 1) * DAY_MS
  return nextMidnight - now.getTime()
}

export interface DailyPuzzle {
  number: number
  key: string
  image: GalleryImage
  options: string[]
}

export function getDailyPuzzle(now = new Date()): DailyPuzzle {
  return puzzleForDayIndex(Math.max(0, utcDayNumber(now) - LAUNCH_DAY))
}

export function getYesterdayPuzzle(now = new Date()): DailyPuzzle | null {
  const idx = utcDayNumber(now) - LAUNCH_DAY - 1
  return idx >= 0 ? puzzleForDayIndex(idx) : null
}

function puzzleForDayIndex(dayIndex: number): DailyPuzzle {
  const pool = GALLERY.filter((img) => img.location)
  // A fresh seeded permutation per cycle through the pool, so no photo
  // repeats until every photo has had its day
  const cycle = Math.floor(dayIndex / pool.length)
  const perm = seededShuffle(pool, mulberry32(cycle * 7919 + 101))
  const image = perm[dayIndex % pool.length]

  const rng = mulberry32(dayIndex + 424242)
  const locations = [...new Set(pool.map((img) => img.location as string))]
  const wrong = seededShuffle(
    locations.filter((l) => l !== image.location),
    rng,
  ).slice(0, 5)
  const options = seededShuffle([image.location as string, ...wrong], rng)

  const key = new Date((LAUNCH_DAY + dayIndex) * DAY_MS).toISOString().slice(0, 10)
  return { number: dayIndex + 1, key, image, options }
}
