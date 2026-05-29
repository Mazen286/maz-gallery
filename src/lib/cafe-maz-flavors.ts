// Café Maz shelf — Darkside + MustHave hookah tobacco.
//
// Edit this file to match exactly what's on your shelf. Add, remove, or
// retag flavors and the Flavor Lab picker + Claude API both update.
//
// Profile tags are free-form — keep them consistent (see PROFILE_FAMILIES
// below) so the family filter chips work cleanly.

export type Brand = "Darkside" | "MustHave"

export type Flavor = {
  brand: Brand
  line: string
  name: string
  profiles: string[]
  note?: string
}

// Profile families used by the picker's filter chips. Order matters
// (display order). Each profile must match a string used in Flavor.profiles
// somewhere in the catalog, or it won't show any results.
export const PROFILE_FAMILIES: { label: string; profiles: string[] }[] = [
  { label: "Base · Mint", profiles: ["Cold Mint", "Bright Mint", "Spearmint", "Menthol", "Eucalyptus"] },
  { label: "Berry", profiles: ["Strawberry", "Raspberry", "Blueberry", "Blackberry", "Blackcurrant", "Cranberry", "Gooseberry", "Pomegranate", "Mixed Berry"] },
  { label: "Tropical", profiles: ["Mango", "Pineapple", "Passion Fruit", "Coconut", "Lychee", "Banana", "Guava", "Marula", "Feijoa"] },
  { label: "Stone & Crisp", profiles: ["Peach", "Apricot", "Plum", "Cherry", "Apple", "Pear", "Quince", "Grape", "Watermelon", "Cantaloupe", "Melon"] },
  { label: "Citrus", profiles: ["Lemon", "Lime", "Orange", "Mandarin", "Grapefruit", "Sea Buckthorn"] },
  { label: "Herbal · Floral", profiles: ["Basil", "Pine", "Tarragon", "Cucumber", "Rose", "Violet", "Hibiscus", "Lavender", "Cardamom"] },
  { label: "Sweet · Cream", profiles: ["Vanilla", "Caramel", "Chocolate", "Honey", "Milky", "Cheesecake", "Pistachio", "Sweet"] },
  { label: "Tea & Beverage", profiles: ["Earl Grey", "Black Tea", "Red Tea", "Masala Tea", "Milk Oolong", "Cinnamon", "Anise", "Coffee", "Chai", "Mojito", "Whisky", "Rum", "Mulled Wine", "Cigar", "Cola", "Cream Soda"] },
]

