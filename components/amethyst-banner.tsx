"use client"

import { useEffect, useRef } from "react"

/**
 * Advanced realistic rendition of the AMETHYST banner.
 *
 * Technique stack (highest realism achievable in the browser):
 *  1. Base plate  -> AI-generated photoreal nebula (public/nebula-bg.png)
 *  2. Chrome text -> HTML5 <canvas> 2D, drawn in multiple passes:
 *        a. soft outer neon glow (blurred violet)
 *        b. dark extrusion / bevel offset downward for 3D depth
 *        c. multi-stop vertical metallic gradient fill (the "chrome")
 *        d. clipped specular highlight band swept across the letters
 *        e. thin bright rim light on the top edge
 *  3. Sparkles    -> procedural 4-point lens-flare glints with radial bloom
 *
 * Everything is rendered at devicePixelRatio for crisp, retina-quality metal.
 */

const WORD = "AMETHYST"

// Lens-flare sparkle positions (normalised 0..1 across the banner)
const SPARKLES = [
  { x: 0.05, y: 0.52, r: 26 },
  { x: 0.14, y: 0.78, r: 14 },
  { x: 0.26, y: 0.42, r: 18 },
  { x: 0.4, y: 0.8, r: 20 },
  { x: 0.5, y: 0.5, r: 30 },
  { x: 0.61, y: 0.8, r: 16 },
  { x: 0.74, y: 0.44, r: 22 },
  { x: 0.86, y: 0.72, r: 18 },
  { x: 0.95, y: 0.55, r: 20 },
]

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.globalCompositeOperation = "screen"

  // Radial bloom
  const bloom = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.4)
  bloom.addColorStop(0, "rgba(255,255,255,0.9)")
  bloom.addColorStop(0.2, "rgba(225,200,255,0.5)")
  bloom.addColorStop(1, "rgba(150,90,230,0)")
  ctx.fillStyle = bloom
  ctx.beginPath()
  ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2)
  ctx.fill()

  // Four-point star streaks
  const streak = ctx.createLinearGradient(-r, 0, r, 0)
  streak.addColorStop(0, "rgba(255,255,255,0)")
  streak.addColorStop(0.5, "rgba(255,255,255,0.95)")
  streak.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = streak
  ctx.beginPath()
  ctx.moveTo(-r, 0)
  ctx.lineTo(0, -1.5)
  ctx.lineTo(r, 0)
  ctx.lineTo(0, 1.5)
  ctx.closePath()
  ctx.fill()

  const streakV = ctx.createLinearGradient(0, -r, 0, r)
  streakV.addColorStop(0, "rgba(255,255,255,0)")
  streakV.addColorStop(0.5, "rgba(255,255,255,0.95)")
  streakV.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = streakV
  ctx.beginPath()
  ctx.moveTo(0, -r)
  ctx.lineTo(1.5, 0)
  ctx.lineTo(0, r)
  ctx.lineTo(-1.5, 0)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

