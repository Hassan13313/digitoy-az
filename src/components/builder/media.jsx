// ════════════════════════════════════════════════════════════════
// Builder — musiqi, fayl yükləmə və «Bizim Hekayəmiz» fəsli (YALNIZ görünüş)
// Fayl seçimi: komponent yalnız onFiles(FileList) çağırır — yükləmə sizin məntiqinizdədir.
// ════════════════════════════════════════════════════════════════
import { useId, useState } from 'react';
import {
  AlertCircle,
  Check,
  FileAudio,
  GripVertical,
  ImagePlus,
  Music,
  Pause,
  Play,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import t from '../../data/translations';
import { Field, Textarea, TextInput } from './fields';
import { Spinner } from './feedback';

const tx = (lang) => t[lang] ?? t.az ?? {};

// ════════════════════════════════════════════════════════════════
/**
 * Hazır melodiya sətri.
 * @param {object} p
 * @param {string} p.title
 * @param {string} [p.artist]
 * @param {string} [p.duration]        «4:46»
 * @param {string} [p.tint]            Örtük rəngi (hex)
 * @param {boolean} [p.playing]
 * @param {boolean} [p.buffering]      Səs yüklənir — spinner
 * @param {()=>void} p.onTogglePlay
 * @param {boolean} [p.selected]
 * @param {()=>void} p.onSelect
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function MusicTrackRow({
  title,
  artist,
  duration,
  tint = '#E8D5A3',
  playing,
  buffering,
  onTogglePlay,
  selected,
  onSelect,
  lang = 'az',
}) {
  const x = tx(lang);
  return (
    <div
      className={`rounded-2xl p-3 ring-1 ring-inset transition-[background-color,box-shadow] duration-300 sm:p-4 ${
        selected ? 'bg-gold-mist/55 shadow-soft ring-2 ring-espresso' : 'bg-white ring-beige-dark hover:ring-gold/50'
      }`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4">
        <span
          className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-[12px]"
          style={{ background: `linear-gradient(135deg, ${tint}, #FDFBF7)` }}
          aria-hidden="true"
        >
          {playing ? (
            <span className="flex h-6 items-end gap-[3px]">
              {[0, 0.25, 0.1, 0.35].map((d) => (
                <span
                  key={d}
                  className="h-full w-[3px] origin-bottom animate-eq rounded-full bg-espresso"
                  style={{ animationDelay: `${d}s` }}
                />
              ))}
            </span>
          ) : (
            <Music className="h-5 w-5 text-espresso/70" strokeWidth={1.5} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-medium text-ink">{title}</p>
          <p className="truncate text-[13px] text-brown-dark/85">
            {artist}
            {duration && (
              <>
                <span aria-hidden="true" className="mx-1.5 text-gold">
                  ·
                </span>
                <span className="lining-nums tabular-nums">{duration}</span>
              </>
            )}
          </p>
        </div>
        {/* desktop düymələri */}
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <PlayButton playing={playing} buffering={buffering} onClick={onTogglePlay} title={title} x={x} />
          <SelectButton selected={selected} onClick={onSelect} title={title} x={x} />
        </div>
      </div>
      {/* mobil düymələri — ad kəsilməsin deyə alt sətirdə */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
        <PlayButton playing={playing} buffering={buffering} onClick={onTogglePlay} title={title} x={x} />
        <SelectButton selected={selected} onClick={onSelect} title={title} x={x} />
      </div>
    </div>
  );
}

function PlayButton({ playing, buffering, onClick, title, x }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!playing}
      aria-label={`${playing ? (x.musicStop ?? 'Dayandır') : (x.musicListen ?? 'Dinlə')}: ${title}`}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-[11.5px] font-semibold uppercase tracking-label text-brown-dark ring-1 ring-inset ring-beige-dark transition-colors hover:text-ink hover:ring-gold"
    >
      {buffering ? (
        <Spinner size="sm" tone="dark" />
      ) : playing ? (
        <Pause className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Play className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {playing ? (x.musicStop ?? 'Dayandır') : (x.musicListen ?? 'Dinlə')}
    </button>
  );
}

