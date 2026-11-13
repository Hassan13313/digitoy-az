/* eslint-disable react-refresh/only-export-components -- örtük xəritəsi: { növ: (props) => JSX } */
import { alpha } from '../../useInvitation'

/* QIZ GECƏSİ — açılış örtükləri
   pop     Pink Champagne — çəhrayı şampan köpüyü ekranı doldurur, sonra qabarcıqlar qalxıb dağılır
   disco   Disco Ball     — qaranlıqda güzgü kürə fırlanır, işıq ləkələri ekranda gəzir
   pillow  Pajama Spa     — yumşaq yastıq yellənir, toxunanda partlayır, lələklər uçur
   hatbox  Paris Night    — zolaqlı papaq qutusunun qapağı uçur, qutu aşağı düşür
   sunset  Boho Sunset    — terrakota tağ zolaqları, günəş batır və zolaqlar açılır */

export const BACH_CSS = `
@keyframes lxq-bub { 0% { opacity: 0; translate: 0 0 } 15% { opacity: 1 } 100% { opacity: 0; translate: var(--dx) -70svh } }
@keyframes lxq-spin { to { rotate: 360deg } }
@keyframes lxq-roam { 0% { translate: 0 0 } 50% { translate: 18vw 10svh } 100% { translate: -12vw 22svh } }
@keyframes lxq-wob { 0%,100% { rotate: -3deg; scale: 1 } 50% { rotate: 3deg; scale: 1.03 } }
@keyframes lxq-feather { 0% { opacity: 1; translate: 0 0; rotate: 0deg } 100% { opacity: 0; translate: var(--dx) var(--dy); rotate: 220deg } }
`

const BUB = Array.from({ length: 28 }, (_, i) => [(i * 29) % 100, (i % 9) * 0.3, ((i * 7) % 12) - 6, 6 + (i % 5) * 4])
function Pop({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${alpha(o.pink, 0.92)}, ${alpha(o.deep, 0.95)})`, clipPath: go ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)', transition: t('clip-path 1.8s cubic-bezier(.6,0,.3,1) .2s') }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '30%', background: `radial-gradient(circle at 10% 100%, #FFFFFF 0 18%, transparent 19%) 0 0 / 12vw 100%, linear-gradient(180deg, #FFF6F8, ${alpha('#FFF6F8', 0.6)})`, filter: 'blur(1px)' }} />
      {!instant && BUB.map(([x, d, dx, s], i) => <span key={i} style={{ position: 'absolute', left: `${x}%`, bottom: '-4%', width: s, height: s, borderRadius: '50%', border: `1px solid ${alpha('#FFFFFF', 0.8)}`, background: alpha('#FFFFFF', 0.25), '--dx': `${dx}vw`, opacity: 0, animation: `lxq-bub ${3 + (i % 4) * 0.6}s ease-in ${d}s infinite` }} />)}
    </div>
  )
}

const SPOTS = Array.from({ length: 14 }, (_, i) => [(i * 41) % 90, (i * 23) % 85, (i % 4) * 0.4])
function Disco({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `radial-gradient(70% 50% at 50% 30%, ${alpha(o.pink, 0.25)}, ${alpha(o.night, 0.96)} 70%)`, opacity: go ? 0 : 1, transition: t('opacity 1.6s ease .8s') }}>
      {!instant && SPOTS.map(([x, y, d], i) => <span key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 10, height: 10, borderRadius: '50%', background: i % 2 ? '#FFFFFF' : o.pink, boxShadow: `0 0 12px 4px ${alpha(i % 2 ? '#FFFFFF' : o.pink, 0.6)}`, animation: `lxq-roam ${5 + (i % 3)}s ease-in-out ${d}s infinite alternate` }} />)}
      <div style={{ position: 'absolute', left: '50%', top: 0, width: 2, height: '22%', background: alpha('#FFFFFF', 0.4) }} />
      <div style={{ position: 'absolute', left: '50%', top: '22%', width: '44vmin', height: '44vmin', translate: '-50% 0', borderRadius: '50%', overflow: 'hidden', boxShadow: `0 0 50px ${alpha(o.pink, 0.5)}`, transform: go ? 'scale(5)' : 'none', transition: t('transform 1.8s cubic-bezier(.6,0,.3,1)') }}>
        <div style={{ position: 'absolute', inset: '-20%', background: [`repeating-linear-gradient(0deg, ${alpha('#000000', 0.35)} 0 1px, transparent 1px 9%)`, `repeating-linear-gradient(90deg, ${alpha('#000000', 0.35)} 0 1px, transparent 1px 9%)`, `conic-gradient(from 0deg, #E8E8EE, #8A8A96, #FFFFFF, #6E6E7A, #F2F2F6, #9A9AA6, #E8E8EE)`].join(', '), animation: instant ? undefined : 'lxq-spin 6s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,.6), transparent 40%), radial-gradient(circle at 70% 75%, rgba(0,0,0,.35), transparent 60%)' }} />
      </div>
    </div>
  )
}

