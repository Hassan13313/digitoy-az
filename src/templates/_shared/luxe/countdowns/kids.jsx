/* UŞAQ AD GÜNÜ — geri sayımlar
   storybook Fairy Tale     — açıq kitab vərəqləri, ortada cild xətti
   radar     Space Mission  — fırlanan radar şüası, rəqəm ekranın ortasında
   pennant   Circus Show    — ip boyunca asılan üçbucaq bayraqcıqlar
   footprint Dino Adventure — üç barmaqlı dino izi
   balloon   Balloon Party  — yellənən şarlar, sap ilə */

export const KIDS_CD_CSS = `
@keyframes cdk-sweep { to { rotate: 360deg } }
@keyframes cdk-sway { 0%,100% { rotate: -3deg } 50% { rotate: 3deg } }
@keyframes cdk-bob { 0%,100% { translate: 0 0 } 50% { translate: 0 -6px } }
`


export const KIDS_CD = {
  storybook: ({ ref, seen, units, R, lab, row, pop, C, num }) => (
    <div ref={ref} className="cdx" style={row(10)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ position: 'relative', display: 'grid', placeItems: 'center', aspectRatio: '1.1', borderRadius: '4px 4px 10px 10px / 4px 4px 16px 16px', background: `linear-gradient(90deg, ${C.BG2} 0 47%, ${C.ACCENT} 47% 53%, ${C.BG2} 53%)`, boxShadow: `0 6px 0 -2px ${C.INK}, 0 10px 18px rgba(0,0,0,.18)`, transform: seen ? 'perspective(500px) rotateX(0)' : 'perspective(500px) rotateX(60deg)', transition: `transform 1.2s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.12}s` }}>
            <span style={{ padding: '0 6px', background: C.BG2 }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.INK })}</span>
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  radar: ({ ref, units, R, lab, row, pop, C, num, alpha }) => (
    <div ref={ref} className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ position: 'relative', aspectRatio: '1', borderRadius: '50%', display: 'grid', placeItems: 'center', overflow: 'hidden', background: `radial-gradient(circle, ${alpha(C.ACCENT, 0.12)}, ${C.BG2} 70%)`, border: `1px solid ${alpha(C.ACCENT, 0.6)}`, boxShadow: `inset 0 0 0 12px ${alpha(C.BG, 0.3)}, inset 0 0 0 13px ${alpha(C.ACCENT, 0.25)}` }}>
            <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `conic-gradient(from 0deg, ${alpha(C.ACCENT, 0.55)}, transparent 25%)`, animation: `cdk-sweep ${3 + i * 0.4}s linear infinite` }} />
            <span style={{ position: 'relative' }}>{R(u.v, { fontFamily: num, fontWeight: 600, fontSize: 'clamp(18px, 5.4vw, 23px)', color: C.INK, textShadow: `0 0 8px ${alpha(C.ACCENT, 0.6)}` })}</span>
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  pennant: ({ ref, units, R, lab, pop, C, num, alpha }) => (
    <div ref={ref} className="cdx" style={{ position: 'relative', maxWidth: 380, margin: '0 auto', paddingTop: 6 }}>
      <svg aria-hidden="true" viewBox="0 0 100 10" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, width: '100%', height: 14 }}><path d="M0 2Q50 12 100 2" fill="none" stroke={alpha(C.INK, 0.5)} strokeWidth=".6" /></svg>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
        {units.map((u, i) => (
          <div key={u.k} style={pop(i)}>
            <div style={{ transformOrigin: '50% 0', animation: `cdk-sway ${2.4 + i * 0.3}s ease-in-out infinite` }}>
              <div style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', padding: '14px 0 46px', background: i % 2 ? C.ACCENT : (C.RED || C.INK), marginTop: i % 2 ? 6 : 2 }}>
                {R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(20px, 6vw, 26px)', color: i % 2 ? C.INK : '#fff' })}
              </div>
            </div>
            <div style={lab()}>{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  ),
  footprint: ({ ref, seen, units, R, lab, row, pop, C, num }) => (
    <div ref={ref} className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={{ ...pop(i), rotate: `${i % 2 ? 8 : -8}deg` }}>
          <div style={{ position: 'relative', display: 'grid', placeItems: 'center', aspectRatio: '1' }}>
            <svg aria-hidden="true" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, scale: seen ? '1' : '.4', transition: `scale .6s cubic-bezier(.3,1.6,.5,1) ${0.3 + i * 0.2}s` }}>
              <g fill={C.ACCENT} opacity=".92">
                <ellipse cx="50" cy="70" rx="24" ry="22" />
                {[-34, 0, 34].map((r) => <path key={r} d="M50 58C42 44 42 24 50 6 58 24 58 44 50 58Z" transform={`rotate(${r} 50 62)`} />)}
              </g>
            </svg>
            <span style={{ position: 'relative', marginTop: '38%' }}>{R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(16px, 4.8vw, 21px)', color: '#fff' })}</span>
          </div>
          <div style={lab({ marginTop: 4 })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  balloon: ({ ref, units, R, lab, row, pop, C, num }) => {
    const cols = [C.ACCENT, C.PEACH || C.MUTE, C.GOLD || C.ACCENT, C.PINK || C.INK]
    return (
      <div ref={ref} className="cdx" style={row(10)}>
        {units.map((u, i) => (
          <div key={u.k} style={pop(i)}>
            <div style={{ animation: `cdk-bob ${2.2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite` }}>
              <div style={{ display: 'grid', placeItems: 'center', aspectRatio: '0.84', borderRadius: '50% 50% 48% 48% / 56% 56% 44% 44%', background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.7), transparent 30%), ${cols[i]}` }}>
                {R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(20px, 6vw, 26px)', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.2)' })}
              </div>
              <div style={{ width: 1, height: 18, margin: '0 auto', background: C.MUTE }} />
            </div>
            <div style={lab({ marginTop: 4 })}>{u.label}</div>
          </div>
        ))}
      </div>
    )
  },
}
