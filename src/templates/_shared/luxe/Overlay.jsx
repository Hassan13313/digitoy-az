import { alpha } from '../useInvitation'

/* ─────────────────────────────────────────────────────────────────────────────
   AÇILIŞ ÖRTÜKLƏRİ — fotonun ÜSTÜNDƏ, yalnız açılış ekranında (2026-11, xına seriyası)

   cfg.opening.overlay = { kind, ...rənglər }
     veil   Red Veil  — şəffaf qırmızı örpək, qızılı buta tikməsi; toxunanda yuxarı qalxır
     fold   Kəlağayı  — qatlanmış kəlağayının dörd ucu kənarlara açılır
     henna  Henna Buta — xına mandalası xətt-xətt çəkilir, toxunanda böyüyüb əriyir
     embers Xonça     — şamlardan qalxan qığılcımlar
   Admin öz örtük şəklini qoysa da örtük işləyir (foto ilə bağlı nöqtəsi yoxdur).
   ───────────────────────────────────────────────────────────────────────── */

export const OVERLAY_CSS = `
@keyframes lxo-sway { 0%,100% { transform: skewX(0deg) } 50% { transform: skewX(-1.2deg) } }
@keyframes lxo-rise { 0% { opacity: 0; translate: 0 0 } 15% { opacity: 1 } 100% { opacity: 0; translate: var(--dx) -46svh } }
@keyframes lxo-draw { to { stroke-dashoffset: 0 } }
@media (prefers-reduced-motion: reduce) { [data-lxo] * { animation: none !important; } }
`

const BUTA = 'M12 38c-7 0-11-6-11-12 0-9 8-15 13-19 2-2 4-3 6-2 2 2-1 4-2 5 4 4 6 10 6 15 0 8-5 13-12 13z'
const butaTile = (color, op, w = 64, h = 80) => `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 64 80'>${[[6, 0], [38, 40]].map(([x, y]) => `<g transform='translate(${x} ${y})' fill='none' stroke='${color}' stroke-opacity='${op}' stroke-width='1.1'><path d='${BUTA}'/><circle cx='12' cy='26' r='2' fill='${color}' fill-opacity='${op}' stroke='none'/></g>`).join('')}<g fill='${color}' fill-opacity='${op}'><circle cx='52' cy='14' r='1.3'/><circle cx='20' cy='60' r='1.3'/></g></svg>`,
)}")`

/* Kəlağayı basma naxışı: zəfəran fon üzərində sıx, kiçik butalar (qırmızı və indigo növbə ilə) */
const printTile = (o) => `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'>`
  + `<g transform='translate(3 2) scale(.42)'><path d='${BUTA}' fill='${o.crimson}' fill-opacity='.78'/><path d='${BUTA}' fill='none' stroke='${o.light}' stroke-opacity='.7' stroke-width='2.4' transform='translate(4 7) scale(.66)'/></g>`
  + `<g transform='translate(25 24) scale(.42) rotate(180 12 22)'><path d='${BUTA}' fill='${o.indigo}' fill-opacity='.72'/><path d='${BUTA}' fill='none' stroke='${o.light}' stroke-opacity='.7' stroke-width='2.4' transform='translate(4 7) scale(.66)'/></g>`
  + `<g fill='${o.crimson}' fill-opacity='.5'><circle cx='34' cy='8' r='1.3'/><circle cx='12' cy='34' r='1.3'/></g><g fill='${o.indigo}' fill-opacity='.45'><circle cx='38' cy='14' r='.9'/><circle cx='6' cy='28' r='.9'/></g></svg>`,
)}")`

