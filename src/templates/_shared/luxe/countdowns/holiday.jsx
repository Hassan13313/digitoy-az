/* BAYRAM GECƏLƏRİ — geri sayımlar
   ember     Novruz Bonfire  — közərən kömür dairələri, içindən işıq döyünür
   egg       Novruz Səməni   — naxışlı boyalı yumurtalar
   dial      Midnight Clock  — kiçik saat siferblatları, əqrəb vaxtla dönür
   bauble    Snow Globe      — yolka oyuncağı kürələr, qarmaqdan asılı
   cartouche Masquerade Ball — zərli barokko çərçivə */

export const HOLI_CD_CSS = `
@keyframes cdh-glow { 0%,100% { box-shadow: 0 0 10px 2px var(--g), inset 0 0 12px var(--g) } 50% { box-shadow: 0 0 22px 6px var(--g), inset 0 0 18px var(--g) } }
@keyframes cdh-sway { 0%,100% { rotate: -4deg } 50% { rotate: 4deg } }
`

export const HOLI_CD = {
  ember: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(10)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ display: 'grid', placeItems: 'center', aspectRatio: '1', borderRadius: '50%', background: `radial-gradient(circle at 50% 60%, ${C.ACCENT}, #3A1206 72%)`, '--g': alpha(C.ACCENT, 0.6), animation: `cdh-glow ${1.6 + i * 0.3}s ease-in-out infinite` }}>
            {R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(18px, 5.4vw, 23px)', color: '#FFF3DA' })}
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
  egg: ({ units, R, lab, row, pop, C, num }) => {
    const cols = [C.ACCENT, C.GOLD || C.ACCENT, C.GREEN || C.INK, C.ACCENT]
    return (
      <div className="cdx" style={row(10)}>
        {units.map((u, i) => (
          <div key={u.k} style={pop(i)}>
            <div style={{ display: 'grid', placeItems: 'center', aspectRatio: '0.78', borderRadius: '50% 50% 48% 48% / 60% 60% 40% 40%', background: [`repeating-linear-gradient(0deg, transparent 0 12px, rgba(255,255,255,.5) 12px 14px)`, `radial-gradient(circle at 35% 30%, rgba(255,255,255,.45), transparent 40%)`, cols[i]].join(', '), boxShadow: 'inset -6px -8px 14px rgba(0,0,0,.18)' }}>
              {R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(18px, 5.4vw, 23px)', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,.3)' })}
            </div>
            <div style={lab()}>{u.label}</div>
          </div>
        ))}
      </div>
    )
  },
  dial: ({ seen, units, R, lab, row, pop, C, num, cd, alpha }) => {
    const frac = { days: Math.min(cd.days / 365, 1), hours: cd.hours / 24, minutes: cd.minutes / 60, seconds: cd.seconds / 60 }
    return (
      <div className="cdx" style={row(8)}>
        {units.map((u, i) => (
          <div key={u.k} style={pop(i)}>
            <div style={{ position: 'relative', display: 'grid', placeItems: 'center', aspectRatio: '1', borderRadius: '50%', border: `2px solid ${C.ACCENT}`, background: `radial-gradient(circle, ${alpha(C.ACCENT, 0.08)}, transparent 70%)`, boxShadow: `inset 0 0 0 4px ${C.BG}, inset 0 0 0 5px ${alpha(C.ACCENT, 0.4)}` }}>
              <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 6, width: 2, height: 6, marginLeft: -1, background: C.ACCENT }} />
              <span aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: '50%', width: 2, height: '36%', marginLeft: -1, background: alpha(C.ACCENT, 0.7), transformOrigin: '50% 100%', rotate: `${(seen ? frac[u.k] : 0) * 360}deg`, transition: 'rotate 1s ease' }} />
              <span style={{ position: 'relative', padding: '0 4px', background: C.BG, borderRadius: 4 }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(16px, 4.8vw, 21px)', color: C.INK })}</span>
            </div>
            <div style={lab({ color: C.ACCENT })}>{u.label}</div>
          </div>
        ))}
      </div>
    )
  },
  bauble: ({ units, R, lab, row, pop, C, num }) => {
    const cols = [C.ACCENT, C.GOLD || C.ACCENT, C.GREEN || C.INK, C.ACCENT]
    return (
      <div className="cdx" style={row(10)}>
        {units.map((u, i) => (
          <div key={u.k} style={pop(i)}>
            <div style={{ transformOrigin: '50% 0', animation: `cdh-sway ${2.4 + i * 0.3}s ease-in-out infinite` }}>
              <div style={{ width: 1, height: 10, margin: '0 auto', background: C.MUTE }} />
              <div style={{ width: 14, height: 7, margin: '0 auto', borderRadius: '3px 3px 0 0', background: C.GOLD || C.ACCENT }} />
              <div style={{ display: 'grid', placeItems: 'center', aspectRatio: '1', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.65), transparent 32%), ${cols[i]}`, boxShadow: 'inset -6px -8px 14px rgba(0,0,0,.2)' }}>
                {R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(18px, 5.4vw, 23px)', color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,.3)' })}
              </div>
            </div>
            <div style={lab()}>{u.label}</div>
          </div>
        ))}
      </div>
    )
  },
  cartouche: ({ units, R, lab, row, pop, C, num, alpha }) => (
    <div className="cdx" style={row(10)}>
      {units.map((u, i) => (
        <div key={u.k} style={pop(i)}>
          <div style={{ position: 'relative', padding: '18px 2px', borderRadius: '40% 40% 40% 40% / 30% 30% 30% 30%', background: `radial-gradient(circle, ${alpha(C.ACCENT, 0.1)}, transparent 70%), ${C.BG2}`, border: `2px solid ${C.ACCENT}`, boxShadow: `inset 0 0 0 4px ${C.BG2}, inset 0 0 0 5px ${alpha(C.ACCENT, 0.5)}, 0 6px 14px rgba(0,0,0,.35)` }}>
            {R(u.v, { fontFamily: num, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.INK })}
          </div>
          <div style={lab({ color: C.ACCENT })}>{u.label}</div>
        </div>
      ))}
    </div>
  ),
}
