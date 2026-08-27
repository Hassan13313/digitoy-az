import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import DressCodeSection from '../_shared/DressCodeSection'
import MapMosaic, { MapRings } from '../_shared/MapMosaic'
import { parseLatLon } from '../_shared/geo'
import { OrderCta, MusicStartBubble } from '../_shared/TemplateActions'
import TemplateOutro from '../_shared/TemplateOutro'
import { getTemplateTheme } from '../templateConfig'
import { buildPresetMusic, PRESET_TRACKS, MUSIC_PLAY_MODES, shouldAutoPlay } from '../../data/music'
import { getPackageGates } from '../../data/packages'
import { formatAzDate, formatFullDateByLang, formatTime24 } from '../../utils/dateFormat'
import { unlockAudio } from '../../utils/audioUnlock'
import { trackEvent } from '../../utils/analytics'
import { Reveal, Stagger, Parallax, PopDigit, enterDirection } from '../_shared/motion'
import { useCountdown } from '../../hooks/useCountdown'
import { useTimeline } from '../../hooks/useTimeline'
import { useSeating } from '../../hooks/useSeating'
import { useRsvp } from '../../hooks/useRsvp'
import { useGuestbook } from '../../hooks/useGuestbook'
import { useGallery } from '../../hooks/useGallery'
import { useMusicPlayer } from '../../hooks/useMusicPlayer'
import { useMusicPrompt } from '../../hooks/useMusicPrompt'
import t from '../../data/translations'

/* ─────────────────────────────────────────────────────────────────────────────
   FLORAL GARDEN ROMANCE — Claude Design "Digitoy Templates.dc.html" · t2

   Design story: gündüz, açıq havada, ot üzərində keçən toy. Qızıl yox —
   işıq və bitki. Palitra: adaçayı (#7E8C6E) · tozlu qızılgül (#C98F84).
   Tipoqrafika: Cormorant Garamond Italic (başlıq) + Jost (mətn).

   ⚠ Bu fayl YALNIZ UI qatıdır — bütün biznes məntiqi hook-lardadır
   (useRsvp / useSeating / useGuestbook / useCountdown / useGallery /
   useTimeline / useMusicPlayer). simple-luxury ilə eyni hook-ları işlədir,
   yəni RSVP/oturma/qonaq dəftəri backend davranışı tam eynidir.

   Bölmə sırası design faylındakı "Struktur" leqendası ilə eynidir (13 bölmə).
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('floral-garden')
const DEFAULT_MUSIC = buildPresetMusic(PRESET_TRACKS[0], { playMode: MUSIC_PLAY_MODES.AUTO })

const serif = TH.fonts.heading
const sans  = TH.fonts.body

/* Şablona məxsus keyframe-lər — qlobal CSS-ə toxunmur, prefiks `fg-` */
const KEYFRAMES = `
@keyframes fg-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes fg-hint  { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }

/* «Açılış Ekranı düzəliş V1» — açan çiçək ardıcıllığı */
@keyframes fg-veil   { from { opacity:1 } to { opacity:0 } }
@keyframes fg-rise   { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }
@keyframes fg-halo   { 0%,100% { opacity:.55; transform:scale(1) } 50% { opacity:1; transform:scale(1.1) } }
@keyframes fg-vine   { from { transform:scaleY(0) } to { transform:scaleY(1) } }
@keyframes fg-fall   { 0% { opacity:0; transform:translate3d(0,-34px,0) rotate(0) } 14% { opacity:.85 } 100% { opacity:0; transform:translate3d(-40px,320px,0) rotate(300deg) } }
@keyframes fg-bloom  { 0% { opacity:0; transform:rotate(-120deg) scale(.15) } 70% { opacity:1; transform:rotate(6deg) scale(1.06) } 100% { opacity:1; transform:rotate(0) scale(1) } }
@keyframes fg-letter { from { opacity:0; transform:translateY(26px) rotateX(52deg); filter:blur(7px) } to { opacity:1; transform:none; filter:blur(0) } }
@keyframes fg-cta    { from { opacity:0; transform:translateY(16px) scale(.94) } to { opacity:1; transform:none } }
@keyframes fg-gleam  { 0% { transform:translateX(-140%) skewX(-18deg); opacity:0 } 22% { opacity:.9 } 100% { transform:translateX(300%) skewX(-18deg); opacity:0 } }

/* Daxili arxa fon (ambient) */
@keyframes fg-wander { 0%,100% { transform:translate3d(0,0,0) } 33% { transform:translate3d(26px,-34px,0) } 66% { transform:translate3d(-22px,20px,0) } }
@keyframes fg-abloom { 0% { transform:translate3d(0,-16%,0) rotate(-20deg) scale(.85); opacity:0 } 12% { opacity:.9 } 88% { opacity:.9 } 100% { transform:translate3d(-56px,116%,0) rotate(200deg) scale(1.05); opacity:0 } }
@keyframes fg-afall  { 0% { transform:translate3d(0,-14%,0) rotate(0); opacity:0 } 12% { opacity:.85 } 100% { transform:translate3d(-48px,114%,0) rotate(280deg); opacity:0 } }
@media (prefers-reduced-motion: reduce) {
  [data-fg] *, [data-fg] { animation: none !important; transition: none !important; }
}
`

/* ── Daxili arxa fon — «Açılış Ekranı düzəliş V1» ────────────────────────────
   Design t2-də dəvətnamənin fonu düz kağız deyil: iki akvarel ləkəsi gəzişir,
   yuxarıdan çiçək və ləçək süzülür. Qat `multiply` blend ilə məzmunun
   ÜSTÜNDƏDİR — açıq şablonda yalnız kölgələyir, mətni örtmür.
   ⚠ zIndex 3: məzmundan yuxarı, amma başlıq/düymələrdən aşağı. */
const AMBIENT_BLOOMS = [
  { left: '8%',  size: 34, dur: 21, delay: 0,  fill: 'rgba(214,166,157,.5)' },
  { left: '30%', size: 26, dur: 16, delay: 6,  fill: 'rgba(201,143,132,.45)' },
  { left: '54%', size: 40, dur: 25, delay: 12, fill: 'rgba(230,196,190,.5)' },
  { left: '76%', size: 28, dur: 17, delay: 3,  fill: 'rgba(201,143,132,.42)' },
  { left: '92%', size: 32, dur: 20, delay: 17, fill: 'rgba(214,166,157,.45)' },
]

