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
      <rect x={x} y={y} width={W} height={H} fill="rgba(120,200,214,0.03)" />
      <path d={WORLD_LAND_PATH} fill="rgba(120,200,214,0.10)" stroke="rgba(120,200,214,0.35)" strokeWidth="0.5" />
      <circle cx={pin.cx} cy={pin.cy} r="9" fill="none" stroke="rgba(120,200,214,0.35)" strokeWidth="1" />
      <circle cx={pin.cx} cy={pin.cy} r="3.5" fill="#78c8d6" />
      <text
        x={pin.cx}
        y={pin.cy - 14}
        textAnchor="middle"
        fill="rgba(255,255,255,0.85)"
        fontSize="11"
        fontFamily="ui-monospace, monospace"
        letterSpacing="1"
      >
        {pin.label.toUpperCase()}
      </text>
    </svg>
  )
}
