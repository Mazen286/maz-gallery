import { chromium, devices } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots")
  fs.mkdirSync(outDir, { recursive: true })
  fs.mkdirSync(path.join(outDir, "mobile"), { recursive: true })

  const browser = await chromium.launch()

  // Desktop
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  for (const route of [
    { name: "cafe-hookah-offmenu", anchor: 'h3:has-text("Off-Menu")' },
    { name: "cafe-visit-4col", anchor: 'h2:has-text("Come Over")' },
  ]) {
    const p = await desktop.newPage()
    await p.goto(`http://localhost:2892/cafe-maz/cafe`, { waitUntil: "networkidle" })
    await p.waitForTimeout(1000)
    await p.locator(route.anchor).first().scrollIntoViewIfNeeded()
    await p.waitForTimeout(400)
    await p.screenshot({ path: path.join(outDir, `${route.name}.png`), fullPage: false })
    console.log(`✓ desktop ${route.name}`)
    await p.close()
  }

  // Mobile
  const mobile = await browser.newContext({ ...devices["iPhone 13"] })
  for (const route of [
    { name: "cafe-hookah-offmenu-mobile", anchor: 'h3:has-text("Off-Menu")' },
    { name: "cafe-visit-mobile", anchor: 'h2:has-text("Come Over")' },
  ]) {
    const p = await mobile.newPage()
    await p.goto(`http://localhost:2892/cafe-maz/cafe`, { waitUntil: "networkidle" })
    await p.waitForTimeout(1000)
    await p.locator(route.anchor).first().scrollIntoViewIfNeeded()
    await p.waitForTimeout(400)
    await p.screenshot({ path: path.join(outDir, "mobile", `${route.name}.png`), fullPage: false })
    console.log(`✓ mobile ${route.name}`)
    await p.close()
  }

  await browser.close()
}

run().catch(console.error)
