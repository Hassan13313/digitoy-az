/* ══════════════════════════════════════════════════
   Phase 25.3 — Musiqi sistemi (genişlənə bilən arxitektura)

   Music modeli:
   {
     type:       'track',                  — gələcəkdə 'playlist' və s. mümkündür
     provider:   'preset' | 'mp3',         — gələcəkdə 'spotify', 'apple', 'youtube'…
     id:         unikal identifikator (preset id və ya null),
     title:      mahnı adı,
     artist:     ifaçı,
     file:       audio fayl URL-i (preset → /music/*.mp3; mp3 → upload URL/blob),
     duration:   saniyə (məlum olduqda),
     startTime:  başlanğıc saniyəsi (default 0),
     coverImage: örtük şəkli URL (hazırda placeholder render olunur),
     isDefault:  true → tədbir növünə görə standart melodiya,
     playMode:   'button' (tövsiyə, default) | 'auto',
     localOnly:  true → fayl yalnız bu brauzerdə (blob) — serverə yüklənməyib
   }

   Yeni provider əlavə etmək üçün:
   1. MUSIC_PROVIDERS-ə açar əlavə et
   2. MusicToggle-da (invitation) həmin provider üçün playback engine yaz
   3. MusicStep-də (builder) seçim UI-ı əlavə et
   Model və data axını (draft → save_invitation → invite) dəyişməz qalır.
══════════════════════════════════════════════════ */

export const MUSIC_PROVIDERS = {
  PRESET: 'preset',
  MP3:    'mp3',
  /* gələcək: SPOTIFY: 'spotify', APPLE: 'apple' */
}

export const MUSIC_PLAY_MODES = {
  AUTO:   'auto',    /* dəvətnamə açılan kimi (brauzer icazə verərsə) */
  BUTTON: 'button',  /* musiqi düyməsinə basıldıqdan sonra — tövsiyə olunur */
}

export const DEFAULT_PLAY_MODE = MUSIC_PLAY_MODES.BUTTON

/**
 * Dəvətnamə açılanda musiqi ÖZÜ başlasınmı?
 *
 * Qərarın YEGANƏ mənbəyi budur — şablonlar öz-özünə autoplay etmir.
 * Builder-də "Musiqi düyməsinə basıldıqdan sonra" (tövsiyə olunan) seçilibsə
 * səs yalnız qonağın toxunuşu ilə başlayır; bubble yenə çıxır və YANDIRMAQ
 * üçün işləyir.
 */
export function shouldAutoPlay(music) {
  return (music?.playMode || DEFAULT_PLAY_MODE) === MUSIC_PLAY_MODES.AUTO
}

/* MP3 yükləmə limitləri */
export const MP3_MAX_BYTES = 20 * 1024 * 1024 /* 20 MB */
export const MP3_MIME_TYPES = ['audio/mpeg', 'audio/mp3']

/* ── Hazır musiqilər — LOKAL MP3 faylları (public/music/) ──
   YouTube istifadə olunmur; preset = birbaşa audio fayl URL-i.
   Yeni preset = faylı public/music/-ə qoy + massivə yeni obyekt. */
export const PRESET_TRACKS = [
  {
    id: 'a-thousand-years',
    type: 'track',
    provider: MUSIC_PROVIDERS.PRESET,
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    file: '/music/a-thousand-years.mp3',
    duration: 286,
    coverImage: null,
    accent: '#B76E79', /* kart örtüyünün placeholder tonu */
  },
  {
    id: 'perfect',
    type: 'track',
    provider: MUSIC_PROVIDERS.PRESET,
    title: 'Perfect',
    artist: 'Ed Sheeran',
    file: '/music/perfect.mp3',
    duration: 264,
    coverImage: null,
    accent: '#5B7C99',
  },
  {
    id: 'canon-in-d',
    type: 'track',
    provider: MUSIC_PROVIDERS.PRESET,
    title: 'Canon in D',
    artist: 'Pachelbel',
    file: '/music/canon-in-d.mp3',
    duration: 302,
    coverImage: null,
    accent: '#8C7B4F',
  },
  {
    id: 'river-flows-in-you',
    type: 'track',
    provider: MUSIC_PROVIDERS.PRESET,
    title: 'River Flows in You',
    artist: 'Yiruma',
    file: '/music/river-flows-in-you.mp3',
    duration: 210,
    coverImage: null,
    accent: '#6B8E7B',
  },
  {
    id: 'all-of-me',
    type: 'track',
    provider: MUSIC_PROVIDERS.PRESET,
    title: 'All of Me',
    artist: 'John Legend',
    file: '/music/all-of-me.mp3',
    duration: 270,
    coverImage: null,
    accent: '#7B6B8E',
  },
]

/* Preset seçimindən formData.music obyekti qur */
export function buildPresetMusic(track, { startTime = 0, playMode = DEFAULT_PLAY_MODE } = {}) {
  return {
    type: 'track',
    provider: MUSIC_PROVIDERS.PRESET,
    id: track.id,
    title: track.title,
    artist: track.artist,
    file: track.file,
    duration: track.duration ?? null,
    startTime,
    coverImage: track.coverImage ?? null,
    isDefault: false,
    playMode,
  }
}

/* MP3 yükləməsindən formData.music obyekti qur */
export function buildMp3Music({ url, name, duration = null, startTime = 0, playMode = DEFAULT_PLAY_MODE, localOnly = false }) {
  return {
    type: 'track',
    provider: MUSIC_PROVIDERS.MP3,
    id: null,
    title: name || 'Öz musiqim',
    artist: '',
    file: url,
    duration,
    startTime,
    coverImage: null,
    isDefault: false,
    playMode,
    ...(localOnly ? { localOnly: true } : {}),
  }
}

/* saniyə → "m:ss" */
export function formatSeconds(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/* "m:ss" və ya "mm:ss" → saniyə (yanlış format → null) */
export function parseTimeInput(str) {
  const m = String(str || '').trim().match(/^(\d{1,3}):([0-5]?\d)$/)
  if (!m) return null
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10)
}
