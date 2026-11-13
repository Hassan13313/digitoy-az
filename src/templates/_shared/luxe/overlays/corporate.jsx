/* eslint-disable react-refresh/only-export-components -- örtük/sayğac xəritəsi: { növ: (props) => JSX } */
import { alpha } from '../../useInvitation'

/* KORPORATİV — açılış örtükləri
   deco     Gala Night    — art-deko qapı: qızılı şüalı iki tay yana açılır
   crt      Keynote       — ekran CRT kimi yanır: nazik işıq xətti açılır, şəbəkə görünür
   spot     Award Night   — qaranlıqda projektor dairəsi səhnəni gəzir və böyüyür
   card     Business Card — vizit kartı çevrilir, böyüyüb ekrana yayılır
   neon     Neon Party    — kərpic divarda neon çərçivə titrəyərək yanır */

export const CORP_CSS = `
@keyframes lxc-flick { 0%, 18%, 22%, 26%, 60%, 100% { opacity: 1 } 20%, 24%, 58% { opacity: .25 } }
@keyframes lxc-roam { 0% { left: 25%; top: 40% } 35% { left: 70%; top: 55% } 70% { left: 40%; top: 65% } 100% { left: 50%; top: 50% } }
@keyframes lxc-scan { from { background-position: 0 0 } to { background-position: 0 6px } }
`

function Deco({ o, go, t }) {
  const leaf = (left) => ({
    position: 'absolute', top: 0, bottom: 0, width: '50%', [left ? 'left' : 'right']: 0,
    transform: go ? `translateX(${left ? -102 : 102}%)` : 'none', transition: t('transform 2.2s cubic-bezier(.75,0,.25,1) .1s'),
    background: [
      `repeating-conic-gradient(from ${left ? 0 : 180}deg at ${left ? '100%' : '0%'} 100%, ${alpha(o.gold, 0.55)} 0 1.2deg, transparent 1.2deg 9deg)`,
      `linear-gradient(180deg, ${o.black}, #000)`,
    ].join(', '),
    borderLeft: left ? undefined : `2px solid ${o.gold}`, borderRight: left ? `2px solid ${o.gold}` : undefined,
  })
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <div style={leaf(true)} />
      <div style={leaf(false)} />
      <div style={{ position: 'absolute', left: '50%', bottom: '14%', width: '44vmin', height: '22vmin', translate: '-50% 0', borderRadius: '22vmin 22vmin 0 0', border: `2px solid ${o.gold}`, borderBottom: 'none', background: `repeating-conic-gradient(from 270deg at 50% 100%, ${alpha(o.gold, 0.8)} 0 2deg, transparent 2deg 15deg)`, opacity: go ? 0 : 1, transition: t('opacity .6s') }} />
    </div>
  )
}

function Crt({ o, go, t }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: o.bg, opacity: go ? 0 : 1, transition: t('opacity 1.2s ease 1.3s') }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${alpha(o.dot, 0.35)} 1px, transparent 1.4px)`, backgroundSize: '18px 18px' }} />
      <div style={{ position: 'absolute', left: '6%', right: '6%', top: '50%', height: go ? '100%' : 2, translate: '0 -50%', background: go ? alpha('#FFFFFF', 0.06) : '#fff', boxShadow: `0 0 30px 6px ${alpha(o.dot, 0.8)}`, transition: t('height 1.1s cubic-bezier(.7,0,.3,1) .1s, background .6s .5s') }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(180deg, rgba(255,255,255,.04) 0 1px, transparent 1px 3px)', animation: 'lxc-scan .3s linear infinite' }} />
    </div>
  )
}

function Spot({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: go ? 0 : 1, transition: t('opacity 1.4s ease 1s') }}>
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: go ? '400vmax' : '50vmin', height: go ? '400vmax' : '50vmin', translate: '-50% -50%', borderRadius: '50%',
        boxShadow: `0 0 0 400vmax ${alpha(o.dark, 0.94)}, inset 0 0 40px 10px ${alpha(o.dark, 0.6)}`,
        animation: instant || go ? undefined : 'lxc-roam 5s ease-in-out infinite alternate', transition: t('width 2s cubic-bezier(.6,0,.3,1), height 2s cubic-bezier(.6,0,.3,1)'),
      }} />
    </div>
  )
}

function Card({ o, go, t }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : o.paper, transition: t('background 1s .9s'), perspective: 1400 }}>
      <div style={{
        position: 'absolute', left: '50%', top: '54%', width: '78vmin', height: '46vmin', translate: '-50% -50%',
        transformStyle: 'preserve-3d', transform: go ? 'rotateY(180deg) scale(4)' : 'rotateY(0deg)', opacity: go ? 0 : 1,
        transition: t('transform 1.8s cubic-bezier(.6,0,.3,1), opacity .6s ease 1.2s'),
      }}>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: '#fff', boxShadow: '0 30px 60px -20px rgba(0,0,0,.35)', padding: '7%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ width: '22%', height: 4, background: o.blue }} />
          <div style={{ display: 'grid', gap: 6 }}>{[60, 42, 50].map((w, i) => <span key={i} style={{ width: `${w}%`, height: 5, background: alpha('#121212', i ? 0.18 : 0.85) }} />)}</div>
        </div>
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: o.blue }} />
      </div>
    </div>
  )
}

function Neon({ o, go, t, instant }) {
  const tube = (c, inset, d) => ({ position: 'absolute', inset, borderRadius: 26, border: `3px solid ${c}`, boxShadow: `0 0 10px 2px ${c}, inset 0 0 10px 1px ${c}, 0 0 40px 6px ${alpha(c, 0.5)}`, animation: instant ? undefined : `lxc-flick 2.4s linear ${d}s infinite` })
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: go ? 0 : 1, transition: t('opacity 1.4s ease .6s'), background: [
      `repeating-linear-gradient(0deg, transparent 0 22px, ${alpha('#000000', 0.6)} 22px 24px)`,
      `repeating-linear-gradient(90deg, transparent 0 46px, ${alpha('#000000', 0.6)} 46px 48px)`,
      `linear-gradient(180deg, ${o.brick}, ${alpha(o.brick, 0.85)})`,
    ].join(', ') }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(70% 50% at 50% 50%, transparent, ${alpha('#000000', 0.75)})` }} />
      <div style={tube(o.pink, '22% 12% 22% 12%', 0)} />
      <div style={tube(o.cyan, '26% 17% 26% 17%', 0.5)} />
    </div>
  )
}

export const CORP = {
  deco: (p) => <Deco {...p} />,
  crt: (p) => <Crt {...p} />,
  spot: (p) => <Spot {...p} />,
  card: (p) => <Card {...p} />,
  neon: (p) => <Neon {...p} />,
}
