// ════════════════════════════════════════════════════════════════
// GalleriesList — «Fotolar» (qonaq qalereyaları) (YALNIZ görünüş)
//
// Hər albom kartdır: örtük şəkli (verilsə), cütlüyün adı + slug, foto/video sayı, ölçü,
// son yükləmə. Ən çox işlənən əməliyyat — «İdarəetmə linkini kopyala» — əsas düymədir.
// ════════════════════════════════════════════════════════════════
import {
  Camera,
  Clock3,
  ExternalLink,
  Film,
  HardDrive,
  Image as ImageIcon,
  LayoutGrid,
  MonitorPlay,
  SearchX,
  Upload,
} from 'lucide-react';
import {
  ActionMenu,
  Button,
  CopyButton,
  EmptyState,
  PageHeader,
  Skeleton,
  Toolbar,
  cx,
  formatNumber,
} from './adminUi';

/**
 * @typedef {object} Album
 * @property {string} id  @property {string} slug  @property {string} [names]  «Aysel & Nicat»
 * @property {number} photos  @property {number} [videos]  @property {string} size  «0.4 MB»
 * @property {string} [lastUpload]  «7 okt 2026, 09:19»  @property {string} [cover]  Örtük şəkli URL
 * @property {string} [manageUrl]  Cütlüyə göndəriləcək idarəetmə linki
 */

/**
 * @param {object} p
 * @param {Album[]} p.albums  Axtarışa görə süzülmüş
 * @param {{albums:number,photos:number,size:string}} [p.totals]  Başlıq altı: «3 albom · 36 foto · 0.8 MB»
 * @param {string} [p.search]  @param {(q:string)=>void} [p.onSearch]
 * @param {()=>void} [p.onRefresh]  @param {boolean} [p.refreshing]  @param {boolean} [p.loading]
 * @param {(a:Album)=>void|Promise<void>} p.onCopyLink   İdarəetmə linkini kopyala (clipboard sizdədir)
 * @param {(a:Album)=>void} p.onManage     Qalereyanı idarə et
 * @param {(a:Album)=>void} p.onSlideshow  Slayd şou (TV / proyektor)
 * @param {(a:Album)=>void} p.onUploadPage Foto yükləmə səhifəsi
 */
export default function GalleriesList({
  albums = [],
  totals,
  search = '',
  onSearch,
  onRefresh,
  refreshing = false,
  loading = false,
  onCopyLink,
  onManage,
  onSlideshow,
  onUploadPage,
}) {
  const sub = totals
    ? `${formatNumber(totals.albums)} albom · ${formatNumber(totals.photos)} foto · ${totals.size}`
    : `${albums.length} albom`;
  return (
    <div>
      <PageHeader title="Fotolar" subtitle={loading ? 'Yüklənir…' : sub} />
      <Toolbar
        search={{
          value: search,
          onChange: onSearch,
          placeholder: 'Ad və ya slug axtar...',
          label: 'Albom axtar',
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        className="mb-4"
      />

      {loading ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <li key={i} className="overflow-hidden rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]">
              <Skeleton className="aspect-[16/9] w-full rounded-none" />
              <div className="space-y-2.5 p-4">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3.5 w-48" />
                <Skeleton className="mt-4 h-11 w-full" />
              </div>
            </li>
          ))}
        </ul>
      ) : albums.length === 0 ? (
        <div className="rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]">
          {search ? (
            <EmptyState
              icon={SearchX}
              title={`«${search}» üzrə albom tapılmadı`}
              action={<Button onClick={() => onSearch?.('')}>Axtarışı təmizlə</Button>}
            />
          ) : (
            <EmptyState
              icon={ImageIcon}
              title="Hələ albom yoxdur"
              text="Qonaqlar ilk şəkli göndərəndə toyun albomu burada yaranır."
            />
          )}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {albums.map((a) => (
            <AlbumCard
              key={a.id}
              album={a}
              onCopyLink={onCopyLink}
              onManage={onManage}
              onSlideshow={onSlideshow}
              onUploadPage={onUploadPage}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/** Albom kartı (ayrıca da işlədilə bilər). */
export function AlbumCard({ album: a, onCopyLink, onManage, onSlideshow, onUploadPage }) {
  return (
    <li className="flex min-w-0 flex-col overflow-hidden rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]">
      <div className="relative aspect-[16/9] bg-[#F3EEE6]">
        {a.cover ? (
          <img src={a.cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[#B5A99A]">
            <ImageIcon className="h-8 w-8" aria-hidden="true" />
          </span>
        )}
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[12.5px] font-medium text-white backdrop-blur">
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
          {formatNumber(a.photos)}
          {a.videos > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <Film className="h-3.5 w-3.5" aria-hidden="true" />
              {formatNumber(a.videos)}
            </>
          )}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="truncate text-[16px] font-semibold text-espresso">{a.names ?? a.slug}</h2>
        {a.names && <p className="truncate font-mono text-[12.5px] text-[#6B5E54]">{a.slug}</p>}
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13.5px]">
          <div className="flex items-center gap-1.5 text-[#3F342E]">
            <dt className="sr-only">Məzmun</dt>
            <Camera className="h-4 w-4 text-[#8A7D72]" aria-hidden="true" />
            <dd>
              {formatNumber(a.photos)} foto{a.videos ? ` · ${formatNumber(a.videos)} video` : ''}
            </dd>
          </div>
          <div className="flex items-center gap-1.5 text-[#3F342E]">
            <dt className="sr-only">Ölçü</dt>
            <HardDrive className="h-4 w-4 text-[#8A7D72]" aria-hidden="true" />
            <dd>{a.size}</dd>
          </div>
          {a.lastUpload && (
            <div className="col-span-2 flex items-center gap-1.5 text-[#5C4A3A]">
              <dt className="sr-only">Son yükləmə</dt>
              <Clock3 className="h-4 w-4 text-[#8A7D72]" aria-hidden="true" />
              <dd>Son yükləmə: {a.lastUpload}</dd>
            </div>
          )}
        </dl>
        <div className="mt-auto space-y-2 pt-4">
          <CopyButton
            block
            variant="primary"
            value={a.manageUrl}
            onCopy={() => onCopyLink?.(a)}
            label="İdarəetmə linkini kopyala"
            copiedLabel="Link kopyalandı"
          />
          <div className="flex gap-2">
            <Button icon={LayoutGrid} onClick={() => onManage?.(a)} className="flex-1 px-3">
              İdarə et
            </Button>
            <Button icon={MonitorPlay} onClick={() => onSlideshow?.(a)} className="flex-1 px-3">
              Slayd şou
            </Button>
            <ActionMenu
              label={`${a.names ?? a.slug} — digər əməliyyatlar`}
              variant="secondary"
              side="top"
              items={[
                {
                  id: 'upload',
                  label: 'Foto yükləmə səhifəsi',
                  icon: Upload,
                  onSelect: () => onUploadPage?.(a),
                },
                {
                  id: 'open',
                  label: 'İdarəetmə linkini aç',
                  icon: ExternalLink,
                  onSelect: () => a.manageUrl && window.open(a.manageUrl, '_blank', 'noopener'),
                  hidden: !a.manageUrl,
                },
              ]}
            />
          </div>
          <p className={cx('text-[12.5px] leading-snug text-[#6B5E54]')}>
            Link cütlüyə göndərilir — onunla şəkilləri seçir, silir və endirir.
          </p>
        </div>
      </div>
    </li>
  );
}
