import { chromium, devices } from "playwright"
import path from "path"
import fs from "fs"

async function run() {
  const outDir = path.join(process.cwd(), "screenshots")
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  const blog = await ctx.newPage()
  await blog.goto(`http://localhost:2892/blog`, { waitUntil: "networkidle" })
  await blog.waitForTimeout(1000)
  await blog.screenshot({ path: path.join(outDir, "blog-index-with-cafe-maz.png"), fullPage: false })
  console.log("✓ blog index")
  await blog.close()

  const post = await ctx.newPage()
  await post.goto(`http://localhost:2892/blog/cafe-maz`, { waitUntil: "networkidle" })
  await post.waitForTimeout(1000)
  await post.screenshot({ path: path.join(outDir, "cafe-maz-post-top.png"), fullPage: false })
  await post.evaluate(() => window.scrollBy(0, 700))
  await post.waitForTimeout(400)
  await post.screenshot({ path: path.join(outDir, "cafe-maz-post-body.png"), fullPage: false })
  console.log("✓ post")
  await post.close()

  await browser.close()
}

run().catch(console.error)
