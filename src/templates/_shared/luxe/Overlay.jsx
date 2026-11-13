import { alpha } from '../useInvitation'
import { EXTRA_OVERLAYS, EXTRA_OVERLAY_CSS } from './overlays'

/* ─────────────────────────────────────────────────────────────────────────────
   AÇILIŞ ÖRTÜKLƏRİ — fotonun ÜSTÜNDƏ, yalnız açılış ekranında (2026-11, xına seriyası)

   cfg.opening.overlay = { kind, ...rənglər }
     veil   Red Veil  — şəffaf qırmızı örpək, qızılı buta tikməsi; toxunanda yuxarı qalxır
     fold   Kəlağayı  — qatlanmış kəlağayının dörd ucu kənarlara açılır
     henna  Henna Buta — xına mandalası xətt-xətt çəkilir, toxunanda böyüyüb əriyir
     embers Xonça     — şamlardan qalxan qığılcımlar
     curtain Little Prince — qızılı saçaqlı məxmər pərdələr iki yana açılır
     burst  Hero Comic — rastr nöqtəli komiks səhifəsi, «BAM!» partlayışı, səhifə çəp xətlə ikiyə bölünür
     nazar  Maşallah   — göz muncuğu: foto bəbəkdən görünür, muncuq böyüyüb əriyir
     clouds Little Pilot — buludlar iki yana çəkilir, kiçik təyyarə keçir
     flood  Football Star — stadion projektorları bir-bir yanır, qaranlıq çəkilir
   Admin öz örtük şəklini qoysa da örtük işləyir (foto ilə bağlı nöqtəsi yoxdur).
   ───────────────────────────────────────────────────────────────────────── */

export const OVERLAY_CSS = `
@keyframes lxo-sway { 0%,100% { transform: skewX(0deg) } 50% { transform: skewX(-1.2deg) } }
@keyframes lxo-rise { 0% { opacity: 0; translate: 0 0 } 15% { opacity: 1 } 100% { opacity: 0; translate: var(--dx) -46svh } }
@keyframes lxo-draw { to { stroke-dashoffset: 0 } }
@keyframes lxo-fly { from { translate: -30vw 0 } to { translate: 130vw -8svh } }
@keyframes lxo-pop { 0% { scale: 0; rotate: -18deg } 60% { scale: 1.12; rotate: 4deg } 100% { scale: 1; rotate: -4deg } }
@keyframes lxo-glint { 0%, 50% { translate: -140% 0 } 100% { translate: 140% 0 } }
@keyframes lxo-on { 0% { opacity: 0 } 30% { opacity: 1 } 40% { opacity: .5 } 55%, 100% { opacity: 1 } }
@keyframes lxo-drift { 0%,100% { translate: 0 0 } 50% { translate: 1.5vw 0 } }
@media (prefers-reduced-motion: reduce) { [data-lxo] * { animation: none !important; } }
` + EXTRA_OVERLAY_CSS

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

function Curtain({ o, go, t }) {
  const side = (left) => ({
    position: 'absolute', top: 0, bottom: 0, width: '52%', [left ? 'left' : 'right']: 0,
    transform: go ? `translateX(${left ? '-104%' : '104%'}) skewX(${left ? 4 : -4}deg)` : 'none', transformOrigin: left ? '0 0' : '100% 0',
    transition: t('transform 2.6s cubic-bezier(.72,0,.25,1) .05s'),
    background: [
      `repeating-linear-gradient(90deg, rgba(0,0,0,.32) 0, rgba(255,255,255,.07) 3.5%, rgba(0,0,0,.18) 7%, rgba(0,0,0,.36) 10%)`,
      `linear-gradient(180deg, ${o.color}, ${alpha(o.color, 0.92)} 70%, ${o.deep || o.color})`,
    ].join(', '),
    boxShadow: left ? 'inset -18px 0 30px rgba(0,0,0,.45)' : 'inset 18px 0 30px rgba(0,0,0,.45)',
  })
  const fringe = { position: 'absolute', bottom: 0, left: 0, right: 0, height: 22, background: `repeating-linear-gradient(90deg, ${o.gold} 0 2px, transparent 2px 6px)`, borderTop: `3px solid ${o.gold}` }
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <div style={side(true)}><div style={fringe} /></div>
      <div style={side(false)}><div style={fringe} /></div>
      {/* üst qızılı karniz */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '11svh', background: `radial-gradient(60% 120% at 50% 0%, ${alpha(o.color, 0.96)}, ${o.deep || o.color})`, borderBottom: `2px solid ${o.gold}`, boxShadow: `0 6px 20px rgba(0,0,0,.4)`, transform: go ? 'translateY(-110%)' : 'none', transition: t('transform 1.6s cubic-bezier(.7,0,.25,1) 1s') }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: -9, height: 9, background: `radial-gradient(circle at 50% 0, ${o.gold} 0 3px, transparent 3.5px) 0 0 / 18px 9px repeat-x` }} />
      </div>
    </div>
  )
}

