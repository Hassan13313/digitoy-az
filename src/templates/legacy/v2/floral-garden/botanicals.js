/* ─────────────────────────────────────────────────────────────────────────────
   FLORAL GARDEN — BOTANİKA QATI

   Pion, bağ qızılgülü, evkalipt, yarpaq, qönçə və xırda çiçək buketi
   riyazi olaraq çəkilir (ləçək formaları + qızıl bucaq spiralı). Şəkil faylı
   YOXDUR — hər buket modul səviyyəsində bir dəfə SVG mətni kimi qurulur və
   `dangerouslySetInnerHTML` ilə yerləşdirilir (statik, istifadəçi verisi yox).

   ⚠ Qradiyentlər hər buketin öz prefiksi ilə adlanır — eyni səhifədə bir
   neçə buket olanda id-lər toqquşmur.
   ⚠ Açılışda çiçəklər «açır»: hər çiçək `fgb` qrupundadır (CSS animasiyası
   `transform-box: fill-box` ilə öz mərkəzi ətrafında). Daxili səhifədə həmin
   qruplar animasiyasızdır.
   ───────────────────────────────────────────────────────────────────────── */

function rng(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}
const P = (n) => (Math.round(n * 10) / 10).toString()

/* Ləçək — kökü (0,0), yuxarı baxır; qıvrım kənarlı */
function petal(L, W, ruf, seed) {
  const r = rng(seed)
  const n = 5
  let d = `M0 0C${P(-W * 0.55)} ${P(-L * 0.15)} ${P(-W * 0.62)} ${P(-L * 0.75)} ${P(-W * 0.42)} ${P(-L * 0.92)}`
  for (let i = 1; i <= n; i++) {
    const x0 = -W * 0.42 + W * 0.84 * (i / n)
    const xm = -W * 0.42 + W * 0.84 * ((i - 0.5) / n)
    const yb = -L * (0.92 + 0.08 * Math.sin((Math.PI * i) / n))
    const ym = yb - L * ruf * (0.5 + r() * 0.8)
    d += `Q${P(xm)} ${P(ym)} ${P(x0)} ${P(yb)}`
  }
  d += `C${P(W * 0.62)} ${P(-L * 0.75)} ${P(W * 0.55)} ${P(-L * 0.15)} 0 0Z`
  return d
}

/* ── Rəng dəstləri ── */
const PEONY = {
  pink:  ['#FBE7EB', '#F0B9C5', '#DD8EA0', '#C06A80'],
  blush: ['#FFF4F2', '#F8D9D6', '#EDB5B4', '#D9898E'],
  white: ['#FFFFFF', '#F7EFEA', '#EBDCD3', '#D5BDB0'],
}
const ROSE = {
  rose:  ['#FDF2F4', '#F3CBD3', '#DE9AAB', '#B45E77'],
  deep:  ['#F8DCE2', '#E7A1B1', '#C9768A', '#9B4560'],
  cream: ['#FFFBF5', '#F6EADB', '#E9D3BC', '#C9A98C'],
}

/** Paylaşılan qradiyentlər — hər buketdə bir dəfə */
function defs(p) {
  let s = '<defs>'
  for (const [k, c] of Object.entries(PEONY)) {
    s += `<radialGradient id="${p}p${k}" cx=".5" cy="1" r="1.05"><stop offset="0" stop-color="${c[3]}"/><stop offset=".45" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[0]}"/></radialGradient>`
    s += `<radialGradient id="${p}q${k}" cx=".5" cy="1" r="1"><stop offset="0" stop-color="${c[3]}"/><stop offset="1" stop-color="${c[1]}"/></radialGradient>`
  }
  for (const [k, c] of Object.entries(ROSE)) {
    s += `<radialGradient id="${p}r${k}" cx=".5" cy="1" r="1.1"><stop offset="0" stop-color="${c[3]}"/><stop offset=".55" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[0]}"/></radialGradient>`
  }
  s += `<linearGradient id="${p}ld" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2F4A3B"/><stop offset="1" stop-color="#5E7C6B"/></linearGradient>`
  s += `<linearGradient id="${p}lm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4F6E5C"/><stop offset="1" stop-color="#86A38F"/></linearGradient>`
  s += `<linearGradient id="${p}ls" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7F9B8A"/><stop offset="1" stop-color="#B5C8BA"/></linearGradient>`
  s += `<filter id="${p}sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#213229" flood-opacity=".16"/></filter>`
  return s + '</defs>'
}

