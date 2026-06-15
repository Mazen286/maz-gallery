"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Instagram, Linkedin } from "lucide-react"
import { SOCIAL, ROOMS, EMAIL, FIGMENT_URL } from "@/lib/constants"

export function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith("/cafe-maz")) return null

  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0c11] text-white/60">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold text-white">
              Maz <span className="italic">Gallery</span>
            </p>
            <p className="mt-3 font-display text-sm italic text-white/40">
              Photographs by Mazen Abugharbieh
            </p>
            <address className="mt-2 text-sm not-italic text-white/35">
              San Diego, CA
            </address>
            <div className="mt-5 flex gap-4">
              <a href={SOCIAL.instagram} target="_blank" rel="me noopener noreferrer" aria-label="Instagram" className="text-white/40 transition-colors hover:text-teal">
                <Instagram className="size-5" />
              </a>
              <a href={SOCIAL.linkedin} target="_blank" rel="me noopener noreferrer" aria-label="LinkedIn" className="text-white/40 transition-colors hover:text-teal">
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>

          <nav aria-label="Footer directory">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-teal/70">
              Directory
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {ROOMS.map((room) => (
                <li key={room.href}>
                  <Link href={room.href} className="group flex items-baseline gap-3 transition-colors hover:text-white">
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/25 transition-colors group-hover:text-teal/70">
                      {room.number}
                    </span>
                    {room.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-teal/70">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={`mailto:${EMAIL}`} className="transition-colors hover:text-white">
                  {EMAIL}
                </a>
              </li>
              <li>
                <a href={FIGMENT_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  Figment Analytics
                </a>
              </li>
              <li>
                <a href={SOCIAL.instagram} target="_blank" rel="me noopener noreferrer" className="transition-colors hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href={SOCIAL.linkedin} target="_blank" rel="me noopener noreferrer" className="transition-colors hover:text-white">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 border-t border-white/[0.06] pt-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">
            Open whenever &middot; Free admission
          </p>
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Maz Gallery. Touching the art is encouraged.
          </p>
        </div>
      </div>
    </footer>
  )
}
