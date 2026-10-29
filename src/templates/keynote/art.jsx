import { C, GLOW } from './palette'

/* KEYNOTE — səhnə dekoru */

/** Səhnə ekranı — `on` olanda yanır (CRT kimi: əvvəl xətt, sonra bütöv) */
export function Screen({ on = true, instant = false, children, style }) {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', borderRadius: 14, padding: 3, background: on ? GLOW : C.LINE, boxShadow: on ? '0 0 60px -10px rgba(61,123,255,.6), 0 30px 50px -30px rgba(0,0,0,.9)' : '0 30px 50px -30px rgba(0,0,0,.9)', transition: instant ? 'none' : 'background .3s ease .5s, box-shadow .6s ease .5s', ...style }}>
      <div style={{ position: 'relative', height: '100%', borderRadius: 11, overflow: 'hidden', background: '#04070F' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: `radial-gradient(90% 70% at 30% 20%, rgba(61,123,255,.55), transparent 60%), radial-gradient(80% 70% at 85% 90%, rgba(34,211,238,.4), transparent 60%), ${C.NAVY}`, transformOrigin: '50% 50%', transform: on ? 'scale(1)' : 'scale(1, .004)', opacity: on ? 1 : 0, transition: instant ? 'none' : 'transform .5s cubic-bezier(.7,0,.3,1) .15s, opacity .1s linear .1s' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(180deg, rgba(255,255,255,.035) 0 1px, transparent 1px 3px)' }} />
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 7%' }}>{children}</div>
      </div>
    </div>
  )
}

/** Canlı yayım nöqtəsi */
export function LiveDot({ label = 'LIVE', font, color = '#FF4D5E' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,77,94,.12)', border: `1px solid ${color}55`, fontFamily: font, fontSize: 11.5, fontWeight: 500, letterSpacing: '.14em', color }}>
      <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: color, animation: 'kn-live 1.4s ease-in-out infinite' }} />
      {label}
    </span>
  )
}

/** Projektor şüaları */
export function Beams({ on = true, instant = false }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: on ? 1 : 0.25, transition: instant ? 'none' : 'opacity .8s ease .5s' }}>
      {[[-18, 18], [118, -18]].map(([x, r], i) => (
        <span key={i} style={{ position: 'absolute', left: `${x}%`, top: '-10%', width: '60%', height: '120%', transformOrigin: '50% 0', transform: `translateX(-50%) rotate(${r}deg)`, background: 'linear-gradient(180deg, rgba(120,170,255,.28), rgba(120,170,255,0) 70%)', clipPath: 'polygon(46% 0, 54% 0, 100% 100%, 0 100%)', filter: 'blur(2px)' }} />
      ))}
    </div>
  )
}

/** Konfrans bəyi (lanyard badge) */
export function Badge({ name, role, children, head, mono, style }) {
  return (
    <div style={{ position: 'relative', width: 230, margin: '0 auto', paddingTop: 70, ...style }}>
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, width: 26, height: 80, marginLeft: -13, background: `repeating-linear-gradient(180deg, ${C.BLUE} 0 10px, ${C.CYAN} 10px 20px)`, clipPath: 'polygon(0 0, 100% 0, 70% 100%, 30% 100%)' }} />
      <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 62, width: 34, height: 16, marginLeft: -17, borderRadius: 4, background: '#9AA6BF', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.2)' }} />
      <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: C.WHITE, boxShadow: '0 30px 50px -24px rgba(0,0,0,.8)' }}>
        <div style={{ height: 54, background: GLOW, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span aria-hidden="true" style={{ width: 40, height: 8, borderRadius: 999, background: 'rgba(6,10,20,.35)' }} />
        </div>
        <div style={{ padding: '16px 16px 18px', textAlign: 'center', color: C.VOID }}>
          {name && <div style={{ fontFamily: head, fontWeight: 500, fontSize: 19, lineHeight: 1.2, overflowWrap: 'anywhere' }}>{name}</div>}
          {role && <div style={{ marginTop: 4, fontFamily: mono, fontSize: 11.5, letterSpacing: '.16em', textTransform: 'uppercase', color: C.FAINT }}>{role}</div>}
          {children}
        </div>
      </div>
    </div>
  )
}
