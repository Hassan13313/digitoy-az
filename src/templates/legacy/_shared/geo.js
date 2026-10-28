/* ─────────────────────────────────────────────────────────────────────────────
   GEO — Location bölməsinin xəritə hesablamaları və URL qurucuları
   (komponent DEYİL — react-refresh qaydasına görə burada React ola bilməz).

   Phase 41-dən sonra Google Maps URL-lərinin YEGANƏ mənbəyi buradır:
   `directionsUrl` / `openMapUrl` / `embedUrl`. Şablonlar linkləri özləri
   qurmur → provayder dəyişsə yalnız bu fayl redaktə olunur.
   Vizual hissə isə `MapSection.jsx`-dədir.

   ⚠ YENİ DATA SAHƏSİ YOXDUR: koordinatlar mövcud `wazeUrl` (`?ll=lat,lng`)
   və ya `googleMapsUrl` içindən oxunur → builder/DB/API toxunulmur.
   ───────────────────────────────────────────────────────────────────────── */

/** Waze / Google Maps URL-dən [lat, lon] çıxar (tapılmasa null) */
export function parseLatLon(weddingData) {
  const tryUrl = (url) => {
    if (typeof url !== 'string' || !url) return null
    const pats = [
      /[?&]ll=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,     // waze ?ll=
      /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,           // google @lat,lng
      /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,      // google ?q=
      /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,       // google !3d!4d
    ]
    for (const re of pats) {
      const m = url.match(re)
      if (!m) continue
      const lat = parseFloat(m[1]), lon = parseFloat(m[2])
      if (Number.isFinite(lat) && Number.isFinite(lon) &&
          Math.abs(lat) <= 85 && Math.abs(lon) <= 180) return [lat, lon]
    }
    return null
  }
  return tryUrl(weddingData?.wazeUrl) || tryUrl(weddingData?.googleMapsUrl)
}

/* ⚠ `toTile` (slippy-map proyeksiyası) SİLİNDİ — yeganə istifadəçisi OSM tile
   mozaikası idi (`MapMosaic.jsx`), o da Phase 41-də Google Maps Embed ilə
   əvəzləndi. Tile hesablaması bir daha lazım olsa git tarixindədir. */

/* ── Naviqasiya linkləri ───────────────────────────────────────────────────
   Hədəf prioriteti: dəqiq koordinat → məkanın adı. İkisi də yoxdursa `null`
   qayıdır və çağıran tərəf düyməni ÜMUMİYYƏTLƏ render etmir (əvvəllər
   `href="#"` ilə ölü düymə qalırdı).

   ⚠ BU LİNKLƏR HEÇ VAXT SINMIR: sadəcə `<a href>`-dir, nə açar, nə kvota,
   nə billing tələb edir. Xəritə ŞƏKLİ alınmasa belə qonaq yolu tapa bilir —
   sistemin ən kritik funksiyası ən az asılılığı olan hissədədir. */

/** Xəritə sorğusu: `"40.3975,49.8537"` və ya `"Buta Palace Baku"` (yoxdursa null) */
export function mapQuery(weddingData) {
  const pt = parseLatLon(weddingData)
  if (pt) return `${pt[0]},${pt[1]}`
  const name = String(weddingData?.venueName || '').trim()
  return name || null
}

/** Xəritə göstərmək üçün ümumiyyətlə hədəf varmı? */
export function hasMapTarget(weddingData) {
  return !!mapQuery(weddingData)
}