const FEATH = Array.from({ length: 16 }, (_, i) => [((i * 47) % 140) - 70, ((i * 31) % 120) - 80])
function Pillow({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.bg, 0.92), transition: t('background 1.2s .7s') }}>
      <div style={{ position: 'absolute', left: '50%', top: '52%', width: '74vmin', height: '50vmin', translate: '-50% -50%', borderRadius: '42% 42% 42% 42% / 50% 50% 50% 50%', background: `radial-gradient(circle at 40% 35%, #FFFFFF, ${o.pillow} 70%)`, boxShadow: `inset -10px -14px 30px ${alpha(o.deep, 0.3)}, 0 20px 40px ${alpha(o.deep, 0.25)}`, animation: instant || go ? undefined : 'lxq-wob 2.2s ease-in-out infinite', transform: go ? 'scale(1.4)' : 'none', opacity: go ? 0 : 1, transition: t('transform .4s ease, opacity .4s ease .2s') }}>
        <div style={{ position: 'absolute', inset: '12% 10%', borderRadius: 'inherit', border: `2px dashed ${alpha(o.deep, 0.35)}` }} />
      </div>
      {go && !instant && FEATH.map(([dx, dy], i) => (
        <svg key={i} viewBox="0 0 20 40" style={{ position: 'absolute', left: '50%', top: '52%', width: 22, '--dx': `${dx}vw`, '--dy': `${dy}svh`, animation: `lxq-feather 1.8s ease-out ${(i % 5) * 0.05}s forwards` }}>
          <path d="M10 2C16 10 16 26 10 38 4 26 4 10 10 2Z" fill="#FFFFFF" stroke={alpha(o.deep, 0.4)} strokeWidth=".6" /><path d="M10 6V38" stroke={alpha(o.deep, 0.4)} strokeWidth=".5" />
        </svg>
      ))}
    </div>
  )
}

function Hatbox({ o, go, t, instant }) {
  const stripes = `repeating-linear-gradient(90deg, ${o.black} 0 5vmin, ${o.cream} 5vmin 10vmin)`
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.bg, 0.94), transition: t('background 1.3s .8s') }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: '64vmin', height: '46vmin', translate: '-50% 0', borderRadius: '0 0 50% 50% / 0 0 14% 14%', background: stripes, boxShadow: '0 30px 50px -20px rgba(0,0,0,.45)', transform: go ? 'translateY(50svh)' : 'none', opacity: go ? 0 : 1, transition: t('transform 1.4s ease .5s, opacity 1s .7s') }} />
      <div style={{ position: 'absolute', left: '50%', top: 'calc(50% - 8vmin)', width: '70vmin', height: '12vmin', translate: '-50% 0', borderRadius: '50%', background: o.pink, boxShadow: `inset 0 -6px 0 ${alpha('#000000', 0.15)}, 0 8px 16px rgba(0,0,0,.25)`, transform: go ? 'translate(12vw, -80svh) rotate(30deg)' : 'none', transition: t('transform 1.5s cubic-bezier(.5,0,.3,1)'), animation: instant || go ? undefined : 'lxq-wob 1.8s ease-in-out infinite' }}>
        <div style={{ position: 'absolute', left: '50%', top: '-6vmin', width: '14vmin', height: '10vmin', translate: '-50% 0', borderRadius: '50% 50% 30% 30%', border: `2.4vmin solid ${o.black}`, borderBottom: 'none' }} />
      </div>
    </div>
  )
}

function Sunset({ o, go, t }) {
  const bands = o.bands
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : o.sand, transition: t('background 1.2s 1s') }}>
      <div style={{ position: 'absolute', left: '50%', top: '58%', width: '30vmin', height: '30vmin', translate: '-50% -50%', borderRadius: '50%', background: o.sun, transform: go ? 'translateY(60svh)' : 'none', transition: t('transform 1.6s ease .1s') }} />
      {bands.map((c, i) => {
        const r = 46 - i * 9
        return <div key={i} style={{ position: 'absolute', left: '50%', top: '58%', width: `${r * 2}vmin`, height: `${r * 2}vmin`, translate: '-50% -50%', borderRadius: '50%', border: `4.5vmin solid ${c}`, clipPath: 'inset(0 0 50% 0)', transform: go ? `scale(${2.4 + i * 0.3})` : 'none', opacity: go ? 0 : 1, transition: t(`transform 1.8s cubic-bezier(.6,0,.3,1) ${0.2 + i * 0.1}s, opacity 1s ease ${0.8 + i * 0.1}s`) }} />
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '58%', bottom: 0, background: `linear-gradient(180deg, ${o.sand}, ${alpha(o.sand, 0.9)})`, opacity: go ? 0 : 1, transition: t('opacity 1s .6s') }} />
    </div>
  )
}

export const BACH = {
  pop: (p) => <Pop {...p} />,
  disco: (p) => <Disco {...p} />,
  pillow: (p) => <Pillow {...p} />,
  hatbox: (p) => <Hatbox {...p} />,
  sunset: (p) => <Sunset {...p} />,
}
