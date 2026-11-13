/* eslint-disable react-refresh/only-export-components -- örtük xəritəsi: { növ: (props) => JSX } */
import { alpha } from '../../useInvitation'

/* AÇILIŞ / TƏQDİMAT — açılış örtükləri
   ribbon  Ribbon Cut     — zümrüd qapılar önündə qırmızı lent; lent kəsilir, yarılar düşür, qapılar açılır
   awning  Bistro Sign    — zolaqlı tente, asma lövhə yellənir və çevrilir, sonra hər şey yuxarı qalxır
   shutter Roller Shutter — büzməli metal jalüz yuxarı qalxır, içəridən isti işıq düşür
   box     Unboxing       — premium qutunun qapağı uçur, içəridən işıq şüaları yayılır
   cloth   Gallery Unveil — zərli çərçivənin məxmər örtüyü aşağı sürüşüb düşür */

export const OPEN_CSS = `
@keyframes lxo2-swing { 0%,100% { rotate: -5deg } 50% { rotate: 5deg } }
@keyframes lxo2-rays { to { rotate: 360deg } }
`

function Ribbon({ o, go, t }) {
  const door = (left) => ({
    position: 'absolute', top: o.lintel ? '24svh' : 0, bottom: 0, width: '50%', [left ? 'left' : 'right']: 0, transformOrigin: left ? '0 50%' : '100% 50%',
    transform: go ? `perspective(1400px) rotateY(${left ? -95 : 95}deg)` : 'none', transition: t('transform 2.2s cubic-bezier(.7,0,.25,1) .8s'),
    background: [`linear-gradient(${left ? 90 : 270}deg, transparent 85%, ${alpha('#000000', 0.3)})`, `linear-gradient(180deg, ${o.emerald}, ${o.deep})`].join(', '),
  })
  const panel = { position: 'absolute', left: '16%', right: '16%', border: `2px solid ${alpha(o.gold, 0.8)}`, boxShadow: `inset 0 0 0 5px ${alpha(o.deep, 0.5)}, inset 0 0 0 6px ${alpha(o.gold, 0.4)}` }
  const half = (left) => ({ position: 'absolute', top: '52%', height: '5vmin', width: '50%', [left ? 'left' : 'right']: 0, background: `linear-gradient(180deg, ${o.red}, ${alpha(o.red, 0.85)})`, boxShadow: '0 4px 8px rgba(0,0,0,.25)', transformOrigin: left ? '0 50%' : '100% 50%', transform: go ? `rotate(${left ? 70 : -70}deg)` : 'none', opacity: go ? 0 : 1, transition: t('transform .9s cubic-bezier(.5,0,.6,1) .15s, opacity .5s .8s') })
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      {o.lintel && <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '24svh', background: `linear-gradient(180deg, ${o.lintel}, ${alpha(o.lintel, 0.96)})`, borderBottom: `3px solid ${o.gold}`, boxShadow: '0 6px 14px rgba(0,0,0,.18)', opacity: go ? 0 : 1, transition: t('opacity 1.2s ease 1.4s') }} />}
      <div style={door(true)}><div style={{ ...panel, top: '10%', height: '34%' }} /><div style={{ ...panel, bottom: '10%', height: '34%' }} /></div>
      <div style={door(false)}><div style={{ ...panel, top: '10%', height: '34%' }} /><div style={{ ...panel, bottom: '10%', height: '34%' }} /></div>
      <div style={half(true)} /><div style={half(false)} />
      <div style={{ position: 'absolute', left: '50%', top: 'calc(52% + 2.5vmin)', width: '18vmin', height: '12vmin', translate: '-50% -50%', opacity: go ? 0 : 1, transition: t('opacity .3s .1s') }}>
        <span style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', borderRadius: '50% 10% 10% 50%', background: o.red, boxShadow: 'inset -4px 0 6px rgba(0,0,0,.25)' }} />
        <span style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', borderRadius: '10% 50% 50% 10%', background: o.red, boxShadow: 'inset 4px 0 6px rgba(0,0,0,.25)' }} />
      </div>
    </div>
  )
}

function Awning({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, transform: go ? 'translateY(-105%)' : 'none', transition: t('transform 1.8s cubic-bezier(.7,0,.25,1) .7s'), background: alpha(o.wall, 0.94) }}>
      {/* tente yazının üstündə bitir (16svh «TƏNTƏNƏLİ AÇILIŞ»-ı örtürdü) */}
      <svg viewBox="0 0 100 26" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, width: '100%', height: '6svh' }}>
        <defs><pattern id="lxo2-aw" width="12.5" height="26" patternUnits="userSpaceOnUse"><rect width="6.25" height="26" fill={o.green} /><rect x="6.25" width="6.25" height="26" fill={o.cream} /></pattern></defs>
        <path d="M0 0H100V18Q93.75 26 87.5 18 81.25 26 75 18 68.75 26 62.5 18 56.25 26 50 18 43.75 26 37.5 18 31.25 26 25 18 18.75 26 12.5 18 6.25 26 0 18Z" fill="url(#lxo2-aw)" />
      </svg>
      <div style={{ position: 'absolute', left: '50%', top: '30%', transformOrigin: '50% 0', translate: '-50% 0', animation: instant ? undefined : 'lxo2-swing 2.4s ease-in-out infinite' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '44vmin', height: '9vmin', margin: '0 auto', borderLeft: `1px solid ${o.gold}`, borderRight: `1px solid ${o.gold}` }} />
        <div style={{ width: '56vmin', height: '24vmin', display: 'grid', placeItems: 'center', background: o.green, border: `3px solid ${o.gold}`, boxShadow: '0 10px 20px rgba(0,0,0,.25)', transform: go ? 'rotateY(180deg)' : 'none', transition: t('transform .7s ease') }}>
          <span style={{ fontFamily: o.font, fontSize: '7vmin', color: o.cream, letterSpacing: '.08em' }}>{o.word || '✦ ✦ ✦'}</span>
        </div>
      </div>
    </div>
  )
}

