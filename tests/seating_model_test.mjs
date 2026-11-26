/* Oturma planı v52 — planlayıcı + dəvətnamə xəritəsinin saf qaydaları — node tests/seating_model_test.mjs */
import assert from 'node:assert/strict'
import {
  autoPlace, groupList, layoutPayload, nextTableName, normalizeLayout, plannerGuests, seatSides, seatsOf, tableLabel,
  DEFAULT_ZONES, autoArrange, apartConflicts, expandTogether, takesSeat, togetherMap,
} from '../src/components/seating/seatingModel.js'

let n = 0
const t = (name, fn) => { fn(); n++ }

const api = { guests: [
  { id: '7', full_name: 'Əli Məmmədov', table_id: 'Masa 1', status: 'GOING', extra_guests: '2', side: 'bride', group_name: 'Ailə', notes: 'VIP', phone: '+994' },
  { id: 8, full_name: 'Aysel', table_id: '', status: 'NO_RESPONSE', extra_guests: 0, side: 'x', group_name: null },
] }

t('API qonaqları planlayıcı modelinə', () => {
  const [a, b] = plannerGuests(api)
  assert.deepEqual(a, { id: 7, name: 'Əli Məmmədov', side: 'bride', group: 'Ailə', plus: 2, status: 'yes', table: 'Masa 1', phone: '+994', note: 'VIP' })
  assert.equal(b.side, null)            /* naməlum tərəf → null */
  assert.equal(b.table, '')             /* masasız */
  assert.equal(b.status, 'none')
})
t('boş data', () => assert.deepEqual(plannerGuests(null), []))
t('stul sayı +1-lərlə', () => assert.equal(seatsOf({ plus: 2 }), 3))
t('stullar tərəf rəngində', () => assert.deepEqual(seatSides([{ side: 'bride', plus: 1 }, { side: null }]), ['bride', 'bride', null]))

t('plan yoxdursa: qonaq masaları + standart zonalar + köhnə davranış', () => {
  const l = normalizeLayout(null, ['Masa 2', 'Masa 10', '', 'Masa 2'])
  assert.deepEqual(l.tables.map((x) => x.name), ['Masa 2', 'Masa 10'])   /* rəqəmlə sıralanır, təkrarsız */
  assert.ok(l.tables.every((x) => x.x != null && x.y != null))           /* hamısına yer verilir */
  assert.equal(l.zones.length, DEFAULT_ZONES.length)
  assert.equal(l.showTablemates, true)
  assert.equal(l.showMap, false)
})
t('saxlanmış plan qorunur, qonaq masası (böyük-kiçik hərf fərqi) təkrarlanmır', () => {
  const l = normalizeLayout({ tables: [{ name: 'Masa 1', shape: 'long', cap: 14, x: 50, y: 72 }], zones: [], groups: ['Dostlar'], showMap: true, showTablemates: false }, ['masa 1', 'Masa 3'])
  assert.deepEqual(l.tables.map((x) => x.name), ['Masa 1', 'Masa 3'])
  assert.deepEqual([l.tables[0].x, l.tables[0].y, l.tables[0].shape, l.tables[0].cap], [50, 72, 'long', 14])
  assert.deepEqual(l.zones, [])        /* bütün zonaları silib → boş qalır */
  assert.equal(l.showMap, true)
  assert.equal(l.showTablemates, false)
})
t('avtomatik yer deterministikdir (admin, müştəri və dəvətnamə eyni şəkil)', () => {
  const a = normalizeLayout(null, ['Masa 1', 'Masa 2', 'Masa 3'])
  const b = normalizeLayout(null, ['Masa 3', 'Masa 1', 'Masa 2'])
  assert.deepEqual(a.tables, b.tables)
})
t('avtomatik yer tutulmuş yerə düşmür', () => {
  const [, b] = autoPlace([{ name: 'A', x: 13, y: 31 }, { name: 'B', x: null, y: null }])
  assert.notDeepEqual([b.x, b.y], [13, 31])
})
t('çox masa üçün də yer var', () => {
  const l = normalizeLayout(null, Array.from({ length: 60 }, (_, i) => `Masa ${i + 1}`))
  assert.ok(l.tables.every((x) => x.x >= 0 && x.x <= 100 && x.y >= 0 && x.y <= 100))
})
t('serverə gedən plan yarım faizə yuvarlaqlaşır', () => {
  const p = layoutPayload({ tables: [{ name: 'M', shape: 'round', cap: 8, x: 12.34, y: null, list: [], used: 0 }], zones: [{ id: 1, label: 'S', kind: 'stage', shape: 'rect', x: 50.26, y: 6, w: 36, h: 7 }], groups: [], showMap: false, showTablemates: true })
  assert.deepEqual(p.tables[0], { name: 'M', shape: 'round', cap: 8, x: 12.5, y: null })   /* görünüş sahələri (list, used) getmir */
  assert.equal(p.zones[0].x, 50.5)
})
t('masa yazısı', () => {
  assert.equal(tableLabel({ name: 'Masa 4' }), '4')
  assert.equal(tableLabel({ name: 'Ailə masası' }), 'Ailə')
  assert.equal(tableLabel({ name: 'Uzun masa', shape: 'long' }), 'Uzun masa')
})
t('qrup siyahısı: standartlar + planda + qonaqlarda, təkrarsız', () => {
  const g = groupList(['Universitet', 'dostlar'], [{ group: 'Qonşular' }, { group: '' }, { group: 'Ailə' }])
  assert.equal(g[0], 'Ailə')
  assert.ok(g.includes('Universitet') && g.includes('Qonşular'))
  assert.equal(g.filter((x) => x.toLowerCase() === 'dostlar').length, 1)
})
t('yeni masa adı təkrarlanmır', () => assert.equal(nextTableName([{ name: 'Masa 1' }, { name: 'Masa 2' }]), 'Masa 3'))
t('yeni masa adı boşluğu tutmur', () => assert.equal(nextTableName([{ name: 'Masa 2' }]), 'Masa 3'))

