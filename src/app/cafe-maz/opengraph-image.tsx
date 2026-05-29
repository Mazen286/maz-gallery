import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Café Maz — a one-table café"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

async function loadGoogleFont(
  family: string,
  weight = 400,
  italic = false,
): Promise<ArrayBuffer> {
  const param = italic ? `ital,wght@1,${weight}` : `wght@${weight}`
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:${param}`
  // Use an older Firefox UA so Google Fonts serves TTF rather than WOFF2
  // (Satori, which powers ImageResponse, only supports TTF/OTF).
  const css = await fetch(cssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 5.1; rv:7.0.1) Gecko/20100101 Firefox/7.0.1",
    },
  }).then((r) => r.text())
  const match = css.match(/src:\s*url\((.+?)\)\s+format\(/)
  if (!match) throw new Error(`No font URL found for ${family} ${param}`)
  return await fetch(match[1]).then((r) => r.arrayBuffer())
}

export default async function Image() {
  const [cinzel, cormorantItalic, mono] = await Promise.all([
    loadGoogleFont("Cinzel", 700),
    loadGoogleFont("Cormorant Garamond", 400, true),
    loadGoogleFont("JetBrains Mono", 500),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#14100b",
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 15%, rgba(224, 189, 124, 0.22), transparent 65%), radial-gradient(ellipse 80% 60% at 50% 105%, rgba(74, 20, 24, 0.45), transparent 65%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#efe3c7",
          position: "relative",
          padding: "0 96px",
        }}
      >
        {/* Brass corner brackets */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            width: 48,
            height: 48,
            border: "1.5px solid #c9a667",
            borderRight: "none",
            borderBottom: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 40,
            width: 48,
            height: 48,
            border: "1.5px solid #c9a667",
            borderLeft: "none",
            borderBottom: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            width: 48,
            height: 48,
            border: "1.5px solid #c9a667",
            borderRight: "none",
            borderTop: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            width: 48,
            height: 48,
            border: "1.5px solid #c9a667",
            borderLeft: "none",
            borderTop: "none",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 20,
            letterSpacing: "0.32em",
            color: "#c9a667",
            textTransform: "uppercase",
            marginBottom: 64,
            display: "flex",
          }}
        >
          — Est. 2026 · A One-Table Café —
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontFamily: "Cinzel",
            fontWeight: 700,
            fontSize: 168,
            letterSpacing: "0.08em",
            lineHeight: 0.95,
            textTransform: "uppercase",
            display: "flex",
            color: "#f5ecd3",
          }}
        >
          CAFÉ
          <span style={{ color: "#e0bd7c", marginLeft: 32 }}>MAZ</span>
        </div>

        {/* Ornament */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 52,
          }}
        >
          <div style={{ width: 96, height: 1, background: "#c9a667", opacity: 0.6 }} />
          <div
            style={{
              width: 14,
              height: 14,
              background: "#c9a667",
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />
          <div style={{ width: 96, height: 1, background: "#c9a667", opacity: 0.6 }} />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "Cormorant Garamond",
            fontStyle: "italic",
            fontSize: 36,
            color: "#c5b89a",
            marginTop: 28,
            display: "flex",
          }}
        >
          open whenever you&apos;re over
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cinzel", data: cinzel, weight: 700, style: "normal" },
        { name: "Cormorant Garamond", data: cormorantItalic, weight: 400, style: "italic" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  )
}
