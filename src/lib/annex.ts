// The Annex: games built from the collection. Each has a route at /annex/<slug>.
export const GAMES = [
  {
    slug: "jigsaw",
    title: "Jigsaw",
    blurb: "Reassemble a photo from the collection, piece by piece.",
    description: "Pick any photograph from the collection and reassemble it. Three difficulties, timed, best times remembered.",
    bestKey: "jigsaw",
  },
  {
    slug: "pairs",
    title: "Pairs",
    blurb: "Flip the cards and match the moments. Fewest moves wins.",
    description: "A memory game with photographs from the collection. Flip two cards, find the pair, finish in the fewest moves.",
    bestKey: "pairs",
  },
  {
    slug: "postcards",
    title: "Postcards",
    blurb: "Eight photos, one question each: where was this taken?",
    description: "Eight photographs, eight guesses. Name the place each one was taken.",
    bestKey: "postcards",
  },
  {
    slug: "pin-the-map",
    title: "Pin the Map",
    blurb: "Five photos, one world map. Drop a pin where each was shot.",
    description: "Five photographs and a world map. Drop a pin where you think each was shot; closer is better.",
    bestKey: "pinmap",
  },
] as const

export type GameSlug = (typeof GAMES)[number]["slug"]

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug)
