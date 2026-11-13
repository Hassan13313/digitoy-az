/* BABY SHOWER — geri sayımlar
   blot   Pastel Bloom  — akvarel ləkəsi
   patch  Teddy Bear    — tikişli parça yamaq
   split  Gender Reveal — növbə ilə mavi və çəhrayı bloklar
   stamp  Stork Letter  — dişli kənarlı poçt markası
   cloud  Baby Mobile   — keçə bulud, sapdan asılı */

export const BABY_CD_CSS = `
@keyframes cdb-swing { 0%,100% { rotate: -4deg } 50% { rotate: 4deg } }
`

const CLOUD = 'M14 44C6 44 2 38 2 32 2 25 8 20 15 21 17 12 25 6 34 6 44 6 51 13 52 22 58 23 60 28 60 33 60 40 54 44 48 44Z'

export const BABY_CD = {
  blot: ({ ref, seen, units, R, lab, row, pop, C, num, alpha }) => {
    const cols = [C.ACCENT, C.SAGE || C.MUTE, C.ACCENT, C.SAGE || C.MUTE]
    return (
      <div ref={ref} className="cdx" style={row(8)}>
        {units.map((u, i) => (
          <div key={u.k} style={pop(i)}>
            <div style={{ position: 'relative', aspectRatio: '1', display: 'grid', placeItems: 'center' }}>
              <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '48% 52% 44% 56% / 52% 46% 54% 48%', background: `radial-gradient(circle at 45% 45%, ${alpha(cols[i], 0.5)}, ${alpha(cols[i], 0.22)} 60%, transparent 74%)`, scale: seen ? '1' : '.3', transition: `scale 1.6s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.15}s` }} />
              <span style={{ position: 'relative' }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.INK })}</span>
            </div>
            <div style={lab()}>{u.label}</div>
          </div>
        ))}
      </div>
    )
  },
  patch: ({ ref, units, R, lab, row, pop, C, num, alpha }) => {
    const cols = [C.BG2, C.SKY || C.BG2, C.BG2, C.SKY || C.BG2]
    return (
      <div ref={ref} className="cdx" style={row(10)}>
        {units.map((u, i) => (
          <div key={u.k} style={{ ...pop(i), rotate: `${[-3, 2, -2, 3][i]}deg` }}>
            <div style={{ padding: '14px 2px', borderRadius: 10, background: cols[i], outline: `1.5px dashed ${alpha(C.ACCENT, 0.7)}`, outlineOffset: -6, boxShadow: '0 4px 10px rgba(0,0,0,.08)' }}>
              {R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.INK })}
            </div>
            <div style={lab({ color: C.ACCENT })}>{u.label}</div>
          </div>
        ))}
      </div>
    )
  },
  split: ({ ref, units, R, lab, pop, C, num }) => (
    <div ref={ref} className="cdx" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: 380, margin: '0 auto', textAlign: 'center', borderRadius: 18, overflow: 'hidden', boxShadow: '0 10px 24px rgba(0,0,0,.08)' }}>
      {units.map((u, i) => (
        <div key={u.k} style={{ ...pop(i), padding: '18px 2px 14px', background: i % 2 ? (C.BLUE || C.ACCENT) : (C.PINK || C.ACCENT) }}>
          {R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(24px, 7vw, 30px)', color: C.INK })}
          <div style={lab({ marginTop: 6, color: C.INK })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  stamp: ({ ref, units, R, lab, row, pop, C, num, alpha }) => (
    <div ref={ref} className="cdx" style={row(10)}>
      {units.map((u, i) => (
        <div key={u.k} style={{ ...pop(i), rotate: `${[-2, 1.5, -1, 2][i]}deg` }}>
          <div style={{ padding: 5, background: `radial-gradient(circle, transparent 3px, #FFFDF8 3.5px) -5px -5px / 10px 10px`, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.15))' }}>
            <div style={{ padding: '14px 2px 10px', background: alpha(C.ACCENT, 0.1), border: `1px solid ${alpha(C.ACCENT, 0.5)}` }}>
              {R(u.v, { fontFamily: num, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.ACCENT })}
            </div>
          </div>
          <div style={lab()}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  cloud: ({ ref, units, R, lab, row, pop, C, num, alpha }) => (
    <div ref={ref} className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ transformOrigin: '50% 0', animation: `cdb-swing ${2.6 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }}>
            <div style={{ width: 1, height: 14, margin: '0 auto', background: alpha(C.INK, 0.4) }} />
            <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
              <svg aria-hidden="true" viewBox="0 0 62 48" style={{ width: '100%', filter: `drop-shadow(0 4px 6px ${alpha(C.INK, 0.15)})` }}><path d={CLOUD} fill="#fff" stroke={alpha(C.ACCENT, 0.7)} strokeWidth="1" strokeDasharray="2 2" /></svg>
              <span style={{ position: 'absolute', top: '38%' }}>{R(u.v, { fontFamily: num, fontWeight: 600, fontSize: 'clamp(16px, 4.8vw, 21px)', color: C.CLOUDINK || C.BG })}</span>
            </div>
          </div>
          <div style={lab()}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
}
