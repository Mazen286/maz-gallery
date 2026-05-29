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
  { label: "Tropical", profiles: ["Mango", "Pineapple", "Passion Fruit", "Coconut", "Lychee", "Banana", "Guava", "Kiwi", "Papaya", "Marula", "Feijoa"] },
  { label: "Stone & Crisp", profiles: ["Peach", "Apricot", "Plum", "Cherry", "Apple", "Pear", "Quince", "Grape", "Watermelon", "Cantaloupe", "Melon"] },
  { label: "Citrus", profiles: ["Lemon", "Lime", "Orange", "Mandarin", "Grapefruit", "Sea Buckthorn"] },
  { label: "Herbal · Floral", profiles: ["Basil", "Pine", "Tarragon", "Cucumber", "Rose", "Violet", "Hibiscus", "Lavender", "Cardamom"] },
  { label: "Sweet · Cream", profiles: ["Vanilla", "Caramel", "Chocolate", "Honey", "Milky", "Cheesecake", "Pistachio", "Sweet"] },
  { label: "Tea & Beverage", profiles: ["Earl Grey", "Black Tea", "Red Tea", "Masala Tea", "Milk Oolong", "Cinnamon", "Anise", "Coffee", "Chai", "Mojito", "Whisky", "Rum", "Mulled Wine", "Cigar", "Cola", "Cream Soda"] },
]

// Darkside.
//
// "Standard" = the 200g standard range. The retailer dropdown lists these
// as a single dropdown without distinguishing Core/Medium/Soft/Rare lines,
// so we group them here as "Standard". Line subdivisions exist on the
// brand side but aren't broken out by 5StarHookah / HookahJohn at retail.
//
// "Experience" = the Xperience burley-based line (verified separately).
//
// Sources: hookahjohn.com Darkside 200g variant dropdown (58 standard),
// 5starhookah.com + thehookahlab.com Xperience pages (13).
const DS = (name: string, profiles: string[], note?: string): Flavor => ({
  brand: "Darkside",
  line: "Standard",
  name,
  profiles,
  note,
})

