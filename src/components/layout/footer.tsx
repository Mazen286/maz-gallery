import Link from "next/link"
import { Instagram, Linkedin } from "lucide-react"
import { SOCIAL } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-white">MazGallery</p>
            <address className="mt-3 text-sm leading-relaxed not-italic">
              Mazen Abugharbieh<br />
              San Diego, CA
            </address>
            <div className="mt-4 flex gap-4">
              <a href={SOCIAL.instagram} target="_blank" rel="me noopener noreferrer" aria-label="Instagram" className="text-white/50 hover:text-teal">
                <Instagram className="size-5" />
              </a>
              <a href={SOCIAL.linkedin} target="_blank" rel="me noopener noreferrer" aria-label="LinkedIn" className="text-white/50 hover:text-teal">
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-white">Pages</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/gallery" className="hover:text-white">Gallery</Link></li>
              <li><Link href="/projects" className="hover:text-white">Projects</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white">More</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/booking" className="hover:text-white">Get in Touch</Link></li>
              <li><a href="https://figmentanalytics.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Figment Analytics</a></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white">Connect</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={SOCIAL.instagram} target="_blank" rel="me noopener noreferrer" className="hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href={SOCIAL.linkedin} target="_blank" rel="me noopener noreferrer" className="hover:text-white">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} MazGallery. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
