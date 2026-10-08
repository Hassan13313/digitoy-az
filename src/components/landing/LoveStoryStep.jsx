import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { GripVertical, Trash2, ImagePlus, X, Loader2 } from 'lucide-react'
import { resizeToBlob, resizeErrorText } from '../../utils/imageResize'
import { uploadStoryPhoto, storyPhotoSrc } from '../../utils/api'
import t from '../../data/translations'
import { AddButton } from '../builder/fields'

/* ─────────────────────────────────────────────────────────────────────────────
   «BİZİM HEKAYƏMİZ» addımı — builder redaktoru (Phase 43 → 44)

   `ProgramStepEditor` ilə eyni naxış: framer-motion `Reorder` ilə sürükləyib
   sıralama, stabil `id`-lər, boş bloklara icazə (qonağa göstərilmir).

   ⚠ Phase 44 — ŞƏKİLLƏR FAYL KİMİ: şəkil seçilən kimi kiçildilib serverə
   yüklənir (story_upload.php); blokda yalnız qısa yol saxlanılır
   (`photos: ['/uploads/_story/…jpg']`). Əvvəl data URI idi və çoxlu şəkil
   sessionStorage kvotasını, 800 ms-lik autosave-i və qonağın açılışını
   ağırlaşdırırdı. Dəvətnamədə fəsil maketi şəkil sayına görə qurulur
   (bax templates/_shared/loveStoryTheme.js › chapterLayout).
   ⚠ Köhnə blokların tək `photo` sahəsi ilk dəyişiklikdə `photos`-a keçir.
   ───────────────────────────────────────────────────────────────────────── */

const MAX_BLOCKS           = 12
const MAX_PHOTOS_PER_BLOCK = 6
const MAX_TOTAL_PHOTOS     = 40

let _seq = 0
const genId = () => `ls_${Date.now().toString(36)}_${(_seq++).toString(36)}`

const ICONS = ['💛', '☕', '🌸', '💍', '✈️', '🏡', '🎁', '💌', '🎂', '💒']

const UI = {
  az: {
    blocks: 'blok', photos: 'şəkil',
    limitBlocks: 'Maksimum ' + MAX_BLOCKS + ' blok əlavə edə bilərsiniz.',
    limitBlock: 'Bir bloka ən çox ' + MAX_PHOTOS_PER_BLOCK + ' şəkil əlavə olunur.',
    limitTotal: 'Hekayəyə cəmi ' + MAX_TOTAL_PHOTOS + ' şəkil əlavə olunur.',
    remove: 'Bloku sil', removePhoto: 'Şəkli sil', icon: 'Stiker seç', iconNone: 'Stikeri sil',
    addPhotos: 'Şəkil əlavə et', uploading: 'Yüklənir…',
    caption: 'Şəkil altı yazı', captionPh: 'məs: ilk baxış (könüllü)',
    empty: 'Hələ hekayə bloku yoxdur. «Yeni hekayə bloku» ilə başlayın — tanışlığınızdan bu günə qədər.',
    hint: 'Hər bloka ' + MAX_PHOTOS_PER_BLOCK + '-ya qədər şəkil qoya bilərsiniz — dəvətnamədə görünüş şəkil sayına görə qurulur. Blokları sürükləyərək sıralayın; boş bloklar görünmür.',
  },
  en: {
    blocks: 'blocks', photos: 'photos',
    limitBlocks: 'You can add up to ' + MAX_BLOCKS + ' blocks.',
    limitBlock: 'A block holds up to ' + MAX_PHOTOS_PER_BLOCK + ' photos.',
    limitTotal: 'The story holds up to ' + MAX_TOTAL_PHOTOS + ' photos in total.',
    remove: 'Remove block', removePhoto: 'Remove photo', icon: 'Choose a sticker', iconNone: 'Remove sticker',
    addPhotos: 'Add photos', uploading: 'Uploading…',
    caption: 'Photo caption', captionPh: 'e.g. first glance (optional)',
    empty: 'No story blocks yet. Start with “Add story block” — from how you met until today.',
    hint: 'Add up to ' + MAX_PHOTOS_PER_BLOCK + ' photos per block — the invitation lays them out by count. Drag blocks to reorder; empty blocks are never shown.',
  },
  ru: {
    blocks: 'блоков', photos: 'фото',
    limitBlocks: 'Можно добавить не более ' + MAX_BLOCKS + ' блоков.',
    limitBlock: 'В один блок — не более ' + MAX_PHOTOS_PER_BLOCK + ' фото.',
    limitTotal: 'Во всей истории — не более ' + MAX_TOTAL_PHOTOS + ' фото.',
    remove: 'Удалить блок', removePhoto: 'Удалить фото', icon: 'Выбрать стикер', iconNone: 'Убрать стикер',
    addPhotos: 'Добавить фото', uploading: 'Загрузка…',
    caption: 'Подпись к фото', captionPh: 'напр. первый взгляд (необязательно)',
    empty: 'Блоков ещё нет. Начните с «Добавить блок» — от знакомства до сегодняшнего дня.',
    hint: 'В каждый блок можно добавить до ' + MAX_PHOTOS_PER_BLOCK + ' фото — макет в приглашении строится по их количеству. Перетаскивайте блоки для сортировки; пустые блоки не показываются.',
  },
}

