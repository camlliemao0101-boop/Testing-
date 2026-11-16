/** 场景主题色 —— 由配色面板驱动，派生出完整柜体 PALETTE / 关键道具色 */
export type ThemeColors = {
  /** 柜门正面 */
  door: string
  /** 柜壳 / 立柱 / 顶盖主色 */
  body: string
  /** 点缀（把手嵌条等） */
  accent: string
  /** 柜腔内壁 */
  cavity: string
  /** 唱片机箱体 */
  turntable: string
  /** 作品橙箱 / 黄文件袋 */
  crate: string
  /** 打字机奶油色机身 */
  typewriter: string
}

export type TextStyle = {
  /** 覆盖原文；缺省则用 content.ts 默认 */
  content?: string
  fontFamily?: string
  fontSize?: number
  color?: string
}

export type ImageEdit = {
  /** data URL 或原站路径 */
  src: string
  /** 相对容器的平移（%） */
  x?: number
  y?: number
  /** 缩放倍率，1 = 100% */
  scale?: number
}

export type EditBundle = {
  version: 1
  savedAt: string
  colors: ThemeColors
  texts: Record<string, TextStyle>
  images: Record<string, ImageEdit>
  /** 外链：视频播放地址、网站作品 href 等 */
  links?: Record<string, string>
}

export const STORAGE_KEY = 'lina-locker-edits-v1'

export const FONT_OPTIONS = [
  { label: '系统默认', value: 'inherit' },
  { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { label: '思源黑体', value: '"Noto Sans SC", "PingFang SC", sans-serif' },
  { label: '思源宋体', value: '"Noto Serif SC", "Songti SC", serif' },
  { label: 'Playfair', value: '"Playfair Display", Georgia, serif' },
  { label: 'Courier', value: '"Courier Prime", ui-monospace, monospace' },
  { label: 'Archivo Black', value: '"Archivo Black", Impact, sans-serif' },
] as const
