/* ─────────────────────────────────────────────────────────────────────────────
   WHATSAPP SİFARİŞ LİNKİ TESTİ (Phase 45.3)

   Xəta: sifariş mesajı `wa.me/<nömrə>?text=…` ilə açılırdı. WhatsApp-ın öz
   wa.me → api.whatsapp.com/send/ yönləndirməsi 4 baytlıq emojiləri
   (💍 📦 🎉) U+FFFD «�» ilə əvəz edir (curl ilə təsdiqləndi, 2026-10-01).
   `api.whatsapp.com/send` birbaşa açılanda yönləndirmə olmur — mətn qalır.

   İşə salmaq: node tests/wa_link_test.mjs
   ───────────────────────────────────────────────────────────────────────── */
import * as wa from '../src/utils/waLink.js'

let fail = 0
const ok = (name, cond, extra = '') => {
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  →  ' + extra : ''}`); fail++ }
}
const eq = (name, a, b) => ok(name, a === b, `${JSON.stringify(a)} !== ${JSON.stringify(b)}`)

const link = wa.waChatUrl
ok('waChatUrl export olunur', typeof link === 'function')

if (typeof link === 'function') {
  const text = encodeURIComponent('💍 YENİ SİFARİŞ — Digitoy.az\n📦 Paket: VİP')
  const url = link('994992133696', text)
  eq('birbaşa api.whatsapp.com/send', url, `https://api.whatsapp.com/send?phone=994992133696&text=${text}`)
  ok('wa.me yönləndirməsi işlənmir', !url.includes('wa.me'))
  ok('emoji UTF-8 kimi qalır (💍 = %F0%9F%92%8D)', url.includes('%F0%9F%92%8D'))
  eq('nömrədəki + və boşluqlar atılır', link('+994 99 213 36 96', 'x'), 'https://api.whatsapp.com/send?phone=994992133696&text=x')
  eq('mətnsiz link', link('994992133696'), 'https://api.whatsapp.com/send?phone=994992133696')
}

if (fail) { console.log(`\n${fail} FAIL`); process.exit(1) }
console.log('wa_link: hamısı keçdi')
