"use client"

import { useEffect, useRef, useState } from "react"
import html2canvas from "html2canvas-pro"
import { AmethystBanner } from "@/components/banner-rendering"
import { BannerControls } from "@/components/banner-controls"
import { DEFAULT_CONFIG, PRESETS, applyBackgroundTheme, type BannerConfig, type PresetName } from "@/lib/banner-config"

export default function Page() {
  const [config, setConfig] = useState<BannerConfig>(DEFAULT_CONFIG)
  const [activePreset, setActivePreset] = useState<PresetName | null>("Amethyst")
  const [isExporting, setIsExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // Auto-enable animation 5 seconds after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setConfig((c) => ({ ...c, enableAnimation: true }))
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const patch = (p: Partial<BannerConfig>) => {
    setConfig((c) => {
      const next = { ...c, ...p }
      if ("background" in p && p.background !== undefined) {
        return applyBackgroundTheme({ ...next, background: p.background })
      }
      return next
    })
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
    setConfig(PRESETS.Amethyst)
    setActivePreset("Amethyst")
  }

  const exportRankCard = async () => {
    if (!previewRef.current) return

    setIsExporting(true)
    try {
      const card = previewRef.current
      const canvas = await html2canvas(card, {
        backgroundColor: "#050816",
        scale: 4,
        useCORS: true,
        logging: false,
        width: card.scrollWidth,
        height: card.scrollHeight,
      })

      const fileName = `${(config.word || "rank-card").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "rank-card"}.png`
      const link = document.createElement("a")
      link.download = fileName
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Failed to export rank card", error)
    } finally {
      setIsExporting(false)
    }
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
          <div
            ref={previewRef}
            style={{
              width: "100%",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "linear-gradient(180deg, #050816 0%, #0b1228 100%)",
              padding: "1rem",
            }}
            className="md:p-8"
          >
            <div className="mx-auto flex justify-center">
              <AmethystBanner config={config} />
            </div>
          </div>
          <button
            type="button"
            onClick={exportRankCard}
            disabled={isExporting}
            className="w-full rounded-xl border border-primary/40 bg-gradient-to-r from-primary/20 via-fuchsia-500/20 to-cyan-500/20 px-4 py-3 text-sm font-semibold text-foreground shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all hover:scale-[1.01] hover:border-primary/70 hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
          >
            {isExporting ? "Exporting 4K PNG…" : "Export Rank Card"}
          </button>
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