function Burst({ o, go, t, instant }) {
  const half = (clip, to) => ({
    position: 'absolute', inset: 0, clipPath: clip, transform: go ? to : 'none', transition: t('transform 1.7s cubic-bezier(.7,0,.25,1) .35s'),
    background: [`radial-gradient(${alpha(o.ink, 0.22)} 1.6px, transparent 2px) 0 0 / 11px 11px`, `linear-gradient(160deg, ${o.sky}, ${o.blue})`].join(', '),
  })
  const pts = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; const r = i % 2 ? 30 : 48; return `${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}` }).join(' ')
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <div style={half('polygon(0 0, 100% 0, 100% 38%, 0 62%)', 'translate(-8%, -105%) rotate(-6deg)')} />
      <div style={half('polygon(0 62%, 100% 38%, 100% 100%, 0 100%)', 'translate(8%, 105%) rotate(-6deg)')} />
      <div style={{ position: 'absolute', left: '-10%', right: '-10%', top: '50%', height: 6, background: o.ink, rotate: '-13.6deg', opacity: go ? 0 : 1, transition: t('opacity .3s .3s') }} />
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', left: '50%', top: '52%', width: '86vmin', translate: '-50% -50%', overflow: 'visible', opacity: go ? 0 : 1, scale: go ? '1.8' : '1', transition: t('opacity .5s .2s, scale .7s') }}>
        <g style={{ transformOrigin: '50px 50px', animation: instant ? undefined : 'lxo-pop .7s cubic-bezier(.3,1.6,.5,1) .3s both' }}>
          <polygon points={pts} fill={o.red} stroke={o.ink} strokeWidth="1.6" strokeLinejoin="round" />
          <polygon points={pts} fill={o.yellow} stroke={o.ink} strokeWidth="1.2" strokeLinejoin="round" transform="translate(50 50) scale(.78) translate(-50 -50)" />
          <text x="50" y="55" textAnchor="middle" fontFamily={o.font} fontWeight="900" fontSize="14.5" fill={o.red} stroke={o.ink} strokeWidth="1.1" paintOrder="stroke" transform="rotate(-8 50 50)">{o.word || 'BAM!'}</text>
        </g>
      </svg>
    </div>
  )
}

function Nazar({ o, go, t }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: '320vmax', height: '320vmax', translate: '-50% -50%', borderRadius: '50%',
        background: `radial-gradient(circle, transparent 0 13.5vmin, ${o.pupil} 13.6vmin 15.5vmin, ${o.white} 15.6vmin 24vmin, ${o.turq} 24.1vmin 31vmin, ${o.cobalt} 31.1vmin 45vmin, ${alpha(o.cobalt, 0.35)} 45.6vmin, ${o.bg} 47vmin)`,
        transform: go ? 'scale(5)' : 'scale(1)', opacity: go ? 0 : 1, transition: t('transform 2.6s cubic-bezier(.7,0,.25,1), opacity 1.4s ease 1.1s'),
      }} />
      {/* şüşə parıltısı */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: '92vmin', height: '92vmin', translate: '-50% -50%', borderRadius: '50%', overflow: 'hidden', opacity: go ? 0 : 1, transition: t('opacity .6s') }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(40% 30% at 32% 26%, rgba(255,255,255,.55), transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 38%, rgba(255,255,255,.45) 50%, transparent 62%)', animation: 'lxo-glint 3.6s ease-in-out infinite' }} />
      </div>
    </div>
  )
}

