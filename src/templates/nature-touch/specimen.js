/* ─────────────────────────────────────────────────────────────────────────────
   NATURE TOUCH — herbari nümunələrinin prosedur rəsmi (təmiz funksiyalar)

   • frond()     qıjı yarpağı — mərkəzi oxda cüt-cüt yarpaqcıqlar; aşağıda
                 uzun, uca doğru qısalır (təbii qıjı nisbəti)
   • leafPath()  nizəvari yarpaq (zeytun, söyüd)
   • branch()    proqram lövhəsi üçün budaq: n düyün, növbəli yarpaqlar
   • contours()  xəritə ehtiyatı — topoqrafik izoxətlər
   • LINEN_URI   cild parçası toxuması · PAPER_URI pambıq kağız lifi
   ───────────────────────────────────────────────────────────────────────── */

const r1 = (v) => Math.round(v * 10) / 10

/* Nizəvari yarpaq (0,0)-dan (len,0)-a; w — ən geniş yerin yarısı */
export function leafPath(len, w) {
  return `M0 0C${r1(len * 0.28)} ${r1(-w)} ${r1(len * 0.72)} ${r1(-w * 0.82)} ${r1(len)} 0C${r1(len * 0.72)} ${r1(w * 0.82)} ${r1(len * 0.28)} ${r1(w)} 0 0Z`
}

/* Dişli yarpaqcıq — qıjı üçün: kənarları dalğalı */
function pinnaPath(len, w, lobes = 5) {
  const top = [], bot = []
  for (let k = 0; k <= lobes * 2; k++) {
    const t = k / (lobes * 2)
    const env = Math.sin(Math.PI * Math.min(1, t * 1.08)) * w * (1 - t * 0.35)
    const wob = k % 2 ? 0.72 : 1
    top.push([t * len, -env * wob])
    bot.push([t * len, env * wob])
  }
  let d = 'M0 0'
  for (let k = 1; k < top.length; k++) {
    const [x0, y0] = top[k - 1], [x, y] = top[k]
    d += `Q${r1((x0 + x) / 2)} ${r1(Math.min(y0, y) * 1.12)} ${r1(x)} ${r1(y)}`
  }
  for (let k = bot.length - 2; k >= 0; k--) {
    const [x0, y0] = bot[k + 1], [x, y] = bot[k]
    d += `Q${r1((x0 + x) / 2)} ${r1(Math.max(y0, y) * 1.12)} ${r1(x)} ${r1(y)}`
  }
  return d + 'Z'
}

const PRESSED = ['#6E7E52', '#7A8659', '#66744B', '#7F7A4E', '#6A7A50']

/**
 * Qıjı: kök (0,0), yuxarı uzanır. Qayıdır: { rachis, pinnae:[{d, x, y, a, c}] }
 * a — dərəcə ilə fırlanma; c — rəng (preslənmiş yarpaqda tonlar fərqlənir).
 */
export function frond({ len = 300, pairs = 16, bend = 0.12, maxPinna = 64 } = {}) {
  const P0 = [0, 0], P1 = [len * bend, -len * 0.5], P2 = [len * bend * 0.4, -len]
  const at = (t) => {
    const u = 1 - t
    return [u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0], u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]]
  }
  const tan = (t) => {
    const dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0])
    const dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1])
    return Math.atan2(dy, dx) * 180 / Math.PI
  }
  const rachis = `M0 0Q${r1(P1[0])} ${r1(P1[1])} ${r1(P2[0])} ${r1(P2[1])}`
  const pinnae = []
  for (let i = 0; i < pairs; i++) {
    const t = 0.12 + (i / pairs) * 0.84
    const [x, y] = at(t)
    const dir = tan(t)
    const L = maxPinna * Math.sin(Math.PI * (0.18 + 0.82 * (1 - t))) * (0.55 + 0.45 * (1 - t))
    const spread = 62 - t * 26
    for (const side of [-1, 1]) {
      pinnae.push({
        d: pinnaPath(L, L * 0.2, Math.max(3, Math.round(L / 11))),
        x: r1(x), y: r1(y), a: r1(dir + side * spread), len: r1(L),
        c: PRESSED[(i * 3 + (side > 0 ? 1 : 0)) % PRESSED.length],
      })
    }
  }
  pinnae.push({ d: pinnaPath(maxPinna * 0.22, maxPinna * 0.05, 3), x: r1(P2[0]), y: r1(P2[1]), a: r1(tan(1)), c: PRESSED[0], len: r1(maxPinna * 0.22) })
  return { rachis, pinnae }
}

