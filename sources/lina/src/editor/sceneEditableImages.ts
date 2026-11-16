/**
 * 柜体主场景里可在线替换的「人物相关」贴图。
 * 写入 editStore.images[id]，Poster / Polaroid / 门贴花运行时读取。
 */
export type SceneEditableImage = {
  id: string
  label: string
  /** 默认缩略 / 还原用 */
  defaultSrc: string
  kind: 'poster' | 'polaroid' | 'decal'
  /** polaroid 裁切键 */
  polaroidKey?: 'friends' | 'beach' | 'camera'
  /** 门贴花：按源 URL 匹配（同图多张实例一起换） */
  decalUrl?: string
}

export const SCENE_EDITABLE_IMAGES: readonly SceneEditableImage[] = [
  {
    id: 'scene.posterwall',
    label: '门海报·五小人',
    defaultSrc: '/assets/obj/posterwall.webp',
    kind: 'poster',
  },
  {
    id: 'scene.decal.redhood',
    label: '小红帽贴纸',
    defaultSrc: '/assets/obj2/stk7.webp',
    kind: 'decal',
    decalUrl: '/assets/obj2/stk7.webp',
  },
  {
    id: 'scene.polaroid.friends',
    label: '拍立得·合照',
    defaultSrc: '/assets/obj2/polaroids.webp',
    kind: 'polaroid',
    polaroidKey: 'friends',
  },
  {
    id: 'scene.polaroid.beach',
    label: '拍立得·比耶',
    defaultSrc: '/assets/obj2/polaroids.webp',
    kind: 'polaroid',
    polaroidKey: 'beach',
  },
  {
    id: 'scene.polaroid.camera',
    label: '拍立得·相机',
    defaultSrc: '/assets/obj2/polaroids.webp',
    kind: 'polaroid',
    polaroidKey: 'camera',
  },
  {
    id: 'scene.decal.girl',
    label: '女孩贴纸',
    defaultSrc: '/assets/obj2/stk1.webp',
    kind: 'decal',
    decalUrl: '/assets/obj2/stk1.webp',
  },
  {
    id: 'scene.decal.duo',
    label: '双人贴纸',
    defaultSrc: '/assets/obj2/stk2.webp',
    kind: 'decal',
    decalUrl: '/assets/obj2/stk2.webp',
  },
  {
    id: 'scene.decal.photo',
    label: '立牌照片',
    defaultSrc: '/assets/obj2/stk4.webp',
    kind: 'decal',
    decalUrl: '/assets/obj2/stk4.webp',
  },
] as const

const DECAL_URL_TO_ID = new Map(
  SCENE_EDITABLE_IMAGES.filter((i) => i.decalUrl).map((i) => [i.decalUrl!, i.id]),
)

/** 门贴花 URL → editStore id；非人物可换贴花返回 null */
export function sceneImageIdForDecalUrl(url: string): string | null {
  return DECAL_URL_TO_ID.get(url) ?? null
}

export function polaroidEditId(key: 'friends' | 'beach' | 'camera'): string {
  return `scene.polaroid.${key}`
}

export const POSTERWALL_EDIT_ID = 'scene.posterwall'
