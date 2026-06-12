"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { NAV_LINKS, ROOMS, EMAIL, SOCIAL } from "@/lib/constants"
import { Magnetic } from "@/components/shared/magnetic"
import { ScrambleWrapper } from "@/components/shared/text-scramble"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"
  const hideChrome = pathname?.startsWith("/cafe-maz") ?? false

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the directory on navigation and lock scroll while it is open
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const solid = !mounted || scrolled || !isHome

  if (hideChrome) return null

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        solid && !open ? "bg-white/95 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className={`font-display text-lg font-semibold tracking-tight transition-colors ${
            solid && !open ? "text-navy" : "text-white"
          }`}
        >
          Maz <span className="italic">Gallery</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link, i) => (
            <Magnetic key={link.href} strength={0.25}>
              <ScrambleWrapper text={link.label}>
                {(display) => (
                  <Link
                    href={link.href}
                    className={`inline-block text-sm font-medium font-mono transition-colors ${
                      solid ? "text-charcoal/70 hover:text-navy" : "text-white/70 hover:text-white"
                    }`}
                  >
                    <span className={`mr-1.5 text-[9px] ${solid ? "text-teal" : "text-teal/80"}`}>
                      0{i + 2}
                    </span>
                    {display}
                  </Link>
                )}
              </ScrambleWrapper>
            </Magnetic>
          ))}
          <Magnetic strength={0.2}>
            <Link
              href="/booking"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                solid ? "bg-navy text-white hover:bg-navy/90" : "bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
              }`}
            >
              Say Hello
            </Link>
          </Magnetic>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`relative z-[70] transition-colors md:hidden ${
            open ? "text-white" : solid ? "text-navy" : "text-white"
          }`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Full-screen museum directory */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col md:hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #1c2030 0%, #0c0e15 55%, #090a0f 100%)",
            animation: "menuVeilIn 0.3s ease-out both",
          }}
        >
          <div className="flex h-16 items-center px-6">
            <span className="font-display text-lg font-semibold text-white">
              Maz <span className="italic">Gallery</span>
            </span>
          </div>

          <nav aria-label="Museum directory" className="flex flex-1 flex-col justify-center px-8">
            <p
              className="mb-6 font-mono text-[10px] uppercase tracking-[0.4em] text-teal/70"
              style={{ animation: "menuItemIn 0.5s ease-out 0.1s both" }}
            >
              Directory
            </p>
            {ROOMS.map((room, i) => {
              const active = room.href === "/" ? pathname === "/" : pathname?.startsWith(room.href)
              return (
                <Link
                  key={room.href}
                  href={room.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline gap-4 border-b border-white/[0.07] py-4"
                  style={{ animation: `menuItemIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${0.16 + i * 0.07}s both` }}
                >
                  <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-teal/60">
                    {room.number}
                  </span>
                  <span
                    className={`font-display text-3xl transition-colors ${
                      active ? "italic text-teal" : "text-white/90 group-hover:text-white"
                    }`}
                  >
                    {room.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div
            className="px-8 pb-10"
            style={{ animation: "menuItemIn 0.55s ease-out 0.65s both" }}
          >
            <a href={`mailto:${EMAIL}`} className="font-mono text-xs text-white/40 transition-colors hover:text-white/70">
              {EMAIL}
            </a>
            <div className="mt-3 flex gap-5">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-teal">
                Instagram
              </a>
              <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-teal">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
