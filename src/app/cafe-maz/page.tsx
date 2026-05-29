import Link from "next/link"
import styles from "./index.module.css"

const TILES = [
  {
    num: "№ 01 · For Guests",
    title: "The Café",
    ar: "الموقع",
    href: "/cafe-maz/cafe",
    meta: "Single page — menu, hookah combos, the welcome. The link you send before they come over.",
  },
  {
    num: "№ 02 · For Guests",
    title: "Print Menu",
    ar: "القائمة",
    href: "/cafe-maz/menu",
    meta: "A5 duplex — drinks on the front, hookah on the back. Designed for an evening at the counter.",
  },
  {
    num: "№ 03 · For Me",
    title: "Recipe Book",
    ar: "الوصفات",
    href: "/cafe-maz/recipes",
    meta: "Ratios, grinds, milk matrix, hookah pack notes, house combos. Behind the bar.",
  },
  {
    num: "№ 04 · For Me",
    title: "Flavor Lab",
    ar: "المختبر",
    href: "/cafe-maz/lab",
    meta: "Brainstorm hookah combos with Claude. Pick profiles, set a mood, save bowls.",
  },
]

export default function CafeMazIndexPage() {
  return (
    <main className={styles.card}>
      <span className={`${styles.corner} ${styles.tl}`} />
      <span className={`${styles.corner} ${styles.tr}`} />
      <span className={`${styles.corner} ${styles.bl}`} />
      <span className={`${styles.corner} ${styles.br}`} />

      <p className={styles.eyebrow}>— Est. 2026 · A one-table café —</p>
      <h1 className={styles.wordmark}>
        CAFÉ <span className={styles.acc}>MAZ</span>
      </h1>
      <div className={styles.ar} lang="ar" dir="rtl">كافيه ماز</div>
      <p className={styles.tag}>— open whenever you&apos;re over —</p>

      <div className={styles.ornament}>
        <span className={styles.ornLine} />
        <span className={styles.ornStar}>✦</span>
        <span className={styles.ornLine} />
      </div>

      <p className={styles.intro}>
        Four pieces live here: a small website for guests to glance at before they arrive, a
        printable menu for the counter, a private barista book just for me, and a flavor lab to
        brainstorm bowls. Pick a door.
      </p>

      <div className={styles.grid}>
        {TILES.map((t) => (
          <Link key={t.href} className={styles.tile} href={t.href}>
            <span className={styles.tileNum}>{t.num}</span>
            <h3 className={styles.tileH3}>
              {t.title}
              <span className={styles.tileAr} lang="ar">{t.ar}</span>
            </h3>
            <p className={styles.tileMeta}>{t.meta}</p>
            <span className={styles.arrow}>→</span>
          </Link>
        ))}
      </div>

      <div className={styles.foot}>
        <span>v0.3 · candlelit edition</span>
        <span>made at the kitchen counter</span>
      </div>
    </main>
  )
}
