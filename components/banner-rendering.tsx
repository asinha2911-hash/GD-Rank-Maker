"use client"

import { useEffect, useRef } from "react"
import { DEFAULT_CONFIG, type BannerConfig } from "@/lib/banner-config"
import { BACKGROUNDS } from "@/lib/backgrounds"

/**
 * Fully parametric tiered nameplate renderer.
 *
 * Technique stack (highest realism achievable in the browser):
 *  1. Base plate  -> config-driven radial-gradient plate + procedural stars,
 *                    with an optional AI-generated photoreal nebula overlay.
 *  2. Chrome text -> HTML5 <canvas> 2D, drawn in multiple passes:
 *        a. soft outer neon glow (blurred, tinted)
 *        b. dark extrusion / bevel offset downward for 3D depth
 *        c. multi-stop vertical metallic gradient fill (the "chrome")
 *        d. clipped specular highlight band swept across the letters
 *        e. thin bright rim light on the top edge
 *  3. Sparkles    -> procedural 4-point lens-flare glints with radial bloom
 *  4. Ornaments   -> SVG side pieces (frame / ingots / moons / orbs)
 *
 * Every visual is driven by the `config` prop so it can be edited live and
 * swapped instantly between presets.
 */

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function seededSparkles(count: number) {
  const pts: { x: number; y: number; r: number }[] = []
  const rand = seeded(1337)
  for (let i = 0; i < count; i++) {
    pts.push({
      x: 0.04 + (i / Math.max(1, count - 1)) * 0.92 + (rand() - 0.5) * 0.04,
      y: 0.42 + rand() * 0.42,
      r: 12 + rand() * 20,
    })
  }
  return pts
}

