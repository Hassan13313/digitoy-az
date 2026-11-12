import { useInView } from '../viralHooks'
import { Roll } from '../viral'
import { alpha } from '../useInvitation'

/* ─────────────────────────────────────────────────────────────────────────────
   GERİ SAYIM — lüks foto şablonları üçün (2026-11)

   Gün, saat, dəqiqə və saniyə bərabər görünür; hər şablonun öz forması var:
     orbit    Night Sky       — ulduz orbitləri: halqa vaxtla dolur, ulduz fırlanır
     tiles    Mediterranean   — mayolika kaşıları
     glass    Crystal Glass   — buzlu şüşə kartlar, yuxarıda prizma zolağı
     columns  Gazette         — qəzet sütunları, iri rəqəmlər, şaquli xətlər
     deco     Royal Gold      — art-deko pilləli tağlar
     facet    Luxury Jewelry  — brilyant kəsimi (romb)
     petal    Floral Garden   — ləçək dairələri
     minimal  White Elegance  — nazik rəqəmlər, incə ayırıcılar
     pebble   Nature Touch    — çay daşı formaları
     vinyl    Vinyl Record    — fırlanan vallar, etiketdə rəqəm
     marquee  Cinema Premiere — lampalı marquee qutuları
     flap     Boarding Pass   — split-flap lövhə, rəqəm dəyişəndə çevrilir
     stack    Modern Black    — alt-alta iri rəqəmlər
     crest    Royal Palace    — ikiqat zər çərçivələr, tac
     star8    Oriental Luxe   — səkkizguşəli ulduzlar
   `cd` — useCountdown nəticəsi (days, hours, minutes, seconds, labels).
   ───────────────────────────────────────────────────────────────────────── */

