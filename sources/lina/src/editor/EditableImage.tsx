import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { assetSrcSet, assetUrl } from '../assetUrl'
import { useEditStore } from './editStore'

type Props = {
  id: string
  /** 默认图 URL（站点资产） */
  defaultSrc: string
  alt?: string
  className?: string
  /** 铺满父级（封面 / 摄影格 / 杂志页） */
  fill?: boolean
  /** 额外的 img 属性（srcSet 等）—— 自定义替换后不再使用 */
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>
}

/**
 * DOM 图层图片：编辑模式下可换图、拖移、滚轮缩放。
 */
export default function EditableImage({ id, defaultSrc, alt = '', className, fill = false, imgProps }: Props) {
  const editMode = useEditStore((s) => s.editMode)
  const image = useEditStore((s) => s.images[id])
  const setImage = useEditStore((s) => s.setImage)
  const fileRef = useRef<HTMLInputElement>(null)
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null)
  const [active, setActive] = useState(false)

  // 站内绝对路径只在进 DOM 的那一刻接上部署基础路径；写回 editStore（以及用户
  // 导出的 JSON）的始终是 defaultSrc 原值，换基础路径不会让旧编辑失效
  const src = image?.src || defaultSrc
  const resolvedSrcSet = imgProps?.srcSet ? assetSrcSet(imgProps.srcSet) : undefined
  const x = image?.x ?? 0
  const y = image?.y ?? 0
  const scale = image?.scale ?? 1
  const custom = Boolean(image?.src)

  const wrapStyle: CSSProperties = {
    position: fill ? 'absolute' : 'relative',
    inset: fill ? 0 : undefined,
    display: fill ? 'block' : 'inline-block',
    width: fill ? '100%' : undefined,
    height: fill ? '100%' : undefined,
    maxWidth: fill ? undefined : '100%',
    outline: editMode && active ? '2px solid #1b28d8' : editMode ? '1px dashed rgba(27,40,216,.35)' : undefined,
    outlineOffset: 2,
    cursor: editMode ? 'grab' : undefined,
    overflow: 'hidden',
  }

  const imgStyle: CSSProperties = {
    transform: `translate(${x}%, ${y}%) scale(${scale})`,
    transformOrigin: 'center center',
    maxWidth: fill ? undefined : '100%',
    width: fill ? '100%' : undefined,
    height: fill ? '100%' : undefined,
    objectFit: fill ? 'cover' : undefined,
    display: 'block',
    pointerEvents: editMode ? 'none' : undefined,
    ...(imgProps?.style as CSSProperties),
  }

  const onPointerDown = (e: PointerEvent) => {
    if (!editMode) return
    e.stopPropagation()
    e.preventDefault()
    setActive(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    drag.current = { px: e.clientX, py: e.clientY, x, y }
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current || !editMode) return
    const dx = ((e.clientX - drag.current.px) / (e.currentTarget as HTMLElement).clientWidth) * 100
    const dy = ((e.clientY - drag.current.py) / (e.currentTarget as HTMLElement).clientHeight) * 100
    setImage(id, {
      src: image?.src || defaultSrc,
      x: drag.current.x + dx,
      y: drag.current.y + dy,
      scale,
    })
  }

  const onPointerUp = () => {
    drag.current = null
  }

  const onWheel = (e: React.WheelEvent) => {
    if (!editMode) return
    e.preventDefault()
    e.stopPropagation()
    const next = Math.min(3, Math.max(0.4, scale + (e.deltaY > 0 ? -0.08 : 0.08)))
    setImage(id, { src: image?.src || defaultSrc, x, y, scale: next })
  }

  const onFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(id, { src: reader.result, x: 0, y: 0, scale: 1 })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <span
      className={className}
      style={wrapStyle}
      data-edit-img={id}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={onWheel}
      onClick={(e) => {
        if (!editMode) return
        e.stopPropagation()
        setActive(true)
      }}
    >
      <img
        {...(custom
          ? { alt }
          : { alt, ...imgProps, src: undefined, srcSet: resolvedSrcSet })}
        src={assetUrl(src)}
        alt={alt}
        style={imgStyle}
        draggable={false}
      />
      {editMode && (
        <span className="ed-imgbar" onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" className="ed-imgbar__btn" onClick={() => fileRef.current?.click()}>
            换图
          </button>
          {custom && (
            <button
              type="button"
              className="ed-imgbar__btn"
              onClick={() => setImage(id, null)}
            >
              还原
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </span>
      )}
    </span>
  )
}
