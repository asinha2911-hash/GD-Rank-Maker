"use client"

import type { CSSProperties } from "react"

// Deterministic pseudo-random star field so it renders identically on server & client
const STARS = Array.from({ length: 90 }, (_, i) => {
  const seed = (n: number) => {
    const x = Math.sin((i + 1) * n) * 10000
    return x - Math.floor(x)
  }
  return {
    left: seed(12.9898) * 100,
    top: seed(78.233) * 100,
    size: 0.5 + seed(37.719) * 1.6,
    opacity: 0.3 + seed(4.123) * 0.7,
    twinkle: 1.5 + seed(9.11) * 3,
    delay: seed(2.71) * 3,
  }
})

// A few bigger four-point sparkles scattered around the text
const SPARKLES = [
  { left: 6, top: 30, size: 14 },
  { left: 15, top: 68, size: 9 },
  { left: 28, top: 22, size: 10 },
  { left: 41, top: 74, size: 12 },
  { left: 52, top: 34, size: 16 },
  { left: 63, top: 70, size: 9 },
  { left: 74, top: 26, size: 13 },
  { left: 86, top: 60, size: 11 },
  { left: 94, top: 40, size: 10 },
]

function Sparkle({ style }: { style: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" style={style} aria-hidden="true">
      <path
        d="M50 0 C53 38 62 47 100 50 C62 53 53 62 50 100 C47 62 38 53 0 50 C38 47 47 38 50 0 Z"
        fill="white"
      />
    </svg>
  )
}

export function AmethystBanner() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 936,
        aspectRatio: "234 / 60",
        overflow: "hidden",
        borderRadius: 4,
        // Layered radial gradients build the mottled purple nebula over deep space
        background: `
          radial-gradient(ellipse 45% 80% at 50% 48%, rgba(180, 90, 240, 0.6), transparent 65%),
          radial-gradient(ellipse 22% 45% at 28% 58%, rgba(120, 50, 190, 0.55), transparent 70%),
          radial-gradient(ellipse 25% 50% at 70% 42%, rgba(140, 70, 220, 0.5), transparent 70%),
          radial-gradient(ellipse 18% 35% at 60% 68%, rgba(80, 30, 140, 0.45), transparent 70%),
          radial-gradient(circle at 50% 42%, rgba(210, 160, 255, 0.4), transparent 40%),
          radial-gradient(ellipse 90% 130% at 50% 50%, transparent 35%, rgba(6, 3, 14, 0.85) 78%),
          radial-gradient(ellipse 130% 120% at 50% 50%, #1a0a2e 15%, #08040f 75%)
        `,
      }}
    >
      {/* Star field */}
      {STARS.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "white",
            opacity: s.opacity,
            boxShadow: "0 0 4px rgba(255,255,255,0.9)",
            animation: `am-twinkle ${s.twinkle}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Big sparkles */}
      {SPARKLES.map((sp, i) => (
        <Sparkle
          key={i}
          style={{
            position: "absolute",
            left: `${sp.left}%`,
            top: `${sp.top}%`,
            width: sp.size,
            height: sp.size,
            transform: "translate(-50%, -50%)",
            filter: "drop-shadow(0 0 3px rgba(220,190,255,0.9))",
            opacity: 0.9,
          }}
        />
      ))}

      {/* Top emblem + tagline */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          zIndex: 3,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(230,210,255,0.85)" strokeWidth="1" />
          <path
            d="M6 9 L12 4 L18 9 L15 16 L9 16 Z"
            fill="none"
            stroke="rgba(230,210,255,0.85)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="11" r="2.2" fill="rgba(230,210,255,0.85)" />
        </svg>
        <span
          style={{
            fontSize: "clamp(5px, 1.1vw, 9px)",
            letterSpacing: "0.35em",
            color: "rgba(220,200,255,0.7)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            fontFamily: "Georgia, serif",
          }}
        >
          The Amethyst Order
        </span>
      </div>

      {/* Main chrome text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "12%",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 8.5vw, 82px)",
            letterSpacing: "0.06em",
            lineHeight: 1,
            // Metallic silver/chrome gradient fill
            background:
              "linear-gradient(180deg, #ffffff 0%, #e8e0f0 30%, #b9a9d0 48%, #6f5f90 52%, #d8cfe8 70%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextStroke: "0.75px rgba(200,150,255,0.5)",
            textShadow:
              "0 0 8px rgba(220,180,255,0.9), 0 0 22px rgba(180,110,255,0.9), 0 0 45px rgba(150,70,230,0.8), 0 0 70px rgba(120,50,200,0.6)",
          }}
        >
          AMETHYST
        </h1>
      </div>

      <style>{`
        @keyframes am-twinkle {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