function Shutter({ o, go, t }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
      {o.housing && <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '22svh', background: `linear-gradient(180deg, ${o.housing}, ${alpha(o.housing, 0.94)})`, borderBottom: `4px solid ${alpha('#000000', 0.45)}`, opacity: go ? 0 : 1, transition: t('opacity 1.2s ease 1.6s') }} />}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(60% 40% at 50% 70%, ${alpha(o.warm, 0.35)}, transparent 70%)`, opacity: go ? 1 : 0, transition: t('opacity 1.6s .4s') }} />
      <div style={{ position: 'absolute', inset: o.housing ? '22svh 0 0 0' : 0, transformOrigin: '50% 0', transform: go ? 'scaleY(0.02)' : 'none', transition: t('transform 2.2s cubic-bezier(.6,0,.3,1) .1s'),
        background: [`repeating-linear-gradient(180deg, ${alpha('#FFFFFF', 0.25)} 0 2px, ${alpha('#000000', 0.18)} 2px 4px, transparent 4px 22px, ${alpha('#000000', 0.25)} 22px 24px)`, `linear-gradient(90deg, ${o.steel}, #D9DCDF 50%, ${o.steel})`].join(', ') }}>
        <div style={{ position: 'absolute', left: '50%', bottom: '6%', width: '20vmin', height: '3vmin', translate: '-50% 0', borderRadius: 4, background: '#41464B' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '5svh', background: '#3A3F44', boxShadow: '0 4px 10px rgba(0,0,0,.3)' }} />
    </div>
  )
}

function Box({ o, go, t, instant }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.bg, 0.94), transition: t('background 1.4s .9s') }}>
      <div style={{ position: 'absolute', left: '50%', top: '58%', width: '140vmax', height: '140vmax', translate: '-50% -50%', background: `repeating-conic-gradient(${alpha(o.glow, 0.35)} 0 6deg, transparent 6deg 18deg)`, opacity: go ? 1 : 0, transition: t('opacity .6s .3s'), animation: instant ? undefined : 'lxo2-rays 12s linear infinite', maskImage: 'radial-gradient(circle, #000 10%, transparent 55%)', WebkitMaskImage: 'radial-gradient(circle, #000 10%, transparent 55%)' }} />
      <div style={{ position: 'absolute', left: '50%', top: '62%', width: '56vmin', height: '40vmin', translate: '-50% 0', background: `linear-gradient(160deg, ${o.box}, ${alpha(o.box, 0.8)})`, boxShadow: '0 30px 50px -20px rgba(0,0,0,.45)', transform: go ? 'translateY(40svh)' : 'none', opacity: go ? 0 : 1, transition: t('transform 1.4s ease .6s, opacity 1s ease .8s') }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '6vmin', translate: '-50% 0', background: o.ribbon }} />
      </div>
      <div style={{ position: 'absolute', left: '50%', top: 'calc(62% - 9vmin)', width: '62vmin', height: '10vmin', translate: '-50% 0', background: `linear-gradient(160deg, ${o.box}, ${alpha(o.box, 0.85)})`, boxShadow: '0 8px 16px rgba(0,0,0,.25)', transform: go ? 'translateY(-90svh) rotate(18deg)' : 'none', transition: t('transform 1.4s cubic-bezier(.5,0,.3,1)') }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '6vmin', translate: '-50% 0', background: o.ribbon }} />
      </div>
    </div>
  )
}

function Cloth({ o, go, t }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: go ? 'transparent' : alpha(o.wall, 0.92), transition: t('background 1.2s 1.2s') }} />
      <div style={{ position: 'absolute', inset: '26svh 12% 16%', border: `2.4vmin solid ${o.gold}`, boxShadow: `inset 0 0 0 1vmin ${alpha('#000000', 0.15)}, 0 20px 40px rgba(0,0,0,.25)`, opacity: go ? 0 : 1, transition: t('opacity 1s 1.3s') }}>
        <div style={{ position: 'absolute', inset: -2, transformOrigin: '50% 100%', transform: go ? 'translateY(110%) scaleY(.6)' : 'none', transition: t('transform 1.6s cubic-bezier(.6,0,.4,1)'),
          background: [`repeating-linear-gradient(90deg, ${alpha('#000000', 0.22)} 0, ${alpha('#FFFFFF', 0.06)} 4%, ${alpha('#000000', 0.16)} 8%, ${alpha('#000000', 0.3)} 12%)`, `linear-gradient(180deg, ${o.velvet}, ${alpha(o.velvet, 0.9)})`].join(', '), borderRadius: '0 0 50% 50% / 0 0 6% 6%' }} />
      </div>
    </div>
  )
}

export const OPEN = {
  ribbon: (p) => <Ribbon {...p} />,
  awning: (p) => <Awning {...p} />,
  shutter: (p) => <Shutter {...p} />,
  box: (p) => <Box {...p} />,
  cloth: (p) => <Cloth {...p} />,
}