function seededStars(count: number) {
  const pts: { x: number; y: number; r: number; a: number }[] = []
  const rand = seeded(9001)
  for (let i = 0; i < count; i++) {
    pts.push({
      x: rand(),
      y: rand(),
      r: 0.4 + rand() * 1.3,
      a: 0.25 + rand() * 0.75,
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

  // --- Pass 0: procedural stars over the plate ---------------------------
  if (config.starCount > 0) {
    ctx.save()
    ctx.globalCompositeOperation = "screen"
    for (const s of seededStars(config.starCount)) {
      ctx.fillStyle = rgba(config.starColor, s.a)
      ctx.beginPath()
      ctx.arc(s.x * cssW, s.y * cssH, s.r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  const word = config.word || " "
  const cx = cssW / 2
  const cy = cssH * 0.6

  const letterSpacingPx = config.letterSpacing
  const baseSize = Math.min(cssH * 0.42, (cssW / Math.max(1, word.length)) * 1.25)
  const fontSize = baseSize
  ctx.font = `${config.fontWeight} ${fontSize}px ${config.fontFamily}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

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
    const { r, g, b } = hexToRgb(config.chromeHorizon)
    const depthPx = Math.max(1, fontSize * config.depth)
    for (let d = depthPx; d > 0; d--) {
      const t = d / depthPx
      ctx.fillStyle = `rgba(${r * 0.35 + t * 20}, ${g * 0.35 + t * 12}, ${b * 0.35 + t * 20}, 1)`
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

// --- Side ornaments (SVG) --------------------------------------------------

function Ornaments({ config }: { config: BannerConfig }) {
  const c = config.ornamentColor
  if (config.ornament === "none") return null

  const side = (mirror: boolean) => {
    const style: React.CSSProperties = {
      position: "absolute",
      top: "50%",
      [mirror ? "right" : "left"]: "3%",
      transform: `translateY(-50%) ${mirror ? "scaleX(-1)" : ""}`,
      zIndex: 3,
    }

    if (config.ornament === "ingots") {
      return (
        <svg key={String(mirror)} width="58" height="42" viewBox="0 0 58 42" style={style} aria-hidden="true">
          <polygon points="6,34 20,34 26,42 0,42" fill={c} opacity="0.55" />
          <polygon points="10,24 24,24 30,32 4,32" fill={c} opacity="0.75" />
          <polygon points="16,14 30,14 36,22 10,22" fill={c} />
          <polygon points="16,14 30,14 30,17 16,17" fill="#ffffff" opacity="0.6" />
        </svg>
      )
    }

    if (config.ornament === "moons") {
      return (
        <svg key={String(mirror)} width="34" height="34" viewBox="0 0 34 34" style={style} aria-hidden="true">
          <defs>
            <mask id={`moon-${mirror}`}>
              <rect width="34" height="34" fill="#fff" />
              <circle cx="22" cy="15" r="12" fill="#000" />
            </mask>
          </defs>
          <circle cx="16" cy="17" r="12" fill={c} mask={`url(#moon-${mirror})`} />
        </svg>
      )
    }

    if (config.ornament === "orbs") {
      return (
        <svg key={String(mirror)} width="40" height="40" viewBox="0 0 40 40" style={style} aria-hidden="true">
          <circle cx="20" cy="20" r="15" fill="none" stroke={c} strokeWidth="1.5" opacity="0.8" />
          <circle cx="20" cy="20" r="9" fill="none" stroke="#4fd0ff" strokeWidth="1.5" opacity="0.8" />
          <circle cx="20" cy="20" r="4" fill="#ffcf5c" opacity="0.9" />
          <circle cx="20" cy="5" r="1.6" fill="#ff8fd0" />
          <circle cx="35" cy="20" r="1.6" fill="#b6ff9c" />
        </svg>
      )
    }

    if (config.ornament === "diamond") { 
      return ( 
        <div 
          key={String(mirror)} 
          style={{ 
            ...style, 
            width: "clamp(88px, 10vw, 136px)", 
            height: "auto", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            opacity: 0.95, 
            filter: `drop-shadow(0 0 8px ${rgba(c, 0.7)})`, 
          }} 
        > 
          {/* eslint-disable-next-line @next/next/no-img-element */} 
          <img 
            src="/diamond.png" 
            alt="" 
            aria-hidden="true" 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "contain", 
              pointerEvents: "none", 
            }} 
          /> 
        </div> 
      );
    } 
    return null;
  }

  if (config.ornament === "frame") {
    return (
      <div
        style={{
          position: "absolute",
          inset: "8%",
          border: `1px solid ${rgba(c, 0.6)}`,
          borderRadius: 3,
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        {[
          { top: -3, left: -3 },
          { top: -3, right: -3 },
          { bottom: -3, left: -3 },
          { bottom: -3, right: -3 },
        ].map((pos, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              background: c,
              ...pos,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      {side(false)}
      {side(true)}
    </>
  )
}

// 1. PLACE YOUR CONVERTED BASE64 STRING HERE (Replace the short placeholder below)

export function AmethystBanner({ config: configProp }: { config?: BannerConfig }) {
  // Guard against an undefined/partial config (e.g. during HMR) so the
  // preview never crashes; missing keys fall back to sensible defaults.
  const config: BannerConfig = { ...DEFAULT_CONFIG, ...configProp }
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldAnimateBackground = config.background !== "none"

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
    <>
      <style jsx>{`
        @keyframes gemstone-drift {
          0% {
            transform: translate3d(-8%, -5%, 0) scale(1.03);
          }
          25% {
            transform: translate3d(4%, -2%, 0) scale(1.06);
          }
          50% {
            transform: translate3d(7%, 4%, 0) scale(1.1);
          }
          75% {
            transform: translate3d(-3%, 5%, 0) scale(1.07);
          }
          100% {
            transform: translate3d(-1%, -1%, 0) scale(1.04);
          }
        }

        @keyframes gemstone-shimmer {
          0% {
            transform: translate3d(-140%, 0, 0) rotate(8deg);
            opacity: 0;
          }
          35% {
            opacity: 0.75;
          }
          100% {
            transform: translate3d(140%, 0, 0) rotate(8deg);
            opacity: 0;
          }
        }

        @keyframes gemstone-pulse {
          0%, 100% {
            opacity: 0.8;
            filter: saturate(1.05) brightness(1.02);
          }
          50% {
            opacity: 1;
            filter: saturate(1.25) brightness(1.12);
          }
        }
      `}</style>
      <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 936,
        aspectRatio: "234 / 60",
        overflow: "hidden",
        borderRadius: 4,
        backgroundColor: config.bgOuter,
      }}
    >
      {/* Config-driven plate: radial glow from center to dark edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 120% at 50% 55%, ${rgba(config.bgAccent, 0.7)}, transparent 70%),
            radial-gradient(ellipse 120% 120% at 50% 45%, ${config.bgInner}, ${config.bgOuter} 80%)
          `,
        }}
      />

      {/* Optional AI nebula overlay (Amethyst) */}
      {config.background === "nebula" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/nebula-bg.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "screen",
            opacity: 0.9,
          }}
        />
      )}
      {/* Config-driven image background */}
      {shouldAnimateBackground && (
        <div
          style={{
            position: "absolute",
            inset: "-3%",
            zIndex: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BACKGROUNDS[config.background].src}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              mixBlendMode: "normal",
              opacity: 1,
              transformOrigin: "center center",
              animation: config.enableAnimation ? "gemstone-drift 14s ease-in-out infinite alternate, gemstone-pulse 8s ease-in-out infinite" : "none",
              willChange: "transform, filter, opacity",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 42%, transparent 70%)`,
              transform: "translate3d(-140%, 0, 0) rotate(8deg)",
              animation: "gemstone-shimmer 9s linear infinite",
              mixBlendMode: "screen",
              opacity: 0.7,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2), transparent 30%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.12), transparent 25%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.14), transparent 24%)`,
              opacity: 0.85,
              pointerEvents: "none",
            }}
          />
        </div>
      )}
      {/* Vignette to deepen the edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 85% 120% at 50% 50%, transparent 40%, ${rgba(
            config.bgOuter,
            config.vignette,
          )} 85%)`,
        }}
      />

      {/* Side ornaments */}
      <Ornaments config={config} />

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
              <circle cx="12" cy="12" r="10" fill="none" stroke={rgba(config.ornamentColor, 0.9)} strokeWidth="1" />
              <path
                d="M6 9 L12 4 L18 9 L15 16 L9 16 Z"
                fill="none"
                stroke={rgba(config.ornamentColor, 0.9)}
                strokeWidth="1"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="11" r="2.2" fill={rgba(config.ornamentColor, 0.9)} />
            </svg>
          )}
          {config.showTagline && (
            <span

              style={{
                fontSize: "clamp(5px, 1.1vw, 9px)",
                letterSpacing: "0.35em",
                color: rgba(config.starColor, 0.8),
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                fontFamily: "Georgia, serif",
                textShadow: `0 0 6px ${rgba(config.glowColor, 0.8)}`,
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
    </>
  )
}
