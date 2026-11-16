import { useEffect, useRef } from 'react'
import { VIDEOS } from '../../data/content'
import { EditableImage, EditableLink, EditableText, useEditStore } from '../../editor'
import BackToFolders from './BackToFolders'
import { releaseImages, SIZES, workImage } from './imageSources'
import './video.css'

/** SELECTED WORK › VIDEO 影像作品（编辑模式可改字 / 封面 / 外链） */
export default function VideoList() {
  const rootRef = useRef<HTMLDivElement>(null)
  const editMode = useEditStore((s) => s.editMode)

  useEffect(() => {
    const root = rootRef.current
    return () => releaseImages(root)
  }, [])

  return (
    <div ref={rootRef} className="wv vl">
      <BackToFolders />
      <div className="vl__scroll">
        <div className="vl__inner">
          {VIDEOS.map((v, i) => {
            const coverSrc = workImage('cover', v.cover).src
            return (
              <article key={v.no} className="vl__item">
                <div className="vl__meta">
                  <EditableText
                    id={`work.video.${i}.no`}
                    defaultText={`${v.no} ·`}
                    as="span"
                    className="vl__no"
                  />
                  <EditableText
                    id={`work.video.${i}.en`}
                    defaultText={v.en}
                    as="h2"
                    className="vl__title"
                  />
                  <EditableText
                    id={`work.video.${i}.cn`}
                    defaultText={v.cn}
                    as="p"
                    className="vl__cn"
                  />
                  <EditableText
                    id={`work.video.${i}.desc`}
                    defaultText={v.desc}
                    as="p"
                    className="vl__desc"
                    multiline
                  />
                  <EditableLink id={`work.video.${i}.href`} defaultHref={v.href} label="视频链接" />
                </div>
                <VideoCover i={i} coverSrc={coverSrc} coverName={v.cover} en={v.en} href={v.href} editMode={editMode} />
              </article>
            )
          })}
          <div className="vl__end">— END —</div>
        </div>
      </div>
    </div>
  )
}

function VideoCover({
  i,
  coverSrc,
  coverName,
  en,
  href,
  editMode,
}: {
  i: number
  coverSrc: string
  coverName: string
  en: string
  href: string
  editMode: boolean
}) {
  const storedHref = useEditStore((s) => s.links[`work.video.${i}.href`])
  const liveHref = (storedHref ?? href).trim() || href

  const cover = (
    <span className="vl__coverWrap">
      <EditableImage
        id={`work.video.${i}.cover`}
        defaultSrc={coverSrc}
        alt={`${en} 封面`}
        fill
        className="vl__editCover"
        imgProps={{
          ...workImage('cover', coverName),
          sizes: SIZES.video,
          loading: 'lazy',
          decoding: 'async',
        }}
      />
      <span className="vl__play" aria-hidden>
        <svg viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="19.2" stroke="#fff" strokeWidth="1.6" />
          <path d="M16 12.6 28.4 20 16 27.4z" fill="#fff" />
        </svg>
      </span>
    </span>
  )

  if (editMode) return cover

  return (
    <a className="vl__cover" href={liveHref} target="_blank" rel="noreferrer noopener">
      {cover}
    </a>
  )
}
