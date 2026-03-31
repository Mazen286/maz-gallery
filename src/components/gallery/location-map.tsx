"use client"

import { GALLERY, LOCATION_COORDS } from "@/lib/gallery"

interface LocationMapProps {
  onSelectLocation: (location: string | null) => void
  activeLocation: string | null
}

// Simplified world map SVG paths (major continents)
const WORLD_PATHS = [
  // North America
  "M120,120 L140,100 L180,95 L220,100 L260,110 L290,130 L300,160 L280,190 L260,200 L240,210 L220,220 L200,215 L180,220 L160,200 L140,180 L120,150 Z",
  // South America
  "M230,240 L250,230 L270,240 L280,270 L285,300 L280,340 L260,370 L240,380 L230,360 L225,330 L220,300 L225,270 Z",
  // Europe
  "M460,100 L480,95 L510,100 L530,110 L540,130 L530,150 L510,160 L490,155 L470,145 L460,130 Z",
  // Africa
  "M460,180 L490,170 L520,180 L540,200 L550,240 L545,280 L530,320 L510,340 L490,345 L470,330 L460,300 L455,260 L450,220 Z",
  // Asia
  "M540,80 L580,70 L640,75 L700,90 L730,110 L740,140 L730,170 L700,190 L660,200 L620,195 L580,180 L550,160 L540,130 Z",
  // Australia
  "M680,300 L720,290 L750,300 L760,320 L750,340 L720,350 L690,340 L680,320 Z",
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
