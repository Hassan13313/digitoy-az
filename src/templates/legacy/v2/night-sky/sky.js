/* ─────────────────────────────────────────────────────────────────────────────
   NIGHT SKY — O GECƏNİN SƏMASI (astronomik hesab, React yoxdur)

   Tədbirin tarixi + saatı + məkanın koordinatı üçün parlaq ulduzların
   üfüqdəki mövqeyi hesablanır (J2000 RA/Dec → yerli ulduz vaxtı → hündürlük
   və azimut) və zenit mərkəzdə olmaqla dairəvi xəritəyə (planisfer)
   proyeksiya olunur. Şimal yuxarıda, şərq SOLDA — göyə baxanda olduğu kimi.

   Dəqiqlik: ~1° (presessiya nəzərə alınmır) — xəritə üçün kifayətdir.
   Saat qurşağı: Azərbaycan UTC+4 (yay vaxtı yoxdur).
   Arxa fondakı sönük ulduzlar DEKORATİVDİR (tarixdən toxumlanmış təsadüfi),
   real olanlar yalnız adlı parlaq ulduzlar və bürc xətləridir.
   ───────────────────────────────────────────────────────────────────────── */

/* [ad, RA (saat), Dec (dərəcə), ulduz ölçüsü (mag)] */
const STARS = [
  ['Sirius', 6.752, -16.72, -1.46], ['Arcturus', 14.261, 19.18, -0.05], ['Vega', 18.616, 38.78, 0.03],
  ['Capella', 5.278, 46.0, 0.08], ['Rigel', 5.242, -8.2, 0.13], ['Procyon', 7.655, 5.22, 0.34],
  ['Betelgeuse', 5.919, 7.41, 0.5], ['Altair', 19.846, 8.87, 0.76], ['Aldebaran', 4.599, 16.51, 0.86],
  ['Antares', 16.49, -26.43, 0.96], ['Spica', 13.42, -11.16, 0.97], ['Pollux', 7.755, 28.03, 1.14],
  ['Fomalhaut', 22.961, -29.62, 1.16], ['Deneb', 20.69, 45.28, 1.25], ['Regulus', 10.139, 11.97, 1.35],
  ['Castor', 7.577, 31.89, 1.58], ['Bellatrix', 5.419, 6.35, 1.64], ['Elnath', 5.438, 28.61, 1.65],
  ['Alnilam', 5.604, -1.2, 1.69], ['Alnitak', 5.679, -1.94, 1.77], ['Mintaka', 5.533, -0.3, 2.23],
  ['Saiph', 5.796, -9.67, 2.09], ['Polaris', 2.53, 89.26, 1.98], ['Dubhe', 11.062, 61.75, 1.79],
  ['Merak', 11.031, 56.38, 2.37], ['Phecda', 11.897, 53.69, 2.44], ['Megrez', 12.257, 57.03, 3.31],
  ['Alioth', 12.9, 55.96, 1.77], ['Mizar', 13.399, 54.93, 2.04], ['Alkaid', 13.792, 49.31, 1.86],
  ['Schedar', 0.675, 56.54, 2.24], ['Caph', 0.153, 59.15, 2.28], ['Navi', 0.945, 60.72, 2.15],
  ['Ruchbah', 1.43, 60.24, 2.68], ['Segin', 1.907, 63.67, 3.35], ['Sadr', 20.37, 40.26, 2.23],
  ['Gienah', 20.77, 33.97, 2.48], ['Fawaris', 19.75, 45.13, 2.87], ['Albireo', 19.512, 27.96, 3.05],
  ['Sheliak', 18.835, 33.36, 3.52], ['Sulafat', 18.982, 32.69, 3.25], ['Zeta Lyr', 18.746, 37.61, 4.3],
  ['Denebola', 11.818, 14.57, 2.14], ['Algieba', 10.333, 19.84, 2.08], ['Zosma', 11.235, 20.52, 2.56],
  ['Mirfak', 3.405, 49.86, 1.79], ['Algol', 3.136, 40.96, 2.12], ['Hamal', 2.12, 23.46, 2.0],
  ['Alpheratz', 0.14, 29.09, 2.06], ['Mirach', 1.162, 35.62, 2.05], ['Almach', 2.065, 42.33, 2.1],
  ['Markab', 23.08, 15.21, 2.49], ['Scheat', 23.063, 28.08, 2.42], ['Algenib', 0.22, 15.18, 2.83],
  ['Enif', 21.736, 9.88, 2.39], ['Rasalhague', 17.582, 12.56, 2.08], ['Kochab', 14.845, 74.16, 2.08],
  ['Eltanin', 17.943, 51.49, 2.24], ['Alphecca', 15.578, 26.71, 2.23], ['Shaula', 17.56, -37.1, 1.62],
  ['Sargas', 17.622, -43.0, 1.86], ['Kaus Australis', 18.403, -34.38, 1.85], ['Nunki', 18.921, -26.3, 2.05],
  ['Menkalinan', 5.992, 44.95, 1.9], ['Alhena', 6.628, 16.4, 1.93], ['Mirzam', 6.378, -17.96, 1.98],
  ['Adhara', 6.977, -28.97, 1.5], ['Wezen', 7.14, -26.39, 1.83], ['Aludra', 7.402, -29.3, 2.45],
  ['Alphard', 9.46, -8.66, 1.98], ['Diphda', 0.726, -17.99, 2.04], ['Menkar', 3.038, 4.09, 2.54],
  ['Alcyone', 3.791, 24.11, 2.87], ['Gienah Crv', 12.263, -17.54, 2.59], ['Kraz', 12.573, -23.4, 2.65],
  ['Algorab', 12.498, -16.52, 2.95], ['Minkar', 12.169, -22.62, 3.0], ['Unukalhai', 15.738, 6.43, 2.63],
  ['Zubenelgenubi', 14.848, -16.04, 2.75], ['Zubeneschamali', 15.283, -9.38, 2.61], ['Dschubba', 16.006, -22.62, 2.29],
  ['Graffias', 16.091, -19.81, 2.62], ['Sabik', 17.173, -15.72, 2.43], ['Izar', 14.75, 27.07, 2.37],
  ['Muphrid', 13.911, 18.4, 2.68], ['Seginus', 14.535, 38.31, 3.03], ['Nekkar', 15.032, 40.39, 3.49],
  ['Vindemiatrix', 13.036, 10.96, 2.83], ['Porrima', 12.694, -1.45, 2.74], ['Tarazed', 19.771, 10.61, 2.72],
  ['Alshain', 19.922, 6.41, 3.71], ['Sheratan', 1.911, 20.81, 2.64], ['Alderamin', 21.31, 62.59, 2.51],
]

