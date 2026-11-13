/* eslint-disable react-refresh/only-export-components -- örtük xəritəsi: { növ: (props) => JSX } */
import { alpha } from '../../useInvitation'

/* BAYRAM GECƏLƏRİ — açılış örtükləri
   fire    Novruz Bonfire  — qaranlıqda közlər qızarır, alov qalxır, qığılcımlar uçur
   sprout  Novruz Səməni   — aşağıdan səməni otları boy atır, qırmızı lent dolanır
   clock   Midnight Clock  — zər saat: əqrəb XII-yə çatır, işıq çaxır
   globe   Snow Globe      — şüşə kürədə qar yağır, kürə böyüyüb ekrana açılır
   mask    Masquerade Ball — zərli maskanın göz yerlərindən foto görünür, maska qalxır */

export const HOLI_CSS = `
@keyframes lxh-flame { 0%,100% { transform: scaleY(1) translateY(0) } 50% { transform: scaleY(1.12) translateY(-2%) } }
@keyframes lxh-spark { 0% { opacity: 0; translate: 0 0 } 15% { opacity: 1 } 100% { opacity: 0; translate: var(--dx) -55svh } }
@keyframes lxh-grow { from { transform: scaleY(0) } to { transform: scaleY(1) } }
@keyframes lxh-snow { from { translate: 0 -10% } to { translate: var(--dx) 110% } }
@keyframes lxh-hand { from { rotate: 290deg } to { rotate: 360deg } }
`

const SPARK = [[30, -6, 0], [42, 4, 0.5], [50, -3, 1.1], [58, 6, 0.3], [66, -5, 0.8], [36, 3, 1.5], [62, 2, 1.9], [46, -7, 2.3]]
function Fire({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `radial-gradient(60% 40% at 50% 92%, ${alpha(o.ember, 0.55)}, ${alpha(o.night, 0.96)} 70%)`, opacity: go ? 0 : 1, transition: t('opacity 1.6s ease .4s') }}>
      <div style={{ position: 'absolute', left: '50%', bottom: '6%', width: '70vmin', height: '62vmin', translate: '-50% 0', transformOrigin: '50% 100%', transform: go ? 'scale(2.6)' : 'none', transition: t('transform 1.6s ease') }}>
        {[[0, 1, o.ember], [12, .78, o.flame], [24, .5, '#FFE7A3']].map(([inset, s, c], i) => (
          <div key={i} style={{ position: 'absolute', left: `${inset}%`, right: `${inset}%`, bottom: 0, height: `${s * 100}%`, borderRadius: '50% 50% 40% 40% / 70% 70% 30% 30%', background: `radial-gradient(60% 50% at 50% 80%, ${c}, ${alpha(c, 0)} 72%)`, filter: 'blur(4px)', transformOrigin: '50% 100%', animation: instant ? undefined : `lxh-flame ${0.9 + i * 0.25}s ease-in-out infinite` }} />
        ))}
      </div>
      {!instant && SPARK.map(([x, dx, d], i) => (
        <span key={i} style={{ position: 'absolute', left: `${x}%`, bottom: '20%', width: 4, height: 4, borderRadius: '50%', background: '#FFE3A1', boxShadow: `0 0 8px 2px ${alpha(o.flame, 0.9)}`, '--dx': `${dx}vw`, opacity: 0, animation: `lxh-spark ${2.6 + (i % 3) * 0.6}s ease-out ${d}s infinite` }} />
      ))}
    </div>
  )
}

function Sprout({ o, go, t, instant }) {
  const blades = Array.from({ length: 38 }, (_, i) => i)
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.bg, 0.9), transition: t('background 1.2s 1s') }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '62%', transform: go ? 'translateY(110%)' : 'none', transition: t('transform 1.6s cubic-bezier(.6,0,.4,1) .3s') }}>
        {blades.map((i) => (
          <span key={i} style={{ position: 'absolute', bottom: 0, left: `${(i / 38) * 100 + (i % 3)}%`, width: 5, height: `${55 + ((i * 37) % 45)}%`, borderRadius: '50% 50% 0 0', background: `linear-gradient(0deg, ${o.dark}, ${o.green})`, rotate: `${((i * 13) % 20) - 10}deg`, transformOrigin: '50% 100%', animation: instant ? undefined : `lxh-grow 1.4s cubic-bezier(.2,.8,.2,1) ${(i % 9) * 0.08}s both` }} />
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: '18%', height: '5vmin', background: o.red, boxShadow: '0 4px 10px rgba(0,0,0,.2)' }} />
      </div>
    </div>
  )
}

