/* QIZ GECƏSİ — geri sayımlar
   bubble  Pink Champagne — şampan qabarcıqları, yavaşca qalxıb-enir
   chrome  Disco Ball     — xrom rəqəmlər, güzgü parıltısı
   pillowc Pajama Spa     — yumşaq yastıq kartlar, tikiş xətti
   macaron Paris Night    — iki qatlı makaron
   arch    Boho Sunset    — terrakota tağlar */

export const BACH_CD_CSS = `
@keyframes cdq-float { 0%,100% { translate: 0 0 } 50% { translate: 0 -7px } }
@keyframes cdq-shine { 0%, 60% { background-position: -150% 0 } 100% { background-position: 250% 0 } }
`

export const BACH_CD = {
  bubble: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ display: 'grid', placeItems: 'center', aspectRatio: '1', borderRadius: '50%', background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.9), transparent 22%), radial-gradient(circle, ${alpha(C.ACCENT, 0.06)}, ${alpha(C.ACCENT, 0.25)})`, border: `1px solid ${alpha(C.ACCENT, 0.5)}`, animation: `cdq-float ${2.6 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }}>
            {R(u.v, { fontFamily: num, fontSize: 'clamp(18px, 5.4vw, 23px)', color: C.INK })}
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  chrome: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ padding: '12px 0', borderRadius: 10, background: `linear-gradient(110deg, transparent 30%, ${alpha('#FFFFFF', 0.35)} 50%, transparent 70%) 0 0 / 250% 100%, linear-gradient(180deg, #3A3A48, #15151E)`, boxShadow: `inset 0 0 0 1px ${alpha('#FFFFFF', 0.25)}, 0 0 14px ${alpha(C.ACCENT, 0.45)}`, animation: `cdq-shine ${4 + i * 0.5}s linear infinite` }}>
            {R(u.v, { fontFamily: num, fontWeight: 800, fontSize: 'clamp(26px, 7.6vw, 34px)', color: '#F4F4F8', textShadow: `0 1px 0 #9A9AA8, 0 0 10px ${alpha(C.ACCENT, 0.8)}` })}
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  pillowc: ({ units, R, lab, row, pop, C, num, alpha }) => {
    const cols = [C.BG2, C.MINT || C.BG2, C.BG2, C.MINT || C.BG2]
    return (
      <div className="cdx" style={row(8)}>
        {units.map((u, i) => (
          <div key={u.k} style={pop(i)}>
            <div style={{ padding: '16px 2px', borderRadius: '36% / 46%', background: `radial-gradient(circle at 40% 30%, #FFFFFF, ${cols[i]} 75%)`, boxShadow: `inset -4px -6px 12px ${alpha(C.ACCENT, 0.2)}, 0 6px 12px ${alpha(C.ACCENT, 0.15)}`, outline: `1.5px dashed ${alpha(C.ACCENT, 0.45)}`, outlineOffset: -7 }}>
              {R(u.v, { fontFamily: num, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.INK })}
            </div>
            <div style={lab({ color: C.ACCENT })}>{u.label}</div>
          </div>
        ))}
      </div>
    )
  },
  macaron: ({ units, R, lab, row, pop, C, num }) => {
    const cols = [C.ACCENT, C.MINT || C.ACCENT, C.LAV || C.ACCENT, C.ACCENT]
    return (
      <div className="cdx" style={row(8)}>
        {units.map((u, i) => (
          <div key={u.k} style={pop(i)}>
            <div style={{ height: 14, borderRadius: '50% 50% 20% 20% / 100% 100% 30% 30%', background: cols[i], boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.08)' }} />
            <div style={{ padding: '6px 0', margin: '0 4px', background: '#FFFBF5', borderTop: `2px dotted ${cols[i]}`, borderBottom: `2px dotted ${cols[i]}` }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(22px, 6.4vw, 28px)', color: '#2A2230' })}</div>
            <div style={{ height: 14, borderRadius: '20% 20% 50% 50% / 30% 30% 100% 100%', background: cols[i], boxShadow: 'inset 0 3px 0 rgba(255,255,255,.3)' }} />
            <div style={lab()}>{u.label}</div>
          </div>
        ))}
      </div>
    )
  },
  arch: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ padding: '24px 2px 12px', borderRadius: '999px 999px 0 0', background: [C.ACCENT, C.SAND || C.BG2, C.SAGE || C.MUTE, C.ACCENT][i], boxShadow: `inset 0 0 0 4px ${alpha('#FFFFFF', 0.35)}` }}>
            {R(u.v, { fontFamily: num, fontSize: 'clamp(22px, 6.4vw, 28px)', color: i === 1 ? C.INK : '#FFFFFF' })}
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
}
