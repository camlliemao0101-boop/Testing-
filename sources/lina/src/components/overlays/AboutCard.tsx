import { ABOUT } from '../../data/content'
import { EditableImage, EditableText, useEditStore } from '../../editor'
import Avatar from './Avatar'
import CloseButton from './CloseButton'
import './overlay.css'
import './about.css'

/** ABOUT —— 从挂绳上垂下的个人信息工牌（文字 / 头像可编辑） */
export default function AboutCard() {
  return (
    <div className="ov">
      <div className="idc">
        <div className="idc__lanyard" aria-hidden>
          <span className="idc__strap" />
          <svg className="idc__clip" viewBox="0 0 60 116" fill="none" aria-hidden>
            <path
              d="M18 4h24a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6Z"
              stroke="#25262A"
              strokeWidth="4"
            />
            <path
              d="M30 30v34m0 0a19 19 0 1 0 0 38 19 19 0 0 0 0-38Z"
              stroke="#25262A"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx="30" cy="45" r="4.4" fill="#25262A" />
          </svg>
        </div>

        <article className="idc__card">
          <CloseButton />
          <div className="idc__frame">
            <div className="idc__head">
              <span className="idc__no">
                <EditableText id="about.cardLabel" defaultText="IDENTIFICATION CARD" as="span" />
                <br />
                <EditableText id="about.cardNo" defaultText={ABOUT.cardNo} as="span" />
              </span>
            </div>

            <div className="idc__body">
              <div className="idc__photo">
                <AboutAvatar />
              </div>

              <div className="idc__main">
                <header className="idc__titleRow">
                  <h2 className="idc__title">
                    {ABOUT.title.map((t, i) => (
                      <EditableText key={t} id={`about.title.${i}`} defaultText={t} as="span" />
                    ))}
                  </h2>
                </header>
                <EditableText
                  id="about.titleCn"
                  defaultText={ABOUT.titleCn}
                  as="span"
                  className="idc__titleCn"
                />
                <EditableText
                  id="about.sub"
                  defaultText={ABOUT.sub}
                  as="p"
                  className="idc__sub"
                />
                <span className="idc__rule" />

                <dl className="idc__fields">
                  {ABOUT.fields.map((f, i) => (
                    <div key={f.k} className="idc__field">
                      <EditableText id={`about.field.${i}.k`} defaultText={f.k} as="dt" />
                      <EditableText id={`about.field.${i}.v`} defaultText={f.v} as="dd" />
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* 淡蓝色钢印 */}
            <div className="idc__stamp" aria-hidden>
              <svg viewBox="0 0 220 220">
                <defs>
                  <path id="stampArc" d="M110,110 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
                </defs>
                <circle cx="110" cy="110" r="96" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <circle
                  cx="110"
                  cy="110"
                  r="84"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                />
                <text className="idc__stampRing">
                  <textPath href="#stampArc" startOffset="50%" textAnchor="middle">
                    {ABOUT.stampRing}
                  </textPath>
                </text>
              </svg>
              <EditableText
                id="about.stampTop"
                defaultText={ABOUT.stampTop}
                as="span"
                className="idc__stampWord"
              />
              <EditableText
                id="about.stampMid"
                defaultText={ABOUT.stampMid}
                as="span"
                className="idc__stampMid"
              />
            </div>
          </div>

          <div className="idc__lower">
            <svg className="idc__barcode" viewBox="0 0 240 44" aria-hidden>
              {BARS.map((w, i) => (
                <rect key={i} x={BAR_X[i]} y="0" width={w} height="44" fill="#1a1c20" />
              ))}
            </svg>
            <div className="idc__contact">
              <span className="idc__ck">EMAIL</span>
              <EditableText
                id="about.email"
                defaultText={ABOUT.email}
                as="span"
                className="idc__cv"
              />
            </div>
            <div className="idc__contact idc__contact--mid">
              <span className="idc__ck">PHONE</span>
              <EditableText
                id="about.phone"
                defaultText={ABOUT.phone}
                as="span"
                className="idc__cv"
              />
            </div>
            <div className="idc__tag" aria-hidden>
              <EditableText id="about.tagTop" defaultText="LINA" as="span" className="idc__tagTop" />
              <EditableText
                id="about.tagBody"
                defaultText="CHEN"
                as="span"
                className="idc__tagBody"
              />
            </div>
          </div>

          <footer className="idc__foot">
            <EditableText id="about.footL" defaultText={ABOUT.footL} as="span" />
            <EditableText id="about.footR" defaultText={ABOUT.footR} as="span" />
          </footer>
        </article>
      </div>
    </div>
  )
}

/** 默认 SVG 头像；编辑模式下可换成上传图片 */
function AboutAvatar() {
  const editMode = useEditStore((s) => s.editMode)
  const image = useEditStore((s) => s.images['about.avatar'])
  const setImage = useEditStore((s) => s.setImage)

  if (image?.src) {
    return (
      <EditableImage
        id="about.avatar"
        defaultSrc={image.src}
        alt="头像"
        className="idc__avatar idc__avatar--photo"
      />
    )
  }

  return (
    <span className="idc__avatarWrap" data-edit={editMode || undefined}>
      <Avatar className="idc__avatar" />
      {editMode && (
        <label className="ed-imgbar ed-imgbar--overlay">
          <span className="ed-imgbar__btn">换图</span>
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (!file || !file.type.startsWith('image/')) return
              const reader = new FileReader()
              reader.onload = () => {
                if (typeof reader.result === 'string') {
                  setImage('about.avatar', { src: reader.result, x: 0, y: 0, scale: 1 })
                }
              }
              reader.readAsDataURL(file)
            }}
          />
        </label>
      )}
    </span>
  )
}

/* 条形码：固定序列，避免每次渲染跳动 */
const BARS = [
  3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 2, 1, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 2,
  1, 3, 1, 2, 4, 1, 2,
]
const BAR_X = BARS.reduce<number[]>((acc, _w, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + BARS[i - 1] + 2)
  return acc
}, [])
