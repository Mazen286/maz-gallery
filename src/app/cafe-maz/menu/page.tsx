"use client"

import Link from "next/link"
import { DRINK_SECTIONS, HOOKAH_COMBOS } from "@/lib/cafe-maz"
import styles from "./menu.module.css"

export default function PrintMenuPage() {
  return (
    <main className={styles.root}>
      <div className={styles.meta}>
        <span>
          <Link href="/cafe-maz">← Café Maz / Index</Link>
        </span>
        <div className={styles.specs}>
          <span>A5 · 5.5 × 8.5 in</span>
          <span>Front + Back</span>
          <span>Duplex Print</span>
        </div>
      </div>

      <div className={styles.lead}>
        <p className={styles.leadEyebrow}>— The Menu · Print Edition —</p>
        <h1 className={styles.leadH1}>Café Maz</h1>
        <div className={styles.leadAr} lang="ar" dir="rtl">كافيه ماز</div>
        <p className={styles.leadTag}>
          — printable at A5, duplex · front for drinks, back for hookah —
        </p>
      </div>

      <p className={styles.mobileNote}>
        Card preview is hidden on phones. Tap below to print or save as PDF, or open
        on desktop to see the layout.
      </p>

      <div className={styles.spread}>
        <div className={styles.pageWrap}>
          <div className={styles.card}>
            <span className={styles.keystone} />
            <div className={styles.arch} />
            <div className={styles.inner}>
              <div className={styles.cEyebrow}>— A One-Table Café —</div>
              <h1 className={styles.cWordmark}>
                CAFÉ <span className={styles.acc}>MAZ</span>
              </h1>
              <div className={styles.cAr} lang="ar" dir="rtl">كافيه ماز</div>
              <p className={styles.cTag}>open whenever you&apos;re over</p>

              <div className={styles.cOrn}>
                <span className={styles.ornLine} />
                <span className={styles.ornStar}>✦</span>
                <span className={styles.ornLine} />
              </div>

              {DRINK_SECTIONS.map((s) => (
                <div key={s.id}>
                  <div className={styles.cSection}>
                    <span className={styles.sectionLat}>— {s.lat} —</span>
                    <span className={styles.sectionAr} lang="ar">{s.ar}</span>
                  </div>
                  <ul className={styles.cItems}>
                    {s.items.map((d) => (
                      <li
                        key={d.name}
                        className={`${styles.cItem} ${d.featured ? styles.featured : ""}`}
                      >
                        <span className={styles.itemName}>{d.name}</span>
                        <span className={styles.itemDesc}>{d.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className={styles.cFoot}>— turn for hookah —</div>
            </div>
          </div>
          <span className={styles.pageLabel}>— front —</span>
        </div>

        <div className={styles.pageWrap}>
          <div className={styles.card}>
            <span className={styles.keystone} />
            <div className={styles.arch} />
            <div className={styles.inner}>
              <div className={styles.cEyebrow}>— After Sundown —</div>
              <div className={styles.cBackHead}>
                <h2 className={styles.cBackTitle}>THE HOOKAH</h2>
                <div className={styles.cBackAr} lang="ar" dir="rtl">الأرجيلة</div>
                <p className={styles.cBackTag}>
                  poured by hand · combos by Maz
                  <br />— Ultra-cool mint is the foundation —
                </p>
              </div>

              <div className={styles.cOrn}>
                <span className={styles.ornLine} />
                <span className={styles.ornStar}>✦</span>
                <span className={styles.ornLine} />
              </div>

              <div className={styles.cSection}>
                <span className={styles.sectionLat}>— House Combos —</span>
                <span className={styles.sectionAr} lang="ar">من البيت</span>
              </div>

              {HOOKAH_COMBOS.map((c) => (
                <div key={c.name} className={styles.combo}>
                  <div className={styles.comboName}>
                    {c.name}
                    <span className={styles.comboAr} lang="ar">{c.ar}</span>
                  </div>
                  <div className={styles.comboMix}>{c.mix}</div>
                  <p className={styles.comboDesc}>{c.desc}</p>
                </div>
              ))}

              <p className={styles.shelfLine}>
                <span className={styles.brand}>Darkside</span> &amp;{" "}
                <span className={styles.brand}>MustHave</span> on the shelf · custom blends welcome — just ask.
              </p>

              <div className={styles.cFoot}>— ask the host —</div>
            </div>
          </div>
          <span className={styles.pageLabel}>— back —</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => window.print()}
          type="button"
        >
          ↓ Print / Save as PDF
        </button>
        <Link className={styles.btn} href="/cafe-maz">
          ← Index
        </Link>
      </div>

      <p className={styles.notes}>
        Designed for A5 (5.5 × 8.5″) duplex print. The browser print dialog will set up two pages —
        front and back — at the correct size.
        <br />
        <br />
        <strong className={styles.tip}>Tip:</strong> in the print dialog, enable{" "}
        <em>&ldquo;Background graphics&rdquo;</em> (Chrome / Safari) or{" "}
        <em>&ldquo;Print backgrounds&rdquo;</em> (Firefox) so the dark ground prints. Use a heavy
        uncoated cream stock for best feel.
      </p>
    </main>
  )
}
