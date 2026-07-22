"use client"

import type { BannerConfig, OrnamentType, PresetName } from "@/lib/banner-config"
import { PRESETS, PRESET_ORDER } from "@/lib/banner-config"

type Props = {
  config: BannerConfig
  activePreset: PresetName | null
  onSelectPreset: (name: PresetName) => void
  onChange: (patch: Partial<BannerConfig>) => void
  onReset: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-lg border border-border bg-card/40 p-4">
      <legend className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </legend>
      <div className="flex flex-col gap-3">{children}</div>
    </fieldset>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm">
      <span className="text-foreground/80">{label}</span>
      {children}
    </label>
  )
}

function ColorField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <span className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-9 cursor-pointer rounded border border-border bg-transparent p-0.5"
      />
      <span className="w-16 font-mono text-xs uppercase text-muted-foreground">{value}</span>
    </span>
  )
}

function Slider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <span className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-32 accent-primary"
      />
      <span className="w-10 text-right font-mono text-xs text-muted-foreground">{value}</span>
    </span>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        value ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

const FONTS = [
  { label: "Serif (Georgia)", value: 'Georgia, "Times New Roman", serif' },
  { label: "Sans (Arial)", value: "Arial, Helvetica, sans-serif" },
  { label: "Mono", value: '"Courier New", monospace' },
  { label: "Impact", value: "Impact, sans-serif" },
]

const ORNAMENTS: { label: string; value: OrnamentType }[] = [
  { label: "None", value: "none" },
  { label: "Frame", value: "frame" },
  { label: "Gold ingots", value: "ingots" },
  { label: "Crescent moons", value: "moons" },
  { label: "Aurora orbs", value: "orbs" },
]

/** A small swatch that previews the chrome gradient of a preset. */
function PresetSwatch({ name }: { name: PresetName }) {
  const p = PRESETS[name]
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 shrink-0 rounded-full border border-white/20"
      style={{
        background: `linear-gradient(180deg, ${p.chromeTop}, ${p.chromeHorizon} 50%, ${p.chromeBottom})`,
        boxShadow: `0 0 6px ${p.glowColor}`,
      }}
    />
  )
}

