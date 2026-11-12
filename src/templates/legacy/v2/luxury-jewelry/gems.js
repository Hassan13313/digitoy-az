/* ─────────────────────────────────────────────────────────────────────────────
   LUXURY JEWELRY — brilyant həndəsəsi (təmiz funksiyalar)

   Dəyirmi brilyantın yuxarıdan görünüşü real faset sxemi ilə qurulur:
     masa (səkkizbucaq) · 8 ulduz faseti · 8 uçurtma (bezel) faseti ·
     16 yuxarı qurşaq faseti; masanın içində pavilyonun əksi (16 üçbucaq).
   Hər fasetin işığı sabit işıq mənbəyinə (yuxarı-sol) və brilyantın tipik
   kontrast naxışına görə hesablanır; bir neçə fasetdə spektral «od» var.
   Hamısı modul səviyyəsində bir dəfə hesablanır.
   ───────────────────────────────────────────────────────────────────────── */

const rad = (d) => (d * Math.PI) / 180
const P = (r, deg) => [r * Math.cos(rad(deg - 90)), r * Math.sin(rad(deg - 90))]
const d = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L') + 'Z'

/* Brilyantın parlaqlığı yüksək kontrastdan gəlir: fasetlərin çoxu ağ, bir
   qismi tünd polad-mavi, aralıq ton azdır. Naxış əl ilə seçilib (simmetrik
   deyil — real daşda da işıq bucağa görə dəyişir). */
const TONES = {
  L: [[255, 255, 255], [214, 224, 232]],
  M: [[178, 191, 202], [120, 136, 150]],
  D: [[86, 100, 114], [30, 40, 52]],
}
const PATTERN = {
  star: 'MLMLMLML',
  kite: 'LLLLLLLL',
  ug0:  'DMDDDMDD',
  ug1:  'LLLLLLLL',
}
const FIRE = ['#FFE6B0', '#CFE2FF', '#FFD4E2', '#CFF1DF']
const LIGHT_DIR = -40 /* dərəcə, yuxarıdan saat əqrəbi ilə */

function shade(pts, tone) {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length
  const ang = (Math.atan2(cy, cx) * 180) / Math.PI + 90
  const t = 0.5 - 0.5 * Math.cos(rad(ang - LIGHT_DIR)) /* 0 — işığa baxan */
  const [a, b] = TONES[tone]
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t))
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

/** Dəyirmi brilyant, R radiuslu (mərkəz 0,0) */
export function brilliant(R = 50) {
  const rt = R * 0.53, rs = R * 0.77
  const T = (k) => P(rt, k * 45 + 22.5)
  const S = (k) => P(rs, k * 45)
  const G = (k) => P(R, k * 45 + 22.5)
  const H = (k) => P(R, k * 45)
  const facets = []
  for (let k = 0; k < 8; k++) {
    const star = [T(k - 1), T(k), S(k)]
    const kite = [T(k), S(k), G(k), S(k + 1)]
    const ug0 = [S(k), G(k - 1), H(k)]
    const ug1 = [S(k), H(k), G(k)]
    facets.push({ d: d(star), fill: shade(star, PATTERN.star[k]) })
    facets.push({ d: d(kite), fill: shade(kite, PATTERN.kite[k]) })
    facets.push({ d: d(ug0), fill: shade(ug0, PATTERN.ug0[k]) })
    facets.push({ d: d(ug1), fill: shade(ug1, PATTERN.ug1[k]) })
  }
  /* pavilyonun masadan görünən əksi — mərkəzə yığılan ox naxışı */
  const inner = []
  for (let k = 0; k < 8; k++) {
    const a = T(k - 1), b = T(k), m = P(rt * Math.cos(rad(22.5)), k * 45)
    inner.push({ d: d([[0, 0], a, m]), fill: k % 2 ? 'rgba(34,44,56,.55)' : 'rgba(255,255,255,.35)' })
    inner.push({ d: d([[0, 0], m, b]), fill: k % 2 ? 'rgba(255,255,255,.3)' : 'rgba(34,44,56,.42)' })
  }
  const fire = [3, 15, 19, 27].map((i, n) => ({ d: facets[i].d, fill: FIRE[n % FIRE.length] }))
  const table = d(Array.from({ length: 8 }, (_, k) => T(k)))
  return { facets, inner, fire, table, R }
}

/** Yandan görünüş (üzükdə, kiçik nişanlarda): w — qurşağın yarı eni */
export function brilliantSide(w = 20) {
  const ch = w * 0.38, tw = w * 0.56, cu = w * 0.98
  const C = [0, cu]
  const crown = [
    [[-w, 0], [-tw, -ch], [-w / 2, 0]],
    [[-w / 2, 0], [-tw, -ch], [-tw / 3, -ch], [0, 0]],
    [[0, 0], [-tw / 3, -ch], [tw / 3, -ch]],
    [[0, 0], [tw / 3, -ch], [tw, -ch], [w / 2, 0]],
    [[w / 2, 0], [tw, -ch], [w, 0]],
  ]
  const pav = [
    [[-w, 0], [-w / 2, 0], C],
    [[-w / 2, 0], [0, 0], C],
    [[0, 0], [w / 2, 0], C],
    [[w / 2, 0], [w, 0], C],
  ]
  const cf = ['#FFFFFF', '#DDE5EB', '#F7FAFC', '#B9C6D0', '#EEF3F6']
  const pf = ['#9AA9B5', '#F4F7F9', '#6E7E8B', '#CFE3FF']
  return {
    facets: [...crown.map((p, i) => ({ d: d(p), fill: cf[i] })), ...pav.map((p, i) => ({ d: d(p), fill: pf[i] }))],
    outline: d([[-w, 0], [-tw, -ch], [tw, -ch], [w, 0], C]),
    w, ch, cu,
  }
}

/** Pilləli (emerald) kəsim, rəngsiz: w×h yarı ölçülər */
export function stepCut(w = 24, h = 32) {
  const rings = [1, 0.8, 0.6, 0.42]
  const step = (a, b, c) => `M${-a + c} ${-b}H${a - c}L${a} ${-b + c}V${b - c}L${a - c} ${b}H${-a + c}L${-a} ${b - c}V${-b + c}Z`
  return rings.map((k, i) => ({ d: step(w * k, h * k, w * 0.3 * k), fill: ['#C9D3DB', '#F6F9FB', '#AEBBC6', '#FFFFFF'][i] }))
}

/** Armud kəsim kontur və fasetləri (s — ölçü) */
export function pearCut(s = 36) {
  const outline = `M0 ${-s}C${s * 0.5} ${-s * 0.3} ${s * 0.75} ${s * 0.2} ${s * 0.55} ${s * 0.6}C${s * 0.4} ${s * 0.95} ${-s * 0.4} ${s * 0.95} ${-s * 0.55} ${s * 0.6}C${-s * 0.75} ${s * 0.2} ${-s * 0.5} ${-s * 0.3} 0 ${-s}Z`
  return { outline, s }
}