/** Pion — 5 ləçək halqası + tozcuq mərkəzi */
function peony(p, cx, cy, R, { seed = 3, hue = 'pink', rot = 0 } = {}) {
  const r = rng(seed)
  const C = PEONY[hue]
  let s = `<g transform="translate(${P(cx)} ${P(cy)}) rotate(${P(rot)})">`
  const rings = [[11, 1.0, 0.78], [9, 0.82, 0.7], [8, 0.62, 0.6], [6, 0.42, 0.55], [5, 0.26, 0.6]]
  rings.forEach(([n, sc, w], ri) => {
    const off = r() * 360
    for (let i = 0; i < n; i++) {
      const a = off + (i * 360) / n + (r() - 0.5) * 14
      const L = R * sc * (0.9 + r() * 0.2)
      s += `<path d="${petal(L, L * w * 1.25, 0.07, seed * 31 + ri * 7 + i)}" transform="rotate(${P(a)})" fill="url(#${p}${ri > 2 ? 'q' : 'p'}${hue})" stroke="${C[2]}" stroke-opacity=".35" stroke-width=".5"/>`
    }
  })
  for (let i = 0; i < 14; i++) {
    const a = r() * Math.PI * 2, d = r() * R * 0.12
    s += `<circle cx="${P(Math.cos(a) * d)}" cy="${P(Math.sin(a) * d)}" r="${P(R * 0.03 + r() * R * 0.02)}" fill="#E9C46A" opacity=".9"/>`
  }
  return s + '</g>'
}

/** Bağ qızılgülü — qızıl bucaq (137.5°) spiralında 46 ləçək */
function rose(p, cx, cy, R, { seed = 5, hue = 'rose', rot = 0 } = {}) {
  const r = rng(seed)
  const C = ROSE[hue]
  let s = `<g transform="translate(${P(cx)} ${P(cy)}) rotate(${P(rot)})">`
  const N = 46, GA = 137.508
  for (let i = N - 1; i >= 0; i--) {
    const t = i / (N - 1)
    const a = i * GA + r() * 6
    const dist = R * 0.62 * Math.pow(t, 0.8) * 0.25
    const L = R * (0.22 + 0.62 * t)
    const W = L * (1.05 + 0.25 * t)
    const x = Math.cos((a * Math.PI) / 180) * dist, y = Math.sin((a * Math.PI) / 180) * dist
    s += `<path d="${petal(L, W, 0.025, seed * 13 + i)}" transform="translate(${P(x)} ${P(y)}) rotate(${P(a + 90)})" fill="url(#${p}r${hue})" stroke="${C[3]}" stroke-opacity="${(0.18 + 0.3 * (1 - t)).toFixed(2)}" stroke-width=".6"/>`
  }
  s += `<circle r="${P(R * 0.09)}" fill="${C[3]}" opacity=".8"/>`
  return s + '</g>'
}

/** Yarpaq — kökü (x,y), `ang` dərəcə saat əqrəbi ilə (0 = yuxarı) */
function leaf(p, x, y, L, W, ang, tone = 'd') {
  return `<g transform="translate(${P(x)} ${P(y)}) rotate(${P(ang)})"><g class="fgl"><path d="M0 0C${P(W)} ${P(-L * 0.2)} ${P(W * 0.9)} ${P(-L * 0.75)} 0 ${P(-L)}C${P(-W * 0.9)} ${P(-L * 0.75)} ${P(-W)} ${P(-L * 0.2)} 0 0Z" fill="url(#${p}l${tone})"/><path d="M0 0Q${P(W * 0.08)} ${P(-L * 0.5)} 0 ${P(-L * 0.96)}" stroke="#E4EEE6" stroke-opacity=".5" stroke-width=".7" fill="none"/></g></g>`
}

/** Evkalipt budağı — qövslü gövdə + cüt dairəvi yarpaqlar */
function eucalyptus(x, y, len, ang, { seed = 9, bend = 0.12 } = {}) {
  const r = rng(seed)
  let s = `<g transform="translate(${P(x)} ${P(y)}) rotate(${P(ang)})"><g class="fgl"><path d="M0 0Q${P(len * bend)} ${P(-len * 0.5)} 0 ${P(-len)}" stroke="#7E8F84" stroke-width="1.3" fill="none"/>`
  const n = Math.max(3, Math.round(len / 22))
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 0.6)
    const yy = -len * t
    const xx = len * bend * 4 * t * (1 - t) * 0.9
    const sz = 10 * (1.15 - t * 0.6)
    for (const side of [-1, 1]) {
      const ex = xx + side * sz * 0.95
      s += `<ellipse cx="${P(ex)}" cy="${P(yy + 2)}" rx="${P(sz)}" ry="${P(sz * 0.86)}" fill="${side > 0 ? '#A3B9AB' : '#88A292'}" transform="rotate(${P(side * (10 + r() * 20))} ${P(ex)} ${P(yy)})"/>`
    }
  }
  return s + '</g></g>'
}

