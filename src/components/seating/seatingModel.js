/* ─────────────────────────────────────────────────────────────────────────────
   Oturma planı — saf köməkçilər (2026-11-26, sxem v52)
   Admin, müştəri paneli və dəvətnamədəki «masanı tap» xəritəsi eyni qaydaları
   işlədir. Server tərəfi: public/api/seating_layout_lib.php.
   Test: node tests/seating_model_test.mjs
   ───────────────────────────────────────────────────────────────────────── */

export const SIDE_LABEL = { bride: 'Qız evi', groom: 'Oğlan evi' }
export const SIDE_HEX = { bride: '#A8466A', groom: '#3B6290' }
/* Tərəfi bilinməyən, amma masada oturan qonağın stulu */
export const SEAT_TAKEN_HEX = '#8C7B6B'

export const DEFAULT_GROUPS = ['Ailə', 'Qohumlar', 'İş yoldaşları', 'Məhlə uşaqları', 'Sinif yoldaşları', 'Dostlar']

export const ZONE_PRESETS = [
  ['Musiqi zonası', 'music'], ['Foto zona', 'photo'], ['Şirniyyat masası', 'cake'],
  ['Hədiyyə masası', 'gift'], ['Uşaq guşəsi', 'kids'], ['Bar', 'bar'],
]

/* Plan heç saxlanmayıbsa göstərilən zonalar (müştəri dəyişə / silə bilər) */
export const DEFAULT_ZONES = [
  { id: 1, label: 'Səhnə', kind: 'stage', shape: 'rect', x: 50, y: 6, w: 36, h: 7 },
  { id: 2, label: 'Bəy və gəlin', kind: 'couple', shape: 'rect', x: 50, y: 16.5, w: 20, h: 7.5 },
  { id: 3, label: 'Rəqs meydançası', kind: 'dance', shape: 'oval', x: 50, y: 43.5, w: 32, h: 33 },
  { id: 4, label: 'Giriş', kind: 'door', shape: 'rect', x: 50, y: 95.5, w: 12, h: 5 },
]

/* Qız evi / oğlan evi bölgüsü yalnız bu tədbirlərdə görünür (və ya kimsə artıq tərəf alıbsa) */
export const SIDE_EVENTS = new Set(['toy', 'nishan', 'xina', ''])

const STATUS = { GOING: 'yes', NOT_GOING: 'no', MAYBE: 'maybe', NO_RESPONSE: 'none' }

export const lc = (s) => String(s ?? '').toLocaleLowerCase('az')
export const seatsOf = (g) => 1 + (Number(g?.plus) || 0)
export const initials = (n) => String(n || '').trim().split(/\s+/).map((w) => w[0] || '').slice(0, 2).join('')
export const shortName = (n) => { const [a, b] = String(n || '').split(' '); return b ? `${a} ${b[0]}.` : a }
const round = (v) => Math.round(v * 2) / 2
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

/** Masanın şəkildə yazılan qısa adı: «Masa 4» → «4», «Ailə masası» → «Ailə» */
export function tableLabel(t) {
  const m = String(t?.name || '').match(/\d+/)
  if (m) return m[0]
  return t?.shape === 'long' ? String(t?.name || '').slice(0, 14) : String(t?.name || '').split(' ')[0].slice(0, 5)
}

/** get_guests.php (admin / müştəri) → planlayıcının qonaq modeli */
export function plannerGuests(data) {
  return (data?.guests ?? []).map((g) => ({
    id: Number(g.id),
    name: g.full_name || '',
    side: g.side === 'bride' || g.side === 'groom' ? g.side : null,
    group: g.group_name || '',
    plus: Number(g.extra_guests) || 0,
    status: STATUS[g.status] || 'none',
    table: g.table_id || '',
    phone: g.phone || '',
    note: g.notes || '',
  }))
}

