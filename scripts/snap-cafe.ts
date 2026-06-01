import { chromium } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  await p.goto(`http://localhost:2892/blog/cafe-maz`, { waitUntil: "networkidle" })
  await p.waitForTimeout(2500)
  // Scroll past intro to the music section so we can see the picker
  await p.evaluate(() => window.scrollBy(0, 2400))
  await p.waitForTimeout(1000)
  await p.screenshot({ path: path.join(outDir, "blog-cafe-maz-picker.png"), fullPage: false })
  await p.close()
  await browser.close()
}

run().catch(console.error)
