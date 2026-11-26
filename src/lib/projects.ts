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
    title: "Figment Forever",
    subtitle: "Wedding Studio",
    description:
      "Wedding invitations and websites that make the moment yours. Built for a friend's wedding, with personal invitations, replies and tracking in English and Arabic.",
    url: "/projects/figment-forever",
    image: "/images/projects/figment-forever-v3.webp",
    cta: "Read the Story",
    tags: ["Next.js", "Supabase", "Themes"],
    accent: "#c48a7d",
  },
  {
    title: "SurfUp",
    subtitle: "Hardware Startup",
    description:
      "The startup I co-founded. SurfPods are self-service surfboard rental stations, from San Diego to Waikiki. Featured in Surfer, KHON2, Pacific Business News, and AOL.",
    url: "https://surfupapp.com",
    image: "/images/projects/surfup-beach.png",
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
    url: "https://flightpulse.figmentanalytics.com",
    image: "/images/projects/flightpulse.png",
    cta: "Launch App",
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
    subtitle: "Gaming Platform",
    description:
      "Original browser games plus free companion tools for card and tabletop games. Multiplayer drafting, duels, AI opponents, and deck building.",
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
      "Combine elements into thousands of discoveries, recruit a party of companions, battle legendary bosses and cross into new worlds. Free to play in the browser.",
    url: "https://figmentgaming.com/runes",
    image: "/images/projects/runes-reagents.jpg",
    cta: "Play It",
    tags: ["Game Design", "React", "Crafting"],
    accent: "#c678dd",
  },
  {
    title: "Runes: Brewstorm",
    subtitle: "Match-3 Puzzle Game",
    description:
      "A free match-3 in the browser, set in the world of Runes and Reagents. Match elements into Runes, brew them into Steam and Lava, and rescue the locals from vines, floods and fire. In early access.",
    url: "https://figmentgaming.com/brewstorm",
    image: "/images/projects/runes-brewstorm.webp",
    cta: "Play It",
    tags: ["Game Design", "PixiJS", "React"],
    accent: "#7cb342",
  },
  {
    title: "Ink & Knuckles 2",
    subtitle: "Arcade Fighter",
    description:
      "A free one on one fighting game in the browser, drawn frame by frame. Fighters from every Runes and Reagents chapter, with Arcade, Training and Combo Trials.",
    url: "https://figmentgaming.com/ink-and-knuckles-2",
    image: "/images/projects/ink-and-knuckles-2.webp",
    cta: "Play It",
    tags: ["Game Design", "Canvas", "React"],
    accent: "#e5b62a",
  },
]

export type Project = (typeof ALL_PROJECTS)[number]