// Darkside — organized by line. Lines roughly:
//   Core: workhorse, full strength, classic flavors
//   Medium: balanced strength
//   Soft: gentle, sweeter, lighter
//   Rare: specialty / unusual profiles
//   Experience: premium, smoother
//
// Some line assignments may need correcting — edit freely.
export const DARKSIDE: Flavor[] = [
  // Core
  { brand: "Darkside", line: "Core", name: "Code Pasha", profiles: ["Cardamom", "Sweet"], note: "Cardamom-forward, slow burn." },
  { brand: "Darkside", line: "Core", name: "Code Duke", profiles: ["Vanilla", "Milky"], note: "Vanilla cream, dessert." },
  { brand: "Darkside", line: "Core", name: "Spaceberry", profiles: ["Raspberry", "Blueberry", "Mixed Berry"], note: "Mixed-berry sorbet." },
  { brand: "Darkside", line: "Core", name: "Cuba Cigar", profiles: ["Cigar", "Sweet"], note: "Sweet tobacco, cigar room." },
  { brand: "Darkside", line: "Core", name: "Cherry Hookah", profiles: ["Cherry"], note: "Dark cherry, almost cola." },
  { brand: "Darkside", line: "Core", name: "Frosty Vibe", profiles: ["Cold Mint", "Menthol"], note: "Strong cooling, polar." },
  { brand: "Darkside", line: "Core", name: "Bonberry", profiles: ["Mixed Berry"], note: "Berry jam, candy-sweet." },
  { brand: "Darkside", line: "Core", name: "Code Storm", profiles: ["Cold Mint", "Menthol"], note: "Intense ice mint." },
  { brand: "Darkside", line: "Core", name: "Watermelon", profiles: ["Watermelon"], note: "Watermelon candy." },

  // Medium
  { brand: "Darkside", line: "Medium", name: "Ultra Nova", profiles: ["Cold Mint", "Menthol"], note: "Your house cold-mint base — anchor of nearly every bowl." },
  { brand: "Darkside", line: "Medium", name: "Supernova", profiles: ["Bright Mint", "Cold Mint"], note: "Brighter, less icy than Ultra Nova." },
  { brand: "Darkside", line: "Medium", name: "Hard Nova", profiles: ["Cold Mint", "Menthol"], note: "Heaviest cool of the Nova line." },
  { brand: "Darkside", line: "Medium", name: "Needls", profiles: ["Pine"], note: "Sharp pine needle, almost juniper." },
  { brand: "Darkside", line: "Medium", name: "Pink Mist", profiles: ["Strawberry", "Cold Mint"], note: "Strawberry candy + cool finish." },
  { brand: "Darkside", line: "Medium", name: "Berry Battle", profiles: ["Mixed Berry"], note: "Layered berries, tart." },
  { brand: "Darkside", line: "Medium", name: "Tropic Loops", profiles: ["Mango", "Passion Fruit", "Pineapple"], note: "Tropical mix, breakfast-cereal vibe." },
  { brand: "Darkside", line: "Medium", name: "Black Mamba", profiles: ["Blackberry", "Cold Mint"], note: "Blackberry over cool mint." },
  { brand: "Darkside", line: "Medium", name: "Sun Coil", profiles: ["Orange", "Lemon"], note: "Sun-warmed citrus." },

  // Soft
  { brand: "Darkside", line: "Soft", name: "Strawberry Banana", profiles: ["Strawberry", "Banana"], note: "Smoothie. Crowd-pleaser." },
  { brand: "Darkside", line: "Soft", name: "Killer Milk", profiles: ["Milky", "Vanilla", "Sweet"], note: "Sweet milk, almost condensed-milk." },
  { brand: "Darkside", line: "Soft", name: "Sweetlone", profiles: ["Sweet", "Honey"], note: "Honey-floral sweetness." },
  { brand: "Darkside", line: "Soft", name: "Sandy Wave", profiles: ["Peach", "Coconut"], note: "Beach drink — peach + coconut." },
  { brand: "Darkside", line: "Soft", name: "Honey Berry", profiles: ["Honey", "Mixed Berry"], note: "Honeyed berries." },
  { brand: "Darkside", line: "Soft", name: "Sweet Mint", profiles: ["Spearmint", "Sweet"], note: "Soft mint, no chill." },

  // Rare
  { brand: "Darkside", line: "Rare", name: "Basil Blast", profiles: ["Basil"], note: "Fresh basil leaf. Goes great with cool mint base." },
  { brand: "Darkside", line: "Rare", name: "Mojito Skinny", profiles: ["Lime", "Cold Mint", "Mojito"], note: "Mojito in a bowl." },
  { brand: "Darkside", line: "Rare", name: "Whisky Boom", profiles: ["Whisky"], note: "Aromatic whisky, no smoke." },
  { brand: "Darkside", line: "Rare", name: "Cherry Symphony", profiles: ["Cherry", "Rose"], note: "Cherry blossom — floral cherry." },
  { brand: "Darkside", line: "Rare", name: "Saint Mango", profiles: ["Mango"], note: "Ripe mango, pulpy." },

  // Experience (Xperience) — Virginia & Burley blend, urban/racing/gaming naming.
  // Verified against 5starhookah and thehookahlab catalogs.
  { brand: "Darkside", line: "Experience", name: "Bana-Nscr", profiles: ["Banana", "Strawberry", "Sweet"], note: "Sweet banana + ripe strawberry — no sour, no brakes." },
  { brand: "Darkside", line: "Experience", name: "Citrus Wave", profiles: ["Strawberry", "Lemon", "Lime", "Sweet"], note: "Strawberry, lemon, lime lemonade with a light tart edge." },
  { brand: "Darkside", line: "Experience", name: "Grape & Furious", profiles: ["Grape", "Sweet"], note: "Chilled grape soda — full tank." },
  { brand: "Darkside", line: "Experience", name: "Lime Up", profiles: ["Lime", "Lemon"], note: "Sour citrus tonic, crashing wave of tartness." },
  { brand: "Darkside", line: "Experience", name: "Maraschini", profiles: ["Cherry", "Sweet"], note: "Sour-sweet Maraschino cherry liquor." },
  { brand: "Darkside", line: "Experience", name: "Mintslide", profiles: ["Spearmint", "Sweet"], note: "Refreshing mint gum with a sweet aftertaste." },
  { brand: "Darkside", line: "Experience", name: "Mlty Frty", profiles: ["Mixed Berry", "Sweet"], note: "Multi-fruity — layered fruit blend." },
  { brand: "Darkside", line: "Experience", name: "Mohito Yota", profiles: ["Strawberry", "Mojito", "Cold Mint", "Lime"], note: "Sour-sweet strawberry mojito with built-in mint cooling." },
  { brand: "Darkside", line: "Experience", name: "Petrolhead", profiles: ["Mango", "Pineapple", "Passion Fruit", "Lemon"], note: "Mango lemonade + pineapple juice, drifting into tart passion fruit." },
  { brand: "Darkside", line: "Experience", name: "Pine Crime", profiles: ["Grape", "Basil"], note: "Chilled grape soda with an herbal basil touch." },
  { brand: "Darkside", line: "Experience", name: "Pinkmania", profiles: ["Strawberry", "Sweet"], note: "Pink candy — sweet and unapologetic." },
  { brand: "Darkside", line: "Experience", name: "Skeetl Street", profiles: ["Mixed Berry", "Sweet"], note: "Sweet berry candies with a bold rebellious sourness." },
  { brand: "Darkside", line: "Experience", name: "Vandal Cola", profiles: ["Grapefruit", "Cola", "Sweet"], note: "Pink grapefruit with cola — a vandal cocktail." },
]