const AMBIENT_PETALS = [
  { left: '16%', dur: 11, delay: 1 },
  { left: '37%', dur: 13, delay: 5 },
  { left: '58%', dur: 12, delay: 9 },
  { left: '78%', dur: 14, delay: 2.5 },
  { left: '92%', dur: 12.5, delay: 13 },
]

function WatercolorBlobs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <span style={{
        position: 'absolute', left: '-18%', top: '8%', width: '70%', height: '34%', borderRadius: '50%',
        background: `radial-gradient(circle, ${TH.accent}52, transparent 68%)`,
        filter: 'blur(38px)', animation: 'fg-wander 19s ease-in-out infinite',
      }} />
      <span style={{
        position: 'absolute', right: '-20%', bottom: '14%', width: '64%', height: '30%', borderRadius: '50%',
        background: `radial-gradient(circle, ${TH.primary}52, transparent 70%)`,
        filter: 'blur(40px)', animation: 'fg-wander 24s ease-in-out 8s infinite reverse',
      }} />

      {AMBIENT_BLOOMS.map((b, i) => (
        <span key={i} style={{
          position: 'absolute', left: b.left, top: '-12%', width: b.size, height: b.size,
          animation: `fg-abloom ${b.dur}s linear ${b.delay}s infinite`,
        }}>
          <svg viewBox="0 0 40 40" width={b.size} height={b.size} fill="none" aria-hidden="true">
            <g transform="translate(20 20)">
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse key={deg} cx="0" cy="-9" rx="6" ry="10" transform={`rotate(${deg})`} fill={b.fill} />
              ))}
              <circle cx="0" cy="0" r="4" fill="rgba(246,226,194,.75)" />
            </g>
          </svg>
        </span>
      ))}

      {AMBIENT_PETALS.map((p, i) => (
        <span key={i} style={{
          position: 'absolute', left: p.left, top: 0, width: 9, height: 12,
          borderRadius: '60% 60% 55% 55% / 70% 70% 45% 45%',
          background: `${TH.accent}73`,
          animation: `fg-afall ${p.dur}s linear ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  )
}

/* Bölmə başlığı: kiçik caps etiket + italik serif başlıq */
function SectionHead({ kicker, title, align = 'left' }) {
  return (
    <>
      <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.primary, textAlign: align }}>
        {kicker}
      </div>
      <div style={{
        fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(22px,6vw,26px)',
        color: TH.text, margin: '6px 0 18px', textAlign: align, lineHeight: 1.25,
      }}>
        {title}
      </div>
    </>
  )
}

const pill = (filled) => ({
  flex: 1, textAlign: 'center', borderRadius: 100, padding: '13px 6px',
  fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase',
  fontFamily: sans, cursor: 'pointer', textDecoration: 'none',
  background: filled ? TH.primary : 'transparent',
  color: filled ? TH.background : '#5F6B53',
  border: filled ? '1px solid transparent' : `1px solid ${TH.primary}66`,
  display: 'block',
})

/* ═══════════════════════════════════════════════════════════════════════════
   01 — AÇILIŞ: açan çiçək («Açılış Ekranı düzəliş V1»)

   Design t2 açılışı artıq iki taya bölünən pərdə deyil — BAĞÇANIN ÖZÜDÜR.
   Ağ işıq pərdəsi əriyir, yanlardan iki sarmaşıq xətti böyüyür, havada ləçək
   düşür, mərkəzdə çiçək altı ləçəyi ilə AÇILIR (fl-bloom) — yalnız bundan
   sonra adlar qalxır.

   ⚠ `onOpenStart` MÜTLƏQ toxunuş hadisəsinin içində çağırılır (musiqi).
   ═══════════════════════════════════════════════════════════════════════════ */

/* Havada düşən ləçəklər — açılış ekranı üçün (deterministik) */
const PETALS = [
  { left: '14%', dur: 11, delay: 0 },
  { left: '30%', dur: 13, delay: 2.4 },
  { left: '48%', dur: 10, delay: 1.2 },
  { left: '64%', dur: 12.5, delay: 4 },
  { left: '80%', dur: 11.5, delay: 3 },
  { left: '92%', dur: 14, delay: 5.6 },
  { left: '22%', dur: 12, delay: 6.8 },
]

/* Altı ləçəkli çiçək — mərkəzdən burularaq açılır */
function BloomFlower({ delay = 1.5 }) {
  return (
    <div style={{
      position: 'relative', width: 120, height: 120, margin: '0 auto',
      animation: `fg-bloom 1.7s cubic-bezier(.2,.9,.25,1) ${delay}s both`,
    }}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <span key={deg} style={{
          position: 'absolute', left: '50%', top: '50%', width: 26, height: 40,
          margin: '-40px 0 0 -13px', transformOrigin: '50% 100%', transform: `rotate(${deg}deg)`,
          borderRadius: '60% 60% 40% 40% / 70% 70% 30% 30%',
          background: `linear-gradient(170deg, #FBEDEA, ${TH.accent}D9)`,
          border: `1px solid ${TH.accent}59`,
        }} />
      ))}
      <span style={{
        position: 'absolute', left: '50%', top: '50%', width: 20, height: 20,
        transform: 'translate(-50%,-50%)', borderRadius: '50%',
        background: `radial-gradient(circle at 36% 30%, #F6E2C2, ${TH.accent})`,
        boxShadow: '0 3px 10px rgba(140,90,80,.28)',
      }} />
    </div>
  )
}

