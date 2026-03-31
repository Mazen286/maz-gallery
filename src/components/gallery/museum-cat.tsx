"use client"

/**
 * Hand-drawn style museum cat that walks through the gallery.
 * SVG with CSS animations for walk cycle, tail sway, and ear twitches.
 */
export function MuseumCat({ facing = "right" }: { facing?: "left" | "right" }) {
  const flip = facing === "left" ? "scaleX(-1)" : "scaleX(1)"

  return (
    <svg
      width="60"
      height="40"
      viewBox="0 0 60 40"
      fill="none"
      style={{ transform: flip, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
    >
      {/* Body */}
      <ellipse cx="28" cy="26" rx="14" ry="9" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />

      {/* Head */}
      <circle cx="44" cy="20" r="8" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />

      {/* Left ear */}
      <path
        d="M39 13 L37 6 L42 11 Z"
        fill="#1a1a1a"
        stroke="#333"
        strokeWidth="0.5"
        style={{ transformOrigin: "39px 13px", animation: "earTwitch 4s ease-in-out infinite" }}
      />
      {/* Right ear */}
      <path
        d="M48 12 L50 5 L52 11 Z"
        fill="#1a1a1a"
        stroke="#333"
        strokeWidth="0.5"
        style={{ transformOrigin: "48px 12px", animation: "earTwitch 4s ease-in-out 2s infinite" }}
      />

      {/* Inner ears */}
      <path d="M39.5 12.5 L38 7.5 L41.5 11.5 Z" fill="#2a1a1a" />
      <path d="M48.5 12 L50 6.5 L51.5 11.5 Z" fill="#2a1a1a" />

      {/* Eyes */}
      <ellipse cx="42" cy="19" rx="1.5" ry="2" fill="#78c8d6">
        <animate attributeName="ry" values="2;0.3;2" dur="3s" repeatCount="indefinite" begin="2s" />
      </ellipse>
      <ellipse cx="48" cy="19" rx="1.5" ry="2" fill="#78c8d6">
        <animate attributeName="ry" values="2;0.3;2" dur="3s" repeatCount="indefinite" begin="2s" />
      </ellipse>
      {/* Pupils */}
      <ellipse cx="42" cy="19" rx="0.8" ry="1.5" fill="#0a0a0a">
        <animate attributeName="ry" values="1.5;0.2;1.5" dur="3s" repeatCount="indefinite" begin="2s" />
      </ellipse>
      <ellipse cx="48" cy="19" rx="0.8" ry="1.5" fill="#0a0a0a">
        <animate attributeName="ry" values="1.5;0.2;1.5" dur="3s" repeatCount="indefinite" begin="2s" />
      </ellipse>

      {/* Nose */}
      <path d="M45 21.5 L44.2 22.5 L45.8 22.5 Z" fill="#4a3535" />

      {/* Whiskers */}
      <line x1="45" y1="22" x2="55" y2="20" stroke="#444" strokeWidth="0.3" />
      <line x1="45" y1="22" x2="56" y2="22" stroke="#444" strokeWidth="0.3" />
      <line x1="45" y1="22" x2="55" y2="24" stroke="#444" strokeWidth="0.3" />
      <line x1="44" y1="22" x2="34" y2="20" stroke="#444" strokeWidth="0.3" />
      <line x1="44" y1="22" x2="33" y2="22" stroke="#444" strokeWidth="0.3" />
      <line x1="44" y1="22" x2="34" y2="24" stroke="#444" strokeWidth="0.3" />

      {/* Tail */}
      <path
        d="M14 22 Q6 15 4 8 Q3 4 6 6"
        stroke="#1a1a1a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "14px 22px", animation: "tailSway 2s ease-in-out infinite" }}
      />

      {/* Front legs */}
      <line x1="36" y1="32" x2="37" y2="38" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="x2" values="37;35;37" dur="0.6s" repeatCount="indefinite" />
      </line>
      <line x1="32" y1="33" x2="31" y2="38" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="x2" values="31;33;31" dur="0.6s" repeatCount="indefinite" />
      </line>

      {/* Back legs */}
      <line x1="22" y1="33" x2="21" y2="38" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="x2" values="21;23;21" dur="0.6s" repeatCount="indefinite" />
      </line>
      <line x1="18" y1="32" x2="19" y2="38" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="x2" values="19;17;19" dur="0.6s" repeatCount="indefinite" />
      </line>

      {/* Paws */}
      <circle cx="37" cy="38.5" r="1.2" fill="#1a1a1a" />
      <circle cx="31" cy="38.5" r="1.2" fill="#1a1a1a" />
      <circle cx="21" cy="38.5" r="1.2" fill="#1a1a1a" />
      <circle cx="19" cy="38.5" r="1.2" fill="#1a1a1a" />
    </svg>
  )
}
