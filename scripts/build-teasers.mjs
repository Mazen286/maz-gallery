// Generates the 48px-wide JPEG teasers used by the Daily Postcard share
// cards (public/og/teaser/<slug>.jpg). Run after adding photographs:
//   node scripts/build-teasers.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import sharp from "sharp"

const src = readFileSync("src/lib/gallery.ts", "utf8")
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
const entries = [...src.matchAll(/src: "([^"]+)", alt: "([^"]+)"/g)].map((m) => ({ file: m[1], slug: slugify(m[2]) }))
mkdirSync("public/og/teaser", { recursive: true })
let n = 0
for (const { file, slug } of entries) {
  const out = await sharp(`public${file}`).resize({ width: 48 }).jpeg({ quality: 60 }).toBuffer()
  writeFileSync(`public/og/teaser/${slug}.jpg`, out)
  n++
}
console.log(`wrote ${n} teasers`)
