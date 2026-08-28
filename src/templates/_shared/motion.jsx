import { useEffect, useRef, useState } from 'react'
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

/* ═══════════════════════════════════════════════════════════════════════════
   AMBIENT — dəvətnamənin daxili arxa fonu («Açılış Ekranı düzəliş V1»)

   Design-də hər şablonun scroll edilən hissəsi düz rəngli fon deyil: üstündə
   çox yavaş gəzişən işıq ləkələri, qalxan zərrəciklər, keçən şüa qatı var.
   Qat `TemplateShell › ambientBlend` ilə blend rejimində məzmunun üstündədir.

   ⚠ Bütün hərəkət 5–30 saniyəlik dövrlərlə gedir — göz onu «hərəkət» kimi
   deyil, «canlı fon» kimi oxuyur. Sürətləndirmək dizaynı ucuzlaşdırır.
   ⚠ `prefers-reduced-motion` TemplateShell-in qlobal qaydası ilə söndürülür.
   ═══════════════════════════════════════════════════════════════════════════ */

const AMBIENT_KEYFRAMES = `
@keyframes ab-wander { 0%,100% { transform:translate3d(0,0,0) } 33% { transform:translate3d(26px,-34px,0) } 66% { transform:translate3d(-22px,20px,0) } }
@keyframes ab-pulse  { 0%,100% { opacity:.28 } 50% { opacity:.72 } }
@keyframes ab-rot    { from { transform:rotate(0) } to { transform:rotate(360deg) } }
@keyframes ab-orbit  { from { transform:rotate(0) translateX(58px) rotate(0) } to { transform:rotate(360deg) translateX(58px) rotate(-360deg) } }
@keyframes ab-up     { 0% { transform:translate3d(0,110%,0); opacity:0 } 12% { opacity:1 } 100% { transform:translate3d(-18px,-20%,0); opacity:0 } }
@keyframes ab-fall   { 0% { transform:translate3d(0,-14%,0) rotate(0); opacity:0 } 12% { opacity:.85 } 100% { transform:translate3d(-48px,114%,0) rotate(280deg); opacity:0 } }
@keyframes ab-beam   { 0% { transform:translateX(-60%) skewX(-14deg); opacity:0 } 20% { opacity:.85 } 100% { transform:translateX(220%) skewX(-14deg); opacity:0 } }
@keyframes ab-scan   { 0% { transform:translateY(-30%); opacity:0 } 18% { opacity:1 } 78% { opacity:1 } 100% { transform:translateY(130%); opacity:0 } }
@keyframes ab-shard  { 0%,100% { transform:translate3d(0,0,0) rotate(0); opacity:.35 } 50% { transform:translate3d(14px,-22px,0) rotate(18deg); opacity:.7 } }
@keyframes ab-ribbon { 0%,100% { transform:translateY(0) scaleY(1) } 50% { transform:translateY(-14px) scaleY(1.08) } }
@keyframes ab-shoot  { 0% { transform:translate3d(0,0,0); opacity:0 } 5% { opacity:.9 } 26% { opacity:0 } 100% { transform:translate3d(210px,150px,0); opacity:0 } }
@keyframes ab-twinkle{ 0%,100% { opacity:.15 } 50% { opacity:.9 } }
@keyframes ab-leaf   { 0% { transform:translate3d(0,-14%,0) rotate(-30deg); opacity:0 } 14% { opacity:.75 } 86% { opacity:.75 } 100% { transform:translate3d(-64px,118%,0) rotate(220deg); opacity:0 } }
@keyframes ab-sway   { 0%,100% { transform:translateX(-9px) rotate(-1.6deg) } 50% { transform:translateX(9px) rotate(1.6deg) } }
@keyframes ab-diag   { 0% { transform:translate3d(-70%,-70%,0) } 100% { transform:translate3d(70%,70%,0) } }
`

/** Deterministik psevdo-təsadüf — hər render eyni yerləşdirmə (jitter yoxdur). */
function abHash(n) { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x) }

/**
 * Ambient kökü — keyframe-ləri bir dəfə yerləşdirir və uşaqları örtük qata alır.
 * `TemplateShell › ambient` propuna verilir; mövqeləmə Shell-in öz qatındadır.
 */
