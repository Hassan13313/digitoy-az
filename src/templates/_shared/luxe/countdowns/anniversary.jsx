/* İLDÖNÜMÜ — geri sayımlar
   heart    Silver Locket  — gümüş ürək medalyonlar
   corner   Golden Jubilee — albom vərəqində foto küncləri
   crease   First Paper    — çəp qat izi olan kağız kartlar
   polaroid Retro Polaroid — rəngli polaroid çərçivələr, əyri düzülmüş
   sealed   Love Letters   — zərflər, ortada mum möhür */

export const ANNIV_CD_CSS = ''

const HEART = 'M50 88C20 66 4 50 4 30 4 16 15 6 28 6 38 6 46 12 50 20 54 12 62 6 72 6 85 6 96 16 96 30 96 50 80 66 50 88Z'

export const ANNIV_CD = {
  heart: ({ seen, units, R, lab, row, pop, C, num }) => (
    <div className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ position: 'relative', display: 'grid', placeItems: 'center', aspectRatio: '1.06' }}>
            <svg aria-hidden="true" viewBox="0 0 100 94" style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,.18))', scale: seen ? '1' : '.6', transition: `scale 1s cubic-bezier(.3,1.5,.5,1) ${0.2 + i * 0.15}s` }}>
              <defs><linearGradient id={`cda-s${i}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F7F8FA" /><stop offset=".5" stopColor={C.SILVER || '#C9CED6'} /><stop offset="1" stopColor="#E6E9EE" /></linearGradient></defs>
              <path d={HEART} fill={`url(#cda-s${i})`} stroke={C.ACCENT} strokeOpacity=".5" />
            </svg>
            <span style={{ position: 'relative', marginTop: '-10%' }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(18px, 5.4vw, 24px)', color: C.INK })}</span>
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  corner: ({ units, R, lab, row, pop, C, num }) => {
    const k = (pos) => ({ position: 'absolute', width: 14, height: 14, background: C.ACCENT, clipPath: { tl: 'polygon(0 0,100% 0,0 100%)', tr: 'polygon(0 0,100% 0,100% 100%)', bl: 'polygon(0 0,100% 100%,0 100%)', br: 'polygon(100% 0,100% 100%,0 100%)' }[pos], [pos[0] === 't' ? 'top' : 'bottom']: -3, [pos[1] === 'l' ? 'left' : 'right']: -3 })
    return (
      <div className="cdx" style={row(10)}>
        {units.map((u, i) => (
          <div key={u.k} style={pop(i)}>
            <div style={{ position: 'relative', padding: '16px 2px', background: C.BG2, boxShadow: '0 3px 8px rgba(0,0,0,.12)' }}>
              {['tl', 'tr', 'bl', 'br'].map((p) => <span key={p} aria-hidden="true" style={k(p)} />)}
              {R(u.v, { fontFamily: num, fontSize: 'clamp(24px, 7vw, 30px)', color: C.INK })}
            </div>
            <div style={lab({ color: C.ACCENT })}>{u.label}</div>
          </div>
        ))}
      </div>
    )
  },
  crease: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ padding: '18px 2px', background: [`linear-gradient(135deg, ${alpha('#FFFFFF', 0.9)} 49%, ${alpha(C.ACCENT, 0.12)} 50%, ${alpha('#FFFFFF', 0.6)} 51%)`, C.BG2].join(', '), border: `1px solid ${alpha(C.ACCENT, 0.25)}`, boxShadow: `4px 4px 0 ${alpha(C.ACCENT, 0.15)}` }}>
            {R(u.v, { fontFamily: num, fontSize: 'clamp(24px, 7vw, 30px)', color: C.ACCENT })}
          </div>
          <div style={lab()}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  polaroid: ({ units, R, lab, row, pop, C, num }) => {
    const cols = [C.ACCENT, C.MUSTARD || C.ACCENT, C.TEAL || C.INK, C.ACCENT]
    return (
      <div className="cdx" style={row(10)}>
        {units.map((u, i) => (
          <div key={u.k} style={{ ...pop(i), rotate: `${[-4, 3, -2, 4][i]}deg` }}>
            <div style={{ padding: '5px 5px 18px', background: '#FFFDF7', boxShadow: '0 6px 12px rgba(0,0,0,.18)' }}>
              <div style={{ padding: '14px 0', background: cols[i] }}>{R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(22px, 6.4vw, 28px)', color: '#FFFDF7' })}</div>
            </div>
            <div style={lab()}>{u.label}</div>
          </div>
        ))}
      </div>
    )
  },
  sealed: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(8)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ position: 'relative', padding: '20px 2px 16px', background: [`linear-gradient(155deg, transparent 49%, ${alpha(C.INK, 0.12)} 50%, transparent 51%)`, `linear-gradient(25deg, transparent 49%, ${alpha(C.INK, 0.12)} 50%, transparent 51%)`, C.BG2].join(', '), boxShadow: '0 3px 8px rgba(0,0,0,.1)' }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -8, width: 16, height: 16, translate: '-50% 0', borderRadius: '50%', background: C.ACCENT, boxShadow: '0 2px 4px rgba(0,0,0,.25)' }} />
            {R(u.v, { fontFamily: num, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.INK })}
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
}
