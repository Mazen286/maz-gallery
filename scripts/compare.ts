import { chromium } from "playwright"
import path from "path"
import fs from "fs"

const PAGES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "gallery", path: "/gallery" },
  { name: "dashboards", path: "/dashboards" },
  { name: "digital-collection", path: "/digital-collection" },
  { name: "projects", path: "/my-other-projects" },
  { name: "booking", path: "/booking" },
]

const LOCAL_PAGES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "gallery", path: "/gallery" },
  { name: "dashboards", path: "/dashboards" },
  { name: "digital-collection", path: "/digital-collection" },
  { name: "projects", path: "/projects" },
  { name: "booking", path: "/booking" },
]

async function run() {
  const outDir = path.join(process.cwd(), "screenshots")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  // Screenshot original site
  for (const page of PAGES) {
    const p = await context.newPage()
    try {
      await p.goto(`https://maz.gallery${page.path}`, { waitUntil: "networkidle", timeout: 30000 })
      await p.waitForTimeout(2000)
      await p.screenshot({ path: path.join(outDir, `original-${page.name}.png`), fullPage: true })
      console.log(`✓ Original: ${page.name}`)
    } catch (e) {
      console.log(`✗ Original: ${page.name} - ${e}`)
    }
    await p.close()
  }

  // Screenshot local site
  for (const page of LOCAL_PAGES) {
    const p = await context.newPage()
    try {
      await p.goto(`http://localhost:2892${page.path}`, { waitUntil: "networkidle", timeout: 15000 })
      await p.waitForTimeout(1000)
      await p.screenshot({ path: path.join(outDir, `local-${page.name}.png`), fullPage: true })
      console.log(`✓ Local: ${page.name}`)
    } catch (e) {
      console.log(`✗ Local: ${page.name} - ${e}`)
    }
    await p.close()
  }

  await browser.close()
  console.log(`\nScreenshots saved to ${outDir}`)
}

run()
