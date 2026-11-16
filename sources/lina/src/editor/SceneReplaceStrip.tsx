import { assetUrl } from '../assetUrl'
import { useEditStore } from './editStore'
import { SCENE_EDITABLE_IMAGES } from './sceneEditableImages'

/**
 * 编辑态底部条：替换柜门人物海报 / 拍立得 / 人物贴纸。
 * 3D 命中不可靠时用列表上传，写入 editStore.images。
 */
export default function SceneReplaceStrip() {
  const editMode = useEditStore((s) => s.editMode)
  const images = useEditStore((s) => s.images)
  const setImage = useEditStore((s) => s.setImage)

  if (!editMode) return null

  const onFile = (id: string, file: File | undefined) => {
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
    <div className="ed-sceneStrip" role="region" aria-label="替换柜体人物图片">
      <p className="ed-sceneStrip__note">柜体人物图：在下方逐张换图（门贴 / 海报 / 拍立得）</p>
      <div className="ed-sceneStrip__row">
        {SCENE_EDITABLE_IMAGES.map((item) => {
          const custom = Boolean(images[item.id]?.src)
          const thumb = images[item.id]?.src || item.defaultSrc
          return (
            <div key={item.id} className="ed-sceneStrip__card" data-edit-scene={item.id}>
              <div className="ed-sceneStrip__thumb">
                <img src={assetUrl(thumb)} alt="" />
              </div>
              <div className="ed-sceneStrip__title">{item.label}</div>
              <div className="ed-sceneStrip__actions">
                <label className="ed-imgbar__btn" style={{ cursor: 'pointer' }}>
                  换图
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      onFile(item.id, e.target.files?.[0])
                      e.currentTarget.value = ''
                    }}
                  />
                </label>
                {custom && (
                  <button type="button" className="ed-imgbar__btn" onClick={() => setImage(item.id, null)}>
                    还原
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
