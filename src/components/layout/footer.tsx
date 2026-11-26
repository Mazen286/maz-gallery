"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SOCIAL, ROOMS, EMAIL, FIGMENT_URL, roomSubtitle } from "@/lib/constants"

export function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith("/cafe-maz")) return null

  return (
    <footer className="bg-wall text-mist">
      <div className="mx-auto max-w-[1312px] border-t border-wall-line px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1.2fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold text-ivory">
              Maz <span className="font-normal italic">Gallery</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              Photographs and projects by Mazen Abugharbieh.
            </p>
            <address className="mt-1 text-sm not-italic">San Diego, CA</address>
          </div>

          <nav aria-label="Footer directory">
            <p className="label text-brass">Directory</p>
            <ul className="mt-5 space-y-1">
              {ROOMS.map((room) => (
                <li key={room.href}>
                  <Link href={room.href} className="group flex items-baseline gap-3 py-1 text-sm transition-colors hover:text-ivory">
                    <span>
                      {room.label}
                      {roomSubtitle(room) && <span className="ml-2 text-mist-2">{roomSubtitle(room)}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label text-brass">Elsewhere</p>
            <ul className="mt-5 space-y-1 text-sm">
              <li>
                <a href={`mailto:${EMAIL}`} className="inline-block py-1 transition-colors hover:text-ivory">
                  {EMAIL}
                </a>
              </li>
              <li>
                <a href={FIGMENT_URL} target="_blank" rel="noopener noreferrer" className="inline-block py-1 transition-colors hover:text-ivory">
                  Figment Analytics
                </a>
              </li>
              <li>
                <a href={SOCIAL.instagram} target="_blank" rel="me noopener noreferrer" className="inline-block py-1 transition-colors hover:text-ivory">
                  Instagram
                </a>
              </li>
              <li>
                <a href={SOCIAL.linkedin} target="_blank" rel="me noopener noreferrer" className="inline-block py-1 transition-colors hover:text-ivory">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-wall-line pt-8 text-[13px] text-mist-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Open whenever &middot; Free admission</p>
          <p>&copy; {new Date().getFullYear()} Maz Gallery. Touching the art is encouraged.</p>
        </div>
      </div>
    </footer>
  )
}
