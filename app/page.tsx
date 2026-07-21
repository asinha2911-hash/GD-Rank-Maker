import { AmethystBanner } from "@/components/amethyst-banner"

const CODE = `// Hybrid raster + canvas composite for maximum realism
export function AmethystBanner() {
  return (
    <div style={{ position: "relative", aspectRatio: "234 / 60" }}>
      {/* 1. Base plate: AI-generated photoreal nebula */}
      <img src="/nebula-bg.png" style={{ objectFit: "cover" }} />

      {/* 2. Chrome text drawn on <canvas> at devicePixelRatio */}
      <canvas ref={canvasRef} />
    </div>
  )
}

// render() draws the word in layered passes:
function render(canvas) {
  const ctx = canvas.getContext("2d")

  // a. outer neon violet glow (shadowBlur, stacked)
  ctx.shadowColor = "rgba(165,85,240,.95)"
  ctx.shadowBlur = fontSize * 0.55
  ctx.fillText("AMETHYST", cx, cy)

  // b. dark extrusion offset down -> 3D depth
  for (let d = depth; d > 0; d--) ctx.fillText("AMETHYST", cx, cy + d)

  // c. multi-stop vertical CHROME gradient fill
  const chrome = ctx.createLinearGradient(0, topY, 0, botY)
  chrome.addColorStop(0.0, "#ffffff")
  chrome.addColorStop(0.5, "#7d6ca0")   // dark chrome horizon
  chrome.addColorStop(0.52, "#5f4f82")
  chrome.addColorStop(1.0, "#ffffff")
  ctx.fillStyle = chrome
  ctx.fillText("AMETHYST", cx, cy)

  // d. clipped specular highlight sweep (source-atop)
  // e. bright rim light on top edge (strokeText)
  // f. procedural 4-point lens-flare sparkles (screen blend)
}`

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      <div className="mx-auto max-w-5xl px-4 py-12 flex flex-col gap-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-balance">AMETHYST banner recreation</h1>
          <p className="text-sm text-neutral-400 text-pretty">
            A hybrid rendition: an AI-generated photoreal nebula plate, chrome typography rendered on an
            HTML5 canvas in multiple metal passes, and procedural lens-flare sparkles composited on top.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-neutral-500">Original</span>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-EIzB0NT4ui33Lpg51jkh9yqLpErRyL.png"
            alt="Original AMETHYST cosmic banner"
            className="w-full rounded border border-neutral-800"
          />
        </section>

        <section className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-neutral-500">My rendition</span>
          <AmethystBanner />
        </section>

        <section className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-widest text-neutral-500">Technique &amp; code</span>
          <pre className="overflow-x-auto rounded border border-neutral-800 bg-neutral-900 p-4 text-xs leading-relaxed text-neutral-300">
            <code>{CODE}</code>
          </pre>
        </section>
      </div>
    </main>
  )
}
