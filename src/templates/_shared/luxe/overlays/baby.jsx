/* eslint-disable react-refresh/only-export-components -- örtük/sayğac xəritəsi: { növ: (props) => JSX } */
import { alpha } from '../../useInvitation'

/* BABY SHOWER — açılış örtükləri
   watercolor Pastel Bloom  — akvarel kağızı, ləkələr yayılır və kağız əriyir
   blanket    Teddy Bear    — toxunma yorğan aşağı sürüşür, ürəkciklər uçur
   giftbox    Gender Reveal — zolaqlı qutunun qapağı uçur, mavi və çəhrayı şarlar qalxır
   envelope   Stork Letter  — mum möhür sınır, zərfin qapağı açılır, zərf aşağı düşür
   mobile     Baby Mobile   — sapdan asılan ay, ulduz, buludlar yellənir və yuxarı qalxır */

export const BABY_CSS = `
@keyframes lxb-bloom { from { scale: .2; opacity: 0 } to { scale: 1; opacity: 1 } }
@keyframes lxb-heart { 0% { opacity: 0; translate: 0 0 } 20% { opacity: 1 } 100% { opacity: 0; translate: var(--dx) -26svh } }
@keyframes lxb-swing { 0%,100% { rotate: -6deg } 50% { rotate: 6deg } }
`

const BLOBS = [[30, 30, 46, 0], [70, 26, 40, 1], [50, 52, 56, 2], [24, 70, 42, 1], [76, 72, 46, 0], [52, 86, 38, 2]]
function Watercolor({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: o.paper, opacity: go ? 0 : 1, transition: t('opacity 2s ease .4s'), backgroundImage: 'radial-gradient(rgba(0,0,0,.035) 1px, transparent 1.4px)', backgroundSize: '5px 5px' }}>
      {BLOBS.map(([x, y, s, c], i) => (
        <span key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${s}vmin`, height: `${s * 0.9}vmin`, translate: '-50% -50%', borderRadius: '48% 52% 44% 56% / 52% 46% 54% 48%', background: `radial-gradient(circle at 45% 45%, ${alpha(o.colors[c], 0.55)}, ${alpha(o.colors[c], 0.25)} 55%, transparent 72%)`, filter: 'blur(2px)', animation: instant ? undefined : `lxb-bloom 2.4s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.25}s both`, scale: go ? '1.6' : undefined, transition: t('scale 2.4s ease') }} />
      ))}
    </div>
  )
}

const HEARTS = [[18, -4, 0], [34, 5, 0.8], [52, -6, 1.6], [68, 4, 0.4], [82, -3, 1.2]]
function Blanket({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <div style={{
        position: 'absolute', inset: 0, transform: go ? 'translateY(105%)' : 'none', transition: t('transform 2.3s cubic-bezier(.7,0,.25,1) .1s'),
        background: [`repeating-linear-gradient(45deg, ${alpha('#FFFFFF', 0.18)} 0 3px, transparent 3px 9px)`, `repeating-linear-gradient(-45deg, ${alpha('#000000', 0.05)} 0 3px, transparent 3px 9px)`, `linear-gradient(180deg, ${o.wool}, ${o.wool2})`].join(', '),
        boxShadow: 'inset 0 30px 40px -20px rgba(0,0,0,.2)', borderTop: `10px solid ${o.trim}`,
      }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 6, height: 2, background: `repeating-linear-gradient(90deg, ${alpha('#FFFFFF', 0.8)} 0 8px, transparent 8px 14px)` }} />
      </div>
      {!instant && HEARTS.map(([x, dx, d], i) => (
        <span key={i} style={{ position: 'absolute', left: `${x}%`, bottom: '18%', fontSize: 22, color: o.heart, '--dx': `${dx}vw`, opacity: 0, animation: `lxb-heart 3.4s ease-out ${d}s infinite` }}>♥</span>
      ))}
    </div>
  )
}

function Giftbox({ o, go, t, instant }) {
  const stripes = `repeating-linear-gradient(90deg, ${o.pink} 0 7vmin, ${o.blue} 7vmin 14vmin)`
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.bg, 0.85), transition: t('background 1.4s .8s') }}>
      <div style={{ position: 'absolute', left: '50%', top: '56%', width: '64vmin', height: '50vmin', translate: '-50% 0', background: stripes, boxShadow: '0 20px 40px rgba(0,0,0,.18)', opacity: go ? 0 : 1, transform: go ? 'translateY(30svh)' : 'none', transition: t('transform 1.6s ease .5s, opacity 1.2s ease .7s') }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '9vmin', translate: '-50% 0', background: o.gold }} />
      </div>
      <div style={{ position: 'absolute', left: '50%', top: 'calc(56% - 10vmin)', width: '70vmin', height: '11vmin', translate: '-50% 0', background: stripes, boxShadow: '0 6px 14px rgba(0,0,0,.18)', transform: go ? 'translate(-6vw, -80svh) rotate(-35deg)' : 'none', transition: t('transform 1.6s cubic-bezier(.5,0,.3,1)'), animation: instant || go ? undefined : 'lxb-swing 1.4s ease-in-out infinite' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '9vmin', translate: '-50% 0', background: o.gold }} />
        <div style={{ position: 'absolute', left: '50%', top: '-8vmin', width: '16vmin', height: '9vmin', translate: '-50% 0', borderRadius: '50% 50% 0 0', border: `2.2vmin solid ${o.gold}`, borderBottom: 'none' }} />
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ position: 'absolute', left: `${30 + i * 8}%`, top: '58%', width: '13vmin', aspectRatio: '0.84', borderRadius: '50% 50% 48% 48% / 56% 56% 44% 44%', background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.7), transparent 30%), ${i % 2 ? o.blue : o.pink}`, opacity: go ? 1 : 0, transform: go ? `translateY(-${90 + i * 8}svh)` : 'none', transition: t(`transform ${2.2 + (i % 3) * 0.3}s cubic-bezier(.3,0,.5,1) ${0.2 + i * 0.08}s, opacity .3s ${0.2 + i * 0.08}s`) }} />
      ))}
    </div>
  )
}

