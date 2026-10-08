// ════════════════════════════════════════════════════════════════
// QrStandEditor — «QR Stend» masaüstü çap stendi (YALNIZ görünüş)
//
// Desktop: solda ayarlar, sağda yapışqan A5 önbaxış. Mobil: ayarlar, sonra önbaxış.
// PDF/PNG yaradılması, şəkil yükləmə və saxlama SİZDƏDİR; önbaxış şəkli `previewUrl`.
// ════════════════════════════════════════════════════════════════
import { useState } from 'react';
import {
  Calendar,
  Check,
  Download,
  FileImage,
  Image as ImageIcon,
  ImagePlus,
  MapPin,
  QrCode,
  Save,
  SearchX,
  Trash2,
} from 'lucide-react';
import {
  Button,
  EmptyState,
  FOCUS,
  Field,
  Input,
  Notice,
  OpStatus,
  PageHeader,
  Panel,
  ProgressBar,
  RefreshButton,
  SearchInput,
  Skeleton,
  Spinner,
  Switch,
  Textarea,
  cx,
} from './adminUi';

export const QR_LAYOUTS = [
  { value: 'classic', label: 'Klassik' },
  { value: 'photo', label: 'Böyük Foto' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'frame', label: 'Çərçivə' },
];

/** Maket seçim kartındakı sxematik şəkil (dekorativ). */
function LayoutSketch({ kind }) {
  const ink = '#5C4A3A';
  const soft = '#D6CCBC';
  const gold = '#C5A059';
  const qr = (x, y, s) => (
    <g>
      <rect x={x} y={y} width={s} height={s} rx="1.5" fill="#fff" stroke={ink} strokeWidth="1.2" />
      <rect x={x + 3} y={y + 3} width={s / 3.4} height={s / 3.4} fill={ink} />
      <rect x={x + s - 3 - s / 3.4} y={y + 3} width={s / 3.4} height={s / 3.4} fill={ink} />
      <rect x={x + 3} y={y + s - 3 - s / 3.4} width={s / 3.4} height={s / 3.4} fill={ink} />
    </g>
  );
  return (
    <svg viewBox="0 0 60 84" className="h-[84px] w-[60px]" aria-hidden="true">
      <rect x="0.5" y="0.5" width="59" height="83" rx="3" fill="#FFFDF8" stroke={soft} />
      {kind === 'classic' && (
        <>
          <rect x="16" y="9" width="28" height="3" rx="1.5" fill={gold} />
          <rect x="12" y="15" width="36" height="5" rx="2" fill={ink} />
          {qr(18, 28, 24)}
          <rect x="14" y="60" width="32" height="2.5" rx="1.25" fill={soft} />
          <rect x="18" y="66" width="24" height="2.5" rx="1.25" fill={soft} />
        </>
      )}
      {kind === 'photo' && (
        <>
          <rect x="5" y="5" width="50" height="38" rx="2" fill={soft} />
          <path d="M9 39l12-14 9 9 7-6 14 11z" fill="#BFB2A0" />
          <rect x="10" y="48" width="26" height="4" rx="2" fill={ink} />
          <rect x="10" y="56" width="20" height="2.5" rx="1.25" fill={soft} />
          {qr(36, 56, 18)}
        </>
      )}
      {kind === 'minimal' && (
        <>
          {qr(15, 22, 30)}
          <rect x="20" y="60" width="20" height="2.5" rx="1.25" fill={ink} />
        </>
      )}
      {kind === 'frame' && (
        <>
          <rect x="5" y="5" width="50" height="74" rx="2" fill="none" stroke={gold} strokeWidth="1.2" />
          <rect x="8" y="8" width="44" height="68" rx="1.5" fill="none" stroke={gold} strokeWidth="0.6" />
          <rect x="16" y="14" width="28" height="4" rx="2" fill={ink} />
          {qr(19, 28, 22)}
          <rect x="17" y="58" width="26" height="2.5" rx="1.25" fill={soft} />
        </>
      )}
    </svg>
  );
}

/**
 * @typedef {{id:string,names:string,slug:string,date?:string,venue?:string}} StandInvitation
 * @typedef {{layout:'classic'|'photo'|'minimal'|'frame',title:string,subtitle:string,showDate:boolean,showPhoto:boolean,photoUrl?:string|null,photoId?:string|null}} StandSettings
 */

