import { useId } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   ROYAL GOLD — GUILLOCHE (qızıl gravür) QATI

   Banknot, sikkə və saat siferblatlarındakı torna-gravür naxışı riyazi
   əyrilərdən qurulur (hipotroxoid + dalğalı halqa). Şəkil faylı YOXDUR —
   hər şey modul yüklənəndə bir dəfə hesablanır.

   ⚠ PERFORMANS: hər naxış ailəsinin YALNIZ BİR əsas <path>-i var, qalan
   nüsxələr <use> + fırlanma/sürüşmədir. Faza sürüşməsi fırlanmaya bərabər
   olduğu üçün görüntü eynidir, DOM isə ~30 dəfə kiçikdir.
   ⚠ `pathLength="1"` — açılışda xəttin «həkk olunması» (stroke-dashoffset
   1 → 0) bütün nüsxələrdə eyni vaxtda bitir.
   ───────────────────────────────────────────────────────────────────────── */

const gcd = (a, b) => (b ? gcd(b, a % b) : a)
const n1 = (v) => Math.round(v * 10) / 10

/** Hipotroxoid — R böyük çevrə, r yuvarlanan çevrə, d qələmin məsafəsi */
function hypotrochoid(R, r, d, steps = 720) {
  const per = r / gcd(R, r)
  const N = steps * per
  const k = (R - r) / r
  let p = ''
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 2 * Math.PI * per
    const x = (R - r) * Math.cos(t) + d * Math.cos(k * t)
    const y = (R - r) * Math.sin(t) - d * Math.sin(k * t)
    p += (i ? 'L' : 'M') + n1(x) + ' ' + n1(y)
  }
  return p + 'Z'
}

/** Dalğalı halqa — r = r0 + a·sin(nθ) */
function wavyRing(r0, a, n, steps = 720) {
  let p = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI
    const r = r0 + a * Math.sin(n * t)
    p += (i ? 'L' : 'M') + n1(r * Math.cos(t)) + ' ' + n1(r * Math.sin(t))
  }
  return p + 'Z'
}

/** Üfüqi dalğa (lent/haşiyə üçün) */
function wave(width, amp, lambda, step = 2) {
  let p = ''
  for (let x = -lambda; x <= width + lambda; x += step) {
    p += (p ? 'L' : 'M') + x + ' ' + n1(amp * Math.sin((2 * Math.PI * x) / lambda))
  }
  return p
}

/* ── Əvvəlcədən hesablanmış əsas əyrilər (modul səviyyəsində, bir dəfə) ── */
const ROSE   = hypotrochoid(96, 6, 52)          /* əsas roza, radius 38…142 */
const ROSE_S = hypotrochoid(45, 5, 14)          /* kiçik daxili roza          */
const RING   = wavyRing(152, 4, 36, 540)        /* xarici banknot halqası     */
const DIAL   = wavyRing(116, 3, 48, 540)        /* xronoqraf daxili halqası   */
const BAND_W = 400
const BAND   = wave(BAND_W, 5, 30)

const GOLD_STOPS = [
  ['0', '#8C6A2C'], ['.28', '#E9CF8C'], ['.5', '#B98A3E'], ['.72', '#F3DE9E'], ['1', '#8C6A2C'],
]

function GoldGradient({ id }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      {GOLD_STOPS.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
    </linearGradient>
  )
}

/**
 * Medalyon rozeti.
 * @param size     px və ya CSS ölçüsü
 * @param draw     açılışda xətlər həkk olunsun (stroke-dashoffset animasiyası)
 * @param delay    çəkilişin başlanğıcı (s)
 * @param rings    xarici banknot halqası görünsün
 * @param inner    kiçik daxili roza
 * @param stroke   xəttin qalınlığı (viewBox vahidində)
 */
