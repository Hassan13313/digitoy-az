/* ─────────────────────────────────────────────────────────────────────────────
   ORIENTAL LUXE — ornament generatorları (təmiz funksiyalar, komponent yox)

   • lattice()      Şəki Xan sarayının şəbəkə pəncərəsi: səkkizguşəli ulduzlar
                    və aralarındakı xaçvari boşluqlar — hər biri rəngli şüşə.
                    Rənglər mərkəzdən simmetrik halqalarla paylanır (girih
                    kompozisiyası simmetrikdir, təsadüfi deyil). Bütün şəbəkə
                    bir neçə <path>-dır — yüzlərlə DOM düyünü yox.
   • shamsaPath()   şəmsə — dilimli günəş medalyonu (kitab cildi, xalça)
   • golPath()      pilləli romb — Qafqaz xalçasının göl medalyonu
   • BUTA           buta (paisley) — Azərbaycanın öz motivi
   • HASIYE_URI     xalça haşiyəsi — romb zənciri (üfüqi zolaq)
   • RHOMB_URI      xalça haşiyəsinin dolğusu (hər iki istiqamətdə oxunur)
   • GIRIH_URI      daxili fon üçün çox solğun şəbəkə izi
   ───────────────────────────────────────────────────────────────────────── */

const STAR_GLASS = ['#8E1A2C', '#22417E', '#8E1A2C', '#1F5E47', '#A8432F']
const GAP_GLASS = ['#C4862F', '#D9B36C', '#2D7A76', '#C4862F']

/* Səkkizguşəli ulduz — iki kəsişən kvadrat; daxili radius R·cos45/cos22.5 */
export function starPoints(cx, cy, R) {
  const r = R * 0.7654
  let d = ''
  for (let k = 0; k < 16; k++) {
    const a = (-90 + k * 22.5) * Math.PI / 180
    const rr = k % 2 ? r : R
    d += `${k ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`
  }
  return d + 'Z'
}

/**
 * Şəbəkə: { rings: [{ stars: {color: d}, gaps: {color: d} }], outline: d, w, h }
 * Halqa = mərkəzdən məsafə; açılışda şüşələr halqa-halqa işıqlanır.
 */
export function lattice({ w = 400, h = 880, s = 50 } = {}) {
  const cols = Math.ceil(w / s) + 1
  const rows = Math.ceil(h / s) + 1
  const ci = (w / 2 - s / 2) / s            /* mərkəz sütunu (ulduz indeksi) */
  const cj = Math.round((h * 0.44 - s / 2) / s)
  const rings = []
  let outline = ''
  const ring = (n) => (rings[n] ||= { stars: {}, gaps: {} })
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      /* boşluq (xaç) — dörd ulduzun arasında, hücrənin küncündə */
      const gx = i * s, gy = j * s
      const gdx = Math.abs(i - (ci + 0.5)), gdy = Math.abs(j - (cj + 0.5))
      const gr = Math.round(Math.hypot(gdx, gdy))
      const gc = GAP_GLASS[Math.round(Math.max(gdx, gdy)) % GAP_GLASS.length]
      const gp = ring(gr).gaps
      gp[gc] = (gp[gc] || '') + `M${gx - s / 2} ${gy - s / 2}h${s}v${s}h${-s}Z`
      /* ulduz */
      const cx = s / 2 + i * s, cy = s / 2 + j * s
      const dx = Math.abs(i - ci), dy = Math.abs(j - cj)
      const r = Math.round(Math.hypot(dx, dy))
      const sc = STAR_GLASS[Math.round(dx + dy) % STAR_GLASS.length]
      const d = starPoints(cx, cy, s / 2)
      const st = ring(r).stars
      st[sc] = (st[sc] || '') + d
      outline += d
    }
  }
  return { rings: rings.filter(Boolean), outline, w, h }
}

