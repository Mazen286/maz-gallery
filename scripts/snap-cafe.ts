import { chromium } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  for (const route of [
    { name: "cafe-website-amiri", path: "/cafe-maz/cafe" },
    { name: "cafe-menu-amiri", path: "/cafe-maz/menu" },
  ]) {
    const p = await context.newPage()
    await p.goto(`http://localhost:2892${route.path}`, { waitUntil: "networkidle", timeout: 30000 })
    await p.waitForTimeout(1500)
    await p.screenshot({ path: path.join(outDir, `${route.name}.png`), fullPage: false })
    console.log(`✓ ${route.name}`)
    await p.close()
  }

  // Recipes - hookah chapter
  const p = await context.newPage()
  await p.goto(`http://localhost:2892/cafe-maz/recipes`, { waitUntil: "networkidle", timeout: 30000 })
  await p.waitForTimeout(1500)
  await p.evaluate(() => {
    const heads = Array.from(document.querySelectorAll("h2"))
    const hookahHead = heads.find((h) => h.textContent?.trim() === "The Hookah")
    hookahHead?.scrollIntoView({ block: "start" })
  })
  await p.waitForTimeout(500)
  await p.evaluate(() => window.scrollBy(0, 600))
  await p.waitForTimeout(300)
  await p.screenshot({ path: path.join(outDir, "recipes-amiri.png"), fullPage: false })
  console.log("✓ recipes-amiri")
  await p.close()

  await browser.close()
}

run().catch(console.error)
