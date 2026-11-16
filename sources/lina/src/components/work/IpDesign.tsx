import { IP_DESIGN } from '../../data/content'
import { EditableText } from '../../editor'

/** DESIGN › 03 IP DESIGN */
export default function IpDesign({ active }: { active: boolean }) {
  return (
    <div className="ip" data-active={active}>
      <div className="ip__orb" aria-hidden>
        <span className="ip__orbHi" />
        <span className="ip__orbShade" />
      </div>

      <div className="ip__copy">
        <EditableText id="work.ip.kicker" defaultText={IP_DESIGN.kicker} as="span" className="ip__kicker" />
        <EditableText id="work.ip.title" defaultText={IP_DESIGN.title} as="h1" className="ip__title" />
        <EditableText id="work.ip.cn" defaultText={IP_DESIGN.cn} as="p" className="ip__cn" />
        <EditableText id="work.ip.desc" defaultText={IP_DESIGN.desc} as="p" className="ip__desc" multiline />

        <ul className="ip__specs">
          {IP_DESIGN.specs.map((s, i) => (
            <li key={s.k}>
              <EditableText id={`work.ip.spec.${i}.k`} defaultText={s.k} as="span" />
              <EditableText id={`work.ip.spec.${i}.v`} defaultText={s.v} as="em" />
            </li>
          ))}
        </ul>

        <div className="ip__swatches">
          {IP_DESIGN.swatches.map((s, i) => (
            <span key={s.name} className="ip__sw">
              <i style={{ background: s.hex }} />
              <EditableText id={`work.ip.swatch.${i}`} defaultText={s.name} as="span" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
