import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   FİLM LENTİ — «Şəkilləri paylaş» bölməsinin foto zolağı (2026-11-13)

   Əvvəl 3 demo foto 2 sütunlu şəbəkədə idi (2 + 1 — asimmetrik). İstifadəçi:
   «sinema roliki kimi olsa hərəkətli». İndi bütün şablonlarda eyni kino lenti:
     • tünd lent, yuxarıda və aşağıda perforasiya dəlikləri — dəliklər lentlə
       birlikdə hərəkət edir (lentin öz fonudur);
     • kadrlar sonsuz axır: siyahı ekranı dolduracaq qədər təkrarlanır, sonra
       ikiqat olur və iz −50% sürüşür — hər kadr «kadr + aralıq» vahididir, ona
       görə dövrün tikişi görünmür;
     • toxunanda / üstünə gələndə dayanır, ekrandan çıxanda dayanır (batareya);
     • «az hərəkət» seçilibsə hərəkət yoxdur — lent əllə sürüşdürülür;
     • kənarlar yumşaq solur, hər kadrda incə vinyet.
   Foto yüklənməsə kadr yerində qalır (gizlənir) — eni dəyişməsin, dövr pozulmasın.
   ───────────────────────────────────────────────────────────────────────── */

const CSS = `
@keyframes dt-film { from { transform: translate3d(0,0,0) } to { transform: translate3d(-50%,0,0) } }
.dt-film-track { animation: dt-film var(--dt-film-s, 32s) linear infinite; will-change: transform; }
.dt-film:hover .dt-film-track, .dt-film:active .dt-film-track, .dt-film[data-off="1"] .dt-film-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .dt-film-track { animation: none; }
  .dt-film-view { overflow-x: auto !important; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  .dt-film-frame { scroll-snap-align: center; }
}
`
const MIN_FRAMES = 8
const hideFrame = (e) => { e.currentTarget.style.visibility = 'hidden' }

/**
 * @param {object} p
 * @param {string[]} p.photos      foto ünvanları (1+)
 * @param {string} [p.film]        lentin rəngi
 * @param {string} [p.hole]        perforasiya dəliklərinin rəngi
 * @param {string} [p.label]       ekran oxuyucusu üçün ad
 * @param {object} [p.style]       xarici konteyner (məs. marginBottom)
 */
export default function FilmReel({ photos, film = '#141210', hole = '#EFE9DF', label = 'Foto lent', style }) {
  const ref = useRef(null)
  const list = (photos || []).filter(Boolean)

  /* Ekrandan çıxanda dayanır */
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([e]) => { el.dataset.off = e.isIntersecting ? '0' : '1' }, { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!list.length) return null
  const base = []
  while (base.length < MIN_FRAMES) base.push(...list)
  const frames = [...base, ...base]
  const holes = `repeating-linear-gradient(90deg, ${hole} 0 9px, transparent 9px 21px)`

  return (
    <div ref={ref} className="dt-film" role="img" aria-label={label} style={{ position: 'relative', ...style }}>
      <style>{CSS}</style>
      <div
        className="dt-film-view"
        style={{
          overflow: 'hidden', borderRadius: 4, background: film,
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
          maskImage: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
        }}
      >
        <div
          className="dt-film-track"
          style={{
            display: 'flex', width: 'max-content', padding: '17px 0',
            '--dt-film-s': `${Math.round(base.length * 4)}s`,
            backgroundColor: film,
            backgroundImage: `${holes}, ${holes}`,
            backgroundSize: '100% 7px, 100% 7px',
            backgroundPosition: '0 5px, 0 calc(100% - 5px)',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {frames.map((src, i) => (
            <div
              key={i}
              className="dt-film-frame"
              aria-hidden={i >= base.length ? 'true' : undefined}
              style={{ position: 'relative', flex: 'none', height: 'clamp(118px, 34vw, 168px)', aspectRatio: '4 / 3', marginRight: 6, overflow: 'hidden', borderRadius: 2, background: '#000' }}
            >
              <img src={src} alt="" loading="lazy" decoding="async" onError={hideFrame}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', boxShadow: 'inset 0 0 22px rgba(0,0,0,.45)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
