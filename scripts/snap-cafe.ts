import { chromium, devices } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots", "mobile")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({ ...devices["iPhone 13"] })

  const p = await context.newPage()
  await p.goto(`http://localhost:2892/cafe-maz/recipes`, { waitUntil: "load", timeout: 30000 })
  await p.waitForLoadState("networkidle")
  await p.waitForTimeout(2500)

  // Element-relative screenshot of the first hookah combo card
  const card = await p.locator('h3:has-text("Al-Quds Asr")').first()
  await card.scrollIntoViewIfNeeded()
  await p.waitForTimeout(500)
  const cardWrapper = card.locator("..")
  await cardWrapper.screenshot({ path: path.join(outDir, "recipes-combo-alquds.png") })
  console.log("done")

  await p.close()
  await browser.close()
}

run().catch(console.error)
