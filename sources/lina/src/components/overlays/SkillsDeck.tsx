import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { SKILLS, type SkillCard } from '../../data/content'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { EditableText, useEditStore } from '../../editor'
import CloseButton from './CloseButton'
import './overlay.css'
import './skills.css'

type Slot = { x: number; y: number; s: number; r: number }

/* 卡片向右上错落堆叠，和参考一致；索引即层级，0 是最前面那张 */
const SLOTS: Slot[] = [
  { x: 0, y: 0, s: 1, r: 0 },
  { x: 40, y: -48, s: 0.978, r: 0.9 },
  { x: 79, y: -95, s: 0.956, r: 1.9 },
]

/**
 * 展开模式：三张全摊开，都可读、都可点。
 *
 * 方向、间距、缩放全交给 CSS 变量（skills.css 按断点给）：宽屏左中右一字排开，
 * 窄屏改成上中下，一处都不用改这里。这里只按「第几层」决定它去正、去负 ——
 * 最前面那张留在中间，收回堆叠时不会突然换人。
 */
const FAN = [
  'translate(0, 0) scale(var(--sk-fan-front-s)) rotate(0deg)',
  `translate(calc(var(--sk-fan-x) * -1), calc(var(--sk-fan-y) * -1))
   scale(var(--sk-fan-s)) rotate(calc(var(--sk-fan-r) * -1))`,
  `translate(var(--sk-fan-x), var(--sk-fan-y))
   scale(var(--sk-fan-s)) rotate(var(--sk-fan-r))`,
]

/* 前卡退出时的落点：向左下滑出，同时轻微缩小和反向倾斜 */
const EXIT: Slot = { x: -26, y: 150, s: 0.94, r: -4.6 }

/** 前卡滑出 + 后层卡上移的共同时长：两件事必须在同一条时间线里 */
const OUT_MS = 420
/** 滑出的卡片落回最后一层后淡入的时长 */
const BACK_MS = 260
/** Reduced Motion 下只保留一次短淡化 */
const FADE_MS = 150

/** 退出中的卡片压在所有卡片之上，落回后层时才把层级降下去 */
const EXIT_Z = 30

/* 参考打开时最前面是 02，堆叠顺序 02 / 03 / 01；入场错峰也按这个初始层级固定 */
const INITIAL_ORDER = [1, 2, 0]

type Moving = { card: number; stage: 'out' | 'back' }

function css(p: Slot) {
  return `translate(${p.x}px, ${p.y}px) scale(${p.s}) rotate(${p.r}deg)`
}

/**
 * SKILLS —— 从唱片箱里抽出的三张技能卡。
 *
 * 两种排布：**堆叠**与**展开**。堆叠时：点前卡 → 开二层详情；点后排露出的卡 →
 * 只把该卡轮转到最前（回滚），不立刻进详情。展开时：点任意卡开详情。
 * 底部「换下一张」仍可顺序轮转。两种排布共用同一套 DOM / transform 过渡。
 *
 * 二层详情面板本身不改交互；编辑态前卡用「查看详情」按钮进入。
 */
