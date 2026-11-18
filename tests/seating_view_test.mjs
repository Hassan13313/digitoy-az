/* Oturma planı görünüş xəritəsi (admin + müştəri paneli) — node tests/seating_view_test.mjs
   2026-11-18: test saytında tapılan xəta — yeni (boş) masa, başqa masaya qonaq
   əlavə olunub siyahı serverdən yenilənəndə itirdi; köçürmə pəncərəsində görünmürdü. */
import assert from 'node:assert/strict'
import { addLocalTable, seatingStats, seatingTables } from '../src/components/admin/v2/seatingView.js'

let n = 0
const t = (name, fn) => { fn(); n++ }

const server1 = { guests: [{ id: 7, table_id: 'Masa 1', full_name: 'Əli', status: 'GOING', extra_guests: '2', notes: 'VIP' }], tables: [{ table_id: 'Masa 1' }] }
let local = []
local = addLocalTable('Masa 2')(local)
local = addLocalTable('Masa 2')(local)

t('lokal masa bir dəfə əlavə olunur', () => assert.deepEqual(local, ['Masa 2']))
t('boş lokal masa siyahıda görünür', () => assert.deepEqual(seatingTables(server1, local).map((x) => x.id), ['Masa 1', 'Masa 2']))
t('server yenilənəndən sonra da boş masa qalır', () => {
  const server2 = { guests: [...server1.guests, { id: 8, table_id: 'Masa 1', full_name: 'Aysel', status: 'NO_RESPONSE' }], tables: [{ table_id: 'Masa 1' }] }
  assert.deepEqual(seatingTables(server2, local).map((x) => x.id), ['Masa 1', 'Masa 2'])
})
t('status, +qonaq və qeyd xəritəsi', () => {
  const g = seatingTables(server1)[0].guests[0]
  assert.deepEqual(g, { id: '7', name: 'Əli', status: 'yes', plus: 2, phone: '', note: 'VIP' })
})
t('qonağı olan masa lokal siyahıda təkrarlanmır', () => assert.equal(seatingTables(server1, ['Masa 1']).length, 1))
t('boş data', () => assert.deepEqual(seatingTables(null), []))
t('statistika', () => assert.deepEqual(seatingStats({ stats: { total: 3, going: 1, not_going: 1, maybe: 0, no_response: 1, response_rate: 67 } }),
  { total: 3, yes: 1, no: 1, maybe: 0, none: 1, rate: 67 }))

console.log(`seating_view: ${n} yoxlama keçdi`)