function Veil({ o, go, t }) {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', left: '-6%', right: '-6%', top: '-4%', height: '110%', transformOrigin: '50% 0',
      transform: go ? 'translateY(-115%) scaleY(.82)' : 'none', opacity: go ? 0.4 : 1,
      transition: t('transform 2.7s cubic-bezier(.72,0,.25,1) .05s, opacity 2.4s ease .4s'),
    }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '0 0 50% 50% / 0 0 5% 5%',
        background: [
          'repeating-linear-gradient(90deg, rgba(0,0,0,.20) 0%, rgba(255,255,255,.05) 4%, rgba(0,0,0,.14) 9%, rgba(0,0,0,.03) 14%, rgba(0,0,0,.2) 19%)',
          butaTile(o.gold, 0.38),
          `linear-gradient(180deg, ${alpha(o.color, 0.9)} 0%, ${alpha(o.color, 0.74)} 55%, ${alpha(o.color, 0.88)} 100%)`,
        ].join(', '),
        animation: go ? undefined : 'lxo-sway 6s ease-in-out infinite', transformOrigin: '50% 0',
      }} />
      {/* qızılı tikmə haşiyəsi və saçaq */}
      <div style={{ position: 'absolute', left: '4%', right: '4%', bottom: '3.4%', height: 16, borderTop: `1px solid ${alpha(o.gold, 0.9)}`, borderBottom: `1px solid ${alpha(o.gold, 0.9)}`, background: `repeating-linear-gradient(90deg, ${alpha(o.gold, 0.85)} 0 6px, transparent 6px 12px)`, backgroundSize: '100% 2px', backgroundPosition: '0 50%', backgroundRepeat: 'repeat-x' }} />
      <div style={{ position: 'absolute', left: '4%', right: '4%', bottom: 'calc(3.4% - 14px)', height: 14, background: `radial-gradient(circle at 50% 30%, ${o.gold} 0 2.4px, transparent 2.8px) 0 0 / 14px 14px repeat-x` }} />
    </div>
  )
}

function Fold({ o, go, t }) {
  const flaps = [
    { clip: 'polygon(0 0, 100% 0, 50% 50%)', to: 'translateY(-70%) rotateX(55deg)', d: 0 },
    { clip: 'polygon(100% 0, 100% 100%, 50% 50%)', to: 'translateX(70%) rotateY(55deg)', d: 0.12 },
    { clip: 'polygon(0 100%, 100% 100%, 50% 50%)', to: 'translateY(70%) rotateX(-55deg)', d: 0.24 },
    { clip: 'polygon(0 0, 0 100%, 50% 50%)', to: 'translateX(-70%) rotateY(-55deg)', d: 0.36 },
  ]
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, perspective: 1100 }}>
      {flaps.map((f, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0, clipPath: f.clip, transform: go ? f.to : 'none', opacity: go ? 0 : 1,
          background: [
            'linear-gradient(115deg, transparent 30%, rgba(255,255,255,.28) 45%, transparent 60%)',
            printTile(o),
            `radial-gradient(70% 60% at 50% 50%, ${o.light}, ${o.saffron})`,
          ].join(', '),
          boxShadow: 'inset 0 0 60px rgba(0,0,0,.25)',
          transition: t(`transform 2.1s cubic-bezier(.7,0,.25,1) ${f.d}s, opacity 1.6s ease ${0.5 + f.d}s`),
        }} />
      ))}
      {/* ortadakı romb medalyon */}
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', left: '50%', top: '50%', width: '58vmin', translate: '-50% -50%', overflow: 'visible', opacity: go ? 0 : 1, scale: go ? '1.6' : '1', transition: t('opacity 1s, scale 2s cubic-bezier(.7,0,.25,1)') }}>
        <path d="M50 2L98 50L50 98L2 50Z" fill={o.crimson} />
        <path d="M50 9L91 50L50 91L9 50Z" fill="none" stroke={o.light} strokeWidth="1.2" strokeDasharray="2 2" />
        <path d="M50 16L84 50L50 84L16 50Z" fill={o.indigo} />
        <path d="M50 24L76 50L50 76L24 50Z" fill={o.saffron} />
        {[0, 90, 180, 270].map((r) => <path key={r} d={BUTA} transform={`rotate(${r} 50 50) translate(44 27) scale(.42)`} fill={o.crimson} />)}
        <circle cx="50" cy="50" r="3" fill={o.indigo} />
      </svg>
      {/* qat xətləri */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: go ? 0 : 0.55, transition: t('opacity .6s') }}>
        <path d="M0 0L100 100M100 0L0 100" stroke={o.crimson} strokeWidth=".25" vectorEffect="non-scaling-stroke" fill="none" />
      </svg>
      {/* üç rəngli haşiyə */}
      <div style={{ position: 'absolute', inset: 14, border: '6px solid transparent', borderImage: `linear-gradient(90deg, ${o.crimson} 0 33.3%, ${o.saffron} 33.3% 66.6%, ${o.indigo} 66.6% 100%) 1`, opacity: go ? 0 : 0.9, transition: t('opacity .7s') }} />
    </div>
  )
}

