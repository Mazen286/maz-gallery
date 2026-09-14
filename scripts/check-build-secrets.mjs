// Fails the deploy if a secret was compiled into the Worker bundle.
// OpenNext inlines every .env* file into .open-next/cloudflare/next-env.mjs;
// secrets belong in `wrangler secret put` (prod) and .dev.vars (local) instead.
import { readFileSync, existsSync } from "node:fs"

const file = ".open-next/cloudflare/next-env.mjs"
const patterns = [/sk-ant-[A-Za-z0-9_-]{20,}/, /ANTHROPIC_API_KEY":"(?!")/]

if (!existsSync(file)) {
  console.error(`check-build-secrets: ${file} not found. Run the OpenNext build first.`)
  process.exit(1)
}

const src = readFileSync(file, "utf8")
const hit = patterns.find((p) => p.test(src))
if (hit) {
  console.error(
    `check-build-secrets: a secret is compiled into ${file}.\n` +
      "Move it out of .env* files: use .dev.vars locally and `wrangler secret put` in production.",
  )
  process.exit(1)
}
console.log("check-build-secrets: ok")
