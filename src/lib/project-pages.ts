// The words and pictures for each project's own page in the Projects Wing
// (/projects/<slug>). Figment Forever keeps its hand-built page, so it has a
// slug here but no entry in PROJECT_PAGES.
//
// Every fact comes from a source listed in `sources` (the project's live site,
// its repository, or copy already on this site). Anything a page needs that no
// source states sits in square brackets in the copy and is listed in
// `placeholders`, for Maz to fill in. Draft copy, for Maz to read.

export type Fact = { label: string; value: string; note?: string }

export type Shot = {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  frame?: "phone" | "wide"
}

export type ProjectPage = {
  slug: string
  /** Equals the title in ALL_PROJECTS (src/lib/projects.ts) */
  title: string
  /** One answer-first sentence: meta description, the page's opening line, llms.txt */
  summary: string
  /** One line for the Projects card */
  cardLine: string
  schemaType: "VideoGame" | "WebApplication" | "SoftwareApplication" | "CreativeWork" | "Organization"
  genre?: string
  /** Exactly four, for the fact rail */
  facts: Fact[]
  what: string[]
  built: { heading: string; body: string }[]
  hero: Shot
  /** "bleed": text-free wide art that can sit full-bleed behind the title. "framed": logos, dashboards, screenshots */
  heroStyle?: "bleed" | "framed"
  shots: Shot[]
  link: { href: string; label: string }
  sameAs: string[]
  dateCreated?: string
  related: string[]
  placeholders: string[]
  /** Where the facts came from. Not shown on the page */
  sources: string[]
}

const IMG = "/images/projects"

