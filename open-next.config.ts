import { defineCloudflareConfig } from "@opennextjs/cloudflare"
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache"

// Prerendered pages and images are copied into Workers Assets at build and
// served from there, so a request for a static route never renders in the
// Worker. Read-only by design: this site has no on-demand revalidation.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
})