/**
 * @param {object} p
 * @param {StandInvitation[]} p.invitations  Axtarışa görə süzülmüş
 * @param {string|null} p.selectedId  @param {(id:string)=>void} p.onSelectInvitation
 * @param {string} [p.search]  @param {(q:string)=>void} [p.onSearch]
 * @param {()=>void} [p.onRefresh]  @param {boolean} [p.refreshing]  @param {boolean} [p.loadingList]
 * @param {StandSettings} [p.settings]  @param {(patch:Partial<StandSettings>)=>void} p.onChange
 *        Maket dəyişəndə `onChange({ layout })` gəlir (istəsəniz `onLayout` də verin)
 * @param {(layout:string)=>void} [p.onLayout]
 * @param {(file:File)=>void} p.onUploadPhoto  @param {number|null} [p.uploadProgress]  0–100, null — yüklənmir
 * @param {()=>void} p.onRemovePhoto
 * @param {{id:string,src:string}[]} [p.galleryPhotos]  «Qalereyadan seç» lenti  @param {(id:string)=>void} [p.onPickPhoto]
 * @param {()=>void} p.onSaveSettings  @param {'idle'|'saving'|'saved'|'error'} [p.saveState]
 * @param {()=>void} p.onExportPdf  @param {()=>void} [p.onExportPng]
 * @param {'pdf'|'png'|null} [p.exporting]  @param {string} [p.exportError]
 * @param {string} [p.previewUrl]  Önbaxış şəkli  @param {boolean} [p.previewLoading]
 */
