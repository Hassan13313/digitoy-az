import { useEffect, useRef } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE MOTION — 9 şablonun ortaq hərəkət qatının JS tərəfi.

   CSS tərəfi `src/index.css` › «TEMPLATE MOTION SYSTEM» blokundadır. Burada
   yalnız üç şey var: hansı şablonun hansı istiqamətdən girdiyi, reveal/stagger
   konteynerləri və parallaks.

   ⚠ Bütün hərəkət `translate`/`scale` (reveal) və `transform` (press) kimi
   AYRI xassələrə bölünüb — bax index.css-dəki izah. Bu fayl heç vaxt
   `transform` yazmır ki, basma cavabı üzərinə yazılmasın.
   ───────────────────────────────────────────────────────────────────────── */

/* Beş giriş istiqaməti reyestr sırası ilə növbələnir — qonşu iki şablon heç
   vaxt eyni ritmdə açılmır, ona görə hər dəvətnamə fərqli hiss olunur. */
const ENTER = {
  'simple-luxury':  'up',
  'royal-gold':     'zoom',
  'floral-garden':  'left',
  'modern-black':   'right',
  'white-elegance': 'down',
  'night-sky':      'up',
  'oriental-luxe':  'zoom',
  'nature-touch':   'left',
  'crystal-glass':  'right',
}

/** templateId → giriş istiqaməti (`data-enter` üçün). */
export function enterDirection(templateId) {
  return ENTER[templateId] || 'up'
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && !!window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARALLAKS — qat scroll-a ƏKS istiqamətdə sürüşür.

   İki rejim:
     • element — qatın ekrandakı mövqeyinə görə (xəritə tile-ları, bölmə
                 içindəki işıq ləkələri). Konteyner scroll ilə yuxarı gedərkən
                 qat aşağı çəkilir → daha yavaş, daha uzaq görünür.
     • page    — `position: fixed` ambient qatlar üçün. Bunlar scroll ilə heç
                 hərəkət etmədiyi üçün element riyaziyyatı sıfır verir; burada
                 səhifə boyu ölçülmüş, `range` ilə məhdudlaşan sürüşmə var.

   ⚠ Yazılan xassə `translate`-dir: qatların öz `transform` animasiyaları
   (rg-drift / fg-drift / MapMosaic mərkəzləmə) toxunulmaz qalır.
   ═══════════════════════════════════════════════════════════════════════════ */
export function useParallax({ speed = 0.12, mode = 'element', range = 56, max = 44 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    let raf = 0
    const apply = () => {
      raf = 0
      let y
      if (mode === 'page') {
        const doc = document.documentElement
        const total = Math.max(1, doc.scrollHeight - window.innerHeight)
        const p = Math.min(1, Math.max(0, window.scrollY / total))
        y = -(p * range)
      } else {
        const r = el.getBoundingClientRect()
        const d = window.innerHeight / 2 - (r.top + r.height / 2)
        y = Math.max(-max, Math.min(max, d * speed))
      }
      el.style.translate = `0 ${y.toFixed(2)}px`
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      el.style.translate = ''
    }
  }, [speed, mode, range, max])

  return ref
}

/** Parallaks qatı — uşaqlarını sürüşən bir div-ə bükür. */
export function Parallax({ speed, mode, range, max, style, children, ...rest }) {
  const ref = useParallax({ speed, mode, range, max })
  return (
    <div ref={ref} style={style} {...rest}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   REVEAL — bölmə telefon ekranında görünəndə blur + sürüşmə ilə açılır.

   `stagger` (default açıq) bölmənin BİRBAŞA uşaqlarını 55ms addımla gətirir.
   Daha dərin sıralar üçün `<Stagger base={…}>` işlədilir.
   ═══════════════════════════════════════════════════════════════════════════ */
export function Reveal({ children, style, stagger = true, base, ...rest }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      data-reveal={visible ? 'in' : 'out'}
      data-stagger={stagger ? '' : undefined}
      style={base == null ? style : { ...style, '--tpl-base': `${base}ms` }}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * Daxili sıra — uşaqları 55ms addımla gətirir.
 * `base` bölmə başlığı kimi əvvəlki elementlərdən sonra başlamaq üçündür.
 * `as` — grid/flex konteynerin öz teqi (`ul`, `form`, `section`…).
 */
export function Stagger({ children, base = 55, as: Tag = 'div', style, ...rest }) {
  return (
    <Tag data-stagger="" style={{ ...style, '--tpl-base': `${base}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * Sayğac rəqəmi — dəyəri dəyişəndə pop animasiyası ilə yenilənir.
 * `key` mətnə bağlıdır: yalnız GÖRÜNƏN rəqəm dəyişəndə yenidən qurulur,
 * yəni saatlar/günlər saniyədə bir dəfə boş-yerə oynamır.
 */
/* ⚠ `pop` default FALSE-dur: `pop={pop}` şəklində undefined ötürüləndə
   destrukturizasiya defaultu qüvvəyə minir — true olsaydı bütün xanalar
   (gün/saat/dəqiqə) hər saniyə remount olub döyünərdi. */
export function PopDigit({ value, pad = 2, pop = false, style }) {
  const text = pad ? String(value).padStart(pad, '0') : String(value)
  return (
    <span key={pop ? text : undefined} data-pop={pop ? '' : undefined} style={style}>
      {text}
    </span>
  )
}
