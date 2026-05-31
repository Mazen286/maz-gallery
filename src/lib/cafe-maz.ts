// Single source of truth for Café Maz. Edit here and both the digital
// menu (/cafe-maz) and the printable menu (/cafe-maz/menu) update together.

export type Drink = {
  name: string
  desc: string
  featured?: boolean
}

export type DrinkSection = {
  id: string
  lat: string
  ar: string
  items: Drink[]
}

export const DRINK_SECTIONS: DrinkSection[] = [
  {
    id: "espresso",
    lat: "Espresso",
    ar: "إسبريسو",
    items: [
      { name: "Espresso", desc: "double shot, the foundation" },
      { name: "Macchiato", desc: "espresso, a spoon of foam" },
      { name: "Cortado", desc: "equal parts espresso & milk" },
      { name: "Americano", desc: "espresso lengthened with water" },
    ],
  },
  {
    id: "milk",
    lat: "With Milk",
    ar: "بالحليب",
    items: [
      { name: "Cappuccino", desc: "espresso, steamed milk, foam crown" },
      { name: "Flat White", desc: "double ristretto, microfoam" },
      { name: "Latte", desc: "espresso, steamed milk, light foam" },
      { name: "Pistachio Latte", desc: "pistachio cream, double shot", featured: true },
      { name: "Mocha", desc: "espresso, dark chocolate, milk" },
    ],
  },
  {
    id: "tea",
    lat: "Tea",
    ar: "شاي",
    items: [
      { name: "Mint Tea", desc: "Maghrebi-style, fresh mint, poured high" },
      { name: "Black Tea", desc: "Earl Grey or English Breakfast" },
      { name: "Green Tea", desc: "soft, vegetal, 80°C" },
      { name: "Matcha", desc: "whisked, straight or with milk" },
    ],
  },
  {
    id: "other",
    lat: "Other",
    ar: "أخرى",
    items: [
      { name: "Turkish Coffee", desc: "cezve, slow · ask for sade, orta, or şekerli" },
      { name: "Cardamom Coffee", desc: "espresso, fresh-ground cardamom" },
      { name: "Hot Chocolate", desc: "dark cocoa, steamed milk" },
    ],
  },
]

export type HookahShelfRef = { brand: string; line: string; flavor: string }

export type HookahRatio = {
  pct: string
  name: string
  shelf?: HookahShelfRef
}

export type HookahCombo = {
  num: string
  name: string
  ar: string
  mix: string
  desc: string
  ratios?: HookahRatio[]
  note?: string
}

const ULTRA_NOVA: HookahShelfRef = { brand: "Darkside", line: "Standard", flavor: "Ultranova / Super Nova" }

