import { GALLERY, type GalleryImage } from "./gallery"

// Postcard No. 1 launched on this local date
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

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`
}

export interface DailyPuzzle {
  number: number
  key: string
  image: GalleryImage
  options: string[]
}

export function getDailyPuzzle(now = new Date()): DailyPuzzle {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const [ly, lm, ld] = DAILY_LAUNCH.split("-").map(Number)
  const launch = new Date(ly, lm - 1, ld)
  const dayIndex = Math.max(0, Math.round((today.getTime() - launch.getTime()) / 86400000))

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
    rng
  ).slice(0, 5)
  const options = seededShuffle([image.location as string, ...wrong], rng)

  return { number: dayIndex + 1, key: dateKey(today), image, options }
}
