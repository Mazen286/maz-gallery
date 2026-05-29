import { chromium, devices } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots", "mobile")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({
    ...devices["iPhone 13"],
  })

  const p = await context.newPage()
  await p.goto(`http://localhost:2892/cafe-maz/recipes`, { waitUntil: "networkidle", timeout: 30000 })
  await p.waitForTimeout(1200)
  // Scroll to "With Milk" chapter heading
  await p.evaluate(() => {
    const heads = Array.from(document.querySelectorAll("h2"))
    const h = heads.find((x) => x.textContent?.trim() === "With Milk")
    h?.scrollIntoView({ block: "start" })
  })
  await p.waitForTimeout(500)
  await p.screenshot({ path: path.join(outDir, "recipes-milk-matrix-fixed.png"), fullPage: false })

  await p.close()
  await browser.close()
}

run().catch(console.error)