/* Bürc xətləri (ulduz adları ilə) */
const LINES = [
  ['Betelgeuse', 'Bellatrix'], ['Betelgeuse', 'Alnitak'], ['Bellatrix', 'Mintaka'], ['Mintaka', 'Alnilam'],
  ['Alnilam', 'Alnitak'], ['Alnitak', 'Saiph'], ['Mintaka', 'Rigel'],
  ['Dubhe', 'Merak'], ['Merak', 'Phecda'], ['Phecda', 'Megrez'], ['Megrez', 'Dubhe'], ['Megrez', 'Alioth'], ['Alioth', 'Mizar'], ['Mizar', 'Alkaid'],
  ['Caph', 'Schedar'], ['Schedar', 'Navi'], ['Navi', 'Ruchbah'], ['Ruchbah', 'Segin'],
  ['Deneb', 'Sadr'], ['Sadr', 'Albireo'], ['Fawaris', 'Sadr'], ['Sadr', 'Gienah'],
  ['Vega', 'Zeta Lyr'], ['Zeta Lyr', 'Sheliak'], ['Sheliak', 'Sulafat'], ['Sulafat', 'Zeta Lyr'],
  ['Regulus', 'Algieba'], ['Algieba', 'Zosma'], ['Zosma', 'Denebola'], ['Regulus', 'Denebola'],
  ['Castor', 'Pollux'], ['Pollux', 'Alhena'],
  ['Graffias', 'Dschubba'], ['Dschubba', 'Antares'], ['Antares', 'Shaula'], ['Shaula', 'Sargas'],
  ['Arcturus', 'Izar'], ['Izar', 'Nekkar'], ['Nekkar', 'Seginus'], ['Seginus', 'Arcturus'], ['Arcturus', 'Muphrid'],
  ['Markab', 'Scheat'], ['Scheat', 'Alpheratz'], ['Alpheratz', 'Algenib'], ['Algenib', 'Markab'],
  ['Alpheratz', 'Mirach'], ['Mirach', 'Almach'],
  ['Aldebaran', 'Elnath'], ['Sirius', 'Mirzam'], ['Sirius', 'Wezen'], ['Wezen', 'Adhara'], ['Wezen', 'Aludra'],
  ['Altair', 'Tarazed'], ['Altair', 'Alshain'], ['Mirfak', 'Algol'],
  ['Gienah Crv', 'Algorab'], ['Algorab', 'Kraz'], ['Kraz', 'Minkar'], ['Minkar', 'Gienah Crv'],
  ['Zubeneschamali', 'Zubenelgenubi'], ['Kochab', 'Polaris'], ['Hamal', 'Sheratan'],
]

