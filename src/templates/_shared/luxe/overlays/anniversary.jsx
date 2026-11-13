/* eslint-disable react-refresh/only-export-components -- örtük xəritəsi: { növ: (props) => JSX } */
import { alpha } from '../../useInvitation'

/* İLDÖNÜMÜ — açılış örtükləri
   locket  Silver Locket  — gümüş ürək medalyonun iki qapağı açılır
   album   Golden Jubilee — dəri albomun qızıl basmalı qabığı soldan açılır
   paper   First Paper    — qatlanmış kağız vərəq: üst və alt qatlar açılıb uçur
   flash   Retro Polaroid — flaş çaxır, polaroid çərçivəsində şəkil aşkarlanır və çərçivə böyüyür
   letters Love Letters   — iplə bağlanmış zərflər yelpik kimi açılıb dağılır */

export const ANNIV_CSS = `
@keyframes lxa-develop { from { backdrop-filter: sepia(1) brightness(.2) contrast(.8); -webkit-backdrop-filter: sepia(1) brightness(.2) contrast(.8) } to { backdrop-filter: sepia(0) brightness(1) contrast(1); -webkit-backdrop-filter: sepia(0) brightness(1) contrast(1) } }
@keyframes lxa-flash { 0% { opacity: 0 } 6% { opacity: 1 } 100% { opacity: 0 } }
@keyframes lxa-sway { 0%,100% { rotate: -1.5deg } 50% { rotate: 1.5deg } }
`

const HEART = 'M50 88C20 66 4 50 4 30 4 16 15 6 28 6 38 6 46 12 50 20 54 12 62 6 72 6 85 6 96 16 96 30 96 50 80 66 50 88Z'

function Locket({ o, go, t, instant }) {
  const half = (left) => ({
    position: 'absolute', left: '50%', top: '50%', width: '74vmin', height: '70vmin', translate: '-50% -50%',
    clipPath: left ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)', transformOrigin: left ? '0% 50%' : '100% 50%',
    transform: go ? `perspective(900px) rotateY(${left ? -110 : 110}deg)` : 'none', transition: t('transform 2s cubic-bezier(.7,0,.25,1) .1s'),
  })
  const face = (
    <svg viewBox="0 0 100 94" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 18px 30px rgba(0,0,0,.35))' }}>
      <defs><linearGradient id="lxa-silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F4F6F9" /><stop offset=".45" stopColor={o.silver} /><stop offset=".7" stopColor="#8E96A3" /><stop offset="1" stopColor="#E3E7EC" /></linearGradient></defs>
      <path d={HEART} fill="url(#lxa-silver)" />
      <path d={HEART} fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth=".6" transform="translate(50 47) scale(.86) translate(-50 -47)" />
      <path d="M50 30C46 22 34 22 34 32 34 40 50 50 50 50 50 50 66 40 66 32 66 22 54 22 50 30Z" fill="none" stroke={alpha('#5A606C', 0.5)} strokeWidth=".8" />
    </svg>
  )
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.bg, 0.92), transition: t('background 1.2s .9s') }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, height: '18%', width: 2, background: `repeating-linear-gradient(180deg, ${o.silver} 0 4px, transparent 4px 6px)`, opacity: go ? 0 : 1, transition: t('opacity .4s') }} />
      <div style={{ position: 'absolute', inset: 0, animation: instant || go ? undefined : 'lxa-sway 3.6s ease-in-out infinite', transformOrigin: '50% 0' }}>
        <div style={half(true)}>{face}</div>
        <div style={half(false)}>{face}</div>
      </div>
    </div>
  )
}

function Album({ o, go, t }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, perspective: 1600 }}>
      <div style={{
        position: 'absolute', inset: 0, transformOrigin: '0 50%', transform: go ? 'rotateY(-100deg)' : 'none', transition: t('transform 2.4s cubic-bezier(.7,0,.25,1) .1s'),
        background: [`radial-gradient(rgba(0,0,0,.08) 1px, transparent 1.4px) 0 0 / 4px 4px`, `radial-gradient(120% 80% at 30% 20%, ${alpha('#FFFFFF', 0.08)}, transparent 50%)`, `linear-gradient(160deg, ${o.leather}, ${o.deep})`].join(', '),
        boxShadow: 'inset -14px 0 30px rgba(0,0,0,.45)',
      }}>
        <div style={{ position: 'absolute', inset: '4% 7%', border: `2px solid ${alpha(o.gold, 0.85)}`, boxShadow: `inset 0 0 0 6px ${alpha(o.deep, 0.5)}, inset 0 0 0 7px ${alpha(o.gold, 0.5)}` }} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', translate: '-50% -50%', width: '30vmin', height: '30vmin', border: `2px solid ${o.gold}`, rotate: '45deg', boxShadow: `inset 0 0 0 5px ${alpha(o.deep, 0.6)}, inset 0 0 0 6px ${alpha(o.gold, 0.6)}` }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 18, background: `linear-gradient(90deg, ${alpha('#000000', 0.45)}, transparent)` }} />
      </div>
    </div>
  )
}

