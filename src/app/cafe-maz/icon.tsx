import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

// Brass four-pointed star on coffee black, mirroring the ✦ ornament
// (.ornStar) used across the Café Maz menu, cafe, and lab pages.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#14100b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 2 L18.8 13.2 L30 16 L18.8 18.8 L16 30 L13.2 18.8 L2 16 L13.2 13.2 Z"
            fill="#c9a667"
          />
        </svg>
      </div>
    ),
    { ...size },
  )
}
