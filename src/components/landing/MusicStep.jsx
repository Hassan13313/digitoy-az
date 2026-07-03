/* ══════════════════════════════════════════════════
   Phase 25.3 — 🎵 Musiqi addımı (Builder Step 5)

   • Hazır musiqilər — YouTube əsaslı preset kartları
   • Öz MP3 faylı — drag & drop / fayl seç (maks 20 MB)
   • Audio preview — play/pause/progress/vaxt
   • Başlanğıc nöqtəsi — "Bu hissədən başlat" + manual d:ss
   • Başlama rejimi — açılan kimi / düymə ilə (default)

   Provider arxitekturası genişlənə biləndir — bax: src/data/music.js
══════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useCallback } from 'react'
import { Music, Play, Pause, Upload, Check, X, ChevronRight } from 'lucide-react'
import {
  PRESET_TRACKS, MUSIC_PROVIDERS, MUSIC_PLAY_MODES, DEFAULT_PLAY_MODE,
  MP3_MAX_BYTES, buildPresetMusic, buildMp3Music, formatSeconds, parseTimeInput,
} from '../../data/music'
import { uploadMusic } from '../../utils/api'

/* ── YouTube IFrame API — MusicToggle ilə eyni singleton yanaşma ── */
function loadYTScript() {
  return new Promise(resolve => {
    if (window.YT?.Player) { resolve(); return }
    if (!document.getElementById('yt-iframe-api')) {
      const s = document.createElement('script')
      s.id  = 'yt-iframe-api'
      s.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(s)
    }
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve() }
  })
}

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
    localNote: 'Fayl hazırda yalnız bu brauzerdə önizlənir — sifariş təsdiqində serverə yüklənəcək.',
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
    localNote: 'File is previewed locally — it will be uploaded when the order is approved.',
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
    localNote: 'Файл предпросматривается локально — он будет загружен при подтверждении заказа.',
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

