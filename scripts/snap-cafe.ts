import { chromium, devices } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots", "mobile")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({ ...devices["iPhone 13"] })

  // Cafe website headers (Menu, Hookah)
  let p = await context.newPage()
  await p.goto(`http://localhost:2892/cafe-maz/cafe`, { waitUntil: "networkidle" })
  await p.waitForTimeout(1000)
  await p.locator('h2:has-text("The Menu")').first().scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  await p.screenshot({ path: path.join(outDir, "cafe-section-menu.png"), fullPage: false })
  await p.locator('h2:has-text("The Hookah")').first().scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  await p.screenshot({ path: path.join(outDir, "cafe-section-hookah.png"), fullPage: false })
  await p.close()

  // Lab section headers
  p = await context.newPage()
  await p.goto(`http://localhost:2892/cafe-maz/lab`, { waitUntil: "networkidle" })
  await p.waitForTimeout(1000)
  await p.locator('h2:has-text("Filter")').first().scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  await p.screenshot({ path: path.join(outDir, "lab-section-filter.png"), fullPage: false })
  await p.close()

  await browser.close()
}

run().catch(console.error)