export const COUNTDOWN_CSS = `
@keyframes cdx-spin { to { rotate: 360deg } }
@keyframes cdx-flap { from { transform: perspective(300px) rotateX(-90deg); opacity: .3 } to { transform: none; opacity: 1 } }
@keyframes cdx-bulb { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes cdx-pop { from { opacity: 0; scale: .6 } to { opacity: 1; scale: 1 } }
@media (prefers-reduced-motion: reduce) { .cdx * { animation: none !important; transition: none !important; } }
`

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ kind, cd, C, fonts, light = false }) {
  const [ref, seen] = useInView(0.3)
  const units = [['days', cd.days], ['hours', cd.hours], ['minutes', cd.minutes], ['seconds', cd.seconds]]
    .map(([k, n]) => ({ k, n, v: k === 'days' ? String(n) : pad(n), label: cd.labels?.[k] || '' }))
  const num = fonts.num || fonts.head
  const caps = fonts.caps || fonts.head
  const lab = (extra) => ({ marginTop: 10, fontFamily: caps, fontSize: 10.5, letterSpacing: '.22em', textTransform: 'uppercase', color: C.MUTE, ...extra })
  const row = (gap = 10) => ({ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap, maxWidth: 380, margin: '0 auto', textAlign: 'center' })
  const pop = (i) => ({ opacity: seen ? 1 : 0, translate: seen ? '0 0' : '0 14px', transition: `opacity 1s ${0.1 + i * 0.12}s, translate 1s cubic-bezier(.2,.7,.2,1) ${0.1 + i * 0.12}s` })
  const R = (v, style) => <Roll value={v} style={style} />

  switch (kind) {
    case 'orbit': {
      const frac = { days: 1, hours: cd.hours / 24, minutes: cd.minutes / 60, seconds: cd.seconds / 60 }
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', display: 'grid', placeItems: 'center' }}>
                <svg aria-hidden="true" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, rotate: '-90deg', overflow: 'visible' }}>
                  <circle cx="50" cy="50" r="46" fill="none" stroke={alpha(C.INK, 0.14)} strokeWidth="1" />
                  <circle cx="50" cy="50" r="46" fill="none" stroke={C.ACCENT} strokeWidth="1.4" pathLength="1" strokeDasharray="1" strokeDashoffset={seen ? 1 - frac[u.k] : 1} style={{ transition: 'stroke-dashoffset 1s linear' }} />
                </svg>
                <span aria-hidden="true" style={{ position: 'absolute', inset: 0, rotate: `${frac[u.k] * 360}deg`, transition: 'rotate 1s linear' }}>
                  <span style={{ position: 'absolute', left: '50%', top: '4%', width: 5, height: 5, margin: '-2.5px', borderRadius: '50%', background: '#fff', boxShadow: `0 0 8px 2px ${alpha(C.ACCENT, 0.8)}` }} />
                </span>
                {R(u.v, { fontFamily: num, fontWeight: 300, fontSize: 'clamp(22px, 6.6vw, 28px)', color: C.INK })}
              </div>
              <div style={lab()}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    }
    case 'tiles':
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={{ ...pop(i), position: 'relative', padding: '16px 4px 12px', background: '#FFFFFF', border: `2px solid ${C.ACCENT}`, boxShadow: `inset 0 0 0 4px #FFFFFF, inset 0 0 0 5px ${alpha(C.ACCENT, 0.45)}, 0 10px 22px -16px ${alpha(C.ACCENT, 0.8)}` }}>
              {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y]) => (
                <span key={`${x}${y}`} aria-hidden="true" style={{ position: 'absolute', [x ? 'right' : 'left']: 5, [y ? 'bottom' : 'top']: 5, width: 6, height: 6, rotate: '45deg', background: '#E2B33C' }} />
              ))}
              {R(u.v, { fontFamily: num, fontSize: 'clamp(26px, 7.6vw, 32px)', color: C.INK })}
              <div style={lab({ marginTop: 6, color: C.ACCENT, fontSize: 9.5 })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'glass':
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={{ ...pop(i), position: 'relative', overflow: 'hidden', padding: '20px 4px 14px', borderRadius: 14, background: 'linear-gradient(160deg, rgba(255,255,255,.92), rgba(255,255,255,.45))', border: '1px solid rgba(255,255,255,.95)', boxShadow: `0 14px 30px -18px ${alpha(C.INK, 0.45)}, inset 0 1px 0 #fff` }}>
              <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 3, background: 'linear-gradient(90deg, #f5b6c8, #f7d9a0, #bfe6c8, #b8d3f5, #d7c1f2)', opacity: 0.85 }} />
              {R(u.v, { fontFamily: num, fontWeight: 200, fontSize: 'clamp(28px, 8vw, 34px)', color: C.INK })}
              <div style={lab({ marginTop: 8 })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'columns':
      return (
        <div ref={ref} className="cdx" style={{ ...row(0), borderTop: `3px double ${C.INK}`, borderBottom: `3px double ${C.INK}`, padding: '14px 0' }}>
          {units.map((u, i) => (
            <div key={u.k} style={{ ...pop(i), padding: '0 4px', borderLeft: i ? `1px solid ${alpha(C.INK, 0.35)}` : 'none' }}>
              {R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(30px, 9vw, 40px)', color: i === 0 ? C.ACCENT : C.INK })}
              <div style={lab({ marginTop: 8, color: C.INK, fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, fontSize: 13 })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'deco': {
      const step = 'polygon(0 22%, 18% 22%, 18% 10%, 36% 10%, 36% 0, 64% 0, 64% 10%, 82% 10%, 82% 22%, 100% 22%, 100% 100%, 0 100%)'
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ clipPath: step, background: `linear-gradient(180deg, ${C.ACCENT}, ${alpha(C.ACCENT, 0.5)})`, padding: 1 }}>
                <div style={{ clipPath: step, background: `linear-gradient(180deg, ${C.BG2}, ${C.BG})`, padding: '30px 2px 16px' }}>
                  {R(u.v, { fontFamily: num, fontWeight: 300, fontSize: 'clamp(26px, 7.6vw, 32px)', color: C.INK })}
                </div>
              </div>
              <div style={lab({ color: C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    }
    case 'facet':
      return (
        <div ref={ref} className="cdx" style={row(10)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', width: '76%', margin: '8px auto', aspectRatio: '1', display: 'grid', placeItems: 'center' }}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: 0, rotate: '45deg', border: `1px solid ${alpha(C.ACCENT, 0.85)}`, background: `linear-gradient(135deg, ${alpha(C.ACCENT, 0.22)}, ${alpha(C.BG2, 0.9)} 55%, ${alpha(C.ACCENT, 0.12)})`, boxShadow: `0 0 18px ${alpha(C.ACCENT, 0.25)}` }} />
                <span aria-hidden="true" style={{ position: 'absolute', inset: '22%', rotate: '45deg', border: `1px solid ${alpha(C.ACCENT, 0.3)}` }} />
                <span style={{ position: 'relative' }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(22px, 6.4vw, 27px)', color: C.INK })}</span>
              </div>
              <div style={lab({ marginTop: 14 })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'petal':
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ width: '100%', aspectRatio: '1', display: 'grid', placeItems: 'center', borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%', background: `radial-gradient(circle at 35% 30%, #fff, ${alpha(C.ACCENT, 0.18)})`, border: `1px solid ${alpha(C.ACCENT, 0.4)}`, rotate: `${[-6, 4, -3, 6][i]}deg` }}>
                {R(u.v, { fontFamily: num, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(24px, 7vw, 30px)', color: C.INK })}
              </div>
              <div style={lab({ color: C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'minimal':
      return (
        <div ref={ref} className="cdx" style={row(0)}>
          {units.map((u, i) => (
            <div key={u.k} style={{ ...pop(i), padding: '6px 2px', borderLeft: i ? `1px solid ${alpha(C.ACCENT, 0.4)}` : 'none' }}>
              {R(u.v, { fontFamily: num, fontWeight: 200, fontSize: 'clamp(34px, 10vw, 44px)', color: C.INK })}
              <div style={lab({ marginTop: 12, letterSpacing: '.3em' })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'pebble':
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ width: '100%', aspectRatio: '1 / 1.05', display: 'grid', placeItems: 'center', borderRadius: ['48% 52% 44% 56% / 55% 45% 55% 45%', '56% 44% 52% 48% / 46% 56% 44% 54%', '44% 56% 48% 52% / 52% 44% 56% 48%', '52% 48% 56% 44% / 48% 54% 46% 52%'][i], background: 'linear-gradient(160deg, #FFFFFF, ' + C.BG2 + ')', border: `1px solid ${alpha(C.ACCENT, 0.3)}`, boxShadow: `inset 0 -6px 12px ${alpha(C.INK, 0.08)}, 0 10px 18px -12px ${alpha(C.INK, 0.45)}` }}>
                {R(u.v, { fontFamily: num, fontSize: 'clamp(24px, 7vw, 30px)', color: C.INK })}
              </div>
              <div style={lab({ color: C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'vinyl':
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', display: 'grid', placeItems: 'center' }}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'repeating-radial-gradient(circle, #121010 0 2px, #1d1a18 2px 3px)', boxShadow: `0 6px 14px -6px #000, inset 0 0 0 1px ${alpha(C.ACCENT, 0.25)}`, animation: `cdx-spin ${6 + i}s linear infinite` }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 20deg, transparent 0 10%, rgba(255,255,255,.08) 12%, transparent 16% 60%, rgba(255,255,255,.06) 62%, transparent 66%)' }} />
                </span>
                <span style={{ position: 'relative', display: 'grid', placeItems: 'center', width: '58%', aspectRatio: '1', borderRadius: '50%', background: C.ACCENT, color: C.BG }}>
                  {R(u.v, { fontFamily: num, fontSize: 'clamp(16px, 4.6vw, 20px)', color: C.BG })}
                </span>
              </div>
              <div style={lab()}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'marquee':
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', padding: 7, borderRadius: 6, background: alpha(C.ACCENT, 0.18) }}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 6, background: `radial-gradient(circle, #ffe7b0 0 1.6px, transparent 2.4px) 0 0 / 9px 9px`, animation: `cdx-bulb 1.6s ease-in-out ${i * 0.2}s infinite` }} />
                <div style={{ position: 'relative', padding: '14px 2px 12px', borderRadius: 3, background: `linear-gradient(180deg, ${C.BG2}, ${C.BG})`, boxShadow: `0 0 16px ${alpha(C.ACCENT, 0.35)}` }}>
                  {R(u.v, { fontFamily: num, fontWeight: 600, fontSize: 'clamp(24px, 7vw, 30px)', color: C.INK })}
                </div>
              </div>
              <div style={lab({ color: C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'flap':
      return (
        <div ref={ref} className="cdx" style={row(6)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', overflow: 'hidden', padding: '14px 2px', borderRadius: 5, background: 'linear-gradient(180deg, #0B1626 0 50%, #070F1B 50% 100%)', border: `1px solid ${alpha(C.ACCENT, 0.35)}`, boxShadow: '0 10px 18px -10px #000' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(0,0,0,.55)' }} />
                <span key={u.v} style={{ display: 'inline-block', fontFamily: num, fontWeight: 500, fontSize: 'clamp(26px, 7.6vw, 32px)', lineHeight: 1, color: '#F7E7C6', fontVariantNumeric: 'tabular-nums', transformOrigin: '50% 50%', animation: 'cdx-flap .45s cubic-bezier(.3,.7,.3,1)' }}>{u.v}</span>
              </div>
              <div style={lab({ color: C.ACCENT, letterSpacing: '.18em' })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'stack':
      return (
        <div ref={ref} className="cdx" style={{ maxWidth: 380 }}>
          {units.map((u, i) => (
            <div key={u.k} style={{ ...pop(i), display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderTop: `1px solid ${alpha(C.INK, i ? 0.18 : 0.6)}` }}>
              {R(u.v, { fontFamily: num, fontWeight: 300, fontSize: i ? 'clamp(44px, 13vw, 58px)' : 'clamp(64px, 19vw, 84px)', letterSpacing: '-.03em', color: C.INK })}
              <span style={{ fontFamily: caps, fontSize: 11.5, letterSpacing: '.24em', textTransform: 'uppercase', color: C.MUTE }}>{u.label}</span>
            </div>
          ))}
        </div>
      )
    case 'crest':
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', padding: '22px 2px 14px', border: `1px solid ${alpha(C.ACCENT, 0.7)}`, boxShadow: `inset 0 0 0 4px ${C.BG}, inset 0 0 0 5px ${alpha(C.ACCENT, 0.35)}`, background: `linear-gradient(180deg, ${alpha(C.ACCENT, 0.08)}, transparent)` }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: -9, translate: '-50% 0', padding: '0 4px', background: C.BG, color: C.ACCENT, fontSize: 13, lineHeight: '18px' }}>♛</span>
                {R(u.v, { fontFamily: num, fontSize: 'clamp(26px, 7.6vw, 32px)', color: C.INK })}
              </div>
              <div style={lab({ color: C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'star8':
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', display: 'grid', placeItems: 'center' }}>
                {[0, 45].map((r) => (
                  <span key={r} aria-hidden="true" style={{ position: 'absolute', inset: '15%', rotate: `${seen ? r : 0}deg`, border: `1px solid ${alpha(C.ACCENT, 0.85)}`, background: alpha(C.NAR || C.BG2, 0.55), transition: `rotate 1.6s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.12}s` }} />
                ))}
                <span style={{ position: 'relative' }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(20px, 6vw, 25px)', color: C.INK })}</span>
              </div>
              <div style={lab({ marginTop: 6, color: C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    default:
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              {R(u.v, { fontFamily: num, fontSize: 32, color: light ? C.INK : C.INK })}
              <div style={lab()}>{u.label}</div>
            </div>
          ))}
        </div>
      )
  }
}
