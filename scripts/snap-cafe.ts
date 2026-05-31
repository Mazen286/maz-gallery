import { chromium, devices } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()

  // Desktop — plates in cafe menu
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  let p = await desktop.newPage()
  await p.goto(`http://localhost:2892/cafe-maz/cafe`, { waitUntil: "networkidle" })
  await p.waitForTimeout(1000)
  await p.locator(':text("Plates")').first().scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  await p.screenshot({ path: path.join(outDir, "cafe-plates.png"), fullPage: false })
  console.log("✓ cafe-plates")
  await p.close()

  // Lab house bowls with copy button
  p = await desktop.newPage()
  await p.goto(`http://localhost:2892/cafe-maz/lab`, { waitUntil: "networkidle" })
  await p.waitForTimeout(1000)
  await p.locator('h2:has-text("House Bowls")').first().scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  await p.screenshot({ path: path.join(outDir, "lab-house-bowls-copy.png"), fullPage: false })
  console.log("✓ lab-house-bowls-copy")
  await p.close()

  await browser.close()
}

run().catch(console.error)