export const HOOKAH_COMBOS: HookahCombo[] = [
  {
    num: "Nº 01",
    name: "The Garden",
    ar: "الجنينة",
    mix: "Cold Mint · Pine · Basil",
    desc: "Cold mint backbone, sharp pine, soft basil finish. The house pour.",
    ratios: [
      { pct: "50%", name: "Cold Mint", shelf: ULTRA_NOVA },
      { pct: "30%", name: "Pine", shelf: { brand: "Darkside", line: "Standard", flavor: "Needls" } },
      { pct: "20%", name: "Basil", shelf: { brand: "Darkside", line: "Standard", flavor: "Basil Blast" } },
    ],
    note: "house pour",
  },
  {
    num: "Nº 02",
    name: "Yaffa Moonmilk",
    ar: "حليب قمر يافا",
    mix: "Cold Mint · Banana · Milky",
    desc: "Cool mint, ripe banana, condensed-milk finish. Late by the sea at Yaffa.",
    ratios: [
      { pct: "40%", name: "Cold Mint", shelf: ULTRA_NOVA },
      { pct: "35%", name: "Banana", shelf: { brand: "Darkside", line: "Experience", flavor: "Bana-Nscr" } },
      { pct: "25%", name: "Milky", shelf: { brand: "Darkside", line: "Standard", flavor: "Killer Milk" } },
    ],
    note: "late night",
  },
  {
    num: "Nº 03",
    name: "Al-Quds Asr",
    ar: "عصر القدس",
    mix: "Cold Mint · Masala Chai · Honey",
    desc: "Cardamom chai and honey on a stone balcony — afternoon over the old city.",
    ratios: [
      { pct: "40%", name: "Cold Mint", shelf: ULTRA_NOVA },
      { pct: "30%", name: "Masala Chai", shelf: { brand: "MustHave", line: "125g", flavor: "Masala Tea" } },
      { pct: "30%", name: "Honey", shelf: { brand: "Darkside", line: "Standard", flavor: "Honey Dust" } },
    ],
    note: "afternoon",
  },
  {
    num: "Nº 04",
    name: "Pomegranate Hour",
    ar: "ساعة الرمان",
    mix: "Cold Mint · Sea Buckthorn · Violet",
    desc: "Tart, floral, sundown-colored. Sip it slow. (Sea buckthorn stands in for pomegranate; violet for rose.)",
    ratios: [
      { pct: "40%", name: "Cold Mint", shelf: ULTRA_NOVA },
      { pct: "35%", name: "Sea Buckthorn", shelf: { brand: "MustHave", line: "125g", flavor: "Sea Buckthorn Tea" } },
      { pct: "25%", name: "Violet", shelf: { brand: "MustHave", line: "125g", flavor: "Violet" } },
    ],
    note: "intimate",
  },
  {
    num: "Nº 05",
    name: "Knafeh Nabulsi",
    ar: "كنافة نابلسية",
    mix: "Cold Mint · Pistachio · Honey",
    desc: "Crackling syrup over pistachio cream in the old Nablus souk.",
    ratios: [
      { pct: "45%", name: "Cold Mint", shelf: ULTRA_NOVA },
      { pct: "35%", name: "Pistachio", shelf: { brand: "MustHave", line: "125g", flavor: "Pistachio" } },
      { pct: "20%", name: "Honey", shelf: { brand: "Darkside", line: "Standard", flavor: "Honey Dust" } },
    ],
    note: "sweet",
  },
  {
    num: "Nº 06",
    name: "Sahlab Layl",
    ar: "سحلب الليل",
    mix: "Cold Mint · Milky · Pistachio",
    desc: "Hot sahlab made cool — pistachio dust, milk steam, cinnamon glow.",
    ratios: [
      { pct: "40%", name: "Cold Mint", shelf: ULTRA_NOVA },
      { pct: "35%", name: "Milky", shelf: { brand: "MustHave", line: "125g", flavor: "Milky Rice" } },
      { pct: "25%", name: "Pistachio", shelf: { brand: "MustHave", line: "125g", flavor: "Pistachio" } },
    ],
    note: "late night",
  },
]

export const TAGLINE = "a one-table café — open whenever you're over"

export const HOOKAH_INTRO =
  "Cold mint is the foundation — every bowl starts there. Tell us a feeling, we'll build it. We pour Darkside & MustHave; names below are ours."

// Off-Menu wink — rendered after the named combos on the website
// (not on the print menu). Mirrors the "lab night" concept from
// the original design.
export const OFF_MENU = {
  num: "Nº ∞",
  name: "Off-Menu",
  ar: "خارج القائمة",
  mix: "Cold Mint · ??? · ???",
  desc: "Cold mint is the only rule. Tell me a feeling, I'll build it.",
}

// Edit this line before guests arrive (or leave on shuffle).
export const TONIGHT_MUSIC = "tarab on shuffle"

// Snacks usually around — edit when stock changes.
export const PLATES = {
  lat: "Plates",
  ar: "أطباق",
  items: "mixed nuts · dates · olives",
  ask: "or ask what's around tonight",
}