export function Ambient({ children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <style>{AMBIENT_KEYFRAMES}</style>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   AMBIENT LAYER — ambient qatının DAŞIYICISI (fixed qat + parallaks + qoruma)

   ⚠⚠ PERFORMANS — Phase 30-dakı DONMANIN kök səbəbi məhz bu qat idi.

   Qat `position:fixed; inset:0` ilə bütün ekranı tutur. Phase 30-da üzərinə
   `mix-blend-mode` qoyulmuşdu. Blend arxa fonun qatla BİRLİKDƏ rasterləşməsini
   tələb edir — nəticədə brauzer qatın içindəki HEÇ BİR elementi ayrıca GPU
   qatına qaldıra bilmir və hər animasiya kadrında BÜTÜN ekran yenidən çəkilir.
   Qat 20 saniyəlik sonsuz animasiyalar saxladığı üçün bu, dəvətnamə açıq
   qaldığı MÜDDƏTCƏ davam edirdi.

   Canlı ölçmə (digitoy.az, oriental-luxe, 390x844@3x, 6x CPU throttle,
   eyni məzmun — yalnız blend açılıb-bağlanır):
       blend AÇIQ  → 36 fps, ən pis kadr 135 ms
       blend BAĞLI → 58 fps, ən pis kadr  40 ms
   20x throttle-da (ucuz Android) blend açıq olanda 40 saniyənin 30 saniyəsi
   bloklanmış əsas axın idi — telefon praktiki olaraq donurdu.

   Ona görə blend İŞLƏDİLMİR. Əvəzində:
     • screen (tünd şablonlar) → qat məzmunun ÜSTÜNDƏ qalır, adi alfa ilə.
       Tünd fonun üzərində `screen` ilə adi alfa nəticəsi göz üçün eynidir.
     • multiply (açıq şablonlar) → qat məzmunun ALTINA keçir. Açıq fonda
       üstdə qalsaydı, blend olmadan mətni ağardardı.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Qat özünü söndürəndən sonra bir daha qurulmur — sayğac yanıb-sönməsin. */
const AMBIENT_WATCH_DELAY = 1400   /* açılış revealləri bitsin, sonra ölç      */
const AMBIENT_WATCH_MS    = 2000   /* ölçmə pəncərəsi                         */
const AMBIENT_BUDGET_MS   = 34     /* ~30 fps — bundan pisdirsə qat yükdür    */

/**
 * Açıq-aydın zəif cihaz? Yalnız HƏR İKİ göstərici məlum və aşağı olanda —
 * normal telefonlar dizaynı itirməsin deyə qəsdən ehtiyatlı seçilib.
 * (iOS `deviceMemory` vermir → orada bu yoxlama işləmir, runtime keşiyi tutur.)
 */
function weakDevice() {
  if (typeof navigator === 'undefined') return false
  if (prefersReducedMotion()) return true
  const cores = navigator.hardwareConcurrency || 0
  const mem = navigator.deviceMemory || 0
  return cores > 0 && cores <= 4 && mem > 0 && mem <= 4
}

/**
 * Ambient qatı — fixed daşıyıcı + səhifə parallaksı + performans keşiyi.
 *
 * `below` — qat məzmunun ALTINDA (açıq fonlu şablonlar üçün).
 *
 * Keşik: qat quruldeqdan ~1.4 s sonra 2 saniyəlik kadr vaxtı ölçülür; medyan
 * kadr 34 ms-dən pisdirsə qat özünü söndürür. Bu, tanımadığımız zəif
 * telefonlarda dəvətnamənin donmamasına zəmanət verir — dizayn güclü
 * cihazlarda olduğu kimi qalır.
 */
export function AmbientLayer({ children, below = false, range = 54 }) {
  const [alive, setAlive] = useState(() => !weakDevice())

  useEffect(() => {
    if (!alive || prefersReducedMotion()) return
    let raf = 0
    let start = 0
    const frames = []
    let last = 0

    const tick = (now) => {
      if (!start) { start = now; last = now; raf = requestAnimationFrame(tick); return }
      const elapsed = now - start
      if (elapsed > AMBIENT_WATCH_DELAY) frames.push(now - last)
      last = now
      if (elapsed < AMBIENT_WATCH_DELAY + AMBIENT_WATCH_MS) {
        raf = requestAnimationFrame(tick)
        return
      }
      if (frames.length > 20) {
        frames.sort((a, b) => a - b)
        if (frames[Math.floor(frames.length / 2)] > AMBIENT_BUDGET_MS) setAlive(false)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => { if (raf) cancelAnimationFrame(raf) }
  }, [alive])

  if (!alive) return null

  return (
    <Parallax
      mode="page"
      range={range}
      style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        zIndex: below ? 0 : 3,
      }}
    >
      {children}
    </Parallax>
  )
}

/** Yavaş gəzişən bulanıq işıq ləkəsi — fonun «nəfəs alması». */
export function Blob({ color, w = '70%', h = '32%', blur = 40, duration = 21, delay = 0, reverse = false, ...pos }) {
  return (
    <span style={{
      position: 'absolute', width: w, height: h, borderRadius: '50%', ...pos,
      background: `radial-gradient(circle, ${color}, transparent 69%)`,
      filter: `blur(${blur}px)`,
      animation: `ab-wander ${duration}s ease-in-out ${delay}s infinite${reverse ? ' reverse' : ''}`,
    }} />
  )
}

/**
 * Zərrəcik sahəsi — qalxan qığılcım / düşən ləçək / sayrışan ulduz.
 * `kind`: 'up' | 'fall' | 'twinkle'.  Say mobil paint qiymətinə görə ≤ 24.
 */
export function Particles({ kind = 'up', count = 6, color, size = 2, seed = 0, minDur = 10, maxDur = 15, glow = true, shape }) {
  const n = Math.min(count, 24)
  return Array.from({ length: n }, (_, i) => {
    const r1 = abHash(seed + i + 1)
    const r2 = abHash(seed + i + 61)
    const r3 = abHash(seed + i + 131)
    const dur = (minDur + r2 * (maxDur - minDur)).toFixed(2)
    const delay = (r3 * (kind === 'twinkle' ? 3.4 : 14)).toFixed(2)
    const base = {
      position: 'absolute', left: `${(r1 * 96 + 2).toFixed(2)}%`,
      width: shape ? shape.w : size, height: shape ? shape.h : size,
      background: color,
      borderRadius: shape ? shape.radius : '50%',
      boxShadow: glow && !shape ? `0 0 ${size * 3.5}px ${color}` : undefined,
    }
    if (kind === 'up') {
      return <span key={i} style={{ ...base, bottom: '-4%', animation: `ab-up ${dur}s linear ${delay}s infinite` }} />
    }
    if (kind === 'fall') {
      return <span key={i} style={{ ...base, top: 0, animation: `ab-fall ${dur}s linear ${delay}s infinite` }} />
    }
    return <span key={i} style={{ ...base, top: `${(r2 * 92 + 4).toFixed(2)}%`, animation: `ab-twinkle ${dur}s ease-in-out ${delay}s infinite` }} />
  })
}

/** Şaquli işıq şüası — soldan sağa çox yavaş süzülür (Modern Black). */
export function Beam({ color, width = '22%', duration = 13, delay = 0 }) {
  return (
    <span style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width,
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      animation: `ab-beam ${duration}s cubic-bezier(.4,0,.6,1) ${delay}s infinite`,
    }} />
  )
}

/** Üfüqi tarama xətti — yuxarıdan aşağı sürüşür (Modern Black). */
export function Scan({ color, duration = 7.5, delay = 0 }) {
  return (
    <span style={{
      position: 'absolute', left: 0, right: 0, top: 0, height: 1,
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      animation: `ab-scan ${duration}s cubic-bezier(.4,0,.6,1) ${delay}s infinite`,
    }} />
  )
}

/** Mərkəzdən dönən halqa — şərq/lüks şablonların girih hərəkəti. */
export function RotRing({ color, size = 330, top = '38%', duration = 48, dashed = false, reverse = false }) {
  return (
    <span style={{
      position: 'absolute', left: '50%', top, width: size, height: size,
      margin: `${-size / 2}px 0 0 ${-size / 2}px`, borderRadius: '50%',
      border: `1px ${dashed ? 'dashed' : 'solid'} ${color}`,
      animation: `ab-rot ${duration}s linear infinite${reverse ? ' reverse' : ''}`,
    }} />
  )
}
