import { chromium } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  // Cafe website + menu page
  for (const page of [
    { name: "cafe-website", path: "/cafe-maz/cafe" },
    { name: "cafe-menu", path: "/cafe-maz/menu" },
  ]) {
    const p = await context.newPage()
    await p.goto(`http://localhost:2892${page.path}`, { waitUntil: "networkidle", timeout: 30000 })
    await p.waitForTimeout(1500)
    await p.screenshot({ path: path.join(outDir, `${page.name}.png`), fullPage: page.name === "cafe-website" })
    console.log(`✓ ${page.name}`)
    await p.close()
  }

  // Print PDF
  const p2 = await context.newPage()
  await p2.goto(`http://localhost:2892/cafe-maz/menu`, { waitUntil: "networkidle", timeout: 30000 })
  await p2.waitForTimeout(1500)
  await p2.emulateMedia({ media: "print" })
  const pdfPath = path.join(outDir, "cafe-menu-print.pdf")
  await p2.pdf({
    path: pdfPath,
    width: "5.5in",
    height: "8.5in",
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    printBackground: true,
  })
  console.log(`✓ print PDF: ${pdfPath}`)
  await p2.close()

  await browser.close()
}

run().catch(console.error)
