import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react'
import { useEditStore } from './editStore'

type Props = {
  id: string
  /** 未编辑时的默认文案 */
  defaultText: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'em' | 'dt' | 'dd' | 'div'
  className?: string
  multiline?: boolean
}

/**
 * 编辑模式下可点选 / 直接改字；样式走 TextToolbar。
 * 非编辑模式等同普通文本节点。
 */
export default function EditableText({
  id,
  defaultText,
  as: Tag = 'span',
  className,
  multiline = false,
}: Props) {
  const editMode = useEditStore((s) => s.editMode)
  const style = useEditStore((s) => s.texts[id])
  const selected = useEditStore((s) => s.selectedTextId === id)
  const selectText = useEditStore((s) => s.selectText)
  const setText = useEditStore((s) => s.setText)
  const ref = useRef<HTMLElement>(null)
  const focused = useRef(false)

  const content = style?.content ?? defaultText

  const css: CSSProperties = {
    fontFamily: style?.fontFamily,
    fontSize: style?.fontSize ? `${style.fontSize}px` : undefined,
    color: style?.color,
    outline: editMode && selected ? '2px solid #1b28d8' : editMode ? '1px dashed rgba(27,40,216,.35)' : undefined,
    outlineOffset: 2,
    cursor: editMode ? 'text' : undefined,
    minWidth: editMode ? '0.5em' : undefined,
    whiteSpace: multiline ? 'pre-wrap' : undefined,
  }

  // 外部样式/内容变化时，仅在未聚焦时同步 DOM，避免打断光标
  useEffect(() => {
    if (!editMode || !ref.current || focused.current) return
    if (ref.current.innerText !== content) {
      ref.current.innerText = content
    }
  }, [content, editMode])

  useEffect(() => {
    if (!editMode || !selected || !ref.current) return
    if (document.activeElement !== ref.current) {
      ref.current.focus()
    }
  }, [editMode, selected])

  if (!editMode) {
    return (
      <Tag className={className} style={css}>
        {content}
      </Tag>
    )
  }

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={css}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      aria-label={`编辑：${id}`}
      data-edit-id={id}
      data-selected={selected || undefined}
      onMouseDown={(e: MouseEvent) => {
        e.stopPropagation()
        selectText(id)
      }}
      onClick={(e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        selectText(id)
      }}
      onFocus={() => {
        focused.current = true
      }}
      onInput={() => {
        const el = ref.current
        if (!el) return
        setText(id, { content: el.innerText })
      }}
      onBlur={() => {
        focused.current = false
        const el = ref.current
        if (!el) return
        setText(id, { content: el.innerText })
      }}
      onKeyDown={(e: KeyboardEvent) => {
        e.stopPropagation()
        if (!multiline && e.key === 'Enter') {
          e.preventDefault()
          ;(e.target as HTMLElement).blur()
        }
      }}
    >
      {content}
    </Tag>
  )
}
