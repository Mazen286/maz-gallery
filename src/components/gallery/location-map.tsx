"use client"

import { GALLERY, LOCATION_COORDS } from "@/lib/gallery"

interface LocationMapProps {
  onSelectLocation: (location: string | null) => void
  activeLocation: string | null
}

// Simplified world map in a true equirectangular projection,
// viewBox 0 0 900 450: x = (lon + 180) * 2.5, y = (90 - lat) * 2.5.
// LOCATION_COORDS pins use the same projection, so geography is honest.
export const WORLD_PATHS = [
  // North America
  "M30,60 L50,50 L60,47.5 L100,50 L137.5,50 L175,55 L212.5,55 L237.5,60 L245,70 L255,70 L237.5,75 L232.5,85 L245,95 L262.5,82.5 L280,80 L287.5,75 L300,107.5 L285,112.5 L275,120 L260,137.5 L250,145 L247.5,162.5 L240,150 L227.5,152.5 L215,152.5 L207.5,160 L207.5,172.5 L220,187.5 L232.5,172.5 L232.5,185 L242.5,202.5 L225,190 L207.5,185 L187.5,175 L175,167.5 L165,150 L157.5,142.5 L140,125 L137.5,105 L125,90 L100,77.5 L70,80 L37.5,75 Z",
  // South America
  "M270,197.5 L300,205 L320,215 L325,225 L362.5,247.5 L350,280 L330,295 L305,310 L287.5,327.5 L280,362.5 L265,350 L267.5,325 L272.5,300 L275,270 L257.5,255 L247.5,237.5 L250,225 L257.5,205 Z",
  // Eurasia
  "M427.5,132.5 L427.5,117.5 L450,107.5 L462.5,97.5 L470,90 L462.5,80 L475,67.5 L495,52.5 L520,47.5 L550,55 L600,52.5 L637.5,42.5 L687.5,35 L725,40 L775,45 L825,50 L875,57.5 L897.5,62.5 L895,70 L855,80 L845,95 L805,90 L787.5,115 L772.5,137.5 L755,150 L725,175 L712.5,202.5 L695,205 L700,190 L685,185 L675,170 L670,172.5 L662.5,180 L650,192.5 L642.5,205 L630,177.5 L620,165 L605,162.5 L595,162.5 L580,165 L570,152.5 L560,150 L570,155 L590,160 L597.5,170 L585,185 L562.5,195 L547.5,187.5 L537.5,155 L530,150 L537.5,135 L525,135 L517.5,135 L515,130 L507.5,135 L497.5,125 L487.5,130 L480,115 L475,115 L457.5,117.5 Z",
  // Africa
  "M435,137.5 L475,132.5 L500,145 L525,147.5 L532.5,155 L542.5,180 L557.5,197.5 L577.5,195 L552.5,230 L550,250 L537.5,275 L532.5,290 L517.5,307.5 L500,312.5 L480,270 L472.5,237.5 L472.5,215 L430,215 L417.5,202.5 L407.5,187.5 L425,162.5 L435,150 Z",
  // Australia
  "M735,280 L755,270 L777.5,255 L792.5,255 L805,252.5 L817.5,272.5 L832.5,290 L827.5,307.5 L815,322.5 L800,320 L780,305 L760,307.5 L737.5,310 L732.5,290 Z",
  // Greenland
  "M337.5,75 L317.5,60 L312.5,50 L325,37.5 L350,32.5 L375,37.5 L395,50 L370,62.5 Z",
  // British Isles
  "M437.5,100 L452.5,97.5 L447.5,87.5 L440,80 L432.5,82.5 L435,90 Z",
  // Japan
  "M775,147.5 L787.5,140 L802.5,130 L807.5,117.5 L800,120 L790,135 L780,140 Z",
]

export function LocationMap({ onSelectLocation, activeLocation }: LocationMapProps) {
  // Get unique locations that have photos
  const locationsWithPhotos = Object.entries(LOCATION_COORDS).filter(([loc]) =>
    GALLERY.some((img) => img.location === loc)
  )

  const photoCount = (location: string) =>
    GALLERY.filter((img) => img.location === location).length

  return (
    <div className="relative mx-auto max-w-5xl px-6">
      <svg
        viewBox="0 0 900 450"
        className="w-full"
        role="img"
        aria-label="World map showing photo locations"
      >
        {/* Background */}
        <rect width="900" height="450" fill="transparent" />

        {/* Continent outlines */}
        {WORLD_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="rgba(120,200,214,0.05)"
            stroke="rgba(120,200,214,0.2)"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 50}
            x2="900"
            y2={i * 50}
            stroke="rgba(120,200,214,0.05)"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 50}
            y1="0"
            x2={i * 50}
            y2="450"
            stroke="rgba(120,200,214,0.05)"
            strokeWidth="0.5"
          />
        ))}

        {/* Location dots */}
        {locationsWithPhotos.map(([location, coords]) => {
          const isActive = activeLocation === location
          const count = photoCount(location)
          return (
            <g key={location}>
              {/* Pulse ring */}
              <circle
                cx={coords.cx}
                cy={coords.cy}
                r="8"
                fill="none"
                stroke="rgba(120,200,214,0.4)"
                strokeWidth="1"
                className="animate-pulse-dot"
                style={{ transformOrigin: `${coords.cx}px ${coords.cy}px` }}
              />
              {/* Dot button */}
              <circle
                cx={coords.cx}
                cy={coords.cy}
                r="5"
                fill={isActive ? "#78c8d6" : "rgba(120,200,214,0.7)"}
                stroke="#78c8d6"
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-200 hover:fill-[#78c8d6]"
                role="button"
                tabIndex={0}
                aria-label={`View ${count} photos from ${coords.label}`}
                onClick={() => onSelectLocation(location)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onSelectLocation(location)
                  }
                }}
              />
              {/* Label */}
              <text
                x={coords.cx}
                y={coords.cy - 14}
                textAnchor="middle"
                fill="rgba(120,200,214,0.8)"
                fontSize="11"
                fontWeight="500"
                className="pointer-events-none select-none"
              >
                {coords.label}
              </text>
              {/* Photo count */}
              <text
                x={coords.cx}
                y={coords.cy + 20}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="9"
                className="pointer-events-none select-none"
              >
                {count} photos
              </text>
            </g>
          )
        })}
      </svg>

      {/* View All button */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => onSelectLocation(null)}
          className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
            activeLocation === null
              ? "bg-teal text-white"
              : "border border-white/20 text-white/60 hover:border-teal hover:text-teal"
          }`}
        >
          View All Photos
        </button>
        {activeLocation && (
          <button
            onClick={() => onSelectLocation(null)}
            className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white/60 transition-all hover:border-teal hover:text-teal"
          >
            Clear Filter
          </button>
        )}
      </div>
    </div>
  )
}
