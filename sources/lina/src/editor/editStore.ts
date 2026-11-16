import { create } from 'zustand'
import { DEFAULT_COLORS } from './defaults'
import type { EditBundle, ImageEdit, TextStyle, ThemeColors } from './types'
import { STORAGE_KEY } from './types'

type EditState = {
  editMode: boolean
  colors: ThemeColors
  texts: Record<string, TextStyle>
  images: Record<string, ImageEdit>
  links: Record<string, string>
  selectedTextId: string | null
  /** 配色面板是否展开 */
  colorPanelOpen: boolean

  setEditMode: (on: boolean) => void
  toggleEditMode: () => void
  setColorPanelOpen: (on: boolean) => void
  setColor: <K extends keyof ThemeColors>(key: K, value: ThemeColors[K]) => void
  setText: (id: string, patch: Partial<TextStyle>) => void
  clearText: (id: string) => void
  setImage: (id: string, patch: Partial<ImageEdit> | null) => void
  setLink: (id: string, value: string | null) => void
  selectText: (id: string | null) => void
  resetAll: () => void
  /** 导出可下载的编辑包 */
  toBundle: () => EditBundle
  applyBundle: (bundle: EditBundle) => void
  persist: () => void
  hydrate: () => void
}

function loadStored(): Partial<Pick<EditState, 'colors' | 'texts' | 'images' | 'links'>> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as EditBundle
    if (data?.version !== 1) return null
    return {
      colors: { ...DEFAULT_COLORS, ...data.colors },
      texts: data.texts ?? {},
      images: data.images ?? {},
      links: data.links ?? {},
    }
  } catch {
    return null
  }
}

export const useEditStore = create<EditState>((set, get) => ({
  editMode: false,
  colors: { ...DEFAULT_COLORS },
  texts: {},
  images: {},
  links: {},
  selectedTextId: null,
  colorPanelOpen: true,

  setEditMode: (editMode) =>
    set({
      editMode,
      selectedTextId: editMode ? get().selectedTextId : null,
      colorPanelOpen: editMode ? get().colorPanelOpen || true : get().colorPanelOpen,
    }),

  toggleEditMode: () => {
    const next = !get().editMode
    get().setEditMode(next)
    if (next) set({ colorPanelOpen: true })
  },

  setColorPanelOpen: (colorPanelOpen) => set({ colorPanelOpen }),

  setColor: (key, value) => {
    set((s) => ({ colors: { ...s.colors, [key]: value } }))
    get().persist()
  },

  setText: (id, patch) => {
    set((s) => ({
      texts: {
        ...s.texts,
        [id]: { ...s.texts[id], ...patch },
      },
    }))
    get().persist()
  },

  clearText: (id) => {
    set((s) => {
      const next = { ...s.texts }
      delete next[id]
      return { texts: next }
    })
    get().persist()
  },

  setImage: (id, patch) => {
    set((s) => {
      if (patch === null) {
        const next = { ...s.images }
        delete next[id]
        return { images: next }
      }
      const prev = s.images[id] ?? { src: '' }
      return { images: { ...s.images, [id]: { ...prev, ...patch } } }
    })
    get().persist()
  },

  setLink: (id, value) => {
    set((s) => {
      const next = { ...s.links }
      if (value === null || value === '') delete next[id]
      else next[id] = value
      return { links: next }
    })
    get().persist()
  },

  selectText: (selectedTextId) => set({ selectedTextId }),

  resetAll: () => {
    set({
      colors: { ...DEFAULT_COLORS },
      texts: {},
      images: {},
      links: {},
      selectedTextId: null,
    })
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  },

  toBundle: () => {
    const { colors, texts, images, links } = get()
    return {
      version: 1 as const,
      savedAt: new Date().toISOString(),
      colors,
      texts,
      images,
      links,
    }
  },

  applyBundle: (bundle) => {
    if (!bundle || bundle.version !== 1) return
    set({
      colors: { ...DEFAULT_COLORS, ...bundle.colors },
      texts: bundle.texts ?? {},
      images: bundle.images ?? {},
      links: bundle.links ?? {},
    })
    get().persist()
  },

  persist: () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(get().toBundle()))
    } catch {
      /* quota / private mode */
    }
  },

  hydrate: () => {
    const stored = loadStored()
    if (!stored) return
    set({
      colors: stored.colors ?? { ...DEFAULT_COLORS },
      texts: stored.texts ?? {},
      images: stored.images ?? {},
      links: stored.links ?? {},
    })
  },
}))

/** 非 React 场景读当前主题色 */
export function getThemeColors(): ThemeColors {
  return useEditStore.getState().colors
}
