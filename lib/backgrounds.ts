export type BackgroundType =
  | "default"
  | "nebula"
  | "bloodstone"
  | "ammolite"
    "amethyst"

export const BACKGROUNDS = {
  default: {
    type: "default",
  },

  nebula: {
    type: "nebula",
    src: "/nebula-bg.png",
  },

  bloodstone: {
    type: "bloodstone",
    src: "BLOODSTONE_BG_BASE64",
  },

  ammolite: {
    type: "ammolite",
    src: "AMMOLITE_BG_BASE64",
  },
  amethyst: {
    type: "amethyst",
    src: "AMETHYST_BG_BASE64",
  },
} as const