import { useEffect, useRef, useState } from 'react'
import { trackEvent } from '../utils/analytics'

/* ─────────────────────────────────────────────────────────────────────────────
   useMusicPlayer — lokal MP3 audio engine (UI-sız).

   YouTube YOXDUR — `music.file` birbaşa HTML5 <audio> mənbəyidir, `startTime`
   ilk oxutmada tətbiq olunur.

   İstifadə:
     const { audioProps, playing, toggle, hasMusic } = useMusicPlayer({
       lang, music, autoStart: opened,
     })
     {hasMusic && <audio {...audioProps} />}

   ⚠ AVTOMATİK BAŞLAMA (`autoStart`): dəvətnamə açılan kimi musiqi özü başlayır.
   Brauzerlər səssiz yüklənmiş səhifədə autoplay-i bloklaya bilər, ona görə iki
   qat müdafiə var:
     1. Şablon açılış toxunuşunun İÇİNDƏ `play()`-i sinxron çağırır
        (OpeningFrame › onOpenStart) — iOS Safari yalnız jest daxilində icazə
        verir. Bunun işləməsi üçün <audio> zərf açılmamışdan ƏVVƏL də mount
        olunmalıdır.
     2. Buna baxmayaraq bloklanarsa, qonağın NÖVBƏTİ toxunuşunda təkrar cəhd
        edilir. İlk uğurlu başlanğıcdan sonra dinləyici silinir — yoxsa qonaq
        musiqini dayandıranda növbəti toxunuş onu geri açardı.
   ───────────────────────────────────────────────────────────────────────── */
export function useMusicPlayer({ lang, music = null, autoStart = false }) {
  const audioRef   = useRef(null)
  const startedRef = useRef(false)
  const seekedRef  = useRef(false)
  const [playing, setPlaying] = useState(false)
  /* Fayl serverdə YOXDUR (404 / silinib / formatı dəstəklənmir).
     Digitoy-da musiqi faylları əl ilə silinə bilər, dəvətnamə linki isə
     ÖMÜRLÜK açıq qalmalıdır — ona görə bu hal xəta deyil, normal haldır:
     musiqi düyməsi gizlənir, dəvətnamənin qalan hər şeyi işləyir. */
  const [dead, setDead] = useState(false)

  const src       = music?.file || null
  const startTime = Math.max(0, Math.floor(music?.startTime || 0))

  const seek = (a) => {
    if (seekedRef.current || startTime <= 0) return
    try { a.currentTime = startTime } catch { /* metadata hələ yüklənməyib */ }
    seekedRef.current = true
  }

  /** @returns {Promise<boolean>} true — səs həqiqətən başladı */
  const play = () => {
    const a = audioRef.current
    if (!a) return Promise.resolve(false)
    seek(a)
    return a.play().then(() => {
      if (!startedRef.current) {
        startedRef.current = true
        trackEvent('music_started', { lang, provider: music?.provider || 'preset' })
      }
      return true
    }).catch(() => false) /* autoplay bloklandı — aşağıdakı jest dinləyicisi tutur */
  }

  const pause  = () => { audioRef.current?.pause() }
  const toggle = () => { playing ? pause() : play() }

  /* Mahnı dəyişdi → «ölü fayl» bayrağını sıfırla (builder-də seçim dəyişəndə
     yeni fayl köhnəsinin xətasına görə bloklanmasın). */
  useEffect(() => { setDead(false); seekedRef.current = false }, [src])

  /* Effekt həmişə ƏN SON `play`-i çağırsın (hər render-də yenisi yaranır) */
  const playRef = useRef(play)
  playRef.current = play

  useEffect(() => {
    if (!autoStart || !src || dead || startedRef.current) return

    let alive = true

    const disarm = () => {
      window.removeEventListener('pointerdown', attempt, true)
      window.removeEventListener('touchstart', attempt, true)
      window.removeEventListener('keydown', attempt, true)
    }

    function attempt() {
      playRef.current().then((ok) => { if (ok && alive) disarm() })
    }

    attempt()
    /* capture fazası: hansı elementə toxunulduğunun fərqi yoxdur */
    window.addEventListener('pointerdown', attempt, true)
    window.addEventListener('touchstart', attempt, true)
    window.addEventListener('keydown', attempt, true)

    return () => { alive = false; disarm() }
  }, [autoStart, src, dead])

  /* Consumer bu propsları birbaşa <audio>-ya yayır */
  const audioProps = {
    ref: audioRef,
    src,
    loop: true,
    preload: 'auto', /* açılış toxunuşunda dərhal başlaya bilsin */
    onLoadedMetadata: (e) => {
      /* startTime-ı metadata gələn kimi tətbiq et — ilk play ani başlasın */
      if (!seekedRef.current && startTime > 0) {
        try { e.target.currentTime = startTime; seekedRef.current = true } catch { /* seek dəstəklənmir */ }
      }
    },
    onPlay:  () => setPlaying(true),
    onPause: () => setPlaying(false),
    /* ⚠ Fayl açılmadı — səssizcə imtina et. Bu, dinləyiciləri də söndürür:
       əks halda hər toxunuşda uğursuz play() cəhdi təkrarlanardı. */
    onError: () => { setDead(true); setPlaying(false) },
  }

  /* `dead` olanda hasMusic false-dur → şablon nə <audio>, nə də musiqi
     düyməsini render etmir. Dəvətnamə tam işlək qalır. */
  return { audioProps, audioRef, playing, play, pause, toggle, hasMusic: !!src && !dead }
}

export default useMusicPlayer
