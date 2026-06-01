// Generate 640x640 Spotify playlist cover art for the Cafe Maz moods.
// One shared visual template, only the mood title + Arabic word change.
// Output: PNGs written to ~/Downloads/cafe-maz-playlist-{slug}.png

import { chromium } from "playwright"
import path from "path"
import os from "os"

type Cover = {
  slug: string
  eyebrow: string
  title: string
  arabic: string
}

const COVERS: Cover[] = [
  { slug: "tarab", eyebrow: "Café Maz", title: "Tarab", arabic: "طرب" },
  { slug: "late-night", eyebrow: "Café Maz", title: "Late Night", arabic: "الليل" },
  { slug: "afternoon", eyebrow: "Café Maz", title: "Afternoon", arabic: "العصر" },
  { slug: "morning-coffee", eyebrow: "Café Maz", title: "Morning Coffee", arabic: "الصباح" },
  { slug: "friday-sahra", eyebrow: "Café Maz", title: "Friday Sahra", arabic: "السهرة" },
  { slug: "aghani", eyebrow: "Café Maz", title: "Aghani", arabic: "أغاني" },
]

function html({ eyebrow, title, arabic }: Cover): string {
  return /* html */ `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Amiri:wght@400;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
<style>
  html, body { margin: 0; padding: 0; }
  body {
    width: 640px; height: 640px;
    background: #14100b;
    background-image:
      radial-gradient(ellipse 60% 40% at 50% 15%, rgba(224, 189, 124, 0.20), transparent 65%),
      radial-gradient(ellipse 80% 60% at 50% 105%, rgba(74, 20, 24, 0.42), transparent 65%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    color: #efe3c7;
  }
  /* brass corner brackets — same shape as the cafe index card */
  .corner {
    position: absolute;
    width: 36px; height: 36px;
    border: 1.5px solid #c9a667;
  }
  .corner.tl { top: 28px; left: 28px; border-right: none; border-bottom: none; }
  .corner.tr { top: 28px; right: 28px; border-left: none; border-bottom: none; }
  .corner.bl { bottom: 28px; left: 28px; border-right: none; border-top: none; }
  .corner.br { bottom: 28px; right: 28px; border-left: none; border-top: none; }

  .stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 40px;
  }
  .eyebrow {
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    letter-spacing: 0.34em;
    color: #c9a667;
    text-transform: uppercase;
    margin: 0 0 28px;
  }
  .title {
    font-family: "Cinzel", serif;
    font-weight: 700;
    font-size: 64px;
    letter-spacing: 0.06em;
    color: #f5ecd3;
    line-height: 1.05;
    text-transform: uppercase;
    margin: 0;
  }
  .ornament {
    display: flex; align-items: center; justify-content: center;
    gap: 16px;
    margin: 36px 0;
  }
  .ornament .line { width: 70px; height: 1px; background: #c9a667; opacity: 0.6; }
  .ornament .diamond {
    width: 12px; height: 12px;
    background: #c9a667;
    transform: rotate(45deg);
  }
  .arabic {
    font-family: "Amiri", serif;
    font-weight: 700;
    font-size: 56px;
    color: #e0bd7c;
    line-height: 1;
    margin: 0;
  }
</style>
</head>
<body>
  <span class="corner tl"></span>
  <span class="corner tr"></span>
  <span class="corner bl"></span>
  <span class="corner br"></span>
  <div class="stack">
    <div class="eyebrow">${eyebrow}</div>
    <h1 class="title">${title}</h1>
    <div class="ornament">
      <span class="line"></span>
      <span class="diamond"></span>
      <span class="line"></span>
    </div>
    <div class="arabic" lang="ar" dir="rtl">${arabic}</div>
  </div>
</body>
</html>`
}

async function run() {
  // Write to two places: ~/Downloads (for uploading to Spotify) and
  // public/cafe-maz/playlist-covers (committed reference copy in the repo).
  const downloadsDir = path.join(os.homedir(), "Downloads")
  const repoDir = path.join(process.cwd(), "public", "cafe-maz", "playlist-covers")
  const fs = await import("fs")
  fs.mkdirSync(repoDir, { recursive: true })

  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: { width: 640, height: 640 },
    deviceScaleFactor: 2, // export at 1280x1280 for crispness
  })

  for (const cover of COVERS) {
    const page = await ctx.newPage()
    await page.setContent(html(cover), { waitUntil: "networkidle" })
    await page.waitForTimeout(800) // let webfonts finish
    const filename = `cafe-maz-playlist-${cover.slug}.png`
    const downloadOut = path.join(downloadsDir, filename)
    const repoOut = path.join(repoDir, filename)
    await page.screenshot({
      path: downloadOut,
      type: "png",
      clip: { x: 0, y: 0, width: 640, height: 640 },
    })
    fs.copyFileSync(downloadOut, repoOut)
    console.log(`✓ ${filename}`)
    console.log(`  → ${downloadOut}`)
    console.log(`  → ${repoOut}`)
    await page.close()
  }

  await browser.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
