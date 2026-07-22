export type OrnamentType = "none" | "frame" | "ingots" | "moons" | "orbs"
import { BLOODSTONE_BG_BASE64 } from '../public/bloodstone';
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

  // Background plate
  // Background plate
  bgInner: string
  bgOuter: string
  bgAccent: string

  showNebula: boolean

  backgroundImage?: string

  starColor: string
  starCount: number
  vignette: number

  // Side ornaments
  ornament: OrnamentType
  ornamentColor: string
}

// ---------------------------------------------------------------------------
// Preset library. Each tier reproduces the look of one nameplate:
// colours, glow, plate background, sparkles and side ornaments.
// ---------------------------------------------------------------------------

export const PRESETS: Record<string, BannerConfig> = {
  Silver: {
    word: "SILVER",
    tagline: "Tier I",
    showTagline: true,
    showEmblem: false,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    letterSpacing: 0.04,
    chromeTop: "#ffffff",
    chromeUpperMid: "#dfe3e8",
    chromeHorizon: "#6b7078",
    chromeLowerMid: "#c4c9d0",
    chromeBottom: "#ffffff",
    glowColor: "#c8ccd4",
    glowIntensity: 0.18,
    depth: 0.02,
    specular: 0.9,
    showSparkles: true,
    sparkleCount: 5,
    sparkleColor: "#eef1f5",
    bgInner: "#1a1d24",
    bgOuter: "#050608",
    bgAccent: "#2a2f38",
    showNebula: false,
    starColor: "#cdd3dc",
    starCount: 40,
    vignette: 0.8,
    ornament: "frame",
    ornamentColor: "#b8bec8",
  },

  Opal: {
    word: "OPAL",
    tagline: "Tier II",
    showTagline: true,
    showEmblem: false,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    letterSpacing: 0.05,
    chromeTop: "#ffffff",
    chromeUpperMid: "#ffd9ec",
    chromeHorizon: "#9f8fd6",
    chromeLowerMid: "#a8e0f2",
    chromeBottom: "#ffffff",
    glowColor: "#c9a8ff",
    glowIntensity: 0.4,
    depth: 0.02,
    specular: 0.85,
    showSparkles: true,
    sparkleCount: 7,
    sparkleColor: "#e6d6ff",
    bgInner: "#0a1a22",
    bgOuter: "#03080b",
    bgAccent: "#123842",
    showNebula: false,
    starColor: "#d6ecff",
    starCount: 45,
    vignette: 0.82,
    ornament: "none",
    ornamentColor: "#a8e0f2",
  },

  Tourmaline: {
    word: "TOURMALINE",
    tagline: "Tier III",
    showTagline: true,
    showEmblem: false,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    letterSpacing: 0.02,
    chromeTop: "#ffd6ee",
    chromeUpperMid: "#ff6fbf",
    chromeHorizon: "#a01f74",
    chromeLowerMid: "#ff8fd0",
    chromeBottom: "#ffd6ee",
    glowColor: "#ff3fa0",
    glowIntensity: 0.5,
    depth: 0.025,
    specular: 0.8,
    showSparkles: true,
    sparkleCount: 8,
    sparkleColor: "#9dffb8",
    bgInner: "#0a2417",
    bgOuter: "#03100a",
    bgAccent: "#124a2a",
    showNebula: false,
    starColor: "#c8ffd8",
    starCount: 55,
    vignette: 0.82,
    ornament: "none",
    ornamentColor: "#ff6fbf",
  },

  Almandine: {
    word: "ALMANDINE",
    tagline: "Tier IV",
    showTagline: true,
    showEmblem: false,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    letterSpacing: 0.03,
    chromeTop: "#ff9a86",
    chromeUpperMid: "#d83a2a",
    chromeHorizon: "#5f0d08",
    chromeLowerMid: "#c8362a",
    chromeBottom: "#ff9a86",
    glowColor: "#a01810",
    glowIntensity: 0.4,
    depth: 0.025,
    specular: 0.7,
    showSparkles: true,
    sparkleCount: 5,
    sparkleColor: "#ff8a6a",
    bgInner: "#1a0605",
    bgOuter: "#0a0202",
    bgAccent: "#380a06",
    showNebula: false,
    starColor: "#ffb0a0",
    starCount: 40,
    vignette: 0.85,
    ornament: "none",
    ornamentColor: "#c8362a",
  },

  Ruby: {
    word: "RUBY",
    tagline: "Tier V",
    showTagline: true,
    showEmblem: false,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    letterSpacing: 0.05,
    chromeTop: "#ffc4d4",
    chromeUpperMid: "#ff2d6a",
    chromeHorizon: "#98002f",
    chromeLowerMid: "#ff5a86",
    chromeBottom: "#ffc4d4",
    glowColor: "#ff2050",
    glowIntensity: 0.6,
    depth: 0.025,
    specular: 0.85,
    showSparkles: true,
    sparkleCount: 10,
    sparkleColor: "#ff86a6",
    bgInner: "#20040a",
    bgOuter: "#0c0104",
    bgAccent: "#48091a",
    showNebula: false,
    starColor: "#ffb0c2",
    starCount: 55,
    vignette: 0.82,
    ornament: "none",
    ornamentColor: "#ff2d6a",
  },

  Gold: {
    word: "GOLD",
    tagline: "Tier VI",
    showTagline: true,
    showEmblem: false,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    letterSpacing: 0.05,
    chromeTop: "#fff4c2",
    chromeUpperMid: "#ffd24d",
    chromeHorizon: "#7f5410",
    chromeLowerMid: "#f0b83a",
    chromeBottom: "#fff0b0",
    glowColor: "#ffb020",
    glowIntensity: 0.5,
    depth: 0.03,
    specular: 0.9,
    showSparkles: true,
    sparkleCount: 8,
    sparkleColor: "#ffe08a",
    bgInner: "#181103",
    bgOuter: "#080601",
    bgAccent: "#38280a",
    showNebula: false,
    starColor: "#ffe6a0",
    starCount: 45,
    vignette: 0.82,
    ornament: "ingots",
    ornamentColor: "#ffcf4d",
  },

  Moonstone: {
    word: "MOONSTONE",
    tagline: "Tier VII",
    showTagline: true,
    showEmblem: false,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    letterSpacing: 0.04,
    chromeTop: "#ffffff",
    chromeUpperMid: "#dbeaff",
    chromeHorizon: "#66739f",
    chromeLowerMid: "#bcd2f0",
    chromeBottom: "#ffffff",
    glowColor: "#7fa8ff",
    glowIntensity: 0.42,
    depth: 0.025,
    specular: 0.88,
    showSparkles: true,
    sparkleCount: 7,
    sparkleColor: "#dceaff",
    bgInner: "#0a0f1e",
    bgOuter: "#03050b",
    bgAccent: "#141d38",
    showNebula: false,
    starColor: "#dceaff",
    starCount: 50,
    vignette: 0.84,
    ornament: "moons",
    ornamentColor: "#cde0ff",
  },

  Diamond: {
    word: "DIAMOND",
    tagline: "Tier IX · Apex",
    showTagline: true,
    showEmblem: false,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    letterSpacing: 0.06,
    chromeTop: "#ffffff",
    chromeUpperMid: "#eaffff",
    chromeHorizon: "#9fd0e0",
    chromeLowerMid: "#d6f2ff",
    chromeBottom: "#ffffff",
    glowColor: "#bfefff",
    glowIntensity: 0.7,
    depth: 0.02,
    specular: 1,
    showSparkles: true,
    sparkleCount: 16,
    sparkleColor: "#ffffff",
    bgInner: "#0c1418",
    bgOuter: "#04070a",
    bgAccent: "#1c3038",
    showNebula: false,
    starColor: "#eaffff",
    starCount: 70,
    vignette: 0.8,
    ornament: "none",
    ornamentColor: "#d6f2ff",
  },

  Ammolite: {
    word: "AMMOLITE",
    tagline: "Tier X · Aurora",
    showTagline: true,
    showEmblem: false,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    letterSpacing: 0.04,
    chromeTop: "#b6ff9c",
    chromeUpperMid: "#ffcf5c",
    chromeHorizon: "#6a3aa8",
    chromeLowerMid: "#4fd0ff",
    chromeBottom: "#ff8fd0",
    glowColor: "#59e0a0",
    glowIntensity: 0.6,
    depth: 0.028,
    specular: 0.85,
    showSparkles: true,
    sparkleCount: 12,
    sparkleColor: "#ffe08a",
    bgInner: "#041610",
    bgOuter: "#020a08",
    bgAccent: "#0e3a4a",
    showNebula: false,
    starColor: "#c8ffe0",
    starCount: 60,
    vignette: 0.82,
    ornament: "orbs",
    ornamentColor: "#59e0a0",
  },

  Bloodstone: {
    word: "BLOODSTONE",
    tagline: "Tier XII",
    showTagline: true,
    showEmblem: false,
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    letterSpacing: 0.02,
    chromeTop: "#d6ffb0",
    chromeUpperMid: "#4fd83a",
    chromeHorizon: "#124f10",
    chromeLowerMid: "#8fe85a",
    chromeBottom: "#d6ffb0",
    glowColor: "#30d020",
    glowIntensity: 0.6,
    depth: 0.025,
    specular: 0.8,
    showSparkles: true,
    sparkleCount: 9,
    sparkleColor: "#ff4030",
    bgInner: "#04140a",
    bgOuter: "#020805",
    bgAccent: "#3a0806",
    showNebula: false,
    backgroundImage: BLOODSTONE_BG_BASE64,
    starColor: "#9dff8a",
    starCount: 55,
    vignette: 0.84,
    ornament: "none",
    ornamentColor: "#ff4030",
  },

  Amethyst: {
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
    bgInner: "#2a1245",
    bgOuter: "#06030e",
    bgAccent: "#5a2a90",
    showNebula: true,
    starColor: "#e6ccff",
    starCount: 55,
    vignette: 0.85,
    ornament: "none",
    ornamentColor: "#c9a8ff",
  },
}

export const PRESET_ORDER = [
  "Silver",
  "Opal",
  "Tourmaline",
  "Almandine",
  "Ruby",
  "Gold",
  "Moonstone",
  "Diamond",
  "Ammolite",
  "Bloodstone",
  "Amethyst",
] as const

export type PresetName = (typeof PRESET_ORDER)[number]

export const DEFAULT_CONFIG: BannerConfig = PRESETS.Amethyst
