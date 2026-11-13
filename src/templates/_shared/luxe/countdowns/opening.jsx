/* AÇILIŞ / TƏQDİMAT — geri sayımlar
   plaque Ribbon Cut     — zümrüd lövhə, zər haşiyə
   saucer Bistro Sign    — fincan nəlbəkisi kimi dairə
   steel  Roller Shutter — perçinli polad lövhə
   beam   Unboxing       — şüşə kart, üzərindən işıq şüası keçir
   label  Gallery Unveil — muzey etiketi */

export const OPEN_CD_CSS = `
@keyframes cdo-beam { 0%, 50% { translate: -150% 0 } 100% { translate: 150% 0 } }
`

export const OPEN_CD = {
  plaque: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ padding: '16px 2px', background: `linear-gradient(160deg, ${C.EMERALD || C.INK}, ${alpha(C.EMERALD || C.INK, 0.85)})`, border: `1px solid ${C.ACCENT}`, boxShadow: `inset 0 0 0 3px ${C.EMERALD || C.INK}, inset 0 0 0 4px ${alpha(C.ACCENT, 0.6)}` }}>
            {R(u.v, { fontFamily: num, fontSize: 'clamp(24px, 7vw, 30px)', color: C.ACCENT })}
          </div>
          <div style={lab({ color: C.INK })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  saucer: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ display: 'grid', placeItems: 'center', aspectRatio: '1', borderRadius: '50%', background: '#FFFFFF', boxShadow: `inset 0 0 0 5px #FFFFFF, inset 0 0 0 6px ${alpha(C.ACCENT, 0.6)}, inset 0 0 0 14px #FFFFFF, inset 0 0 0 15px ${alpha(C.INK, 0.12)}, 0 6px 12px rgba(0,0,0,.1)` }}>
            {R(u.v, { fontFamily: num, fontSize: 'clamp(18px, 5.4vw, 23px)', color: C.INK })}
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  steel: ({ units, R, lab, row, pop, C, num }) => (
    <div className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ position: 'relative', padding: '16px 2px', background: 'linear-gradient(160deg, #E4E6E8, #B7BCC1 55%, #D3D6D9)', border: '1px solid #8E9398', borderRadius: 4 }}>
            {[[6, 6], [6, 'r'], ['b', 6], ['b', 'r']].map(([y, x], k) => <span key={k} aria-hidden="true" style={{ position: 'absolute', width: 5, height: 5, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #FFFFFF, #6E7378)', [y === 'b' ? 'bottom' : 'top']: 5, [x === 'r' ? 'right' : 'left']: 5 }} />)}
            {R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(24px, 7vw, 30px)', color: C.INK })}
          </div>
          <div style={lab({ color: C.INK })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  beam: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ position: 'relative', overflow: 'hidden', padding: '16px 2px', borderRadius: 14, background: alpha('#FFFFFF', 0.55), border: `1px solid ${alpha(C.ACCENT, 0.35)}`, boxShadow: `0 10px 24px ${alpha(C.ACCENT, 0.18)}`, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
            <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(110deg, transparent 35%, ${alpha(C.ACCENT, 0.25)} 50%, transparent 65%)`, animation: `cdo-beam 4s ease-in-out ${i * 0.5}s infinite` }} />
            <span style={{ position: 'relative' }}>{R(u.v, { fontFamily: num, fontWeight: 600, fontSize: 'clamp(24px, 7vw, 30px)', color: C.INK })}</span>
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  label: ({ units, R, lab, pop, C, num, alpha }) => (
    <div className="cdx" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxWidth: 380 }}>
      {units.map((u, i) => (
        <div key={u.k} style={{ ...pop(i), padding: '12px 14px', background: '#FFFFFF', border: `1px solid ${alpha(C.INK, 0.12)}`, boxShadow: '0 2px 6px rgba(0,0,0,.06)' }}>
          {R(u.v, { fontFamily: num, fontSize: 'clamp(30px, 9vw, 40px)', lineHeight: 1, color: C.INK })}
          <div style={lab({ marginTop: 8, textAlign: 'left', color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
}
