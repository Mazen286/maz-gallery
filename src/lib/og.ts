import { SITE_URL } from "./constants"

// Open Graph images render with satori. They are prerendered at build time
// (in Node, where the vendored WOFF fonts under public/fonts are read from
// disk) and served from the assets cache, so the Worker never pays the
// render cost. The fetch path is a fallback for any runtime render.
export const OG_BASE = process.env.NODE_ENV === "development" ? "http://localhost:2892" : SITE_URL

const cache = new Map<string, Promise<ArrayBuffer>>()

async function readFromDisk(file: string): Promise<ArrayBuffer | null> {
  try {
    const { readFile } = await import("node:fs/promises")
    const { join } = await import("node:path")
    const buf = await readFile(join(process.cwd(), "public", "fonts", file))
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer
  } catch {
    return null
  }
}

export function ogFont(file: string): Promise<ArrayBuffer> {
  let p = cache.get(file)
  if (!p) {
    p = readFromDisk(file).then(async (fromDisk) => {
      if (fromDisk) return fromDisk
      const r = await fetch(`${OG_BASE}/fonts/${file}`)
      if (!r.ok) throw new Error(`font ${file}: ${r.status}`)
      return r.arrayBuffer()
    })
    p.catch(() => cache.delete(file))
    cache.set(file, p)
  }
  return p
}
