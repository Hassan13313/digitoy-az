import { useInView } from '../viralHooks'
import { Roll } from '../viral'
import { alpha } from '../useInvitation'
import { EXTRA_COUNTDOWNS, EXTRA_COUNTDOWN_CSS } from './countdowns'

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
     velvet   Red Veil        — məxmər medalyon, qızılı tikiş, buta
     candle   Xonça           — hər rəqəmin üstündə yanan şam alovu
     mandala  Henna Buta      — yavaş fırlanan xına mandalası
     mirror   Mirror & Candle — oval zər güzgü, üzərindən parıltı keçir
     rhomb    Kəlağayı        — romb lövhə, üç rəngli haşiyə
     shield   Little Prince   — zər haşiyəli qalxan, üstündə tac
     comic    Hero Comic      — çəp komiks panelləri, rastr nöqtə, qalın kontur
     nazar    Maşallah        — göz muncuğu halqaları, ortada rəqəm
     gauge    Little Pilot    — kokpit cihazları, əqrəb vaxtla dönür
     led      Football Star   — stadion LED tablosu, nöqtəli işıq rəqəmlər
   `cd` — useCountdown nəticəsi (days, hours, minutes, seconds, labels).
   ───────────────────────────────────────────────────────────────────────── */

export const COUNTDOWN_CSS = `
@keyframes cdx-spin { to { rotate: 360deg } }
@keyframes cdx-flap { from { transform: perspective(300px) rotateX(-90deg); opacity: .3 } to { transform: none; opacity: 1 } }
@keyframes cdx-bulb { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
@keyframes cdx-flame { 0%,100% { transform: scale(1, 1) rotate(-2deg) } 35% { transform: scale(.92, 1.08) rotate(2deg) } 70% { transform: scale(1.04, .95) rotate(-1deg) } }
@keyframes cdx-glint { 0%, 55% { translate: -160% 0 } 100% { translate: 160% 0 } }
@keyframes cdx-pop { from { opacity: 0; scale: .6 } to { opacity: 1; scale: 1 } }
@media (prefers-reduced-motion: reduce) { .cdx * { animation: none !important; transition: none !important; } }
` + EXTRA_COUNTDOWN_CSS

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

  if (EXTRA_COUNTDOWNS[kind]) return <div ref={ref}>{EXTRA_COUNTDOWNS[kind]({ seen, units, R, lab, row, pop, C, num, caps, cd, alpha })}</div>
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
    case 'velvet':
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '50%', display: 'grid', placeItems: 'center', background: `radial-gradient(circle at 40% 30%, ${C.VEL || C.ACCENT}, ${C.BG} 92%)`, boxShadow: `inset 0 0 0 3px ${alpha(C.BG, 0.6)}, 0 8px 22px ${alpha('#000000', 0.35)}` }}>
                <svg aria-hidden="true" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, overflow: 'visible', rotate: seen ? '0deg' : '-60deg', transition: `rotate 1.8s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.12}s` }}>
                  <circle cx="50" cy="50" r="44" fill="none" stroke={C.GOLD || C.ACCENT} strokeWidth="1.1" strokeDasharray="3 2.4" />
                  <circle cx="50" cy="50" r="48" fill="none" stroke={alpha(C.GOLD || C.ACCENT, 0.5)} strokeWidth=".6" />
                  <path d="M50 3c-2.4 0-4 1.8-4 4 0 2.6 2.6 3.6 4 6 1.4-2.4 4-3.4 4-6 0-2.2-1.6-4-4-4z" fill={C.GOLD || C.ACCENT} />
                </svg>
                <span style={{ position: 'relative' }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(22px, 6.6vw, 28px)', color: C.GOLD_L || C.INK })}</span>
              </div>
              <div style={lab({ color: C.GOLD || C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'candle':
      return (
        <div ref={ref} className="cdx" style={row(10)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', height: 34 }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: 2, width: 13, height: 24, marginLeft: -6.5, borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%', background: 'radial-gradient(circle at 50% 72%, #FFF6D8 0 22%, #FFD27A 40%, #F08A2A 74%, transparent 76%)', boxShadow: '0 0 18px 6px rgba(255,190,90,.35)', transformOrigin: '50% 100%', opacity: seen ? 1 : 0, transition: `opacity .8s ${0.5 + i * 0.25}s`, animation: `cdx-flame ${1.6 + i * 0.2}s ease-in-out infinite` }} />
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: 0, width: 1.5, height: 6, marginLeft: -0.75, background: alpha(C.INK, 0.7) }} />
              </div>
              <div style={{ padding: '12px 2px 10px', borderRadius: '6px 6px 2px 2px', background: `linear-gradient(180deg, ${alpha(C.INK, 0.12)}, ${alpha(C.INK, 0.04)})`, border: `1px solid ${alpha(C.ACCENT, 0.45)}`, boxShadow: `inset 0 10px 18px -12px rgba(255,200,120,.6)` }}>
                {R(u.v, { fontFamily: num, fontSize: 'clamp(24px, 7vw, 30px)', color: C.INK })}
              </div>
              <div aria-hidden="true" style={{ height: 6, margin: '0 -4px', borderRadius: '0 0 50% 50%', background: `linear-gradient(90deg, ${C.ACCENT}, ${alpha(C.ACCENT, 0.5)}, ${C.ACCENT})` }} />
              <div style={lab({ color: C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'mandala':
      return (
        <div ref={ref} className="cdx" style={row(6)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', display: 'grid', placeItems: 'center' }}>
                <svg aria-hidden="true" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, overflow: 'visible', animation: `cdx-spin ${60 + i * 12}s linear infinite` }}>
                  {Array.from({ length: 12 }, (_, k) => (
                    <path key={k} d="M50 2c5 6 6 12 0 18-6-6-5-12 0-18z" fill="none" stroke={C.ACCENT} strokeWidth="1" transform={`rotate(${k * 30} 50 50)`} pathLength="1" strokeDasharray="1" strokeDashoffset={seen ? 0 : 1} style={{ transition: `stroke-dashoffset 1.4s ease ${0.2 + i * 0.12 + k * 0.05}s` }} />
                  ))}
                  <circle cx="50" cy="50" r="27" fill="none" stroke={alpha(C.ACCENT, 0.7)} strokeWidth=".8" strokeDasharray="1 3" />
                </svg>
                <span style={{ position: 'relative' }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(20px, 5.8vw, 25px)', color: C.INK })}</span>
              </div>
              <div style={lab({ marginTop: 6 })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'mirror':
      return (
        <div ref={ref} className="cdx" style={row(10)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', aspectRatio: '3 / 4', borderRadius: '50%', padding: 4, background: `conic-gradient(from 210deg, #8C6A2A, ${C.ACCENT}, #B8913F, #FFF1C4, #9C7A34, ${C.ACCENT}, #8C6A2A)` }}>
                <div style={{ position: 'relative', height: '100%', borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center', background: `radial-gradient(80% 70% at 40% 30%, ${alpha('#FFF6E2', 0.22)}, ${C.BG2} 60%, ${C.BG})` }}>
                  <span aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, transparent 35%, rgba(255,246,220,.35) 50%, transparent 65%)', animation: `cdx-glint 5s ease-in-out ${i * 0.6}s infinite` }} />
                  <span style={{ position: 'relative' }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(22px, 6.4vw, 28px)', color: C.INK })}</span>
                </div>
              </div>
              <div style={lab({ color: C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'rhomb': {
      const band = `linear-gradient(90deg, ${C.CRIMSON || C.ACCENT} 0 33.3%, ${C.SAFFRON || C.ACCENT} 33.3% 66.6%, ${C.INDIGO || C.INK} 66.6% 100%)`
      return (
        <div ref={ref} className="cdx" style={row(6)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', display: 'grid', placeItems: 'center' }}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: '14%', rotate: seen ? '45deg' : '0deg', padding: 3, background: band, transition: `rotate 1.4s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.12}s` }}>
                  <span style={{ display: 'block', height: '100%', background: C.BG2, boxShadow: `inset 0 0 0 2px ${C.BG2}, inset 0 0 0 3px ${alpha(C.SAFFRON || C.ACCENT, 0.6)}` }} />
                </span>
                <span style={{ position: 'relative' }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(20px, 5.8vw, 25px)', color: C.INK })}</span>
              </div>
              <div style={lab({ marginTop: 4, color: C.CRIMSON || C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    }
    case 'shield':
      return (
        <div ref={ref} className="cdx" style={row(10)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', paddingTop: 12 }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, translate: '-50% 0', zIndex: 1, color: C.ACCENT, fontSize: 15, lineHeight: 1, textShadow: `0 0 8px ${alpha(C.ACCENT, 0.6)}` }}>♛</span>
                <div style={{ padding: 2, background: `linear-gradient(160deg, ${C.ACCENT}, ${alpha(C.ACCENT, 0.45)} 50%, ${C.ACCENT})`, clipPath: 'polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%)' }}>
                  <div style={{ padding: '18px 2px 30px', clipPath: 'polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%)', background: `linear-gradient(180deg, ${C.BG2}, ${C.BG})` }}>
                    {R(u.v, { fontFamily: num, fontSize: 'clamp(24px, 7vw, 30px)', color: C.INK })}
                  </div>
                </div>
              </div>
              <div style={lab({ color: C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'comic': {
      const fills = [C.RED || C.ACCENT, C.YEL || C.ACCENT, C.BLUE || C.INK, C.SKY || C.BG2]
      return (
        <div ref={ref} className="cdx" style={row(10)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{
                position: 'relative', padding: '16px 2px 12px', border: `2.5px solid ${C.INK}`, boxShadow: `4px 4px 0 ${C.INK}`, rotate: `${i % 2 ? 2.5 : -2.5}deg`,
                background: `radial-gradient(${alpha(C.INK, 0.18)} 1.2px, transparent 1.6px) 0 0 / 7px 7px, ${fills[i]}`,
              }}>
                {R(u.v, { fontFamily: num, fontWeight: 800, fontSize: 'clamp(24px, 7vw, 30px)', color: i === 1 || i === 3 ? C.INK : '#fff', textShadow: i === 1 || i === 3 ? 'none' : `2px 2px 0 ${C.INK}` })}
              </div>
              <div style={lab({ marginTop: 12, color: C.INK, fontWeight: 700 })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    }
    case 'nazar':
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{
                position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '50%', display: 'grid', placeItems: 'center', overflow: 'hidden',
                background: `radial-gradient(circle, ${C.BG2} 0 34%, ${C.TURQ || C.ACCENT} 35% 49%, #fff 50% 60%, ${C.COB || C.INK} 61%)`,
                boxShadow: `0 6px 16px ${alpha(C.COB || C.INK, 0.3)}, inset 0 -4px 10px rgba(0,0,0,.2)`,
              }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: '18%', top: '12%', width: '30%', height: '20%', borderRadius: '50%', background: 'rgba(255,255,255,.55)', filter: 'blur(2px)', rotate: '-25deg' }} />
                <span style={{ position: 'relative' }}>{R(u.v, { fontFamily: num, fontSize: 'clamp(16px, 4.6vw, 20px)', fontWeight: 600, color: C.COB || C.INK })}</span>
              </div>
              <div style={lab({ color: C.COB || C.ACCENT })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    case 'gauge': {
      const frac = { days: Math.min(cd.days / 365, 1), hours: cd.hours / 24, minutes: cd.minutes / 60, seconds: cd.seconds / 60 }
      return (
        <div ref={ref} className="cdx" style={row(8)}>
          {units.map((u, i) => (
            <div key={u.k} style={pop(i)}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '50%', display: 'grid', placeItems: 'center', background: `radial-gradient(circle at 50% 40%, ${C.DIAL || '#22384F'}, ${alpha('#000000', 0.85)})`, border: `3px solid ${alpha(C.INK, 0.25)}`, boxShadow: `inset 0 0 0 2px ${alpha('#FFFFFF', 0.15)}, 0 6px 14px ${alpha('#000000', 0.25)}` }}>
                <svg aria-hidden="true" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
                  {Array.from({ length: 12 }, (_, k) => <line key={k} x1="50" y1="8" x2="50" y2={k % 3 ? 14 : 18} stroke="#fff" strokeOpacity=".75" strokeWidth={k % 3 ? 1.2 : 2.2} transform={`rotate(${k * 30} 50 50)`} />)}
                </svg>
                <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 2.5, height: '40%', marginLeft: -1.25, transformOrigin: '50% 0', translate: '0 0', rotate: `${180 + (seen ? frac[u.k] : 0) * 360}deg`, background: C.ACCENT, borderRadius: 2, transition: 'rotate 1s cubic-bezier(.3,1.4,.5,1)' }} />
                <span style={{ position: 'relative', marginTop: '42%' }}>{R(u.v, { fontFamily: num, fontWeight: 700, fontSize: 'clamp(13px, 3.8vw, 16px)', color: '#fff' })}</span>
                <span aria-hidden="true" style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: C.ACCENT }} />
              </div>
              <div style={lab({ color: C.INK })}>{u.label}</div>
            </div>
          ))}
        </div>
      )
    }
    case 'led':
      return (
        <div ref={ref} className="cdx" style={{ maxWidth: 380, margin: '0 auto', padding: '14px 10px 12px', borderRadius: 6, background: '#050a10', border: `2px solid ${alpha(C.ACCENT, 0.5)}`, boxShadow: `0 0 0 4px #0b1520, 0 14px 30px ${alpha('#000000', 0.5)}` }}>
          <div style={row(4)}>
            {units.map((u, i) => (
              <div key={u.k} style={pop(i)}>
                <div style={{ padding: '6px 0', backgroundImage: 'radial-gradient(rgba(255,255,255,.06) 1px, transparent 1.4px)', backgroundSize: '5px 5px' }}>
                  {R(u.v, { fontFamily: num, fontWeight: 600, fontSize: 'clamp(28px, 8.4vw, 36px)', letterSpacing: '.04em', color: C.ACCENT, textShadow: `0 0 10px ${alpha(C.ACCENT, 0.75)}, 0 0 2px ${C.ACCENT}` })}
                </div>
                <div style={lab({ marginTop: 4, color: alpha('#FFFFFF', 0.7) })}>{u.label}</div>
              </div>
            ))}
          </div>
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