/** «Yol göstər» — telefonun xəritə tətbiqində naviqasiya (hədəf yoxdursa null) */
export function directionsUrl(weddingData) {
  const q = mapQuery(weddingData)
  if (!q) return null
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`
}

/**
 * «Xəritədə aç» — məkanın Google Maps səhifəsi.
 * ⚠ Müştərinin builder-də yapışdırdığı `googleMapsUrl` ÜSTÜNLÜKLÜDÜR:
 * o, çox vaxt zalın rəsmi Google Business səhifəsidir (şəkil/rəy ilə),
 * bizim qurduğumuz axtarış linkindən daha faydalıdır.
 */
export function openMapUrl(weddingData) {
  const given = String(weddingData?.googleMapsUrl || '').trim()
  if (given) return given
  const q = mapQuery(weddingData)
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null
}

/* ── Xəritə ŞƏKLİ ──────────────────────────────────────────────────────────
   ⚠ MEMARLIQ QƏRARI (Phase 41): şəkil ÖZ domenimizdən gəlir.

   Əvvəlki iki yanaşma da eyni səbəbdən sındı — xəritə HƏR BAXIŞDA kənar
   xidmətdən çəkilirdi:
     • brauzerdən OSM tile  → «Access blocked» (usage policy)
     • Google Embed iframe  → açar/billing/referrer pozulsa hər dəvətnamədə
                              qara xəta paneli, üstəlik cross-origin olduğuna
                              görə JS onu görüb fallback-a keçə BİLMİR

   İndi kənar xidmət hər məkan üçün BİR DƏFƏ, SERVER tərəfdən çağırılır
   (`/api/venue_map.php`) və nəticə saxlanılır. Bunun nəticəsində:
     • provayder sonradan sınsa da keşlənmiş məkanlar işləməyə davam edir
     • uğursuzluq EYNİ ORIGIN-dədir → 404 → `<img onError>` → dekorativ kart
     • provayderi dəyişmək = bir PHP sabiti (React toxunulmur)

   ⚠ Şəkil NEYTRALDIR (rəng emalı yoxdur): hər şablon onu CSS ilə öz rənginə
   boyayır, ona görə 16 şablon EYNİ keş faylını paylaşır.
   ⚠ YALNIZ KOORDİNAT: şəkil üçün məkanın adı kifayət etmir (server geocoding
   etmir — bu, ayrıca API və ayrıca sınma nöqtəsi olardı). Koordinat yoxdursa
   `null` qayıdır və şablon dekorativ kartı göstərir; naviqasiya düymələri
   isə ad ilə işləməyə davam edir. */

/* Ölçü `venue_map.php`-dəki ALLOWED_SIZES ağ siyahısı ilə UYĞUN olmalıdır. */
const MAP_IMG_SIZE = '640x320'
const MAP_IMG_ZOOM = 16

/**
 * Məkan xəritəsinin şəkil URL-i — öz serverimizdən (koordinat yoxdursa null).
 * @returns {string|null}
 */
export function venueMapImageUrl(weddingData, { size = MAP_IMG_SIZE, zoom = MAP_IMG_ZOOM } = {}) {
  const pt = parseLatLon(weddingData)
  if (!pt) return null
  const ll = `${pt[0].toFixed(5)},${pt[1].toFixed(5)}`
  return `/api/venue_map.php?ll=${encodeURIComponent(ll)}&size=${size}&z=${zoom}`
}

/** Xəritə şəkli ümumiyyətlə qurula bilərmi? (koordinat lazımdır) */
export function hasVenueMapImage(weddingData) {
  return venueMapImageUrl(weddingData) !== null
}

/* ── Rəng köməkçiləri ──────────────────────────────────────────────────────
   ⚠ Bunlar xəritə ilə bağlı DEYİL, amma tarixən bu faylda yaşayırlar və
   `MapSection`, `DressCodeSection`, `TemplateActions` onları buradan idxal
   edir. Ayrı fayla köçürmək 4 idxal yolunu dəyişdirərdi — dəyməz. */

/** Hex + alpha → rgba (theme token üzərində şəffaflıq) */
export function alpha(hex, a) {
  const h = String(hex || '').replace('#', '')
  if (h.length !== 6) return hex
  const n = parseInt(h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

/* ── Kontrast köməkçiləri ──────────────────────────────────────────────────
   NƏ ÜÇÜN: ortaq komponentlər (məs. sifariş CTA-sı) 16 fərqli theme ilə
   render olunur. Bəzi şablonlarda `accent` fon rənginə çox yaxındır
   (simple-luxury: krem üzərində açıq qızıl → 1.2:1, oxunmur). Rəngi sabit
   seçmək əvəzinə hesablayırıq: aksent kifayət qədər kontrastlıdırsa qalır,
   deyilsə mətn rənginə düşür. Beləliklə hər şablon öz dilində qalır, amma
   heç bir yerdə görünməz mətn yaranmır. */
function toRgb(hex) {
  const h = String(hex || '').replace('#', '')
  if (h.length !== 6) return null
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function luminance(rgb) {
  const f = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2])
}

/** İki hex rəng arasında WCAG kontrast nisbəti (hesablana bilmirsə 0) */
export function contrast(fg, bg) {
  const a = toRgb(fg), b = toRgb(bg)
  if (!a || !b) return 0
  const l1 = luminance(a), l2 = luminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

/** `preferred` fonda oxunursa onu, oxunmursa `fallback`-i qaytarır */
export function readableOn(bg, preferred, fallback, min = 4.5) {
  return contrast(preferred, bg) >= min ? preferred : fallback
}