function GardenOpening({ weddingData, isCouple, isCorp, eventLabel, onOpen, onOpenStart }) {
  const [opening, setOpening] = useState(false)
  const [gone, setGone] = useState(false)

  const first = isCouple ? (weddingData.groomName || '') : (weddingData.eventName || weddingData.brideName || '')
  const second = isCouple ? (weddingData.brideName || '') : ''

  const start = () => {
    if (opening) return
    unlockAudio()
    /* ⚠ Musiqi toxunuş hadisəsinin İÇİNDƏ başlayır — `onOpen` 950ms sonra
       gəlir və o vaxt brauzerin jest pəncərəsi bağlı olur. */
    onOpenStart?.()
    setOpening(true)
    setTimeout(() => { setGone(true); onOpen() }, 950)
  }

  if (gone) return null

  /* Sarmaşıq — biri yuxarıdan, digəri aşağıdan böyüyür */
  const vine = (side, origin, delay) => ({
    position: 'absolute', top: 0, bottom: 0, [side]: 26, width: 1, pointerEvents: 'none',
    background: `linear-gradient(180deg, transparent, ${TH.primary}80, transparent)`,
    transformOrigin: `50% ${origin}`,
    animation: `fg-vine 1.6s cubic-bezier(.22,.61,.36,1) ${delay}s both`,
  })

  return (
    <motion.div
      onClick={start}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start() } }}
      aria-label="Dəvətnaməni aç"
      data-fg
      animate={opening ? { opacity: 0, scale: 1.04 } : {}}
      transition={{ duration: 0.95, ease: [0.65, 0, 0.35, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        background: `radial-gradient(120% 80% at 50% 22%, #FFFDFB, #F4EBE5 76%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 clamp(22px, 8vw, 32px)', fontFamily: sans,
        isolation: 'isolate',
      }}
    >
      {/* Pərdə */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: 0, background: TH.background, pointerEvents: 'none', zIndex: 2,
        animation: 'fg-veil 1s ease-out .1s both',
      }} />

      {/* İki akvarel ləkəsi — tozlu qızılgül və adaçayı */}
      <span aria-hidden="true" style={{
        position: 'absolute', top: -100, left: -100, width: 320, height: 320, borderRadius: '50%',
        background: `radial-gradient(circle, ${TH.accent}52, transparent 68%)`,
        filter: 'blur(30px)', pointerEvents: 'none', zIndex: -1,
        animation: 'fg-halo 10s ease-in-out 1s infinite',
      }} />
      <span aria-hidden="true" style={{
        position: 'absolute', bottom: -90, right: -80, width: 280, height: 280, borderRadius: '50%',
        background: `radial-gradient(circle, ${TH.primary}4D, transparent 68%)`,
        filter: 'blur(30px)', pointerEvents: 'none', zIndex: -1,
        animation: 'fg-halo 12s ease-in-out 2s infinite',
      }} />

      {/* Düşən ləçəklər */}
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1 }}>
        {PETALS.map((p, i) => (
          <span key={i} style={{
            position: 'absolute', left: p.left, top: '-6%', width: 9, height: 12, opacity: 0,
            borderRadius: '60% 60% 55% 55% / 70% 70% 45% 45%',
            background: `linear-gradient(160deg, #F0D3CE, ${TH.accent})`,
            animation: `fg-fall ${p.dur}s linear ${p.delay}s infinite`,
          }} />
        ))}
      </span>

      <span aria-hidden="true" style={vine('left', '0', 0.6)} />
      <span aria-hidden="true" style={vine('right', '100%', 0.8)} />

      <div style={{ position: 'relative' }}>
        {/* Kicker — yanlarda adaçayı xətləri */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          animation: 'fg-rise .9s cubic-bezier(.22,.61,.36,1) 1.1s both',
        }}>
          <span style={{ width: 20, height: 1, background: `${TH.primary}B3` }} />
          <span style={{ fontSize: 9.5, letterSpacing: '.4em', textTransform: 'uppercase', color: TH.muted, whiteSpace: 'nowrap' }}>
            {eventLabel}
          </span>
          <span style={{ width: 20, height: 1, background: `${TH.primary}B3` }} />
        </div>

        <div style={{ marginTop: 32 }}>
          <BloomFlower delay={1.5} />
        </div>

        {/* Adlar — hər söz ayrıca qalxır */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 11, marginTop: 28,
          fontFamily: serif, fontSize: 'clamp(28px, 10vw, 36px)', color: '#4A3B37', lineHeight: 1,
        }}>
          <span style={{ display: 'inline-block', animation: 'fg-letter 1s cubic-bezier(.22,.61,.36,1) 2.9s both' }}>{first}</span>
          {second && (
            <>
              <span style={{ display: 'inline-block', fontSize: 'clamp(18px, 6.5vw, 23px)', color: TH.accent, animation: 'fg-letter 1s cubic-bezier(.22,.61,.36,1) 3.1s both' }}>&amp;</span>
              <span style={{ display: 'inline-block', animation: 'fg-letter 1s cubic-bezier(.22,.61,.36,1) 3.3s both' }}>{second}</span>
            </>
          )}
        </div>

        {/* Ornament — solub gedən xətlər və ortada qızılgül nöqtəsi */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 16,
          animation: 'fg-rise .8s ease-out 3.6s both',
        }}>
          <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, ${TH.accent})` }} />
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: TH.accent }} />
          <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, ${TH.accent}, transparent)` }} />
        </div>

        <div style={{
          fontSize: 10.5, letterSpacing: '.24em', textTransform: 'uppercase', color: TH.muted, marginTop: 14,
          animation: 'fg-rise .8s ease-out 3.8s both',
        }}>
          {formatFullDateByLang(weddingData.date, 'az')}
        </div>

        {/* CTA — ağ, üzərindən işıq keçir */}
        <div style={{
          position: 'relative', overflow: 'hidden', marginTop: 38,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          border: `1px solid ${TH.accent}8C`, borderRadius: 100, padding: '14px 26px',
          fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase',
          color: '#7A5C55', background: 'rgba(255,255,255,.7)',
          animation: 'fg-cta .9s cubic-bezier(.22,.61,.36,1) 4.1s both',
        }}>
          <span aria-hidden="true" style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, width: '38%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.9), transparent)',
            animation: 'fg-gleam 4.6s ease-in-out 5.3s infinite',
          }} />
          <span style={{ position: 'relative' }}>{isCorp ? 'Tədbirə daxil olun' : 'Dəvətnaməyə daxil olun'}</span>
          <span style={{ position: 'relative' }}>→</span>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 32, textAlign: 'center',
        fontSize: 10.5, letterSpacing: '.2em', color: '#9C8B84',
        animation: 'fg-rise .8s ease-out 4.6s both, fg-hint 2.8s ease-in-out 5.4s infinite',
      }}>
        toxunun
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   03 — MUSİQİ: adaçayı ekvalayzer dairəsi (audio engine useMusicPlayer-dədir)
   ═══════════════════════════════════════════════════════════════════════════ */
