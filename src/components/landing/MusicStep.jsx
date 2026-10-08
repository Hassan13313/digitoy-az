/* ══════════════════════════════════════════════════
   Phase 25.3 — 🎵 Musiqi addımı (Builder Step 5)

   • Hazır musiqilər — LOKAL MP3 preset kartları (public/music/)
   • Öz MP3 faylı — drag & drop / fayl seç (maks 20 MB)
   • Audio preview — play/pause/progress/vaxt (HTML5 Audio, YouTube YOXDUR)
   • Başlanğıc nöqtəsi — "Bu hissədən başlat" + manual d:ss
   • Başlama rejimi — açılan kimi / düymə ilə (default)

   Provider arxitekturası genişlənə biləndir — bax: src/data/music.js
══════════════════════════════════════════════════ */
import { useState, useRef, useCallback } from 'react'
import { Music, Play, Pause, Upload, X, ChevronRight } from 'lucide-react'
import {
  PRESET_TRACKS, MUSIC_PROVIDERS, MUSIC_PLAY_MODES, DEFAULT_PLAY_MODE,
  MP3_MAX_BYTES, buildPresetMusic, buildMp3Music, formatSeconds, parseTimeInput,
} from '../../data/music'
import { uploadMusic } from '../../utils/api'
import { MusicTrackRow } from '../builder/media'
import { OptionCard } from '../builder/choices'

const MUSIC_UI = {
  az: {
    sourcePreset: 'Hazır Musiqilər',
    sourcePresetSub: 'Toylar üçün seçilmiş melodiyalar',
    sourceMp3: 'Öz MP3 Faylını Yüklə',
    sourceMp3Sub: 'Yalnız MP3 · maksimum 20 MB',
    listen: 'Dinlə',
    select: 'Seç',
    selected: 'Seçildi',
    dropTitle: 'MP3 faylını bura sürüşdürün',
    dropOr: 'və ya',
    chooseFile: 'Fayl Seç',
    uploading: 'Yüklənir…',
    errType: 'Yalnız MP3 faylı qəbul olunur.',
    errSize: 'Fayl 20 MB-dan böyük ola bilməz.',
    errUpload: 'Musiqi yüklənmədi. İnterneti yoxlayıb yenidən cəhd edin.',
    localNote: 'Bu fayl serverə yüklənməyib və dəvətnamədə səslənməyəcək. Faylı silib yenidən seçin.',
    playerTitle: 'Audio Önizləmə',
    startTitle: 'Başlanğıc Nöqtəsi',
    startHint: 'Musiqini istədiyiniz hissəyə çəkin və düyməyə basın — dəvətnamə həmin saniyədən başlayacaq.',
    setStart: 'Bu hissədən başlat',
    startAt: 'Başlanğıc',
    manualLabel: 'Manual (dəq:san)',
    modeTitle: 'Musiqinin Başlama Rejimi',
    modeAuto: 'Dəvətnamə açılan kimi',
    modeAutoSub: 'Bəzi brauzerlər avtomatik səsə icazə vermir',
    modeButton: 'Musiqi düyməsinə basıldıqdan sonra',
    modeButtonSub: 'Tövsiyə olunur — bütün cihazlarda etibarlı işləyir',
    recommended: 'Tövsiyə',
    remove: 'Musiqini sil — standart melodiya istifadə olunsun',
    yourFile: 'Sizin faylınız',
  },
  en: {
    sourcePreset: 'Preset Music',
    sourcePresetSub: 'Curated melodies for weddings',
    sourceMp3: 'Upload Your MP3',
    sourceMp3Sub: 'MP3 only · max 20 MB',
    listen: 'Listen',
    select: 'Select',
    selected: 'Selected',
    dropTitle: 'Drag & drop your MP3 here',
    dropOr: 'or',
    chooseFile: 'Choose File',
    uploading: 'Uploading…',
    errType: 'Only MP3 files are accepted.',
    errSize: 'File cannot exceed 20 MB.',
    errUpload: 'Music could not be uploaded. Check your connection and try again.',
    localNote: 'This file was not uploaded and will not play in the invitation. Remove it and choose it again.',
    playerTitle: 'Audio Preview',
    startTitle: 'Start Point',
    startHint: 'Seek to the part you like and press the button — the invitation will start from that second.',
    setStart: 'Start from here',
    startAt: 'Start',
    manualLabel: 'Manual (min:sec)',
    modeTitle: 'Music Start Mode',
    modeAuto: 'As soon as the invitation opens',
    modeAutoSub: 'Some browsers block automatic audio',
    modeButton: 'After pressing the music button',
    modeButtonSub: 'Recommended — works reliably on all devices',
    recommended: 'Recommended',
    remove: 'Remove music — use the default melody',
    yourFile: 'Your file',
  },
  ru: {
    sourcePreset: 'Готовая музыка',
    sourcePresetSub: 'Подобранные мелодии для торжеств',
    sourceMp3: 'Загрузить свой MP3',
    sourceMp3Sub: 'Только MP3 · максимум 20 МБ',
    listen: 'Слушать',
    select: 'Выбрать',
    selected: 'Выбрано',
    dropTitle: 'Перетащите MP3 файл сюда',
    dropOr: 'или',
    chooseFile: 'Выбрать файл',
    uploading: 'Загрузка…',
    errType: 'Принимаются только MP3 файлы.',
    errSize: 'Файл не может превышать 20 МБ.',
    errUpload: 'Не удалось загрузить музыку. Проверьте соединение и попробуйте снова.',
    localNote: 'Этот файл не загружен и не будет звучать в приглашении. Удалите его и выберите снова.',
    playerTitle: 'Предпрослушивание',
    startTitle: 'Точка начала',
    startHint: 'Перемотайте на нужный фрагмент и нажмите кнопку — приглашение начнётся с этой секунды.',
    setStart: 'Начать с этого места',
    startAt: 'Начало',
    manualLabel: 'Вручную (мин:сек)',
    modeTitle: 'Режим запуска музыки',
    modeAuto: 'Сразу при открытии приглашения',
    modeAutoSub: 'Некоторые браузеры блокируют автозвук',
    modeButton: 'После нажатия кнопки музыки',
    modeButtonSub: 'Рекомендуется — надёжно работает на всех устройствах',
    recommended: 'Рекомендуется',
    remove: 'Убрать музыку — использовать стандартную мелодию',
    yourFile: 'Ваш файл',
  },
}

