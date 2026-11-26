import { LOCATION_COORDS } from "@/lib/gallery"
import { WORLD_LAND_PATH } from "./games/world-map-data"

// A small static world map with one pin. Server-rendered SVG, no JS.
// The land path and LOCATION_COORDS share an equirectangular projection.
export function PhotoMap({ location, className = "" }: { location: string; className?: string }) {
  const pin = LOCATION_COORDS[location]
  if (!pin) return null

  // Crop a window around the pin so the map reads at card size
  const W = 360
  const H = 180
  const x = Math.min(Math.max(pin.cx - W / 2, 0), 900 - W)
  const y = Math.min(Math.max(pin.cy - H / 2, 0), 450 - H)

  return (
    <svg
      viewBox={`${x} ${y} ${W} ${H}`}
      className={className}
      role="img"
      aria-label={`Map showing ${location}`}
    >
      <rect x={x} y={y} width={W} height={H} fill="rgba(244,240,232,0.02)" />
      <path d={WORLD_LAND_PATH} fill="rgba(184,151,90,0.10)" stroke="rgba(184,151,90,0.35)" strokeWidth="0.5" />
      <circle cx={pin.cx} cy={pin.cy} r="9" fill="none" stroke="rgba(216,189,134,0.5)" strokeWidth="1" />
      <circle cx={pin.cx} cy={pin.cy} r="3.5" fill="#d8bd86" />
      <text
        x={pin.cx}
        y={pin.cy - 14}
        textAnchor="middle"
        fill="#f4f0e8"
        fontSize="12"
        fontFamily="var(--font-inter-tight), system-ui, sans-serif"
        fontWeight="600"
        letterSpacing="1.5"
      >
        {pin.label.toUpperCase()}
      </text>
    </svg>
  )
}
