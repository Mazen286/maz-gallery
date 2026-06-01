"use client"

import { useState } from "react"
import { SPOTIFY_PLAYLISTS } from "@/lib/cafe-maz"
import styles from "./website.module.css"

function spotifyEmbedUrl(url: string): string | null {
  const m = url.match(/\/playlist\/([A-Za-z0-9]+)/)
  if (!m) return null
  return `https://open.spotify.com/embed/playlist/${m[1]}?utm_source=generator&theme=0`
}

// Pick the first playlist that actually has a URL as the default.
function defaultKey(): string {
  const keys = Object.keys(SPOTIFY_PLAYLISTS)
  return keys.find((k) => SPOTIFY_PLAYLISTS[k]?.url) ?? keys[0]
}

export function MoodPlayer() {
  const [activeKey, setActiveKey] = useState<string>(defaultKey)
  const active = SPOTIFY_PLAYLISTS[activeKey]
  const embedUrl = active?.url ? spotifyEmbedUrl(active.url) : null

  // If nothing has a URL yet, render nothing.
  const anyLive = Object.values(SPOTIFY_PLAYLISTS).some((p) => p.url)
  if (!anyLive) return null

  return (
    <div className={styles.spotifyWrap}>
      <p className={styles.spotifyLabel}>
        — Now playing · {active.name} <span lang="ar">{active.arabic}</span> —
      </p>

      <div className={styles.moodPicker}>
        {Object.entries(SPOTIFY_PLAYLISTS).map(([key, p]) => {
          const isActive = key === activeKey
          const isDisabled = !p.url
          return (
            <button
              key={key}
              type="button"
              disabled={isDisabled}
              onClick={() => setActiveKey(key)}
              className={`${styles.moodPill} ${isActive ? styles.moodPillActive : ""}`}
              title={isDisabled ? "Coming soon" : p.name}
            >
              {p.name}
            </button>
          )
        })}
      </div>

      {embedUrl && (
        <iframe
          key={embedUrl}
          className={styles.spotifyFrame}
          src={embedUrl}
          width="100%"
          height="80"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`Spotify: ${active.name}`}
        />
      )}
    </div>
  )
}