function Clock({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.night, 0.94), transition: t('background 1.2s 1.2s') }}>
      <div style={{ position: 'absolute', left: '50%', top: '52%', width: '70vmin', height: '70vmin', translate: '-50% -50%', borderRadius: '50%', border: `2vmin solid ${o.gold}`, background: `radial-gradient(circle, ${alpha('#FFFFFF', 0.08)}, ${alpha(o.night, 0.9)})`, boxShadow: `0 0 0 1vmin ${alpha(o.gold, 0.4)}, 0 0 60px ${alpha(o.gold, 0.25)}`, transform: go ? 'scale(3)' : 'none', opacity: go ? 0 : 1, transition: t('transform 1.6s cubic-bezier(.6,0,.3,1) .5s, opacity 1s ease 1s') }}>
        {Array.from({ length: 12 }, (_, i) => <span key={i} style={{ position: 'absolute', left: '50%', top: '4%', width: i % 3 ? 2 : 4, height: i % 3 ? '5%' : '9%', marginLeft: i % 3 ? -1 : -2, background: o.gold, transformOrigin: `50% ${46 / (i % 3 ? 5 : 9) * 100}%`, rotate: `${i * 30}deg` }} />)}
        <span style={{ position: 'absolute', left: '50%', bottom: '50%', width: 6, height: '30%', marginLeft: -3, borderRadius: 3, background: o.gold, transformOrigin: '50% 100%', rotate: '0deg' }} />
        <span style={{ position: 'absolute', left: '50%', bottom: '50%', width: 3, height: '40%', marginLeft: -1.5, borderRadius: 2, background: '#FFFFFF', transformOrigin: '50% 100%', animation: instant ? undefined : 'lxh-hand 4s cubic-bezier(.5,0,.2,1) .3s both' }} />
        <span style={{ position: 'absolute', left: '50%', top: '50%', width: 14, height: 14, margin: -7, borderRadius: '50%', background: o.gold }} />
      </div>
      {go && !instant && <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle, ${alpha(o.gold, 0.6)}, transparent 60%)`, animation: 'lxa-flash 1s ease-out forwards' }} />}
    </div>
  )
}

const FLAKES = Array.from({ length: 26 }, (_, i) => [(i * 37) % 100, (i % 7) * 0.5, ((i * 11) % 10) - 5, 2 + (i % 3)])
function Globe({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: o.bg, WebkitMaskImage: `radial-gradient(circle at 50% 46%, transparent ${go ? '150vmax' : '36vmin'}, #000 calc(${go ? '150vmax' : '36vmin'} + 1px))`, maskImage: `radial-gradient(circle at 50% 46%, transparent ${go ? '150vmax' : '36vmin'}, #000 calc(${go ? '150vmax' : '36vmin'} + 1px))`, opacity: go ? 0 : 1, transition: t('opacity 1.4s ease 1s') }} />
      <div style={{ position: 'absolute', left: '50%', top: '46%', width: '72vmin', height: '72vmin', translate: '-50% -50%', borderRadius: '50%', overflow: 'hidden', boxShadow: `inset 0 0 0 2px ${alpha('#FFFFFF', 0.5)}, inset -20px -30px 50px ${alpha('#FFFFFF', 0.15)}, 0 0 40px ${alpha('#FFFFFF', 0.2)}`, transform: go ? 'scale(4)' : 'none', opacity: go ? 0 : 1, transition: t('transform 1.8s cubic-bezier(.6,0,.3,1), opacity 1s ease .9s') }}>
        <div style={{ position: 'absolute', left: '18%', top: '12%', width: '26%', height: '18%', borderRadius: '50%', background: alpha('#FFFFFF', 0.4), filter: 'blur(4px)', rotate: '-30deg' }} />
        {!instant && FLAKES.map(([x, d, dx, s], i) => <span key={i} style={{ position: 'absolute', left: `${x}%`, top: 0, width: s, height: s, borderRadius: '50%', background: '#FFFFFF', '--dx': `${dx}px`, animation: `lxh-snow ${3 + (i % 4)}s linear ${d}s infinite` }} />)}
      </div>
      <div style={{ position: 'absolute', left: '50%', top: 'calc(46% + 33vmin)', width: '56vmin', height: '12vmin', translate: '-50% 0', borderRadius: '40% 40% 8px 8px', background: `linear-gradient(180deg, ${o.wood}, ${alpha(o.wood, 0.8)})`, boxShadow: '0 10px 20px rgba(0,0,0,.3)', opacity: go ? 0 : 1, transform: go ? 'translateY(40svh)' : 'none', transition: t('transform 1.2s ease, opacity .8s') }} />
    </div>
  )
}

function Mask({ o, go, t }) {
  const holes = 'radial-gradient(ellipse 13vmin 8vmin at 34% 46%, transparent 98%, #000 100%), radial-gradient(ellipse 13vmin 8vmin at 66% 46%, transparent 98%, #000 100%)'
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, transform: go ? 'translateY(-110%) scale(1.3)' : 'none', opacity: go ? 0 : 1, transition: t('transform 2s cubic-bezier(.7,0,.3,1) .2s, opacity 1.2s ease .9s') }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(46% 20% at 50% 46%, ${alpha(o.gold, 0.9)}, ${alpha(o.gold, 0.55)} 55%, transparent 100%), radial-gradient(120% 80% at 50% 40%, ${alpha(o.plum, 0.9)}, ${o.plum} 70%)`, WebkitMaskImage: holes, maskImage: holes, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' }} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} fill="none" stroke={o.plum} strokeWidth=".35" opacity=".55">
        <path d="M10 46C20 30 40 30 50 40 60 30 80 30 90 46" />
        <path d="M14 52C24 64 42 62 50 54 58 62 76 64 86 52" />
        <path d="M34 34Q30 20 20 14M66 34Q70 20 80 14" />
      </svg>
    </div>
  )
}

export const HOLI = {
  fire: (p) => <Fire {...p} />,
  sprout: (p) => <Sprout {...p} />,
  clock: (p) => <Clock {...p} />,
  globe: (p) => <Globe {...p} />,
  mask: (p) => <Mask {...p} />,
}
