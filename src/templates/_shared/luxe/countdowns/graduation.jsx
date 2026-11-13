/* MƏZUNİYYƏT — geri sayımlar
   tassel   Caps Toss  — kartın küncündən sallanan qızılı qotaz
   jersey   Yearbook   — forma nömrəsi: iki qat konturlu iri rəqəm
   calendar Last Bell  — qopan təqvim vərəqi, yuxarıda halqalar
   chalkbox Chalkboard — təbaşirlə çəkilmiş əyri çərçivə
   airmail  Paper Plane — hava poçtu zolaqlı kart */

export const GRAD_CD_CSS = `
@keyframes cdg-tassel { 0%,100% { rotate: -6deg } 50% { rotate: 6deg } }
`

export const GRAD_CD = {
  tassel: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(10)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ position: 'relative', padding: '16px 2px', background: C.INK, color: C.BG, border: `1px solid ${alpha(C.ACCENT, 0.7)}`, boxShadow: `inset 0 0 0 3px ${C.INK}, inset 0 0 0 4px ${alpha(C.ACCENT, 0.5)}` }}>
            {R(u.v, { fontFamily: num, fontSize: 'clamp(24px, 7vw, 30px)', color: C.BG })}
            <span aria-hidden="true" style={{ position: 'absolute', right: 6, top: 0, width: 2, height: 22, background: C.ACCENT, transformOrigin: '50% 0', animation: `cdg-tassel ${2 + i * 0.3}s ease-in-out infinite` }}>
              <span style={{ position: 'absolute', left: -3, bottom: -8, width: 8, height: 10, borderRadius: '2px 2px 4px 4px', background: C.ACCENT }} />
            </span>
          </div>
          <div style={lab({ color: C.INK })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  jersey: ({ units, R, lab, row, pop, C, num }) => (
    <div className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ padding: '10px 0', borderRadius: '14px 14px 6px 6px', background: C.ACCENT, clipPath: 'polygon(0 12%, 22% 0, 36% 8%, 64% 8%, 78% 0, 100% 12%, 92% 34%, 88% 30%, 88% 100%, 12% 100%, 12% 30%, 8% 34%)' }}>
            <div style={{ paddingTop: 10 }}>{R(u.v, { fontFamily: num, fontWeight: 800, fontSize: 'clamp(22px, 6.6vw, 28px)', color: C.YEL || '#FFC629', WebkitTextStroke: `1px ${C.INK}` })}</div>
          </div>
          <div style={lab({ color: C.ACCENT, fontWeight: 700 })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  calendar: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(10)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ position: 'relative', background: '#FFFFFF', boxShadow: '0 4px 10px rgba(0,0,0,.12)', border: `1px solid ${alpha(C.INK, 0.12)}` }}>
            <div style={{ height: 12, background: C.ACCENT }} />
            <span aria-hidden="true" style={{ position: 'absolute', top: -5, left: '30%', width: 4, height: 10, borderRadius: 2, background: C.INK }} />
            <span aria-hidden="true" style={{ position: 'absolute', top: -5, right: '30%', width: 4, height: 10, borderRadius: 2, background: C.INK }} />
            <div style={{ padding: '10px 2px 12px' }}>{R(u.v, { fontFamily: num, fontWeight: 600, fontSize: 'clamp(22px, 6.6vw, 28px)', color: C.INK })}</div>
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  chalkbox: ({ units, R, lab, row, pop, C, num }) => (
    <div className="cdx" style={row(10)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ position: 'relative', padding: '14px 2px', background: C.BOARD || C.INK, borderRadius: 4 }}>
            <svg aria-hidden="true" viewBox="0 0 100 70" preserveAspectRatio="none" style={{ position: 'absolute', inset: 4, width: 'calc(100% - 8px)', height: 'calc(100% - 8px)' }}><path d="M3 5Q50 1 97 4 99 35 96 66 50 69 4 65 1 35 3 5Z" fill="none" stroke={i % 2 ? (C.YEL || '#F5DE7A') : '#F4F1EA'} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" /></svg>
            {R(u.v, { fontFamily: num, fontSize: 'clamp(26px, 7.6vw, 32px)', color: '#F4F1EA' })}
          </div>
          <div style={lab({ color: C.INK })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  airmail: ({ units, R, lab, row, pop, C, num }) => (
    <div className="cdx" style={row(10)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ padding: 4, background: `repeating-linear-gradient(135deg, ${C.RED || '#E0483E'} 0 8px, #FFFFFF 8px 14px, ${C.ACCENT} 14px 22px, #FFFFFF 22px 28px)`, boxShadow: '0 4px 10px rgba(0,0,0,.12)' }}>
            <div style={{ padding: '12px 2px', background: '#FFFFFF' }}>{R(u.v, { fontFamily: num, fontWeight: 600, fontSize: 'clamp(22px, 6.6vw, 28px)', color: C.INK })}</div>
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
}
