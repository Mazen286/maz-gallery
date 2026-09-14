export const SITE_NAME = "MazGallery"
export const SITE_URL = "https://maz.gallery"
export const AUTHOR_NAME = "Mazen Abugharbieh"
export const SITE_DESCRIPTION =
  "Mazen Abugharbieh. Data analyst, photographer, and startup co-founder based in San Diego."
export const EMAIL = "mazen@figmentanalytics.com"

export const SOCIAL = {
  instagram: "https://instagram.com/mazen2892",
  linkedin: "https://www.linkedin.com/in/mazenabugharbieh/",
} as const

// The site as a museum: every route is a room with a placard. This is the
// single source for the header nav, the mobile directory, the footer, the
// placards between rooms, and the navigation schema.
//   label: plain wording for the header nav
//   name:  the museum name used on placards and in the directory
//   nav:   whether the room appears in the header nav (the CTA is separate)
export const ROOMS = [
  { href: "/", number: "No. 01", label: "Home", name: "Entrance", nav: false },
  { href: "/about", number: "No. 02", label: "About", name: "The Artist", nav: true },
  { href: "/gallery", number: "No. 03", label: "Gallery", name: "The Gallery", nav: true },
  { href: "/projects", number: "No. 04", label: "Projects", name: "Projects Wing", nav: true },
  // Blog returns to the header nav once it has enough posts to earn the slot
  { href: "/blog", number: "No. 05", label: "Blog", name: "Reading Room", nav: false },
  { href: "/daily", number: "No. 06", label: "Daily", name: "Daily Postcard", nav: true },
  { href: "/annex", number: "No. 07", label: "Annex", name: "The Annex", nav: false },
  { href: "/booking", number: "No. 08", label: "Say Hello", name: "Front Desk", nav: false },
] as const

export type Room = (typeof ROOMS)[number]

export const NAV_LINKS = ROOMS.filter((r) => r.nav)

// The museum name is a subtitle; skip it when it only adds "The" to the label
export const roomSubtitle = (room: Room) => (room.name === `The ${room.label}` ? null : room.name)

export function roomFor(pathname: string): Room | undefined {
  if (pathname === "/") return ROOMS[0]
  return ROOMS.find((r) => r.href !== "/" && pathname.startsWith(r.href))
}

export const FIGMENT_URL = "https://figmentanalytics.com"

export const PRESS = [
  {
    name: "SD Voyager",
    logo: "/images/press/SDVoyager.png",
    url: "https://sdvoyager.com/interview/rising-stars-meet-mazen-abugharbieh-of-san-diego/",
  },
  {
    name: "ABC 10 News San Diego",
    logo: "/images/press/ABC10News_Square_1.png",
    url: "https://www.10news.com/news/local-news/local-company-surf-up-is-in-the-business-of-renting-surfboards",
  },
  {
    name: "UC San Diego",
    logo: "/images/press/UCSD.png",
    url: "https://today.ucsd.edu/story/surfs-up-in-san-diego-thanks-to-alumni-led-startup",
  },
] as const

// Selected works shown on the home page. The full list lives in lib/projects.ts.
export const PROJECTS = [
  {
    title: "Figment Analytics",
    description: "Data analytics & BI consulting for growing businesses.",
    url: "https://figmentanalytics.com",
    image: "/images/projects/figment-analytics.png",
  },
  {
    title: "SurfUp",
    description: "Automated surfboard rentals with SurfPod stations.",
    url: "https://surfupapp.com",
    image: "/images/projects/surfup-banner.png",
  },
  {
    title: "Runes & Reagents",
    description: "An alchemy-themed card game.",
    url: "https://runesandreagents.netlify.app",
    image: "/images/projects/runes-reagents.png",
  },
] as const