/** Qönçə — çəhrayı damcı + yaşıl kasacıq */
function bud(x, y, k, ang, col = '#E7A9B7') {
  return `<g transform="translate(${P(x)} ${P(y)}) rotate(${P(ang)})"><g class="fgb"><path d="M0 0Q2 ${P(-k * 0.6)} 0 ${P(-k * 1.4)}" stroke="#5E7C6B" stroke-width="1.1" fill="none"/><path d="M0 ${P(-k * 1.2)}C${P(k * 0.5)} ${P(-k * 1.5)} ${P(k * 0.45)} ${P(-k * 2.3)} 0 ${P(-k * 2.6)}C${P(-k * 0.45)} ${P(-k * 2.3)} ${P(-k * 0.5)} ${P(-k * 1.5)} 0 ${P(-k * 1.2)}Z" fill="${col}"/><path d="M0 ${P(-k * 1.2)}C${P(k * 0.4)} ${P(-k * 1.35)} ${P(k * 0.3)} ${P(-k * 1.8)} ${P(k * 0.15)} ${P(-k * 2)}L${P(-k * 0.15)} ${P(-k * 2)}C${P(-k * 0.3)} ${P(-k * 1.8)} ${P(-k * 0.4)} ${P(-k * 1.35)} 0 ${P(-k * 1.2)}Z" fill="#6F8F7A"/></g></g>`
}

/** Xırda ağ çiçək buketi (gypsophila / spray rose) */
function spray(x, y, n, seed, spread = 22) {
  const r = rng(seed)
  let s = '<g class="fgb">'
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = r() * spread
    s += `<g transform="translate(${P(x + Math.cos(a) * d)} ${P(y + Math.sin(a) * d)})">`
    for (let k = 0; k < 5; k++) s += `<ellipse rx="2.6" ry="1.7" cx="2.2" fill="#FFFFFF" stroke="#E6D9D3" stroke-width=".3" transform="rotate(${k * 72})"/>`
    s += '<circle r="1" fill="#E9C46A"/></g>'
  }
  return s + '</g>'
}

/** Çiçəyi açılış qrupuna bükür */
const bloom = (inner, delay) => `<g class="fgb" style="animation-delay:${delay}s">${inner}</g>`

/* ═══════════════════════════════════════════════════════════════════════════
   KOMPOZİSİYALAR — hər biri öz viewBox-u ilə tam <svg> mətni qaytarır
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Böyük künc buketi (320×320). Kökü sol-yuxarı küncdədir, budaqlar ekranın
 * içinə (sağa və aşağı) uzanır. `flip` — 180° fırlanmış (sağ-alt künc üçün).
 */
export function cornerBouquet(p, { flip = false, seed = 1, t0 = 0 } = {}) {
  const s = (k) => seed * 17 + k
  let g = defs(p)
  g += `<g filter="url(#${p}sh)"${flip ? ' transform="rotate(180 160 160)"' : ''}>`
  /* arxa plan: yarpaqlar və evkalipt */
  g += eucalyptus(70, 80, 250, 172, { seed: s(1), bend: 0.16 })
  g += eucalyptus(80, 60, 230, 98, { seed: s(2), bend: -0.14 })
  g += leaf(p, 120, 120, 150, 32, 132, 'd')
  g += leaf(p, 110, 110, 128, 28, 160, 'm')
  g += leaf(p, 120, 100, 120, 26, 104, 'm')
  g += leaf(p, 150, 150, 96, 22, 146, 's')
  g += leaf(p, 60, 150, 110, 24, 196, 'd')
  g += leaf(p, 150, 60, 104, 22, 72, 'd')
  /* çiçəklər — arxadan önə */
  g += bloom(rose(p, 196, 74, 46, { seed: s(3), hue: 'deep' }), t0 + 0.35)
  g += bloom(peony(p, 72, 206, 46, { seed: s(4), hue: 'white' }), t0 + 0.5)
  g += bloom(peony(p, 92, 92, 80, { seed: s(5), hue: 'pink' }), t0 + 0.15)
  g += bloom(rose(p, 178, 170, 32, { seed: s(6), hue: 'cream' }), t0 + 0.65)
  g += bud(250, 140, 20, 74)
  g += bud(140, 262, 18, 168, '#F0C2CB')
  g += spray(222, 214, 9, s(7))
  g += spray(36, 286, 6, s(8), 14)
  return `<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" overflow="visible">${g}</g></svg>`
}

/** Kiçik künc buketi (220×220) — açılışın ikinci dərəcəli küncləri */
export function smallBouquet(p, { flip = false, seed = 2, t0 = 0 } = {}) {
  const s = (k) => seed * 23 + k
  let g = defs(p)
  g += `<g filter="url(#${p}sh)"${flip ? ' transform="rotate(180 110 110)"' : ''}>`
  g += eucalyptus(40, 40, 180, 150, { seed: s(1), bend: 0.14 })
  g += leaf(p, 70, 70, 110, 24, 120, 'd')
  g += leaf(p, 60, 70, 96, 22, 168, 'm')
  g += leaf(p, 70, 60, 90, 20, 84, 's')
  g += bloom(peony(p, 66, 64, 54, { seed: s(2), hue: 'blush' }), t0 + 0.2)
  g += bloom(rose(p, 132, 108, 28, { seed: s(3), hue: 'rose' }), t0 + 0.45)
  g += bud(150, 52, 16, 60)
  g += spray(112, 156, 6, s(4), 14)
  return `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" overflow="visible">${g}</g></svg>`
}