export function Rosette({
  size = 320, draw = false, delay = 0, rings = true, inner = true, rose: showRose = true,
  stroke = 0.55, opacity = 1, style = {}, className,
}) {
  const uid = useId().replace(/[:]/g, '')
  const g = `rgg${uid}`, rose = `rgr${uid}`, small = `rgs${uid}`, ring = `rgn${uid}`
  const drawStyle = (i, dur = 1.9) => (draw
    ? { strokeDasharray: 1, strokeDashoffset: 1, animation: `rg-draw ${dur}s cubic-bezier(.45,.05,.25,1) ${delay + i * 0.07}s forwards` }
    : undefined)

  return (
    <svg
      viewBox="-170 -170 340 340" width={size} height={size}
      aria-hidden="true" className={className}
      style={{ display: 'block', overflow: 'visible', opacity, ...style }}
    >
      <defs>
        <GoldGradient id={g} />
        {showRose && <path id={rose} d={ROSE} pathLength="1" />}
        {inner && <path id={small} d={ROSE_S} pathLength="1" />}
        {rings && <path id={ring} d={RING} pathLength="1" />}
      </defs>
      <g fill="none" stroke={`url(#${g})`}>
        {showRose && Array.from({ length: 10 }, (_, k) => (
          <use key={`r${k}`} href={`#${rose}`} strokeWidth={stroke} opacity={0.85}
            transform={`rotate(${n1((k * 24) / 10)})`} style={drawStyle(k)} />
        ))}
        {inner && Array.from({ length: 6 }, (_, k) => (
          <use key={`s${k}`} href={`#${small}`} strokeWidth={stroke * 0.9}
            transform={`rotate(${n1((k * 45) / 6)})`} style={drawStyle(k + 4, 1.5)} />
        ))}
        {rings && Array.from({ length: 16 }, (_, k) => (
          <use key={`n${k}`} href={`#${ring}`} strokeWidth={stroke * 0.7} opacity={0.75}
            transform={`rotate(${n1((k * 10) / 16)})`} style={drawStyle(k * 0.5, 2.1)} />
        ))}
        {rings && <circle r="159" strokeWidth={stroke * 1.2} style={drawStyle(9, 1.4)} pathLength="1" />}
        {rings && <circle r="145" strokeWidth={stroke * 0.8} style={drawStyle(9, 1.4)} pathLength="1" />}
      </g>
    </svg>
  )
}

/* Bölmə emblemi — kiçik sikkə: hörülmüş halqa + mərkəzdə dördguşəli ulduz */
const MARK_RING = wavyRing(12.5, 1.5, 12, 240)

export function RosetteMark({ size = 34, opacity = 0.95 }) {
  const uid = useId().replace(/[:]/g, '')
  const g = `rgm${uid}`, r = `rgk${uid}`
  return (
    <svg viewBox="-17 -17 34 34" width={size} height={size} aria-hidden="true" style={{ display: 'block', opacity }}>
      <defs>
        <GoldGradient id={g} />
        <path id={r} d={MARK_RING} />
      </defs>
      <circle r="16.2" fill="none" stroke={`url(#${g})`} strokeWidth=".7" />
      <g fill="none" stroke={`url(#${g})`} strokeWidth=".45">
        {Array.from({ length: 6 }, (_, k) => (
          <use key={k} href={`#${r}`} transform={`rotate(${n1((k * 30) / 6)})`} />
        ))}
      </g>
      <circle r="8.4" fill="#0B0906" stroke={`url(#${g})`} strokeWidth=".5" />
      <path d="M0 -5.6 L1.3 -1.3 L5.6 0 L1.3 1.3 L0 5.6 L-1.3 1.3 L-5.6 0 L-1.3 -1.3 Z" fill={`url(#${g})`} />
    </svg>
  )
}

/**
 * Banknot lenti — bölmələr arası gravür haşiyə.
 * 9 faza nüsxəsi bir-birinə hörülür → «ip» effekti.
 */
export function GuillocheBand({ width = 240, height = 16, opacity = 0.7, style = {} }) {
  const uid = useId().replace(/[:]/g, '')
  const g = `rgb${uid}`, w = `rgw${uid}`
  const copies = 9
  return (
    <svg
      viewBox={`0 -8 ${BAND_W} 16`} width={width} height={height} preserveAspectRatio="none"
      aria-hidden="true" style={{ display: 'block', margin: '0 auto', opacity, ...style }}
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C5A059" stopOpacity="0" />
          <stop offset=".22" stopColor="#C5A059" />
          <stop offset=".5" stopColor="#F3DE9E" />
          <stop offset=".78" stopColor="#C5A059" />
          <stop offset="1" stopColor="#C5A059" stopOpacity="0" />
        </linearGradient>
        <path id={w} d={BAND} />
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeWidth=".55" vectorEffect="non-scaling-stroke">
        {Array.from({ length: copies }, (_, k) => (
          <use key={k} href={`#${w}`} transform={`translate(${n1((30 * k) / copies)} 0)`} />
        ))}
      </g>
    </svg>
  )
}

