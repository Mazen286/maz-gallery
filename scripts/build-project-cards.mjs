// Background art for each project's link preview card
// (public/og/projects/<slug>.jpg, 1200x630). The card itself is drawn at
// build by src/app/projects/[slug]/card/route.tsx. Run after changing a
// project's hero picture:
//   node scripts/build-project-cards.mjs
import { readFileSync, mkdirSync } from "node:fs"
import sharp from "sharp"

const src = readFileSync("src/lib/project-pages.ts", "utf8")
// each page's slug, then the first `hero: { src: ... }` after it
const pages = [...src.matchAll(/slug: "([^"]+)",[\s\S]*?hero: \{\s*src: `\$\{IMG\}([^`]+)`/g)].map((m) => ({ slug: m[1], file: `public/images/projects${m[2]}` }))
mkdirSync("public/og/projects", { recursive: true })
for (const { slug, file } of pages) {
  await sharp(file).resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 72, mozjpeg: true }).toFile(`public/og/projects/${slug}.jpg`)
  console.log(slug, file)
}
console.log(`wrote ${pages.length} cards`)