function Henna({ o, go, t, instant }) {
  const petals = (n, r, len, w) => Array.from({ length: n }, (_, k) => (
    <path key={`${r}-${k}`} d={`M100 ${100 - r}c${w} ${-len * 0.4} ${w} ${-len * 0.8} 0 ${-len}c${-w} ${len * 0.2} ${-w} ${len * 0.6} 0 ${len}z`}
      transform={`rotate(${(360 / n) * k} 100 100)`} pathLength="1" strokeDasharray="1" strokeDashoffset="1"
      style={{ animation: instant ? undefined : `lxo-draw 1.1s ease ${(0.25 + k * 0.06 + r / 160).toFixed(2)}s forwards` }} />
  ))
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
      background: `radial-gradient(70% 55% at 50% 52%, ${alpha(o.cream, 0.82)}, ${alpha(o.cream, 0.55)} 70%, ${alpha(o.cream, 0.25)})`,
      opacity: go ? 0 : 1, transform: go ? 'scale(1.35)' : 'none', transition: t('opacity 1.8s ease .3s, transform 2.4s cubic-bezier(.3,0,.2,1)'),
    }}>
      <svg viewBox="0 0 200 200" style={{ width: 'min(78vw, 360px)', overflow: 'visible', marginTop: '6svh' }} fill="none" stroke={o.henna} strokeWidth="1.1" strokeLinecap="round">
        <circle cx="100" cy="100" r="7" fill={o.henna} stroke="none" />
        <circle cx="100" cy="100" r="16" pathLength="1" strokeDasharray="1" strokeDashoffset="1" style={{ animation: instant ? undefined : 'lxo-draw 1s ease .1s forwards' }} />
        {petals(8, 18, 22, 8)}
        <circle cx="100" cy="100" r="44" strokeDasharray="1.2 3.4" />
        {petals(16, 48, 28, 7)}
        {petals(24, 80, 18, 5)}
        <circle cx="100" cy="100" r="98" strokeDasharray="0.6 4" />
      </svg>
    </div>
  )
}

function Embers({ o, go, t }) {
  const sparks = [[0.18, 0, 6], [0.3, 1.4, -10], [0.42, 0.6, 8], [0.5, 2.2, -4], [0.58, 0.3, 12], [0.66, 1.8, -8], [0.76, 1, 6], [0.36, 2.8, 10], [0.62, 3.2, -12], [0.24, 3.6, 4], [0.7, 2.6, 2], [0.46, 4, -6]]
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: go ? 0 : 1, transition: t('opacity 1.6s') }}>
      {sparks.map(([x, d, dx], i) => (
        <span key={i} style={{
          position: 'absolute', left: `${x * 100}%`, top: o.from || '58%', width: i % 3 ? 3 : 4, height: i % 3 ? 3 : 4, borderRadius: '50%',
          background: '#FFE3A1', boxShadow: `0 0 8px 2px ${alpha(o.glow || '#FFB347', 0.8)}`, '--dx': `${dx}vw`, opacity: 0,
          animation: `lxo-rise ${4.2 + (i % 4) * 0.7}s ease-out ${d}s infinite`,
        }} />
      ))}
    </div>
  )
}

export default function Overlay({ o, go, instant }) {
  const t = (v) => (instant ? 'none' : v)
  const props = { o, go, t, instant }
  return (
    <div data-lxo style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {o.kind === 'veil' && <Veil {...props} />}
      {o.kind === 'fold' && <Fold {...props} />}
      {o.kind === 'henna' && <Henna {...props} />}
      {o.kind === 'embers' && <Embers {...props} />}
    </div>
  )
}
