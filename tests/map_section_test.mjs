/* ─────────────────────────────────────────────────────────────────────────────
   XƏRİTƏ SİSTEMİ TESTİ (Phase 41)

   NƏ ÜÇÜN VAR: xəritə iki dəfə eyni səbəbdən sındı — hər baxışda kənar
   xidmətdən çəkilirdi (əvvəl brauzerdən OSM tile → «Access blocked», sonra
   Google Embed iframe → açar/billing pozulanda qara xəta paneli).

   İndi qayda budur: BRAUZER heç bir kənar xəritə xidmətinə müraciət ETMİR.
   Şəkil öz serverimizdən (`/api/venue_map.php`) gəlir, kənar xidmət isə hər
   məkan üçün bir dəfə, server tərəfdən çağırılır.

   Bu test həmin müqavilənin sınmadığını yoxlayır.
   ───────────────────────────────────────────────────────────────────────── */
import {
  parseLatLon, mapQuery, hasMapTarget,
  directionsUrl, openMapUrl, venueMapImageUrl, hasVenueMapImage,
} from '../src/templates/_shared/geo.js'

let fail = 0
const ok = (name, cond, extra = '') => {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'}   ${name}${extra ? '  ' + extra : ''}`)
  if (!cond) fail++
}

const WITH_LL = { wazeUrl: 'https://waze.com/ul?ll=40.3975,49.8537&navigate=yes', venueName: 'Buta Palace' }

/* ── 1. ƏSAS QAYDA: brauzer kənar xəritə xidmətinə getmir ──────────────── */
const img = venueMapImageUrl(WITH_LL)
ok('xəritə şəkli ÖZ origin-imizdədir (kənar host yoxdur)',
   typeof img === 'string' && img.startsWith('/api/venue_map.php'))
ok('şəkil URL-ində OSM istinadı yoxdur', !/openstreetmap|tile\./i.test(img || ''))
ok('şəkil URL-ində Google istinadı yoxdur', !/google/i.test(img || ''))
ok('şəkil URL-ində API açarı yoxdur', !/key=|AIza/i.test(img || ''))

/* ── 2. Koordinat MÖVCUD sahələrdən oxunur (yeni DB sahəsi yoxdur) ─────── */
ok('waze ?ll= formatı', String(parseLatLon({ wazeUrl: 'https://waze.com/ul?ll=40.3975,49.8537' })) === '40.3975,49.8537')
ok('google @lat,lng formatı', String(parseLatLon({ googleMapsUrl: 'https://maps.google.com/maps/@40.4,49.8,17z' })) === '40.4,49.8')
ok('google ?q= formatı', String(parseLatLon({ googleMapsUrl: 'https://www.google.com/maps?q=40.1,49.1' })) === '40.1,49.1')
ok('google !3d!4d formatı', String(parseLatLon({ googleMapsUrl: 'https://maps.google.com/x/data=!3d40.5!4d49.5' })) === '40.5,49.5')
ok('zibil giriş → null', parseLatLon({ wazeUrl: 'salam', googleMapsUrl: '' }) === null)
ok('diapazondan kənar koordinat rədd olunur', parseLatLon({ wazeUrl: '?ll=999,999' }) === null)

/* ── 3. Şəkil parametrləri venue_map.php-nin ağ siyahısına uyğundur ─────── */
const q = new URLSearchParams((img || '').split('?')[1] || '')
ok('ll parametri 5 onluqla yuvarlaqlaşır', q.get('ll') === '40.39750,49.85370', q.get('ll') || '')
ok('size ağ siyahıdadır', ['640x320', '640x400', '800x400'].includes(q.get('size')), q.get('size') || '')
ok('zoom ağ siyahıdadır', [14, 15, 16, 17].includes(Number(q.get('z'))), q.get('z') || '')

/* ── 4. Koordinat yoxdursa ŞƏKİL yoxdur, amma NAVİQASİYA İŞLƏYİR ───────── */
const NAME_ONLY = { venueName: 'Buta Palace Baku' }
ok('adla şəkil qurulmur (server geocoding etmir)', venueMapImageUrl(NAME_ONLY) === null)
ok('adla şəkil mövcud sayılmır', hasVenueMapImage(NAME_ONLY) === false)
ok('AMMA adla naviqasiya işləyir', /destination=Buta%20Palace%20Baku/.test(directionsUrl(NAME_ONLY) || ''))
ok('AMMA adla «xəritədə aç» işləyir', typeof openMapUrl(NAME_ONLY) === 'string')
ok('ad ilə hədəf mövcud sayılır', hasMapTarget(NAME_ONLY) === true)
ok('koordinat addan ÜSTÜNDÜR', mapQuery({ ...NAME_ONLY, wazeUrl: '?ll=40.1,49.1' }) === '40.1,49.1')

/* ── 5. Hədəf ümumiyyətlə yoxdursa hər şey null (ölü düymə olmasın) ─────── */
const EMPTY = { venueName: '   ', wazeUrl: '', googleMapsUrl: '' }
ok('boş datada hədəf yoxdur', hasMapTarget(EMPTY) === false)
ok('boş datada directions null', directionsUrl(EMPTY) === null)
ok('boş datada openMap null', openMapUrl(EMPTY) === null)
ok('boş datada şəkil null', venueMapImageUrl(EMPTY) === null)

/* ── 6. Müştərinin öz linki «Xəritədə aç»-da üstünlüklüdür ──────────────── */
const OWN = { googleMapsUrl: 'https://maps.app.goo.gl/abc123', wazeUrl: '?ll=40.1,49.1' }
ok('müştərinin googleMapsUrl-i olduğu kimi qalır', openMapUrl(OWN) === 'https://maps.app.goo.gl/abc123')
ok('amma naviqasiya dəqiq koordinatı işlədir', /destination=40.1%2C49.1/.test(directionsUrl(OWN) || ''))

/* ── 7. URL kodlaşdırma — inyeksiya/boşluq təhlükəsizliyi ───────────────── */
const ODD = { venueName: 'Zal & "Bağ" #1' }
const d = directionsUrl(ODD) || ''
ok('məkan adı URL-kodlaşdırılır', !/[ "&#]/.test(d.split('destination=')[1] || 'x'))

console.log(fail === 0
  ? '\nXəritə sistemi: bütün yoxlamalar keçdi (brauzer kənar xəritə xidmətinə getmir)'
  : `\n${fail} yoxlama SINDI`)
process.exit(fail === 0 ? 0 : 1)
