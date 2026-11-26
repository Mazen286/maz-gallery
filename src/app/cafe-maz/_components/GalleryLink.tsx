"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// A quiet way back to Maz Gallery at the foot of every Café Maz page, in the
// café's own brass and mono. The guest-facing website (/cafe-maz/cafe) already
// signs off with its own maz.gallery link, so it is left out there.
export function GalleryLink() {
  const pathname = usePathname()
  if (pathname === "/cafe-maz/cafe") return null
  return (
    <p className="cafe-gallery-link">
      <Link href="/">✦ Maz Gallery</Link>
    </p>
  )
}
