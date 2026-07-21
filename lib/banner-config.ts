export type BannerConfig = {
  word: string
  tagline: string
  showTagline: boolean
  showEmblem: boolean
  fontFamily: string
  fontWeight: number
  letterSpacing: number // em

  // Chrome gradient stops (top highlight -> horizon -> bottom highlight)
  chromeTop: string
  chromeUpperMid: string
  chromeHorizon: string
  chromeLowerMid: string
  chromeBottom: string

  // Glow
  glowColor: string
  glowIntensity: number // 0..1 multiplier of font size

  // Depth / extrusion
  depth: number // 0..1 multiplier of font size

  // Specular highlight strength 0..1
  specular: number

  // Sparkles
  showSparkles: boolean
  sparkleCount: number
  sparkleColor: string

  // Background
  vignette: number // 0..1 darkness of edges
}

export const DEFAULT_CONFIG: BannerConfig = {
  word: "AMETHYST",
  tagline: "The Amethyst Order",
  showTagline: true,
  showEmblem: true,
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontWeight: 700,
  letterSpacing: 0.02,

  chromeTop: "#ffffff",
  chromeUpperMid: "#e6dcf5",
  chromeHorizon: "#6f5d94",
  chromeLowerMid: "#b6a6d4",
  chromeBottom: "#ffffff",

  glowColor: "#a555f0",
  glowIntensity: 0.55,

  depth: 0.03,

  specular: 0.85,

  showSparkles: true,
  sparkleCount: 9,
  sparkleColor: "#e6ccff",

  vignette: 0.85,
}
