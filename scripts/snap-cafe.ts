import { chromium, devices } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots")
  fs.mkdirSync(outDir, { recursive: true })
  fs.mkdirSync(path.join(outDir, "mobile"), { recursive: true })

  const browser = await chromium.launch()

  for (const [label, ctx] of [
    ["desktop", await browser.newContext({ viewport: { width: 1440, height: 900 } })],
    ["mobile", await browser.newContext({ ...devices["iPhone 13"] })],
  ] as const) {
    const p = await ctx.newPage()
    await p.goto(`http://localhost:2892/cafe-maz/cafe`, { waitUntil: "networkidle" })
    await p.waitForTimeout(2000)
    await p.locator(':text("Now playing")').first().scrollIntoViewIfNeeded()
    await p.waitForTimeout(1500)
    const out = label === "mobile"
      ? path.join(outDir, "mobile", "cafe-mood-picker.png")
      : path.join(outDir, "cafe-mood-picker.png")
    await p.screenshot({ path: out, fullPage: false })
    console.log(`✓ ${label}`)
    await p.close()
  }

  await browser.close()
}

run().catch(console.error)
