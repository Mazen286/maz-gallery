export const SITE_NAME = "MazGallery"
export const SITE_URL = "https://maz.gallery"
export const SITE_DESCRIPTION =
  "Mazen Abugharbieh. Data analyst, photographer, and startup co-founder based in San Diego."
export const EMAIL = "mazen@figmentanalytics.com"

export const SOCIAL = {
  instagram: "https://instagram.com/mazen2892",
  linkedin: "https://www.linkedin.com/in/mazenabugharbieh/",
} as const

export const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "My Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
] as const

// The site as a museum: every route is a room with a placard
export const ROOMS = [
  { href: "/", number: "No. 01", name: "Entrance" },
  { href: "/about", number: "No. 02", name: "The Artist" },
  { href: "/gallery", number: "No. 03", name: "The Gallery" },
  { href: "/projects", number: "No. 04", name: "Projects Wing" },
  { href: "/blog", number: "No. 05", name: "Reading Room" },
  { href: "/booking", number: "No. 06", name: "Front Desk" },
] as const

export function roomFor(pathname: string) {
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
    image: "/images/projects/Dashboard-Image.png",
  },
  {
    title: "Runes & Reagents",
    description: "An alchemy-themed card game.",
    url: "https://runesandreagents.netlify.app",
    image: "/images/projects/runes-reagents.png",
  },
] as const