/* Şəmsə — n dilimli dairəvi medalyon (mərkəz 0,0) */
export function shamsaPath(R, n = 24, bulge = 0.62) {
  const chord = 2 * R * Math.sin(Math.PI / n)
  const rl = (chord / 2) / bulge
  let d = ''
  for (let k = 0; k <= n; k++) {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2
    const x = (Math.cos(a) * R).toFixed(2), y = (Math.sin(a) * R).toFixed(2)
    d += k === 0 ? `M${x} ${y}` : `A${rl.toFixed(2)} ${rl.toFixed(2)} 0 0 1 ${x} ${y}`
  }
  return d + 'Z'
}

/* Pilləli romb (göl) — w×h qutusunda, n pillə. Koordinatlar 0..w, 0..h */
export function golPath(w, h, n = 6) {
  const cx = w / 2, cy = h / 2
  const dx = (w / 2) / (n - 0.5)
  const dy = (h / 2) / n
  const q = []                                     /* yuxarı-sağ dörddəbir */
  for (let k = 0; k < n; k++) {
    const x = cx + dx * (k + 0.5)
    q.push([x - dx, cy - h / 2 + dy * k], [x, cy - h / 2 + dy * k])
  }
  q.push([cx + w / 2, cy])
  const pts = [
    ...q,
    ...q.slice(0, -1).reverse().map(([x, y]) => [x, 2 * cy - y]),
    ...q.slice(1).map(([x, y]) => [2 * cx - x, 2 * cy - y]),
    ...q.slice(1, -1).reverse().map(([x, y]) => [2 * cx - x, y]),
  ]
  return 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z'
}

/* Buta — viewBox 0 0 24 32, ucu sağa burulur */
export const BUTA = 'M12 31C4.5 30 1 23 2.6 15.6C4.3 8 10.4 3 17.6 2C21 1.5 22.8 3.8 21.4 5.9C20 8 17.2 7.4 16.4 9.3C21.4 11.4 23.4 17.3 21.6 22.8C20 27.6 16.6 31.2 12 31Z'
export const BUTA_IN = 'M12 27.4C7 26.6 5 21.6 6.2 16.6C7.3 12.2 11 9.6 14.6 10.3C18.6 11.2 19.9 16.6 18.6 21C17.5 24.8 15 27.6 12 27.4Z'

const svgUri = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`

/* Xalça haşiyəsi: üst/alt xətt + romb zənciri + yarımromb qarmaqlar */
export const HASIYE_URI = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='22' viewBox='0 0 28 22'>` +
  `<g fill='none' stroke='#D9B36C' stroke-width='1'>` +
  `<path d='M0 1.5H28M0 20.5H28' stroke-opacity='.8'/>` +
  `<path d='M14 5L21 11L14 17L7 11Z'/>` +
  `<path d='M0 7.5L3.5 11L0 14.5M28 7.5L24.5 11L28 14.5' stroke-opacity='.7'/>` +
  `</g><path d='M14 9L16 11L14 13L12 11Z' fill='#D9B36C'/>` +
  `<circle cx='3.6' cy='4.2' r='.9' fill='#D9B36C' fill-opacity='.6'/><circle cx='24.4' cy='17.8' r='.9' fill='#D9B36C' fill-opacity='.6'/>` +
  `</svg>`,
)

/* Haşiyə dolğusu — hər iki istiqamətdə eyni oxunan romb toru */
export const RHOMB_URI = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'>` +
  `<path d='M7 1L13 7L7 13L1 7Z' fill='none' stroke='#D9B36C' stroke-opacity='.75' stroke-width='.8'/>` +
  `<path d='M7 5.4L8.6 7L7 8.6L5.4 7Z' fill='#D9B36C' fill-opacity='.85'/>` +
  `</svg>`,
)

/* Daxili fon — şəbəkənin çox solğun izi (56px tile, ulduz + künclərdə dörddəbir) */
export const GIRIH_URI = (() => {
  const s = 56
  const d = starPoints(s / 2, s / 2, s / 2) + starPoints(0, 0, s / 2) + starPoints(s, 0, s / 2) + starPoints(0, s, s / 2) + starPoints(s, s, s / 2)
  return svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}' viewBox='0 0 ${s} ${s}'><path d='${d}' fill='none' stroke='#E7C27A' stroke-opacity='.075' stroke-width='1'/></svg>`)
})()