/* ── v53: RSVP, bağlar, avtomatik yerləşdirmə ── */
t('«gəlməyəcək» stul tutmur', () => {
  assert.equal(takesSeat({ status: 'no' }), false)
  assert.equal(seatsOf({ status: 'no', plus: 2 }), 0)
  assert.equal(seatsOf({ status: 'maybe', plus: 1 }), 2)
  assert.deepEqual(seatSides([{ side: 'bride', status: 'no' }, { side: 'groom' }]), ['groom'])
})
t('plan bağları normallaşır', () => {
  const l = normalizeLayout({ links: [{ a: 1, b: 2, kind: 'apart' }, { a: 3, b: 3 }, { a: '4', b: '5' }, null] }, [])
  assert.deepEqual(l.links, [{ a: 1, b: 2, kind: 'apart' }, { a: 4, b: 5, kind: 'together' }])
  assert.deepEqual(layoutPayload({ ...l, tables: [], zones: [] }).links, l.links)
})
const L = [{ a: 1, b: 2, kind: 'together' }, { a: 2, b: 3, kind: 'together' }, { a: 4, b: 5, kind: 'apart' }]
t('birlikdə blokları zəncirlə birləşir', () => {
  assert.deepEqual(togetherMap(L).get(1).sort(), [1, 2, 3])
  assert.deepEqual(expandTogether([3], L).sort(), [1, 2, 3])
  assert.deepEqual(expandTogether([9], L), [9])
})
t('ayrı cütlər eyni masada aşkarlanır', () => {
  assert.deepEqual(apartConflicts([{ id: 4 }, { id: 5 }, { id: 6 }], L), [[4, 5]])
  assert.deepEqual(apartConflicts([{ id: 4 }], L), [])
})
const T = [{ name: 'Sol', cap: 4, x: 13, y: 30 }, { name: 'Sağ', cap: 4, x: 87, y: 30 }, { name: 'Böyük', cap: 10, x: 87, y: 70 }]
const G = (id, side, group, extra = {}) => ({ id, name: 'Q' + id, side, group, plus: 0, status: 'none', table: '', ...extra })
t('qız evi sola, oğlan evi sağa', () => {
  const r = autoArrange([G(1, 'bride', 'Ailə'), G(2, 'groom', 'Ailə')], T)
  assert.equal(r.pairs.find((p) => p.id === 1).table, 'Sol')
  assert.ok(['Sağ', 'Böyük'].includes(r.pairs.find((p) => p.id === 2).table))
})
t('qrup bir masada qalır (sığırsa), best-fit', () => {
  const gs = [1, 2, 3].map((i) => G(i, 'groom', 'İş'))
  const r = autoArrange(gs, T)
  assert.equal(new Set(r.pairs.map((p) => p.table)).size, 1)
  assert.equal(r.pairs[0].table, 'Sağ')   /* 4 yerlik masa 10 yerlikdən dəqiq uyğundur */
})
t('«gəlməyəcək» və masası olan qonaq toxunulmur', () => {
  const r = autoArrange([G(1, 'bride', 'A', { status: 'no' }), G(2, 'bride', 'A', { table: 'Sol' })], T)
  assert.deepEqual(r.pairs, [])
})
t('birlikdə blok bölünmür, oturan üzvün masasına gedir', () => {
  const gs = [G(1, 'groom', 'A', { table: 'Böyük' }), G(2, 'bride', 'B'), G(3, 'bride', 'B')]
  const r = autoArrange(gs, T, [{ a: 1, b: 2, kind: 'together' }, { a: 2, b: 3, kind: 'together' }])
  assert.deepEqual(r.pairs.map((p) => p.table), ['Böyük', 'Böyük'])
})
t('ayrı deyilən qonaqla eyni masaya qoyulmur', () => {
  const gs = [G(4, 'bride', 'A', { table: 'Sol' }), G(5, 'bride', 'A')]
  const r = autoArrange(gs, T, [{ a: 4, b: 5, kind: 'apart' }])
  assert.notEqual(r.pairs[0].table, 'Sol')
})
t('yer çatmayanda qalanlar qaytarılır', () => {
  const r = autoArrange(Array.from({ length: 20 }, (_, i) => G(i + 1, 'groom', 'X')), T)
  assert.equal(r.pairs.length, 18)
  assert.equal(r.unplaced.length, 2)
})
t('+1-lər tutuma daxildir', () => {
  const r = autoArrange([G(1, 'bride', 'A', { plus: 3 }), G(2, 'bride', 'A', { plus: 3 })], [{ name: 'Sol', cap: 4, x: 10, y: 10 }])
  assert.equal(r.pairs.length, 1)
  assert.equal(r.unplaced.length, 1)
})

console.log(`seating_model: ${n} yoxlama keçdi`)