function Paper({ o, go, t }) {
  const sheet = (top) => ({
    position: 'absolute', left: 0, right: 0, [top ? 'top' : 'bottom']: 0, height: '50%', transformOrigin: top ? '50% 0' : '50% 100%',
    transform: go ? `perspective(1200px) rotateX(${top ? 100 : -100}deg)` : 'none', transition: t(`transform 1.8s cubic-bezier(.7,0,.25,1) ${top ? 0.1 : 0.4}s`),
    background: [`linear-gradient(${top ? 180 : 0}deg, transparent 80%, ${alpha('#000000', 0.08)})`, `repeating-linear-gradient(60deg, transparent 0 22px, ${alpha(o.blue, 0.14)} 22px 23px)`, `repeating-linear-gradient(-60deg, transparent 0 22px, ${alpha(o.blue, 0.14)} 22px 23px)`, o.paper].join(', '),
  })
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <div style={sheet(true)} />
      <div style={sheet(false)} />
      <svg viewBox="0 0 100 100" style={{ position: 'absolute', left: '50%', top: '50%', width: '26vmin', translate: '-50% -50%', opacity: go ? 0 : 1, transition: t('opacity .4s') }}>
        <path d="M50 86L10 44 30 18 50 38 70 18 90 44Z" fill={o.blue} />
        <path d="M50 38V86M30 18L50 86 70 18" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1" />
      </svg>
    </div>
  )
}

function Flash({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      <div style={{
        position: 'absolute', left: '50%', top: '48%', width: go ? '160vmax' : '72vmin', height: go ? '190vmax' : '86vmin', translate: '-50% -50%',
        borderStyle: 'solid', borderColor: o.frame, borderWidth: go ? '0' : '4vmin 4vmin 16vmin', boxShadow: go ? 'none' : `0 0 0 200vmax ${alpha(o.bg, 0.92)}, 0 20px 40px rgba(0,0,0,.25)`,
        transition: t('width 2s cubic-bezier(.7,0,.25,1) .2s, height 2s cubic-bezier(.7,0,.25,1) .2s, border-width 1.4s ease .3s, box-shadow 1.2s ease 1s'),
      }}>
        <div style={{ position: 'absolute', inset: 0, animation: instant ? undefined : 'lxa-develop 4.5s ease-out .3s both' }} />
      </div>
      {!instant && <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: 0, animation: go ? 'lxa-flash .9s ease-out' : undefined }} />}
    </div>
  )
}

const ENV = [-24, -12, 0, 12, 24]
function Letters({ o, go, t }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.bg, 0.9), transition: t('background 1.2s .9s') }}>
      {ENV.map((r, i) => (
        <div key={i} style={{
          position: 'absolute', left: '50%', top: '54%', width: '64vmin', height: '42vmin', translate: '-50% -50%', transformOrigin: '50% 120%',
          rotate: `${go ? r * 3 : r * 0.25}deg`, transform: go ? `translateY(-${80 + i * 10}svh)` : 'none', opacity: go ? 0 : 1,
          transition: t(`rotate .9s ease ${i * 0.06}s, transform 1.8s cubic-bezier(.6,0,.4,1) ${0.5 + i * 0.08}s, opacity 1s ease ${1 + i * 0.08}s`),
          background: [`linear-gradient(150deg, transparent 49.5%, ${alpha('#000000', 0.08)} 50%, transparent 50.5%)`, `linear-gradient(30deg, transparent 49.5%, ${alpha('#000000', 0.08)} 50%, transparent 50.5%)`, i % 2 ? o.paper : o.paper2].join(', '),
          boxShadow: '0 8px 18px rgba(0,0,0,.15)', border: `1px solid ${alpha('#000000', 0.08)}`,
        }} />
      ))}
      <div style={{ position: 'absolute', left: '50%', top: '54%', width: '66vmin', height: 3, translate: '-50% -50%', background: o.twine, opacity: go ? 0 : 1, transition: t('opacity .3s') }} />
      <div style={{ position: 'absolute', left: '50%', top: '54%', width: '14vmin', height: '14vmin', translate: '-50% -50%', borderRadius: '50%', background: o.wax, boxShadow: '0 3px 8px rgba(0,0,0,.3)', opacity: go ? 0 : 1, transition: t('opacity .3s') }} />
    </div>
  )
}

export const ANNIV = {
  locket: (p) => <Locket {...p} />,
  album: (p) => <Album {...p} />,
  paper: (p) => <Paper {...p} />,
  flash: (p) => <Flash {...p} />,
  letters: (p) => <Letters {...p} />,
}
