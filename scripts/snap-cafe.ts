import { chromium, devices } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots", "mobile")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({ ...devices["iPhone 13"] })

  for (const route of [
    { name: "recipes-cover-fixed", path: "/cafe-maz/recipes" },
    { name: "cafe-nav-fixed", path: "/cafe-maz/cafe" },
  ]) {
    const p = await context.newPage()
    await p.goto(`http://localhost:2892${route.path}`, { waitUntil: "networkidle", timeout: 30000 })
    await p.waitForTimeout(1200)
    await p.screenshot({ path: path.join(outDir, `${route.name}.png`), fullPage: false })
    console.log(`✓ ${route.name}`)
    await p.close()
  }

  await browser.close()
}

run().catch(console.error)
