"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  CATALOG,
  DARKSIDE,
  MUSTHAVE,
  PROFILE_FAMILIES,
  findFlavor,
  flavorId,
  type Flavor,
} from "@/lib/cafe-maz-flavors"
import styles from "./lab.module.css"

type BlendItem = { brand: string; line: string; name: string; percent: number; offShelf?: boolean }
type Combo = {
  id: string
  num: string
  name: string
  ar: string
  blend: BlendItem[]
  profile: string[]
  note: string
  session: string
}

const MAX_PICKS = 4
const STORAGE_KEY = "cafemaz.bowls.v2"

const SEED_BOWLS: Combo[] = [
  {
    id: "seed-garden",
    num: "Nº 01",
    name: "The Garden",
    ar: "الحديقة",
    profile: ["cool", "herbal"],
    blend: [
      { brand: "Darkside", line: "Standard", name: "Ultranova / Super Nova", percent: 50 },
      { brand: "Darkside", line: "Standard", name: "Needls", percent: 30 },
      { brand: "Darkside", line: "Standard", name: "Basil Blast", percent: 20 },
    ],
    note: "Cold mint backbone, sharp pine, soft basil finish. The house pour.",
    session: "afternoon",
  },
  {
    id: "seed-yaffa-moonmilk",
    num: "Nº 02",
    name: "Yaffa Moonmilk",
    ar: "حليب قمر يافا",
    profile: ["creamy", "cool"],
    blend: [
      { brand: "Darkside", line: "Standard", name: "Ultranova / Super Nova", percent: 40 },
      { brand: "Darkside", line: "Experience", name: "Bana-Nscr", percent: 35 },
      { brand: "Darkside", line: "Standard", name: "Killer Milk", percent: 25 },
    ],
    note: "Cool mint, ripe banana, condensed-milk finish. Late by the sea at Yaffa.",
    session: "late night",
  },
  {
    id: "seed-alquds-asr",
    num: "Nº 03",
    name: "Al-Quds Asr",
    ar: "عصر القدس",
    profile: ["spiced", "warm"],
    blend: [
      { brand: "Darkside", line: "Standard", name: "Ultranova / Super Nova", percent: 40 },
      { brand: "MustHave", line: "125g", name: "Masala Tea", percent: 30 },
      { brand: "Darkside", line: "Standard", name: "Honey Dust", percent: 30 },
    ],
    note: "Cardamom chai and honey on a stone balcony — afternoon over the old city.",
    session: "afternoon",
  },
  {
    id: "seed-knafeh-nabulsi",
    num: "Nº 04",
    name: "Knafeh Nabulsi",
    ar: "كنافة نابلسية",
    profile: ["sweet", "nutty"],
    blend: [
      { brand: "Darkside", line: "Standard", name: "Ultranova / Super Nova", percent: 45 },
      { brand: "MustHave", line: "125g", name: "Pistachio", percent: 35 },
      { brand: "Darkside", line: "Standard", name: "Honey Dust", percent: 20 },
    ],
    note: "Crackling syrup over pistachio cream in the old Nablus souk.",
    session: "intimate",
  },
  {
    id: "seed-sahlab-layl",
    num: "Nº 05",
    name: "Sahlab Layl",
    ar: "سحلب الليل",
    profile: ["creamy", "warm"],
    blend: [
      { brand: "Darkside", line: "Standard", name: "Ultranova / Super Nova", percent: 40 },
      { brand: "MustHave", line: "125g", name: "Milky Rice", percent: 35 },
      { brand: "MustHave", line: "125g", name: "Pistachio", percent: 25 },
    ],
    note: "Hot sahlab made cool — pistachio dust, milk steam, cinnamon glow.",
    session: "late night",
  },
]

