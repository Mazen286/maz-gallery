import Link from "next/link"
import { HOOKAH_COMBOS } from "@/lib/cafe-maz"
import styles from "./recipes.module.css"

type SpecRow = { k: string; v: string }
type Recipe = {
  rid: string
  name: string
  star?: string
  blurb: string
  steps: { text: string; subhead?: boolean }[]
  spec: SpecRow[]
  note?: string
}

const ESPRESSO_RECIPES: Recipe[] = [
  {
    rid: "D · 01",
    name: "Espresso",
    blurb: "The whole machine in one sip. If this is dialed, everything else falls in line.",
    steps: [
      { text: "Pre-warm a demitasse with hot water." },
      { text: "Pull a <b>double</b> — 18g in, 36g out, 27–32s." },
      { text: "Serve immediately. No stirring, no waiting." },
    ],
    spec: [
      { k: "Dose", v: "18 g" },
      { k: "Yield", v: "36 g" },
      { k: "Time", v: "27–32 s" },
      { k: "Cup", v: "demitasse" },
    ],
    note: "Sour = grind finer / longer time. Bitter = coarser / shorter.",
  },
  {
    rid: "D · 02",
    name: "Macchiato",
    blurb: "Espresso with a stain. A spoon of foam, nothing more.",
    steps: [
      { text: "Pull a <b>double espresso</b> into a 3 oz cup." },
      { text: "Steam ~50ml milk to dense microfoam." },
      { text: "Spoon a <b>quarter-sized</b> dollop of foam onto the crema." },
    ],
    spec: [
      { k: "Espresso", v: "36 g" },
      { k: "Milk foam", v: "~1 tsp" },
      { k: "Cup", v: "3 oz" },
    ],
    note: "If the foam disappears into the crema, it was too wet. Steam drier.",
  },
  {
    rid: "D · 03",
    name: "Cortado",
    blurb: "Equal weight espresso and milk. Should taste like coffee, not milk.",
    steps: [
      { text: "Pull a <b>double espresso</b> into a 4.5 oz Gibraltar." },
      { text: "Steam ~70ml milk to <b>thin</b> microfoam (60°C)." },
      { text: "Pour from low, no art needed — just integrate." },
    ],
    spec: [
      { k: "Espresso", v: "36 g" },
      { k: "Milk", v: "~70 ml" },
      { k: "Ratio", v: "1 : 1" },
      { k: "Milk temp", v: "60 °C" },
    ],
  },
  {
    rid: "D · 04",
    name: "Americano",
    blurb: "Espresso lengthened. Water first, then espresso, to preserve crema.",
    steps: [
      { text: "Add <b>120ml hot water</b> (~85°C) to an 8 oz cup." },
      { text: "Pull a <b>double espresso</b> directly into the water." },
      { text: "Don't stir — let the crema layer rest on top." },
    ],
    spec: [
      { k: "Espresso", v: "36 g" },
      { k: "Water", v: "120 ml" },
      { k: "Water temp", v: "~85 °C" },
      { k: "Cup", v: "8 oz" },
    ],
  },
]

