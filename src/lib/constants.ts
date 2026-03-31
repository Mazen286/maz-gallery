export const SITE_NAME = "MazGallery"
export const SITE_URL = "https://maz.gallery"
export const SITE_DESCRIPTION =
  "Mazen Abugharbieh -- Data & Analytics Professional, Photographer, Collector. Based in San Diego."
export const EMAIL = "mazen@figment-analytics.com"

export const SOCIAL = {
  instagram: "https://instagram.com/mazen2892",
  linkedin: "https://www.linkedin.com/in/mazenabugharbieh/",
} as const

export const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Digital Collection", href: "/digital-collection" },
  { label: "Dashboards", href: "/dashboards" },
  { label: "My Projects", href: "/projects" },
] as const

export const SERVICES = [
  "Data Visualization & Analytics",
  "Strategic Storytelling Workshops",
  "Data-Driven Decision Making",
  "Personalized Analytics Consultation",
] as const

export const PRESS = [
  {
    name: "SD Voyager",
    logo: "/images/press/SDVoyager_Square.png",
    url: "https://sdvoyager.com/interview/rising-stars-meet-mazen-abugharbieh-of-san-diego/",
  },
  {
    name: "ABC 10 News San Diego",
    logo: "/images/press/ABC10News_Square_1.png",
    url: "https://www.10news.com/news/local-news/local-company-surf-up-is-in-the-business-of-renting-surfboards",
  },
  {
    name: "UC San Diego",
    logo: "/images/press/UCSD.jpeg",
    url: "https://today.ucsd.edu/story/surfs-up-in-san-diego-thanks-to-alumni-led-startup",
  },
] as const

export const PROJECTS = [
  {
    title: "Figment Analytics",
    description: "Data analytics & BI consulting for growing businesses.",
    url: "https://figment-analytics.com",
    image: "/images/projects/figment.jpg",
  },
  {
    title: "SurfUp",
    description: "Automated surfboard rentals with SurfPod stations.",
    url: "https://surfupapp.com",
    image: "/images/projects/surfup.jpg",
  },
  {
    title: "Runes & Reagents",
    description: "An alchemy-themed card game.",
    url: "https://runesandreagents.netlify.app",
    image: "/images/projects/runes.jpg",
  },
] as const
