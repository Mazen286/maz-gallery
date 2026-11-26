"use client"

import { GALLERY, LOCATION_COORDS, LOCATIONS, wingLabel } from "@/lib/gallery"
import { WORLD_LAND_PATH } from "./games/world-map-data"

interface LocationMapProps {
  onSelectLocation: (location: string | null) => void
  activeLocation: string | null
}

// The collection lives in two regions. A whole-world map puts the Aegean
// towns a pixel apart, so each region gets its own inset in the shared
// equirectangular projection (x = (lon + 180) * 2.5, y = (90 - lat) * 2.5).
// Both insets share a 1.6:1 aspect so the cards line up; type and pins
// scale with the inset width so a tight region reads as cleanly as a wide one.
const REGIONS = [
  { name: "Mediterranean", x: 488, y: 104, w: 80, h: 50 },
  { name: "United States", x: 130, y: 92, w: 160, h: 100 },
]

type Pin = { loc: string; cx: number; cy: number; label: string; count: number }

// Labels in a tight cluster take turns: above, below, right, left
const LABEL_SLOTS = [
  { dx: 0, dy: -2.2, anchor: "middle" },
  { dx: 0, dy: 3.1, anchor: "middle" },
  { dx: 1.8, dy: 0.7, anchor: "start" },
  { dx: -1.8, dy: 0.7, anchor: "end" },
] as const

function placeLabels(pins: Pin[]) {
  const sorted = [...pins].sort((a, b) => a.cx - b.cx || a.cy - b.cy)
  const slots = new Map<string, (typeof LABEL_SLOTS)[number]>()
  let clusterStart = 0
  for (let i = 0; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const near = prev && Math.abs(sorted[i].cx - prev.cx) < 8 && Math.abs(sorted[i].cy - prev.cy) < 8
    if (!near) clusterStart = i
    slots.set(sorted[i].loc, LABEL_SLOTS[(i - clusterStart) % LABEL_SLOTS.length])
  }
  return slots
}

export function LocationMap({ onSelectLocation, activeLocation }: LocationMapProps) {
  const pins: Pin[] = LOCATIONS.filter((loc) => LOCATION_COORDS[loc]).map((loc) => ({
    loc,
    cx: LOCATION_COORDS[loc].cx,
    cy: LOCATION_COORDS[loc].cy,
    label: wingLabel(loc),
    count: GALLERY.filter((img) => img.location === loc).length,
  }))

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid gap-4 md:grid-cols-2">
        {REGIONS.map((region) => {
          const inside = pins.filter(
            (p) => p.cx >= region.x && p.cx <= region.x + region.w && p.cy >= region.y && p.cy <= region.y + region.h,
          )
          const slots = placeLabels(inside)
          const total = inside.reduce((n, p) => n + p.count, 0)
          const u = region.w / 80 // one "unit" of type and pin size for this inset
          const fontSize = 2.4 * u
          return (
            <figure key={region.name} className="m-0 border border-wall-line bg-wall-2 p-3 sm:p-4">
              <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 pb-3">
                <span className="font-display text-xl italic text-ivory">{region.name}</span>
                <span className="text-[13px] tabular-nums text-mist-2">
                  {inside.length} places &middot; {total} photos
                </span>
              </figcaption>
              <svg
                viewBox={`${region.x} ${region.y} ${region.w} ${region.h}`}
                className="w-full rounded"
                role="group"
                aria-label={`${region.name}: ${inside.map((p) => p.label).join(", ")}`}
              >
                <rect x={region.x} y={region.y} width={region.w} height={region.h} fill="rgba(244,240,232,0.02)" />
                <path
                  d={WORLD_LAND_PATH}
                  fill="rgba(184,151,90,0.10)"
                  stroke="rgba(184,151,90,0.35)"
                  strokeWidth={0.3 * u}
                />
                {inside.map((p) => {
                  const isActive = activeLocation === p.loc
                  const slot = slots.get(p.loc) ?? LABEL_SLOTS[0]
                  return (
                    <g key={p.loc}>
                      <circle cx={p.cx} cy={p.cy} r={2.6 * u} fill="none" stroke="rgba(216,189,134,0.45)" strokeWidth={0.3 * u} />
                      {/* Generous invisible hit target for touch and pointer */}
                      <circle
                        cx={p.cx}
                        cy={p.cy}
                        r={4 * u}
                        fill="transparent"
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        aria-label={`View ${p.count} photos from ${p.label}`}
                        onClick={() => onSelectLocation(p.loc)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            onSelectLocation(p.loc)
                          }
                        }}
                      />
                      <circle
                        cx={p.cx}
                        cy={p.cy}
                        r={(isActive ? 1.3 : 0.95) * u}
                        fill={isActive ? "#f4f0e8" : "#d8bd86"}
                        className="pointer-events-none"
                      />
                      <text
                        x={p.cx + slot.dx * u}
                        y={p.cy + slot.dy * u}
                        textAnchor={slot.anchor}
                        fill={isActive ? "#d8bd86" : "#f4f0e8"}
                        fontSize={fontSize}
                        fontFamily="var(--font-inter-tight), system-ui, sans-serif"
                        fontWeight={600}
                        letterSpacing={0.2 * u}
                        className="pointer-events-none select-none"
                      >
                        {p.label.toUpperCase()} {p.count}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </figure>
          )
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => onSelectLocation(null)}
          className="btn btn-line text-ivory"
        >
          Back to the wings
        </button>
      </div>
    </div>
  )
}