/* ══ Unified preview player — mp3 (HTML5 Audio) və preset (YouTube) ══ */
function PreviewPlayer({ provider, file, startTime, onSetStartTime, ui, autoPlay = false }) {
  const [playing,  setPlaying]  = useState(false)
  const [current,  setCurrent]  = useState(0)
  const [duration, setDuration] = useState(0)
  const [manual,   setManual]   = useState('')
  const audioRef  = useRef(null)
  const ytDivRef  = useRef(null)
  const ytRef     = useRef(null)
  const pollRef   = useRef(null)
  const isMp3 = provider === MUSIC_PROVIDERS.MP3

  /* ── YouTube engine ── */
  useEffect(() => {
    if (isMp3) return
    let cancelled = false
    loadYTScript().then(() => {
      if (cancelled || !ytDivRef.current) return
      ytRef.current = new window.YT.Player(ytDivRef.current, {
        videoId: file,
        playerVars: { autoplay: autoPlay ? 1 : 0, controls: 0, rel: 0, iv_load_policy: 3 },
        events: {
          onReady: (e) => { if (!cancelled) setDuration(e.target.getDuration() || 0) },
          onStateChange: (e) => {
            if (cancelled) return
            const st = window.YT.PlayerState
            setPlaying(e.data === st.PLAYING)
            if (e.data === st.PLAYING) setDuration(e.target.getDuration() || 0)
            if (e.data === st.ENDED) setCurrent(0)
          },
        },
      })
    })
    return () => {
      cancelled = true
      clearInterval(pollRef.current)
      try { ytRef.current?.destroy?.() } catch { /* iframe artıq silinib */ }
      ytRef.current = null
    }
  }, [isMp3, file])

  /* YT mövqe sorğusu — yalnız oxudulan zaman */
  useEffect(() => {
    if (isMp3) return
    clearInterval(pollRef.current)
    if (playing) {
      pollRef.current = setInterval(() => {
        const t = ytRef.current?.getCurrentTime?.()
        if (typeof t === 'number') setCurrent(t)
      }, 300)
    }
    return () => clearInterval(pollRef.current)
  }, [playing, isMp3])

  const toggle = useCallback(() => {
    if (isMp3) {
      const a = audioRef.current
      if (!a) return
      if (a.paused) a.play().catch(() => {})
      else a.pause()
    } else {
      const p = ytRef.current
      if (!p?.getPlayerState) return
      const st = window.YT?.PlayerState
      p.getPlayerState() === st?.PLAYING ? p.pauseVideo() : p.playVideo()
    }
  }, [isMp3])

  const seek = useCallback((sec) => {
    const s = Math.max(0, Math.min(sec, duration || sec))
    setCurrent(s)
    if (isMp3) { if (audioRef.current) audioRef.current.currentTime = s }
    else ytRef.current?.seekTo?.(s, true)
  }, [isMp3, duration])

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
    <div className="border border-gold/25 bg-cream rounded-xl overflow-hidden"
      style={{ boxShadow: '0 6px 24px rgba(197,160,89,0.08)' }}>
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.55) 40%, rgba(197,160,89,0.7) 50%, rgba(197,160,89,0.55) 60%, transparent)' }} />

      {/* Gizli media elementləri */}
      {isMp3
        ? <audio
            ref={audioRef}
            src={file}
            preload="metadata"
            onLoadedMetadata={(e) => setDuration(e.target.duration || 0)}
            onTimeUpdate={(e) => setCurrent(e.target.currentTime || 0)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => { setPlaying(false); setCurrent(0) }}
          />
        : <div style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, pointerEvents: 'none' }}>
            <div ref={ytDivRef} />
          </div>
      }

      <div className="px-5 sm:px-6 py-5">
        <p className="text-[9px] tracking-[0.3em] uppercase text-gold font-semibold mb-4">{ui.playerTitle}</p>

        {/* Player row */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Play'}
            className="w-12 h-12 min-w-[48px] rounded-full flex items-center justify-center bg-gold text-white shadow-[0_4px_18px_rgba(197,160,89,0.35)] hover:opacity-90 active:scale-95 transition-all touch-manipulation"
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
              <span className="font-mono text-[10px] text-brown-muted/70">{formatSeconds(current)}</span>
              <span className="font-mono text-[10px] text-brown-muted/50">{duration ? formatSeconds(duration) : '–:––'}</span>
            </div>
          </div>
        </div>

        {/* Başlanğıc nöqtəsi */}
        <div className="mt-5 pt-5 border-t border-beige-dark/30">
          <p className="text-[9px] tracking-[0.3em] uppercase text-gold font-semibold mb-1.5">{ui.startTitle}</p>
          <p className="text-[11px] text-brown-muted/65 font-light leading-relaxed mb-3.5">{ui.startHint}</p>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onSetStartTime(Math.floor(current))}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] border border-gold/45 bg-gold/[0.06] hover:bg-gold/[0.12] text-gold-dark text-[10px] tracking-[0.18em] uppercase font-semibold rounded-lg transition-colors touch-manipulation"
            >
              <ChevronRight size={12} strokeWidth={2.5} />
              {ui.setStart}
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-gold/[0.08] border border-gold/25 font-mono text-[11px] text-gold-dark">
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
                className="w-[74px] min-h-[44px] text-center font-mono text-xs bg-cream border border-beige-dark/60 rounded-lg focus:outline-none focus:border-gold/60 transition-colors placeholder:text-brown-muted/35"
              />
              <button
                type="button"
                onClick={applyManual}
                disabled={parseTimeInput(manual) === null}
                className="min-h-[44px] px-3.5 border border-beige-dark/60 hover:border-gold/50 text-brown-muted/70 hover:text-gold text-[10px] tracking-[0.14em] uppercase font-medium rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
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

