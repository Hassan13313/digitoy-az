/* eslint-disable react-refresh/only-export-components -- örtük xəritəsi: { növ: (props) => JSX } */
import { alpha } from '../../useInvitation'

/* MƏZUNİYYƏT — açılış örtükləri
   caps    Caps Toss  — üç məzun papağı fırlanaraq havaya uçur, qızılı konfetti yağır
   varsity Yearbook   — xətli vərəqə varsity yamağı möhür kimi vurulur, vərəq yana sürüşür
   bell    Last Bell  — mis zəng yellənir, səs dalğaları yayılır, qırmızı lent ekranı kəsib keçir
   chalk   Chalkboard — yaşıl lövhədə təbaşir cizgiləri, silgi lövhəni silib keçir
   plane   Paper Plane — dəftər vərəqi uçub gedir, arxasınca kağız təyyarə qırıq izlə keçir */

export const GRAD_CSS = `
@keyframes lxg-spinup { 0% { transform: translateY(0) rotate(0) } 100% { transform: translateY(-120svh) rotate(540deg) } }
@keyframes lxg-conf { 0% { opacity: 0; translate: 0 -10svh } 10% { opacity: 1 } 100% { opacity: 0; translate: var(--dx) 100svh; rotate: 540deg } }
@keyframes lxg-stamp { 0% { scale: 2.4; opacity: 0 } 60% { scale: .92; opacity: 1 } 100% { scale: 1; opacity: 1 } }
@keyframes lxg-ring { 0%,100% { rotate: -14deg } 50% { rotate: 14deg } }
@keyframes lxg-wave { from { scale: .3; opacity: .8 } to { scale: 2.6; opacity: 0 } }
@keyframes lxg-draw { to { stroke-dashoffset: 0 } }
`

const CAP = (c, t) => (
  <svg viewBox="0 0 100 70" style={{ width: '100%' }}>
    <path d="M50 4L98 24 50 44 2 24Z" fill={c} />
    <path d="M24 34V52C24 60 76 60 76 52V34L50 44Z" fill={c} opacity=".85" />
    <path d="M50 24L86 30V54" fill="none" stroke={t} strokeWidth="2" />
    <circle cx="86" cy="58" r="4" fill={t} />
  </svg>
)
const CONF = [[10, 0, -4], [24, .4, 6], [38, .9, -3], [52, .2, 5], [66, .7, -6], [80, 1.1, 3], [90, .5, -2], [18, 1.4, 4], [46, 1.6, -5], [74, 1.9, 2]]

function Caps({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.navy, 0.9), transition: t('background 1.6s .8s') }}>
      {[[22, 56, 0], [50, 46, 0.12], [76, 58, 0.24]].map(([x, y, d], i) => (
        <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: '28vmin', translate: '-50% -50%', animation: go && !instant ? `lxg-spinup 1.8s cubic-bezier(.3,0,.3,1) ${d}s forwards` : undefined, rotate: `${[-12, 4, 14][i]}deg` }}>{CAP(o.cap, o.gold)}</div>
      ))}
      {!instant && go && CONF.map(([x, d, dx], i) => (
        <span key={i} style={{ position: 'absolute', left: `${x}%`, top: 0, width: 7, height: 12, background: i % 2 ? o.gold : '#FFFFFF', '--dx': `${dx}vw`, opacity: 0, animation: `lxg-conf 2.4s linear ${d}s forwards` }} />
      ))}
    </div>
  )
}

function Varsity({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, transform: go ? 'translateX(-105%) rotate(-4deg)' : 'none', transition: t('transform 1.8s cubic-bezier(.7,0,.25,1) .5s'),
      background: [`linear-gradient(90deg, transparent 15%, ${alpha(o.red, 0.5)} 15%, ${alpha(o.red, 0.5)} calc(15% + 1.5px), transparent calc(15% + 1.5px))`, `repeating-linear-gradient(180deg, transparent 0 29px, ${alpha(o.blue, 0.3)} 29px 30px)`, '#FFFFFF'].join(', ') }}>
      <div style={{ position: 'absolute', left: '50%', top: '54%', width: '52vmin', height: '52vmin', translate: '-50% -50%', borderRadius: '50%', background: o.blue, border: `1.6vmin solid ${o.gold}`, boxShadow: `0 0 0 1vmin ${o.blue}, 0 10px 24px rgba(0,0,0,.25)`, display: 'grid', placeItems: 'center', animation: instant ? undefined : 'lxg-stamp .7s cubic-bezier(.3,1.4,.5,1) .5s both', rotate: '-8deg' }}>
        <span style={{ fontFamily: o.font, fontWeight: 800, fontSize: '16vmin', color: o.gold, WebkitTextStroke: `1px ${alpha('#FFFFFF', 0.6)}` }}>{o.mark || '★'}</span>
      </div>
    </div>
  )
}

