"use client"

import { useState } from "react"
import { AmethystBanner } from "@/components/amethyst-banner"
import { BannerControls } from "@/components/banner-controls"
import { DEFAULT_CONFIG, type BannerConfig } from "@/lib/banner-config"

export default function Page() {
  const [config, setConfig] = useState<BannerConfig>(DEFAULT_CONFIG)

  const patch = (p: Partial<BannerConfig>) => setConfig((c) => ({ ...c, ...p }))
  const reset = () => setConfig(DEFAULT_CONFIG)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Cosmic Chrome
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Amethyst Banner Studio
          </h1>
          <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            A hybrid rendition: an AI-generated photoreal nebula plate with a live,
            parametric HTML5 canvas chrome-text layer. Edit the text, metal colors,
            glow, depth, and sparkles and watch it update in real time.
          </p>
        </header>

        {/* Live preview */}
        <section className="flex flex-col items-center gap-3">
          <div className="w-full rounded-xl border border-border bg-card/40 p-4 md:p-8">
            <div className="mx-auto flex justify-center">
              <AmethystBanner config={config} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Live preview — updates as you edit</p>
        </section>

        {/* Editor grid */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <div className="order-2 flex flex-col gap-4 lg:order-1">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              How it works
            </h2>
            <ol className="flex list-inside list-decimal flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <span className="text-foreground">Base plate:</span> a diffusion-model nebula
                image supplies the real gas, dust, and stars.
              </li>
              <li>
                <span className="text-foreground">Chrome text:</span> a canvas renderer draws
                the word in passes — neon glow, 3D extrusion, a multi-stop metallic gradient,
                a clipped specular sweep, and a top rim light.
              </li>
              <li>
                <span className="text-foreground">Sparkles:</span> procedural four-point
                lens-flare glints composited with screen blending.
              </li>
              <li>
                Every value is a control on the right, so the whole banner is fully editable.
              </li>
            </ol>
            <div className="rounded-lg border border-border bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Why not pure AI?</span> Image
              models are non-deterministic and unreliable at spelling exact words, so the
              lettering, kerning, emblem, and glow can&apos;t be matched pixel-for-pixel by
              generation alone. The parametric canvas layer is what makes an exact, editable
              result possible.
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="rounded-xl border border-border bg-card/40 p-5">
              <BannerControls config={config} onChange={patch} onReset={reset} />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
