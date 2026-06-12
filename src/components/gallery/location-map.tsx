"use client"

import { GALLERY, LOCATION_COORDS } from "@/lib/gallery"
import { WORLD_LAND_PATH } from "./games/world-map-data"

interface LocationMapProps {
  onSelectLocation: (location: string | null) => void
  activeLocation: string | null
}

// The land path comes from Natural Earth via games/world-map-data.ts,
// in the same equirectangular projection as LOCATION_COORDS.

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
        viewBox="0 12.5 900 362.5"
        className="w-full"
        role="img"
        aria-label="World map showing photo locations"
      >
        {/* Land outlines (Natural Earth) */}
        <path
          d={WORLD_LAND_PATH}
          fill="rgba(120,200,214,0.07)"
          stroke="rgba(120,200,214,0.25)"
          strokeWidth="0.6"
        />

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