const RAD = Math.PI / 180

function julian(y, m, d) {
  if (m <= 2) { y -= 1; m += 12 }
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5
}

function eventJD(date, time, tz) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date || ''))
  const now = new Date()
  const [Y, M, D] = m ? [+m[1], +m[2], +m[3]] : [now.getFullYear(), now.getMonth() + 1, now.getDate()]
  const t = /^(\d{1,2}):(\d{2})/.exec(String(time || ''))
  /* Saat yoxdursa və ya gündüzdürsə — göy qaranlıq olsun deyə 22:00 */
  let h = t ? +t[1] + +t[2] / 60 : 22
  if (h > 5 && h < 20) h = 22
  return julian(Y, M, D) + (h - tz) / 24
}

/**
 * @returns {{ stars: {x,y,mag,name}[], lines: [x1,y1,x2,y2][], moon: {age, illum, waxing} }}
 *          x,y — vahid dairədə (-1…1), zenit (0,0), şimal yuxarı, şərq sol
 */
export function computeSky({ date, time, lat = 40.38, lon = 49.87, tz = 4 }) {
  const jd = eventJD(date, time, tz)
  const d = jd - 2451545.0
  const gmst = ((280.46061837 + 360.98564736629 * d) % 360 + 360) % 360
  const lst = gmst + lon
  const sinLat = Math.sin(lat * RAD), cosLat = Math.cos(lat * RAD)
  const pos = {}
  const stars = []
  for (const [name, ra, dec, mag] of STARS) {
    const H = (lst - ra * 15) * RAD
    const sd = Math.sin(dec * RAD), cd = Math.cos(dec * RAD)
    const x = cd * Math.cos(H), y = cd * Math.sin(H)
    const sinAlt = x * cosLat * 1 + sd * sinLat
    const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt))) / RAD
    if (alt <= 0) continue
    const xh = x * sinLat - sd * cosLat
    const az = (Math.atan2(y, xh) / RAD + 180) % 360
    const r = (90 - alt) / 90
    const px = -Math.sin(az * RAD) * r
    const py = -Math.cos(az * RAD) * r
    pos[name] = [px, py]
    stars.push({ x: px, y: py, mag, name })
  }
  const lines = LINES.filter(([a, b]) => pos[a] && pos[b]).map(([a, b]) => [...pos[a], ...pos[b]])
  const age = ((((jd - 2451550.1) / 29.530588853) % 1) + 1) % 1
  const illum = (1 - Math.cos(2 * Math.PI * age)) / 2
  return { stars, lines, moon: { age, illum, waxing: age < 0.5 } }
}

/** Dekorativ sönük ulduzlar — tarixdən toxumlanmış, hər dəfə eyni */
export function faintStars(seedStr, n = 220) {
  let s = 0
  for (const ch of String(seedStr || 'x')) s = (s * 31 + ch.charCodeAt(0)) >>> 0
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
  const out = []
  while (out.length < n) {
    const x = r() * 2 - 1, y = r() * 2 - 1
    if (x * x + y * y > 0.98) continue
    out.push({ x, y, s: 0.25 + r() * 0.6, o: 0.25 + r() * 0.5 })
  }
  return out
}

/** Ayın fazası üçün SVG yolu (r radiuslu disk, işıqlı hissə) */
export function moonPath(r, illum, waxing) {
  const k = 1 - 2 * illum              /* 1 = təzə ay, -1 = bədirlənmiş */
  const rx = Math.abs(k) * r
  const sweepOuter = waxing ? 1 : 0
  const sweepInner = (k > 0) === waxing ? 0 : 1
  return `M0 ${-r} A${r} ${r} 0 0 ${sweepOuter} 0 ${r} A${rx.toFixed(2)} ${r} 0 0 ${sweepInner} 0 ${-r}Z`
}

/** Koordinatın dərəcə-dəqiqə yazılışı */
export function dms(v, pos, neg) {
  const d = Math.floor(Math.abs(v))
  const m = Math.round((Math.abs(v) - d) * 60)
  return `${d}°${String(m).padStart(2, '0')}′ ${v >= 0 ? pos : neg}`
}