const TEA_RECIPES: Recipe[] = [
  {
    rid: "T · 01",
    name: "Mint Tea",
    star: "MAGHREBI",
    blurb:
      "Gunpowder green tea, fresh mint, sugar to taste. The pour is the show — pour from a height so foam forms on the surface.",
    steps: [
      {
        text: "Add <b>1 tbsp gunpowder green tea</b> to a small pot; rinse with boiling water and discard (removes bitterness).",
      },
      {
        text: "Add <b>a handful of fresh spearmint</b> + <b>2 tbsp sugar</b> + <b>250ml boiling water</b>.",
      },
      { text: "Simmer 3–4 min on low. Don't boil the leaves." },
      {
        text: "Pour from <b>12 inches up</b> into a small glass — foam should form. Re-pour into pot once to mix.",
      },
    ],
    spec: [
      { k: "Tea", v: "1 tbsp" },
      { k: "Mint", v: "handful" },
      { k: "Sugar", v: "2 tbsp" },
      { k: "Water", v: "250 ml" },
      { k: "Vessel", v: "glass" },
    ],
    note: "Pour height is for foam & aerating. Less sugar for guests; the real recipe uses more.",
  },
  {
    rid: "T · 02",
    name: "Matcha",
    blurb:
      "Whisked, not stirred. Use <b>ceremonial</b> for straight, <b>culinary</b> for latte. Sift the powder — it clumps.",
    steps: [
      { text: "Straight · usucha", subhead: true },
      { text: "Sift <b>2g matcha</b> (1 tsp) into a bowl through a fine mesh." },
      { text: "Add <b>70ml water at 75–80°C</b> (not boiling!)." },
      {
        text: "Whisk in a <b>W or M motion</b> (not circles) for 15–20s until frothy. Foam should be fine, not bubbly.",
      },
      { text: "Matcha Latte", subhead: true },
      { text: "Make matcha as above with <b>50ml water</b>." },
      { text: "Steam <b>200ml whole milk</b> to silky microfoam (60°C)." },
      {
        text: "Pour milk into matcha bowl, fold to integrate. Optional: <b>1 tsp honey</b> or <b>orange blossom water</b>.",
      },
    ],
    spec: [
      { k: "Matcha", v: "2 g" },
      { k: "Water", v: "70 ml" },
      { k: "Water temp", v: "75–80 °C" },
      { k: "Whisk", v: "bamboo, W" },
      { k: "Latte milk", v: "200 ml" },
    ],
    note: "Bitter = water too hot. Grainy = didn't sift. Store matcha in fridge, sealed.",
  },
  {
    rid: "T · 03",
    name: "Turkish Coffee",
    star: "CEZVE",
    blurb:
      "Slow, unfiltered, served in demitasse. The foam (<em>köpük</em>) is the soul — if you don't get foam, start over.",
    steps: [
      {
        text: "For each cup: <b>2 tsp Turkish-ground coffee</b> (much finer than espresso) + <b>1/2 tsp sugar</b> + optional <b>1 cardamom pod or pinch ground</b>.",
      },
      { text: "Add <b>60ml cold water per cup</b> to the cezve. Stir once." },
      { text: "Heat on <b>low</b>. Do not stir again. Watch closely." },
      {
        text: "When foam rises (just before boil), <b>spoon foam into each cup</b>. Return to heat briefly.",
      },
      {
        text: "Let it rise once more, then pour the rest. Serve immediately with <b>a glass of cold water</b> and a small sweet.",
      },
    ],
    spec: [
      { k: "Coffee", v: "2 tsp / cup" },
      { k: "Water", v: "60 ml / cup" },
      { k: "Sugar", v: "1/2 tsp = orta" },
      { k: "Cardamom", v: "1 pod, optional" },
      { k: "Heat", v: "low · 3–4 min" },
    ],
    note: "Sweetness levels: sade (none), az şekerli (1/4 tsp), orta (1/2), şekerli (1 full). Ask first.",
  },
]

const PISTACHIO: Recipe = {
  rid: "D · 08",
  name: "Pistachio Latte",
  star: "★ HOUSE",
  blurb:
    "The signature. Salt is the trick — without it, pistachio reads as \"vague nut.\" With it, it reads as pistachio.",
  steps: [
    { text: "Pistachio Cream · batch · keeps 5 days", subhead: true },
    {
      text: "Blend <b>120g raw shelled pistachios</b> (lightly toasted) with <b>200ml whole milk</b> and <b>40g condensed milk</b>.",
    },
    {
      text: "Add <b>a pinch of sea salt</b> + <b>2 drops orange blossom water</b> (optional but recommended).",
    },
    { text: "Strain through fine mesh. Store in squeeze bottle. Shake before use." },
    { text: "Build", subhead: true },
    { text: "Add <b>25ml pistachio cream</b> to a 10 oz cup." },
    { text: "Pull a <b>double espresso</b> over the cream — stir briefly." },
    { text: "Steam 200ml whole milk to silky microfoam; pour from height." },
    { text: "Finish with <b>crushed pistachio dust</b> on the foam. That's the photo." },
  ],
  spec: [
    { k: "Cream", v: "25 ml" },
    { k: "Espresso", v: "36 g" },
    { k: "Milk", v: "200 ml" },
    { k: "Cup", v: "10 oz" },
    { k: "Garnish", v: "pistachio" },
  ],
  note: "Iced: skip steam, shake espresso + cream + ice, pour over cold milk.",
}