export default function QrStandEditor({
  invitations = [],
  selectedId = null,
  onSelectInvitation,
  search = '',
  onSearch,
  onRefresh,
  refreshing = false,
  loadingList = false,
  settings = {},
  onChange,
  onLayout,
  onUploadPhoto,
  uploadProgress = null,
  onRemovePhoto,
  galleryPhotos = [],
  onPickPhoto,
  onSaveSettings,
  saveState = 'idle',
  onExportPdf,
  onExportPng,
  exporting = null,
  exportError,
  previewUrl,
  previewLoading = false,
}) {
  const selected = invitations.find((i) => i.id === selectedId) ?? null;
  const [pickerOpen, setPickerOpen] = useState(!selectedId);
  const showPicker = pickerOpen || !selected;
  const s = settings;
  const pick = (id) => {
    onSelectInvitation?.(id);
    setPickerOpen(false);
  };

  return (
    <div>
      <PageHeader title="QR Stend" subtitle="Masaüstü çap stendi — 148×210 mm (A5), 300 DPI PDF" />

      {/* ── Dəvətnamə seçimi ── */}
      {showPicker ? (
        <Panel
          title="Dəvətnamə seçin"
          actions={onRefresh && <RefreshButton onClick={onRefresh} refreshing={refreshing} />}
          className="mb-5"
        >
          <SearchInput
            value={search}
            onChange={onSearch}
            placeholder="Ad və ya slug axtar..."
            label="Dəvətnamə axtar"
            className="mb-3 sm:max-w-[420px]"
          />
          {loadingList ? (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[62px] w-full rounded-[8px]" />
              ))}
            </div>
          ) : invitations.length === 0 ? (
            <EmptyState
              compact
              icon={SearchX}
              title={search ? `«${search}» üzrə dəvətnamə tapılmadı` : 'Aktiv dəvətnamə yoxdur'}
            />
          ) : (
            <div
              role="radiogroup"
              aria-label="Dəvətnamə"
              className="grid max-h-[300px] gap-2 overflow-y-auto p-0.5 sm:grid-cols-2 sm:max-h-none xl:grid-cols-4"
            >
              {invitations.map((inv) => {
                const on = inv.id === selectedId;
                return (
                  <button
                    key={inv.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => pick(inv.id)}
                    className={cx(
                      'relative flex min-h-[62px] flex-col justify-center rounded-[8px] px-3.5 py-2.5 text-left ring-1 ring-inset transition-colors',
                      on
                        ? 'bg-gold-mist/60 ring-2 ring-[#A9822F]'
                        : 'bg-white ring-[#E5DED2] hover:bg-[#FAF8F4]',
                      FOCUS,
                    )}
                  >
                    <span className="truncate pr-6 text-[14.5px] font-medium text-espresso">{inv.names}</span>
                    <span className="truncate font-mono text-[12.5px] text-[#6B5E54]">{inv.slug}</span>
                    {on && (
                      <Check className="absolute right-3 top-3 h-4 w-4 text-gold-deep" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </Panel>
      ) : (
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[12px] bg-white px-4 py-3 ring-1 ring-inset ring-[#E5DED2]">
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] text-[#6B5E54]">Seçilmiş dəvətnamə</p>
            <p className="truncate text-[16px] font-semibold text-espresso">{selected.names}</p>
            <p className="flex flex-wrap gap-x-3 text-[13.5px] text-[#5C4A3A]">
              {selected.date && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#8A7D72]" aria-hidden="true" />
                  {selected.date}
                </span>
              )}
              {selected.venue && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#8A7D72]" aria-hidden="true" />
                  {selected.venue}
                </span>
              )}
            </p>
          </div>
          <Button size="sm" onClick={() => setPickerOpen(true)}>
            Başqa dəvətnamə
          </Button>
        </div>
      )}

      {!selected ? (
        <div className="rounded-[12px] border border-dashed border-[#D6CCBC]">
          <EmptyState
            icon={QrCode}
            title="Dəvətnamə seçilməyib"
            text="Stendi qurmaq üçün yuxarıdan bir dəvətnamə seçin."
          />
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
          {/* ── Ayarlar ── */}
          <div className="space-y-4">
            <Panel title="Maket">
              <div role="radiogroup" aria-label="Maket" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {QR_LAYOUTS.map((l) => {
                  const on = s.layout === l.value;
                  return (
                    <button
                      key={l.value}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => {
                        onChange?.({ layout: l.value });
                        onLayout?.(l.value);
                      }}
                      className={cx(
                        'relative flex flex-col items-center gap-2 rounded-[8px] px-2 pb-2.5 pt-3 ring-1 ring-inset transition-colors',
                        on
                          ? 'bg-gold-mist/60 ring-2 ring-[#A9822F]'
                          : 'bg-white ring-[#E5DED2] hover:bg-[#FAF8F4]',
                        FOCUS,
                      )}
                    >
                      <LayoutSketch kind={l.value} />
                      <span className="text-[13.5px] font-medium text-espresso">{l.label}</span>
                      {on && (
                        <Check className="absolute right-2 top-2 h-4 w-4 text-gold-deep" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel title="Mətn">
              <div className="space-y-4">
                <Field label="Başlıq">
                  <Input
                    value={s.title ?? ''}
                    onChange={(e) => onChange?.({ title: e.target.value })}
                    placeholder={selected.names}
                  />
                </Field>
                <Field label="İzah">
                  <Textarea
                    rows={2}
                    value={s.subtitle ?? ''}
                    onChange={(e) => onChange?.({ subtitle: e.target.value })}
                    placeholder="Şəkillərinizi bizimlə paylaşın — QR kodu skan edin"
                  />
                </Field>
                <div className="divide-y divide-[#EEE8DF] border-t border-[#EEE8DF]">
                  <Switch
                    className="py-3"
                    checked={Boolean(s.showDate)}
                    onChange={(v) => onChange?.({ showDate: v })}
                    label="Tarixi göstər"
                  />
                  <Switch
                    className="py-3"
                    checked={Boolean(s.showPhoto)}
                    onChange={(v) => onChange?.({ showPhoto: v })}
                    label="Şəkli göstər"
                  />
                </div>
              </div>
            </Panel>

            {s.showPhoto && (
              <Panel title="Bəy-gəlin şəkli">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#F3EEE6] ring-1 ring-inset ring-[#E5DED2]">
                    {s.photoUrl ? (
                      <img src={s.photoUrl} alt="Stenddəki şəkil" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-7 w-7 text-[#B5A99A]" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    {uploadProgress != null ? (
                      <ProgressBar value={uploadProgress} label="Şəkil yüklənir" />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <UploadButton onFile={onUploadPhoto}>
                          {s.photoUrl ? 'Başqa şəkil yüklə' : 'Şəkil yüklə'}
                        </UploadButton>
                        {s.photoUrl && (
                          <Button variant="ghost" destructive icon={Trash2} onClick={onRemovePhoto}>
                            Sil
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {galleryPhotos.length > 0 && (
                  <div className="mt-4">
                    <p id="qr-gal" className="mb-2 text-[13px] font-semibold text-[#3F342E]">
                      və ya qalereyadan seçin
                    </p>
                    <div
                      role="radiogroup"
                      aria-labelledby="qr-gal"
                      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:thin]"
                    >
                      {galleryPhotos.map((ph, i) => {
                        const on = s.photoId === ph.id;
                        return (
                          <button
                            key={ph.id}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            aria-label={`Qalereya şəkli ${i + 1}`}
                            onClick={() => onPickPhoto?.(ph.id)}
                            className={cx(
                              'relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px]',
                              on ? 'ring-[3px] ring-[#A9822F]' : 'ring-1 ring-black/10',
                              FOCUS,
                            )}
                          >
                            <img src={ph.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                            {on && (
                              <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Check className="h-5 w-5 text-white" aria-hidden="true" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Panel>
            )}

            <Panel>
              <div className="flex flex-wrap items-center gap-3">
                <Button icon={Save} loading={saveState === 'saving'} onClick={onSaveSettings}>
                  {saveState === 'saving' ? 'Saxlanılır…' : 'Ayarları saxla'}
                </Button>
                <OpStatus
                  state={saveState === 'saved' ? 'done' : saveState === 'error' ? 'error' : 'idle'}
                  text={
                    saveState === 'saved'
                      ? 'Saxlanıldı'
                      : saveState === 'error'
                        ? 'Saxlamaq alınmadı'
                        : undefined
                  }
                />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#6B5E54]">
                «Ayarları saxla» başlıq, izah və maketi bu toy üçün yadda saxlayır — sonra yenidən açanda hər
                şey olduğu kimi qalır.
              </p>
            </Panel>
          </div>

          {/* ── Önbaxış + ixrac ── */}
          <aside aria-label="Önbaxış və endirmə" className="mt-6 space-y-4 lg:sticky lg:top-6 lg:mt-0">
            <div className="rounded-[12px] bg-[#EFE9DF] p-4 ring-1 ring-inset ring-[#E0D7C9] sm:p-5">
              <p
                lang="az"
                className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#5C4A3A]"
              >
                Önbaxış
              </p>
              <div className="relative mx-auto aspect-[148/210] w-full max-w-[360px] overflow-hidden rounded-[2px] bg-white shadow-[0_18px_40px_-20px_rgba(28,22,20,0.45)]">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt={`${selected.names} üçün QR stend önbaxışı`}
                    className="h-full w-full object-contain"
                  />
                )}
                {(previewLoading || !previewUrl) && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 text-[14px] font-medium text-[#5C4A3A]"
                    role="status"
                  >
                    <Spinner className="h-6 w-6" />
                    Önbaxış hazırlanır…
                  </div>
                )}
              </div>
              <p className="mt-3 text-center text-[12.5px] leading-snug text-[#5C4A3A]">
                Endirilən PDF 300 DPI-dədir — önbaxış yalnız ekran üçün kiçildilmişdir.
              </p>
            </div>
            <div className="space-y-3 rounded-[12px] bg-white p-4 ring-1 ring-inset ring-[#E5DED2]">
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  icon={Download}
                  loading={exporting === 'pdf'}
                  disabled={Boolean(exporting)}
                  onClick={onExportPdf}
                  className="flex-1"
                >
                  {exporting === 'pdf' ? 'PDF hazırlanır…' : 'PDF endir'}
                </Button>
                {onExportPng && (
                  <Button
                    icon={FileImage}
                    loading={exporting === 'png'}
                    disabled={Boolean(exporting)}
                    onClick={onExportPng}
                  >
                    PNG
                  </Button>
                )}
              </div>
              {exportError && <Notice tone="danger">{exportError}</Notice>}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function UploadButton({ onFile, children }) {
  const [key, setKey] = useState(0);
  return (
    <label
      className={cx(
        'relative inline-flex h-11 cursor-pointer items-center gap-2 rounded-[8px] bg-white px-4 text-[14px] font-medium text-espresso ring-1 ring-inset ring-[#D6CCBC] hover:bg-[#F6F3ED] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#A9822F]',
      )}
    >
      <ImagePlus className="h-4 w-4" aria-hidden="true" />
      {children}
      <input
        key={key}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile?.(f);
          setKey((k) => k + 1);
        }}
      />
    </label>
  );
}
