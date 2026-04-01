import type { Metadata } from "next"
import { Inter_Tight } from "next/font/google"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AuroraBackground } from "@/components/shared/aurora-background"
import { FilmGrain } from "@/components/shared/film-grain"
import { CustomCursor } from "@/components/shared/custom-cursor"
import { ParticleField } from "@/components/shared/particle-field"
import { TimeTint } from "@/components/shared/time-tint"
// ScrollColorBackground removed - opaque section backgrounds are more reliable
import { ScrollConstellation } from "@/components/shared/scroll-constellation"
import { CinematicIntro } from "@/components/shared/cinematic-intro"
import { CursorWords } from "@/components/shared/cursor-words"
import { PageTransition } from "@/components/shared/page-transition"
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, NAV_LINKS } from "@/lib/constants"
import "./globals.css"

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Mazen Abugharbieh`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Mazen Abugharbieh`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "Mazen Abugharbieh - Data Analyst, Photographer, San Diego" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Mazen Abugharbieh`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "Mazen Abugharbieh - Data Analyst, Photographer, San Diego" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${interTight.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "MazGallery",
            url: "https://maz.gallery",
            description: "Mazen Abugharbieh. Data analyst, photographer, and startup co-founder based in San Diego.",
            author: { "@type": "Person", name: "Mazen Abugharbieh" },
            potentialAction: {
              "@type": "SearchAction",
              target: "https://maz.gallery/blog?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SiteNavigationElement",
            name: "Main Navigation",
            url: SITE_URL,
            hasPart: NAV_LINKS.map((link) => ({
              "@type": "WebPage",
              name: link.label,
              url: `${SITE_URL}${link.href}`,
            })),
          }) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-teal focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <CinematicIntro />
        <AuroraBackground />
        <ParticleField />
        <CursorWords />
        <FilmGrain />
        <TimeTint />
        <CustomCursor />
        <ScrollConstellation />
        <Navbar />
        <main id="main-content" className="flex-1">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  )
}