/* Avtomatik yerləşdirmə üçün sabit nöqtələr (zal 10:7): kənarlar, aşağı sıra, sonra şəbəkə */
const SLOTS = (() => {
  const s = []
  for (const y of [31, 56, 81]) s.push([13, y], [87, y])
  s.push([31, 84], [69, 84], [50, 72])
  for (const y of [31, 56]) s.push([29, y], [71, y])
  for (let y = 26; y <= 92; y += 11) for (let x = 8; x <= 92; x += 12) s.push([x, y])
  return s
})()
const far = (x, y, placed) => placed.every(([px, py]) => Math.hypot(px - x, (py - y) * 0.7) >= 11)

/** Yeri olmayan masalara boş yer seç (deterministik — admin, müştəri və dəvətnamə eyni şəkli görür) */
export function autoPlace(tables) {
  const placed = tables.filter((t) => t.x != null && t.y != null).map((t) => [t.x, t.y])
  return tables.map((t) => {
    if (t.x != null && t.y != null) return t
    const slot = SLOTS.find(([x, y]) => far(x, y, placed)) || [50, 50]
    placed.push(slot)
    return { ...t, x: slot[0], y: slot[1] }
  })
}

/**
 * Saxlanmış plan + qonaqların masa adları → tam plan.
 * Qonağı olan, amma planda olmayan masa (köhnə dəvətnamə, Excel idxalı) əlavə olunur.
 */
export function normalizeLayout(raw, guestTables = []) {
  const tables = []
  const seen = new Set()
  const add = (t) => {
    const name = String(t?.name ?? '').trim()
    if (!name || seen.has(lc(name))) return
    seen.add(lc(name))
    tables.push({
      name,
      shape: t.shape === 'long' ? 'long' : 'round',
      cap: clamp(Number(t.cap) || 10, 1, 60),
      x: t.x == null || Number.isNaN(Number(t.x)) ? null : clamp(Number(t.x), 0, 100),
      y: t.y == null || Number.isNaN(Number(t.y)) ? null : clamp(Number(t.y), 0, 100),
    })
  }
  for (const t of raw?.tables ?? []) add(t)
  for (const name of [...new Set(guestTables.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'az', { numeric: true }))) add({ name })
  return {
    tables: autoPlace(tables),
    zones: (Array.isArray(raw?.zones) ? raw.zones : DEFAULT_ZONES).map((z) => ({ ...z })),
    groups: Array.isArray(raw?.groups) ? [...raw.groups] : [],
    showMap: raw?.showMap === true,
    showTablemates: raw?.showTablemates !== false,
  }
}

/** Serverə göndəriləcək plan (yerlər yarım faizə yuvarlaqlaşdırılır) */
export function layoutPayload(l) {
  return {
    tables: l.tables.map(({ name, shape, cap, x, y }) => ({ name, shape, cap, x: x == null ? null : round(x), y: y == null ? null : round(y) })),
    zones: l.zones.map(({ id, label, kind, shape, x, y, w, h }) => ({ id, label, kind, shape, x: round(x), y: round(y), w: round(w), h: round(h) })),
    groups: l.groups,
    showMap: l.showMap,
    showTablemates: l.showTablemates,
  }
}

/** Qrup siyahısı: standartlar, planda saxlananlar, qonaqlarda yazılanlar (təkrarsız) */
export function groupList(layoutGroups = [], guests = []) {
  const out = []
  const push = (g) => { const v = String(g || '').trim(); if (v && !out.some((x) => lc(x) === lc(v))) out.push(v) }
  DEFAULT_GROUPS.forEach(push)
  layoutGroups.forEach(push)
  guests.forEach((g) => push(g.group))
  return out
}

/** Masadakı stullar: hər yer üçün qonağın tərəfi (null — tərəfi yoxdur) */
export function seatSides(guests) {
  return guests.flatMap((g) => Array(seatsOf(g)).fill(g.side || null))
}

export const nextId = (list) => Math.max(0, ...list.map((x) => Number(x.id) || 0)) + 1

/** Yeni masa üçün təkrarlanmayan ad: «Masa N» */
export function nextTableName(tables) {
  const used = new Set(tables.map((t) => lc(t.name)))
  let n = tables.length + 1
  while (used.has(lc(`Masa ${n}`))) n++
  return `Masa ${n}`
}
