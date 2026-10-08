// ════════════════════════════════════════════════════════════════
// MediaTile — mozaikada bir şəkil/video xanası (YALNIZ görünüş)
// Xananın özü bir düymədir (onOpen → lightbox). Üstündəki kiçik düymələr ayrıca qardaş
// elementlərdir (iç-içə düymə yoxdur), hamısı həmişə görünür — telefonda hover yoxdur.
// ════════════════════════════════════════════════════════════════
import { useCallback, useState } from 'react';
import { Check, Download, Film, ImageOff, MoreHorizontal, Play, Star, Trash2, X } from 'lucide-react';
import { Spinner } from './shared';
import { FOCUS_ON_PHOTO, formatDuration, formatNumber } from './tokens';

/**
 * @param {object} p
 * @param {string} p.src                    Göstəriləcək şəkil (thumbnail/orta ölçü)
 * @param {'image'|'video'} [p.type='image']
 * @param {string} [p.poster]               Video kadrı (yoxdursa video öz ilk kadrını göstərir)
 * @param {number} [p.duration]             Video müddəti (saniyə)
 * @param {string} [p.alt='']
 * @param {string} p.label                  Ekran oxuyucu üçün ad: «Şəkil 3 / 18»
 * @param {boolean} [p.featured]            Seçilmiş (ulduz həmişə görünür)
 * @param {string} [p.reactionEmoji]        Reaksiya xülasəsi: ən çox verilən emoji
 * @param {number} [p.reactionCount]        Reaksiyaların cəmi
 * @param {boolean} [p.selected]
 * @param {()=>void} [p.onToggleSelect]     Verilməsə seçim qutusu yoxdur
 * @param {()=>void} p.onOpen               Lightbox-u aç
 * @param {boolean} [p.canManage]           Cütlük: ulduz düyməsi + «⋯» (Endir / Sil)
 * @param {()=>void} [p.onFeature]
 * @param {()=>void} [p.onDownload]
 * @param {()=>void} [p.onDelete]           Təsdiq pəncərəsini siz açın
 * @param {boolean} [p.busy]                Əməliyyat gedir (məs. silinir)
 * @param {(ratio:number)=>void} [p.onAspect]   MasonryGrid-dən gəlir
 * @param {(img:HTMLImageElement)=>boolean} [p.rejectPoster]  Digitoy: true → video posteri yararsızdır (qara kadr), video öz kadrını göstərir
 * @param {object} [p.labels]               { open, select, unselect, feature, unfeature, more, download, delete, close, video, failed }
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export default function MediaTile({
  src,
  type = 'image',
  poster,
  duration,
  alt = '',
  label,
  featured = false,
  reactionEmoji,
  reactionCount,
  selected = false,
  onToggleSelect,
  onOpen,
  canManage = false,
  onFeature,
  onDownload,
  onDelete,
  busy = false,
  onAspect,
  rejectPoster,
  labels = {},
  lang = 'az',
}) {
  const L = {
    open: 'Böyüt',
    select: 'Seç',
    unselect: 'Seçimdən çıxar',
    feature: 'Seçilmişlərə əlavə et',
    unfeature: 'Seçilmişlərdən çıxar',
    featuredBadge: 'Seçilmiş',
    more: 'Digər əməliyyatlar',
    download: 'HD endir',
    delete: 'Sil',
    close: 'Bağla',
    video: 'Video',
    failed: 'Yüklənmədi',
    ...labels,
  };
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [menu, setMenu] = useState(false); // yalnız UI
  /* Digitoy: köhnə yükləmələrin posteri qara ola bilər və ya açılmaya bilər →
     o halda kadr videonun özündən götürülür (köhnə qalereyadakı qayda) */
  const [posterBad, setPosterBad] = useState(false);

  const report = useCallback(
    (w, h) => {
      if (w && h) onAspect?.(w / h);
      setLoaded(true);
    },
    [onAspect],
  );
  const imgRef = useCallback(
    (node) => {
      if (node && node.complete && node.naturalWidth) report(node.naturalWidth, node.naturalHeight);
    },
    [report],
  );

  const isVideo = type === 'video';
  const imageSrc = isVideo ? (posterBad ? null : poster) : src;

  return (
    <div lang={lang} className="group relative h-full w-full">
      <div
        className={`relative h-full w-full overflow-hidden rounded-[14px] bg-beige transition-[box-shadow,transform] duration-300 ease-luxe sm:rounded-[16px] ${
          selected ? 'shadow-lift ring-[3px] ring-gold' : 'ring-1 ring-black/[0.06]'
        } ${busy ? 'opacity-60' : ''}`}
      >
        {/* yer tutucu */}
        {!loaded && !failed && (
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-beige via-gold-mist/70 to-beige motion-safe:animate-pulse"
          />
        )}

        {/* media */}
        {failed ? (
          <span className="absolute inset-0 grid place-items-center text-center text-brown-dark">
            <span className="flex flex-col items-center gap-1.5">
              <ImageOff className="h-6 w-6 text-gold-deep" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-[12px]">{L.failed}</span>
            </span>
          </span>
        ) : imageSrc ? (
          <img
            key={imageSrc}
            ref={imgRef}
            src={imageSrc}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              if (isVideo && rejectPoster?.(e.currentTarget)) {
                setPosterBad(true);
                return;
              }
              report(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight);
            }}
            onError={() => (isVideo ? setPosterBad(true) : setFailed(true))}
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-luxe group-hover:scale-[1.02] motion-reduce:group-hover:scale-100 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          isVideo && (
            <video
              src={`${src}#t=1`}
              muted
              playsInline
              preload="metadata"
              onLoadedMetadata={(e) => report(e.currentTarget.videoWidth, e.currentTarget.videoHeight)}
              onError={() => setFailed(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden="true"
              tabIndex={-1}
            />
          )
        )}

        {/* oxunaqlılıq üçün yumşaq kölgə (yuxarı və aşağı) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/35 to-transparent"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/45 to-transparent"
        />
        {selected && <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gold/15" />}

        {/* əsas düymə — bütün xana */}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${L.open}: ${label}${isVideo ? ` (${L.video})` : ''}`}
          className="absolute inset-0 z-[1] rounded-[inherit] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-gold-light"
        >
          {alt && <span className="sr-only">{alt}</span>}
        </button>

        {/* video: mərkəzdə oynat işarəsi */}
        {isVideo && !failed && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-[2] grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/40 backdrop-blur-sm"
          >
            <Play className="ml-0.5 h-5 w-5 fill-white" />
          </span>
        )}

        {/* seçim qutusu (sol yuxarı) */}
        {onToggleSelect && (
          <button
            type="button"
            role="checkbox"
            aria-checked={selected}
            aria-label={`${selected ? L.unselect : L.select}: ${label}`}
            onClick={onToggleSelect}
            className={`absolute left-0 top-0 z-[3] grid h-11 w-11 place-items-center rounded-[14px] ${FOCUS_ON_PHOTO}`}
          >
            <span
              aria-hidden="true"
              className={`grid h-6 w-6 place-items-center rounded-[7px] transition-colors duration-200 ${
                selected
                  ? 'bg-gold text-espresso shadow-soft'
                  : 'bg-black/25 ring-[1.5px] ring-inset ring-white/90 backdrop-blur-sm'
              }`}
            >
              {selected && <Check className="h-4 w-4" strokeWidth={3} />}
            </span>
          </button>
        )}

        {/* seçilmiş ulduzu (sağ yuxarı) */}
        {canManage && onFeature ? (
          <button
            type="button"
            aria-pressed={featured}
            aria-label={`${featured ? L.unfeature : L.feature}: ${label}`}
            onClick={onFeature}
            className={`absolute right-0 top-0 z-[3] grid h-11 w-11 place-items-center rounded-[14px] ${FOCUS_ON_PHOTO}`}
          >
            <StarBadge featured={featured} interactive />
          </button>
        ) : (
          featured && (
            <span className="absolute right-1.5 top-1.5 z-[3]" title={L.featuredBadge}>
              <StarBadge featured />
              <span className="sr-only">{L.featuredBadge}</span>
            </span>
          )
        )}

        {/* alt sətir: reaksiya (sol) · video müddəti + ⋯ (sağ) */}
        <div className="pointer-events-none absolute inset-x-1.5 bottom-1.5 z-[3] flex items-end justify-between gap-1">
          {reactionCount > 0 ? (
            <span className="inline-flex h-7 items-center gap-1 rounded-full bg-black/55 pl-1.5 pr-2.5 text-[12px] font-semibold text-white backdrop-blur-sm">
              <span aria-hidden="true" className="text-[13px] leading-none">
                {reactionEmoji ?? '❤️'}
              </span>
              <span className="lining-nums tabular-nums">{formatNumber(reactionCount)}</span>
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1">
            {isVideo && duration != null && (
              <span className="inline-flex h-7 items-center gap-1 rounded-full bg-black/55 px-2 text-[11.5px] font-medium text-white backdrop-blur-sm">
                <Film className="h-3 w-3" aria-hidden="true" />
                <span className="lining-nums tabular-nums">{formatDuration(duration)}</span>
              </span>
            )}
            {canManage && (onDownload || onDelete) && (
              <button
                type="button"
                aria-label={`${L.more}: ${label}`}
                aria-expanded={menu}
                onClick={() => setMenu(true)}
                className={`pointer-events-auto -m-1.5 grid h-11 w-11 place-items-center rounded-full ${FOCUS_ON_PHOTO}`}
              >
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              </button>
            )}
          </span>
        </div>

        {/* «⋯» — xananın içində açılan qısa panel (qonşu xanaların altında qalmır) */}
        {menu && (
          <div
            className="absolute inset-0 z-[4] flex items-center justify-center gap-2 bg-espresso/75 p-2 backdrop-blur-sm"
            onKeyDown={(e) => e.key === 'Escape' && setMenu(false)}
          >
            {onDownload && (
              <TileAction
                icon={Download}
                label={L.download}
                onClick={() => (setMenu(false), onDownload())}
                autoFocus
              />
            )}
            {onDelete && (
              <TileAction
                icon={Trash2}
                label={L.delete}
                danger
                onClick={() => (setMenu(false), onDelete())}
              />
            )}
            <TileAction icon={X} label={L.close} onClick={() => setMenu(false)} />
          </div>
        )}

        {busy && (
          <span className="absolute inset-0 z-[5] grid place-items-center bg-cream/40">
            <Spinner className="h-6 w-6 text-espresso" />
          </span>
        )}
      </div>
    </div>
  );
}

function StarBadge({ featured, interactive = false }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-7 w-7 place-items-center rounded-full transition-colors duration-200 ${
        featured
          ? 'bg-gold-rich text-white shadow-soft'
          : interactive
            ? 'bg-black/30 text-white ring-1 ring-inset ring-white/70 backdrop-blur-sm'
            : ''
      }`}
    >
      <Star className={`h-3.5 w-3.5 ${featured ? 'fill-white' : ''}`} strokeWidth={2} />
    </span>
  );
}

function TileAction({ icon: Icon, label, onClick, danger, autoFocus }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      autoFocus={autoFocus}
      className={`grid h-11 w-11 place-items-center rounded-full transition-colors ${
        danger
          ? 'bg-rust text-white hover:bg-[#86321F]'
          : 'bg-white/15 text-white ring-1 ring-inset ring-white/30 hover:bg-white/25'
      } ${FOCUS_ON_PHOTO}`}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
