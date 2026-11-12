import { Children, useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   VIRAL — «viral video» toy şablonlarının ortaq HƏRƏKƏT qatı (2026-11)

   Şam və Üzük, Gəlin, İlk Rəqs. Tələb: «hər şey hərəkətli
   olsun, sadəcə şəkil qoyma» və dəvətnamənin ekran yazısı özü Reels/TikTok
   videosu olsun. Bütün təsvirlər REAL fotodur (public/img/wedding/viral) —
   kodla çəkilmiş illüstrasiya yoxdur; kod yalnız hərəkəti verir:
     Words    — mətn söz-söz, bulanıqdan aydına açılır
     Letters  — ad hərf-hərf (sözün ortasından sətrə bölünmür)
     Rise     — blok görünəndə yuxarı qalxaraq üzə çıxır
     Photo    — daimi yavaş Ken Burns + sürüşdürmədə parallaks + pərdə kimi açılma
     Roll     — fırlanan rəqəmlər (sayğac)
     Dust     — havada üzən işıq/toz zərrəcikləri (canvas)
     Sparks   — fişəng qığılcımları, fotodakı nöqtəyə bağlanır (canvas)
     Confetti — konfeti yağışı (canvas)
     Burst    — bir anlıq qığılcım partlayışı (məs. RSVP göndəriləndə)
     Reel     — özü sürüşən foto lenti
     Flicker  — şam işığının titrəməsi

   ⚠ `prefers-reduced-motion`: canvas effektləri ümumiyyətlə başlamır,
     CSS hərəkəti VIRAL_CSS-in sonundakı qayda ilə söndürülür.
   ⚠ Canvas-lar görünmədikdə (IntersectionObserver) çəkməni dayandırır —
     telefon batareyası və isti üçün.
   ⚠ Hərf/söz animasiyası `translate`/`scale` ayrıca xassələrini işlədir,
     `transform`-a toxunmur (index.css › TEMPLATE MOTION SYSTEM ilə toqquşmasın).
   ───────────────────────────────────────────────────────────────────────── */

import { reduced, useInView } from './viralHooks'

/** Mətn söz-söz açılır. `text` sətir olmalıdır. */
export function Words({ text, as: Tag = 'div', step = 0.05, delay = 0, style, className }) {
  const [ref, seen] = useInView()
  const parts = String(text || '').split(/(\s+)/)
  let i = 0
  return (
    <Tag ref={ref} className={[className, seen ? 'vr-in' : ''].filter(Boolean).join(' ')} style={style}>
      {parts.map((w, k) => (/^\s+$/.test(w) || !w ? w : (
        <span key={k} className="vr-w" style={{ transitionDelay: `${(delay + (i++) * step).toFixed(2)}s` }}>{w}</span>
      )))}
    </Tag>
  )
}

/** Ad hərf-hərf açılır (`on` olanda). Hərflər söz-söz nowrap qutuya yığılır. */
export function Letters({ text, on, delay = 0, step = 0.08, style, as: Tag = 'span' }) {
  let i = 0
  const words = String(text || '').split(' ')
  return (
    <Tag className={on ? 'vr-on' : ''} style={style}>
      {words.map((w, wi) => (
        <span key={wi}>
          {wi > 0 && ' '}
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(w).map((ch, ci) => (
              <span key={ci} className="vr-l" style={{ transitionDelay: `${(delay + (i++) * step).toFixed(2)}s` }}>{ch}</span>
            ))}
          </span>
        </span>
      ))}
    </Tag>
  )
}

/** Blok görünəndə qalxır; `delay` saniyə */
export function Rise({ children, as: Tag = 'div', delay = 0, style, className }) {
  const [ref, seen] = useInView()
  return (
    <Tag ref={ref} className={['vr-rise', seen ? 'vr-in' : '', className].filter(Boolean).join(' ')} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </Tag>
  )
}

/** Uşaqları bir-bir qaldırır (siyahılar üçün) */
export function Stagger({ children, step = 0.12, style, as: Tag = 'div' }) {
  return (
    <Tag style={style}>
      {Children.toArray(children).map((c, i) => <Rise key={i} delay={i * step}>{c}</Rise>)}
    </Tag>
  )
}

/** Parallaks: sürüşdürdükcə uşağı `speed` nisbətində yerdəyişir */
function useParallax(speed) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !speed || reduced()) return undefined
    let raf = 0
    const run = () => {
      raf = 0
      const host = el.parentElement
      if (!host) return
      const r = host.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      const k = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
      el.style.translate = `0 ${(k * -speed * 100).toFixed(2)}%`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run) }
    window.addEventListener('scroll', onScroll, { passive: true })
    run()
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [speed])
  return ref
}

