import { AMETHYST_BG_BASE64 } from "@/public/amethyst"
import { BLOODSTONE_BG_BASE64 } from "@/public/bloodstone"
import { AMMOLITE_BG_BASE64 } from "@/public/ammolite"

export type BackgroundType =
  | "default"
  | "amethyst"
  | "bloodstone"
  | "ammolite"
  | "nebula"

export const BACKGROUNDS = {
  default: {
    type: "default",
  },

  amethyst: {
    type: "amethyst",
    src: AMETHYST_BG_BASE64,
  },

  bloodstone: {
    type: "bloodstone",
    src: BLOODSTONE_BG_BASE64,
  },

  ammolite: {
    type: "ammolite",
    src: AMMOLITE_BG_BASE64,
  },

  nebula: {
    type: "nebula",
    src: "/nebula-bg.png",
  },
} as const