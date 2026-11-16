import { useEffect, useRef } from 'react'
import ColorPanel from './ColorPanel'
import TextToolbar from './TextToolbar'
import SceneReplaceStrip from './SceneReplaceStrip'
import { useEditStore } from './editStore'
import type { EditBundle } from './types'
import './editor.css'

function downloadJson(bundle: EditBundle) {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `lina-locker-edits-${bundle.savedAt.slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** 右上角编辑开关 + 导出/导入 + 配色面板 + 文字工具条 + 柜体人物换图条 */
export default function EditorChrome() {
  const editMode = useEditStore((s) => s.editMode)
  const toggleEditMode = useEditStore((s) => s.toggleEditMode)
  const toBundle = useEditStore((s) => s.toBundle)
  const applyBundle = useEditStore((s) => s.applyBundle)
  const hydrate = useEditStore((s) => s.hydrate)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    document.documentElement.dataset.editMode = editMode ? '1' : '0'
  }, [editMode])

  return (
    /*
     * data-editor-root：浮层 useDialog 给兄弟节点加 inert 时必须跳过本树，
     * 否则作品子页里右上角「编辑」点了没反应。
     */
    <div data-editor-root className="ed-root">
      <div className="ed-chrome" role="region" aria-label="编辑器">
        <button
          type="button"
          className="ed-chrome__main"
          data-on={editMode || undefined}
          onClick={(e) => {
            e.stopPropagation()
            toggleEditMode()
          }}
        >
          {editMode ? '完成' : '编辑'}
        </button>
        {editMode && (
          <>
            <button
              type="button"
              className="ed-chrome__btn"
              onClick={() => downloadJson(toBundle())}
              title="下载 JSON 编辑包"
            >
              导出编辑包
            </button>
            <button
              type="button"
              className="ed-chrome__btn"
              onClick={() => fileRef.current?.click()}
            >
              导入编辑包
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0]
                e.target.value = ''
                if (!file) return
                try {
                  const text = await file.text()
                  const data = JSON.parse(text) as EditBundle
                  applyBundle(data)
                } catch {
                  alert('无法读取编辑包，请确认是本站导出的 JSON。')
                }
              }}
            />
          </>
        )}
      </div>
      <TextToolbar />
      <ColorPanel />
      <SceneReplaceStrip />
    </div>
  )
}
