/* ─────────────────────────────────────────────────────────────────────────────
   Phase 50 — «Müştəri paneli» açarı, brauzer tərəfi (src/utils/ownerKey.js)

   İşə salmaq: node tests/owner_key_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
let pass = 0
let fail = 0
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; return }
  console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++
}
const eq = (name, a, b) => ok(name, a === b, `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)

/* localStorage shim (node-da yoxdur) */
const mem = new Map()
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
}

const { isOwnerKey, storeOwnerKey, getOwnerKey, clearOwnerKey, ownerHeaders, takeKeyFromLocation } =
  await import('../src/utils/ownerKey.js')

const K = 'a'.repeat(32) + '0123456789abcdef0123456789abcdef'
const P = '/invite/aysel-ve-tural-ab12cd/panel'

/* ── 1. format ── */
ok('64 kiçik hex — keçir', isOwnerKey(K))
ok('63 simvol — keçmir', !isOwnerKey(K.slice(1)))
ok('böyük hərf — keçmir', !isOwnerKey(K.toUpperCase()))
ok('hex olmayan — keçmir', !isOwnerKey('g'.repeat(64)))
ok('sətir olmayan — keçmir', !isOwnerKey(null) && !isOwnerKey(123))

/* ── 2. URL-dən götürmə ── */
let r = takeKeyFromLocation({ pathname: P, search: '', hash: `#k=${K}` })
eq('#k= oxunur', r.key, K)
eq('#k= URL-dən silinir', r.cleanUrl, P)

r = takeKeyFromLocation({ pathname: P, search: `?k=${K}`, hash: '' })
eq('?k= ehtiyat variantı', r.key, K)
eq('?k= URL-dən silinir', r.cleanUrl, P)

r = takeKeyFromLocation({ pathname: P, search: '?utm_source=wa&k=' + K, hash: '#k=' + K + '&x=1' })
eq('fragment üstündür, digər parametrlər qalır', r.cleanUrl, `${P}?utm_source=wa#x=1`)

r = takeKeyFromLocation({ pathname: P, search: '', hash: '#k=salam' })
eq('səhv açar → null', r.key, null)
ok('səhv açar da URL-dən silinir', r.cleanUrl === P)

r = takeKeyFromLocation({ pathname: P, search: '', hash: '' })
ok('açar yoxdur', r.key === null && r.cleanUrl === P)

/* ── 3. saxlama + başlıq ── */
const S = 'aysel-ve-tural-ab12cd'
eq('əvvəlcə boş', getOwnerKey(S), null)
eq('başlıq boş', JSON.stringify(ownerHeaders(S)), '{}')
storeOwnerKey(S, K)
eq('saxlanır', getOwnerKey(S), K)
eq('X-Owner-Token başlığı', ownerHeaders(S)['X-Owner-Token'], K)
eq('başqa slug-a keçmir', getOwnerKey('leyla-ve-murad'), null)
storeOwnerKey(S, 'səhv')
eq('səhv açar yazılmır (köhnəsi qalır)', getOwnerKey(S), K)
mem.set('digitoyOwnerKey:' + S, 'korlanmis')
eq('korlanmış dəyər oxunmur', getOwnerKey(S), null)
storeOwnerKey(S, K)
clearOwnerKey(S)
eq('silinir', getOwnerKey(S), null)
eq('slug-sız başlıq boş', JSON.stringify(ownerHeaders('')), '{}')

console.log(`\nowner_key: ${pass} ok, ${fail} FAIL`)
process.exit(fail ? 1 : 0)