export const DARKSIDE: Flavor[] = [
  DS("Admiral Acabar", ["Mixed Berry", "Sweet", "Milky"], "Sweet oatmeal with berries."),
  DS("Bananapapa", ["Banana", "Papaya"], "Ripe banana with mellow papaya."),
  DS("Barvy Orange", ["Orange"], "Bright orange juice."),
  DS("Basil Blast", ["Basil"], "Fresh green basil. Mixes great with cold mint."),
  DS("Bergamonstr", ["Earl Grey", "Black Tea"], "Bergamot black tea — Earl Grey in a bowl."),
  DS("Bloody Orange", ["Orange"], "Blood orange, sharper than regular."),
  DS("Blueberry Blast", ["Blueberry"], "Pure blueberry."),
  DS("Bounty Hunter", ["Coconut", "Chocolate"], "Coconut base with dark chocolate notes."),
  DS("Brazil Breeze", ["Mango", "Pineapple"], "Tropical breeze."),
  DS("Cherry Rocks", ["Cherry", "Sweet"], "Intense cherry candy with sour aftertaste."),
  DS("Cream Soda", ["Cream Soda", "Vanilla", "Sweet"], "Classic vanilla cream soda."),
  DS("Crystal Grape", ["Grape"], "Crisp white grape."),
  DS("Cyber Kiwi", ["Kiwi", "Sweet"], "Sweet ripe kiwi smoothie with tang."),
  DS("Dark Ice Cream", ["Chocolate", "Vanilla", "Milky"], "Chocolate-chip ice cream."),
  DS("Dark Melon", ["Melon", "Watermelon"], "Mixed melon."),
  DS("DarkSide Mint", ["Spearmint", "Cold Mint"], "Intense peppermint."),
  DS("Darkside Cola", ["Cola", "Caramel"], "Cola with caramel and a lemon wedge."),
  DS("Deep Blue Sea", ["Blueberry", "Mixed Berry"], "Blue raspberry / berry."),
  DS("Desert Eagle", ["Mixed Berry", "Sweet"], "Cactus fruit, sweet with a tart finish."),
  DS("Dark Peach 2.0", ["Peach"], "Ripe peach, juicy."),
  DS("Falling Star", ["Mango", "Passion Fruit"], "Mango + passion fruit cocktail."),
  DS("Fruitality", ["Mixed Berry", "Sweet"], "Mixed fruit candy."),
  DS("Generis Raspberry", ["Raspberry"], "Sweet delicate raspberry."),
  DS("Glitch IceTea", ["Peach", "Black Tea"], "Refreshing peach iced tea."),
  DS("Goosebumps", ["Gooseberry"], "Tart gooseberry."),
  DS("Grape Core", ["Grape"], "Concentrated grape."),
  DS("Green Mist", ["Cold Mint", "Eucalyptus"], "Cool herbal mint mist."),
  DS("Guava Rebel", ["Guava"], "Tropical guava."),
  DS("Honey Dust", ["Honey", "Sweet"], "Honeyed sweetness. The honey base."),
  DS("Ice Greeny", ["Cold Mint", "Menthol"], "Icy green mint."),
  DS("Kalee Grapefruit", ["Grapefruit"], "Sharp pink grapefruit."),
  DS("Killer Milk", ["Milky", "Vanilla", "Sweet"], "Sweet milk, almost condensed."),
  DS("Lemonblast", ["Lemon"], "Bright lemon."),
  DS("Mango Lassi 2.0", ["Mango", "Cardamom", "Milky"], "Mango lassi — mango + cardamom + cream. The closest pure cardamom on the Darkside shelf."),
  DS("MJ 2.0", ["Mixed Berry", "Sweet"], "Fruit candy blend (the MJ remake)."),
  DS("Needls", ["Pine"], "Sharp pine needle, almost juniper."),
  DS("Nordberry", ["Mixed Berry"], "Northern berry blend."),
  DS("Passion", ["Passion Fruit"], "Pure passion fruit."),
  DS("Pear", ["Pear"], "Tender sweet pear."),
  DS("Pineapple Pulse", ["Pineapple"], "Bright ripe pineapple."),
  DS("Polar Cream", ["Cold Mint", "Milky"], "Icy cream — cool + creamy."),
  DS("Pomelow", ["Grapefruit", "Lemon"], "Pomelo citrus."),
  DS("Red Alert", ["Mixed Berry", "Cherry"], "Red berry punch."),
  DS("Red Jam", ["Mixed Berry", "Sweet"], "Berry jam."),
  DS("Red Tea", ["Red Tea", "Hibiscus", "Mixed Berry"], "Hibiscus tea with berries."),
  DS("Retro Apple", ["Apple"], "Crisp red apple."),
  DS("Space Jam", ["Mixed Berry", "Raspberry"], "Mixed-berry sorbet."),
  DS("Space Lychee", ["Lychee"], "Sweet floral lychee."),
  DS("StarLime", ["Lime"], "Bright lime."),
  DS("Supermint", ["Spearmint", "Cold Mint"], "Classic mint, balanced."),
  DS("Sweet Comet", ["Cranberry", "Sweet"], "Tangy cranberry."),
  DS("TOP GUM", ["Sweet"], "Bubblegum candy."),
  DS("Torpedo", ["Watermelon", "Melon"], "Watermelon + melon."),
  DS("Ultranova / Super Nova", ["Cold Mint", "Menthol"], "Your house cold-mint base — anchor of nearly every bowl."),
  DS("Virgin Peach", ["Peach"], "Pure juicy peach."),
  DS("Waffle Shuffle", ["Honey", "Vanilla", "Sweet"], "Waffle + maple syrup."),
  DS("Wild Forest", ["Strawberry"], "Strong strawberry — the standout."),
  DS("Wildberry", ["Raspberry", "Blackberry", "Blueberry", "Mixed Berry"], "Forest-berry trio."),

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