const CLOUD = 'M20 60c-11 0-18-8-18-17 0-10 8-17 18-17 3-12 13-20 25-20 13 0 23 9 26 21 2-1 4-1 6-1 10 0 19 8 19 17 0 10-9 17-19 17z'
function Clouds({ o, go, t, instant }) {
  const puffs = [[-6, 8, 70, 0], [40, 2, 80, 1], [-10, 30, 90, 0], [42, 36, 84, 1], [-4, 58, 86, 0], [38, 66, 92, 1], [10, 84, 80, 0], [50, 90, 70, 1], [16, 20, 60, 1], [12, 46, 66, 0]]
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.sky, 0.55), transition: t('background 1.6s') }}>
      {puffs.map(([x, y, w, r], i) => (
        <svg key={i} viewBox="0 0 100 64" style={{
          position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${w}vw`, translate: '0 -50%', overflow: 'visible',
          transform: go ? `translateX(${r ? 110 : -110}vw)` : 'none', transition: t(`transform ${2 + (i % 3) * 0.3}s cubic-bezier(.6,0,.3,1) ${(i % 4) * 0.08}s`),
          filter: 'drop-shadow(0 10px 18px rgba(40,80,120,.18))',
        }}>
          <path d={CLOUD} fill="#fff" style={{ animation: instant ? undefined : `lxo-drift ${6 + i}s ease-in-out infinite` }} />
        </svg>
      ))}
      {!instant && (
        <svg viewBox="0 0 60 24" style={{ position: 'absolute', left: 0, top: '30%', width: 70, animation: 'lxo-fly 5.5s linear .4s infinite' }}>
          <path d="M4 12h40l10-4 2 2-6 4H8z" fill={o.red} />
          <path d="M22 4l10 0-4 8h-8zM22 20l10 0-4-8h-8z" fill={o.red} opacity=".85" />
          <circle cx="56" cy="11" r="2" fill="#333" />
        </svg>
      )}
    </div>
  )
}

function Flood({ o, go, t, instant }) {
  const lamps = [[14, 7, 0.3], [86, 7, 0.9], [4, 22, 1.5], [96, 22, 2.1]]
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${alpha('#000000', 0.82)}, ${alpha('#000000', 0.6)})`, opacity: go ? 0 : 1, transition: t('opacity 1.6s ease .5s') }}>
      {lamps.map(([x, y, d], i) => (
        <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, translate: '-50% -50%', opacity: instant ? 1 : 0, animation: instant ? undefined : `lxo-on .9s ease ${d}s forwards` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 7px)', gap: 3, padding: 4, background: '#1b1f24', borderRadius: 3 }}>
            {Array.from({ length: 12 }, (_, k) => <span key={k} style={{ width: 7, height: 7, borderRadius: 2, background: '#FFFBEA', boxShadow: '0 0 8px 2px rgba(255,248,210,.9)' }} />)}
          </div>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '120vw', height: '120vw', translate: '-50% -50%', background: `radial-gradient(circle, ${alpha(o.glow || '#FFF6D0', 0.5)}, transparent 45%)`, pointerEvents: 'none' }} />
        </div>
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
      {o.kind === 'curtain' && <Curtain {...props} />}
      {o.kind === 'burst' && <Burst {...props} />}
      {o.kind === 'nazar' && <Nazar {...props} />}
      {o.kind === 'clouds' && <Clouds {...props} />}
      {o.kind === 'flood' && <Flood {...props} />}
      {o.kind in EXTRA_OVERLAYS && EXTRA_OVERLAYS[o.kind](props)}
    </div>
  )
}