function RecipeCard({ r }: { r: Recipe }) {
  return (
    <div className={styles.recipe}>
      <div>
        <div className={styles.recipeHead}>
          <span className={styles.rid}>{r.rid}</span>
          <h3 className={styles.recipeH3}>{r.name}</h3>
          {r.star && <span className={styles.starBadge}>{r.star}</span>}
        </div>
        <p className={styles.blurb} dangerouslySetInnerHTML={{ __html: r.blurb }} />
        <ol className={styles.steps}>
          {r.steps.map((s, i) => (
            <li
              key={i}
              className={s.subhead ? styles.subhead : ""}
              dangerouslySetInnerHTML={{ __html: s.text }}
            />
          ))}
        </ol>
      </div>
      <aside className={styles.spec}>
        <span className={`${styles.specCorner} ${styles.tl}`} />
        <span className={`${styles.specCorner} ${styles.tr}`} />
        <span className={`${styles.specCorner} ${styles.bl}`} />
        <span className={`${styles.specCorner} ${styles.br}`} />
        <div className={styles.specTitle}>— Spec —</div>
        {r.spec.map((row) => (
          <div key={row.k} className={styles.specRow}>
            <span className={styles.k}>{row.k}</span>
            <span className={styles.v}>{row.v}</span>
          </div>
        ))}
        {r.note && <div className={styles.specNote}>{r.note}</div>}
      </aside>
    </div>
  )
}