function GardenMusic({ lang, music, playerRef, visible = false, autoPlay = false }) {
  const { audioProps, playing, play, pause, toggle, hasMusic } = useMusicPlayer({
    lang, music, autoStart: visible && autoPlay,
  })

  useEffect(() => {
    if (playerRef) playerRef.current = { play, pause }
  })

  /* Bubble: açılışdan 900ms sonra çıxır, İLK SCROLL-da və ya toxunanda gedir */
  const [prompt, dismissPrompt] = useMusicPrompt({ enabled: visible && hasMusic })

  if (!hasMusic) return null

  return (
    <>
      {/* ⚠ `visible` = dəvətnamə açılıb. <audio> BUNDAN ASILI DEYİL — zərf
          açılmamışdan əvvəl də mount olunur ki, açılış toxunuşunda play()
          sinxron çağırıla bilsin (iOS Safari yalnız jest daxilində icazə
          verir). Görünən yalnız UI-dır: ekvalayzer düyməsi və bubble. */}
      <audio {...audioProps} />
      {!visible ? null : (
      <>
      {/* YALNIZ start helper — musiqi çalırsa klik heç nə etmir */}
      <MusicStartBubble
        theme={TH} lang={lang} visible={prompt} playing={playing}
        onStart={() => { if (!playing) play(); dismissPrompt() }}
      />
      <button
        onClick={toggle}
        data-press
        aria-label={playing ? 'Musiqini dayandır' : 'Musiqini başlat'}
        style={{
          position: 'fixed',
          bottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
          right: 20, zIndex: 55,
          width: 46, height: 46, borderRadius: '50%',
          border: `1px solid ${TH.primary}66`,
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 6px 20px rgba(62,74,58,0.14)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
          cursor: 'pointer',
        }}
      >
        {[0, 0.2, 0.4].map((d) => (
          <span key={d} style={{
            width: 2.5, height: 12, background: playing ? TH.primary : `${TH.muted}80`,
            transformOrigin: 'bottom', display: 'block',
            animation: playing ? `fg-eq 1.1s ease-in-out ${d}s infinite` : 'none',
            transform: playing ? undefined : 'scaleY(.45)',
          }} />
        ))}
      </button>
      </>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function FloralGardenTemplate({
  lang, setLang, weddingData, onBack, isDemoMode = false, initialGuestbook,
}) {
  const tr = t[lang] || t.az
  const [opened, setOpened] = useState(false)
  const musicRef = useRef(null)

  const isCouple = ['toy', 'nishan'].includes(weddingData.eventType)
  /* Location: koordinat varsa real xəritə, yoxsa köhnə abstrakt kart */
  const hasCoords = !!parseLatLon(weddingData)
  const isCorp   = ['corporate', 'other'].includes(weddingData.eventType)

  const eventLabels = {
    toy: tr.event_toy, nishan: tr.event_nishan,
    birthday: tr.event_birthday, corporate: tr.event_corporate,
    other: weddingData.eventName || tr.event_other,
  }
  const eventLabel = eventLabels[weddingData.eventType] || tr.event_toy

  const invMusic  = weddingData?.music || DEFAULT_MUSIC
  /* ⚠ Autoplay YALNIZ builder-də "Dəvətnamə açılan kimi" seçiləndə (və ya
     musiqi seçilməyib default preset işlədiləndə) — bax data/music.js */
  const autoPlay  = shouldAutoPlay(invMusic)

  /* Paket gating — simple-luxury ilə eyni məntiq */
  const activePkgId = isDemoMode ? 'PREMIUM' : (weddingData.package || 'SADE')
  const { allowRsvp: canShowRsvp, allowSeating: canShowSeating, allowGallery: canShowGallery } = getPackageGates(activePkgId)

  /* ── Hook-lar: bütün biznes məntiqi ── */
  const cd       = useCountdown({ date: weddingData.date, time: weddingData.time, lang, eventType: weddingData.eventType, eventName: weddingData.eventName })
  const timeline = useTimeline({ lang, eventType: weddingData.eventType, programSteps: weddingData.programSteps })
  /* inputRef ayrıca çıxarılır — qalan obyektdə ref qalmasın (react-hooks/refs) */
  const { inputRef: seatInputRef, ...seating } = useSeating({ seatingPlan: weddingData.seatingPlan, lang })
  const { inputRef: rsvpInputRef, ...rsvp } = useRsvp({ lang, weddingData })
  const gbook    = useGuestbook({ lang, initialMessages: initialGuestbook })
  const gallery  = useGallery({ weddingData, isCouple, isCorp })

  /* Dəvətnamə açıldı — demo/preview sayılmır */
  useEffect(() => {
    if (!isDemoMode) trackEvent('invitation_opened', { lang, event_type: weddingData?.eventType })
  }, [])

  const { formattedDate, dayName } = formatAzDate(weddingData.date, lang)
  const names = isCouple
    ? `${weddingData.groomName || ''}\n& ${weddingData.brideName || ''}`
    : (weddingData.eventName || weddingData.brideName || '')


  return (
    <div
      data-fg
      data-enter={enterDirection('floral-garden')}
      style={{
        background: TH.background, minHeight: '100vh', fontFamily: sans, color: TH.text,
        overflowX: 'hidden', position: 'relative',
        /* ⚠ ambient qatının `multiply` blend-ini bu kökə bağlayır — olmasa
           blend səhifədən kənara (body) sızır. */
        isolation: 'isolate',
        '--tpl-glow': `${TH.primary}42`,
      }}
    >
      <style>{KEYFRAMES}</style>

      {/* 01 — ZƏRF AÇILIŞI */}
      {!opened && (
        <GardenOpening
          weddingData={weddingData}
          isCouple={isCouple}
          isCorp={isCorp}
          eventLabel={eventLabel}
          onOpen={() => setOpened(true)}
          onOpenStart={autoPlay ? () => musicRef.current?.play() : undefined}
        />
      )}

      {/* Daxili arxa fon — scroll-a əks istiqamətdə sürüşür (parallaks).
          ⚠ `translate` yazılır — ləkələrin öz `fg-wander` transform animasiyası
          toxunulmaz qalır. */}
      {opened && (
        <Parallax mode="page" range={54} style={{
          position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none', mixBlendMode: 'multiply',
        }}>
          <WatercolorBlobs />
        </Parallax>
      )}

      {/* 03 — MUSİQİ TOGGLE */}
      <GardenMusic lang={lang} music={invMusic} playerRef={musicRef} visible={opened} autoPlay={autoPlay} />

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* 02 — STICKY HEADER */}
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52,
              padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(251,247,242,0.9)', backdropFilter: 'blur(10px)',
              borderBottom: `1px solid ${TH.primary}33`,
            }}>
              <button
                onClick={onBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                  fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: TH.muted,
                  cursor: 'pointer', fontFamily: sans,
                  /* toxunma hədəfi — design mobil qeydi: min 44px */
                  minHeight: 44, padding: '0 8px 0 0', marginLeft: -2,
                }}
              >
                <span>←</span>{tr.btn_back}
              </button>
              <div style={{ fontFamily: serif, fontSize: 14, letterSpacing: '.06em' }}>
                <span style={{ color: TH.primary }}>Digitoy</span>
                <span style={{ color: `${TH.muted}80` }}>.az</span>
              </div>
              <LanguageSwitcher lang={lang} setLang={setLang} />
            </header>

            {/* 04 — HERO (design: sola düzləndirilmiş, mobil oxunaqlılıq üçün) */}
            <section style={{ position: 'relative', padding: '52px 28px 48px', overflow: 'hidden' }}>
              {/* Akvarel ləkəsi parallaksla dərinlik verir (scroll-a əks istiqamət) */}
              <Parallax
                speed={0.18}
                max={38}
                style={{
                  position: 'absolute', width: 260, height: 260, borderRadius: '50%',
                  background: `radial-gradient(circle, ${TH.accent}4D, transparent 66%)`,
                  top: -70, right: -90, filter: 'blur(24px)', pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
                <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.primary, marginBottom: 12 }}>
                  {eventLabel}
                </div>
                <div style={{ fontFamily: serif, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.muted }}>
                  {tr.inv_join}
                </div>
                <h1 style={{
                  fontFamily: serif, fontStyle: 'italic', fontWeight: 300,
                  fontSize: 'clamp(38px,12vw,50px)', lineHeight: 1.1,
                  color: '#3E3730', margin: '14px 0 0', whiteSpace: 'pre-line',
                }}>
                  {names}
                </h1>

                {isCorp && weddingData.organizer?.trim() && (
                  <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.primary, marginTop: 10 }}>
                    {tr.organizer_display}: {weddingData.organizer}
                  </div>
                )}

                {/* Ornament */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '22px 0' }}>
                  <div style={{ width: 44, height: 1, background: TH.accent }} />
                  <div style={{ width: 4, height: 4, background: TH.accent, transform: 'rotate(45deg)' }} />
                  <div style={{ width: 22, height: 1, background: `${TH.accent}66` }} />
                </div>

                <div style={{ fontSize: 14, color: '#4A4139' }}>{formattedDate}</div>
                <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: TH.primary, marginTop: 5 }}>
                  {[dayName, weddingData.time ? formatTime24(weddingData.time) : ''].filter(Boolean).join(' · ')}
                </div>
                {weddingData.venueName && (
                  <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.muted, marginTop: 16 }}>
                    {weddingData.venueName}
                  </div>
                )}

                <div style={{
                  margin: '32px 0 0', width: 40, height: 40, border: `1px solid ${TH.primary}4D`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: TH.primary, animation: 'fg-hint 2.8s ease-in-out infinite',
                }}>⌄</div>
              </div>
            </section>

            {/* 05 — COUNTDOWN */}
            <section style={{ padding: '30px 28px', background: TH.surface }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="Countdown" title={cd.title} />
                <Stagger base={55} style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds, accent: true, pop: true },
                  ].map(({ v, l, accent, pop }) => (
                    <div key={l}>
                      <div style={{
                        fontFamily: serif, fontSize: 34, lineHeight: 1,
                        color: accent ? TH.accent : TH.text, fontVariantNumeric: 'tabular-nums',
                      }}>
                        {/* Yalnız saniyə rəqəmi döyünür */}
                        <PopDigit value={v} pop={pop} />
                      </div>
                      <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: TH.muted, marginTop: 4 }}>
                        {l}
                      </div>
                    </div>
                  ))}
                </Stagger>
              </Reveal>
            </section>

            {/* 06 — LOCATION */}
            <section style={{ padding: '34px 28px' }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <div style={{ borderRadius: 18, overflow: 'hidden', border: `1px solid ${TH.primary}40` }}>
                  {/* Hibrid xəritə — koordinat varsa OSM tile mozaikası,
                      yoxdursa köhnə botanik nöqtə fonu (boş blok olmur). */}
                  <div style={{ background: 'linear-gradient(150deg,#E4E7DC,#D3D9C8)', position: 'relative', overflow: 'hidden' }}>
                    <MapMosaic
                      weddingData={weddingData}
                      theme={TH}
                      map={{ opacity: 0.5, filter: 'grayscale(1) brightness(1.12) contrast(.9)', tintOpacity: 0.42 }}
                      frame={<MapRings accent={TH.primary} />}
                    />
                    {!hasCoords && (
                      <div style={{
                        height: 'clamp(148px, 42vw, 168px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                      }}>
                        <div style={{
                          position: 'absolute', inset: 0, opacity: .35,
                          backgroundImage: `radial-gradient(circle at 30% 40%, ${TH.primary}80 0 3px, transparent 4px), radial-gradient(circle at 72% 66%, ${TH.primary}66 0 2px, transparent 3px)`,
                          backgroundSize: '60px 60px',
                        }} />
                        <MapRings accent={TH.primary} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: TH.accent, boxShadow: `0 0 0 8px ${TH.accent}33` }} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 18, background: '#FFFFFF' }}>
                    <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.primary }}>LOCATION</div>
                    <div style={{ fontFamily: serif, fontSize: 20, color: TH.text, marginTop: 6 }}>
                      {weddingData.venueName || tr.inv_location}
                    </div>
                    {/* Məkan qeydi (zal/mərtəbə) — YALNIZ doludursa */}
                    {weddingData.venueNote && (
                      <div style={{ fontSize: 12.5, color: TH.muted, marginTop: 5, lineHeight: 1.5 }}>
                        {weddingData.venueNote}
                      </div>
                    )}
                    <Stagger base={110} style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                      <a data-press href={weddingData.googleMapsUrl || '#'} target="_blank" rel="noopener noreferrer" style={pill(true)}>Maps</a>
                      <a data-press href={weddingData.wazeUrl || '#'} target="_blank" rel="noopener noreferrer" style={pill(false)}>Waze</a>
                      {weddingData.appleMapsUrl && (
                        <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={pill(false)}>Apple</a>
                      )}
                    </Stagger>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* 07 — PROQRAM */}
            <section style={{ padding: '34px 28px' }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="Schedule" title={timeline.sectionLabel} />
                <Stagger base={55}>
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 14, alignItems: 'flex-start',
                      paddingBottom: i === timeline.events.length - 1 ? 0 : 18,
                      borderLeft: `1px solid ${TH.primary}4D`, paddingLeft: 16, marginLeft: 4, position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute', left: -4, top: 6, width: 7, height: 7, borderRadius: '50%',
                        background: i % 2 ? TH.accent : TH.primary,
                      }} />
                      <span style={{ width: 42, flex: '0 0 auto', fontSize: 10, letterSpacing: '.12em', color: TH.muted, paddingTop: 5 }}>
                        {ev.time}
                      </span>
                      <span style={{
                        width: 32, height: 32, flex: '0 0 auto', border: `1px solid ${TH.primary}4D`,
                        borderRadius: 8, background: '#FFFFFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                      }}>{ev.icon}</span>
                      <span style={{ paddingTop: 5, fontFamily: serif, fontSize: 17, color: TH.text }}>
                        {ev.label}
                      </span>
                    </div>
                  ))}
                </Stagger>
              </Reveal>
            </section>

            {/* 08 — DRESS CODE — Claude Design t2 bölməsinin piksel köçürməsi.
                Fon design-dakı kimi #F3EFE8 (floral theme-in `surface` tokeni). */}
            <section style={{ padding: '30px 28px', background: '#F3EFE8' }}>
              <Reveal>
                <DressCodeSection
                  theme={TH}
                  title={tr.inv_dresscode}
                  kicker="STYLE"
                  paletteId={weddingData.dressCodePalette}
                  customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders}
                  note={weddingData.dressCodeDescription}
                  lang={lang}
                  serif={serif}
                  align="left"
                  italic
                />
              </Reveal>
            </section>

            {/* 09 — OTURMA PLANI */}
            {canShowSeating && !seating.isEmpty && (
              <section style={{ padding: '34px 28px' }}>
                <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                  <SectionHead kicker="SEATING" title={seating.labels.title} />

                  {/* ⚠ Təkliflər siyahısı QƏSDƏN normal document flow-dadır
                      (position:absolute DEYİL) — açılanda aşağıdakı bölmələri
                      örtmür, onları aşağı sürüşdürür. Heç bir viewport-da
                      overlap olmur. */}
                  <div>
                    <input
                      ref={seatInputRef}
                      type="text"
                      value={seating.query}
                      onChange={(e) => { seating.setQuery(e.target.value); seating.setActiveIdx(-1); if (seating.selected) seating.setSelected(null) }}
                      onKeyDown={seating.onKeyDown}
                      placeholder={seating.labels.hint}
                      role="combobox"
                      aria-expanded={seating.suggestions.length > 0}
                      aria-controls="fg-seating-list"
                      aria-autocomplete="list"
                      autoComplete="off"
                      style={{
                        width: '100%', background: '#FFFFFF', border: `1px solid ${TH.primary}40`,
                        borderRadius: 100, padding: '13px 18px', fontSize: 13, color: TH.text,
                        fontFamily: sans, outline: 'none',
                      }}
                    />
                    {seating.suggestions.length > 0 && (
                      <ul id="fg-seating-list" role="listbox" style={{
                        listStyle: 'none', margin: '8px 0 0', padding: 4,
                        background: '#FFFFFF', border: `1px solid ${TH.primary}40`, borderRadius: 16,
                        boxShadow: '0 6px 18px rgba(62,74,58,0.10)', maxHeight: 300, overflowY: 'auto',
                      }}>
                        {seating.suggestions.map((g, i) => (
                          <li
                            key={g.id ?? `${g.full_name}-${i}`}
                            role="option"
                            aria-selected={i === seating.activeIdx}
                            onMouseEnter={() => seating.setActiveIdx(i)}
                            onMouseDown={(e) => { e.preventDefault(); seating.pick(g) }}
                            style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                              padding: '12px 14px', cursor: 'pointer', borderRadius: 12,
                              background: i === seating.activeIdx ? `${TH.primary}14` : 'transparent',
                            }}
                          >
                            <span style={{ fontSize: 13, color: TH.text }}>{g.full_name}</span>
                            <span style={{
                              background: TH.accent, color: '#FFF', fontSize: 10, letterSpacing: '.12em',
                              padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap',
                            }}>{g.table_id}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {seating.showNotFound && (
                    <div style={{ marginTop: 12, fontSize: 12.5, color: TH.muted }}>{tr.inv_seat_fullname}</div>
                  )}

                  {seating.selected && (
                    <div style={{ marginTop: 12, background: '#FFFFFF', borderRadius: 16, padding: 18, border: `1px solid ${TH.accent}4D` }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <span style={{ fontSize: 13, color: TH.text }}>{seating.selected.full_name}</span>
                        <span style={{
                          background: TH.accent, color: '#FFFFFF', fontSize: 10, letterSpacing: '.12em',
                          padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap',
                          textTransform: 'uppercase',
                        }}>{seating.selected.table_id}</span>
                      </div>
                      <div style={{ fontSize: 11, color: TH.muted, marginTop: 10, lineHeight: 1.6 }}>
                        {seating.selected.table_id}: {seating.tablemates.map((g) => g.full_name).join(', ')}
                      </div>
                      <button
                        onClick={seating.reset}
                        data-press
                        style={{
                          marginTop: 6, background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: TH.primary, fontFamily: sans,
                          minHeight: 44, padding: '0 8px 0 0',
                        }}
                      >
                        Yenidən axtar
                      </button>
                    </div>
                  )}
                </Reveal>
              </section>
            )}

            {/* 10 — FOTO QALEREYA */}
            {canShowGallery && (
              <section id="gallery-section" style={{ padding: '0 28px 34px' }}>
                <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                  <div style={{
                    background: '#FFFFFF', border: `1px solid ${TH.primary}38`, borderRadius: 18,
                    padding: 22, textAlign: 'center',
                  }}>
                    <SectionHead kicker="Gallery" title={tr.inv_gallery} align="center" />

                    {gallery.demoPhotos.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 18 }}>
                        {gallery.demoPhotos.map((url, i) => (
                          <div key={i} style={{ aspectRatio: '3/2', overflow: 'hidden', background: '#EFE7DE', borderRadius: 6 }}>
                            <img src={url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{
                      width: 128, height: 128, margin: '16px auto 0', borderRadius: 14,
                      background: TH.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <QRCodeSVG value={gallery.photoShareUrl} size={104} bgColor="transparent" fgColor={TH.text} level="M" />
                    </div>
                    <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: '#A79C90', marginTop: 12 }}>
                      {tr.inv_scan_upload}
                    </div>

                    <a data-press href={gallery.photoShareUrl} style={{ ...pill(true), marginTop: 14, padding: 13 }}>
                      📷 {tr.inv_gallery_btn}
                    </a>
                    {/* ⚠ Phase 27: "Masa kartını yüklə" tamamilə silindi (QR + foto paylaşımı qalır) */}

                    <div style={{ fontSize: 12.5, color: TH.muted, marginTop: 14, lineHeight: 1.8 }}>
                      {tr.inv_gallery_desc}
                    </div>
                  </div>
                </Reveal>
              </section>
            )}

            {/* 11 — RSVP */}
            {canShowRsvp && (
              <section style={{ padding: '36px 28px 56px', background: TH.surface }}>
                <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.primary }}>
                    <span style={{ width: 22, height: 1, background: `${TH.primary}99` }} />RSVP
                    <span style={{ width: 22, height: 1, background: `${TH.primary}99` }} />
                  </div>
                  <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(24px,7vw,28px)', color: TH.text, marginTop: 12, lineHeight: 1.3 }}>
                    {rsvp.labels.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: TH.muted, margin: '10px 0 20px' }}>{rsvp.labels.subtitle}</div>

                  {rsvp.rsvpClosed && !rsvp.submitted ? (
                    <div style={{ background: '#FFFFFF', border: `1px solid ${TH.primary}33`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
                      <div style={{ fontFamily: serif, fontSize: 18, color: TH.text }}>{tr.rsvp_closed_title}</div>
                      <div style={{ fontSize: 11, color: TH.muted, marginTop: 6 }}>{tr.rsvp_closed_desc}</div>
                    </div>
                  ) : rsvp.alreadyDone ? (
                    <div style={{ background: '#FFFFFF', border: `1px solid ${TH.accent}4D`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
                      <div style={{ fontFamily: serif, fontSize: 18, color: TH.text }}>{rsvp.labels.already_done}</div>
                      <div style={{ fontSize: 11, color: TH.muted, marginTop: 6 }}>{rsvp.selected?.full_name}</div>
                    </div>
                  ) : rsvp.submitted ? (
                    <div style={{ background: '#FFFFFF', border: `1px solid ${TH.primary}4D`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
                      <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 20, color: TH.text }}>{rsvp.thanksMsg}</div>
                      <div style={{ fontSize: 11, color: TH.muted, marginTop: 6 }}>{rsvp.labels.thanks_sub}</div>
                    </div>
                  ) : (
                    <form onSubmit={rsvp.handleSubmit}>
                      {/* Ad / qonaq axtarışı */}
                      <div style={{ marginBottom: 12 }}>
                        <input
                          ref={rsvpInputRef}
                          type="text"
                          value={rsvp.query}
                          onChange={(e) => { rsvp.setQuery(e.target.value); rsvp.setActiveIdx(-1); if (rsvp.selected) rsvp.setSelected(null) }}
                          onKeyDown={rsvp.onKeyDown}
                          placeholder={rsvp.labels.namePh}
                          required={!rsvp.useGuestMode}
                          autoComplete="off"
                          style={{
                            width: '100%', background: '#FFFFFF', border: `1px solid ${TH.primary}40`,
                            borderRadius: 100, padding: '14px 18px', fontSize: 13, color: TH.text,
                            fontFamily: sans, outline: 'none',
                          }}
                        />
                        {rsvp.suggestions.length > 0 && (
                          /* flow-da qalır — RSVP formunu aşağı sürüşdürür, örtmür */
                          <ul role="listbox" style={{
                            listStyle: 'none', margin: '8px 0 0', padding: 4,
                            background: '#FFFFFF', border: `1px solid ${TH.primary}40`, borderRadius: 16,
                            boxShadow: '0 6px 18px rgba(62,74,58,0.10)', maxHeight: 260, overflowY: 'auto',
                          }}>
                            {rsvp.suggestions.map((g, i) => (
                              <li
                                key={g.id ?? `${g.full_name}-${i}`}
                                role="option"
                                aria-selected={i === rsvp.activeIdx}
                                onMouseEnter={() => rsvp.setActiveIdx(i)}
                                onMouseDown={(e) => { e.preventDefault(); rsvp.pick(g) }}
                                style={{
                                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                                  padding: '12px 14px', cursor: 'pointer', borderRadius: 12,
                                  background: i === rsvp.activeIdx ? `${TH.primary}14` : 'transparent',
                                }}
                              >
                                <span style={{ fontSize: 13, color: TH.text }}>{g.full_name}</span>
                                <span style={{ fontSize: 10, letterSpacing: '.12em', color: TH.primary }}>{g.table_id}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {rsvp.showNotFound && (
                          <div style={{ fontSize: 10, color: TH.accent, marginTop: 6 }}>{rsvp.labels.not_in_list}</div>
                        )}
                      </div>

                      {/* Status düymələri */}
                      <Stagger base={220} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[
                          { val: 'yes',   label: rsvp.labels.yes,   bg: TH.accent },
                          { val: 'no',    label: rsvp.labels.no,    bg: null },
                          { val: 'maybe', label: rsvp.labels.maybe, bg: null },
                        ].map(({ val, label, bg }) => {
                          const active = rsvp.status === val
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => rsvp.chooseStatus(val)}
                              data-press
                              style={{
                                flex: '1 1 40%', minHeight: 48, borderRadius: 100, cursor: 'pointer',
                                padding: '14px 8px', fontSize: 10.5, letterSpacing: '.12em',
                                textTransform: 'uppercase', fontFamily: sans,
                                background: active ? (bg || TH.primary) : '#FFFFFF',
                                color: active ? '#FFFFFF' : '#6B6359',
                                border: active ? '1px solid transparent' : `1px solid ${TH.primary}59`,
                              }}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </Stagger>

                      {/* Əlavə qonaq */}
                      {rsvp.status === 'yes' && (
                        <div style={{
                          marginTop: 12, background: '#FFFFFF', border: `1px solid ${TH.primary}40`,
                          borderRadius: 16, padding: 20, textAlign: 'center',
                        }}>
                          <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.muted }}>
                            {rsvp.labels.plusq}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, marginTop: 16 }}>
                            <button type="button" onClick={rsvp.decPlusOne} disabled={rsvp.plusOne === 0} data-press aria-label="Azalt"
                              style={{ width: 40, height: 40, border: `1px solid ${TH.primary}4D`, borderRadius: '50%', background: 'none', color: TH.muted, cursor: 'pointer', opacity: rsvp.plusOne === 0 ? .35 : 1 }}>
                              −
                            </button>
                            <span style={{ fontFamily: serif, fontSize: 34, color: TH.text, width: 40, fontVariantNumeric: 'tabular-nums' }}>
                              {rsvp.plusOne}
                            </span>
                            <button type="button" onClick={rsvp.incPlusOne} disabled={rsvp.plusOne === rsvp.maxExtraGuests} data-press aria-label="Artır"
                              style={{ width: 40, height: 40, border: `1px solid ${TH.primary}4D`, borderRadius: '50%', background: 'none', color: TH.primary, cursor: 'pointer', opacity: rsvp.plusOne === rsvp.maxExtraGuests ? .35 : 1 }}>
                              +
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={!rsvp.canSubmit}
                        data-press
                        style={{
                          marginTop: 12, width: '100%', minHeight: 50, borderRadius: 100, border: 'none',
                          background: TH.primary, color: TH.background, cursor: rsvp.canSubmit ? 'pointer' : 'not-allowed',
                          fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', fontFamily: sans,
                          opacity: rsvp.canSubmit ? 1 : .35,
                        }}
                      >
                        {rsvp.sending ? '…' : rsvp.labels.send}
                      </button>
                    </form>
                  )}

                  {/* ⚠ Phase 27: RSVP statistika paneli SİLİNDİ — qonaq digər
                      qonaqların cavablarını görməməlidir. Hesablama hook-da
                      qalır (API dəyişmir), sadəcə render olunmur. */}
                </Reveal>
              </section>
            )}

            {/* 12 — QONAQ DƏFTƏRİ */}
            <section style={{ padding: '34px 28px' }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="Guestbook" title={gbook.labels.title} />

                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
                  <input
                    type="text"
                    value={gbook.name}
                    onChange={(e) => gbook.setName(e.target.value)}
                    placeholder={gbook.labels.namePh}
                    style={{
                      background: '#FFFFFF', border: `1px solid ${TH.primary}40`, borderRadius: 100,
                      padding: '13px 18px', fontSize: 13, color: TH.text, fontFamily: sans, outline: 'none',
                    }}
                  />
                  <textarea
                    value={gbook.text}
                    onChange={(e) => gbook.setText(e.target.value)}
                    placeholder={gbook.labels.msgPh}
                    rows={3}
                    style={{
                      background: '#FFFFFF', border: `1px dashed ${TH.primary}66`, borderRadius: 16,
                      padding: '14px 18px', fontSize: 13, color: TH.text, fontFamily: sans,
                      outline: 'none', resize: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!gbook.canSubmit}
                    data-press
                    style={{
                      minHeight: 46, borderRadius: 100, border: 'none', background: TH.primary,
                      color: TH.background, cursor: gbook.canSubmit ? 'pointer' : 'not-allowed',
                      fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', fontFamily: sans,
                      opacity: gbook.canSubmit ? 1 : .35,
                    }}
                  >
                    {gbook.sending ? gbook.labels.sending : gbook.labels.btn}
                  </button>
                </form>

                <Stagger base={110} style={{ display: 'grid', gap: 10 }}>
                  {gbook.messages.map((raw, i) => {
                    const m = gbook.readMessage(raw)
                    return (
                      <div key={m.name + i} style={{ background: TH.surface, borderRadius: 16, padding: 18 }}>
                        <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: '#4A4139', lineHeight: 1.65 }}>
                          “{m.text}”
                        </div>
                        <div style={{ fontSize: 11, color: TH.muted, marginTop: 8 }}>
                          — {m.name}{m.date ? ` · ${gbook.formatDate(m.date)}` : ''}
                        </div>
                      </div>
                    )
                  })}
                </Stagger>
              </Reveal>
            </section>

            {/* 12.5 — SİFARİŞ CTA (yalnız builder önbaxışında; şərt komponentin içindədir) */}
            <OrderCta
              theme={TH} weddingData={weddingData} lang={lang}
              pageSlug={gallery.pageSlug} isDemoMode={isDemoMode}
              effectiveSlug={gallery.effectiveSlug} serif={serif}
            />

            {/* 13 — SON HİSSƏ: demo CTA + footer (9 şablonun ortağı) */}
            <TemplateOutro
              theme={TH} weddingData={weddingData} lang={lang}
              isDemoMode={isDemoMode} isCouple={isCouple} isCorp={isCorp}
              eventLabel={eventLabel} serif={serif}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
