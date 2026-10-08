// ════════════════════════════════════════════════════════════════
// 5) Qapaq və slayd şou ayarları (cütlük) — YALNIZ görünüş
//   CoverSettingsSheet · Switch · CoverPicker · SecondsSlider
// Dəyərlər `values` ilə gəlir, dəyişiklik onChange(patch) ilə gedir; saxlamaq onSave-dədir.
// ════════════════════════════════════════════════════════════════
import { useId } from 'react';
import { AlertTriangle, Check, ImagePlus, Presentation, Trash2 } from 'lucide-react';
import Sheet from './Sheet';
import { Btn, Spinner } from './shared';
import { FOCUS } from './tokens';

// ════════════════════════════════════════════════════════════════
/**
 * Premium açar (role="switch"). Etiket və izah ilə tam sətir — bütün sətir toxunuşa açıqdır.
 * @param {object} p
 * @param {boolean} p.checked
 * @param {(v:boolean)=>void} p.onChange
 * @param {string} p.label
 * @param {string} [p.description]
 * @param {boolean} [p.disabled]
 */
export function Switch({ checked, onChange, label, description, disabled = false }) {
  const id = useId();
  return (
    <div className="flex items-start gap-4 py-1">
      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className={`block cursor-pointer text-[15px] font-medium leading-snug ${disabled ? 'text-brown-muted' : 'text-ink'}`}
        >
          {label}
        </label>
        {description && (
          <p id={`${id}-d`} className="mt-1 text-[13px] leading-snug text-brown-dark">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={!!checked}
        aria-describedby={description ? `${id}-d` : undefined}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative mt-0.5 inline-flex h-8 w-[54px] shrink-0 before:absolute before:-inset-1.5 before:content-[''] items-center rounded-full p-1 transition-colors duration-300 ease-luxe disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS} ${
          checked ? 'bg-espresso' : 'bg-beige-dark'
        }`}
      >
        <span
          aria-hidden="true"
          className={`grid h-6 w-6 place-items-center rounded-full shadow-[0_1px_3px_rgba(44,37,35,0.3)] transition-transform duration-300 ease-luxe ${
            checked ? 'translate-x-[22px] bg-gold-light' : 'translate-x-0 bg-white'
          }`}
        >
          {checked && <Check className="h-3 w-3 text-espresso" strokeWidth={3} />}
        </span>
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Qapaq seçimi: böyük önizləmə (başlıq üstündə, necə görünəcəksə elə) + yüklə/sil
 * + qalereyadan üfüqi sürüşən lent.
 * @param {object} p
 * @param {string} [p.value]                  Seçilmiş qapağın URL-i
 * @param {string} [p.selectedId]             Qalereyadan seçilibsə media id-si
 * @param {{id:string, src:string, featured?:boolean}[]} [p.options]   Qalereya şəkilləri
 * @param {(id:string)=>void} p.onSelect
 * @param {(files:FileList)=>void} p.onUpload
 * @param {()=>void} [p.onRemove]
 * @param {boolean} [p.uploading]
 * @param {string} [p.previewTitle]           Önizləmədə göstəriləcək başlıq
 * @param {string} [p.previewSubtitle]
 * @param {object} [p.labels]   { title, upload, uploading, remove, fromGallery, empty, preview }
 */
export function CoverPicker({
  value,
  selectedId,
  options = [],
  onSelect,
  onUpload,
  onRemove,
  uploading = false,
  previewTitle,
  previewSubtitle,
  labels = {},
}) {
  const L = {
    title: 'Qapaq şəkli',
    upload: 'Şəkil yüklə',
    uploading: 'Yüklənir…',
    remove: 'Qapağı sil',
    fromGallery: 'və ya qalereyadan seçin',
    empty: 'Qapaq seçilməyib',
    ...labels,
  };
  const fileId = useId();
  const groupId = useId();
  return (
    <div>
      <p lang="az" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brown-dark">
        {L.title}
      </p>

      {/* böyük önizləmə */}
      <div className="relative mt-3 aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-beige ring-1 ring-inset ring-gold/25">
        {value ? (
          <>
            <img src={value} alt="" className="h-full w-full object-cover" />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,15,0.15),rgba(20,16,15,0.65))]"
            />
            <span className="absolute inset-x-4 bottom-4 text-center">
              {previewTitle && (
                <span className="block font-serif text-[26px] leading-tight text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.4)]">
                  {previewTitle}
                </span>
              )}
              {previewSubtitle && (
                <span className="mt-1 block font-serif text-[15px] italic text-white/90">
                  {previewSubtitle}
                </span>
              )}
            </span>
          </>
        ) : (
          <span className="flex h-full flex-col items-center justify-center gap-2 text-brown-dark">
            <ImagePlus className="h-7 w-7 text-gold-deep" strokeWidth={1.4} aria-hidden="true" />
            <span className="text-[13.5px]">{L.empty}</span>
          </span>
        )}
        {uploading && (
          <span
            className="absolute inset-0 grid place-items-center bg-cream/70 backdrop-blur-sm"
            role="status"
          >
            <span className="inline-flex items-center gap-2 text-[13px] font-medium text-ink">
              <Spinner className="h-5 w-5 text-gold-deep" />
              {L.uploading}
            </span>
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <label
          lang="az"
          htmlFor={fileId}
          className={`relative inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-white px-4 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-gold-deep ring-1 ring-inset ring-gold/45 transition-colors hover:bg-gold-mist/60 ${
            uploading ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <input
            id={fileId}
            type="file"
            accept="image/*"
            className="peer sr-only"
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files?.length) onUpload?.(e.target.files);
              e.target.value = '';
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-gold-deep peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream"
          />
          <ImagePlus className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          {L.upload}
        </label>
        {value && onRemove && (
          <Btn
            variant="quiet"
            size="sm"
            icon={Trash2}
            onClick={onRemove}
            disabled={uploading}
            className="text-rust hover:bg-rust-mist hover:text-rust"
          >
            {L.remove}
          </Btn>
        )}
      </div>

      {options.length > 0 && (
        <div className="mt-5">
          <p id={groupId} className="text-[13px] text-brown-dark">
            {L.fromGallery}
          </p>
          <div className="-mx-5 mt-2 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden">
            <div role="radiogroup" aria-labelledby={groupId} className="flex w-max gap-2 py-1">
              {options.map((o, i) => {
                const on = o.id === selectedId;
                return (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={`${i + 1}`}
                    onClick={() => onSelect?.(o.id)}
                    className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[12px] transition-[box-shadow,transform] duration-200 sm:h-20 sm:w-20 ${FOCUS} ${
                      on ? 'scale-[0.97] ring-[3px] ring-gold' : 'ring-1 ring-black/10 hover:ring-gold/60'
                    }`}
                  >
                    <img src={o.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                    {on && (
                      <span className="absolute inset-0 grid place-items-center bg-espresso/35">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-gold text-espresso">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Saniyə sürüşgəci (native range — klaviatura ilə də işləyir).
 * @param {object} p
 * @param {number} p.value
 * @param {(v:number)=>void} p.onChange
 * @param {number} [p.min=3] @param {number} [p.max=15] @param {number} [p.step=1]
 * @param {(v:number)=>string} [p.formatLabel]   Default: «Hər şəkil 6 saniyə göstərilsin»
 */
export function SecondsSlider({
  value,
  onChange,
  min = 3,
  max = 15,
  step = 1,
  formatLabel = (v) => `Hər şəkil ${v} saniyə göstərilsin`,
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-medium text-ink">
        {formatLabel(value)}
      </label>
      <div className="relative mt-4 h-11">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-beige-dark"
        />
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gold-deep"
          style={{ width: `${pct}%` }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className={`relative h-11 w-full cursor-pointer appearance-none bg-transparent ${FOCUS} rounded-full
            [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-espresso [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(44,37,35,0.35)]
            [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-espresso`}
        />
      </div>
      <div aria-hidden="true" className="mt-1 flex justify-between text-[11.5px] text-brown-dark lining-nums">
        <span>{min} san.</span>
        <span>{max} san.</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * @typedef {object} CoverSettings
 * @property {boolean} showCover
 * @property {string} title
 * @property {string} subtitle
 * @property {string} [coverUrl]
 * @property {string} [coverId]
 * @property {number} seconds
 * @property {boolean} featuredOnly
 * @property {boolean} showQr          TV-də «Şəkil göndər» QR kodu (default: true)
 */

/**
 * @param {object} p
 * @param {boolean} p.open @param {()=>void} p.onClose
 * @param {CoverSettings} p.values
 * @param {(patch: Partial<CoverSettings>)=>void} p.onChange
 * @param {()=>void} p.onSave
 * @param {'idle'|'saving'|'saved'|'error'} [p.saveState='idle']
 * @param {string} [p.errorText='Saxlamaq alınmadı. Yenidən cəhd edin.']
 * @param {string} [p.defaultTitle]          Başlıq boş qalanda göstəriləcək adlar (placeholder)
 * @param {{id:string, src:string}[]} [p.mediaOptions]
 * @param {(files:FileList)=>void} p.onUploadCover
 * @param {()=>void} [p.onRemoveCover]
 * @param {boolean} [p.coverUploading]
 * @param {string} [p.subtitleHeader]        «#aysel-ve-nicat»
 * @param {object} [p.labels]
 */
export default function CoverSettingsSheet({
  open,
  onClose,
  values,
  onChange,
  onSave,
  saveState = 'idle',
  errorText = 'Saxlamaq alınmadı. Yenidən cəhd edin.',
  defaultTitle = '',
  mediaOptions = [],
  onUploadCover,
  onRemoveCover,
  coverUploading = false,
  subtitleHeader,
  labels = {},
  lang = 'az',
}) {
  const L = {
    title: 'Qapaq və Slayd Şou',
    showCover: 'Qalereyanın başında üz qapağını göstər',
    titleField: 'Başlıq',
    titleHint: 'Boş qalsa dəvətnamədəki adlar işlədilir.',
    subtitleField: 'Alt yazı',
    subtitlePlaceholder: 'Xatirələrinizi bizimlə paylaşın',
    slideshow: 'Slayd şou',
    featuredOnly: 'Yalnız seçilmiş şəkilləri göstər',
    featuredOnlyHint: 'Seçilmiş şəkil yoxdursa hamısı göstərilir — ekran boş qalmır.',
    showQr: 'TV ekranında «Şəkil göndər» QR kodunu göstər',
    showQrHint: 'Qonaqlar zaldakı ekrandan QR-ı skan edib şəkil göndərə bilir.',
    cancel: 'Ləğv et',
    save: 'Saxla',
    saving: 'Saxlanılır…',
    saved: 'Saxlanıldı',
    ...labels,
  };
  const tId = useId();
  const sId = useId();
  const busy = saveState === 'saving';
  const inputCls = `block w-full rounded-2xl bg-white px-4 text-[16px] text-ink ring-1 ring-inset ring-beige-dark placeholder:text-brown-muted transition-shadow hover:ring-gold/60 focus:outline-none focus:ring-2 focus:ring-gold-deep`;

  const footer = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p aria-live="polite" className="min-h-[20px] text-[13px]">
        {saveState === 'saved' && (
          <span className="inline-flex items-center gap-1.5 font-medium text-olive">
            <Check className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
            {L.saved}
          </span>
        )}
        {saveState === 'error' && (
          <span role="alert" className="inline-flex items-center gap-1.5 font-medium text-rust">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {errorText}
          </span>
        )}
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:flex">
        <Btn variant="ghost" onClick={onClose} disabled={busy}>
          {L.cancel}
        </Btn>
        <Btn variant="primary" onClick={onSave} disabled={busy}>
          {busy && <Spinner />}
          {busy ? L.saving : L.save}
        </Btn>
      </div>
    </div>
  );

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={L.title}
      subtitle={subtitleHeader}
      footer={footer}
      lang={lang}
    >
      <div className="space-y-7">
        <Switch checked={values.showCover} onChange={(v) => onChange({ showCover: v })} label={L.showCover} />

        <div
          className={`space-y-6 transition-opacity ${values.showCover ? '' : 'pointer-events-none opacity-50'}`}
          aria-disabled={!values.showCover}
        >
          <div>
            <label
              lang={lang}
              htmlFor={tId}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brown-dark"
            >
              {L.titleField}
            </label>
            <input
              id={tId}
              type="text"
              value={values.title ?? ''}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder={defaultTitle}
              aria-describedby={`${tId}-h`}
              maxLength={120}
              disabled={!values.showCover}
              className={`mt-2 h-14 ${inputCls}`}
            />
            <p id={`${tId}-h`} className="mt-2 text-[13px] text-brown-dark">
              {L.titleHint}
            </p>
          </div>
          <div>
            <label
              lang={lang}
              htmlFor={sId}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brown-dark"
            >
              {L.subtitleField}
            </label>
            <textarea
              id={sId}
              rows={2}
              value={values.subtitle ?? ''}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              placeholder={L.subtitlePlaceholder}
              maxLength={240}
              disabled={!values.showCover}
              className={`mt-2 resize-none py-3.5 leading-relaxed ${inputCls}`}
            />
          </div>
          <CoverPicker
            value={values.coverUrl}
            selectedId={values.coverId}
            options={mediaOptions}
            onSelect={(id) =>
              onChange({
                coverId: id,
                coverUrl: mediaOptions.find((m) => m.id === id)?.src,
              })
            }
            onUpload={onUploadCover}
            onRemove={onRemoveCover}
            uploading={coverUploading}
            previewTitle={values.title?.trim() || defaultTitle}
            previewSubtitle={values.subtitle}
            labels={L.cover}
          />
        </div>

        <div className="border-t border-gold/20 pt-6">
          <p
            lang={lang}
            className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brown-dark"
          >
            <Presentation className="h-4 w-4 text-gold-deep" strokeWidth={1.7} aria-hidden="true" />
            {L.slideshow}
          </p>
          <div className="mt-5 space-y-6">
            <SecondsSlider
              max={30}
              value={values.seconds}
              onChange={(v) => onChange({ seconds: v })}
              formatLabel={L.formatSeconds}
            />
            <Switch
              checked={values.featuredOnly}
              onChange={(v) => onChange({ featuredOnly: v })}
              label={L.featuredOnly}
              description={L.featuredOnlyHint}
            />
            <Switch
              checked={values.showQr}
              onChange={(v) => onChange({ showQr: v })}
              label={L.showQr}
              description={L.showQrHint}
            />
          </div>
        </div>
      </div>
    </Sheet>
  );
}
