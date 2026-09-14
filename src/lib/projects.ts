// Every project shown in the Projects Wing. The about page derives its
// "projects shipped" count from this list.
export const ALL_PROJECTS = [
  {
    title: "Figment Analytics",
    subtitle: "Data Consultancy",
    description:
      "My data consultancy. We help businesses build dashboards, run workshops, and make better decisions with their data.",
    url: "https://figmentanalytics.com",
    image: "/images/projects/figment-analytics.png",
    cta: "Visit Site",
    tags: ["Tableau", "Power BI", "Data Strategy", "Workshops"],
    accent: "#78c8d6",
  },
  {
    title: "SurfUp",
    subtitle: "Hardware Startup",
    description:
      "The startup I co-founded. Automated surfboard rental stations across San Diego. Featured on ABC 10 News, CBS 8, and the San Diego Union-Tribune.",
    url: "https://surfupapp.com",
    image: "/images/projects/surfup-banner.png",
    cta: "See It Live",
    tags: ["React Native", "TypeScript", "Square", "Maps"],
    accent: "#4ecdc4",
  },
  {
    title: "Café Maz",
    subtitle: "Home Café & Brand System",
    description:
      "A one-table home café for friends who come over. Bilingual brand system with a digital menu, printable menu, and hookah combos named after Palestinian places.",
    url: "/cafe-maz/cafe",
    image: "/images/projects/cafe-maz.png",
    cta: "Step Inside",
    tags: ["Brand System", "Bilingual", "Hospitality"],
    accent: "#c9a667",
  },
  {
    title: "LA 311 Dashboard",
    subtitle: "Civic Data Analytics",
    description:
      "Interactive analytics from 369,000+ City of LA service requests. Time-series analysis, geographic mapping, and resolution tracking.",
    url: "https://figmentanalytics.com/portfolio/la-311",
    image: "/images/projects/la-311.webp",
    cta: "View Project",
    tags: ["Next.js", "Recharts", "Mapbox GL JS"],
    accent: "#f5a623",
  },
  {
    title: "FlightPulse",
    subtitle: "Geospatial Analytics",
    description:
      "Interactive flight tracking that brings aircraft data to life on the map. Temporal filtering, altitude coloring, and individual tracking.",
    url: "https://figmentanalytics.com/portfolio/flightpulse",
    image: "/images/projects/flightpulse.png",
    cta: "View Project",
    tags: ["React", "TypeScript", "Mapbox GL JS"],
    accent: "#5b8def",
  },
  {
    title: "Figment Forge",
    subtitle: "Retail Analytics",
    description:
      "Power BI dashboard tracking $1.18M+ in revenue across 109K+ orders. ML-driven forecasts and customer segmentation.",
    url: "https://figmentanalytics.com/portfolio/figment-forge",
    image: "/images/projects/figment-forge.png",
    cta: "View Project",
    tags: ["Power BI", "Python", "ML", "SQL"],
    accent: "#e06c75",
  },
  {
    title: "Figment Gaming",
    subtitle: "Multi-Game Platform",
    description:
      "Free companion platform for tabletop gamers. 7+ game systems, multiplayer drafting, AI opponents, and deck building.",
    url: "https://figmentgaming.com",
    image: "/images/projects/figment-gaming.png",
    cta: "Play Now",
    tags: ["React 19", "Supabase", "Cloudflare Workers"],
    accent: "#b464ff",
  },
  {
    title: "Runes & Reagents",
    subtitle: "Adventure Game",
    description:
      "Gather elements, combine them to craft powerful items, complete quests, and explore an adventure world.",
    url: "https://runesandreagents.netlify.app",
    image: "/images/projects/runes-reagents.png",
    cta: "Play It",
    tags: ["Game Design", "React", "Crafting"],
    accent: "#c678dd",
  },
]

export type Project = (typeof ALL_PROJECTS)[number]
