import { SITE_URL } from "./constants"

// Open Graph images render with satori on the Worker at request time.
// Fonts are vendored under public/fonts (WOFF, which satori's parser
// accepts) and fetched from our own assets; each isolate keeps them after
// the first render. In next dev the origin is the local server.
export const OG_BASE = process.env.NODE_ENV === "development" ? "http://localhost:2892" : SITE_URL

const cache = new Map<string, Promise<ArrayBuffer>>()

export function ogFont(file: string): Promise<ArrayBuffer> {
  let p = cache.get(file)
  if (!p) {
    p = fetch(`${OG_BASE}/fonts/${file}`).then((r) => {
      if (!r.ok) throw new Error(`font ${file}: ${r.status}`)
      return r.arrayBuffer()
    })
    p.catch(() => cache.delete(file))
    cache.set(file, p)
  }
  return p
}
