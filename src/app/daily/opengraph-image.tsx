import { ImageResponse } from "next/og"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { getDailyPuzzle } from "@/lib/daily"
import { SITE_URL } from "@/lib/constants"

export const alt = "The Daily Postcard: guess where today's photograph was taken"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// A new card every UTC day; never prerendered (fonts and the photo are fetched at request time)
export const dynamic = "force-dynamic"

// Assets come from our own origin; in next dev that is the local server
const BASE = process.env.NODE_ENV === "development" ? "http://localhost:2892" : SITE_URL

// Fonts are vendored under /fonts and fetched from our own assets; each
// isolate keeps them after the first render.
const fontCache = new Map<string, Promise<ArrayBuffer>>()
function font(file: string): Promise<ArrayBuffer> {
  let p = fontCache.get(file)
  if (!p) {
    p = fetch(`${BASE}/fonts/${file}`).then((r) => {
      if (!r.ok) throw new Error(`font ${file}: ${r.status}`)
      return r.arrayBuffer()
    })
    fontCache.set(file, p)
  }
  return p
}

// A 48px-wide version of the photo, stretched to the card, is a blur that
// teases the picture without giving the place away. The IMAGES binding
// produces it in production; local dev falls back to the image route.
async function teaser(src: string): Promise<string> {
  let bytes: ArrayBuffer | null = null
  try {
    const { env } = getCloudflareContext()
    const e = env as unknown as {
      ASSETS?: { fetch: (r: Request) => Promise<Response> }
      IMAGES?: {
        input: (s: ReadableStream) => { transform: (o: { width: number }) => { output: (o: { format: string; quality?: number }) => Promise<{ response: () => Response }> } }
      }
    }
    if (e.ASSETS && e.IMAGES) {
      const original = await e.ASSETS.fetch(new Request(`${SITE_URL}${src}`))
      if (original.ok && original.body) {
        const out = await e.IMAGES.input(original.body).transform({ width: 48 }).output({ format: "image/jpeg", quality: 60 })
        bytes = await out.response().arrayBuffer()
      }
    }
  } catch {
    bytes = null
  }
  if (!bytes) {
    const r = await fetch(`${BASE}/_next/image?url=${encodeURIComponent(src)}&w=48&q=75`, {
      headers: { Accept: "image/jpeg,image/*" },
    })
    if (r.ok) bytes = await r.arrayBuffer()
  }
  if (!bytes) return ""
  const b64 = btoa(String.fromCharCode(...new Uint8Array(bytes)))
  return `data:image/jpeg;base64,${b64}`
}

export default async function Image() {
  const puzzle = getDailyPuzzle()
  const [display, mono, img] = await Promise.all([
    font("Fraunces-SemiBoldItalic.woff"),
    font("JetBrainsMono-Medium.woff"),
    teaser(puzzle.image.src),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0c11",
          position: "relative",
          fontFamily: "Fraunces",
        }}
      >
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover", opacity: 0.55 }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(10,12,17,0.2) 0%, rgba(10,12,17,0.55) 55%, rgba(10,12,17,0.95) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 72,
            right: 72,
            bottom: 64,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 20, letterSpacing: 8, color: "#78c8d6" }}>
            {`THE DAILY POSTCARD · NO. ${puzzle.number}`}
          </div>
          <div style={{ fontSize: 84, lineHeight: 1.02, color: "#ffffff" }}>Where was this taken?</div>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 20, letterSpacing: 4, color: "rgba(255,255,255,0.55)" }}>
            ONE PHOTO · THREE TRIES · MAZ.GALLERY/DAILY
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: display, style: "italic", weight: 600 },
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  )
}
