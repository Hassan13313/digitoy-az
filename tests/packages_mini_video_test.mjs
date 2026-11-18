/* ─────────────────────────────────────────────────────────────────────────────
   MİNİ (39 ₼) + VİDEO (29 ₼) PAKETLƏRİ TESTİ (2026-11-18)

   Yoxlayır:
     1. Paket gate-ləri: MINI-də Love Story / Təbrik Kitabı / RSVP / oturma /
        qalereya bağlıdır; SADE-də Love Story və Təbrik Kitabı AÇIQDIR (dəyişməyib);
        boş paket köhnə qayda ilə SADE sayılır
     2. Bölmə görünürlüyü (getSectionVisibility) MINI-də bu iki bölməni gizlədir,
        istifadəçi onları açsa belə
     3. Builder siyahısında MINI-də lovestory/guestbook «locked» gəlir
     4. VIDEO sifariş mesajı: paket, nümunə linki, adlar, «Siz seçin» defoltları,
        Vagzali bloku YOXDUR; veb-sifariş mesajında da Vagzali yoxdur
     5. normalizeSampleLink: yalnız http(s), ölçü limiti
     6. 10 nümunə, unikal id/youtubeId, 3 dildə ad
     7. PHP: save/submit_draft VIDEO və MINI-ni qəbul edir
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { getPackageGates, getLockedSteps, PACKAGE_DEFS, WEB_PACKAGE_IDS, isVideoPackage, packageLabel } from '../src/data/packages.js'
import { getSectionVisibility, listBuilderSections } from '../src/data/sections.js'
import { VIDEO_SAMPLES, normalizeSampleLink, findVideoSample, describeVideoSource, videoMusicLabel } from '../src/data/videoSamples.js'
import { CARD_POSTER_IDS } from '../src/data/packageCopy.js'
import { VIDEO_ORDER_COPY } from '../src/data/videoOrderCopy.js'

/* whatsappOrder.js Vite üslubunda uzantısız idxal edir ('../data/constants') —
   Node üçün '.js' əlavə edən kiçik resolve hook, sonra dinamik import */
registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx) } catch (e) {
      if (spec.startsWith('.') && !/\.[a-z]+$/i.test(spec)) return next(`${spec}.js`, ctx)
      throw e
    }
  },
})
const { buildVideoWhatsAppMessage, buildWhatsAppMessage } = await import('../src/utils/whatsappOrder.js')

let fail = 0
let checks = 0
const ok = (name, cond, extra = '') => {
  checks++
  if (!cond) { console.log(`  FAIL   ${name}${extra ? '  ' + extra : ''}`); fail++ }
}

/* ── 1. Gate-lər ── */
const mini = getPackageGates('MINI')
ok('MINI: Love Story bağlı', mini.allowLoveStory === false)
ok('MINI: Təbrik Kitabı bağlı', mini.allowGuestbook === false)
ok('MINI: RSVP/oturma/qalereya bağlı', !mini.allowRsvp && !mini.allowSeating && !mini.allowGallery)
const sade = getPackageGates('SADE')
ok('SADE: Love Story və Təbrik Kitabı açıq', sade.allowLoveStory && sade.allowGuestbook)
ok('SADE: RSVP/oturma/qalereya bağlı (dəyişməyib)', !sade.allowRsvp && !sade.allowSeating && !sade.allowGallery)
ok('VIP: RSVP + oturma açıq, qalereya bağlı', getPackageGates('VIP').allowRsvp && getPackageGates('VIP').allowSeating && !getPackageGates('VIP').allowGallery)
ok('PREMIUM: hamısı açıq', Object.values(getPackageGates('PREMIUM')).every(Boolean))
ok('boş paket = SADE', JSON.stringify(getPackageGates('')) === JSON.stringify(sade))
ok('MINI addımları: 6, 7, 10 kilidli', getLockedSteps('MINI').join() === '6,7,10')
ok('qiymətlər', ['VIDEO', 'MINI', 'SADE', 'VIP', 'PREMIUM'].map((id) => PACKAGE_DEFS[id].price).join('/') === '29/39/59/89/129')
ok('veb-paketlər artan sıra ilə', WEB_PACKAGE_IDS.join() === 'MINI,SADE,VIP,PREMIUM')
ok('isVideoPackage yalnız VIDEO', isVideoPackage('VIDEO') && !['MINI', 'SADE', 'VIP', 'PREMIUM', '', undefined].some(isVideoPackage))
ok('packageLabel', packageLabel('SADE') === 'Sadə (59₼)' && packageLabel('VIDEO') === 'Videolu dəvətnamə (29₼)' && packageLabel('X') === 'X')
const vg = getPackageGates('VIDEO')
ok('VIDEO: veb funksiyaları kilidli (admin builder-də açılsa belə)', !vg.allowRsvp && !vg.allowGuestbook && !vg.allowLoveStory && !vg.allowSeating && !vg.allowGallery)
ok('naməlum paket: heç nə kilidlənmir (köhnə davranış)', Object.values(getPackageGates('XYZ')).every(Boolean))