/**
 * Budaq lövhəsi: n yarpaq növbəli düzülür. Qutu: w×h, kök aşağıda ortada.
 * Qayıdır: { stem, leaves:[{d, x, y, a, tip:[x,y]}] }
 */
export function branch(n, w = 300, h = 300) {
  const N = Math.max(1, n)
  const x0 = w / 2, y0 = h - 6, yTop = 16
  const sx = (t) => x0 + Math.sin(t * Math.PI * 1.3) * w * 0.06
  const stem = `M${r1(x0)} ${y0}` + Array.from({ length: 24 }, (_, k) => {
    const t = (k + 1) / 24
    return `L${r1(sx(t))} ${r1(y0 - (y0 - yTop) * t)}`
  }).join('')
  const leaves = []
  for (let i = 0; i < N; i++) {
    const t = 0.1 + (i + 0.5) / N * 0.86
    const x = sx(t), y = y0 - (y0 - yTop) * t
    const side = i % 2 ? 1 : -1
    const L = Math.min(110, w * 0.34) * (1 - t * 0.28)
    const a = side > 0 ? -28 - t * 14 : -152 + t * 14
    const rad = a * Math.PI / 180
    leaves.push({ d: leafPath(L, L * 0.2), len: r1(L), x: r1(x), y: r1(y), a: r1(a), tip: [r1(x + Math.cos(rad) * (L + 12)), r1(y + Math.sin(rad) * (L + 12))] })
  }
  return { stem, leaves }
}

/* Topoqrafik izoxətlər — mərkəz ətrafında hamar, nizamsız halqalar */
export function contours(cx, cy, count = 9, step = 16, seed = 3) {
  const ph = [seed * 1.7, seed * 2.9, seed * 0.6]
  const out = []
  for (let k = 1; k <= count; k++) {
    const base = k * step
    let d = ''
    for (let s = 0; s <= 48; s++) {
      const th = (s / 48) * Math.PI * 2
      const rr = base * (1 + 0.16 * Math.sin(2 * th + ph[0] + k * 0.18) + 0.08 * Math.sin(3 * th + ph[1]) + 0.05 * Math.sin(5 * th + ph[2] - k * 0.3))
      d += `${s ? 'L' : 'M'}${r1(cx + Math.cos(th) * rr * 1.25)} ${r1(cy + Math.sin(th) * rr)}`
    }
    out.push(d + 'Z')
  }
  return out
}

/* Coğrafi koordinat — 40°22′N */
export function dms(v, pos, neg) {
  const a = Math.abs(v)
  const d = Math.floor(a)
  const m = Math.round((a - d) * 60)
  return `${d}°${String(m).padStart(2, '0')}′${v >= 0 ? pos : neg}`
}

const svgUri = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`

/* Cild parçası — ilmə toxuması (açılış örtüyü) */
export const LINEN_URI = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='6' height='6'>` +
  `<path d='M0 .5H6M0 3.5H6' stroke='#000' stroke-opacity='.14' stroke-width='.8'/>` +
  `<path d='M.5 0V6M3.5 0V6' stroke='#fff' stroke-opacity='.05' stroke-width='.8'/></svg>`,
)

/* Pambıq kağız — seyrək liflər */
export const PAPER_URI = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>` +
  `<g fill='none' stroke='#8C7A55' stroke-opacity='.09' stroke-width='.6'>` +
  `<path d='M12 30q14 -6 26 2'/><path d='M96 18q10 8 22 4'/><path d='M60 84q12 -10 24 -2'/>` +
  `<path d='M130 110q-8 12 -22 10'/><path d='M22 128q10 6 18 -4'/><path d='M80 140q14 2 20 -8'/>` +
  `</g></svg>`,
)