function render(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const cssW = canvas.clientWidth
  const cssH = canvas.clientHeight
  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssW, cssH)

  const cx = cssW / 2
  const cy = cssH * 0.6

  // Fit the word to the width
  const fontSize = Math.min(cssH * 0.42, (cssW / WORD.length) * 1.25)
  const font = `700 ${fontSize}px Georgia, "Times New Roman", serif`
  ctx.font = font
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  const metrics = ctx.measureText(WORD)
  const topY = cy - fontSize * 0.5
  const botY = cy + fontSize * 0.5

  // --- Pass 1: outer neon violet glow ------------------------------------
  ctx.save()
  ctx.shadowColor = "rgba(165,85,240,0.95)"
  ctx.shadowBlur = fontSize * 0.55
  ctx.fillStyle = "rgba(200,150,255,0.6)"
  for (let i = 0; i < 3; i++) ctx.fillText(WORD, cx, cy) // stack for intensity
  ctx.restore()

  // --- Pass 2: dark extrusion for 3D depth -------------------------------
  ctx.save()
  const depth = Math.max(1, fontSize * 0.03)
  for (let d = depth; d > 0; d--) {
    const t = d / depth
    ctx.fillStyle = `rgba(${30 + t * 20}, ${10 + t * 10}, ${50 + t * 30}, 1)`
    ctx.fillText(WORD, cx, cy + d)
  }
  ctx.restore()

  // --- Pass 3: metallic chrome gradient fill -----------------------------
  const chrome = ctx.createLinearGradient(0, topY, 0, botY)
  chrome.addColorStop(0.0, "#ffffff")
  chrome.addColorStop(0.22, "#f2ecfa")
  chrome.addColorStop(0.42, "#c7b8de")
  chrome.addColorStop(0.5, "#7d6ca0") // dark horizon line of the chrome
  chrome.addColorStop(0.52, "#5f4f82")
  chrome.addColorStop(0.62, "#b6a6d4")
  chrome.addColorStop(0.82, "#efe8fa")
  chrome.addColorStop(1.0, "#ffffff")
  ctx.fillStyle = chrome
  ctx.fillText(WORD, cx, cy)

  // --- Pass 4: specular highlight band (clipped to the glyphs) -----------
  ctx.save()
  // Build a clip region from the text itself
  ctx.beginPath()
  // canvas has no direct text-to-path, so re-draw text as clip via fill + composite
  ctx.globalCompositeOperation = "source-atop"
  const spec = ctx.createLinearGradient(0, topY, 0, cy)
  spec.addColorStop(0, "rgba(255,255,255,0)")
  spec.addColorStop(0.55, "rgba(255,255,255,0.85)")
  spec.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = spec
  ctx.fillRect(cx - metrics.width, topY, metrics.width * 2, fontSize * 0.42)
  ctx.restore()

  // --- Pass 5: thin bright rim on top edge -------------------------------
  ctx.save()
  ctx.globalCompositeOperation = "source-atop"
  ctx.strokeStyle = "rgba(255,255,255,0.7)"
  ctx.lineWidth = Math.max(0.5, fontSize * 0.012)
  ctx.strokeText(WORD, cx, cy - fontSize * 0.008)
  ctx.restore()

  // --- Sparkles ----------------------------------------------------------
  for (const s of SPARKLES) {
    drawSparkle(ctx, s.x * cssW, s.y * cssH, s.r * (cssW / 936))
  }
}

export function AmethystBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let raf = 0
    const draw = () => render(canvas)

    // Ensure the serif font is ready before drawing text
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        raf = requestAnimationFrame(draw)
      })
    } else {
      raf = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(draw)
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 936,
        aspectRatio: "234 / 60",
        overflow: "hidden",
        borderRadius: 4,
        backgroundColor: "#06030e",
      }}
    >
      {/* Base plate: AI-generated photoreal nebula */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/nebula-bg.png"
        alt="Deep space amethyst nebula"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Vignette to deepen the edges like the source */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 85% 120% at 50% 50%, transparent 40%, rgba(4,2,10,0.85) 85%)",
        }}
      />

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
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(235,220,255,0.9)" strokeWidth="1" />
          <path
            d="M6 9 L12 4 L18 9 L15 16 L9 16 Z"
            fill="none"
            stroke="rgba(235,220,255,0.9)"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="11" r="2.2" fill="rgba(235,220,255,0.9)" />
        </svg>
        <span
          style={{
            fontSize: "clamp(5px, 1.1vw, 9px)",
            letterSpacing: "0.35em",
            color: "rgba(225,205,255,0.75)",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            fontFamily: "Georgia, serif",
            textShadow: "0 0 6px rgba(150,90,230,0.8)",
          }}
        >
          The Amethyst Order
        </span>
      </div>

      {/* Chrome text canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
        }}
        aria-label="AMETHYST"
        role="img"
      />
    </div>
  )
}
