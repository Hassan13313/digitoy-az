// Kart şəkillərinin kiçik variantı: public/img/templates/<ad>.webp (780px) → public/img/templates/w480/<ad>.webp (480px).
// Mobil (DPR ≤ 2), planşet və kompüterdə kart şəkli ≤ 441 cihaz pikseli enində görünür — 780px orijinal 2.5 dəfə artıqdır.
//
//   node scripts/card-thumbs.mjs          → dəyişən/yeni şəkillər üçün kiçik variant yarat (ffmpeg lazımdır)
//   node scripts/card-thumbs.mjs --check  → yalnız yoxla (npm run build bunu çağırır): köhnə/çatışmayan varsa xəta
//   node scripts/card-thumbs.mjs --force  → hamısını yenidən yarat (keyfiyyəti dəyişəndə)
//
// Hər mənbə şəklin sha1-i scripts/card-thumbs.json-da saxlanılır: şəkil dəyişib kiçik variant yenilənməyibsə
// build dayanır — mobil istifadəçi köhnə dizaynı görməsin.
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'public/img/templates')
const OUT = join(SRC, 'w480')
const MANIFEST = join(ROOT, 'scripts/card-thumbs.json')
/* 780×1688-in nisbəti: 480 × 1688 / 780 = 1038.8 → 1039 (en/hündürlük atributları ilə eyni nisbət, sürüşmə olmasın) */
const W = 480
const H = 1039
/* 72: 480px-də 80-dən fərqi görünmür, ~20% kiçikdir (yoxlandı: red-veil, oriental-luxe) */
const QUALITY = '72'

const sha1 = (file) => createHash('sha1').update(readFileSync(file)).digest('hex').slice(0, 16)
const sources = readdirSync(SRC).filter((f) => f.endsWith('.webp')).sort()
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {}
const FORCE = process.argv.includes('--force')
const stale = sources.filter((f) => FORCE || manifest[f] !== sha1(join(SRC, f)) || !existsSync(join(OUT, f)))

if (process.argv.includes('--check')) {
  if (stale.length) {
    console.error(`card-thumbs: ${stale.length} kart şəklinin kiçik variantı köhnədir/yoxdur: ${stale.slice(0, 8).join(', ')}${stale.length > 8 ? ' …' : ''}`)
    console.error('  → node scripts/card-thumbs.mjs  (ffmpeg lazımdır), sonra yenidən npm run build')
    process.exit(1)
  }
  console.log(`card-thumbs: ${sources.length} kart şəkli — kiçik variantlar aktualdır`)
  process.exit(0)
}

mkdirSync(OUT, { recursive: true })
for (const f of stale) {
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', join(SRC, f),
    '-vf', `scale=${W}:${H}:flags=lanczos`, '-c:v', 'libwebp', '-quality', QUALITY, '-compression_level', '6', join(OUT, f)])
  manifest[f] = sha1(join(SRC, f))
}
/* silinmiş mənbələrin qeydini təmizlə */
for (const f of Object.keys(manifest)) if (!sources.includes(f)) delete manifest[f]
writeFileSync(MANIFEST, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 1) + '\n')
console.log(`card-thumbs: ${stale.length} yeni/yenilənmiş, cəmi ${sources.length}`)