export function BannerControls({ config, activePreset, onSelectPreset, onChange, onReset }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">
          Control Panel
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-border px-3 py-1 text-xs text-foreground/80 transition-colors hover:bg-muted"
        >
          Reset
        </button>
      </div>

      <Section title="Tier Presets">
        <div className="grid grid-cols-2 gap-2">
          {PRESET_ORDER.map((name) => {
            const active = activePreset === name
            return (
              <button
                key={name}
                type="button"
                onClick={() => onSelectPreset(name)}
                className={`flex items-center gap-2 rounded-md border px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary/15 text-foreground"
                    : "border-border bg-card/40 text-foreground/80 hover:bg-muted"
                }`}
              >
                <PresetSwatch name={name} />
                <span className="truncate">{name}</span>
              </button>
            )
          })}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Pick a tier to load its full look, then tweak anything below. Change the word to
          apply any tier&apos;s style to your own text.
        </p>
      </Section>

      <Section title="Content">
        <Row label="Word">
          <input
            type="text"
            value={config.word}
            onChange={(e) => onChange({ word: e.target.value.toUpperCase() })}
            className="w-40 rounded border border-border bg-input px-2 py-1 text-sm text-foreground"
          />
        </Row>
        <Row label="Tagline">
          <input
            type="text"
            value={config.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            className="w-40 rounded border border-border bg-input px-2 py-1 text-sm text-foreground"
          />
        </Row>
        <Row label="Show tagline">
          <Toggle value={config.showTagline} onChange={(v) => onChange({ showTagline: v })} />
        </Row>
        <Row label="Show emblem">
          <Toggle value={config.showEmblem} onChange={(v) => onChange({ showEmblem: v })} />
        </Row>
      </Section>

      <Section title="Typography">
        <Row label="Font">
          <select
            value={config.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value })}
            className="w-40 rounded border border-border bg-input px-2 py-1 text-sm text-foreground"
          >
            {FONTS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Row>
        <Row label="Weight">
          <Slider value={config.fontWeight} min={400} max={900} step={100} onChange={(v) => onChange({ fontWeight: v })} />
        </Row>
        <Row label="Letter spacing">
          <Slider value={config.letterSpacing} min={-0.05} max={0.3} step={0.01} onChange={(v) => onChange({ letterSpacing: v })} />
        </Row>
      </Section>

      <Section title="Chrome Metal">
        <Row label="Top highlight">
          <ColorField value={config.chromeTop} onChange={(v) => onChange({ chromeTop: v })} />
        </Row>
        <Row label="Upper mid">
          <ColorField value={config.chromeUpperMid} onChange={(v) => onChange({ chromeUpperMid: v })} />
        </Row>
        <Row label="Horizon">
          <ColorField value={config.chromeHorizon} onChange={(v) => onChange({ chromeHorizon: v })} />
        </Row>
        <Row label="Lower mid">
          <ColorField value={config.chromeLowerMid} onChange={(v) => onChange({ chromeLowerMid: v })} />
        </Row>
        <Row label="Bottom highlight">
          <ColorField value={config.chromeBottom} onChange={(v) => onChange({ chromeBottom: v })} />
        </Row>
        <Row label="Specular">
          <Slider value={config.specular} min={0} max={1} step={0.05} onChange={(v) => onChange({ specular: v })} />
        </Row>
        <Row label="Depth (3D)">
          <Slider value={config.depth} min={0} max={0.12} step={0.005} onChange={(v) => onChange({ depth: v })} />
        </Row>
      </Section>

      <Section title="Glow">
        <Row label="Glow color">
          <ColorField value={config.glowColor} onChange={(v) => onChange({ glowColor: v })} />
        </Row>
        <Row label="Glow intensity">
          <Slider value={config.glowIntensity} min={0} max={1.2} step={0.05} onChange={(v) => onChange({ glowIntensity: v })} />
        </Row>
      </Section>

      <Section title="Background Plate">
        <Row label="Center glow">
          <ColorField value={config.bgInner} onChange={(v) => onChange({ bgInner: v })} />
        </Row>
        <Row label="Edge color">
          <ColorField value={config.bgOuter} onChange={(v) => onChange({ bgOuter: v })} />
        </Row>
        <Row label="Accent tint">
          <ColorField value={config.bgAccent} onChange={(v) => onChange({ bgAccent: v })} />
        </Row>
        <Row label="Nebula overlay">
          <Toggle value={config.showNebula} onChange={(v) => onChange({ showNebula: v })} />
        </Row>
        <Row label="Bloodstone overlay"> 
          <Toggle 
            value={(config as any).showBloodstone} 
            onChange={(v) => onChange({ showBloodstone: v } as any)} 
          /> 
        </Row>

        <Row label="Vignette">
          <Slider value={config.vignette} min={0} max={1} step={0.05} onChange={(v) => onChange({ vignette: v })} />
        </Row>
      </Section>

      <Section title="Ornaments">
        <Row label="Side pieces">
          <select
            value={config.ornament}
            onChange={(e) => onChange({ ornament: e.target.value as OrnamentType })}
            className="w-40 rounded border border-border bg-input px-2 py-1 text-sm text-foreground"
          >
            {ORNAMENTS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Row>
        <Row label="Ornament color">
          <ColorField value={config.ornamentColor} onChange={(v) => onChange({ ornamentColor: v })} />
        </Row>
      </Section>

      <Section title="Sparkles & Stars">
        <Row label="Show sparkles">
          <Toggle value={config.showSparkles} onChange={(v) => onChange({ showSparkles: v })} />
        </Row>
        <Row label="Sparkle count">
          <Slider value={config.sparkleCount} min={0} max={24} step={1} onChange={(v) => onChange({ sparkleCount: v })} />
        </Row>
        <Row label="Sparkle color">
          <ColorField value={config.sparkleColor} onChange={(v) => onChange({ sparkleColor: v })} />
        </Row>
        <Row label="Star count">
          <Slider value={config.starCount} min={0} max={120} step={5} onChange={(v) => onChange({ starCount: v })} />
        </Row>
        <Row label="Star color">
          <ColorField value={config.starColor} onChange={(v) => onChange({ starColor: v })} />
        </Row>
      </Section>
    </div>
  )
}
