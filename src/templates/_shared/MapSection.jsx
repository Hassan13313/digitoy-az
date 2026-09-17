import { useState } from 'react'
import { venueMapImageUrl, alpha } from './geo'

/* ─────────────────────────────────────────────────────────────────────────────
   MAP SECTION — bütün şablonların YEGANƏ xəritə komponenti (Phase 41).

   ── NƏ ÜÇÜN BU MEMARLIQ? ────────────────────────────────────────────────
   Bizdə ardıcıl olaraq eyni sinif problem yaşandı, çünki xəritə HƏR BAXIŞDA
   kənar xidmətdən çəkilirdi:

     1) Brauzerdən birbaşa OSM tile → «Access blocked» (usage policy pozuldu)
     2) Google Maps Embed iframe   → açar / billing / referrer / kvotadan
        BİRİ pozulsa BÜTÜN canlı dəvətnamələrdə qara xəta paneli çıxır.
        Üstəlik o panel cross-origin iframe-in içindədir: JS onu OXUYA
        BİLMİR, yəni avtomatik «alınmadı → dekorativ karta keç» məntiqi
        qurmaq MÜMKÜN DEYİL.

   İndi şəkil ÖZ serverimizdən (`/api/venue_map.php`) gəlir; kənar xidmət
   hər məkan üçün yalnız BİR DƏFƏ, server tərəfdən çağırılır və nəticə
   saxlanılır. Bunun praktik nəticələri:

     • Provayder sonradan sınsa belə keşlənmiş məkanlar İŞLƏMƏYƏ DAVAM EDİR
     • Uğursuzluq EYNİ ORIGIN-dədir → `<img onError>` işə düşür → şablon
       dərhal dekorativ karta keçir. Qonaq HEÇ VAXT xəta paneli görmür.
     • Baxış sayı provayderə təsir etmir (yüz qonaq = sıfır əlavə sorğu)
     • Provayderi dəyişmək = `venue_map.php`-də bir sabit

   ── FALLBACK ZƏNCİRİ (heç bir halda boş/qırıq blok olmur) ───────────────
     koordinat yoxdur ........ → dekorativ kart
     şəkil 404/şəbəkə xətası . → dekorativ kart (onError)
     şəkil gəldi ............. → şablonun rəng emalı ilə göstərilir
   Naviqasiya düymələri HƏR ÜÇ HALDA işləyir — onlar sadəcə `<a href>`-dir,
   nə açar, nə kvota, nə billing tələb edir.

   ⚠ TƏK NÖQTƏ: şablonlar xəritəni birbaşa qurmur. Bu fayl YALNIZ komponent
   export edir (react-refresh qaydası); URL qurucuları qonşu `geo.js`-dədir.
   ───────────────────────────────────────────────────────────────────────── */

const DEFAULT_HEIGHT = 'clamp(148px, 42vw, 168px)'

/* Dekorativ çərçivə — üç konsentrik halqa məkanı işarələyir.
   Şəklin ÜSTÜNDƏ göstərilir; `pointerEvents:'none'` olduğuna görə mane olmur.
   (Adı və imzası köhnə `MapMosaic`-dəki ilə eynidir ki, şablonlarda idxal
   yolundan başqa heç nə dəyişməsin.) */
export function MapRings({ accent }) {
  const ring = (size, a) => ({
    position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
    width: size, height: size, borderRadius: '50%',
    border: `1px solid ${alpha(accent, a)}`, pointerEvents: 'none',
  })
  return (
    <>
      <span style={ring(150, 0.22)} />
      <span style={ring(104, 0.16)} />
      <span style={ring(58, 0.3)} />
    </>
  )
}

/* Dekorativ kart — koordinat və ya şəkil olmayanda.
   Əvvəllər bu markup ÜÇ şablonda ayrı-ayrı təkrarlanırdı; indi bir yerdədir. */
function DecorativeMap({ theme, accent, height, frame }) {
  return (
    <div style={{
      height, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span aria-hidden="true" style={{
        position: 'absolute', inset: 0, opacity: 0.2,
        backgroundImage: `linear-gradient(${alpha(accent, 0.35)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(accent, 0.35)} 1px, transparent 1px)`,
        backgroundSize: '26px 26px',
      }} />
      {frame || <MapRings accent={accent} />}
      <span style={{
        width: 12, height: 12, borderRadius: '50%', background: accent,
        boxShadow: `0 0 0 8px ${alpha(theme?.primary || accent, 0.16)}`,
      }} />
    </div>
  )
}

/**
 * Şablonların istifadə etdiyi yeganə xəritə bloku.
 *
 * @param {object} weddingData  dəvətnamə datası (koordinat `wazeUrl`/`googleMapsUrl`-dən)
 * @param {object} theme        şablonun theme token-ləri
 * @param {object} map          rəng emalı: { opacity, filter, tint, blend, tintOpacity }
 * @param {string} height       CSS hündürlüyü — SABİTDİR, ona görə CLS yaranmır
 * @param {node}   frame        dekorativ üst qat (pointer-events:none olmalıdır)
 * @param {node}   fallback     şəkil yoxdursa göstəriləcək şablona məxsus art
 * @param {string} accent       halqa/nöqtə rəngi (default: theme.accent)
 */
export default function MapSection({
  weddingData,
  theme = {},
  map = {},
  height = DEFAULT_HEIGHT,
  frame = null,
  fallback = null,
  accent,
}) {
  /* ⚠ Şəkil gəlmədisə (404, şəbəkə xətası, provayder sınıb) dərhal dekorativ
     karta keçirik. Bu, iframe modelində MÜMKÜN DEYİLDİ — indi eyni origin
     olduğuna görə `onError` etibarlı işləyir. */
  const [imgFailed, setImgFailed] = useState(false)

  const ACC = accent || theme.accent || theme.primary || '#C5A059'
  const src = venueMapImageUrl(weddingData)
  const label = String(weddingData?.venueName || '').trim()

  if (!src || imgFailed) {
    return fallback || <DecorativeMap theme={theme} accent={ACC} height={height} frame={frame} />
  }

  return (
    <div style={{
      height, position: 'relative', overflow: 'hidden',
      /* Şəkil yüklənənə qədər fon şablonun rəngindədir → ağ sıçrayış olmur */
      background: alpha(theme.surface || theme.background || '#111', 1),
    }}>
      {/* Xəritə şəkli + şablonun rəng emalı */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        opacity: map.opacity ?? 0.5,
        filter: map.filter || 'grayscale(1) brightness(.45) contrast(1.2)',
      }}>
        <img
          src={src}
          alt={label ? `${label} — xəritə` : 'Məkanın xəritəsi'}
          loading="lazy"
          decoding="async"
          draggable="false"
          onError={() => setImgFailed(true)}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>

      {/* Şablonun rəng tint-i — keşdə NEYTRAL şəkil saxlanılır, rəng burada
          verilir; ona görə bütün şablonlar eyni keş faylını paylaşır. */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: map.tint || theme.mapTint || theme.primary,
        mixBlendMode: map.blend || 'color',
        opacity: map.tintOpacity ?? 0.45,
      }} />

      {/* Şablona məxsus dekorativ çərçivə (halqalar və s.) */}
      {frame}
    </div>
  )
}