/* ── 2. Görünürlük ── */
const allOn = { sections: { lovestory: true, guestbook: true }, loveStory: [{ title: 'x' }] }
const vMini = getSectionVisibility(allOn, 'MINI')
ok('MINI: lovestory açıq yazılsa da görünmür', vMini.lovestory === false)
ok('MINI: guestbook görünmür', vMini.guestbook === false)
ok('MINI: məkan/proqram/musiqi görünür', vMini.venue && vMini.program && vMini.music && vMini.countdown)
const vSade = getSectionVisibility(allOn, 'SADE')
ok('SADE: lovestory (açılıbsa) və guestbook görünür', vSade.lovestory === true && vSade.guestbook === true)
ok('köhnə dəvətnamə (paket yox): guestbook görünür', getSectionVisibility({}, undefined).guestbook === true)

/* ── 3. Builder siyahısı ── */
const locked = Object.fromEntries(listBuilderSections('MINI').map((s) => [s.id, s.locked]))
ok('MINI builder: lovestory + guestbook kilidli', locked.lovestory && locked.guestbook)
ok('SADE builder: lovestory + guestbook açıq', listBuilderSections('SADE').filter((s) => ['lovestory', 'guestbook'].includes(s.id)).every((s) => !s.locked))

/* ── 4. WhatsApp mesajları ── */
const base = {
  package: 'VIDEO', eventType: 'toy', groomName: 'Murad', brideName: 'Leyla', date: '2027-06-12', time: '19:00',
  venueName: 'Ulduz', inviteText: '', note: '',
  video: { source: 'sample', sampleId: VIDEO_SAMPLES[0].id, link: '' },
  videoMusic: { mode: 'auto' },
}
const msg = decodeURIComponent(buildVideoWhatsAppMessage(base))
ok('video mesajı: paket adı', msg.includes('Videolu dəvətnamə (29₼)'))
ok('video mesajı: nümunə adı + YouTube linki', msg.includes(VIDEO_SAMPLES[0].title.az) && msg.includes(`youtube.com/shorts/${VIDEO_SAMPLES[0].youtubeId}`))
ok('video mesajı: bəy və gəlin', msg.includes('Bəy: Murad') && msg.includes('Gəlin: Leyla'))
ok('video mesajı: boş mətn/musiqi → «Siz»', msg.includes('Yazı: Siz yazın') && msg.includes('Musiqi: Siz seçin'))
ok('video mesajı: Vagzali yoxdur', !/vagzali/i.test(msg))
const own = decodeURIComponent(buildVideoWhatsAppMessage({ ...base, eventType: 'birthday', brideName: 'Aysel', age: '30', video: { source: 'link', link: 'https://www.instagram.com/reel/abc/' }, videoMusic: { mode: 'own', custom: 'Sami Yusuf' }, note: 'Qızılı olsun' }))
ok('video mesajı: öz linki', own.includes('Öz nümunəsi: https://www.instagram.com/reel/abc/'))
ok('video mesajı: tək ad + yaş', own.includes('Ad: Aysel (30)'))
ok('video mesajı: öz mahnısı və qeyd', own.includes('Musiqi: Sami Yusuf') && own.includes('Qeyd: Qızılı olsun'))
const wa = decodeURIComponent(buildVideoWhatsAppMessage({ ...base, video: { source: 'whatsapp' } }))
ok('video mesajı: WhatsApp-da göndəriləcək', wa.includes('WhatsApp-da göndəriləcək'))
const webMsg = decodeURIComponent(buildWhatsAppMessage({ ...base, package: 'MINI', dressCodePalette: 'blacktie', programSteps: [] }))
ok('veb-sifariş mesajı: Mini (39₼), Vagzali yoxdur', webMsg.includes('Mini (39₼)') && !/vagzali|bonus/i.test(webMsg))

/* ── 5. Link normallaşdırma ── */
ok('link: https qəbul', normalizeSampleLink(' https://vt.tiktok.com/ZS123/ ') === 'https://vt.tiktok.com/ZS123/')
ok('link: sxemsiz → https', normalizeSampleLink('pin.it/abc') === 'https://pin.it/abc')
ok('link: javascript: rədd', normalizeSampleLink('javascript:alert(1)') === '')
ok('link: nöqtəsiz host rədd', normalizeSampleLink('localhost') === '')
ok('link: 500+ simvol rədd', normalizeSampleLink('https://a.az/' + 'x'.repeat(500)) === '')

