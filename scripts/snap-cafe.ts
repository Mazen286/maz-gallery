import { chromium } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  const p = await ctx.newPage()
  await p.goto(`http://localhost:2892/cafe-maz/cafe`, { waitUntil: "networkidle" })
  await p.waitForTimeout(2500)
  await p.locator(':text("Now playing")').first().scrollIntoViewIfNeeded()
  await p.waitForTimeout(1500)
  await p.screenshot({ path: path.join(outDir, "cafe-spotify-real.png"), fullPage: false })

  await p.close()
  await browser.close()
}

run().catch(console.error)
