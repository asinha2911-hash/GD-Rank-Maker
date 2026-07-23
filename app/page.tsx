"use client"

import { useState } from "react"
import { AmethystBanner } from "@/components/amethyst-banner"
import { BannerControls } from "@/components/banner-controls"
import { DEFAULT_CONFIG, PRESETS, type BannerConfig, type PresetName } from "@/lib/banner-config"

export default function Page() {
  const [config, setConfig] = useState<BannerConfig>(DEFAULT_CONFIG)
  const [activePreset, setActivePreset] = useState<PresetName | null>("Amethyst")

  const patch = (p: Partial<BannerConfig>) => {
    setConfig((c) => ({ ...c, ...p }))
    // Editing only the word keeps the active tier styling; any other tweak
    // means the look is no longer a pristine preset.
    const onlyWord = Object.keys(p).length === 1 && "word" in p
    if (!onlyWord) setActivePreset(null)
  }

  const selectPreset = (name: PresetName) => {
    setConfig(PRESETS[name])
    setActivePreset(name)
  }

  const reset = () => {
    setConfig(DEFAULT_CONFIG)
    setActivePreset("Amethyst")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Cosmic Chrome
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Gemstone Tier Banner Studio
          </h1>
          <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            A parametric HTML5 canvas chrome-text engine with a full library of gemstone tier
            presets — Silver through Bloodstone. Switch tiers instantly, edit the text, metal,
            glow, plate, ornaments, and sparkles, and watch it update in real time. 
            - By Ansh P.S. Pls give cherry mod for this (jk idc if you do)
          </p>
        </header>

        {/* Live preview */}
        <section className="flex flex-col items-center gap-3">
          <div className="w-full rounded-xl border border-border bg-card/40 p-4 md:p-8">
            <div className="mx-auto flex justify-center">
              <AmethystBanner config={config} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {activePreset ? `Preset: ${activePreset}` : "Custom"} — live preview, updates as you edit
          </p>
        </section>

        {/* Editor grid */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div className="order-2 flex flex-col gap-4 lg:order-1">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">
              How it works
            </h2>
            <ol className="flex list-inside list-decimal flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                <span className="text-foreground">Presets:</span> each gemstone tier is a full
                config — chrome colors, glow, plate, stars, sparkles, and side ornaments. All editable with the control panel
              </li>
              <li>
                <span className="text-foreground">Chrome text:</span> a canvas renderer draws
                the word in passes — neon glow, 3D extrusion, a multi-stop metallic gradient,
                a clipped specular sweep, and a top rim light. I also added AI into the mix so that it helps render and designs a few layers too complex for code alone.
              </li>
              <li>
                <span className="text-foreground">Plate &amp; ornaments:</span> a config-driven
                gradient plate with procedural stars, plus SVG side pieces (frame, gold ingots,
                crescent moons, aurora orbs). Design any rank or combination of ranks you'd like, all with a few button presses. You're welcome.
              </li>
              <li>
                Switch a preset to load its look, then change the word to brand any text in that
                tier&apos;s style.
              </li>
            </ol>
            <div className="rounded-lg border border-border bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Object switching:</span> presets
              are just data, so selecting one swaps the entire object in place while keeping the
              same live renderer — no reload, fully editable afterward.
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="rounded-xl border border-border bg-card/40 p-5">
              <BannerControls
                config={config}
                activePreset={activePreset}
                onSelectPreset={selectPreset}
                onChange={patch}
                onReset={reset}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