/* ══ Preview player — bütün provider-lər üçün HTML5 Audio (lokal MP3) ══ */
function PreviewPlayer({ file, startTime, onSetStartTime, ui, autoPlay = false }) {
  const [playing,  setPlaying]  = useState(false)
  const [current,  setCurrent]  = useState(0)
  const [duration, setDuration] = useState(0)
  const [manual,   setManual]   = useState('')
  const audioRef = useRef(null)

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) a.play().catch(() => {})
    else a.pause()
  }, [])

  const seek = useCallback((sec) => {
    const s = Math.max(0, Math.min(sec, duration || sec))
    setCurrent(s)
    if (audioRef.current) audioRef.current.currentTime = s
  }, [duration])

  const handleBarClick = (e) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    seek(((e.clientX - rect.left) / rect.width) * duration)
  }

  const applyManual = () => {
    const sec = parseTimeInput(manual)
    if (sec === null) return
    onSetStartTime(Math.min(sec, duration ? Math.floor(duration) : sec))
    setManual('')
    if (duration) seek(Math.min(sec, duration))
  }

  const pct = duration ? Math.min(100, (current / duration) * 100) : 0
  const startPct = duration ? Math.min(100, (startTime / duration) * 100) : 0

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-gold/25">
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55) 40%, rgba(197,160,89,0.7) 50%, rgba(197,160,89,0.55) 60%, transparent)' }} />

      {/* Gizli audio elementi */}
      <audio
        ref={audioRef}
        src={file}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration(e.target.duration || 0)
          if (autoPlay) e.target.play().catch(() => {})
        }}
        onTimeUpdate={(e) => setCurrent(e.target.currentTime || 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setCurrent(0) }}
      />

      <div className="px-5 sm:px-6 py-5">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-label text-gold-deep">{ui.playerTitle}</p>

        {/* Player row */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Play'}
            className="grid h-12 w-12 min-w-[48px] place-items-center rounded-full bg-espresso text-gold-light shadow-lift ring-1 ring-inset ring-gold/30 transition-transform active:scale-95 touch-manipulation"
          >
            {playing ? <Pause size={16} strokeWidth={2} /> : <Play size={16} strokeWidth={2} className="ml-0.5" />}
          </button>

          <div className="flex-1 min-w-0">
            {/* Progress bar — klik ilə seek */}
            <div
              onClick={handleBarClick}
              className="relative h-8 flex items-center cursor-pointer touch-manipulation"
              role="slider"
              aria-label="Progress"
              aria-valuemin={0}
              aria-valuemax={Math.floor(duration)}
              aria-valuenow={Math.floor(current)}
            >
              <div className="w-full h-[5px] rounded-full bg-beige-dark/40 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(to right, #C5A059, #B8903A)', transition: 'width 0.15s linear' }} />
              </div>
              {/* Başlanğıc nöqtəsi markeri */}
              {startTime > 0 && duration > 0 && (
                <div className="absolute top-1/2 -translate-y-1/2 w-[2px] h-4 bg-gold-dark/70 rounded-full pointer-events-none" style={{ left: `${startPct}%` }} />
              )}
              {/* Thumb */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-gold shadow pointer-events-none" style={{ left: `${pct}%` }} />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[12px] tabular-nums text-brown-dark/85">{formatSeconds(current)}</span>
              <span className="text-[12px] tabular-nums text-brown-dark/70">{duration ? formatSeconds(duration) : '–:––'}</span>
            </div>
          </div>
        </div>

        {/* Başlanğıc nöqtəsi */}
        <div className="mt-5 border-t border-gold/15 pt-5">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-label text-gold-deep">{ui.startTitle}</p>
          <p className="mb-3.5 text-[13.5px] leading-relaxed text-brown-dark/85">{ui.startHint}</p>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onSetStartTime(Math.floor(current))}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 text-[11.5px] font-semibold uppercase tracking-label text-gold-deep ring-1 ring-inset ring-gold/45 transition-colors hover:bg-gold-mist/60 touch-manipulation"
            >
              <ChevronRight size={12} strokeWidth={2.5} />
              {ui.setStart}
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-mist/70 px-3 py-2 text-[12px] font-medium tabular-nums text-gold-deep">
              {ui.startAt}: {formatSeconds(startTime)}
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                inputMode="numeric"
                value={manual}
                onChange={(e) => setManual(e.target.value.replace(/[^\d:]/g, '').slice(0, 6))}
                onKeyDown={(e) => e.key === 'Enter' && applyManual()}
                placeholder="1:23"
                aria-label={ui.manualLabel}
                className="h-11 w-[80px] rounded-[12px] bg-cream text-center text-[16px] tabular-nums text-ink ring-1 ring-inset ring-beige-dark placeholder:text-brown-muted/70 focus:outline-none focus:ring-2 focus:ring-gold-deep"
              />
              <button
                type="button"
                onClick={applyManual}
                disabled={parseTimeInput(manual) === null}
                className="h-11 rounded-full px-4 text-[11.5px] font-semibold uppercase tracking-label text-brown-dark ring-1 ring-inset ring-beige-dark transition-colors hover:ring-gold disabled:cursor-not-allowed disabled:opacity-40 touch-manipulation"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══ Əsas addım komponenti ══ */
export default function MusicStep({ music, onChange, lang = 'az' }) {
  const ui = MUSIC_UI[lang] || MUSIC_UI.az
  const [source, setSource] = useState(music?.provider === MUSIC_PROVIDERS.MP3 ? 'mp3' : 'preset')
  const [dragOver,  setDragOver]  = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileError, setFileError] = useState('')
  const fileInputRef = useRef(null)

  const playMode  = music?.playMode || DEFAULT_PLAY_MODE
  const startTime = music?.startTime || 0

  const selectPreset = (track) => {
    if (music?.provider === MUSIC_PROVIDERS.PRESET && music?.id === track.id) return
    onChange(buildPresetMusic(track, { playMode }))
  }

  /* "Dinlə" — treki seçmədən player-də dinləmə. Dinləmə zamanı "Bu hissədən
     başlat" basılarsa trek həmin startTime ilə seçilmiş olur. */
  const [previewTrack, setPreviewTrack] = useState(null)
  const listenPreset = (track) => {
    setPreviewTrack(prev => (prev?.id === track.id ? null : track))
  }

  const handleFile = async (file) => {
    setFileError('')
    if (!file) return
    const isMp3 = /audio\/(mpeg|mp3)/.test(file.type) || /\.mp3$/i.test(file.name)
    if (!isMp3)                     { setFileError(ui.errType); return }
    if (file.size > MP3_MAX_BYTES)  { setFileError(ui.errSize); return }

    setUploading(true)
    const name = file.name.replace(/\.mp3$/i, '')
    try {
      const result = await uploadMusic(file)
      onChange(buildMp3Music({ url: result.url, name, playMode }))
    } catch (err) {
      /* ⚠ Phase 44.3: blob URL YALNIZ lokal dev-də. Production-da əvvəl də
         belə edilirdi — müştəri musiqini öz brauzerində eşidirdi, amma
         təsdiqlənmiş dəvətnamədə `blob:` ünvanı heç kimdə açılmırdı. */
      if (import.meta.env.DEV) {
        const blobUrl = URL.createObjectURL(file)
        onChange(buildMp3Music({ url: blobUrl, name, playMode, localOnly: true }))
      } else {
        setFileError(lang === 'az' && err?.message ? err.message : ui.errUpload)
      }
    } finally {
      setUploading(false)
    }
  }

  const setStart = (sec) => music && onChange({ ...music, startTime: sec })
  const setMode  = (mode) => music && onChange({ ...music, playMode: mode })
  const removeMusic = () => { setPreviewTrack(null); onChange(null) }

  /* Aktiv player: seçilmiş musiqi üstünlük daşıyır; preset dinləməsi ayrıca */
  const activePreview = previewTrack
    ? { provider: MUSIC_PROVIDERS.PRESET, file: previewTrack.file, key: `listen-${previewTrack.id}` }
    : music
      ? { provider: music.provider, file: music.file, key: `sel-${music.provider}-${music.id || music.file}` }
      : null

  return (
    <div className="space-y-6">
      {/* ── Mənbə seçimi ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { id: 'preset', icon: Music,  title: ui.sourcePreset, sub: ui.sourcePresetSub },
          { id: 'mp3',    icon: Upload, title: ui.sourceMp3,    sub: ui.sourceMp3Sub },
        ].map(({ id, icon, title, sub }) => (
          <OptionCard
            key={id}
            name="music-source"
            value={id}
            selected={source === id}
            onSelect={() => { setSource(id); setPreviewTrack(null) }}
            icon={icon}
            title={title}
            description={sub}
            lang={lang}
          />
        ))}
      </div>

      {/* ── A) Hazır musiqilər ── */}
      {source === 'preset' && (
        <div className="space-y-2.5">
          {PRESET_TRACKS.map(track => (
            <MusicTrackRow
              key={track.id}
              title={track.title}
              artist={track.artist}
              duration={track.duration ? formatSeconds(track.duration) : undefined}
              tint={track.accent}
              playing={previewTrack?.id === track.id}
              onTogglePlay={() => listenPreset(track)}
              selected={music?.provider === MUSIC_PROVIDERS.PRESET && music?.id === track.id}
              onSelect={() => { setPreviewTrack(null); selectPreset(track) }}
              lang={lang}
            />
          ))}
        </div>
      )}

      {/* ── B) MP3 yükləmə ── */}
      {source === 'mp3' && (
        <div>
          {music?.provider === MUSIC_PROVIDERS.MP3 ? (
            <div className="flex items-center gap-4 rounded-2xl bg-gold-mist/55 p-4 shadow-soft ring-2 ring-espresso">
              <div className="grid h-12 w-12 min-w-[48px] place-items-center rounded-[12px] bg-espresso text-gold-light">
                <Music size={18} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-label text-gold-deep">{ui.yourFile}</p>
                <p className="truncate text-[15px] font-medium text-ink">{music.title}</p>
                {music.localOnly && (
                  <p className="mt-1 text-[12.5px] leading-snug text-rust">{ui.localNote}</p>
                )}
              </div>
              <button
                type="button"
                onClick={removeMusic}
                aria-label="Sil"
                className="grid h-11 w-11 min-w-[44px] place-items-center rounded-full text-brown-muted transition-colors hover:bg-rust-mist hover:text-rust touch-manipulation"
              >
                <X size={15} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]) }}
              className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-[background-color,border-color] duration-200 ${
                dragOver ? 'border-gold-deep bg-gold-mist/60' : 'border-gold/45 bg-white/60 hover:border-gold-deep'
              }`}
            >
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-gold-mist text-gold-deep">
                <Upload size={20} strokeWidth={1.5} />
              </div>
              <p className="mb-1 text-[15px] font-medium text-ink">{ui.dropTitle}</p>
              <p className="mb-4 text-[12px] uppercase tracking-label text-brown-dark/70">{ui.dropOr}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex min-h-[48px] items-center rounded-full bg-espresso px-8 text-[11.5px] font-semibold uppercase tracking-label text-cream shadow-lift ring-1 ring-inset ring-gold/30 transition-colors hover:bg-espresso-soft disabled:opacity-50 touch-manipulation"
              >
                {uploading ? ui.uploading : ui.chooseFile}
              </button>
              <p className="mt-4 text-[12px] tabular-nums text-brown-dark/70">MP3 · ≤ 20 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,audio/mpeg"
                className="hidden"
                onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }}
              />
            </div>
          )}
          {fileError && <p role="alert" className="mt-2.5 text-[13px] font-medium text-rust">{fileError}</p>}
        </div>
      )}

      {/* ── Audio preview + başlanğıc nöqtəsi ── */}
      {activePreview && (
        <PreviewPlayer
          key={activePreview.key}
          file={activePreview.file}
          autoPlay={!!previewTrack}
          startTime={previewTrack ? 0 : startTime}
          onSetStartTime={(sec) => {
            /* Dinlənən trek hələ seçilməyibsə — başlanğıc təyin etmək onu seçir */
            if (previewTrack) {
              onChange(buildPresetMusic(previewTrack, { startTime: sec, playMode }))
              setPreviewTrack(null)
            } else {
              setStart(sec)
            }
          }}
          ui={ui}
        />
      )}

      {/* ── Başlama rejimi ── */}
      {music && (
        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-label text-gold-deep">{ui.modeTitle}</p>
          <div className="space-y-2.5">
            {[
              { id: MUSIC_PLAY_MODES.AUTO,   label: ui.modeAuto,   sub: ui.modeAutoSub,   badge: null },
              { id: MUSIC_PLAY_MODES.BUTTON, label: ui.modeButton, sub: ui.modeButtonSub, badge: ui.recommended },
            ].map(({ id, label, sub, badge }) => (
              <OptionCard
                key={id}
                name="music-mode"
                value={id}
                selected={playMode === id}
                onSelect={() => setMode(id)}
                title={label}
                description={sub}
                badge={badge || undefined}
                lang={lang}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={removeMusic}
            className="mt-4 inline-flex min-h-[44px] items-center text-[13px] font-medium text-rust underline decoration-rust/40 underline-offset-4 transition-colors hover:decoration-rust touch-manipulation"
          >
            {ui.remove}
          </button>
        </div>
      )}
    </div>
  )
}
