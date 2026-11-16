import { PALETTE } from '../scene/materials'
import type { ThemeColors } from './types'

/** 与 materials / PROP_COLORS 对齐的默认主题 */
export const DEFAULT_COLORS: ThemeColors = {
  door: PALETTE.door,
  body: PALETTE.frame,
  accent: PALETTE.handleGrip,
  cavity: PALETTE.cavity,
  turntable: '#9ed1ea',
  crate: '#f4c652',
  typewriter: '#fff7de',
}
