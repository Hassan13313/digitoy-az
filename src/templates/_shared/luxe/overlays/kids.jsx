/* eslint-disable react-refresh/only-export-components -- örtük/sayğac xəritəsi: { növ: (props) => JSX } */
import { alpha } from '../../useInvitation'

/* UŞAQ AD GÜNÜ — açılış örtükləri
   book     Fairy Tale     — nağıl kitabının iki qapağı açılır, sehrli toz uçur
   launch   Space Mission  — «3·2·1», raket alovla yuxarı uçur, qaranlıq çəkilir
   tent     Circus Show    — zolaqlı çadırın iki pərdəsi yana açılır, lampalar yanır
   egg      Dino Adventure — xallı yumurta çatlayır, iki yarısı yana düşür
   balloons Balloon Party  — ekranı örtən şarlar yuxarı uçub gedir */

export const KIDS_CSS = `
@keyframes lxk-dust { 0% { opacity: 0; translate: 0 0 } 30% { opacity: 1 } 100% { opacity: 0; translate: var(--dx) -30svh } }
@keyframes lxk-count { 0% { opacity: 0; scale: 1.6 } 20% { opacity: 1; scale: 1 } 80% { opacity: 1 } 100% { opacity: 0; scale: .8 } }
@keyframes lxk-bob { 0%,100% { translate: 0 0 } 50% { translate: 0 -8px } }
@keyframes lxk-wobble { 0%,100% { rotate: 0deg } 25% { rotate: -3deg } 75% { rotate: 3deg } }
@keyframes lxk-blink { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
`

const DUST = [[20, 70, -6, 0], [34, 64, 4, 0.6], [48, 72, -3, 1.2], [62, 66, 6, 0.3], [76, 70, -5, 0.9], [28, 80, 3, 1.5], [56, 82, -4, 1.8], [70, 78, 5, 2.2]]

function Book({ o, go, t, instant }) {
  const cover = (left) => ({
    position: 'absolute', top: 0, bottom: 0, width: '50%', [left ? 'left' : 'right']: 0,
    transformOrigin: left ? '0 50%' : '100% 50%', transform: go ? `perspective(1200px) rotateY(${left ? -105 : 105}deg)` : 'none',
    transition: t('transform 2.4s cubic-bezier(.7,0,.25,1) .1s'),
    background: [
      `radial-gradient(120% 80% at ${left ? '100%' : '0%'} 50%, ${alpha('#000000', 0.25)}, transparent 60%)`,
      `linear-gradient(160deg, ${o.cover}, ${o.deep})`,
    ].join(', '),
    boxShadow: 'inset 0 0 40px rgba(0,0,0,.35)',
  })
  const frame = (left) => ({ position: 'absolute', top: '6%', bottom: '6%', [left ? 'left' : 'right']: '9%', [left ? 'right' : 'left']: '5%', border: `2px solid ${alpha(o.gold, 0.85)}`, boxShadow: `inset 0 0 0 5px ${alpha(o.deep, 0.6)}, inset 0 0 0 6px ${alpha(o.gold, 0.45)}`, borderRadius: 4 })
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <div style={cover(true)}><div style={frame(true)} /><div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 14, background: `linear-gradient(90deg, transparent, ${alpha('#000000', 0.35)})` }} /></div>
      <div style={cover(false)}><div style={frame(false)} /></div>
      {!instant && DUST.map(([x, y, dx, d], i) => (
        <span key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 5, height: 5, borderRadius: '50%', background: o.gold, boxShadow: `0 0 10px 3px ${alpha(o.gold, 0.7)}`, '--dx': `${dx}vw`, opacity: 0, animation: `lxk-dust 3.2s ease-out ${d}s infinite` }} />
      ))}
    </div>
  )
}