export default function FlavorLabPage() {
  const [activeFamilies, setActiveFamilies] = useState<Set<string>>(new Set())
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [mood, setMood] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [suggestions, setSuggestions] = useState<Combo[]>([])
  const [bowls, setBowls] = useState<Combo[]>(SEED_BOWLS)
  const [justSaved, setJustSaved] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Combo[]
        if (Array.isArray(parsed) && parsed.length) setBowls(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bowls))
    } catch {}
  }, [bowls])

  const toggleFamily = (label: string) => {
    setActiveFamilies((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const activeProfileSet = useMemo(() => {
    const set = new Set<string>()
    for (const fam of PROFILE_FAMILIES) {
      if (activeFamilies.has(fam.label)) {
        for (const p of fam.profiles) set.add(p)
      }
    }
    return set
  }, [activeFamilies])

  const filterByActive = (flavors: Flavor[]): Flavor[] => {
    if (activeProfileSet.size === 0) return flavors
    return flavors.filter((f) => f.profiles.some((p) => activeProfileSet.has(p)))
  }

  const togglePick = (f: Flavor) => {
    const id = flavorId(f)
    setSelectedIds((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id)
      if (s.length >= MAX_PICKS) return s
      return [...s, id]
    })
  }

  const generate = useCallback(async () => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/cafe-maz/flavor-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedIds, mood }),
      })
      const data = (await res.json()) as { combos?: Combo[]; error?: string }
      if (!res.ok) {
        setError(data.error || "The bowl wouldn't light. Try again.")
      } else if (data.combos) {
        setSuggestions(data.combos)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "unknown"
      setError(`Couldn't reach the lab. (${msg})`)
    } finally {
      setLoading(false)
    }
  }, [selectedIds, mood])

  const saveCombo = (c: Combo) => {
    setBowls((b) => [...b, { ...c, num: `Nº ${String(b.length + 1).padStart(2, "0")}` }])
    setJustSaved((s) => new Set([...s, c.id]))
  }

  const deleteBowl = (id: string) => {
    setBowls((b) => b.filter((x) => x.id !== id))
  }

  const resetBowls = () => {
    if (confirm("Reset house bowls to the seed list?")) {
      setBowls(SEED_BOWLS)
    }
  }

  // Group filtered flavors by brand + line for display
  const groupedShelf = useMemo(() => {
    const filteredDS = filterByActive(DARKSIDE)
    const filteredMH = filterByActive(MUSTHAVE)
    const groupBy = (flavors: Flavor[]) => {
      const map = new Map<string, Flavor[]>()
      for (const f of flavors) {
        const key = `${f.brand} · ${f.line}`
        if (!map.has(key)) map.set(key, [])
        map.get(key)!.push(f)
      }
      return Array.from(map.entries())
    }
    return [...groupBy(filteredDS), ...groupBy(filteredMH)]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfileSet])

  return (
    <main className={styles.root}>
      <nav className={styles.nav}>
        <span>CAFÉ MAZ</span>
        <Link href="/cafe-maz">← back to index</Link>
      </nav>

      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>— For Maz · Behind the Bar —</p>
        <h1 className={styles.heroH1}>
          FLAVOR <span className={styles.acc}>LAB</span>
        </h1>
        <div className={styles.heroAr} lang="ar" dir="rtl">مختبر النكهات</div>
        <p className={styles.heroTag}>
          Filter by profile, pick from the shelf, set the mood — Claude pours two named combos.
          <br />
          {DARKSIDE.length} Darkside · {MUSTHAVE.length} MustHave on the rack.
        </p>
        <div className={styles.orn}>
          <span className={styles.ornLine} />
          <span className={styles.ornStar}>✦</span>
          <span className={styles.ornLine} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>№ 01</span>
          <h2 className={styles.sectionH2}>Filter by Profile</h2>
          <span className={styles.sectionAr} lang="ar" dir="rtl">— تصفية</span>
          <span className={styles.sectionRule} />
          {activeFamilies.size > 0 && (
            <button
              type="button"
              className={styles.miniBtn}
              onClick={() => setActiveFamilies(new Set())}
            >
              clear
            </button>
          )}
        </div>
        <div className={styles.familyChips}>
          {PROFILE_FAMILIES.map((f) => {
            const on = activeFamilies.has(f.label)
            return (
              <button
                key={f.label}
                type="button"
                className={`${styles.familyChip} ${on ? styles.familyChipOn : ""}`}
                onClick={() => toggleFamily(f.label)}
              >
                {f.label}
              </button>
            )
          })}
        </div>
        <p className={styles.helper}>
          {activeFamilies.size === 0
            ? "Showing the whole shelf. Pick a family to narrow down."
            : `Showing ${groupedShelf.reduce((n, [, items]) => n + items.length, 0)} matching flavors.`}
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>№ 02</span>
          <h2 className={styles.sectionH2}>Pick From the Shelf</h2>
          <span className={styles.sectionAr} lang="ar" dir="rtl">— الرف</span>
          <span className={styles.sectionRule} />
        </div>

        <div className={styles.panel}>
          <PanelCorners />
          {groupedShelf.length === 0 && (
            <p className={styles.helper}>No flavors match those families. Try fewer filters.</p>
          )}
          {groupedShelf.map(([heading, items]) => (
            <div key={heading} className={styles.family}>
              <div className={styles.familyLabel}>{heading}</div>
              <div className={styles.chips}>
                {items.map((f) => {
                  const id = flavorId(f)
                  const isSel = selectedIds.includes(id)
                  const atMax = selectedIds.length >= MAX_PICKS && !isSel
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`${styles.chip} ${isSel ? styles.chipSelected : ""}`}
                      onClick={() => togglePick(f)}
                      disabled={atMax}
                      title={f.note}
                    >
                      {f.name}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <div className={styles.selectedRow}>
            <span className={styles.label}>
              Selected · {selectedIds.length}/{MAX_PICKS}
            </span>
            {selectedIds.length === 0 ? (
              <span className={styles.empty}>pick up to {MAX_PICKS} — or leave blank for full surprise</span>
            ) : (
              selectedIds.map((id) => {
                const f = findFlavor(id)
                if (!f) return null
                return (
                  <span key={id} className={styles.selectedPill}>
                    {f.brand} · {f.name}
                    <button
                      onClick={() => setSelectedIds((s) => s.filter((x) => x !== id))}
                      aria-label="remove"
                      type="button"
                    >
                      ×
                    </button>
                  </span>
                )
              })
            )}
          </div>

          <div className={styles.moodRow}>
            <span className={styles.label}>Mood</span>
            <input
              className={styles.moodInput}
              type="text"
              placeholder='optional — "late summer evening," "the first cold night," "rainy slow afternoon"…'
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") generate()
              }}
            />
          </div>

          <div className={styles.goRow}>
            <button type="button" className={styles.goBtn} onClick={generate} disabled={loading}>
              <span className={styles.goAr} lang="ar">إصب</span>
              {loading ? "pouring…" : "pour suggestions"}
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>№ 03</span>
          <h2 className={styles.sectionH2}>Suggestions</h2>
          <span className={styles.sectionAr} lang="ar" dir="rtl">— الاقتراحات</span>
          <span className={styles.sectionRule} />
        </div>

        {loading && (
          <div className={styles.spinnerWrap}>
            <span className={styles.spinner} />
            <span className={styles.spinnerText}>— the bowl is being packed —</span>
          </div>
        )}

        {!loading && suggestions.length === 0 && !error && (
          <p className={styles.placeholder}>— pick some flavors, then pour —</p>
        )}

        {!loading && suggestions.length > 0 && (
          <div className={styles.suggestions}>
            {suggestions.map((c) => (
              <ComboCard
                key={c.id}
                c={c}
                saved={justSaved.has(c.id)}
                onSave={saveCombo}
                onRegenerate={generate}
              />
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>№ 04</span>
          <h2 className={styles.sectionH2}>House Bowls</h2>
          <span className={styles.sectionAr} lang="ar" dir="rtl">— من البيت</span>
          <span className={styles.sectionRule} />
          <button type="button" className={styles.miniBtn} onClick={resetBowls} title="Reset to seed list">
            ↺ reset
          </button>
        </div>

        <div className={styles.panel} style={{ padding: 0 }}>
          <PanelCorners />
          {bowls.length === 0 ? (
            <div className={styles.bowlEmpty}>— no bowls yet · save one from above —</div>
          ) : (
            bowls.map((b, idx) => (
              <div key={b.id} className={styles.bowl}>
                <span className={styles.bowlNum}>Nº {String(idx + 1).padStart(2, "0")}</span>
                <span className={styles.bowlName}>
                  {b.name}
                  {b.ar && (
                    <span className={styles.bowlAr} lang="ar">
                      · {b.ar}
                    </span>
                  )}
                </span>
                <span className={styles.bowlMix}>
                  {b.blend.map((x) => `${x.brand}/${x.name} ${x.percent}%`).join(" · ")}
                </span>
                <span className={styles.bowlActions}>
                  <button type="button" className={styles.bowlBtn} onClick={() => deleteBowl(b.id)} title="Remove">
                    ×
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>№ 05</span>
          <h2 className={styles.sectionH2}>The Shelf</h2>
          <span className={styles.sectionAr} lang="ar" dir="rtl">— الرف</span>
          <span className={styles.sectionRule} />
        </div>

        <div className={styles.shelfGrid}>
          <div className={styles.shelfCard}>
            <div className={styles.shelfBrand}>Darkside · {DARKSIDE.length} flavors</div>
            <div className={styles.shelfLines}>Core · Medium · Soft · Rare · Experience</div>
            <p className={styles.shelfDesc}>
              The house workhorse. Dark leaf, complex profiles, long session. Cold mints anchor every
              bowl here.
            </p>
          </div>
          <div className={styles.shelfCard}>
            <div className={styles.shelfBrand}>MustHave · {MUSTHAVE.length} flavors</div>
            <div className={styles.shelfLines}>125g · regular cut</div>
            <p className={styles.shelfDesc}>
              Lighter, brighter, fruit-forward. Use when guests say they &quot;don&apos;t really
              smoke&quot; — gentle entry, generous smoke.
            </p>
          </div>
        </div>

        <p className={styles.shelfFoot}>
          The catalog lives in <code>src/lib/cafe-maz-flavors.ts</code> — edit it to match exactly
          what&apos;s on your shelf. {CATALOG.length} flavors total right now.
        </p>
      </section>

      <footer className={styles.footer}>
        <span>Café Maz · Flavor Lab · v0.2</span>
        <Link href="/cafe-maz">↳ index</Link>
      </footer>
    </main>
  )
}

function PanelCorners() {
  return (
    <>
      <span className={`${styles.panelCorner} ${styles.tl}`} />
      <span className={`${styles.panelCorner} ${styles.tr}`} />
      <span className={`${styles.panelCorner} ${styles.bl}`} />
      <span className={`${styles.panelCorner} ${styles.br}`} />
    </>
  )
}

function ComboCard({
  c,
  saved,
  onSave,
  onRegenerate,
}: {
  c: Combo
  saved: boolean
  onSave: (c: Combo) => void
  onRegenerate: () => void
}) {
  return (
    <div className={styles.combo}>
      <div className={styles.comboNum}>
        {c.num}
        {c.profile && c.profile.length ? ` · ${c.profile.join(" · ")}` : ""}
      </div>
      <h3 className={styles.comboName}>{c.name}</h3>
      {c.ar && (
        <div className={styles.comboAr} lang="ar">
          {c.ar}
        </div>
      )}
      <div className={styles.comboBlend}>
        {c.blend.map((b, i) => (
          <div key={i} className={styles.blendRow}>
            <span className={styles.blendName}>
              <span className={styles.blendBrand}>{b.brand} {b.line}</span>
              <span className={styles.blendFlavor}>{b.name}</span>
              {b.offShelf && <span className={styles.offShelf}>· off-shelf</span>}
            </span>
            <span className={styles.bar}>
              <span className={styles.barFill} style={{ width: `${b.percent}%` }} />
            </span>
            <span className={styles.pct}>{b.percent}%</span>
          </div>
        ))}
      </div>
      <p className={styles.comboNote}>{c.note}</p>
      <div className={styles.comboMeta}>
        <span className={styles.comboSession}>— {c.session} —</span>
        <div className={styles.comboActions}>
          <button type="button" className={styles.comboBtn} onClick={onRegenerate}>
            ↻ again
          </button>
          <button
            type="button"
            className={`${styles.comboBtn} ${styles.comboBtnPrimary} ${saved ? styles.comboBtnSaved : ""}`}
            onClick={() => onSave(c)}
            disabled={saved}
          >
            {saved ? "✓ saved" : "+ save"}
          </button>
        </div>
      </div>
    </div>
  )
}