/** Blokun şəkilləri — yeni `photos[]` və Phase 43-ün tək `photo` sahəsi */
function photosOf(row) {
  if (Array.isArray(row?.photos)) return row.photos.filter(s => typeof s === 'string' && s)
  return row?.photo ? [row.photo] : []
}

/** Şəkil siyahısını yaz, köhnə sahələri at */
function withPhotos(row, photos) {
  const next = { ...row, photos }
  delete next.photo
  delete next.photoBytes
  return next
}

/* ── Stiker seçici ──
   ⚠ Əvvəl panel 44px-lik düymənin içinə sıxılırdı (absolute + auto en
   = valideynin eni) — stikerlər bir-birinin üstünə düşür, fon inputlarla
   eyni rəngdə olduğu üçün panel görünmürdü. İndi eni sabitdir, ağ fon,
   çərçivə və kölgə var. */
function IconPicker({ value, onSelect, label, noneLabel, onOpenChange }) {
  const [open, setOpenState] = useState(false)
  const setOpen = useCallback((v) => { setOpenState(v); onOpenChange?.(v) }, [onOpenChange])

  /* Escape — fokus düymədə qalsa da işləsin */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={label}
        aria-expanded={open}
        title={label}
        className="grid h-12 w-12 place-items-center rounded-[12px] bg-gold-mist/60 text-[22px] leading-none ring-1 ring-inset ring-gold/30 transition-colors hover:bg-gold-mist touch-manipulation"
      >
        {value || <span className="text-base text-gold-deep">+</span>}
      </button>
      {open && (
        <>
          {/* Xaricə toxunuş bağlayır — mobil üçün vacibdir */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-label={label}
            className="absolute left-0 top-[56px] z-50 grid w-[244px] grid-cols-5 gap-1.5 rounded-2xl bg-white p-2.5 shadow-luxe ring-1 ring-gold/25"
          >
            {ICONS.map(ic => (
              <button
                key={ic} type="button"
                onClick={() => { onSelect(ic); setOpen(false) }}
                aria-pressed={value === ic}
                className={`grid h-10 w-10 place-items-center rounded-[10px] text-[22px] leading-none transition-colors touch-manipulation ${
                  value === ic ? 'bg-gold-mist ring-1 ring-inset ring-gold' : 'hover:bg-cream'}`}
              >
                {ic}
              </button>
            ))}
            {value && (
              <button
                type="button"
                onClick={() => { onSelect(''); setOpen(false) }}
                className="col-span-5 mt-1 flex h-10 items-center justify-center gap-1.5 rounded-[10px] text-[12.5px] font-medium text-rust hover:bg-rust-mist touch-manipulation"
              >
                <X size={12} strokeWidth={2} /> {noneLabel}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* ── Tək blok ── */
function StoryBlock({ row, update, removeRow, tr, ui, onFiles, pending, canAddPhotos }) {
  const controls = useDragControls()
  const fileRef = useRef(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const photos = photosOf(row)

  return (
    <Reorder.Item
      value={row}
      dragListener={false}
      dragControls={controls}
      as="div"
      className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-inset ring-gold/20 sm:p-5"
      /* Stiker paneli açıq olanda blok qonşularının ÜSTÜNDƏ qalmalıdır */
      style={{ position: 'relative', zIndex: pickerOpen ? 30 : undefined }}
      whileDrag={{ scale: 1.012, boxShadow: '0 10px 28px rgba(0,0,0,0.14)', zIndex: 5 }}
    >
      {/* Üst sətir: stiker + tarix + (sağda) sil/tutacaq */}
      <div className="mb-3 flex items-center gap-2">
        <IconPicker
          value={row.icon}
          onSelect={(ic) => update(row.id, 'icon', ic)}
          label={ui.icon}
          noneLabel={ui.iconNone}
          onOpenChange={setPickerOpen}
        />
        <input
          type="text"
          value={row.date || ''}
          onChange={(e) => update(row.id, 'date', e.target.value)}
          placeholder={tr.lovestory_date_placeholder}
          aria-label={tr.lovestory_date_label}
          className="h-12 rounded-[12px] bg-cream px-3.5 text-[16px] text-ink ring-1 ring-inset ring-beige-dark placeholder:text-brown-muted/80 focus:outline-none focus:ring-2 focus:ring-gold-deep min-w-0 flex-1"
        />
        <button
          type="button"
          onClick={() => removeRow(row.id)}
          aria-label={ui.remove}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-brown-muted transition-colors hover:bg-rust-mist hover:text-rust touch-manipulation"
        >
          <Trash2 size={15} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          aria-label="Sırala"
          className="grid h-11 w-11 shrink-0 cursor-grab place-items-center rounded-full text-brown-muted transition-colors hover:bg-gold-mist/60 hover:text-gold-deep active:cursor-grabbing touch-manipulation"
          style={{ touchAction: 'none' }}
        >
          <GripVertical size={16} strokeWidth={1.5} />
        </button>
      </div>

      <input
        type="text"
        value={row.title || ''}
        onChange={(e) => update(row.id, 'title', e.target.value)}
        placeholder={tr.lovestory_title_placeholder}
        aria-label={tr.lovestory_title_label}
        className="h-12 rounded-[12px] bg-cream px-3.5 text-[16px] text-ink ring-1 ring-inset ring-beige-dark placeholder:text-brown-muted/80 focus:outline-none focus:ring-2 focus:ring-gold-deep mb-3 w-full"
      />

      <textarea
        value={row.text || ''}
        onChange={(e) => update(row.id, 'text', e.target.value)}
        placeholder={tr.lovestory_text_placeholder}
        aria-label={tr.lovestory_text_label}
        rows={3}
        className="w-full resize-y rounded-[12px] bg-cream px-3.5 py-3 text-[16px] leading-relaxed text-ink ring-1 ring-inset ring-beige-dark placeholder:text-brown-muted/80 focus:outline-none focus:ring-2 focus:ring-gold-deep"
      />

      {/* Şəkillər */}
      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        className="hidden"
        onChange={(e) => { onFiles(row.id, e.target.files); e.target.value = '' }}
      />
      <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
        {photos.map((src, j) => (
          <div key={src + j} className="relative aspect-square">
            <img
              src={storyPhotoSrc(src) || undefined}
              alt=""
              className="h-full w-full rounded-[12px] bg-beige object-cover ring-1 ring-inset ring-beige-dark"
            />
            <button
              type="button"
              onClick={() => update(row.id, 'photos', photos.filter((_, k) => k !== j))}
              aria-label={ui.removePhoto}
              className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-brown-dark shadow-soft ring-1 ring-beige-dark transition-colors hover:text-rust touch-manipulation"
            >
              <X size={12} strokeWidth={2.2} />
            </button>
          </div>
        ))}
        {Array.from({ length: pending }).map((_, k) => (
          <div key={'p' + k} className="flex aspect-square items-center justify-center rounded-[12px] border border-dashed border-gold/50 bg-gold-mist/30 text-gold-deep" aria-label={ui.uploading}>
            <Loader2 size={16} strokeWidth={1.6} className="animate-spin" />
          </div>
        ))}
        {canAddPhotos && photos.length + pending < MAX_PHOTOS_PER_BLOCK && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[12px] border border-dashed border-gold/50 bg-white/60 text-gold-deep transition-colors hover:border-gold-deep hover:bg-gold-mist/40 touch-manipulation"
          >
            <ImagePlus size={16} strokeWidth={1.5} />
            <span className="px-1 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.08em]">{ui.addPhotos}</span>
          </button>
        )}
      </div>

      {photos.length > 0 && (
        <input
          type="text"
          value={row.caption || ''}
          maxLength={60}
          onChange={(e) => update(row.id, 'caption', e.target.value)}
          placeholder={ui.captionPh}
          aria-label={ui.caption}
          className="h-12 rounded-[12px] bg-cream px-3.5 text-[16px] text-ink ring-1 ring-inset ring-beige-dark placeholder:text-brown-muted/80 focus:outline-none focus:ring-2 focus:ring-gold-deep mt-3 w-full"
        />
      )}
    </Reorder.Item>
  )
}

export default function LoveStoryStep({ rows = [], onChange, lang = 'az' }) {
  const tr = t[lang] || t.az
  const ui = UI[lang] || UI.az
  const [pending, setPending] = useState({})   /* blok id → yüklənən şəkil sayı */
  const [error,   setError]   = useState('')

  /* ⚠ `id` yoxdursa Reorder elementləri qarışdırır. Yeni bloklar onsuz da
     id ilə yaranır; bu yalnız KÖHNƏ saxlanmış data üçün qoruyucudur. */
  const normalized = rows.map(r => (r && r.id ? r : { ...(r || {}), id: genId() }))

  /* Asinxron yükləmə bitəndə ƏN SON sətirlər lazımdır — istifadəçi həmin
     vaxt mətn yaza bilər, köhnə closure onun yazdığını silərdi. */
  const latest = useRef(normalized)
  useLayoutEffect(() => { latest.current = normalized })

  const commit = useCallback((next) => onChange(next), [onChange])

  const update = useCallback((id, field, val) => {
    commit(latest.current.map(r => {
      if (r.id !== id) return r
      return field === 'photos' ? withPhotos(r, val) : { ...r, [field]: val }
    }))
  }, [commit])

  const addRow = () => {
    if (normalized.length >= MAX_BLOCKS) return
    commit([...normalized, { id: genId(), date: '', icon: '', title: '', text: '', caption: '', photos: [] }])
  }

  const removeRow = (id) => commit(normalized.filter(r => r.id !== id))

  const totalPhotos  = normalized.reduce((s, r) => s + photosOf(r).length, 0)
  const totalPending = Object.values(pending).reduce((s, n) => s + n, 0)

  const handleFiles = useCallback(async (id, fileList) => {
    const files = Array.from(fileList || [])
    const row = latest.current.find(r => r.id === id)
    if (!files.length || !row) return
    setError('')

    const blockRoom = MAX_PHOTOS_PER_BLOCK - photosOf(row).length - (pending[id] || 0)
    const totalRoom = MAX_TOTAL_PHOTOS - totalPhotos - totalPending
    const take = files.slice(0, Math.max(0, Math.min(blockRoom, totalRoom)))
    if (take.length < files.length) setError(blockRoom <= totalRoom ? ui.limitBlock : ui.limitTotal)
    if (!take.length) return

    setPending(p => ({ ...p, [id]: (p[id] || 0) + take.length }))
    /* Ardıcıl: sıra seçim sırası ilə qalır, telefon yaddaşı da dolmur */
    for (const file of take) {
      try {
        const { blob } = await resizeToBlob(file, 'storyUpload')
        const { url } = await uploadStoryPhoto(blob)
        const cur = latest.current.find(r => r.id === id)
        if (cur && !photosOf(cur).includes(url)) {
          commit(latest.current.map(r => (r.id === id ? withPhotos(r, [...photosOf(r), url]) : r)))
        }
      } catch (err) {
        setError(err?.code && !['NOT_IMAGE', 'TOO_LARGE', 'DECODE_FAILED', 'STILL_TOO_LARGE', 'NO_FILE'].includes(err.code)
          ? err.message : resizeErrorText(err))
      } finally {
        setPending(p => ({ ...p, [id]: Math.max(0, (p[id] || 1) - 1) }))
      }
    }
  }, [pending, totalPhotos, totalPending, ui, commit])

  const atLimit = normalized.length >= MAX_BLOCKS
  const canAddPhotos = totalPhotos + totalPending < MAX_TOTAL_PHOTOS

  return (
    <div className="space-y-4">
      {/* Vəziyyət sətri */}
      <span className="block text-[12px] font-semibold uppercase tracking-label tabular-nums text-brown-dark/80">
        {normalized.length} / {MAX_BLOCKS} {ui.blocks}
        <span className={canAddPhotos ? 'text-brown-dark/60' : 'text-rust'}>
          {' · '}{totalPhotos} / {MAX_TOTAL_PHOTOS} {ui.photos}
        </span>
      </span>

      {error && (
        <p role="alert" className="rounded-2xl bg-rust-mist px-4 py-3 text-[13.5px] leading-relaxed text-rust">
          {error}
        </p>
      )}

      {normalized.length === 0 && (
        <p className="rounded-2xl border border-dashed border-gold/40 bg-white/50 px-4 py-6 text-center text-[14px] leading-relaxed text-brown-dark/80">
          {ui.empty}
        </p>
      )}

      <Reorder.Group axis="y" values={normalized} onReorder={commit} as="div" className="space-y-3">
        {normalized.map(row => (
          <StoryBlock
            key={row.id}
            row={row}
            update={update}
            removeRow={removeRow}
            tr={tr}
            ui={ui}
            onFiles={handleFiles}
            pending={pending[row.id] || 0}
            canAddPhotos={canAddPhotos}
          />
        ))}
      </Reorder.Group>

      <AddButton onClick={addRow} disabled={atLimit}>
        {String(tr.lovestory_add_row || '').replace(/^\+\s*/, '')}
      </AddButton>

      <p className="text-[13px] leading-relaxed text-brown-dark/85">
        {atLimit ? ui.limitBlocks : ui.hint}
      </p>
    </div>
  )
}