/* ── 6. Nümunələr ── */
ok('10 nümunə', VIDEO_SAMPLES.length === 10)
ok('id-lər unikal', new Set(VIDEO_SAMPLES.map((s) => s.id)).size === 10)
ok('youtubeId-lər unikal və 11 simvol', new Set(VIDEO_SAMPLES.map((s) => s.youtubeId)).size === 10 && VIDEO_SAMPLES.every((s) => /^[A-Za-z0-9_-]{11}$/.test(s.youtubeId)))
ok('3 dildə ad və qeyd', VIDEO_SAMPLES.every((s) => ['az', 'en', 'ru'].every((l) => s.title[l] && s.note[l])))
ok('Pricing posterləri = ilk 3 nümunə', CARD_POSTER_IDS.join() === VIDEO_SAMPLES.slice(0, 3).map((s) => s.youtubeId).join())
ok('describeVideoSource', describeVideoSource({ source: 'sample', sampleId: 'black-gold' }).sample?.id === 'black-gold'
  && describeVideoSource({ source: 'link', link: 'pin.it/x' }).link === 'https://pin.it/x'
  && Object.keys(describeVideoSource({ source: 'link', link: 'javascript:1' })).length === 0
  && Object.keys(describeVideoSource({ source: 'sample', sampleId: 'yox' })).length === 0)
ok('videoMusicLabel', videoMusicLabel({ mode: 'preset', title: 'A', artist: 'B' }, 'X') === 'A — B'
  && videoMusicLabel({ mode: 'own', custom: ' C ' }, 'X') === 'C' && videoMusicLabel({ mode: 'auto' }, 'X') === 'X' && videoMusicLabel(undefined, 'X') === 'X')
ok('findVideoSample', findVideoSample('black-gold')?.youtubeId === 'dEB56U42FJc' && findVideoSample('yox') === null)

/* ── 6b. Sifariş formasının mətnləri 3 dildə eyni açarlarla ── */
const keys = (o) => Object.keys(o).sort().join(',')
ok('video copy: EN/RU açarları AZ ilə eyni', keys(VIDEO_ORDER_COPY.en) === keys(VIDEO_ORDER_COPY.az) && keys(VIDEO_ORDER_COPY.ru) === keys(VIDEO_ORDER_COPY.az))
ok('video copy: 3 hazır mətn hər dildə', ['az', 'en', 'ru'].every((l) => VIDEO_ORDER_COPY[l].presets.length === 3))

/* ── 7. PHP: config.php › DIGITOY_PACKAGES = PACKAGE_DEFS (id, ad, qiymət) ── */
const cfg = readFileSync(new URL('../public/api/config.php', import.meta.url), 'utf8')
const block = (cfg.match(/const DIGITOY_PACKAGES = \[([\s\S]*?)\];/) || [])[1] || ''
const phpPkgs = [...block.matchAll(/'([A-Z]+)'\s*=>\s*'([^']+)'/g)].map((m) => [m[1], m[2]])
ok('config.php: DIGITOY_PACKAGES = PACKAGE_DEFS', JSON.stringify(phpPkgs) === JSON.stringify(Object.keys(PACKAGE_DEFS).map((id) => [id, packageLabel(id)])), JSON.stringify(phpPkgs))
const phpWeb = ((cfg.match(/const DIGITOY_WEB_PACKAGES = \[([^\]]*)\]/) || [])[1] || '').match(/[A-Z]+/g) || []
ok('config.php: DIGITOY_WEB_PACKAGES = WEB_PACKAGE_IDS', phpWeb.join() === WEB_PACKAGE_IDS.join())
for (const [f, needle] of [['save_draft.php', 'DIGITOY_PACKAGES'], ['submit_draft.php', 'DIGITOY_PACKAGES'], ['get_orders_list.php', 'DIGITOY_PACKAGES'], ['owner_panel.php', 'DIGITOY_WEB_PACKAGES']]) {
  const src = readFileSync(new URL(`../public/api/${f}`, import.meta.url), 'utf8')
  ok(`${f}: paket siyahısını config.php-dən oxuyur`, src.includes(needle) && !/\[\s*'SADE',\s*'VIP'/.test(src))
}

console.log(fail === 0 ? `MİNİ + VİDEO paketləri: ${checks} yoxlama — hamısı keçdi` : `\n${fail} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