export default function RecipesPage() {
  return (
    <>
      <div className={styles.privateTape}>
        <span>※</span> PRIVATE · for Maz only{" "}
        <span className={styles.tapeAr} lang="ar">— لماز فقط —</span>{" "}
        <span>※</span>
      </div>

      <article className={styles.book}>
        {/* COVER */}
        <section className={styles.cover}>
          <p className={styles.coverEyebrow}>— The Barista Book —</p>
          <h1 className={styles.coverH1}>
            CAFÉ <span className={styles.acc}>MAZ</span>
          </h1>
          <div className={styles.coverAr} lang="ar" dir="rtl">كافيه ماز</div>
          <p className={styles.coverSub}>recipes, ratios, &amp; the things I&apos;ll forget</p>
          <div className={styles.pill}>FOR MAZ · DO NOT PRINT</div>
        </section>

        {/* CH 01 — Setup */}
        <section className={styles.chapter}>
          <div className={styles.chHead}>
            <span className={styles.chNo}>Ch. 01</span>
            <h2 className={styles.chH2}>The Setup</h2>
            <span className={styles.chAr} lang="ar" dir="rtl">— التحضير</span>
            <span className={styles.chRule} />
          </div>
          <p className={styles.lede}>
            Defaults for the kitchen counter. Everything else builds on this — if the espresso
            isn&apos;t right, the drink isn&apos;t right. Start here.
          </p>
          <div className={styles.params}>
            {[
              { lbl: "Beans", val: "House blend", unit: "(rotating)" },
              { lbl: "Grind", val: "8.5", unit: "on the dial" },
              { lbl: "Dose", val: "18", unit: "g in" },
              { lbl: "Yield", val: "36", unit: "g out" },
              { lbl: "Time", val: "27–32", unit: "sec" },
              { lbl: "Water", val: "93", unit: "°C" },
              { lbl: "Pressure", val: "9", unit: "bar" },
              { lbl: "Milk", val: "Whole", unit: "3.5%" },
            ].map((p) => (
              <div key={p.lbl} className={styles.param}>
                <div className={styles.lbl}>{p.lbl}</div>
                <div className={styles.val}>
                  {p.val}
                  <span className={styles.unit}>{p.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.pullNote}>
            <span className={styles.pullHead}>Pre-flight</span>
            WDT 8 sec, light tamp (15 lb), purge group 2 sec before locking in. Wipe steam wand after
            every drink. Always.
          </div>
        </section>

        {/* CH 02 — Espresso */}
        <section className={styles.chapter}>
          <div className={styles.chHead}>
            <span className={styles.chNo}>Ch. 02</span>
            <h2 className={styles.chH2}>Espresso</h2>
            <span className={styles.chAr} lang="ar" dir="rtl">— إسبريسو</span>
            <span className={styles.chRule} />
          </div>
          {ESPRESSO_RECIPES.map((r) => (
            <RecipeCard key={r.rid} r={r} />
          ))}
        </section>

        {/* CH 03 — With Milk */}
        <section className={styles.chapter}>
          <div className={styles.chHead}>
            <span className={styles.chNo}>Ch. 03</span>
            <h2 className={styles.chH2}>With Milk</h2>
            <span className={styles.chAr} lang="ar" dir="rtl">— بالحليب</span>
            <span className={styles.chRule} />
          </div>
          <p className={styles.lede}>
            Steam rule of thumb: hand-on-pitcher until it&apos;s{" "}
            <b className={styles.bAccent}>too hot to hold for 3 seconds</b> (~60–65°C). Stop there.
          </p>
          <table className={styles.matrix}>
            <thead>
              <tr>
                <th>Drink</th>
                <th>Espresso</th>
                <th>Milk vol.</th>
                <th>Foam</th>
                <th>Cup</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Cappuccino", "36 g", "120 ml", "1.5 cm", "6 oz", "Dense foam, defined crown."],
                ["Flat White", "36 g", "150 ml", "0.5 cm", "6 oz", "Silky microfoam, latte-art ready."],
                ["Latte", "36 g", "220 ml", "1 cm", "10 oz", "Pour from height to fold foam in."],
                [
                  "Mocha",
                  "36 g",
                  "200 ml",
                  "0.5 cm",
                  "10 oz",
                  "15g dark chocolate ganache in cup, then espresso, then milk.",
                ],
                [
                  "Hot Chocolate",
                  "—",
                  "240 ml",
                  "0.5 cm",
                  "10 oz",
                  "25g 70% dark + 5g cocoa, melt with steam wand.",
                ],
              ].map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td className={styles.num}>{row[1]}</td>
                  <td className={styles.num}>{row[2]}</td>
                  <td className={styles.num}>{row[3]}</td>
                  <td className={styles.num}>{row[4]}</td>
                  <td className={styles.matrixNote}>{row[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* CH 04 — Tea & Slow Coffees */}
        <section className={styles.chapter}>
          <div className={styles.chHead}>
            <span className={styles.chNo}>Ch. 04</span>
            <h2 className={styles.chH2}>Tea &amp; Slow Coffees</h2>
            <span className={styles.chAr} lang="ar" dir="rtl">— شاي وقهوة</span>
            <span className={styles.chRule} />
          </div>
          <p className={styles.lede}>
            For when the espresso machine isn&apos;t the answer. Mint tea poured high, matcha whisked
            smooth, Turkish coffee that won&apos;t be rushed.
          </p>
          {TEA_RECIPES.map((r) => (
            <RecipeCard key={r.rid} r={r} />
          ))}
          <p className={styles.smallHead}>— Quick Steeps —</p>
          <table className={styles.matrix}>
            <thead>
              <tr>
                <th>Tea</th>
                <th>Leaf</th>
                <th>Water temp</th>
                <th>Steep</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Black Tea", "2 g / cup", "95 °C", "3–4 min", "Earl Grey, English Breakfast. Milk & sugar on request."],
                [
                  "Green Tea",
                  "1.5 g / cup",
                  "75–80 °C",
                  "2 min",
                  "Boil and rest the kettle 3 min before pouring. Bitter if too hot.",
                ],
                [
                  "Cardamom Coffee",
                  "36 g espresso",
                  "—",
                  "—",
                  "Crush 1 fresh cardamom pod into portafilter before locking. Or dust on crema.",
                ],
              ].map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td className={styles.num}>{row[1]}</td>
                  <td className={styles.num}>{row[2]}</td>
                  <td className={styles.num}>{row[3]}</td>
                  <td className={styles.matrixNote}>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* CH 05 — Pistachio Latte */}
        <section className={styles.chapter}>
          <div className={styles.chHead}>
            <span className={styles.chNo}>Ch. 05</span>
            <h2 className={styles.chH2}>The Pistachio Latte</h2>
            <span className={styles.chAr} lang="ar" dir="rtl">— لاتيه الفستق</span>
            <span className={styles.chRule} />
          </div>
          <RecipeCard r={PISTACHIO} />
        </section>

        {/* CH 06 — Hookah */}
        <section className={styles.chapter}>
          <div className={styles.chHead}>
            <span className={styles.chNo}>Ch. 06</span>
            <h2 className={styles.chH2}>The Hookah</h2>
            <span className={styles.chAr} lang="ar" dir="rtl">— الأرجيلة</span>
            <span className={styles.chRule} />
          </div>

          <div className={styles.hookahSpec}>
            <div>
              <h4 className={styles.hSpecH}>— Standard Pack —</h4>
              <ul className={styles.hSpecUl}>
                {[
                  ["Bowl", "phunnel · ~14g"],
                  ["Pack style", "fluffy · level rim"],
                  ["HMD", "Kaloud Lotus"],
                  ["Coal", "3× 26mm coconut"],
                  ["Coal heat", "fully ashed both sides"],
                  ["Heat mgmt", "rotate 2 coals @ 25 min"],
                  ["Session", "~75–90 min"],
                ].map(([k, v]) => (
                  <li key={k}>
                    <span>{k}</span>
                    <b>{v}</b>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className={styles.hSpecH}>— Pre-Session —</h4>
              <ul className={styles.hSpecUl}>
                {[
                  ["Base water", "1\" above downstem"],
                  ["Ice", "3 cubes · optional"],
                  ["Wash hose", "blow + hot rinse"],
                  ["Mouth tip", "fresh per guest"],
                  ["Plate", "dates + cold water"],
                  ["Music", "not loud · tarab or jazz"],
                  ["Coal timer", "25 min on phone"],
                ].map(([k, v]) => (
                  <li key={k}>
                    <span>{k}</span>
                    <b>{v}</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className={styles.lede} style={{ margin: "14px 0 18px" }}>
            Profiles, not brands — we keep two shelves:{" "}
            <b className={styles.bBrand}>Darkside</b> (workhorse, dark leaf, long session) and{" "}
            <b className={styles.bBrand}>MustHave</b> (lighter, fruit-forward, gentle entry).
            Translate the profile into whichever brand sits closest that night.
          </p>

          {HOOKAH_COMBOS.map((c) => (
            <div key={c.name} className={styles.comboCard}>
              <span className={styles.cnum}>
                {c.num}
                {c.note && ` · ${c.note}`}
              </span>
              <h3 className={styles.comboH3}>{c.name}</h3>
              <div className={styles.comboAr} lang="ar">{c.ar}</div>
              <p className={styles.comboDesc}>{c.desc}</p>
              {c.ratios && (
                <div className={styles.ratios}>
                  {c.ratios.map((r) => (
                    <div key={r.name} className={styles.ratio}>
                      <div className={styles.pct}>{r.pct}</div>
                      <div className={styles.ratioName}>{r.name}</div>
                      {r.shelf && (
                        <div className={styles.shelfRef}>
                          <span className={styles.shelfBrand}>{r.shelf.brand} · {r.shelf.line}</span>
                          <span className={styles.shelfFlavor}>{r.shelf.flavor}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className={styles.pullNote}>
            <span className={styles.pullHead}>Note to self</span>
            If clouds are thin: too little tobacco, or coals too cool. If harsh: pull a coal, give it
            a minute. Patience. Always patience.
          </div>
        </section>

        {/* CH 07 — Quick Ref */}
        <section className={`${styles.chapter} ${styles.chapterLast}`}>
          <div className={styles.chHead}>
            <span className={styles.chNo}>Ch. 07</span>
            <h2 className={styles.chH2}>Quick Reference</h2>
            <span className={styles.chAr} lang="ar" dir="rtl">— مرجع سريع</span>
            <span className={styles.chRule} />
          </div>
          <div className={`${styles.params} ${styles.params3}`}>
            {[
              ["Espresso sours", "grind finer · push time"],
              ["Espresso bitters", "coarser · shorter"],
              ["Milk gritty", "wand too deep · raise it"],
              ["Hookah harsh", "pull a coal · wait 60s"],
              ["Hookah weak", "rotate coals · add 4th"],
              ["Guest is quiet", "offer dates · top up water"],
            ].map(([lbl, val]) => (
              <div key={lbl} className={styles.param}>
                <div className={styles.lbl}>{lbl}</div>
                <div className={styles.valItalic}>{val}</div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.colophon}>
          Café Maz · The Barista Book
          <br />
          <Link href="/cafe-maz" className={styles.colLink}>
            ← back to index
          </Link>
        </div>
      </article>
    </>
  )
}
