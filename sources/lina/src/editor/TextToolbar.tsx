import { FONT_OPTIONS } from './types'
import { useEditStore } from './editStore'

/** 选中文字后的浮动工具条：字体 / 字号 / 颜色 */
export default function TextToolbar() {
  const editMode = useEditStore((s) => s.editMode)
  const id = useEditStore((s) => s.selectedTextId)
  const style = useEditStore((s) => (id ? s.texts[id] : undefined))
  const setText = useEditStore((s) => s.setText)
  const clearText = useEditStore((s) => s.clearText)
  const selectText = useEditStore((s) => s.selectText)

  if (!editMode || !id) return null

  return (
    <div className="ed-toolbar" role="toolbar" aria-label="文字样式">
      <span className="ed-toolbar__id" title={id}>
        文字
      </span>
      <label className="ed-toolbar__field">
        <span>字体</span>
        <select
          value={style?.fontFamily ?? 'inherit'}
          onChange={(e) => setText(id, { fontFamily: e.target.value })}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </label>
      <label className="ed-toolbar__field">
        <span>字号</span>
        <input
          type="number"
          min={10}
          max={96}
          value={style?.fontSize ?? 16}
          onChange={(e) => setText(id, { fontSize: Number(e.target.value) || 16 })}
        />
      </label>
      <label className="ed-toolbar__field">
        <span>颜色</span>
        <input
          type="color"
          value={style?.color ?? '#14161a'}
          onChange={(e) => setText(id, { color: e.target.value })}
        />
      </label>
      <button type="button" className="ed-toolbar__btn" onClick={() => clearText(id)}>
        还原样式
      </button>
      <button type="button" className="ed-toolbar__btn" onClick={() => selectText(null)}>
        取消选中
      </button>
    </div>
  )
}