/** Tək budaq — bölmə nişanı (48×48): evkalipt + qönçə */
export function sprigMark(p, { seed = 4 } = {}) {
  let g = defs(p)
  g += eucalyptus(16, 46, 44, 28, { seed, bend: 0.1 })
  g += bud(30, 46, 9, -8)
  return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" overflow="visible">${g}</svg>`
}

/** Tək çiçək (proqram düyünləri, kart küncləri) */
export function singleBloom(p, { kind = 'peony', hue, size = 60, seed = 7 } = {}) {
  let g = defs(p)
  const c = size / 2
  g += kind === 'rose'
    ? rose(p, c, c, c * 0.95, { seed, hue: hue || 'rose' })
    : peony(p, c, c, c * 0.95, { seed, hue: hue || 'pink' })
  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" overflow="visible">${g}</svg>`
}

/** Kart küncü üçün orta buket (180×180) — pion + yarpaqlar */
export function cardBouquet(p, { seed = 5 } = {}) {
  const s = (k) => seed * 29 + k
  let g = defs(p)
  g += `<g filter="url(#${p}sh)">`
  g += leaf(p, 96, 84, 92, 22, 214, 'd')
  g += leaf(p, 92, 92, 80, 20, 250, 'm')
  g += leaf(p, 96, 90, 70, 18, 176, 's')
  g += eucalyptus(100, 86, 110, 236, { seed: s(1), bend: 0.12 })
  g += peony(p, 112, 72, 46, { seed: s(2), hue: 'pink' })
  g += rose(p, 66, 104, 24, { seed: s(3), hue: 'cream' })
  g += bud(150, 118, 12, 150)
  g += spray(140, 30, 6, s(4), 12)
  return `<svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" overflow="visible">${g}</g></svg>`
}

/** Proqram düyünü — kiçik beşləçəkli çiçək (CSS fon kimi) */
export const BLOSSOM_DATA_URI = (() => {
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 24 24">'
  for (let k = 0; k < 5; k++) s += `<ellipse rx="6.4" ry="4.2" cx="5.4" fill="#F3C3CD" stroke="#C9768A" stroke-width=".6" transform="rotate(${k * 72 - 90})"/>`
  s += '<circle r="2.6" fill="#E9C46A"/></svg>'
  return `url("data:image/svg+xml,${encodeURIComponent(s)}")`
})()

/** Bağ yolu — sol kənarda şaquli gövdə; növbələşən badam yarpaqlar (CSS fon) */
export const VINE_DATA_URI = (() => {
  const lf = (x, y, dx, dy, c) => {
    /* kökü (x,y), ucu (x+dx, y+dy); iki qövslə badam forması */
    const ex = x + dx, ey = y + dy
    const nx = -dy * 0.32, ny = dx * 0.32
    return `<path d="M${x} ${y}Q${(x + ex) / 2 + nx} ${(y + ey) / 2 + ny} ${ex} ${ey}Q${(x + ex) / 2 - nx} ${(y + ey) / 2 - ny} ${x} ${y}Z" fill="${c}"/>`
      + `<path d="M${x} ${y}L${x + dx * 0.85} ${y + dy * 0.85}" stroke="#E4EEE6" stroke-opacity=".55" stroke-width=".6"/>`
  }
  const s = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="240" viewBox="0 0 40 240">'
    + '<path d="M20 0C22.5 40 17.5 80 20 120S17.5 200 20 240" stroke="#7E9A88" stroke-width="1.3" fill="none"/>'
    + lf(20.6, 62, 13, -20, '#86A090')
    + lf(19.2, 142, -13, -19, '#9DB4A6')
    + lf(20.4, 214, 10, -15, '#A9BEB0')
    + '</svg>'
  return `url("data:image/svg+xml,${encodeURIComponent(s)}")`
})()

/** Kağız toxuması — çox zəif dənəvərlik (fon üçün) */
export const PAPER_DATA_URI = (() => {
  const s = '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">'
    + '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/>'
    + '<feColorMatrix values="0 0 0 0 .13 0 0 0 0 .2 0 0 0 0 .16 0 0 0 .05 0"/></filter>'
    + '<rect width="160" height="160" filter="url(#n)"/></svg>'
  return `url("data:image/svg+xml,${encodeURIComponent(s)}")`
})()
