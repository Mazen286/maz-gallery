"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { NAV_LINKS, ROOMS, EMAIL, SOCIAL, roomSubtitle } from "@/lib/constants"

// The header takes the tone of the room it is in. A dark room marks itself
// data-tone="dark" and the .site-nav colours in globals.css follow through
// :has(), so the first paint is already right (the 404 included) and no
// route list has to be kept here. At the top of a page the bar is clear; once
// the page scrolls it gets a solid backing in the same tone.
export function Navbar() {
  const pathname = usePathname()
  // The directory remembers which path it was opened on, so navigating
  // anywhere closes it without an effect
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn !== null && openOn === pathname
  const setOpen = (next: boolean) => setOpenOn(next ? pathname : null)
  const [scrolled, setScrolled] = useState(false)
  const hideChrome = pathname?.startsWith("/cafe-maz") ?? false

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    const raf = requestAnimationFrame(onScroll)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  // Lock page scroll while the directory is open; Escape closes it
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOn(null)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  if (hideChrome) return null

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href))

  return (
    <header className="site-nav fixed top-0 z-50 w-full" data-solid={scrolled && !open ? "" : undefined}>
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-[1312px] items-center justify-between px-5 sm:px-8 lg:h-[76px] lg:px-12">
        <Link href="/" className="nav-fg font-display text-[19px] font-semibold tracking-tight lg:text-[21px]">
          Maz <span className="font-normal italic">Gallery</span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className="nav-link text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/booking" className="nav-cta btn btn-line hidden md:inline-flex">
          Say hello
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className={`relative z-[70] -mr-2 flex size-11 items-center justify-center rounded-full md:hidden ${open ? "text-ivory" : "nav-fg"}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Full-screen museum directory */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-wall md:hidden"
          style={{ animation: "menuVeilIn 0.3s ease-out both" }}
        >
          <div className="flex h-16 shrink-0 items-center px-5 sm:px-8">
            <span className="font-display text-[19px] font-semibold text-ivory">
              Maz <span className="font-normal italic">Gallery</span>
            </span>
          </div>

          <nav aria-label="Museum directory" className="flex flex-1 flex-col justify-center px-6 py-6 sm:px-10">
            <p className="label mb-4 text-brass" style={{ animation: "menuItemIn 0.5s ease-out 0.1s both" }}>
              Directory
            </p>
            {ROOMS.map((room, i) => {
              const active = isActive(room.href)
              return (
                <Link
                  key={room.href}
                  href={room.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className="group flex items-baseline gap-4 border-b border-wall-line py-3"
                  style={{ animation: `menuItemIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${0.16 + i * 0.06}s both` }}
                >
                  <span className="w-14 shrink-0 font-display text-sm italic text-brass">{room.number}</span>
                  <span className="flex min-w-0 flex-col">
                    <span className={`font-display text-[26px] leading-tight ${active ? "italic text-brass-2" : "text-ivory"}`}>
                      {room.label}
                    </span>
                    {roomSubtitle(room) && <span className="mt-0.5 text-[13px] text-mist-2">{roomSubtitle(room)}</span>}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="shrink-0 px-6 pb-10 sm:px-10" style={{ animation: "menuItemIn 0.55s ease-out 0.65s both" }}>
            <a href={`mailto:${EMAIL}`} className="text-sm text-mist transition-colors hover:text-ivory">
              {EMAIL}
            </a>
            <div className="mt-3 flex gap-6">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="label py-2 text-mist transition-colors hover:text-ivory">
                Instagram
              </a>
              <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="label py-2 text-mist transition-colors hover:text-ivory">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