export const PROJECT_PAGES: ProjectPage[] = [
  {
    slug: "figment-analytics",
    title: "Figment Analytics",
    summary:
      "Figment Analytics is Mazen Abugharbieh's San Diego data consultancy, building Power BI and Tableau dashboards for teams whose reports go unused.",
    cardLine: "My data consultancy: dashboards, workshops and better decisions with data.",
    schemaType: "Organization",
    facts: [
      { label: "What", value: "Data consultancy", note: "Power BI and Tableau dashboards" },
      { label: "Where", value: "San Diego", note: "Working with teams across the US" },
      { label: "Team", value: "Three specialists", note: "I'm the founder" },
      { label: "Start here", value: "Dashboard Sprint", note: "Fixed price, ten business days" },
    ],
    what: [
      "Figment Analytics is my data consultancy. We build Power BI and Tableau dashboards for teams whose reports go unused, and the data pipelines, storytelling and forecasting behind them.",
      "I founded it and lead its business intelligence and data storytelling, in a team of three specialists. Every project is led by the people who do the work.",
    ],
    built: [
      {
        heading: "One fixed-price way in",
        body: "Most work starts with a Dashboard Sprint: one working dashboard on a client's own data in ten business days, for a fixed price. Teams that already have reports can start with a rescue of the ones they have.",
      },
      {
        heading: "Work you can open and try",
        body: "The portfolio is live, not screenshots in a deck. The LA 311 Dashboard runs on public open data, FlightPulse maps aircraft in the browser, and Figment Forge is a Power BI dashboard built pro bono on a real retailer's anonymized data.",
      },
      {
        heading: "Software as well as reports",
        body: "Beyond reports, I build production software around the data: SurfUp's analytics and partner dashboards, and the Figment Gaming platform, with its database, multiplayer and AI opponents.",
      },
    ],
    hero: {
      src: `${IMG}/figment-analytics.png`,
      alt: "The Figment Analytics logo on a dark navy grid, over the words data consultancy, dashboards, workshops and data strategy",
      width: 1200,
      height: 675,
      frame: "wide",
    },
    heroStyle: "framed",
    shots: [
      {
        src: `${IMG}/figment-forge/dashboard.webp`,
        alt: "The Figment Forge Power BI dashboard: revenue by year, year over year change and cumulative revenue charts",
        width: 1500,
        height: 836,
        caption: "Figment Forge, a Power BI retail dashboard",
        frame: "wide",
      },
      {
        src: `${IMG}/la-311/request-map.webp`,
        alt: "A map of Los Angeles with teal clusters showing where recent 311 service requests were made",
        width: 1140,
        height: 788,
        caption: "The LA 311 Dashboard's request map",
        frame: "wide",
      },
      {
        src: `${IMG}/flightpulse/map.webp`,
        alt: "FlightPulse's dark map of the United States with aircraft positions and a time slider",
        width: 1600,
        height: 932,
        caption: "FlightPulse, flight tracking on a map",
        frame: "wide",
      },
    ],
    link: { href: "https://figmentanalytics.com", label: "Visit site" },
    sameAs: ["https://figmentanalytics.com", "https://www.youtube.com/@FigmentAnalytics"],
    related: ["figment-forge", "la-311", "flightpulse"],
    placeholders: [],
    sources: [
      "Maz's answers, 26 Nov 2026 (his part in the work, in his own words; no other names on the gallery)",
      "~/figment-analytics/src/app/page.tsx (home title and description)",
      "~/figment-analytics/src/app/about/page.tsx and src/lib/constants.ts (TEAM, PROJECTS)",
      "~/figment-analytics/src/app/services/page.tsx (Dashboard Sprint and rescue subtitle)",
      "~/figment-analytics/src/app/portfolio/* (LA 311, FlightPulse, Figment Forge, SurfUp, Figment Gaming)",
      "src/lib/projects.ts (existing gallery card copy)",
    ],
  },
  {
    slug: "surfup",
    title: "SurfUp",
    summary:
      "SurfUp makes SurfPods, self-service surfboard rental stations unlocked with a phone app, co-founded by Mazen Abugharbieh and now live in Waikiki.",
    cardLine: "Self-service surfboard rental stations, from San Diego to Waikiki.",
    schemaType: "Organization",
    facts: [
      { label: "What", value: "SurfPod stations", note: "Scan, surf, shaka" },
      { label: "Where", value: "Waikiki", note: "Hyatt Regency Waikiki since October 2026" },
      { label: "My role", value: "CPO and co-founder", note: "Analytics and partner dashboards" },
      { label: "Built with", value: "React Native", note: "Square payments, live maps" },
    ],
    what: [
      "SurfUp makes SurfPods, self-service surfboard rental stations that run around the clock with no staff. You find a SurfPod in the app, scan to unlock a board, surf, and bring it back. No reservations.",
      "The business started in Pacific Beach in San Diego and launched at the Hyatt Regency Waikiki in October 2026. I co-founded it and serve as its CPO.",
    ],
    built: [
      {
        heading: "Scan, surf, shaka",
        body: "The phone app is the whole counter: a live map of SurfPods, a scan that unlocks a board, a timer while you surf, and badges for regulars. It is a React Native app with Square for payments.",
      },
      {
        heading: "Dashboards for the team and the partners",
        body: "As CPO I led SurfUp's analytics platform: an admin view of rentals, revenue, customers and station health across every location, and a partner portal where each venue sees its own numbers without asking for a report.",
      },
      {
        heading: "In the press",
        body: "SurfUp has been covered by Surfer, Pacific Business News, KHON2, AOL, Hoodline, ABC 10 News San Diego, CBS 8, the San Diego Union-Tribune, Spectrum News 1 and UC San Diego.",
      },
    ],
    hero: {
      src: `${IMG}/surfup/surfpod-waikiki.webp`,
      alt: "A SurfPod rental station behind a shop window, with three surfboards racked on top of its lockers",
      width: 1600,
      height: 1067,
      frame: "wide",
    },
    heroStyle: "bleed",
    shots: [
      {
        src: `${IMG}/surfup/app-scan.webp`,
        alt: "The SurfUp app's map of a beach, with a Scan button and a rental guide",
        width: 640,
        height: 1387,
        caption: "Scan: find a SurfPod and unlock a board",
        frame: "phone",
      },
      {
        src: `${IMG}/surfup/app-surf.webp`,
        alt: "The SurfUp app during a rental, with a running timer and directions back to the station",
        width: 640,
        height: 1387,
        caption: "Surf: the timer runs while you're out",
        frame: "phone",
      },
      {
        src: `${IMG}/surfup/app-shaka.webp`,
        alt: "The SurfUp app's rewards screen, with badges for regular renters",
        width: 640,
        height: 1387,
        caption: "Shaka: badges for the regulars",
        frame: "phone",
      },
    ],
    link: { href: "https://surfupapp.com", label: "See it live" },
    sameAs: [
      "https://surfupapp.com",
      "https://apps.apple.com/us/app/surfup/id1525152192",
      "https://play.google.com/store/apps/details?id=com.surfupapp.aloha",
      "https://www.instagram.com/surfupapp",
    ],
    related: ["figment-analytics", "figment-forge", "flightpulse"],
    placeholders: [
      "The year SurfUp started: Maz thinks it was around 2018 but is not certain, so the page leaves the year out until he confirms it.",
    ],
    sources: [
      "Maz's answers, 26 Nov 2026 (his part in the work, in his own words; no other names on the gallery)",
      "~/SurfUp/Website-SurfUpApp/public/llms.txt and src/lib/constants.ts (team roles, app store links, Instagram)",
      "~/SurfUp/App-Aloha/package.json (React Native, react-native-square-in-app-payments, react-native-maps)",
      "~/figment-analytics/src/app/portfolio/surfup/page.tsx (CPO role, analytics platform, Pacific Beach, Hyatt Regency Waikiki in October 2026, press list)",
      "src/lib/projects.ts (existing gallery card copy)",
      "~/.claude memory project_surfup.md (Scan, Surf, Shaka; no booking wording)",
    ],
  },
  {
    slug: "cafe-maz",
    title: "Café Maz",
    summary:
      "Café Maz is a one-table home café for friends, made by Mazen Abugharbieh, with a bilingual website, a printable menu, a recipe book and six playlists.",
    cardLine: "A one-table home café for friends, with a bilingual brand system and menu.",
    schemaType: "CreativeWork",
    facts: [
      { label: "What", value: "A one-table café", note: "Open whenever you're over" },
      { label: "Since", value: "2026", note: "Est. 2026, as the menu says" },
      { label: "Pieces", value: "Website, menu, recipe book", note: "Plus a flavor lab and six playlists" },
      { label: "Built with", value: "Next.js and Claude", note: "Cinzel, Cormorant and Amiri" },
    ],
    what: [
      "I always offered friends coffee from \"Café Maz\", which meant me walking to the kitchen to make whatever they felt like. After a friend sent me a video of a director who hands guests a menu at his house, the joke became a project.",
      "It is a way of setting the table I grew up at in Amman, where the host decides what the guest needs. The menu is for guests who already know. If you don't, tafaddal.",
    ],
    built: [
      {
        heading: "A brand system in two languages",
        body: "The look is a candlelit Levantine lounge: coffee-black background, brass accents, Cinzel for the wordmarks, Amiri for the Arabic and italic Cormorant for the small things. Every page is in English and Arabic, because that is how the house sounds.",
      },
      {
        heading: "Four pieces, one for each moment",
        body: "A one-page website to send guests before they come over, a printable A5 menu with drinks on the front and hookah on the back, a recipe book that stays behind the bar, and a flavor lab where Claude suggests hookah blends from the flavors on the shelf.",
      },
      {
        heading: "Music as architecture",
        body: "Six playlists, one for each mood the café might hold across a day, with a picker on the website so the music fits the room.",
      },
    ],
    hero: {
      src: `${IMG}/cafe-maz/website.webp`,
      alt: "The Café Maz website: the name in brass capitals over its Arabic, on a coffee-black background",
      width: 1600,
      height: 810,
      frame: "wide",
    },
    heroStyle: "framed",
    shots: [
      {
        src: `${IMG}/cafe-maz/print-menu.webp`,
        alt: "The printable Café Maz menu: drinks on one arched card and hookah combos on the other",
        width: 1440,
        height: 836,
        caption: "The print menu, A5 and duplex",
        frame: "wide",
      },
      {
        src: `${IMG}/cafe-maz/come-over.webp`,
        alt: "The Come over section of the Café Maz website, with house hours, the address line and a playlist picker",
        width: 1440,
        height: 836,
        caption: "The welcome, with the playlist picker",
        frame: "wide",
      },
    ],
    link: { href: "/cafe-maz/cafe", label: "Step inside" },
    sameAs: [],
    dateCreated: "2026",
    related: ["figment-forever", "surfup"],
    placeholders: [],
    sources: [
      "src/components/blog/posts/cafe-maz.tsx (the story, the design, the playlists, the four pieces)",
      "src/app/cafe-maz/page.tsx (Est. 2026, the four tiles)",
      "src/app/cafe-maz/layout.tsx (Cinzel, Cormorant Garamond, Amiri)",
      "src/app/api/cafe-maz/flavor-lab/route.ts (the flavor lab asks Claude)",
      "src/lib/projects.ts (existing gallery card copy)",
    ],
  },
  {
    slug: "la-311",
    title: "LA 311 Dashboard",
    summary:
      "The LA 311 Dashboard is an interactive analysis of 369,000+ Los Angeles 311 service requests from early 2025, built end to end by Mazen Abugharbieh.",
    cardLine: "Interactive analytics from 369,000+ City of LA service requests.",
    schemaType: "WebApplication",
    facts: [
      { label: "Data", value: "369,000+ requests", note: "Q1 2025, public open data" },
      { label: "Source", value: "LA Open Data portal", note: "Pulled through the SODA API" },
      { label: "Built with", value: "Next.js and Recharts", note: "Maps in Mapbox GL JS" },
      { label: "Made by", value: "Me, end to end", note: "Data, analysis, design and code" },
    ],
    what: [
      "311 is the City of Los Angeles non-emergency service line. Residents use it to report illegal dumping, graffiti, potholes and more, and every request is logged as public data.",
      "The dashboard breaks 369,000+ requests from the first quarter of 2025 down by type, neighborhood, response time and place, so a journalist, a community organizer or a city official can spot patterns for themselves.",
    ],
    built: [
      {
        heading: "From raw records to small files",
        body: "I pull the records from the City of LA's open data API and aggregate them on the server ahead of time into small static datasets. The page makes no live API calls, so it opens without spinners.",
      },
      {
        heading: "Charts and a map",
        body: "I drew the time series, categories, neighborhoods and resolution times in Recharts. A Mapbox GL JS map clusters the most recent requests across the city and expands a cluster when you click it.",
      },
      {
        heading: "Findings between the charts",
        body: "I wrote the key findings and set them between the charts, so the numbers read as a story instead of a wall of figures.",
      },
    ],
    hero: {
      src: `${IMG}/la-311.webp`,
      alt: "An aerial rendering of a city grid glowing teal where activity is densest",
      width: 1600,
      height: 1066,
      frame: "wide",
    },
    heroStyle: "framed",
    shots: [
      {
        src: `${IMG}/la-311/request-map.webp`,
        alt: "A map of Los Angeles with teal clusters showing where recent 311 service requests were made, from Burbank to Inglewood",
        width: 1140,
        height: 788,
        caption: "Request locations, clustered on a Mapbox map",
        frame: "wide",
      },
    ],
    link: { href: "https://figmentanalytics.com/portfolio/la-311", label: "View project" },
    sameAs: ["https://figmentanalytics.com/portfolio/la-311"],
    related: ["flightpulse", "figment-forge", "figment-analytics"],
    placeholders: [],
    sources: [
      "Maz's answers, 26 Nov 2026 (his part in the work, in his own words; no other names on the gallery)",
      "~/figment-analytics/src/app/portfolio/la-311/page.tsx (369,000+ requests, Q1 2025, SODA API, Recharts, Mapbox GL JS, static aggregations, findings between charts)",
      "~/figment-analytics/src/lib/constants.ts PROJECTS (technologies)",
      "src/lib/projects.ts (existing gallery card copy)",
    ],
  },
  {
    slug: "flightpulse",
    title: "FlightPulse",
    summary:
      "FlightPulse is an interactive flight tracking map of aircraft positions, paths and altitude; Mazen Abugharbieh did its GIS work and built the app.",
    cardLine: "Interactive flight tracking that brings aircraft data to life on the map.",
    schemaType: "WebApplication",
    facts: [
      { label: "What", value: "Flight tracking map", note: "Positions, paths and altitude" },
      { label: "Data", value: "ADSBExchange", note: "A snapshot of public flight data" },
      { label: "Built with", value: "React and TypeScript", note: "Mapbox GL JS" },
      { label: "My part", value: "The GIS and the app", note: "Data with the Figment Analytics team" },
    ],
    what: [
      "FlightPulse turns raw aircraft coordinates into a map you can explore. It shows a snapshot of aircraft activity with each flight's identifier, position, direction and altitude.",
      "The data, extracted with the Figment Analytics team, comes from ADSBExchange, a community-run, publicly available flight tracking network. I did the GIS work and built the app on top of it. Pan, zoom, pick a plane and follow it.",
    ],
    built: [
      {
        heading: "Many aircraft on one map",
        body: "I draw every aircraft marker at once with Mapbox GL JS and a custom map style, and keep panning and zooming smooth.",
      },
      {
        heading: "Paths colored by altitude",
        body: "Flight paths can be switched on and off, with altitude carried along each line and a legend that tells high cruising apart from an approach.",
      },
      {
        heading: "Time and one plane at a time",
        body: "A time slider filters the flights by period, and selecting an aircraft isolates its path and shows its details.",
      },
    ],
    hero: {
      src: `${IMG}/flightpulse/map.webp`,
      alt: "FlightPulse's dark map of the United States with aircraft positions, a side panel of controls and a time slider",
      width: 1600,
      height: 932,
      frame: "wide",
    },
    heroStyle: "framed",
    shots: [],
    link: { href: "https://flightpulse.figmentanalytics.com", label: "Launch app" },
    sameAs: ["https://flightpulse.figmentanalytics.com", "https://figmentanalytics.com/portfolio/flightpulse"],
    related: ["la-311", "figment-forge", "figment-analytics"],
    placeholders: [],
    sources: [
      "Maz's answers, 26 Nov 2026 (his part in the work, in his own words; no other names on the gallery)",
      "~/figment-analytics/src/app/portfolio/flightpulse/page.tsx (features, ADSBExchange, React, TypeScript, Mapbox GL JS)",
      "~/airplane-tracker (the FlightPulse repository: README, src/components/Header.tsx)",
      "src/lib/projects.ts (existing gallery card copy)",
    ],
  },
  {
    slug: "figment-forge",
    title: "Figment Forge",
    summary:
      "Figment Forge is a Power BI retail dashboard Mazen Abugharbieh built pro bono on a real business's anonymized data, with sales forecasts and customer segments.",
    cardLine: "A Power BI retail dashboard with ML forecasts and customer segmentation.",
    schemaType: "CreativeWork",
    facts: [
      { label: "What", value: "Retail dashboard", note: "Six Power BI pages" },
      { label: "Data", value: "Over $1M in revenue", note: "100K+ orders, figures altered" },
      { label: "Built with", value: "Power BI and Python", note: "DAX, SQL and ML forecasts" },
      { label: "Basis", value: "Pro bono", note: "A real retailer agreed to it" },
    ],
    what: [
      "Figment Forge is a portfolio piece built on real data, not a tidy sample set. A retail business agreed to let me build on its sales, inventory and customer records, to show what a small retailer can see when that data lives in one place.",
      "Before anything was published the data was anonymized: dollar amounts were randomized within realistic ranges and product names were replaced with invented ones. The patterns, scale and structure are true to the original.",
    ],
    built: [
      {
        heading: "One pipeline for three kinds of data",
        body: "Sales, inventory and customer data were brought together in a single pipeline, with the Figment Analytics team, before any chart was drawn.",
      },
      {
        heading: "Forecasts in Python",
        body: "Machine learning models in Python, built with the Figment Analytics team, project future sales to help with inventory and marketing plans.",
      },
      {
        heading: "Six pages in Power BI",
        body: "I made the dashboard and every analysis in it: sales performance, brand analysis, customer segmentation, inventory health, trend forecasting and an executive summary, built on over $1M in revenue across 100K+ orders.",
      },
    ],
    hero: {
      src: `${IMG}/figment-forge/dashboard.webp`,
      alt: "The Figment Forge overview page in Power BI: total revenue by year, year over year change and cumulative revenue",
      width: 1500,
      height: 836,
      frame: "wide",
    },
    heroStyle: "framed",
    shots: [],
    link: { href: "https://figmentanalytics.com/portfolio/figment-forge", label: "View project" },
    sameAs: ["https://figmentanalytics.com/portfolio/figment-forge"],
    related: ["la-311", "figment-analytics", "surfup"],
    placeholders: [],
    sources: [
      "Maz's answers, 26 Nov 2026 (his part in the work, in his own words; no other names on the gallery)",
      "~/figment-analytics/src/app/portfolio/figment-forge/page.tsx (pro bono, anonymized, over $1M, 100K+ orders, six pages, Python ML forecasts, Power BI)",
      "~/figment-analytics/src/lib/constants.ts PROJECTS (Power BI, Python, Machine Learning, DAX, SQL)",
      "src/lib/projects.ts (existing gallery card copy)",
    ],
  },
  {
    slug: "figment-gaming",
    title: "Figment Gaming",
    summary:
      "Figment Gaming is a free site of original browser games and companion tools for card and tabletop games, made by Mazen Abugharbieh.",
    cardLine: "Original browser games plus free companion tools for card and tabletop games.",
    schemaType: "WebApplication",
    facts: [
      { label: "What", value: "Games and tools", note: "Everything on it is free" },
      { label: "Began as", value: "A cube drafting tool", note: "And grew one game at a time" },
      { label: "Built with", value: "React 19 and Supabase", note: "On Cloudflare Workers" },
      { label: "Made by", value: "Me", note: "Every game and tool on it" },
    ],
    what: [
      "Figment Gaming is two things under one roof: original games made for the browser, and free companion tools for card and tabletop games people already play. It began as a cube drafting tool and kept growing, one game at a time.",
      "Its own games include Runes and Reagents, Runes: Brewstorm, Ink & Knuckles 2 and CubeCraft. I made every one of them, and I run the site.",
    ],
    built: [
      {
        heading: "One codebase, many games",
        body: "A React 19 app on Cloudflare Workers serves every game and tool, each with its own rules, data and formats, on one shared account.",
      },
      {
        heading: "A database written by hand",
        body: "Supabase Postgres holds cards, decks, drafts, saves and social features, shaped by 300+ raw SQL migrations instead of an ORM.",
      },
      {
        heading: "Live rooms and game AI",
        body: "Supabase Realtime runs multiplayer drafting rooms and duels, with room codes, spectating and reconnection. The AI is purpose-built, not a language model: draft bots follow an archetype, and the fighting game's CPU is tuned by simulation.",
      },
    ],
    hero: {
      src: `${IMG}/figment-gaming/table.webp`,
      alt: "A purple felt play mat on a wooden table, with cards, coins, meeples and a lit candle around it",
      width: 1600,
      height: 905,
      frame: "wide",
    },
    heroStyle: "bleed",
    shots: [
      {
        src: `${IMG}/figment-gaming.webp`,
        alt: "The Figment Gaming logo on a play mat, over the words Draft. Build. Play. and chips for CubeCraft, Runes and Reagents, Brewstorm, Ink & Knuckles 2 and deck tools",
        width: 1200,
        height: 630,
        caption: "Draft. Build. Play.",
        frame: "wide",
      },
      {
        src: `${IMG}/runes-brewstorm/board.webp`,
        alt: "A Runes: Brewstorm board in the Nearby Forest, with rune pieces and a level goal at the top",
        width: 640,
        height: 1074,
        caption: "Runes: Brewstorm",
        frame: "phone",
      },
      {
        src: `${IMG}/ink-and-knuckles-2/fighter-select.webp`,
        alt: "The Ink & Knuckles 2 fighter select screen, with Truth chosen and a mystery opponent",
        width: 1536,
        height: 864,
        caption: "Ink & Knuckles 2",
        frame: "wide",
      },
    ],
    link: { href: "https://figmentgaming.com", label: "Play now" },
    sameAs: ["https://figmentgaming.com", "https://figmentanalytics.com/portfolio/figment-gaming"],
    related: ["runes-brewstorm", "ink-and-knuckles-2", "runes-and-reagents"],
    placeholders: [],
    sources: [
      "Maz's answers, 26 Nov 2026 (his part in the work, in his own words; no other names on the gallery)",
      "~/figment-gaming/src/pages/About.tsx (two things under one roof, built by Figment Analytics, began as a cube drafting tool, our games)",
      "~/figment-analytics/src/app/portfolio/figment-gaming/page.tsx (React 19, Cloudflare Workers, Supabase, 300+ raw SQL migrations, Realtime rooms, purpose-built AI)",
      "~/figment-gaming/src/pages/aboutData.ts (own games list)",
      "src/lib/projects.ts (existing gallery card copy)",
    ],
  },
  {
    slug: "runes-and-reagents",
    title: "Runes & Reagents",
    summary:
      "Runes and Reagents is a free alchemy crafting RPG for the browser from Figment Gaming: combine elements, discover recipes, battle and recruit companions.",
    cardLine: "Combine elements, discover recipes, recruit companions and cross into new worlds.",
    schemaType: "VideoGame",
    genre: "Alchemy crafting RPG",
    facts: [
      { label: "Genre", value: "Alchemy crafting RPG", note: "Turn based battles" },
      { label: "Where", value: "In the browser", note: "Free, with cloud saves" },
      { label: "Worlds", value: "Areena, Verdigris, Aurum", note: "Across the Rift and beyond" },
      { label: "Made by", value: "Me", note: "On Figment Gaming" },
    ],
    what: [
      "You play an apprentice alchemist who combines elements into new reagents, discovers recipes, explores the land, battles creatures and recruits companions. It runs in the browser with no download and is free to play.",
      "The story begins in Areena, a world of magic and dragons. Cross the Rift and you reach Verdigris, a world run on a grid of wild elements. Go further and you reach Aurum and its city Lustre, where the elements live in people as powers. I made it myself, from the story to the code.",
    ],
    built: [
      {
        heading: "Recipes you work out",
        body: "Every new combination at the workshop bench goes into your Discoveries. Quests give clues and a hint ladder when you are stuck, so a recipe can be worked out instead of looked up.",
      },
      {
        heading: "A party that fights with what you make",
        body: "Battles are turn based, and the gear and reagents you craft help decide them. Companions join as the story goes on, from strikers and tanks to casters and support.",
      },
      {
        heading: "A world worth walking twice",
        body: "Finishing a chapter gives you a Runestone that makes that world Runebound: sharper fights, creatures that rise to your level and better drops. A tavern full of minigame tables waits between quests.",
      },
    ],
    hero: {
      src: `${IMG}/runes-and-reagents/dragon-battle.webp`,
      alt: "A hooded young alchemist holds a potion as a red dragon breathes fire at their hand",
      width: 1280,
      height: 853,
      frame: "wide",
    },
    heroStyle: "bleed",
    shots: [
      {
        src: `${IMG}/runes-and-reagents/bench.webp`,
        alt: "The Satchel in Runes and Reagents: Earth and Water on the workshop bench, ready to combine into Mud",
        width: 1090,
        height: 900,
        caption: "The workshop bench",
        frame: "wide",
      },
      {
        src: `${IMG}/runes-and-reagents/map.webp`,
        alt: "The Road Out, a painted map of Emberhollow with mountains, forests, caves and lava fields to explore",
        width: 1090,
        height: 905,
        caption: "The road out of Emberhollow",
        frame: "wide",
      },
      {
        src: `${IMG}/runes-and-reagents/tavern.webp`,
        alt: "A painted tavern with a stone fireplace, lanterns and an empty bar",
        width: 1344,
        height: 752,
        caption: "The tavern, where the minigame tables are",
        frame: "wide",
      },
    ],
    link: { href: "https://figmentgaming.com/runes", label: "Play it" },
    sameAs: ["https://figmentgaming.com/runes"],
    related: ["runes-brewstorm", "ink-and-knuckles-2", "figment-gaming"],
    placeholders: [],
    sources: [
      "Maz's answers, 26 Nov 2026 (his part in the work, in his own words; no other names on the gallery)",
      "~/figment-gaming/src/config/runesSeo.ts (pitch, crawler body, worlds, screenshots and their alt text)",
      "~/figment-gaming/src/games/runes/data/aurumNames.ts (Aurum, Lustre)",
      "~/figment-gaming/public/images/guides/runes-and-reagents-* (bench and map screenshots)",
      "src/lib/projects.ts (existing gallery card copy)",
    ],
  },
  {
    slug: "runes-brewstorm",
    title: "Runes: Brewstorm",
    summary:
      "Runes: Brewstorm is a free match-3 puzzle game for the browser from Figment Gaming, set in the world of Runes and Reagents, now in early access.",
    cardLine: "A free match-3 in the browser, set in the world of Runes and Reagents.",
    schemaType: "VideoGame",
    genre: "Match-3 puzzle",
    facts: [
      { label: "Genre", value: "Match-3 puzzle", note: "Levels with goals, rescues and bosses" },
      { label: "Where", value: "In the browser", note: "Free, no account, no download" },
      { label: "Status", value: "Early access", note: "The first regions are open" },
      { label: "Built with", value: "PixiJS and React", note: "Made by me, on Figment Gaming" },
    ],
    what: [
      "Nestor the fox carves puzzle boards, and this season he takes them out across the valley as the hard winter lets go. The runes on his boards are real, so a brew made on the board goes off for real a few paces away.",
      "Each level is a board with a goal: collect pieces, make a brew, clear the moss and the thorny vines, or drive off a boss. Finish with moves to spare and you earn more stars. I made it myself, from the design to the code.",
    ],
    built: [
      {
        heading: "Only Runes brew",
        body: "Four in a line make a Rune. Swap a Rune into another element and the two make a brew, like Fire and Water making Steam. The brew waits in a bottle until you choose where it goes off, and two Runes together make a great brew twice as big. The recipes come from Runes and Reagents' own table, so a brew always has the same one result in both games.",
      },
      {
        heading: "Rescues and bosses",
        body: "On some boards a local is in danger: vines fill a potting shed, water rises in a hollow, a smokehouse catches fire. Your matches push the danger back, and the right brew pushes hardest. Each region's boss fights back from the top of the board and shows you a move ahead which pieces it will hit.",
      },
      {
        heading: "Levels tuned to real players",
        body: "A bot plays every level to set its difficulty, and the bot itself is fitted to how real players do, so the easy stretches, the hard levels and the bosses keep their rhythm.",
      },
      {
        heading: "Kind to a phone",
        body: "It plays upright on a phone or on a computer, with a mouse or a finger. Battery and heat were measured on a slowed phone profile, and a battery saver keeps a phone cool through a long sitting.",
      },
    ],
    hero: {
      src: `${IMG}/runes-brewstorm/key-art.webp`,
      alt: "Nestor the fox lifts a carved puzzle board in a forest glade as a rainbow storm of runes and bottled brews pours toward a vine-covered stag",
      width: 1600,
      height: 600,
      frame: "wide",
    },
    heroStyle: "bleed",
    shots: [
      {
        src: `${IMG}/runes-brewstorm/board.webp`,
        alt: "A Runes: Brewstorm board in the Nearby Forest, with rune pieces, a move counter and the level goal",
        width: 640,
        height: 1074,
        caption: "A board in the Nearby Forest",
        frame: "phone",
      },
      {
        src: `${IMG}/runes-brewstorm/rescue.webp`,
        alt: "A rescue level: a local stands in a smokehouse as fire creeps toward them above the board",
        width: 640,
        height: 895,
        caption: "A rescue: Steam puts out fire",
        frame: "phone",
      },
      {
        src: `${IMG}/runes-brewstorm/boss.webp`,
        alt: "A boss fight: Old Nettlecrown, a stag covered in vines, stands over the board with its health bar",
        width: 640,
        height: 1019,
        caption: "Old Nettlecrown, the Forest's boss",
        frame: "phone",
      },
      {
        src: `${IMG}/runes-brewstorm/map.webp`,
        alt: "The Brewstorm map: a winding road of numbered levels through the valley",
        width: 600,
        height: 1038,
        caption: "The road across the valley",
        frame: "phone",
      },
    ],
    link: { href: "https://figmentgaming.com/brewstorm", label: "Play it" },
    sameAs: ["https://figmentgaming.com/brewstorm"],
    dateCreated: "2026-10-28",
    related: ["runes-and-reagents", "ink-and-knuckles-2", "figment-gaming"],
    placeholders: [],
    sources: [
      "Maz's answers, 26 Nov 2026 (his part in the work, in his own words; no other names on the gallery)",
      "~/figment-gaming/src/config/brewstorm.ts (title, route, pitch, early access line, wide card art)",
      "~/figment-gaming/src/config/brewstormSeo.ts (story, how brewing works, rescues, bosses, play on any screen)",
      "~/figment-gaming/docs/match3/DESIGN.md (started 28 Oct 2026; brews read Runes' one-result table)",
      "~/figment-gaming/docs/match3/BOT_CALIBRATION.md (bot fitted to real players' results)",
      "~/figment-gaming/docs/match3/BATTERY.md (battery and heat measured on a slowed phone profile)",
      "~/figment-gaming/package.json (pixi.js)",
      "~/figment-gaming/public/images/guides/brewstorm/* (board, rescue, boss, map screenshots)",
    ],
  },
  {
    slug: "ink-and-knuckles-2",
    title: "Ink & Knuckles 2",
    summary:
      "Ink & Knuckles 2 is a free one on one fighting game for the browser from Figment Gaming, drawn frame by frame, with Arcade, Training and Combo Trials.",
    cardLine: "A free one on one fighting game in the browser, drawn frame by frame.",
    schemaType: "VideoGame",
    genre: "Fighting",
    facts: [
      { label: "Genre", value: "One on one fighter", note: "Single player against the CPU" },
      { label: "Where", value: "In the browser", note: "Keyboard, game pad or touch" },
      { label: "Modes", value: "Arcade, Training, Combo Trials", note: "No account needed" },
      { label: "Built with", value: "Canvas and React", note: "Made by me, on Figment Gaming" },
    ],
    what: [
      "A free fighting game you play in the browser against the CPU. Pick a fighter, pick a stage and climb a ladder of opponents that gets tougher as you go.",
      "The roster comes from every chapter of Runes and Reagents: alchemists, townsfolk, machines and monsters, each with their own moves, specials and finishers. I made it myself, from the fighters to the code.",
    ],
    built: [
      {
        heading: "Drawn frame by frame",
        body: "I made every fighter and every painted stage, animated frame by frame, with super moves that cut in across the screen.",
      },
      {
        heading: "A fair CPU",
        body: "The CPU opponents are tuned by simulation, so every fighter wins about half its matches.",
      },
      {
        heading: "Any controller",
        body: "It plays with a keyboard, a game pad or on-screen touch controls, and a command list and a How to play page explain every move.",
      },
    ],
    hero: {
      src: `${IMG}/ink-and-knuckles-2/key-art.webp`,
      alt: "Fighters squaring off across a split city skyline at night, a blue side with a police brawler and a schoolgirl, a purple side under a full moon",
      width: 1600,
      height: 600,
      frame: "wide",
    },
    heroStyle: "bleed",
    shots: [
      {
        src: `${IMG}/ink-and-knuckles-2/fighter-select.webp`,
        alt: "The fighter select screen, with Truth chosen against a mystery opponent",
        width: 1536,
        height: 864,
        caption: "Select your fighter",
        frame: "wide",
      },
      {
        src: `${IMG}/ink-and-knuckles-2/combo.webp`,
        alt: "Truth lands a three hit combo on the Salt Baron in an arcade room stage",
        width: 1536,
        height: 864,
        caption: "A three hit combo",
        frame: "wide",
      },
      {
        src: `${IMG}/ink-and-knuckles-2/super.webp`,
        alt: "A super move cut-in: Truth's Golden Line sweeps across the screen",
        width: 1536,
        height: 864,
        caption: "A super, Golden Line",
        frame: "wide",
      },
    ],
    link: { href: "https://figmentgaming.com/ink-and-knuckles-2", label: "Play it" },
    sameAs: ["https://figmentgaming.com/ink-and-knuckles-2"],
    related: ["runes-and-reagents", "runes-brewstorm", "figment-gaming"],
    placeholders: [],
    sources: [
      "Maz's answers, 26 Nov 2026 (his part in the work, in his own words; no other names on the gallery)",
      "~/figment-gaming/src/config/ink2.ts (title, route, pitch)",
      "~/figment-gaming/src/config/gamesSeo.ts (crawler body: single player against the CPU, crossover roster, arcade ladder; genre Fighting)",
      "~/figment-gaming/src/pages/About.tsx (fighters and painted stages drawn by us, keyboard, game pad or touch, no account)",
      "~/figment-analytics/src/app/portfolio/figment-gaming/page.tsx (CPU tuned by simulation, about half its matches)",
      "~/figment-gaming/src/games/runes/minigames/inkAndKnuckles (canvas rendering)",
      "~/figment-gaming/public/images/guides/*ink-and-knuckles-2* (screenshots)",
    ],
  },
]

/** Every project in ALL_PROJECTS, by title, to the slug of its page */
export const PROJECT_SLUGS: Record<string, string> = {
  "Figment Analytics": "figment-analytics",
  "Figment Forever": "figment-forever",
  SurfUp: "surfup",
  "Café Maz": "cafe-maz",
  "LA 311 Dashboard": "la-311",
  FlightPulse: "flightpulse",
  "Figment Forge": "figment-forge",
  "Figment Gaming": "figment-gaming",
  "Runes & Reagents": "runes-and-reagents",
  "Runes: Brewstorm": "runes-brewstorm",
  "Ink & Knuckles 2": "ink-and-knuckles-2",
}
