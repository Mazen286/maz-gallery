import { ImageResponse } from "next/og"
import { PROJECT_PAGES } from "@/lib/project-pages"
import { projectBySlug } from "@/lib/projects"
import { OG_BASE, ogFont } from "@/lib/og"

// One link preview card per project, prerendered at build like the Daily
// Postcard's cards: the Worker never renders it (Workers Free has a 10 ms
// CPU limit, and satori at request time hits it).
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return PROJECT_PAGES.map((p) => ({ slug: p.slug }))
}

// The background art (public/og/projects, made by scripts/build-project-cards.mjs),
// read from disk at build
async function art(slug: string): Promise<string> {
  let bytes: Uint8Array | null = null
  try {
    const { readFile } = await import("node:fs/promises")
    const { join } = await import("node:path")
    bytes = new Uint8Array(await readFile(join(process.cwd(), "public", "og", "projects", `${slug}.jpg`)))
  } catch {
    try {
      const r = await fetch(`${OG_BASE}/og/projects/${slug}.jpg`)
      if (r.ok) bytes = new Uint8Array(await r.arrayBuffer())
    } catch {
      bytes = null
    }
  }
  if (!bytes) return ""
  let bin = ""
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return `data:image/jpeg;base64,${btoa(bin)}`
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = PROJECT_PAGES.find((p) => p.slug === slug)
  const project = projectBySlug(slug)
  if (!page || !project) return new Response("Not found", { status: 404 })

  const [display, bg] = await Promise.all([ogFont("Fraunces-SemiBoldItalic.woff"), art(slug)])

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0d0e11", position: "relative", fontFamily: "Fraunces" }}>
        {bg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: "linear-gradient(180deg, rgba(13,14,17,0.1) 0%, rgba(13,14,17,0.55) 50%, rgba(13,14,17,0.95) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage: "linear-gradient(90deg, rgba(13,14,17,0.75) 0%, rgba(13,14,17,0.2) 60%, rgba(13,14,17,0) 100%)",
          }}
        />
        <div style={{ position: "absolute", left: 72, right: 72, bottom: 60, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#d8bd86", display: "flex" }}>{project.subtitle}</div>
          <div style={{ fontSize: 88, lineHeight: 1.02, color: "#f4f0e8", marginTop: 10, display: "flex" }}>{project.title}</div>
          <div style={{ fontSize: 24, color: "rgba(244,240,232,0.78)", marginTop: 18, display: "flex" }}>
            maz.gallery &middot; Projects Wing
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: [{ name: "Fraunces", data: display, style: "italic", weight: 600 }] },
  )
}
