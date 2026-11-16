import type { ReactNode } from 'react'
import { useEditStore } from './editStore'

type Props = {
  id: string
  /** 默认外链（content.ts） */
  defaultHref: string
  label?: string
  className?: string
  /** 非编辑态包裹真正的跳转链接时用 */
  children?: (href: string) => ReactNode
}

/**
 * 编辑模式下改外链（视频 / 网站作品）；写入 editStore.links，随编辑包导出。
 */
export default function EditableLink({
  id,
  defaultHref,
  label = '视频链接',
  className,
  children,
}: Props) {
  const editMode = useEditStore((s) => s.editMode)
  const stored = useEditStore((s) => s.links[id])
  const setLink = useEditStore((s) => s.setLink)
  const href = (stored ?? defaultHref).trim() || defaultHref
  const custom = Boolean(stored)

  if (!editMode) {
    return <>{children ? children(href) : null}</>
  }

  return (
    <div className={`ed-link ${className ?? ''}`} data-edit-link={id} onClick={(e) => e.stopPropagation()}>
      <label className="ed-link__label">
        <span>{label}</span>
        <input
          type="url"
          className="ed-link__input"
          value={stored ?? defaultHref}
          placeholder="https://"
          onChange={(e) => setLink(id, e.target.value)}
        />
      </label>
      {custom && (
        <button type="button" className="ed-link__reset" onClick={() => setLink(id, null)}>
          还原
        </button>
      )}
    </div>
  )
}