function SelectButton({ selected, onClick, title, x }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      aria-label={`${selected ? (x.musicSelected ?? 'Seçildi') : (x.musicSelect ?? 'Seç')}: ${title}`}
      className={`inline-flex h-11 min-w-[96px] items-center justify-center gap-1.5 rounded-full px-4 text-[11.5px] font-semibold uppercase tracking-label transition-colors ${
        selected ? 'bg-espresso text-gold-light' : 'bg-gold text-espresso hover:bg-[#CDA963]'
      }`}
    >
      {selected && <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden="true" />}
      {selected ? (x.musicSelected ?? 'Seçildi') : (x.musicSelect ?? 'Seç')}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Fayl yükləmə zonası (sürüklə-burax + klik). Fayl seçiləndə onFiles(FileList) çağırılır.
 * @param {object} p
 * @param {string} p.id
 * @param {string} [p.accept]          «audio/mpeg,.mp3»
 * @param {boolean} [p.multiple]
 * @param {(files:FileList)=>void} p.onFiles
 * @param {string} [p.title]           «MP3 faylını buraya atın»
 * @param {string} [p.hint]            «Yalnız MP3 · maksimum 20 MB»
 * @param {{name:string, size?:string}} [p.file]   Yüklənmiş fayl (verilərsə fayl sətri göstərilir)
 * @param {number} [p.progress]        0–100 (yükləmə zamanı)
 * @param {string} [p.error]
 * @param {()=>void} [p.onRemove]
 * @param {boolean} [p.disabled]
 * @param {React.ComponentType} [p.icon]
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function UploadDropzone({
  id,
  accept,
  multiple,
  onFiles,
  title,
  hint,
  file,
  progress,
  error,
  onRemove,
  disabled,
  icon: Icon = UploadCloud,
  lang = 'az',
}) {
  const x = tx(lang);
  const [over, setOver] = useState(false); // yalnız UI vəziyyəti
  const uploading = typeof progress === 'number' && progress < 100;

  if (file) {
    return (
      <div
        className={`rounded-2xl p-4 ring-1 ring-inset ${error ? 'bg-rust-mist/50 ring-rust/40' : 'bg-white ring-gold/30'}`}
      >
        <div className="flex items-center gap-3.5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-espresso text-gold-light">
            <FileAudio className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-medium text-ink">{file.name}</p>
            <p className="text-[12.5px] text-brown-dark/85">
              {uploading
                ? `${x.uploading ?? 'Yüklənir'} · ${Math.round(progress)}%`
                : (file.size ?? x.uploaded ?? 'Yükləndi')}
            </p>
          </div>
          {!uploading && !error && (
            <span className="hidden items-center gap-1 rounded-full bg-olive-mist px-2.5 py-1 text-[11px] font-semibold text-olive sm:inline-flex">
              <Check className="h-3 w-3" strokeWidth={2.6} aria-hidden="true" />
              {x.uploaded ?? 'Yükləndi'}
            </span>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`${x.removeFile ?? 'Faylı sil'}: ${file.name}`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] text-brown-muted transition-colors hover:bg-rust-mist hover:text-rust"
            >
              <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
            </button>
          )}
        </div>
        {typeof progress === 'number' && (
          <div
            className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-beige"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-label={x.uploading ?? 'Yüklənir'}
          >
            <div
              className="h-full rounded-full bg-gold-deep transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {error && (
          <p role="alert" className="mt-2.5 flex items-start gap-1.5 text-[13px] text-rust">
            <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (!disabled && e.dataTransfer.files?.length) onFiles?.(e.dataTransfer.files);
        }}
        className={`group relative flex min-h-[168px] flex-col items-center justify-center rounded-3xl border-[1.5px] border-dashed px-6 py-8 text-center transition-[background-color,border-color] duration-300 ${
          disabled
            ? 'cursor-not-allowed border-beige-dark bg-beige/40'
            : over
              ? 'cursor-copy border-gold-deep bg-gold-mist/60'
              : error
                ? 'cursor-pointer border-rust/50 bg-rust-mist/30'
                : 'cursor-pointer border-gold/50 bg-white/60 hover:border-gold-deep hover:bg-gold-mist/30'
        }`}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files?.length) onFiles?.(e.target.files);
            e.target.value = '';
          }}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl peer-focus-visible:ring-2 peer-focus-visible:ring-gold-deep peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream"
        />
        <span
          className={`grid h-14 w-14 place-items-center rounded-full transition-transform duration-300 ${
            over ? 'scale-110 bg-espresso text-gold-light' : 'bg-gold-mist text-gold-deep group-hover:-translate-y-0.5'
          }`}
        >
          <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="mt-4 text-[15px] font-medium text-ink">
          {title ?? x.dropTitle ?? 'Faylı buraya atın və ya seçin'}
        </span>
        <span className="mt-1 text-[13px] text-brown-dark/85">
          <span className="font-semibold text-gold-deep underline decoration-gold/50 underline-offset-[3px]">
            {x.dropBrowse ?? 'Kompüterdən seç'}
          </span>
        </span>
        {hint && (
          <span id={`${id}-hint`} className="mt-3 text-[12px] text-brown-dark/80">
            {hint}
          </span>
        )}
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 flex items-start gap-1.5 text-[13px] text-rust">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * «Bizim Hekayəmiz» fəsli: başlıq, tarix, mətn, şəkillər (max 6).
 * @param {object} p
 * @param {string} p.id
 * @param {number} p.index                 0-dan («Fəsil 01» kimi göstərilir)
 * @param {string} p.title  @param {(v:string)=>void} p.onTitleChange
 * @param {string} p.date   @param {(v:string)=>void} p.onDateChange   Sərbəst mətn: «Yay 2019»
 * @param {string} p.text   @param {(v:string)=>void} p.onTextChange
 * @param {{id:string, src:string, alt?:string}[]} [p.photos]
 * @param {number} [p.maxPhotos=6]
 * @param {(files:FileList)=>void} p.onAddPhotos
 * @param {(photoId:string)=>void} p.onRemovePhoto
 * @param {boolean} [p.uploading]          Yeni şəkil yüklənir — boş qutuda spinner
 * @param {()=>void} p.onRemove            Fəsli sil
 * @param {object} [p.dragHandleProps]
 * @param {{title?:string, text?:string}} [p.errors]
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function LoveStoryChapter({
  id,
  index = 0,
  title,
  onTitleChange,
  date,
  onDateChange,
  text,
  onTextChange,
  photos = [],
  maxPhotos = 6,
  onAddPhotos,
  onRemovePhoto,
  uploading,
  onRemove,
  dragHandleProps,
  errors = {},
  lang = 'az',
}) {
  const x = tx(lang);
  const canAdd = photos.length < maxPhotos;
  const fileId = useId();
  return (
    <article className="relative rounded-3xl bg-cream p-4 ring-1 ring-inset ring-gold/25 sm:p-6">
      <header className="flex items-center gap-2">
        {dragHandleProps && (
          <button
            type="button"
            {...dragHandleProps}
            aria-label={x.storyReorder ?? 'Fəslin sırasını dəyiş'}
            className="-ml-1 grid h-11 w-9 cursor-grab touch-none place-items-center rounded-[12px] text-brown-muted hover:bg-white hover:text-gold-deep"
          >
            <GripVertical className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        )}
        <p className="flex-1 font-serif text-[20px] italic leading-none text-gold-deep">
          {x.storyChapter ?? 'Fəsil'} <span className="lining-nums">{String(index + 1).padStart(2, '0')}</span>
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${x.storyRemove ?? 'Fəsli sil'} ${index + 1}`}
          className="grid h-11 w-11 place-items-center rounded-[12px] text-brown-muted transition-colors hover:bg-rust-mist hover:text-rust"
        >
          <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
        </button>
      </header>

      <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,1fr)_200px]">
        <Field id={`${id}-title`} label={x.storyTitle ?? 'Başlıq'} error={errors.title} lang={lang}>
          <TextInput
            id={`${id}-title`}
            value={title}
            onChange={onTitleChange}
            error={errors.title}
            placeholder={x.storyTitlePh ?? 'Məs. İlk görüş'}
            maxLength={60}
          />
        </Field>
        <Field id={`${id}-date`} label={x.storyDate ?? 'Tarix'} optional lang={lang}>
          <TextInput
            id={`${id}-date`}
            value={date}
            onChange={onDateChange}
            placeholder={x.storyDatePh ?? 'Məs. Yay 2019'}
            maxLength={30}
          />
        </Field>
      </div>
      <Field id={`${id}-text`} label={x.storyText ?? 'Hekayə'} error={errors.text} className="mt-5" lang={lang}>
        <Textarea
          id={`${id}-text`}
          value={text}
          onChange={onTextChange}
          error={errors.text}
          rows={3}
          maxLength={400}
          placeholder={x.storyTextPh ?? 'Bu anı qonaqlarınıza bir neçə cümlə ilə danışın…'}
        />
      </Field>

      {/* şəkillər */}
      <div className="mt-5">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-label text-brown-dark">
            {x.storyPhotos ?? 'Şəkillər'}
          </p>
          <p className="text-[12px] lining-nums tabular-nums text-brown-dark/80">
            {photos.length} / {maxPhotos}
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {photos.map((ph, i) => (
            <li
              key={ph.id}
              className="group relative aspect-square overflow-hidden rounded-[12px] bg-beige ring-1 ring-inset ring-black/5"
            >
              {ph.src ? (
                <img src={ph.src} alt={ph.alt ?? ''} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <span className="block h-full w-full bg-gradient-to-br from-gold-mist to-beige" aria-hidden="true" />
              )}
              <button
                type="button"
                onClick={() => onRemovePhoto?.(ph.id)}
                aria-label={`${x.storyRemovePhoto ?? 'Şəkli sil'} ${i + 1}`}
                className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full bg-espresso/80 text-cream backdrop-blur transition-opacity hover:bg-espresso sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
          {uploading && (
            <li className="grid aspect-square place-items-center rounded-[12px] bg-white ring-1 ring-inset ring-gold/30">
              <Spinner size="sm" lang={lang} />
            </li>
          )}
          {canAdd && !uploading && (
            <li className="aspect-square">
              <label
                htmlFor={fileId}
                className="group relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-[12px] border-[1.5px] border-dashed border-gold/50 bg-white/70 text-gold-deep transition-colors hover:border-gold-deep hover:bg-gold-mist/40"
              >
                <input
                  id={fileId}
                  type="file"
                  accept="image/*"
                  multiple
                  className="peer sr-only"
                  onChange={(e) => {
                    if (e.target.files?.length) onAddPhotos?.(e.target.files);
                    e.target.value = '';
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[12px] peer-focus-visible:ring-2 peer-focus-visible:ring-gold-deep peer-focus-visible:ring-offset-2"
                />
                <ImagePlus className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em]">
                  {x.storyAddPhoto ?? 'Şəkil'}
                </span>
              </label>
            </li>
          )}
        </ul>
      </div>
    </article>
  );
}