function Bell({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.paper, 0.92), transition: t('background 1.4s 1s') }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', translate: '-50% -50%', opacity: go ? 0 : 1, transition: t('opacity .8s .9s') }}>
        {[0, 0.6, 1.2].map((d) => <span key={d} style={{ position: 'absolute', left: '50%', top: '50%', width: '40vmin', height: '40vmin', margin: '-20vmin', borderRadius: '50%', border: `2px solid ${alpha(o.brass, 0.7)}`, opacity: 0, animation: instant ? undefined : `lxg-wave 1.8s ease-out ${d}s infinite` }} />)}
        <svg viewBox="0 0 80 90" style={{ width: '34vmin', transformOrigin: '50% 8%', animation: instant ? undefined : `lxg-ring ${go ? 0.25 : 1.2}s ease-in-out infinite` }}>
          <defs><linearGradient id="lxg-brass" x1="0" x2="1"><stop offset="0" stopColor="#8A6420" /><stop offset=".45" stopColor={o.brass} /><stop offset="1" stopColor="#7A561A" /></linearGradient></defs>
          <path d="M40 4C44 4 46 7 46 10 58 13 64 24 64 40V58L72 70H8L16 58V40C16 24 22 13 34 10 34 7 36 4 40 4Z" fill="url(#lxg-brass)" />
          <circle cx="40" cy="78" r="7" fill="url(#lxg-brass)" />
          <path d="M30 8Q40 -2 50 8" fill="none" stroke={o.red} strokeWidth="4" />
        </svg>
      </div>
      <div style={{ position: 'absolute', left: '-20%', right: '-20%', top: '50%', height: '9vmin', background: o.red, rotate: '-18deg', boxShadow: '0 6px 14px rgba(0,0,0,.2)', transform: go ? 'translateX(0)' : 'translateX(-140%)', transition: t('transform .7s cubic-bezier(.6,0,.3,1) .1s'), opacity: go ? 1 : 0 }}>
        <div style={{ position: 'absolute', inset: '1vmin 0', borderTop: `1px solid ${o.gold}`, borderBottom: `1px solid ${o.gold}` }} />
      </div>
    </div>
  )
}

function Chalk({ o, go, t, instant }) {
  const d = (k) => ({ strokeDasharray: 1, strokeDashoffset: 1, animation: instant ? undefined : `lxg-draw 1.2s ease ${k}s forwards` })
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 90% at 50% 40%, ${alpha('#FFFFFF', 0.06)}, transparent 60%), ${o.board}`, border: `2.4vmin solid ${o.wood}`, boxShadow: 'inset 0 0 40px rgba(0,0,0,.4)', clipPath: go ? 'inset(0 0 0 100%)' : 'inset(0 0 0 0)', transition: t('clip-path 1.6s cubic-bezier(.6,0,.3,1) .2s') }}>
        <svg viewBox="0 0 100 160" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} fill="none" stroke={o.chalk} strokeWidth=".7" strokeLinecap="round" opacity=".85">
          <path pathLength="1" style={d(0.3)} d="M14 40l4 -8 4 8 -9 -5h10z" />
          <path pathLength="1" style={d(0.6)} d="M70 32c6 -6 14 0 8 6 -6 6 -14 0 -8 -6z" />
          <path pathLength="1" style={d(0.9)} d="M20 120q15 -12 30 0t30 0" />
          <path pathLength="1" style={d(1.2)} d="M76 108l3 -6 3 6 -7 -4h8z" stroke={o.yellow} />
          <path pathLength="1" style={d(1.5)} d="M18 74c10 -4 18 4 28 0" stroke={o.yellow} />
        </svg>
      </div>
      <div style={{ position: 'absolute', top: '40%', width: '26vmin', height: '10vmin', borderRadius: 6, background: `linear-gradient(180deg, #8C5A2B 0 60%, #ECE6DA 60%)`, boxShadow: '0 6px 12px rgba(0,0,0,.3)', left: go ? '110%' : '-30%', transition: t('left 1.6s cubic-bezier(.6,0,.3,1) .2s') }} />
    </div>
  )
}

function Plane({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: [`linear-gradient(90deg, transparent 13%, ${alpha(o.red, 0.45)} 13%, ${alpha(o.red, 0.45)} calc(13% + 1.5px), transparent calc(13% + 1.5px))`, `repeating-linear-gradient(180deg, transparent 0 29px, ${alpha(o.blue, 0.25)} 29px 30px)`, '#FFFFFF'].join(', '),
        transformOrigin: '100% 0', transform: go ? 'translate(60%, -80%) rotate(25deg) scale(.3)' : 'none', opacity: go ? 0 : 1, transition: t('transform 1.6s cubic-bezier(.6,0,.3,1), opacity 1s ease .6s') }} />
      {!instant && (
        <svg viewBox="0 0 400 300" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: go ? 0 : 1, transition: t('opacity .8s 1.4s') }}>
          <path d="M-20 260C80 200 140 250 220 170S360 90 420 40" fill="none" stroke={o.blue} strokeWidth="2" strokeDasharray="6 8" pathLength="1" style={{ strokeDasharray: '0.02 0.02' }} />
        </svg>
      )}
      <svg viewBox="0 0 60 40" style={{ position: 'absolute', left: go ? '110%' : '12%', top: go ? '4%' : '62%', width: 70, rotate: '-24deg', transition: t('left 1.8s cubic-bezier(.5,0,.4,1), top 1.8s cubic-bezier(.5,0,.4,1)') }}>
        <path d="M2 20L58 2 30 38 26 24Z" fill="#FFFFFF" stroke={o.blue} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M58 2L26 24" stroke={o.blue} strokeWidth="1.2" />
      </svg>
    </div>
  )
}

export const GRAD = {
  caps: (p) => <Caps {...p} />,
  varsity: (p) => <Varsity {...p} />,
  bell: (p) => <Bell {...p} />,
  chalk: (p) => <Chalk {...p} />,
  plane: (p) => <Plane {...p} />,
}
