/* KORPORATİV — geri sayımlar
   fan     Gala Night    — art-deko yelpik tağı, qızılı şüalar
   timer   Keynote       — səhnə taymeri: rəqəmlər və dolan zolaq
   medal   Award Night   — lentli medallar
   grid    Business Card — İsveçrə şəbəkəsi: iri rəqəm, nazik xətlər
   tube    Neon Party    — neon boru çərçivələr */

export const CORP_CD_CSS = `
@keyframes cdc-flick { 0%, 30%, 34%, 100% { opacity: 1 } 32% { opacity: .4 } }
`

export const CORP_CD = {
  fan: ({ ref, units, R, lab, row, pop, C, num, alpha }) => (
    <div ref={ref} className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ position: 'relative', padding: '26px 2px 12px', borderRadius: '60px 60px 0 0', border: `1px solid ${alpha(C.ACCENT, 0.8)}`, background: `repeating-conic-gradient(from 270deg at 50% 100%, ${alpha(C.ACCENT, 0.18)} 0 2deg, transparent 2deg 14deg)`, overflow: 'hidden' }}>
            {R(u.v, { fontFamily: num, fontSize: 'clamp(24px, 7vw, 30px)', color: C.INK })}
          </div>
          <div style={{ height: 3, background: C.ACCENT }} />
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  timer: ({ ref, seen, units, R, lab, pop, C, num, cd, alpha }) => {
    const frac = { days: Math.min(cd.days / 365, 1), hours: cd.hours / 24, minutes: cd.minutes / 60, seconds: cd.seconds / 60 }
    return (
      <div ref={ref} className="cdx" style={{ maxWidth: 380, margin: '0 auto', padding: '16px 14px', borderRadius: 14, background: alpha(C.ACCENT, 0.06), border: `1px solid ${alpha(C.ACCENT, 0.35)}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              {R(u.v, { fontFamily: num, fontWeight: 600, fontSize: 'clamp(26px, 7.6vw, 34px)', color: C.INK, letterSpacing: '-.02em' })}
              <div style={{ height: 3, marginTop: 6, borderRadius: 2, background: alpha(C.INK, 0.12), overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(seen ? frac[u.k] : 0) * 100}%`, background: `linear-gradient(90deg, ${C.ACCENT}, ${C.ACC2 || C.ACCENT})`, transition: 'width 1s linear' }} />
              </div>
              <div style={lab({ marginTop: 8, letterSpacing: '.14em' })}>{u.label}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  medal: ({ ref, seen, units, R, lab, row, pop, C, num, alpha }) => (
    <div ref={ref} className="cdx" style={row(10)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2, height: 22 }}>
            <span style={{ width: 12, background: C.RIB || C.ACCENT, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)', rotate: '12deg' }} />
            <span style={{ width: 12, background: C.RIB || C.ACCENT, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)', rotate: '-12deg' }} />
          </div>
          <div style={{ display: 'grid', placeItems: 'center', aspectRatio: '1', margin: '-4px 6px 0', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, ${alpha('#FFFFFF', 0.6)}, transparent 40%), linear-gradient(145deg, ${C.ACCENT}, ${alpha(C.ACCENT, 0.6)})`, boxShadow: `inset 0 0 0 4px ${alpha('#000000', 0.12)}, 0 6px 12px rgba(0,0,0,.3)`, rotate: seen ? '0deg' : '-90deg', transition: `rotate 1.2s cubic-bezier(.3,1.4,.5,1) ${0.2 + i * 0.15}s` }}>
            {R(u.v, { fontFamily: num, fontWeight: 600, fontSize: 'clamp(16px, 4.8vw, 21px)', color: C.BG })}
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  grid: ({ ref, units, R, lab, pop, C, num }) => (
    <div ref={ref} className="cdx" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 380, borderTop: `2px solid ${C.INK}` }}>
      {units.map((u, i) => (
        <div key={u.k} style={{ ...pop(i), padding: '12px 0 14px', borderBottom: `1px solid ${C.INK}`, borderLeft: i % 2 ? `1px solid ${C.INK}` : undefined, paddingLeft: i % 2 ? 14 : 0 }}>
          {R(u.v, { fontFamily: num, fontWeight: 600, fontSize: 'clamp(46px, 14vw, 64px)', letterSpacing: '-.04em', lineHeight: 1, color: i === 0 ? C.ACCENT : C.INK })}
          <div style={lab({ marginTop: 4, color: C.INK, letterSpacing: '.12em' })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  tube: ({ ref, units, R, lab, row, pop, C, num, alpha }) => {
    const cols = [C.ACCENT, C.CYAN || C.ACCENT, C.ACCENT, C.CYAN || C.ACCENT]
    return (
      <div ref={ref} className="cdx" style={row(10)}>
        {units.map((u, i) => (
          <div key={u.k} style={pop(i)}>
            <div style={{ padding: '14px 2px', borderRadius: 14, border: `2px solid ${cols[i]}`, boxShadow: `0 0 8px ${cols[i]}, inset 0 0 8px ${alpha(cols[i], 0.6)}`, animation: `cdc-flick ${3 + i}s linear infinite` }}>
              {R(u.v, { fontFamily: num, fontSize: 'clamp(24px, 7vw, 30px)', color: '#fff', textShadow: `0 0 8px ${cols[i]}, 0 0 2px ${cols[i]}` })}
            </div>
            <div style={lab({ color: cols[i] })}>{u.label}</div>
          </div>
        ))}
      </div>
    )
  },
}
