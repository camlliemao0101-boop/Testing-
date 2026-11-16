import { useEditStore } from './editStore'
import { DEFAULT_COLORS } from './defaults'
import type { ThemeColors } from './types'

const ROWS: { key: keyof ThemeColors; label: string; hint: string }[] = [
  { key: 'door', label: '柜门', hint: '门板正面' },
  { key: 'body', label: '柜体', hint: '外壳 / 立柱 / 顶盖' },
  { key: 'accent', label: '点缀', hint: '把手嵌条等' },
  { key: 'cavity', label: '柜腔', hint: '内壁蓝色' },
  { key: 'turntable', label: '唱片机', hint: 'Skills 入口' },
  { key: 'crate', label: '作品箱', hint: '橙黄文件袋' },
  { key: 'typewriter', label: '打字机', hint: 'Contact 奶油机身' },
]

export default function ColorPanel() {
  const editMode = useEditStore((s) => s.editMode)
  const open = useEditStore((s) => s.colorPanelOpen)
  const colors = useEditStore((s) => s.colors)
  const setColor = useEditStore((s) => s.setColor)
  const setColorPanelOpen = useEditStore((s) => s.setColorPanelOpen)
  const resetAll = useEditStore((s) => s.resetAll)

  if (!editMode) return null

  return (
    <aside className="ed-colors" data-collapsed={!open || undefined} aria-label="配色面板">
      <header className="ed-colors__head">
        <strong>配色面板</strong>
        <button
          type="button"
          className="ed-colors__toggle"
          onClick={() => setColorPanelOpen(!open)}
          aria-expanded={open}
        >
          {open ? '收起' : '展开'}
        </button>
      </header>
      {open && (
        <div className="ed-colors__body">
          {ROWS.map((row) => (
            <label key={row.key} className="ed-colors__row">
              <span className="ed-colors__label">
                {row.label}
                <small>{row.hint}</small>
              </span>
              <input
                type="color"
                value={colors[row.key]}
                onChange={(e) => setColor(row.key, e.target.value)}
                aria-label={row.label}
              />
              <button
                type="button"
                className="ed-colors__reset"
                title="还原此项"
                onClick={() => setColor(row.key, DEFAULT_COLORS[row.key])}
              >
                ↺
              </button>
            </label>
          ))}
          <button
            type="button"
            className="ed-colors__danger"
            onClick={() => {
              if (confirm('确定清空全部编辑（文字 / 图片 / 配色）？')) resetAll()
            }}
          >
            清空全部编辑
          </button>
        </div>
      )}
    </aside>
  )
}