/**
 * Xronoqraf siferblatı — gün sayğacının fonu.
 * Saniyə əqrəbi kvars saatı kimi hər saniyə «addımlayır» (keçid animasiyası yox).
 */
export function ChronoDial({ size = 300, seconds = 0 }) {
  const uid = useId().replace(/[:]/g, '')
  const g = `rgc${uid}`, d = `rgd${uid}`
  const angle = ((60 - (Number(seconds) || 0)) % 60) * 6
  return (
    <svg viewBox="-150 -150 300 300" width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <GoldGradient id={g} />
        <path id={d} d={DIAL} />
        <radialGradient id={`${g}f`} cx="0" cy="0" r="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1C150B" />
          <stop offset="1" stopColor="#0B0906" />
        </radialGradient>
      </defs>
      <circle r="147" fill={`url(#${g}f)`} stroke={`url(#${g})`} strokeWidth="1" />
      <circle r="141" fill="none" stroke="#C5A059" strokeOpacity=".35" strokeWidth=".5" />
      {Array.from({ length: 60 }, (_, i) => {
        const major = i % 5 === 0
        const a = (i * 6 * Math.PI) / 180
        const r1 = major ? 125 : 132, r2 = 139
        return (
          <line key={i}
            x1={n1(Math.sin(a) * r1)} y1={n1(-Math.cos(a) * r1)}
            x2={n1(Math.sin(a) * r2)} y2={n1(-Math.cos(a) * r2)}
            stroke="#C5A059" strokeOpacity={major ? 0.95 : 0.5} strokeWidth={major ? 1.4 : 0.6}
          />
        )
      })}
      <g fill="none" stroke={`url(#${g})`} strokeWidth=".45" opacity=".55">
        {Array.from({ length: 10 }, (_, k) => (
          <use key={k} href={`#${d}`} transform={`rotate(${n1((k * 7.5) / 10)})`} />
        ))}
      </g>
      <circle r="104" fill="none" stroke="#C5A059" strokeOpacity=".3" strokeWidth=".5" />
      {/* saniyə əqrəbi */}
      <g transform={`rotate(${angle})`}>
        <line x1="0" y1="22" x2="0" y2="-128" stroke="#E8D5A3" strokeWidth="1.1" strokeLinecap="round" />
        <circle cy="22" r="3.2" fill="#C5A059" />
      </g>
      <circle r="4" fill={`url(#${g})`} />
      <circle r="1.4" fill="#0B0906" />
    </svg>
  )
}

/** Mətni sikkə kənarı boyunca yazan qövs (yuxarı və ya aşağı) */
export function CoinLegend({ r, text: raw, lang = 'az', position = 'top', size: size0 = 9.5, color = '#E8D5A3', font, letterSpacing: ls0 = 3.2 }) {
  const uid = useId().replace(/[:]/g, '')
  const id = `rgl${uid}`
  if (!raw) return null
  /* Böyük hərfə JS-də çevrilir: CSS `text-transform` mərkəzləmədən SONRA
     işlədiyi üçün yazı qövsdə sağa sürüşürdü. `az` lokalı i → İ verir. */
  const text = String(raw).toLocaleUpperCase(lang === 'az' ? 'az' : lang === 'ru' ? 'ru' : 'en')
  /* Uzun mətn (admin yazısı, «Korporativ tədbir») qövsə sığmalıdır:
     əvvəl hərf aralığı, sonra ölçü kiçilir. Qövsün ~80%-i istifadə olunur. */
  const arc = Math.PI * r * 0.8
  let size = size0, letterSpacing = ls0
  const need = () => String(text).length * (size * 0.68 + letterSpacing)
  while (need() > arc && (letterSpacing > 0.8 || size > 6.5)) {
    if (letterSpacing > 0.8) letterSpacing -= 0.4
    else size -= 0.5
  }
  /* yuxarı: soldan sağa saat əqrəbi istiqamətində; aşağı: soldan sağa əks
     istiqamətdə — hər iki halda hərflər düz oxunur */
  const d = position === 'top'
    ? `M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`
    : `M ${-r} 0 A ${r} ${r} 0 0 0 ${r} 0`
  return (
    <>
      <defs><path id={id} d={d} /></defs>
      <text fill={color} fontSize={size} textAnchor="middle" style={{ fontFamily: font, letterSpacing: `${letterSpacing}px` }}>
        <textPath href={`#${id}`} startOffset="50%">{text}</textPath>
      </text>
    </>
  )
}