function Envelope({ o, go, t }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, transform: go ? 'translateY(110%)' : 'none', transition: t('transform 1.8s cubic-bezier(.7,0,.3,1) 1s'), perspective: 1200 }}>
      <div style={{ position: 'absolute', inset: 0, background: [`linear-gradient(160deg, transparent 49.6%, ${alpha('#000000', 0.08)} 50%, transparent 50.4%)`, `linear-gradient(20deg, transparent 49.6%, ${alpha('#000000', 0.08)} 50%, transparent 50.4%)`, o.paper].join(', ') }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '52%', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: `linear-gradient(180deg, ${o.flap}, ${alpha(o.flap, 0.9)})`, transformOrigin: '50% 0', transform: go ? 'rotateX(180deg)' : 'none', transition: t('transform 1.2s cubic-bezier(.6,0,.3,1) .35s'), boxShadow: '0 8px 16px rgba(0,0,0,.12)' }} />
      <div style={{ position: 'absolute', left: '50%', top: '52%', width: '22vmin', height: '22vmin', translate: '-50% -50%', borderRadius: '46% 54% 50% 50%', background: `radial-gradient(circle at 40% 35%, ${alpha('#FFFFFF', 0.35)}, transparent 40%), ${o.wax}`, boxShadow: `0 4px 10px rgba(0,0,0,.25), inset 0 0 0 3vmin ${alpha('#000000', 0.08)}`, transform: go ? 'scale(1.2) rotate(20deg)' : 'none', opacity: go ? 0 : 1, transition: t('transform .4s, opacity .4s .1s'), display: 'grid', placeItems: 'center', color: alpha('#FFFFFF', 0.85), fontSize: '9vmin' }}>♥</div>
    </div>
  )
}

const MOB = [[22, 0.28, 'moon'], [40, 0.38, 'star'], [58, 0.3, 'cloud'], [76, 0.36, 'star'], [50, 0.48, 'star']]
function Mobile({ o, go, t, instant }) {
  const shape = (k) => k === 'moon'
    ? <path d="M30 4A26 26 0 1 0 54 40 20 20 0 1 1 30 4Z" fill={o.gold} />
    : k === 'star' ? <path d="M30 4L37 22 56 23 41 35 46 54 30 43 14 54 19 35 4 23 23 22Z" fill={o.gold} />
      : <path d="M14 44C6 44 2 38 2 32 2 25 8 20 15 21 17 12 25 6 34 6 44 6 51 13 52 22 58 23 60 28 60 33 60 40 54 44 48 44Z" fill="#fff" />
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.night, 0.9), transition: t('background 1.6s .6s') }}>
      <div style={{ position: 'absolute', inset: 0, transform: go ? 'translateY(-100svh)' : 'none', transition: t('transform 2.4s cubic-bezier(.6,0,.3,1) .2s') }}>
        <div style={{ position: 'absolute', left: '18%', right: '18%', top: '16%', height: 3, borderRadius: 2, background: o.gold }} />
        {MOB.map(([x, y, k], i) => (
          <div key={i} style={{ position: 'absolute', left: `${x}%`, top: '16%', transformOrigin: '50% 0', animation: instant ? undefined : `lxb-swing ${2.6 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }}>
            <div style={{ width: 1, height: `${y * 100 - 16}svh`, marginLeft: '50%', background: alpha('#FFFFFF', 0.5) }} />
            <svg viewBox="0 0 60 58" style={{ width: k === 'cloud' ? 74 : 54, translate: '-50% 0', marginLeft: '50%', filter: `drop-shadow(0 0 10px ${alpha(o.gold, 0.4)})` }}>{shape(k)}</svg>
          </div>
        ))}
      </div>
    </div>
  )
}

export const BABY = {
  watercolor: (p) => <Watercolor {...p} />,
  blanket: (p) => <Blanket {...p} />,
  giftbox: (p) => <Giftbox {...p} />,
  envelope: (p) => <Envelope {...p} />,
  mobile: (p) => <Mobile {...p} />,
}