// MustHave — 125g line. Verified against thehookah.com catalog (87 flavors).
// Profile tags are best-effort based on flavor descriptions from
// worldhookahmarket.com and other sources. Adjust freely.
const MH = (name: string, profiles: string[], note?: string): Flavor => ({
  brand: "MustHave",
  line: "125g",
  name,
  profiles,
  note,
})

export const MUSTHAVE: Flavor[] = [
  MH("Alova", ["Mixed Berry", "Sweet"], "Berry candy blend."),
  MH("Apple Drops", ["Apple", "Anise", "Sweet"], "Green apple candy with an anise accent."),
  MH("Araram", ["Sweet"], "Sweet dessert profile."),
  MH("Baikal", ["Mixed Berry", "Eucalyptus"], "Wild forest berries with a cold eucalyptus breath."),
  MH("Banana Mama", ["Banana", "Sweet"], "Sweet South American banana."),
  MH("Barberry Candy", ["Mixed Berry", "Sweet"], "Nostalgic barberry hard candy."),
  MH("Berry Holls", ["Mixed Berry", "Menthol"], "Berry cough-drop cool."),
  MH("Berry Mors", ["Cranberry", "Mixed Berry"], "Russian cranberry-berry juice."),
  MH("Black Currant", ["Blackcurrant", "Mixed Berry"], "Dark, jammy blackcurrant."),
  MH("Blackberry", ["Blackberry"], "Ripe blackberry."),
  MH("Blueberry", ["Blueberry"], "Plain blueberry."),
  MH("Candy Cow", ["Caramel", "Milky", "Sweet"], "Toffee caramel candy."),
  MH("Caribbean Rum", ["Rum"], "Cane-sugar rum, warm."),
  MH("Charlotte Pie", ["Apple", "Cheesecake", "Sweet"], "Apple charlotte dessert."),
  MH("Cheesecake", ["Cheesecake", "Vanilla", "Sweet"], "Classic cheesecake."),
  MH("Cherry Cola", ["Cherry", "Cola"], "Cherry cola with sour-sweet fruit."),
  MH("Cherry Juice", ["Cherry"], "Pure cherry juice."),
  MH("Choco Mint", ["Chocolate", "Spearmint"], "After-dinner mint chocolate."),
  MH("Christmas Drink", ["Cinnamon", "Mulled Wine", "Sweet"], "Warm spiced winter drink."),
  MH("Cinnamon Roll", ["Cinnamon", "Sweet"], "Sticky cinnamon bun."),
  MH("Citrus Spritz", ["Lemon", "Lime", "Orange"], "Sparkling mixed citrus."),
  MH("Coconut Shake", ["Coconut", "Milky"], "Creamy coconut shake."),
  MH("Cola", ["Cola"], "Pure cola — chooses its own adventure in mixes."),
  MH("Cookie", ["Vanilla", "Chocolate", "Sweet"], "Shortbread chocolate cookie with cream."),
  MH("Cranberry", ["Cranberry"], "Tart Karelian cranberry."),
  MH("Cream Soda", ["Cream Soda", "Vanilla", "Sweet"], "Vanilla cream soda."),
  MH("Cucunade", ["Cucumber", "Lime"], "Cucumber lemonade — spa-day fresh."),
  MH("Earl Grey", ["Earl Grey", "Black Tea"], "Bergamot-forward black tea."),
  MH("Estragon", ["Tarragon", "Sweet"], "Tarkhun — tarragon herbal soda."),
  MH("Feijoa", ["Feijoa"], "Tart Southern feijoa."),
  MH("Fizzy Dizzy", ["Sweet", "Cream Soda"], "Fizzy candy soda."),
  MH("Forest Berries", ["Mixed Berry"], "Bouquet of wild forest berries."),
  MH("Frosty", ["Cold Mint", "Menthol"], "Pure cooling — pairs with anything."),
  MH("Garnet Grape", ["Grape"], "Dark garnet-red grape."),
  MH("Gooseberry", ["Gooseberry", "Mixed Berry"], "Tart green gooseberry."),
  MH("Grapefruit", ["Grapefruit"], "Bitter-bright pink grapefruit."),
  MH("Green Fizz", ["Apple", "Lime"], "Green apple lime soda."),
  MH("Guanapap", ["Guava"], "Tropical guava."),
  MH("Holland Pie", ["Apple", "Cinnamon", "Sweet"], "Dutch apple pie."),
  MH("Honey Holls", ["Honey", "Menthol"], "Honey cough-drop."),
  MH("Ice Cream", ["Vanilla", "Milky"], "Soft-serve vanilla."),
  MH("Ice Mint", ["Cold Mint", "Menthol"], "Strong cold mint."),
  MH("Jumango", ["Mango"], "Ripe mango juice."),
  MH("Kiwi Smoothie", ["Sweet", "Milky"], "Kiwi smoothie."),
  MH("Lemon Lime", ["Lemon", "Lime"], "Sprite vibes."),
  MH("Lemon Pie", ["Lemon", "Vanilla", "Sweet"], "Lemon meringue pie."),
  MH("Lemon Tonic", ["Lemon"], "Sharp lemon tonic."),
  MH("Mad Pear", ["Pear"], "Juicy pear."),
  MH("Mandarin", ["Mandarin", "Orange"], "Warm mandarin slices."),
  MH("Mango Sling", ["Mango"], "Mango cocktail."),
  MH("Maple Pecan", ["Honey", "Vanilla", "Sweet"], "Maple syrup over pecan pastry."),
  MH("Marula", ["Marula"], "South African marula fruit."),
  MH("Masala Tea", ["Masala Tea", "Chai", "Cinnamon"], "Spiced chai."),
  MH("Melonade", ["Watermelon", "Lemon"], "Watermelon lemonade."),
  MH("Milk Oolong", ["Milk Oolong", "Milky"], "Buttery milk oolong tea."),
  MH("Milky Rice", ["Milky", "Sweet"], "Rice pudding."),
  MH("Morocco", ["Spearmint", "Cold Mint", "Sweet"], "Maghrebi mint tea."),
  MH("Mulled Wine", ["Mulled Wine", "Cinnamon"], "Spiced hot wine."),
  MH("Nord Star", ["Cold Mint", "Menthol"], "Polar mint cool."),
  MH("Orange Team", ["Orange"], "Pure orange juice."),
  MH("Paradise", ["Mango", "Pineapple", "Passion Fruit"], "Tropical fruit mix."),
  MH("Passion Plum", ["Passion Fruit", "Plum"], "Passion fruit + dark plum."),
  MH("Pearl Pool", ["Lychee", "Milky"], "Bubble-tea lychee."),
  MH("Pineapple Rings", ["Pineapple", "Sweet"], "Candied pineapple rings."),
  MH("Pinkman", ["Grapefruit", "Strawberry", "Raspberry"], "Pink grapefruit + strawberry, raspberry syrup."),
  MH("Pistachio", ["Pistachio", "Milky", "Sweet"], "Pistachio cream — perfect alongside your latte."),
  MH("Quince", ["Quince", "Apple", "Anise"], "Sweet-tart quince with light anise."),
  MH("Raspberry", ["Raspberry"], "Pure raspberry."),
  MH("Red Bomb", ["Mixed Berry", "Sweet"], "Red berry candy explosion."),
  MH("Red Tea", ["Red Tea"], "Rooibos / red tea."),
  MH("Ruby Grape", ["Grape"], "Ruby-red grape."),
  MH("Rocketman", ["Mixed Berry", "Sweet"], "Berry rocket candy."),
  MH("Sea Buckthorn Tea", ["Sea Buckthorn", "Grapefruit"], "Sea buckthorn + grapefruit + ginger."),
  MH("Space Flavour", ["Mixed Berry", "Sweet"], "Cosmic berry candy."),
  MH("Strawberry", ["Strawberry"], "Ripe strawberry."),
  MH("Strawberry Lychee", ["Strawberry", "Lychee"], "Wild strawberry + exotic lychee."),
  MH("Sweet Melon", ["Melon", "Cantaloupe"], "Honeydew melon."),
  MH("Sweet Peach", ["Peach", "Sweet"], "Ripe sweet peach."),
  MH("Tipsy", ["Whisky"], "Whisky cocktail."),
  MH("Tropic Juice", ["Pineapple", "Passion Fruit"], "Pineapple + passion fruit nectar."),
  MH("Unicorn Treats", ["Milky", "Sweet"], "Corn sticks + marshmallow + meringue."),
  MH("Vanilla Cream", ["Vanilla", "Milky"], "Soft vanilla cream — dessert base."),
  MH("Violet", ["Violet", "Rose"], "Candied violet flower."),
  MH("Watermelon", ["Watermelon"], "Pure watermelon."),
  MH("Sour Apple", ["Apple"], "Tart green apple."),
  MH("Sour Berries", ["Mixed Berry"], "Tart berry candy."),
  MH("Sour Tropic", ["Mango", "Pineapple", "Passion Fruit"], "Tart tropical mix."),
]

export const CATALOG: Flavor[] = [...DARKSIDE, ...MUSTHAVE]

export function flavorId(f: Flavor): string {
  return `${f.brand}::${f.line}::${f.name}`
}

export function findFlavor(id: string): Flavor | undefined {
  return CATALOG.find((f) => flavorId(f) === id)
}