function Launch({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 80% at 50% 100%, ${o.glow}, ${o.night} 55%)`, opacity: go ? 0 : 1, transition: t('opacity 1.4s ease 1.2s') }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(1.5px 1.5px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 20%, #fff, transparent), radial-gradient(1.5px 1.5px at 40% 60%, #fff, transparent), radial-gradient(1px 1px at 85% 55%, #fff, transparent), radial-gradient(1px 1px at 10% 75%, #fff, transparent), radial-gradient(1.5px 1.5px at 60% 85%, #fff, transparent)', opacity: 0.8 }} />
      {!instant && !go && [3, 2, 1].map((n, i) => (
        <div key={n} style={{ position: 'absolute', left: 0, right: 0, top: '42%', textAlign: 'center', fontFamily: o.font, fontWeight: 800, fontSize: '22vmin', color: o.accent, textShadow: `0 0 30px ${alpha(o.accent, 0.7)}`, opacity: 0, animation: `lxk-count 1.2s ease ${0.4 + i * 1.2}s both` }}>{n}</div>
      ))}
      <svg viewBox="0 0 40 120" style={{ position: 'absolute', left: '50%', bottom: '8%', width: 56, translate: '-50% 0', transform: go ? 'translateY(-120svh)' : 'none', transition: t('transform 2.2s cubic-bezier(.6,0,.4,1)') }}>
        <path d="M20 2C30 14 32 34 32 58V84H8V58C8 34 10 14 20 2Z" fill="#F5F3FF" />
        <circle cx="20" cy="40" r="6" fill={o.night} stroke={o.accent} strokeWidth="2" />
        <path d="M8 66L0 90H8ZM32 66L40 90H32Z" fill={o.accent} />
        <path d="M12 86Q20 120 28 86Z" fill="#FFC94D" style={{ animation: 'lxk-blink .25s linear infinite' }} />
      </svg>
    </div>
  )
}

function Tent({ o, go, t, instant }) {
  const flap = (left) => ({
    position: 'absolute', top: o.band ? '24svh' : 0, bottom: 0, width: '51%', [left ? 'left' : 'right']: 0,
    clipPath: left ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : undefined,
    transform: go ? `translateX(${left ? -100 : 100}%) skewX(${left ? 8 : -8}deg)` : 'none', transformOrigin: left ? '0 0' : '100% 0',
    transition: t('transform 2.3s cubic-bezier(.7,0,.25,1) .1s'),
    background: [`linear-gradient(90deg, rgba(0,0,0,.18), transparent 30%, rgba(0,0,0,.12))`, `repeating-linear-gradient(90deg, ${o.red} 0 9vw, ${o.cream} 9vw 18vw)`].join(', '),
    boxShadow: left ? 'inset -20px 0 30px rgba(0,0,0,.35)' : 'inset 20px 0 30px rgba(0,0,0,.35)',
  })
  const bulbs = Array.from({ length: 11 }, (_, i) => i)
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      {/* afişa lövhəsi: ad zolaqlar üstündə itməsin (qırmızı yazı qırmızı zolaqda oxunmurdu) */}
      {o.band && <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '24svh', background: `linear-gradient(180deg, ${o.cream}, ${alpha(o.cream, 0.96)})`, borderBottom: `3px solid ${o.gold}`, boxShadow: '0 6px 14px rgba(0,0,0,.2)', opacity: go ? 0 : 1, transition: t('opacity 1.1s ease 1.2s') }} />}
      <div style={flap(true)} />
      <div style={flap(false)} />
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, width: '100%', height: '9svh', transform: go ? 'translateY(-110%)' : 'none', transition: t('transform 1.4s ease 1s') }}>
        <path d="M0 0H100V12Q75 30 50 14Q25 30 0 12Z" fill={o.red} />
        <path d="M0 12Q25 30 50 14Q75 30 100 12" fill="none" stroke={o.gold} strokeWidth=".8" />
      </svg>
      {bulbs.map((i) => (
        <span key={i} style={{ position: 'absolute', top: `calc(${i % 2 ? 5.2 : 6.6}svh)`, left: `${4 + i * 9.2}%`, width: 9, height: 9, borderRadius: '50%', background: '#FFE8A3', boxShadow: '0 0 10px 3px rgba(255,214,120,.8)', opacity: go ? 0 : 1, animation: instant ? undefined : `lxk-blink 1.2s ease-in-out ${i * 0.12}s infinite`, transition: t('opacity .6s') }} />
      ))}
    </div>
  )
}

function Egg({ o, go, t, instant }) {
  const half = (top) => ({
    position: 'absolute', left: '50%', top: '50%', width: '62vmin', height: '80vmin', translate: '-50% -50%', borderRadius: '50% 50% 46% 46% / 58% 58% 42% 42%',
    background: `radial-gradient(circle at 30% 30%, ${alpha('#FFFFFF', 0.5)}, transparent 40%), radial-gradient(${alpha(o.spot, 0.55)} 6%, transparent 7%) 0 0 / 9vmin 9vmin, radial-gradient(${alpha(o.spot, 0.4)} 4%, transparent 5%) 4vmin 5vmin / 11vmin 11vmin, ${o.shell}`,
    clipPath: top ? 'polygon(0 0, 100% 0, 100% 52%, 86% 46%, 72% 56%, 58% 46%, 44% 56%, 30% 46%, 16% 56%, 0 48%)' : 'polygon(0 48%, 16% 56%, 30% 46%, 44% 56%, 58% 46%, 72% 56%, 86% 46%, 100% 52%, 100% 100%, 0 100%)',
    boxShadow: 'inset -10px -20px 40px rgba(0,0,0,.18)',
    transform: go ? (top ? 'translate(-20vw, -60svh) rotate(-35deg)' : 'translate(18vw, 60svh) rotate(25deg)') : 'none',
    transition: t('transform 1.8s cubic-bezier(.6,0,.3,1) .35s'),
  })
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.jungle, 0.88), transition: t('background 1.2s .6s') }}>
      <div style={{ position: 'absolute', inset: 0, animation: instant || go ? undefined : 'lxk-wobble 1.6s ease-in-out infinite', transformOrigin: '50% 70%' }}>
        <div style={half(true)} />
        <div style={half(false)} />
      </div>
    </div>
  )
}

const BAL = [[8, 70, 0], [22, 58, 1], [36, 74, 2], [50, 60, 3], [64, 72, 0], [78, 56, 1], [90, 70, 2], [14, 88, 3], [44, 90, 1], [70, 90, 2], [28, 40, 2], [58, 38, 0], [84, 36, 3], [6, 30, 1], [40, 22, 3], [74, 16, 0]]
function Balloons({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.bg, 0.6), transition: t('background 1.4s .5s') }}>
      {BAL.map(([x, y, c], i) => (
        <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, translate: '-50% -50%', transform: go ? `translateY(-${110 + (i % 4) * 12}svh)` : 'none', transition: t(`transform ${1.8 + (i % 5) * 0.2}s cubic-bezier(.5,0,.6,1) ${(i % 6) * 0.07}s`) }}>
          <div style={{ animation: instant ? undefined : `lxk-bob ${2.4 + (i % 3) * 0.4}s ease-in-out ${i * 0.15}s infinite` }}>
            <div style={{ width: '30vmin', maxWidth: 150, aspectRatio: '0.84', borderRadius: '50% 50% 48% 48% / 56% 56% 44% 44%', background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.75), transparent 28%), ${o.colors[c]}`, boxShadow: 'inset -8px -12px 20px rgba(0,0,0,.12)' }} />
            <div style={{ width: 1, height: 60, margin: '0 auto', background: alpha('#7a5a6a', 0.5) }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export const KIDS = {
  book: (p) => <Book {...p} />,
  launch: (p) => <Launch {...p} />,
  tent: (p) => <Tent {...p} />,
  egg: (p) => <Egg {...p} />,
  balloons: (p) => <Balloons {...p} />,
}
