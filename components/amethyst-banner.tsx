"use client"

import { useEffect, useRef } from "react"
import type { BannerConfig } from "@/lib/banner-config"

/**
 * Fully parametric rendition of the AMETHYST banner.
 *
 * Technique stack (highest realism achievable in the browser):
 *  1. Base plate  -> AI-generated photoreal nebula (public/nebula-bg.png)
 *  2. Chrome text -> HTML5 <canvas> 2D, drawn in multiple passes:
 *        a. soft outer neon glow (blurred, tinted)
 *        b. dark extrusion / bevel offset downward for 3D depth
 *        c. multi-stop vertical metallic gradient fill (the "chrome")
 *        d. clipped specular highlight band swept across the letters
 *        e. thin bright rim light on the top edge
 *  3. Sparkles    -> procedural 4-point lens-flare glints with radial bloom
 *
 * Every visual is driven by the `config` prop so it can be edited live.
 */

function seededSparkles(count: number) {
  // Deterministic pseudo-random layout so re-renders are stable
  const pts: { x: number; y: number; r: number }[] = []
  let seed = 1337
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  for (let i = 0; i < count; i++) {
    pts.push({
      x: 0.04 + (i / Math.max(1, count - 1)) * 0.92 + (rand() - 0.5) * 0.04,
      y: 0.42 + rand() * 0.42,
      r: 12 + rand() * 20,
    })
  }
  return pts
}

function hexToRgb(hex: string) {
  const m = hex.replace("#", "")
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m
  const n = parseInt(v, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgba(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}

function drawSparkle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.globalCompositeOperation = "screen"

  const bloom = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.4)
  bloom.addColorStop(0, "rgba(255,255,255,0.9)")
  bloom.addColorStop(0.2, rgba(color, 0.5))
  bloom.addColorStop(1, rgba(color, 0))
  ctx.fillStyle = bloom
  ctx.beginPath()
  ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2)
  ctx.fill()

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

function render(canvas: HTMLCanvasElement, config: BannerConfig) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const cssW = canvas.clientWidth
  const cssH = canvas.clientHeight
  if (cssW === 0 || cssH === 0) return
  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssW, cssH)

  const word = config.word || " "
  const cx = cssW / 2
  const cy = cssH * 0.6

  const letterSpacingPx = config.letterSpacing
  const baseSize = Math.min(cssH * 0.42, (cssW / Math.max(1, word.length)) * 1.25)
  const fontSize = baseSize
  ctx.font = `${config.fontWeight} ${fontSize}px ${config.fontFamily}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  // Manual letter spacing support
  const useSpacing = letterSpacingPx !== 0
  const spacing = fontSize * letterSpacingPx

  const drawText = (yOffset = 0) => {
    if (!useSpacing) {
      ctx.fillText(word, cx, cy + yOffset)
      return
    }
    const widths = [...word].map((ch) => ctx.measureText(ch).width)
    const total = widths.reduce((a, b) => a + b, 0) + spacing * (word.length - 1)
    let x = cx - total / 2
    ctx.textAlign = "left"
    for (let i = 0; i < word.length; i++) {
      ctx.fillText(word[i], x, cy + yOffset)
      x += widths[i] + spacing
    }
    ctx.textAlign = "center"
  }

  const strokeText = (yOffset = 0) => {
    if (!useSpacing) {
      ctx.strokeText(word, cx, cy + yOffset)
      return
    }
    const widths = [...word].map((ch) => ctx.measureText(ch).width)
    const total = widths.reduce((a, b) => a + b, 0) + spacing * (word.length - 1)
    let x = cx - total / 2
    ctx.textAlign = "left"
    for (let i = 0; i < word.length; i++) {
      ctx.strokeText(word[i], x, cy + yOffset)
      x += widths[i] + spacing
    }
    ctx.textAlign = "center"
  }

  const topY = cy - fontSize * 0.5
  const botY = cy + fontSize * 0.5
  const metricsWidth = ctx.measureText(word).width

  // --- Pass 1: outer neon glow -------------------------------------------
  if (config.glowIntensity > 0) {
    ctx.save()
    ctx.shadowColor = rgba(config.glowColor, 0.95)
    ctx.shadowBlur = fontSize * config.glowIntensity
    ctx.fillStyle = rgba(config.glowColor, 0.6)
    for (let i = 0; i < 3; i++) drawText()
    ctx.restore()
  }

  // --- Pass 2: dark extrusion for 3D depth -------------------------------
  if (config.depth > 0) {
    ctx.save()
    const depthPx = Math.max(1, fontSize * config.depth)
    for (let d = depthPx; d > 0; d--) {
      const t = d / depthPx
      ctx.fillStyle = `rgba(${30 + t * 20}, ${10 + t * 10}, ${50 + t * 30}, 1)`
      drawText(d)
    }
    ctx.restore()
  }

  // --- Pass 3: metallic chrome gradient fill -----------------------------
  const chrome = ctx.createLinearGradient(0, topY, 0, botY)
  chrome.addColorStop(0.0, config.chromeTop)
  chrome.addColorStop(0.22, config.chromeUpperMid)
  chrome.addColorStop(0.48, config.chromeHorizon)
  chrome.addColorStop(0.5, config.chromeHorizon)
  chrome.addColorStop(0.62, config.chromeLowerMid)
  chrome.addColorStop(1.0, config.chromeBottom)
  ctx.fillStyle = chrome
  drawText()

  // --- Pass 4: specular highlight band (clipped to the glyphs) -----------
  if (config.specular > 0) {
    ctx.save()
    ctx.globalCompositeOperation = "source-atop"
    const spec = ctx.createLinearGradient(0, topY, 0, cy)
    spec.addColorStop(0, "rgba(255,255,255,0)")
    spec.addColorStop(0.55, `rgba(255,255,255,${config.specular})`)
    spec.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = spec
    ctx.fillRect(cx - metricsWidth, topY, metricsWidth * 2 + spacing * word.length, fontSize * 0.42)
    ctx.restore()
  }

  // --- Pass 5: thin bright rim on top edge -------------------------------
  ctx.save()
  ctx.globalCompositeOperation = "source-atop"
  ctx.strokeStyle = "rgba(255,255,255,0.7)"
  ctx.lineWidth = Math.max(0.5, fontSize * 0.012)
  strokeText(-fontSize * 0.008)
  ctx.restore()

  // --- Sparkles ----------------------------------------------------------
  if (config.showSparkles) {
    for (const s of seededSparkles(config.sparkleCount)) {
      drawSparkle(ctx, s.x * cssW, s.y * cssH, s.r * (cssW / 936), config.sparkleColor)
    }
  }
}

export function AmethystBanner({ config }: { config: BannerConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let raf = 0
    const draw = () => render(canvas, config)

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
  }, [config])

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
          background: `radial-gradient(ellipse 85% 120% at 50% 50%, transparent 40%, rgba(4,2,10,${config.vignette}) 85%)`,
        }}
      />

      {/* Top emblem + tagline */}
      {(config.showEmblem || config.showTagline) && (
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
          {config.showEmblem && (
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
          )}
          {config.showTagline && (
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
              {config.tagline}
            </span>
          )}
        </div>
      )}

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
        aria-label={config.word}
        role="img"
      />
    </div>
  )
}