/**
 * Real foto: Ken Burns + parallaks + pərdə kimi açılma.
 * `focus` — object-position və yaxınlaşma mərkəzi ('50% 40%').
 */
export function Photo({ src, alt = '', focus = '50% 50%', par = 0.12, kb = true, wipe = true, style, imgStyle, children }) {
  const [ref, seen] = useInView(0.12)
  const pref = useParallax(par)
  return (
    <div ref={ref} className={wipe ? `vr-wipe${seen ? ' vr-in' : ''}` : undefined} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <div ref={pref} style={{ position: 'absolute', inset: par ? '-10% 0' : 0 }}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className={kb ? 'vr-kb' : undefined}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: focus, transformOrigin: focus, display: 'block', ...imgStyle }} />
      </div>
      {children}
    </div>
  )
}

/** Fırlanan rəqəmlər — `value` rəqəm və ya rəqəmlərdən ibarət sətir */
export function Roll({ value, style }) {
  const digits = String(value ?? '').split('')
  return (
    <span aria-label={String(value ?? '')} style={{ display: 'inline-flex', overflow: 'hidden', lineHeight: 1, height: '1em', verticalAlign: 'top', fontVariantNumeric: 'tabular-nums', ...style }}>
      {digits.map((d, i) => (/\d/.test(d) ? (
        <span key={digits.length - i} className="vr-rc" aria-hidden="true">
          <span className="vr-rs" style={{ transform: `translateY(${-Number(d) * 10}%)` }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <span key={n} style={{ display: 'block', height: '1em' }}>{n}</span>)}
          </span>
        </span>
      ) : <span key={`s${i}`} aria-hidden="true">{d}</span>))}
    </span>
  )
}

/* ── Canvas köməkçisi: ölçü, DPR, görünürlük, kadr dövrü ── */
function useCanvasLoop(draw, deps, { active = true } = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !active || reduced()) return undefined
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const box = { w: 0, h: 0 }
    const size = () => {
      box.w = canvas.clientWidth; box.h = canvas.clientHeight
      canvas.width = Math.max(1, box.w * dpr); canvas.height = Math.max(1, box.h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()
    window.addEventListener('resize', size)
    let vis = true
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver((e) => { vis = e[0].isIntersecting }) : null
    io?.observe(canvas)
    const step = draw(ctx, box)
    let raf = 0
    let alive = true
    const loop = () => {
      if (!alive) return
      raf = requestAnimationFrame(loop)
      if (vis && step(ctx, box) === false) { alive = false; ctx.clearRect(0, 0, box.w, box.h) }
    }
    raf = requestAnimationFrame(loop)
    return () => { alive = false; cancelAnimationFrame(raf); window.removeEventListener('resize', size); io?.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ...deps])
  return ref
}

const fill = { position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }

/** Havada üzən işıq zərrəcikləri. `color` — '255,214,160' (rgb hissələri) */
export function Dust({ count = 30, color = '232,196,128', alpha: A = 0.7, rise = 0.25, min = 0.6, max = 2.2, style }) {
  const ref = useCanvasLoop((ctx, box) => {
    const mk = (y) => ({ x: Math.random() * box.w, y: y ?? Math.random() * box.h, r: min + Math.random() * max, vy: -(rise * (0.4 + Math.random())), vx: (Math.random() - 0.5) * 0.18, a: Math.random() * 6, s: 0.004 + Math.random() * 0.01, ph: Math.random() * 6.28 })
    const ps = Array.from({ length: count }, () => mk())
    return () => {
      ctx.clearRect(0, 0, box.w, box.h)
      for (const p of ps) {
        p.y += p.vy; p.ph += 0.01; p.x += p.vx + Math.sin(p.ph) * 0.12; p.a += p.s
        if (p.y < -10) Object.assign(p, mk(box.h + 10))
        const al = (Math.sin(p.a) * 0.5 + 0.5) * A
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        g.addColorStop(0, `rgba(${color},${al})`); g.addColorStop(1, `rgba(${color},0)`)
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill()
      }
    }
  }, [count, color, A, rise, min, max])
  return <canvas ref={ref} aria-hidden="true" style={{ ...fill, ...style }} />
}

