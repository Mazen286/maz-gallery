"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { NAV_LINKS } from "@/lib/constants"
import { Magnetic } from "@/components/shared/magnetic"
import { ScrambleWrapper } from "@/components/shared/text-scramble"

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const solid = !mounted || scrolled || open || !isHome

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        solid ? "bg-white/95 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className={`text-lg font-bold tracking-tight transition-colors ${solid ? "text-navy" : "text-navy"}`}>
          MazGallery
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Magnetic key={link.href} strength={0.25}>
              <ScrambleWrapper text={link.label}>
                {(display) => (
                  <Link
                    href={link.href}
                    className={`inline-block text-sm font-medium font-mono transition-colors ${
                      solid ? "text-charcoal/70 hover:text-navy" : "text-charcoal/70 hover:text-navy"
                    }`}
                  >
                    {display}
                  </Link>
                )}
              </ScrambleWrapper>
            </Magnetic>
          ))}
          <Magnetic strength={0.2}>
            <Link
              href="/booking"
              className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
            >
              Book Me
            </Link>
          </Magnetic>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-navy md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-white px-6 pb-6 pt-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-charcoal/70 hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setOpen(false)}
            className="mt-3 inline-block rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white"
          >
            Book Me
          </Link>
        </div>
      )}
    </header>
  )
}
