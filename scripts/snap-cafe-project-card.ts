// One-shot screenshot for the Cafe Maz card on the /projects page.
// Captures the top of /cafe-maz/cafe at 1200x675 (the same 16:9 dimensions
// as figment-analytics.png and the other project hero images).
// Output: public/images/projects/cafe-maz.png

import { chromium } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "public", "images", "projects")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: { width: 1200, height: 675 },
    deviceScaleFactor: 2,
  })
  const page = await ctx.newPage()
  await page.goto("http://localhost:2892/cafe-maz/cafe", { waitUntil: "networkidle" })
  await page.waitForTimeout(1500)
  const outPath = path.join(outDir, "cafe-maz.png")
  await page.screenshot({
    path: outPath,
    type: "png",
    clip: { x: 0, y: 0, width: 1200, height: 675 },
  })
  console.log(`✓ ${outPath}`)
  await page.close()
  await browser.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
