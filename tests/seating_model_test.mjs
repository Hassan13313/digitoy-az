/* Oturma planı v52 — planlayıcı + dəvətnamə xəritəsinin saf qaydaları — node tests/seating_model_test.mjs */
import assert from 'node:assert/strict'
import {
  autoPlace, groupList, layoutPayload, nextTableName, normalizeLayout, plannerGuests, seatSides, seatsOf, tableLabel,
  DEFAULT_ZONES,
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

console.log(`seating_model: ${n} yoxlama keçdi`)
