/* ─────────────────────────────────────────────────────────────────────────────
   MAP MOSAIC — Location bölməsinin hibrid xəritəsi (Claude Design v2).

   Design: məkanın lat/lon-undan hesablanan {z}/{x}/{y} OpenStreetMap tile
   mozaikası (2×2, zoom 16) + şablonun öz rəng emalı (grayscale/brightness +
   tint blend) + dekorativ çərçivə. Attribution məcburidir: © OpenStreetMap.

   ⚠ YENİ DATA SAHƏSİ YOXDUR: koordinatlar mövcud `wazeUrl` (`?ll=lat,lng`)
   və ya `googleMapsUrl` içindən oxunur. DB/API/builder toxunulmur.
   ⚠ Koordinat tapılmasa `null` qaytarır → çağıran köhnə abstrakt kartı göstərir
   (heç vaxt boş/qırıq blok olmur).
   ───────────────────────────────────────────────────────────────────────── */

/* Xalis hesablamalar `geo.js`-dədir (komponent deyil) — həm dublikat qalmasın,
   həm də bu fayl YALNIZ komponent export etsin (react-refresh qaydası).
   `geo.js` heç nə idxal etmir → dairəvi idxal riski yoxdur. */
import { parseLatLon, toTile, alpha } from './geo'
import { useParallax } from './motion'

const ZOOM = 16
const TILE = 256

/* Dekorativ çərçivə — üç konsentrik halqa məkanı işarələyir (Claude Design v2). */
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

/**
 * @param {object}   theme   şablonun theme token-ləri
 * @param {object}   map     { opacity, filter, tint, blend } — design knob-u
 * @param {node}     frame   dekorativ çərçivə (şablona məxsus)
 * @param {number}   height  konteyner hündürlüyü (CSS dəyəri)
 */
export default function MapMosaic({ weddingData, theme, map = {}, frame = null, height }) {
  /* Parallaks: tile mozaikası scroll-a əks istiqamətdə sürüşür.
     ⚠ Hook erkən `return null`-dan ƏVVƏL çağırılır (rules-of-hooks).
     ⚠ Təhlükəsizdir: mozaika 768px, konteyner ~168px — hər tərəfdə ən azı
     172px ehtiyat var, ±22px sürüşmə heç vaxt boş zolaq açmır. */
  const tilesRef = useParallax({ speed: 0.1, max: 22 })

  const pt = parseLatLon(weddingData)
  if (!pt) return null

  const [lat, lon] = pt
  const [xf, yf] = toTile(lat, lon, ZOOM)
  const x0 = Math.floor(xf), y0 = Math.floor(yf)

  /* Məkan nöqtəsinin MƏRKƏZİ tile daxilindəki piksel yeri. */
  const px = (xf - x0) * TILE
  const py = (yf - y0) * TILE

  /* 3×3 mozaika (768px): mərkəzi tile ətrafında hər tərəfə bir tile ehtiyat.
     ⚠ 2×2 KİFAYƏT DEYİL — nöqtə tile-ın kənarına düşəndə blok konteynerin
     bir tərəfini örtmür və boş zolaq qalırdı (brauzerdə 50.7px ölçüldü).
     3×3-də hər tərəfə minimum TILE(256) + kənar payı örtük qalır. */
  const tiles = []
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) tiles.push([x0 + dx, y0 + dy])

  return (
    <div style={{
      height: height || 'clamp(148px, 42vw, 168px)',
      position: 'relative', overflow: 'hidden',
      /* Tile-lar yüklənənə qədər (və ya OSM əlçatmaz olsa) fon boş qalmasın */
      background: alpha(theme.surface || theme.background, 1),
    }}>
      {/* Tile qatı — şablonun rəng emalı ilə */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        opacity: map.opacity ?? 0.5,
        filter: map.filter || 'grayscale(1) brightness(.45) contrast(1.2)',
      }}>
        <div ref={tilesRef} style={{
          position: 'absolute', left: '50%', top: '50%',
          /* Mərkəzi tile-ın sol-üst küncü konteyner mərkəzindən (TILE+px, TILE+py)
             geri çəkilir → məkan nöqtəsi tam mərkəzdə qalır. */
          transform: `translate(${-(TILE + px)}px, ${-(TILE + py)}px)`,
          width: TILE * 3, height: TILE * 3,
          display: 'grid',
          gridTemplateColumns: `repeat(3, ${TILE}px)`,
          gridTemplateRows: `repeat(3, ${TILE}px)`,
        }}>
          {tiles.map(([tx, ty]) => (
            <img
              key={`${tx}-${ty}`}
              src={`https://tile.openstreetmap.org/${ZOOM}/${tx}/${ty}.png`}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              style={{ width: TILE, height: TILE, display: 'block' }}
            />
          ))}
        </div>
      </div>

      {/* Şablonun rəng tint-i */}
      <div style={{
        position: 'absolute', inset: 0,
        background: map.tint || theme.mapTint || theme.primary,
        mixBlendMode: map.blend || 'color',
        opacity: map.tintOpacity ?? 0.45,
        pointerEvents: 'none',
      }} />

      {/* Dekorativ çərçivə — məkanı işarələyir */}
      {frame}

      {/* Attribution — OSM tile istifadə şərti.
          Sağ-alt küncdə: dizaynın mərkəz kompozisiyasını pozmur, amma oxunur. */}
      <div style={{
        position: 'absolute', right: 6, bottom: 5,
        zIndex: 2, fontSize: 10, letterSpacing: '.02em',
        color: 'rgba(255,255,255,.85)', background: 'rgba(0,0,0,.45)',
        padding: '1px 7px', borderRadius: 3, whiteSpace: 'nowrap', pointerEvents: 'none',
      }}>
        © OpenStreetMap
      </div>
    </div>
  )
}