/* ══ Preset kartı ══ */
function PresetCard({ track, isSelected, isPreviewing, onListen, onSelect, ui }) {
  return (
    <div
      className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-250 ${
        isSelected
          ? 'border-gold bg-gold/[0.06] shadow-[0_6px_24px_rgba(197,160,89,0.16)]'
          : 'border-beige-dark/50 bg-cream hover:border-gold/45 hover:shadow-[0_4px_18px_rgba(197,160,89,0.1)] hover:-translate-y-[1px]'
      }`}
    >
      {/* Cover placeholder */}
      <div
        className="w-14 h-14 min-w-[56px] rounded-lg flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${track.accent}26 0%, ${track.accent}0D 60%), linear-gradient(135deg, rgba(197,160,89,0.16), rgba(197,160,89,0.04))`, border: '1px solid rgba(197,160,89,0.3)' }}
      >
        <Music size={20} strokeWidth={1.4} style={{ color: track.accent }} />
        {isPreviewing && (
          <span className="absolute inset-0 rounded-lg animate-pulse" style={{ background: 'rgba(197,160,89,0.14)' }} />
        )}
      </div>

      {/* Ad + ifaçı */}
      <div className="flex-1 min-w-0">
        <p className={`text-[13.5px] font-medium tracking-tight truncate ${isSelected ? 'text-gold-dark' : 'text-ink'}`}>{track.title}</p>
        <p className="text-[11px] text-brown-muted/65 font-light truncate">{track.artist}</p>
        <p className="font-mono text-[9.5px] text-brown-muted/40 mt-0.5">{track.duration ? formatSeconds(track.duration) : ''}</p>
      </div>

      {/* Əməliyyatlar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => onListen(track)}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 min-h-[44px] rounded-lg border text-[9.5px] tracking-[0.16em] uppercase font-semibold transition-colors touch-manipulation ${
            isPreviewing
              ? 'border-gold/60 bg-gold/[0.1] text-gold-dark'
              : 'border-beige-dark/60 text-brown-muted/70 hover:border-gold/50 hover:text-gold'
          }`}
        >
          {isPreviewing ? <Pause size={11} strokeWidth={2} /> : <Play size={11} strokeWidth={2} />}
          {ui.listen}
        </button>
        <button
          type="button"
          onClick={() => onSelect(track)}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 min-h-[44px] rounded-lg text-[9.5px] tracking-[0.16em] uppercase font-semibold transition-all touch-manipulation ${
            isSelected
              ? 'bg-gold text-white shadow-[0_3px_14px_rgba(197,160,89,0.35)]'
              : 'border border-gold/40 text-gold-dark hover:bg-gold/[0.08]'
          }`}
        >
          {isSelected ? <Check size={11} strokeWidth={2.5} /> : null}
          {isSelected ? ui.selected : ui.select}
        </button>
      </div>
    </div>
  )
}

/* ══ Əsas addım komponenti ══ */
export default function MusicStep({ music, onChange, lang = 'az', uploadSlug = '' }) {
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
      const result = await uploadMusic(file, uploadSlug || 'davetname')
      onChange(buildMp3Music({ url: result.url, name, playMode }))
    } catch {
      /* Server əlçatmazdırsa (lokal dev) — blob URL ilə lokal önizləmə */
      const blobUrl = URL.createObjectURL(file)
      onChange(buildMp3Music({ url: blobUrl, name, playMode, localOnly: true }))
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { id: 'preset', icon: Music,  title: ui.sourcePreset, sub: ui.sourcePresetSub },
          { id: 'mp3',    icon: Upload, title: ui.sourceMp3,    sub: ui.sourceMp3Sub },
        ].map(({ id, icon: Icon, title, sub }) => {
          const active = source === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => { setSource(id); setPreviewTrack(null) }}
              className={`flex items-center gap-3.5 p-4 min-h-[64px] rounded-xl border text-left transition-all duration-200 touch-manipulation ${
                active
                  ? 'border-gold bg-gold/[0.05] shadow-[0_4px_20px_rgba(197,160,89,0.14)]'
                  : 'border-beige-dark/55 hover:border-gold/40 hover:bg-gold/[0.02]'
              }`}
            >
              <div className={`w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center border ${active ? 'border-gold/50 bg-gold/[0.1]' : 'border-beige-dark/60 bg-cream'}`}>
                <Icon size={15} strokeWidth={1.5} className={active ? 'text-gold' : 'text-brown-muted/60'} />
              </div>
              <div>
                <p className={`text-[12.5px] font-medium tracking-wide ${active ? 'text-gold-dark' : 'text-ink'}`}>{title}</p>
                <p className="text-[10px] text-brown-muted/60 font-light mt-0.5">{sub}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── A) Hazır musiqilər ── */}
      {source === 'preset' && (
        <div className="space-y-2.5">
          {PRESET_TRACKS.map(track => (
            <PresetCard
              key={track.id}
              track={track}
              isSelected={music?.provider === MUSIC_PROVIDERS.PRESET && music?.id === track.id}
              isPreviewing={previewTrack?.id === track.id}
              onListen={listenPreset}
              onSelect={(t) => { setPreviewTrack(null); selectPreset(t) }}
              ui={ui}
            />
          ))}
        </div>
      )}

      {/* ── B) MP3 yükləmə ── */}
      {source === 'mp3' && (
        <div>
          {music?.provider === MUSIC_PROVIDERS.MP3 ? (
            <div className="flex items-center gap-4 p-4 rounded-xl border border-gold bg-gold/[0.05]">
              <div className="w-12 h-12 min-w-[48px] rounded-lg flex items-center justify-center border border-gold/35"
                style={{ background: 'linear-gradient(135deg, rgba(197,160,89,0.16), rgba(197,160,89,0.05))' }}>
                <Music size={18} strokeWidth={1.4} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] tracking-[0.24em] uppercase text-gold font-semibold mb-0.5">{ui.yourFile}</p>
                <p className="text-[13px] text-ink font-medium truncate">{music.title}</p>
                {music.localOnly && (
                  <p className="text-[10px] text-amber-700/80 font-light mt-1 leading-snug">{ui.localNote}</p>
                )}
              </div>
              <button
                type="button"
                onClick={removeMusic}
                aria-label="Sil"
                className="w-11 h-11 min-w-[44px] flex items-center justify-center rounded-lg text-brown-muted/45 hover:text-red-400 hover:bg-red-50 transition-colors touch-manipulation"
              >
                <X size={15} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]) }}
              className={`flex flex-col items-center justify-center text-center px-6 py-10 rounded-xl border-2 border-dashed transition-all duration-200 ${
                dragOver ? 'border-gold bg-gold/[0.07] scale-[1.005]' : 'border-beige-dark/60 bg-beige/30 hover:border-gold/40'
              }`}
            >
              <div className="w-12 h-12 rounded-full border border-gold/35 bg-gold/[0.07] flex items-center justify-center mb-4">
                <Upload size={17} strokeWidth={1.5} className="text-gold" />
              </div>
              <p className="text-[13px] text-ink font-light mb-1">{ui.dropTitle}</p>
              <p className="text-[10px] tracking-[0.14em] uppercase text-brown-muted/50 mb-4">{ui.dropOr}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-outline-gold min-h-[46px] px-8 text-[10px] tracking-[0.2em] uppercase disabled:opacity-50 touch-manipulation"
              >
                {uploading ? ui.uploading : ui.chooseFile}
              </button>
              <p className="font-mono text-[9.5px] text-brown-muted/45 mt-4">MP3 · ≤ 20 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,audio/mpeg"
                className="hidden"
                onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = '' }}
              />
            </div>
          )}
          {fileError && <p className="mt-2.5 text-[11px] text-red-400/90 font-medium">{fileError}</p>}
        </div>
      )}

      {/* ── Audio preview + başlanğıc nöqtəsi ── */}
      {activePreview && (
        <PreviewPlayer
          key={activePreview.key}
          provider={activePreview.provider}
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
          <p className="text-[9px] tracking-[0.3em] uppercase text-gold font-semibold mb-3">{ui.modeTitle}</p>
          <div className="space-y-2.5">
            {[
              { id: MUSIC_PLAY_MODES.AUTO,   label: ui.modeAuto,   sub: ui.modeAutoSub,   badge: null },
              { id: MUSIC_PLAY_MODES.BUTTON, label: ui.modeButton, sub: ui.modeButtonSub, badge: ui.recommended },
            ].map(({ id, label, sub, badge }) => {
              const active = playMode === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMode(id)}
                  className={`w-full flex items-start gap-3.5 p-4 min-h-[56px] rounded-xl border text-left transition-all duration-200 touch-manipulation ${
                    active
                      ? 'border-gold bg-gold/[0.05] shadow-[0_4px_18px_rgba(197,160,89,0.12)]'
                      : 'border-beige-dark/55 hover:border-gold/40'
                  }`}
                >
                  <span className={`mt-0.5 w-[18px] h-[18px] min-w-[18px] rounded-full border-2 flex items-center justify-center transition-colors ${active ? 'border-gold' : 'border-beige-dark'}`}>
                    {active && <span className="w-2 h-2 rounded-full bg-gold" />}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[12.5px] font-medium ${active ? 'text-gold-dark' : 'text-ink'}`}>{label}</span>
                      {badge && (
                        <span className="text-[8.5px] tracking-[0.16em] uppercase font-bold text-gold-dark bg-gold/[0.12] border border-gold/40 rounded-full px-2.5 py-0.5">{badge}</span>
                      )}
                    </span>
                    <span className="block text-[10.5px] text-brown-muted/60 font-light mt-0.5">{sub}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={removeMusic}
            className="mt-4 text-[10px] tracking-[0.14em] uppercase text-brown-muted/50 hover:text-red-400 underline underline-offset-4 decoration-brown-muted/25 hover:decoration-red-300 transition-colors py-2 touch-manipulation"
          >
            {ui.remove}
          </button>
        </div>
      )}
    </div>
  )
}