/** Fişəng qığılcımları. `at()` → [[x, y], …] (0..1), `on=false` → yeni qığılcım yoxdur */
export function Sparks({ at, on = true, rate = 6, speed = 4, spread = 6.2, style }) {
  const onRef = useRef(on)
  useEffect(() => { onRef.current = on }, [on])
  const ref = useCanvasLoop((ctx, box) => {
    let ps = []
    return () => {
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, box.w, box.h)
      if (onRef.current) {
        for (const [ex, ey] of at()) {
          for (let i = 0; i < rate; i++) {
            const a = -Math.PI / 2 + (Math.random() - 0.5) * spread, v = 1 + Math.random() * speed
            ps.push({ x: ex * box.w + (Math.random() - 0.5) * 4, y: ey * box.h, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, d: 0.012 + Math.random() * 0.02 })
          }
        }
      }
      ctx.globalCompositeOperation = 'lighter'
      ps = ps.filter((p) => p.l > 0)
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vx *= 0.99; p.l -= p.d
        ctx.strokeStyle = `rgba(255,${(190 + Math.random() * 50) | 0},${(110 + Math.random() * 60) | 0},${p.l})`
        ctx.lineWidth = 1.2
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5); ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
    }
  }, [rate, speed, spread])
  return <canvas ref={ref} aria-hidden="true" style={{ ...fill, ...style }} />
}

/** Konfeti. `loop=false` → bir dəfə yağır və bitir */
export function Confetti({ count = 60, loop = false, colors = ['#F5C66B', '#EAD7B7', '#FFFFFF', '#C98B8B'], alpha: A = 0.9, active = true, style }) {
  const key = colors.join(',')
  const ref = useCanvasLoop((ctx, box) => {
    const mk = (y) => ({ x: Math.random() * box.w, y: y ?? -20 - Math.random() * box.h, w: 4 + Math.random() * 6, h: 6 + Math.random() * 10, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.2, vy: 0.8 + Math.random() * 1.6, sw: Math.random() * 6.28, c: colors[(Math.random() * colors.length) | 0] })
    const ps = Array.from({ length: count }, () => mk(loop ? Math.random() * box.h : undefined))
    return () => {
      ctx.clearRect(0, 0, box.w, box.h)
      let alive = 0
      for (const p of ps) {
        p.y += p.vy; p.sw += 0.03; p.x += Math.sin(p.sw) * 0.8; p.r += p.vr
        if (p.y > box.h + 20) { if (loop) Object.assign(p, mk(-20)); else continue }
        alive++
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.scale(1, Math.cos(p.sw * 2))
        ctx.fillStyle = p.c; ctx.globalAlpha = A; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore()
      }
      return loop || alive > 0
    }
  }, [count, loop, key, A], { active })
  return <canvas ref={ref} aria-hidden="true" style={{ ...fill, ...style }} />
}

/** Qığılcım partlayışı — `fire` dəyişəndə (sayğac) bir dəfə partlayır */
export function Burst({ fire, color = '214,173,107', style }) {
  const ref = useCanvasLoop((ctx, box) => {
    const cx = box.w / 2, cy = Math.min(box.h / 2, 140)
    const ps = Array.from({ length: 70 }, () => { const a = Math.random() * 6.283, v = 1.5 + Math.random() * 4.5; return { x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, r: 0.8 + Math.random() * 2.2, l: 1 } })
    return () => {
      ctx.clearRect(0, 0, box.w, box.h)
      let alive = 0
      for (const p of ps) {
        if (p.l <= 0) continue
        alive++; p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.vx *= 0.985; p.l -= 0.012
        ctx.fillStyle = `rgba(${color},${p.l})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill()
      }
      return alive > 0
    }
  }, [fire, color], { active: !!fire })
  return <canvas ref={ref} aria-hidden="true" style={{ ...fill, zIndex: 5, ...style }} />
}

/** Özü sürüşən foto lenti */
export function Reel({ photos, height = 300, gap = 10, seconds = 38, imgStyle, onError }) {
  const list = [...photos, ...photos]
  return (
    <div aria-hidden="true" style={{ overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', gap, width: 'max-content', animation: reduced() ? 'none' : `vr-reel ${seconds}s linear infinite` }}>
        {list.map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" decoding="async" onError={onError} style={{ height, width: 'auto', aspectRatio: '3 / 4', objectFit: 'cover', flex: 'none', display: 'block', ...imgStyle }} />
        ))}
      </div>
    </div>
  )
}

/** Şam işığının titrəməsi — isti işıq ləkəsi, opacity təsadüfi dəyişir */
export function Flicker({ at = '40% 38%', color = '255,180,100', strength = 0.4, style }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return undefined
    let v = 0.6, t = 0, raf = 0
    const tick = () => {
      v = Math.max(0.35, Math.min(1, v + (Math.random() - 0.5) * 0.18))
      el.style.opacity = v.toFixed(2)
      t = setTimeout(() => { raf = requestAnimationFrame(tick) }, 60 + Math.random() * 90)
    }
    tick()
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} aria-hidden="true" style={{ ...fill, mixBlendMode: 'screen', background: `radial-gradient(circle at ${at}, rgba(${color},${strength}), transparent 55%)`, ...style }} />
}
