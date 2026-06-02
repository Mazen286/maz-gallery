import { DRINK_SECTIONS, HOOKAH_COMBOS, HOOKAH_INTRO, OFF_MENU, PLATES, TAGLINE, TONIGHT_MUSIC } from "@/lib/cafe-maz"
import { MoodPlayer } from "./MoodPlayer"
import styles from "./website.module.css"

export default function CafeMazPage() {
  return (
    <main className={styles.root}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          CAFÉ MAZ
          <span className={styles.ar} lang="ar">كافيه ماز</span>
        </div>
        <div className={styles.right}>
          <a href="#menu">Menu</a>
          <a href="#hookah">Hookah</a>
          <a href="#visit">Visit</a>
        </div>
      </nav>

      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>— Est. 2026 —</p>
        <h1 className={styles.heroH1}>
          CAFÉ <span className={styles.acc}>MAZ</span>
        </h1>
        <div className={styles.heroAr} lang="ar" dir="rtl">كافيه ماز</div>
        <p className={styles.heroTag}>{TAGLINE}</p>
        <div className={styles.ornament}>
          <span className={styles.ornLine} />
          <span className={styles.ornStar}>✦</span>
          <span className={styles.ornLine} />
        </div>
      </section>

      <section className={styles.major} id="menu">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>№ 01</span>
          <h2 className={styles.sectionH2}>The Menu</h2>
          <span className={styles.sectionAr} lang="ar" dir="rtl">القائمة</span>
          <span className={styles.sectionRule} />
        </div>

        <div className={styles.archPanel}>
          <span className={styles.archKeystone} />
          <div className={styles.archInner}>
            {DRINK_SECTIONS.map((s) => (
              <div key={s.id}>
                <div className={styles.subLabel}>
                  <span className={styles.subLat}>— {s.lat} —</span>
                  <span className={styles.subAr} lang="ar">{s.ar}</span>
                </div>
                {s.items.map((d) => (
                  <div
                    key={d.name}
                    className={`${styles.item} ${d.featured ? styles.featured : ""}`}
                  >
                    <span className={styles.itemName}>{d.name}</span>
                    <span className={styles.itemDesc}>{d.desc}</span>
                    {d.featured && <span className={styles.badge}>House</span>}
                  </div>
                ))}
              </div>
            ))}

            <div className={styles.subLabel}>
              <span className={styles.subLat}>— {PLATES.lat} —</span>
              <span className={styles.subAr} lang="ar">{PLATES.ar}</span>
            </div>
            <div className={styles.platesLine}>{PLATES.items}</div>
            <div className={styles.platesAsk}>{PLATES.ask}</div>
          </div>
        </div>
      </section>

      <section className={styles.major} id="hookah">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>№ 02</span>
          <h2 className={styles.sectionH2}>The Hookah</h2>
          <span className={styles.sectionAr} lang="ar" dir="rtl">الأرجيلة</span>
          <span className={styles.sectionRule} />
        </div>

        <p className={styles.hookahLede}>{HOOKAH_INTRO}</p>

        <div className={styles.subLabel} style={{ marginTop: "calc(36px * var(--sp, 1))" }}>
          <span className={styles.subLat}>— House Combos —</span>
          <span className={styles.subAr} lang="ar">من البيت</span>
        </div>

        <div className={styles.comboGrid}>
          {HOOKAH_COMBOS.map((c) => (
            <div key={c.name} className={styles.combo}>
              <span className={`${styles.comboCorner} ${styles.tl}`} />
              <span className={`${styles.comboCorner} ${styles.tr}`} />
              <span className={`${styles.comboCorner} ${styles.bl}`} />
              <span className={`${styles.comboCorner} ${styles.br}`} />
              <div className={styles.comboNum}>{c.num}</div>
              <h3 className={styles.comboH3}>{c.name}</h3>
              <div className={styles.comboAr} lang="ar">{c.ar}</div>
              <div className={styles.comboMix}>{c.mix}</div>
              <div className={styles.comboDesc}>{c.desc}</div>
            </div>
          ))}
          <div className={`${styles.combo} ${styles.comboOffMenu}`}>
            <span className={`${styles.comboCorner} ${styles.tl}`} />
            <span className={`${styles.comboCorner} ${styles.tr}`} />
            <span className={`${styles.comboCorner} ${styles.bl}`} />
            <span className={`${styles.comboCorner} ${styles.br}`} />
            <div className={styles.comboNum}>{OFF_MENU.num}</div>
            <h3 className={styles.comboH3}>{OFF_MENU.name}</h3>
            <div className={styles.comboAr} lang="ar">{OFF_MENU.ar}</div>
            <div className={styles.comboMix}>{OFF_MENU.mix}</div>
            <div className={styles.comboDesc}>{OFF_MENU.desc}</div>
          </div>
        </div>

        <p className={styles.shelfNote}>
          <span className={styles.brand}>Darkside</span> & <span className={styles.brand}>MustHave</span> on the shelf.
        </p>
      </section>

      <section className={styles.visit} id="visit">
        <p className={styles.visitEyebrow}>— Find Us —</p>
        <h2 className={styles.visitH2}>Come Over</h2>
        <div className={styles.visitAr} lang="ar" dir="rtl">— تفضل —</div>
        <div className={styles.whenWhere}>
          <div className={styles.wwItem}>
            <div className={styles.wwLbl}>Hours</div>
            <div className={styles.wwVal}>
              If I&apos;m home,
              <br />
              the café&apos;s open.
            </div>
          </div>
          <div className={styles.wwItem}>
            <div className={styles.wwLbl}>The Address</div>
            <div className={styles.wwVal}>
              Past the espresso machine,
              <br />
              third stool from the wall.
            </div>
          </div>
          <div className={styles.wwItem}>
            <div className={styles.wwLbl}>Reservations</div>
            <div className={styles.wwVal}>
              A knock, a text, or just
              <br />
              barge in like a neighbor.
            </div>
          </div>
          <div className={styles.wwItem}>
            <div className={styles.wwLbl}>Tonight</div>
            <div className={styles.wwVal}>
              On the speakers:
              <br />
              {TONIGHT_MUSIC}
            </div>
          </div>
        </div>

        <MoodPlayer />
      </section>

      <footer className={styles.foot}>
        <span>Café Maz · made at the kitchen counter</span>
      </footer>
    </main>
  )
}
