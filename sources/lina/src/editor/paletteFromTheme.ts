import { PALETTE } from '../scene/materials'
import type { ThemeColors } from './types'

export type LockerPalette = { [K in keyof typeof PALETTE]: string }

function mixHex(a: string, b: string, t: number): string {
  const pa = parse(a)
  const pb = parse(b)
  if (!pa || !pb) return a
  const m = (i: number) => Math.round(pa[i] + (pb[i] - pa[i]) * t)
  return `#${[m(0), m(1), m(2)].map((n) => n.toString(16).padStart(2, '0')).join('')}`
}

function parse(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '')
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ]
  }
  if (h.length !== 6) return null
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function lighten(hex: string, t: number) {
  return mixHex(hex, '#ffffff', t)
}

function darken(hex: string, t: number) {
  return mixHex(hex, '#0a1620', t)
}

/** 用少量旋钮派生完整柜体调色板，保持原材质层次 */
export function paletteFromTheme(c: ThemeColors): LockerPalette {
  return {
    door: c.door,
    doorInner: lighten(c.door, 0.12),
    frame: c.body,
    cap: lighten(c.body, 0.18),
    plinth: darken(c.body, 0.08),
    cavity: c.cavity,
    cavityBack: lighten(c.cavity, 0.16),
    shelf: mixHex(c.body, c.door, 0.45),
    handlePlate: mixHex(c.body, '#93a9b8', 0.35),
    handleGrip: c.accent,
    ventBack: darken(c.accent, 0.22),
  }
}