export default function SkillsDeck() {
  const editMode = useEditStore((s) => s.editMode)
  const reduced = useReducedMotion()
  const [order, setOrder] = useState(INITIAL_ORDER)
  const [moving, setMoving] = useState<Moving | null>(null)
  const [spread, setSpread] = useState(false)
  const [detailIdx, setDetailIdx] = useState<number | null>(null)
  // 入场动画只跑一次：播完（或用户提前换位）后彻底关掉，
  // 否则 slot 变化引起的 animation-delay 变化会让 skIn 重新触发并抢走 transform
  const [entered, setEntered] = useState(false)
  const busy = useRef(false)
  const timers = useRef<number[]>([])

  useEffect(
    () => () => {
      for (const t of timers.current) window.clearTimeout(t)
    },
    [],
  )

  // 二层打开时 Escape / 系统返回先收详情，不直接关整个 SKILLS 浮层
  useEffect(() => {
    if (detailIdx === null) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      e.stopPropagation()
      setDetailIdx(null)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [detailIdx])

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  const advance = useCallback(() => {
    if (busy.current || detailIdx !== null) return
    busy.current = true
    setEntered(true)
    const front = order[0]
    const done = () => {
      setMoving(null)
      busy.current = false
    }

    // 换位与前卡退出在同一帧提交：后层卡的上移、旋转与前卡的滑出共用一条时间线
    setOrder((o) => [...o.slice(1), o[0]])

    if (reduced) {
      // Reduced Motion：直接切顺序，只留一次短淡化提示层级变了
      setMoving({ card: front, stage: 'back' })
      later(FADE_MS, done)
      return
    }

    setMoving({ card: front, stage: 'out' })
    later(OUT_MS, () => {
      // 前卡已经滑出画面，这时候才把它的实际层级降到最后一层再淡入
      setMoving({ card: front, stage: 'back' })
      later(BACK_MS, done)
    })
  }, [order, reduced, later, detailIdx])

  /** 点后排卡：一次重排到最前（回滚），不打开详情 */
  const bringToFront = useCallback(
    (cardIndex: number) => {
      if (busy.current || detailIdx !== null || spread) return
      const slot = order.indexOf(cardIndex)
      if (slot <= 0) return
      busy.current = true
      setEntered(true)
      const prevFront = order[0]
      setOrder((o) => {
        const s = o.indexOf(cardIndex)
        if (s <= 0) return o
        return [...o.slice(s), ...o.slice(0, s)]
      })
      const done = () => {
        setMoving(null)
        busy.current = false
      }
      if (reduced) {
        setMoving({ card: prevFront, stage: 'back' })
        later(FADE_MS, done)
        return
      }
      setMoving({ card: prevFront, stage: 'out' })
      later(OUT_MS, () => {
        setMoving({ card: prevFront, stage: 'back' })
        later(BACK_MS, done)
      })
    },
    [detailIdx, later, order, reduced, spread],
  )

  const toggleSpread = useCallback(() => {
    if (busy.current || detailIdx !== null) return
    setEntered(true)
    setSpread((on) => !on)
  }, [detailIdx])

  const openDetail = useCallback((i: number) => {
    setEntered(true)
    setSpread(false)
    setDetailIdx(i)
  }, [])

  const closeDetail = useCallback(() => {
    setDetailIdx(null)
  }, [])

  const frontCard = SKILLS[order[0]]
  const detailCard = detailIdx !== null ? SKILLS[detailIdx] : null

  return (
    <div className="ov" data-sk-detail={detailIdx !== null || undefined}>
      <CloseButton onClose={detailIdx !== null ? closeDetail : undefined} />

      {detailCard && detailIdx !== null ? (
        <SkillDetailPanel
          index={detailIdx}
          card={detailCard}
          onBack={closeDetail}
        />
      ) : (
        <>
          <div
            className="sk"
            role="group"
            data-spread={spread || undefined}
            aria-label={`技能卡组，共 ${SKILLS.length} 张`}
            data-entered={entered || undefined}
            onAnimationEnd={() => setEntered(true)}
          >
            <p className="sk__sr">
              {spread
                ? '三张技能卡已展开，点击任意一张打开该技能的详情说明。'
                : '点击最前面的卡片打开详情；点击后面露出的卡片可把它换到最前；也可用下方「换下一张」。'}
            </p>
            <p className="sk__sr" aria-live="polite">
              当前最前：{frontCard.no} {frontCard.title}
            </p>

            {SKILLS.map((c, i) => {
              const slot = order.indexOf(i)
              const isFront = slot === 0
              const stage = moving?.card === i ? moving.stage : null
              // 层级由 slot 决定；只有正在滑出的那张临时压在最上面
              const zIndex = stage === 'out' ? EXIT_Z : 10 - slot
              const active = spread || isFront
              // 非编辑：前卡/展开 → 详情；堆叠后排 → 仅回滚到最前
              const canClick = !editMode && stage !== 'out'

              const onActivate = () => {
                if (editMode) return
                if (spread || isFront) openDetail(i)
                else bringToFront(i)
              }

              const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
                if (!canClick) return
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onActivate()
                }
              }

              const ariaLabel = !canClick
                ? undefined
                : spread || isFront
                  ? `打开${c.title}详情`
                  : `将${c.title}换到最前`

              return (
                <div
                  key={c.no}
                  role={canClick ? 'button' : undefined}
                  className="sk__card"
                  data-stage={stage ?? undefined}
                  tabIndex={canClick ? 0 : -1}
                  onClick={canClick ? onActivate : undefined}
                  onKeyDown={onKeyDown}
                  aria-label={ariaLabel}
                  style={{
                    zIndex,
                    background: c.bg,
                    color: c.fg,
                    transform: spread
                      ? FAN[slot] ?? FAN[2]
                      : css(stage === 'out' ? EXIT : SLOTS[slot] ?? SLOTS[2]),
                    opacity: !spread && stage === 'out' ? 0 : 1,
                    transition: transitionFor(stage, reduced),
                    // 后排露出的边也要能点，才能「回滚到最前」
                    pointerEvents: stage === 'out' ? 'none' : 'auto',
                    // 入场错峰按初始层级固定，换位时不能变，否则会重新触发入场动画
                    ['--in-delay' as string]: `${(SKILLS.length - 1 - INITIAL_ORDER.indexOf(i)) * 0.075}s`,
                  }}
                >
                  <span className="sk__arc" aria-hidden />
                  <EditableText id={`skills.${i}.kicker`} defaultText={c.kicker} as="span" className="sk__kicker" />
                  <EditableText id={`skills.${i}.title`} defaultText={c.title} as="span" className="sk__title" />
                  <EditableText
                    id={`skills.${i}.desc`}
                    defaultText={c.desc}
                    as="span"
                    className="sk__desc"
                    multiline
                  />
                  <span className="sk__spacer" />
                  <span className="sk__rows">
                    {c.rows.map((r, ri) => (
                      <span key={r.k} className="sk__row">
                        <EditableText id={`skills.${i}.row.${ri}.k`} defaultText={r.k} as="span" className="sk__k" />
                        <EditableText id={`skills.${i}.row.${ri}.v`} defaultText={r.v} as="span" className="sk__v" />
                      </span>
                    ))}
                  </span>
                  {active && (
                    <span className="sk__detail-hint" aria-hidden={!editMode && !isFront && !spread}>
                      {editMode ? (
                        <button
                          type="button"
                          className="sk__detail-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            openDetail(i)
                          }}
                        >
                          查看详情
                        </button>
                      ) : (
                        <span className="sk__detail-btn sk__detail-btn--hint">点按查看详情</span>
                      )}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="sk__dock">
            {!spread && (
              <button type="button" className="sk__mode sk__mode--ghost" onClick={advance}>
                换下一张
              </button>
            )}
            <button
              type="button"
              className="sk__mode"
              onClick={toggleSpread}
              aria-pressed={spread}
            >
              {spread ? '收回卡组' : '展开全部'}
              <i aria-hidden data-spread={spread || undefined}>
                <span />
                <span />
                <span />
              </i>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function SkillDetailPanel({
  index,
  card,
  onBack,
}: {
  index: number
  card: SkillCard
  onBack: () => void
}) {
  const d = card.detail
  const base = `skills.${index}.detail`

  return (
    <article
      className="sk-detail"
      style={{ background: card.bg, color: card.fg }}
      aria-label={`${card.title} 详情`}
      data-skill-no={card.no}
    >
      <p className="sk-detail__mobileCue">技能详情 · {card.title}</p>
      <header className="sk-detail__head">
        <EditableText id={`${base}.kicker`} defaultText={card.kicker} as="span" className="sk-detail__kicker" />
        <EditableText id={`skills.${index}.title`} defaultText={card.title} as="h2" className="sk-detail__title" />
        <EditableText
          id={`${base}.headline`}
          defaultText={d.headline}
          as="p"
          className="sk-detail__headline"
        />
      </header>

      <EditableText
        id={`${base}.lead`}
        defaultText={d.lead}
        as="p"
        className="sk-detail__lead"
        multiline
      />

      <section className="sk-detail__section" aria-label="能力要点">
        {d.highlights.map((h, hi) => (
          <div key={hi} className="sk-detail__block">
            <EditableText
              id={`${base}.hl.${hi}.title`}
              defaultText={h.title}
              as="h3"
              className="sk-detail__blockTitle"
            />
            <EditableText
              id={`${base}.hl.${hi}.body`}
              defaultText={h.body}
              as="p"
              className="sk-detail__blockBody"
              multiline
            />
          </div>
        ))}
      </section>

      <section className="sk-detail__section sk-detail__tools" aria-label="工具说明">
        <EditableText
          id={`${base}.toolsLabel`}
          defaultText="工具笔记"
          as="h3"
          className="sk-detail__label"
        />
        <EditableText
          id={`${base}.toolsNote`}
          defaultText={d.toolsNote}
          as="p"
          className="sk-detail__toolsNote"
          multiline
        />
      </section>

      <section className="sk-detail__section" aria-label="示例项目">
        <EditableText
          id={`${base}.projectsLabel`}
          defaultText={d.projectsLabel}
          as="h3"
          className="sk-detail__label"
        />
        <ul className="sk-detail__projects">
          {d.projects.map((p, pi) => (
            <li key={pi}>
              <EditableText
                id={`${base}.project.${pi}`}
                defaultText={p}
                as="span"
                className="sk-detail__project"
                multiline
              />
            </li>
          ))}
        </ul>
      </section>

      <EditableText
        id={`${base}.tip`}
        defaultText={d.tip}
        as="p"
        className="sk-detail__tip"
      />

      <div className="sk-detail__actions">
        <button type="button" className="sk-detail__back" onClick={onBack}>
          返回卡组
        </button>
      </div>
    </article>
  )
}

function transitionFor(stage: 'out' | 'back' | null, reduced: boolean) {
  if (reduced) return 'none'
  // 落回最后一层：transform 不过渡，趁看不见的时候直接归位，只淡入
  if (stage === 'back') return `opacity ${BACK_MS}ms var(--ease-out)`
  return `transform ${OUT_MS}ms var(--ease-io), opacity ${Math.round(OUT_MS * 0.8)}ms linear`
}
