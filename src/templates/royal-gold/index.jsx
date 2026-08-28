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
import { Reveal, Stagger, PopDigit, enterDirection, AmbientLayer } from '../_shared/motion'
import { hidePhoto } from '../../utils/photoGallery'
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
   ROYAL GOLD LUXURY — Claude Design "Digitoy Templates.dc.html" · t1

   Design story: klassik Bakı toyunun rəqəmsal versiyası. Qonağı əvvəlcə
   möhürlənmiş zərf qarşılayır — dəvətnamə "açılır", göstərilmir.
   Palitra: tünd fon (#0B0906) üzərində qızıl (#C5A059) / şampan (#E8D5A3).
   Tipoqrafika: Cormorant Garamond 300 + DM Sans.

   ⚠ Bu, Digitoy-un KÖHNƏ default dəvətnaməsi DEYİL — o, `simple-luxury`
   şablonudur. Royal Gold ayrıca premium dizayndır.

   ⚠ Bu fayl YALNIZ UI qatıdır — bütün biznes məntiqi hook-lardadır.
   Bölmə sırası design faylındakı "Struktur" leqendası ilə eynidir (13 bölmə).
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('royal-gold')
const DEFAULT_MUSIC = buildPresetMusic(PRESET_TRACKS[0], { playMode: MUSIC_PLAY_MODES.AUTO })

const serif = TH.fonts.heading
const sans  = TH.fonts.body

/* Şablona məxsus keyframe-lər — qlobal CSS-ə toxunmur, prefiks `rg-` */
const KEYFRAMES = `
@keyframes rg-eq     { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }

/* «Açılış Ekranı düzəliş V1» — lövhə + möhür ardıcıllığı */
@keyframes rg-veil       { from { opacity:1 } to { opacity:0 } }
@keyframes rg-rise       { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }
@keyframes rg-drawx      { from { transform:scaleX(0) } to { transform:scaleX(1) } }
@keyframes rg-frame      { from { transform:scaleY(0) } to { transform:scaleY(1) } }
@keyframes rg-letter     { from { opacity:0; transform:translateY(26px) rotateX(52deg); filter:blur(7px) } to { opacity:1; transform:none; filter:blur(0) } }
@keyframes rg-cta        { from { opacity:0; transform:translateY(16px) scale(.94) } to { opacity:1; transform:none } }
@keyframes rg-cta-glow   { 0%,100% { box-shadow: 0 0 0 0 ${TH.primary}00 } 50% { box-shadow: 0 0 28px 2px ${TH.primary}47 } }
@keyframes rg-gleam      { 0% { transform:translateX(-140%) skewX(-18deg); opacity:0 } 22% { opacity:.9 } 100% { transform:translateX(300%) skewX(-18deg); opacity:0 } }
@keyframes rg-stamp      { 0% { opacity:0; transform:translate(-50%,-50%) scale(2.6) rotate(-14deg) } 55% { opacity:1 } 70% { transform:translate(-50%,-50%) scale(.94) rotate(0) } 82% { transform:translate(-50%,-50%) scale(1.05) } 100% { opacity:1; transform:translate(-50%,-50%) scale(1) rotate(0) } }
@keyframes rg-shock      { 0% { opacity:0; transform:translate(-50%,-50%) scale(.3) } 12% { opacity:.85 } 100% { opacity:0; transform:translate(-50%,-50%) scale(3.1) } }
@keyframes rg-shadowgrow { from { opacity:0; transform:translateX(-50%) scaleX(.4) } to { opacity:1; transform:translateX(-50%) scaleX(1) } }
@keyframes rg-dust       { 0% { transform:translate3d(0,14px,0); opacity:0 } 18% { opacity:.85 } 100% { transform:translate3d(-16px,-120px,0); opacity:0 } }
@keyframes rg-halo2      { 0%,100% { opacity:.22; transform:translate(-50%,-50%) scale(1) } 50% { opacity:.5; transform:translate(-50%,-50%) scale(1.1) } }
@keyframes rg-slowring   { from { transform:translate(-50%,-50%) rotate(0) } to { transform:translate(-50%,-50%) rotate(360deg) } }

/* Daxili arxa fon (ambient) */
@keyframes rg-wander     { 0%,100% { transform:translate3d(0,0,0) } 33% { transform:translate3d(26px,-34px,0) } 66% { transform:translate3d(-22px,20px,0) } }
@keyframes rg-up         { 0% { transform:translate3d(0,110%,0); opacity:0 } 12% { opacity:1 } 100% { transform:translate3d(-18px,-20%,0); opacity:0 } }
@keyframes rg-hint   { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes rg-halo   { 0% { box-shadow: 0 0 0 6px ${TH.primary}24, 0 0 0 14px ${TH.primary}12 } 100% { box-shadow: 0 0 0 14px ${TH.primary}00, 0 0 0 26px ${TH.primary}00 } }
@keyframes rg-sweep  { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
@media (prefers-reduced-motion: reduce) {
  [data-rg] *, [data-rg] { animation: none !important; transition: none !important; }
}
`

/* ── Daxili arxa fon — «Açılış Ekranı düzəliş V1» ────────────────────────────
   Design t1-də dəvətnamənin fonu düz rəng deyil: iki nəhəng qızıl işıq ləkəsi
   çox yavaş gəzişir, aşağıdan qızıl qığılcımlar qalxır. Qat `screen` blend
   ilə məzmunun ÜSTÜNDƏDİR — səhifəni işıqlandırır, örtmür.
   ⚠ zIndex 3: məzmundan yuxarı, amma başlıq/düymələrdən aşağı. */
const SPARKS = [
  { left: '10%', dur: 13, delay: 0 },
  { left: '24%', dur: 10, delay: 2.4 },
  { left: '41%', dur: 15, delay: 5.1 },
  { left: '58%', dur: 11.5, delay: 7.6 },
  { left: '73%', dur: 14, delay: 3.3 },
  { left: '89%', dur: 12, delay: 9.2 },
]

function GoldLights() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <span style={{
        position: 'absolute', left: '-16%', top: '4%', width: '68%', height: '36%', borderRadius: '50%',
        background: `radial-gradient(circle, ${TH.primary}6B, transparent 68%)`,
        filter: 'blur(36px)', animation: 'rg-wander 17s ease-in-out infinite',
      }} />
      <span style={{
        position: 'absolute', right: '-20%', bottom: '10%', width: '60%', height: '32%', borderRadius: '50%',
        background: `radial-gradient(circle, ${TH.accent}4D, transparent 70%)`,
        filter: 'blur(40px)', animation: 'rg-wander 22s ease-in-out 6s infinite reverse',
      }} />
      {SPARKS.map((s, i) => (
        <span key={i} style={{
          position: 'absolute', left: s.left, bottom: '-4%', width: 2, height: 2, borderRadius: '50%',
          background: TH.accent, boxShadow: `0 0 7px ${TH.accent}E6`,
          animation: `rg-up ${s.dur}s linear ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  )
}

/* Mərkəzləşdirilmiş bölmə başlığı */
function SectionHead({ kicker, title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.primary }}>
        {kicker}
      </div>
      <div style={{
        fontFamily: serif, fontWeight: 300, fontSize: 'clamp(22px,6vw,26px)',
        color: TH.accent, marginTop: 6, lineHeight: 1.25,
      }}>
        {title}
      </div>
      {sub && <div style={{ fontSize: 11, color: TH.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

/* Qızıl ornament sətri — romb + solub gedən xətlər */
function GoldOrnament() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '22px 0' }}>
      <span style={{ width: 52, height: 1, background: `linear-gradient(90deg, transparent, ${TH.primary}73)` }} />
      <span style={{ width: 4, height: 4, background: `${TH.primary}99`, transform: 'rotate(45deg)' }} />
      <span style={{ width: 6, height: 6, border: `1px solid ${TH.primary}80`, transform: 'rotate(45deg)' }} />
      <span style={{ width: 4, height: 4, background: `${TH.primary}99`, transform: 'rotate(45deg)' }} />
      <span style={{ width: 52, height: 1, background: `linear-gradient(270deg, transparent, ${TH.primary}73)` }} />
    </div>
  )
}

const btn = (filled) => ({
  flex: 1, textAlign: 'center', padding: '12px 6px',
  fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase',
  fontFamily: sans, cursor: 'pointer', textDecoration: 'none', display: 'block',
  background: filled ? TH.primary : 'transparent',
  color: filled ? '#1A1408' : TH.accent,
  border: filled ? '1px solid transparent' : `1px solid ${TH.primary}4D`,
})

const sectionBorder = { borderBottom: `1px solid ${TH.primary}1A` }

/* ═══════════════════════════════════════════════════════════════════════════
   01 — AÇILIŞ: qızıl lövhə + mum möhür («Açılış Ekranı düzəliş V1»)

   Design t1 açılışı artıq zərf deyil — DİVARDAN ASILMIŞ QIZIL LÖVHƏDİR.
   Ardıcıllıq bir mərasim kimi gedir: pərdə əriyir → künc bucaqları düşür →
   lövhənin çərçivəsi əvvəl üfüqi, sonra şaquli çəkilir → mum möhür yuxarıdan
   basılır (zərbə dalğası ilə) → adlar hərf-hərf qalxır → CTA parıldayır.

   ⚠ `onOpenStart` MÜTLƏQ toxunuş hadisəsinin içində çağırılır (musiqi).
   ═══════════════════════════════════════════════════════════════════════════ */

/* Toy ilinin roma rəqəmi — lövhənin üstündəki «Anno» yazısı üçün. */
function roman(year) {
  const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let n = Number(year) || 0
  if (n < 1 || n > 3999) return ''
  return map.reduce((out, [v, s]) => { while (n >= v) { out += s; n -= v } return out }, '')
}

/* Qızıl toz — aşağıdan yuxarı süzülən yeddi zərrəcik (deterministik) */
const DUST = [
  { left: '22%', top: '78%', dur: 9.5, delay: 0 },
  { left: '38%', top: '92%', dur: 11, delay: 1.6 },
  { left: '58%', top: '70%', dur: 8.5, delay: 3.1 },
  { left: '74%', top: '88%', dur: 12, delay: 4.4 },
  { left: '88%', top: '64%', dur: 10, delay: 2.2 },
  { left: '12%', top: '60%', dur: 11.5, delay: 5.6 },
  { left: '66%', top: '96%', dur: 9, delay: 6.8 },
]

/* Ornament sətri — solub gedən xətlər və ortada qızıl ulduz */
function GoldStarRule({ width = 34, delay = 0, style = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
      animation: `rg-rise .8s ease-out ${delay}s both`, ...style,
    }}>
      <span style={{ width, height: 1, background: `linear-gradient(90deg, transparent, ${TH.primary})` }} />
      <svg viewBox="0 0 12 12" width="7" height="7" aria-hidden="true">
        <path d="M6 0 L7.6 4.4 L12 6 L7.6 7.6 L6 12 L4.4 7.6 L0 6 L4.4 4.4 Z" fill={TH.primary} />
      </svg>
      <span style={{ width, height: 1, background: `linear-gradient(90deg, ${TH.primary}, transparent)` }} />
    </div>
  )
}

function SealedEnvelope({ weddingData, isCouple, isCorp, eventLabel, onOpen, onOpenStart }) {
  const [opening, setOpening] = useState(false)
  const [gone, setGone] = useState(false)

  const first = isCouple ? (weddingData.groomName || '') : (weddingData.eventName || weddingData.brideName || '')
  const second = isCouple ? (weddingData.brideName || '') : ''

  const monogram = isCouple
    ? `${(weddingData.groomName || '?')[0]}&${(weddingData.brideName || '?')[0]}`.toLocaleUpperCase('az')
    : ((weddingData.eventName || weddingData.brideName || '·')[0] || '·').toLocaleUpperCase('az')

  const anno = roman((weddingData.date || '').slice(0, 4))
  const place = weddingData.venueName ? String(weddingData.venueName).split(',').pop().trim() : ''

  const start = () => {
    if (opening) return
    unlockAudio()
    /* ⚠ Musiqi toxunuş hadisəsinin İÇİNDƏ başlayır — `onOpen` 1.4s sonra
       gəlir və o vaxt brauzerin jest pəncərəsi bağlı olur. */
    onOpenStart?.()
    setOpening(true)
    setTimeout(() => { setGone(true); onOpen() }, 1400)
  }

  if (gone) return null

  /* Künc bucağı — dördü ardıcıl düşür */
  const bracket = (pos, delay) => ({
    position: 'absolute', width: 30, height: 30, pointerEvents: 'none',
    ...pos, animation: `rg-rise .7s ease-out ${delay}s both`,
  })

  return (
    <motion.div
      onClick={start}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start() } }}
      aria-label={isCorp ? 'Dəvətnaməni aç' : 'Möhürü aç'}
      data-rg
      animate={opening ? { opacity: 0, scale: 1.06 } : {}}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        background: `radial-gradient(120% 82% at 50% 26%, #211906, ${TH.background} 74%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: sans, padding: '0 clamp(20px, 7vw, 30px)', textAlign: 'center',
        perspective: 1100, isolation: 'isolate',
      }}
    >
      {/* Pərdə — ekran örtülü başlayır, sonra əriyir */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: 0, background: '#0A0805', pointerEvents: 'none', zIndex: 2,
        animation: 'rg-veil 1s ease-out .1s both',
      }} />

      {/* Halo + çox yavaş dönən halqa */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%,-50%)',
        width: 'min(92vw, 340px)', height: 'min(92vw, 340px)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: -1, filter: 'blur(30px)',
        background: `radial-gradient(circle, ${TH.primary}52, transparent 68%)`,
        animation: 'rg-halo2 9s ease-in-out 1s infinite',
      }} />
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%,-50%)',
        width: 'min(76vw, 268px)', height: 'min(76vw, 268px)', borderRadius: '50%',
        border: `1px solid ${TH.primary}42`, pointerEvents: 'none', zIndex: -1,
        animation: 'rg-slowring 96s linear infinite',
      }} />

      {/* Qızıl toz */}
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1 }}>
        {DUST.map((d, i) => (
          <span key={i} style={{
            position: 'absolute', left: d.left, top: d.top, width: 2, height: 2, borderRadius: '50%',
            background: TH.accent, opacity: 0, boxShadow: `0 0 6px ${TH.accent}CC`,
            animation: `rg-dust ${d.dur}s linear ${d.delay}s infinite`,
          }} />
        ))}
      </span>

      {/* Ekran çərçivəsi — iki üfüqi xətt və dörd künc bucağı */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: 18, right: 18, top: 18, height: 1, pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent, ${TH.primary}8C, transparent)`,
        transformOrigin: '50% 50%', animation: 'rg-drawx 1.1s cubic-bezier(.22,.61,.36,1) .5s both',
      }} />
      <span aria-hidden="true" style={{
        position: 'absolute', left: 18, right: 18, bottom: 18, height: 1, pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent, ${TH.primary}8C, transparent)`,
        transformOrigin: '50% 50%', animation: 'rg-drawx 1.1s cubic-bezier(.22,.61,.36,1) .5s both',
      }} />
      <span aria-hidden="true" style={bracket({ left: 18, top: 18, borderTop: `1px solid ${TH.primary}80`, borderLeft: `1px solid ${TH.primary}80` }, 1.2)} />
      <span aria-hidden="true" style={bracket({ right: 18, top: 18, borderTop: `1px solid ${TH.primary}80`, borderRight: `1px solid ${TH.primary}80` }, 1.3)} />
      <span aria-hidden="true" style={bracket({ left: 18, bottom: 18, borderBottom: `1px solid ${TH.primary}80`, borderLeft: `1px solid ${TH.primary}80` }, 1.4)} />
      <span aria-hidden="true" style={bracket({ right: 18, bottom: 18, borderBottom: `1px solid ${TH.primary}80`, borderRight: `1px solid ${TH.primary}80` }, 1.5)} />

      <motion.div
        animate={opening ? { opacity: 0, y: 22 } : {}}
        transition={{ duration: 0.7, delay: opening ? 0.3 : 0, ease: 'easeInOut' }}
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* Kicker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, animation: 'rg-rise .9s cubic-bezier(.22,.61,.36,1) .85s both' }}>
          <span style={{ width: 22, height: 1, background: `${TH.primary}80` }} />
          <span style={{ fontSize: 9.5, letterSpacing: '.42em', textTransform: 'uppercase', color: TH.muted, whiteSpace: 'nowrap' }}>
            {eventLabel}
          </span>
          <span style={{ width: 22, height: 1, background: `${TH.primary}80` }} />
        </div>

        {/* Qızıl lövhə — çərçivə çəkilir, möhür basılır */}
        <div style={{
          position: 'relative', width: 214, height: 168, maxWidth: '70vw', marginTop: 30,
          animation: 'rg-rise 1s cubic-bezier(.22,.61,.36,1) 1s both',
        }}>
          <span aria-hidden="true" style={{
            position: 'absolute', left: '50%', bottom: -16, width: 170, height: 12, transform: 'translateX(-50%)',
            background: 'radial-gradient(ellipse, rgba(0,0,0,.65), transparent 70%)',
            animation: 'rg-shadowgrow 1s ease-out 1.6s both',
          }} />

          {/* Üfüqi kənarlar */}
          <span aria-hidden="true" style={{
            position: 'absolute', left: 0, right: 0, top: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${TH.primary}, transparent)`,
            transformOrigin: '50% 50%', animation: 'rg-drawx 1.1s cubic-bezier(.22,.61,.36,1) 1.2s both',
          }} />
          <span aria-hidden="true" style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${TH.primary}, transparent)`,
            transformOrigin: '50% 50%', animation: 'rg-drawx 1.1s cubic-bezier(.22,.61,.36,1) 1.2s both',
          }} />
          {/* Şaquli kənarlar — üfüqidən sonra */}
          <span aria-hidden="true" style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, width: 1,
            background: `linear-gradient(180deg, transparent, ${TH.primary}D9, transparent)`,
            transformOrigin: '50% 50%', animation: 'rg-frame 1.1s cubic-bezier(.22,.61,.36,1) 1.55s both',
          }} />
          <span aria-hidden="true" style={{
            position: 'absolute', top: 0, bottom: 0, right: 0, width: 1,
            background: `linear-gradient(180deg, transparent, ${TH.primary}D9, transparent)`,
            transformOrigin: '50% 50%', animation: 'rg-frame 1.1s cubic-bezier(.22,.61,.36,1) 1.55s both',
          }} />

          <span aria-hidden="true" style={{
            position: 'absolute', inset: 9, border: `1px solid ${TH.primary}38`,
            animation: 'rg-rise .9s ease-out 2s both',
          }} />

          {/* Lövhənin içi + üzərindən keçən işıq */}
          <span aria-hidden="true" style={{
            position: 'absolute', inset: 1, overflow: 'hidden',
            background: 'linear-gradient(158deg, rgba(48,38,20,.55), rgba(16,12,7,.55))',
          }}>
            <span style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '34%',
              background: `linear-gradient(90deg, ${TH.accent}2E, transparent)`,
              animation: 'rg-gleam 6.5s ease-in-out 3.4s infinite',
            }} />
          </span>

          {anno && (
            <div style={{
              position: 'absolute', left: 0, right: 0, top: 22,
              fontSize: 9, letterSpacing: '.42em', textTransform: 'uppercase',
              color: `${TH.accent}99`, whiteSpace: 'nowrap',
              animation: 'rg-rise .9s ease-out 2.3s both',
            }}>
              Anno {anno}
            </div>
          )}

          {/* Zərbə dalğası — möhür düşəndən bir az sonra */}
          <span aria-hidden="true" style={{
            position: 'absolute', left: '50%', top: '50%', width: 78, height: 78,
            transform: 'translate(-50%,-50%)', borderRadius: '50%',
            border: `1px solid ${TH.primary}59`, pointerEvents: 'none',
            animation: 'rg-shock 1.5s ease-out 2.5s both',
          }} />

          {/* Mum möhür — yuxarıdan basılır */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%', width: 58, height: 58,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(circle at 34% 28%, #E2BE79, #8A6A2E 72%, #6A4F1E)',
            fontFamily: serif, fontSize: 17, letterSpacing: '.04em', color: '#2A1F0C',
            boxShadow: '0 10px 26px rgba(0,0,0,.6), inset 0 1px 2px rgba(255,236,190,.55)',
            animation: 'rg-stamp 1.05s cubic-bezier(.3,1.5,.4,1) 2.2s both',
          }}>
            {monogram}
          </div>

          <GoldStarRule width={20} delay={3.4} style={{ position: 'absolute', left: 0, right: 0, bottom: 22, gap: 7 }} />
        </div>

        {/* Adlar — hər söz ayrıca qalxır */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 11, marginTop: 38,
          fontFamily: serif, fontWeight: 300, fontSize: 'clamp(26px, 9vw, 34px)', color: TH.accent, lineHeight: 1,
        }}>
          <span style={{ display: 'inline-block', animation: 'rg-letter .95s cubic-bezier(.22,.61,.36,1) 3.9s both' }}>{first}</span>
          {second && (
            <>
              <span style={{ display: 'inline-block', fontSize: 'clamp(17px, 6vw, 22px)', color: TH.primary, animation: 'rg-letter .95s cubic-bezier(.22,.61,.36,1) 4.1s both' }}>&amp;</span>
              <span style={{ display: 'inline-block', animation: 'rg-letter .95s cubic-bezier(.22,.61,.36,1) 4.3s both' }}>{second}</span>
            </>
          )}
        </div>

        <GoldStarRule delay={4.6} style={{ marginTop: 16 }} />

        <div style={{
          fontSize: 10.5, letterSpacing: '.24em', textTransform: 'uppercase', color: TH.muted, marginTop: 14,
          animation: 'rg-rise .8s ease-out 4.8s both',
        }}>
          {[formatFullDateByLang(weddingData.date, 'az'), place].filter(Boolean).join(' · ')}
        </div>

        {/* CTA — parıldayan qızıl həlqə */}
        <div style={{
          position: 'relative', overflow: 'hidden', marginTop: 40,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          border: `1px solid ${TH.primary}80`, borderRadius: 100, padding: '14px 26px',
          fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase',
          color: '#F2E4BE', background: `${TH.primary}1A`,
          animation: 'rg-cta .9s cubic-bezier(.22,.61,.36,1) 5.1s both, rg-cta-glow 3.6s ease-in-out 6s infinite',
        }}>
          <span aria-hidden="true" style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, width: '38%',
            background: 'linear-gradient(90deg, transparent, rgba(255,240,205,.3), transparent)',
            animation: 'rg-gleam 4.4s ease-in-out 6.2s infinite',
          }} />
          <span style={{ position: 'relative' }}>{isCorp ? 'Dəvətnaməni aç' : 'Dəvəti aç'}</span>
          <span style={{ position: 'relative' }}>→</span>
        </div>
      </motion.div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 32, textAlign: 'center',
        fontSize: 10.5, letterSpacing: '.2em', color: `${TH.muted}BF`,
        animation: 'rg-rise .8s ease-out 5.6s both, rg-hint 2.8s ease-in-out 6.4s infinite',
      }}>
        toxunun
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   03 — MUSİQİ: hero-nun sağ küncündə qızıl ekvalayzer dairəsi
   ═══════════════════════════════════════════════════════════════════════════ */
function GoldMusic({ lang, music, playerRef, visible = false, autoPlay = false }) {
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
          border: `1px solid ${TH.primary}59`, background: `${TH.primary}1A`,
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
          cursor: 'pointer',
        }}
      >
        {[0, 0.18, 0.36].map((d) => (
          <span key={d} style={{
            width: 2, height: 12, background: playing ? TH.primary : `${TH.muted}99`,
            transformOrigin: 'bottom', display: 'block',
            animation: playing ? `rg-eq 1s ease-in-out ${d}s infinite` : 'none',
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
export default function RoyalGoldTemplate({
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

  const activePkgId = isDemoMode ? 'PREMIUM' : (weddingData.package || 'SADE')
  const { allowRsvp: canShowRsvp, allowSeating: canShowSeating, allowGallery: canShowGallery } = getPackageGates(activePkgId)

  /* ── Hook-lar: bütün biznes məntiqi ── */
  const cd       = useCountdown({ date: weddingData.date, time: weddingData.time, lang, eventType: weddingData.eventType, eventName: weddingData.eventName })
  const timeline = useTimeline({ lang, eventType: weddingData.eventType, programSteps: weddingData.programSteps })
  const { inputRef: seatInputRef, ...seating } = useSeating({ seatingPlan: weddingData.seatingPlan, lang })
  const { inputRef: rsvpInputRef, ...rsvp }    = useRsvp({ lang, weddingData })
  const gbook    = useGuestbook({ lang, initialMessages: initialGuestbook })
  const gallery  = useGallery({ weddingData, isCouple, isCorp })

  useEffect(() => {
    if (!isDemoMode) trackEvent('invitation_opened', { lang, event_type: weddingData?.eventType })
  }, [])

  const { formattedDate, dayName } = formatAzDate(weddingData.date, lang)

  return (
    <div
      data-rg
      data-enter={enterDirection('royal-gold')}
      style={{
        background: TH.background, minHeight: '100vh', fontFamily: sans, color: TH.text,
        overflowX: 'hidden', position: 'relative',
        /* ⚠ ambient qatının `screen` blend-ini bu kökə bağlayır — olmasa
           blend səhifədən kənara (body) sızır. */
        isolation: 'isolate',
        '--tpl-glow': `${TH.primary}47`,
      }}
    >
      <style>{KEYFRAMES}</style>

      {/* 01 — ZƏRF AÇILIŞI */}
      {!opened && (
        <SealedEnvelope
          weddingData={weddingData}
          isCouple={isCouple}
          isCorp={isCorp}
          eventLabel={eventLabel}
          onOpen={() => setOpened(true)}
          onOpenStart={autoPlay ? () => musicRef.current?.play() : undefined}
        />
      )}

      {/* Qızıl işıq ləkələri scroll-a əks istiqamətdə sürüşür (parallaks).
          ⚠ `translate` yazılır — ləkələrin öz `rg-wander` transform animasiyası
          toxunulmaz qalır.
          ⚠ Qat məzmunun üstündədir (zIndex 3), amma `mix-blend-mode` YOXDUR —
          bax motion.jsx › AmbientLayer: blend bütün ekranın hər kadrda yenidən
          çəkilməsinə səbəb olurdu. Fon onsuz da tünddür, `screen` ilə adi alfa
          arasında göz fərq görmür. */}
      {opened && (
        <AmbientLayer>
          <GoldLights />
        </AmbientLayer>
      )}
      {/* 03 — MUSİQİ TOGGLE */}
      <GoldMusic lang={lang} music={invMusic} playerRef={musicRef} visible={opened} autoPlay={autoPlay} />

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* 02 — STICKY HEADER */}
            <header style={{
              position: 'sticky', top: 0, zIndex: 40, height: 52, padding: '0 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(11,9,6,0.88)', backdropFilter: 'blur(10px)',
              borderBottom: `1px solid ${TH.primary}29`,
            }}>
              <button
                onClick={onBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
                  fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: TH.muted,
                  cursor: 'pointer', fontFamily: sans, minHeight: 44, padding: '0 8px 0 0',
                }}
              >
                <span>←</span>{tr.btn_back}
              </button>
              <div style={{ fontFamily: serif, fontSize: 14, letterSpacing: '.06em' }}>
                <span style={{ color: TH.primary }}>Digitoy</span>
                <span style={{ color: `${TH.muted}73` }}>.az</span>
              </div>
              <LanguageSwitcher lang={lang} setLang={setLang} />
            </header>

            {/* 04 — HERO */}
            <section style={{
              position: 'relative', padding: '56px 26px 48px', textAlign: 'center',
              background: `radial-gradient(110% 70% at 50% 8%, #1A1409, ${TH.background} 70%)`,
              ...sectionBorder,
            }}>
              <span style={{ position: 'absolute', top: 14, left: 18, width: 34, height: 34, borderTop: `1px solid ${TH.primary}66`, borderLeft: `1px solid ${TH.primary}66` }} />
              <span style={{ position: 'absolute', top: 14, right: 18, width: 34, height: 34, borderTop: `1px solid ${TH.primary}66`, borderRight: `1px solid ${TH.primary}66` }} />

              <div style={{ maxWidth: 560, margin: '0 auto' }}>
                <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.primary, marginBottom: 14 }}>
                  {eventLabel}
                </div>
                <div style={{ fontFamily: serif, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.muted }}>
                  {tr.inv_join}
                </div>

                {/* Adlar — 6 s-lik qızıl sweep (design reveal) */}
                <h1 style={{
                  fontFamily: serif, fontWeight: 300, fontSize: 'clamp(38px,13vw,52px)',
                  lineHeight: 1.06, margin: '20px 0 6px',
                  background: `linear-gradient(100deg, ${TH.accent}, #FFFFFF 45%, ${TH.accent} 70%, ${TH.primary})`,
                  backgroundSize: '220%', WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent', color: TH.accent,
                  animation: 'rg-sweep 6s ease-in-out 1',
                }}>
                  {isCouple ? (
                    <>
                      {weddingData.groomName}
                      <span style={{ display: 'block', fontStyle: 'italic', fontSize: '.5em', color: TH.primary, WebkitTextFillColor: TH.primary, margin: '2px 0' }}>&</span>
                      {weddingData.brideName}
                    </>
                  ) : (weddingData.eventName || weddingData.brideName)}
                </h1>

                {isCorp && weddingData.organizer?.trim() && (
                  <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: `${TH.primary}B3`, marginTop: 10 }}>
                    {tr.organizer_display}: {weddingData.organizer}
                  </div>
                )}

                <GoldOrnament />

                <div style={{ fontSize: 13, color: '#B9A88F', letterSpacing: '.06em' }}>{formattedDate}</div>
                {dayName && (
                  <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: `${TH.primary}B3`, marginTop: 5 }}>{dayName}</div>
                )}
                {weddingData.time && (
                  <div style={{ fontSize: 13, color: '#B9A88F', marginTop: 5 }}>{formatTime24(weddingData.time)}</div>
                )}
                {weddingData.venueName && (
                  <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: `${TH.primary}B3`, marginTop: 18 }}>
                    {weddingData.venueName}
                  </div>
                )}

                <div style={{
                  margin: '34px auto 0', width: 44, height: 44, border: `1px solid ${TH.primary}40`,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, color: `${TH.primary}99`, animation: 'rg-hint 2.8s ease-in-out infinite',
                }}>⌄</div>
              </div>
            </section>

            {/* 05 — COUNTDOWN */}
            <section style={{ padding: '34px 26px', ...sectionBorder }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="Countdown" title={cd.title} />
                <Stagger base={55} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {[
                    { v: cd.days, l: cd.labels.days },
                    { v: cd.hours, l: cd.labels.hours },
                    { v: cd.minutes, l: cd.labels.minutes },
                    { v: cd.seconds, l: cd.labels.seconds, pop: true },
                  ].map(({ v, l, pop }) => (
                    <div key={l} style={{
                      background: `${TH.primary}0D`, border: `1px solid ${TH.primary}24`,
                      padding: '12px 4px', textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: serif, fontSize: 'clamp(22px,6vw,26px)', color: TH.accent, fontVariantNumeric: 'tabular-nums' }}>
                        {/* Yalnız saniyə xanası döyünür */}
                        <PopDigit value={v} pop={pop} />
                      </div>
                      <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: TH.muted, marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </Stagger>
              </Reveal>
            </section>

            {/* 06 — LOCATION */}
            <section style={{ padding: '34px 26px', ...sectionBorder }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="LOCATION" title={tr.inv_location} />
                {/* Hibrid xəritə — koordinat varsa OSM tile mozaikası,
                    yoxdursa köhnə abstrakt şəbəkə (heç vaxt boş blok olmur). */}
                <div style={{
                  background: 'radial-gradient(120% 120% at 50% 50%,#241C10,#120D07)',
                  border: `1px solid ${TH.primary}38`, position: 'relative', overflow: 'hidden',
                }}>
                  <MapMosaic
                    weddingData={weddingData}
                    theme={TH}
                    map={{ opacity: 0.55, filter: 'grayscale(1) brightness(.42) contrast(1.15)', tintOpacity: 0.4 }}
                    frame={<MapRings accent={TH.primary} />}
                  />
                  {!hasCoords && (
                    <div style={{
                      height: 'clamp(148px, 42vw, 168px)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', position: 'relative', overflow: 'hidden',
                    }}>
                      <span style={{
                        position: 'absolute', inset: 0, opacity: .2,
                        backgroundImage: `linear-gradient(${TH.primary}59 1px, transparent 1px), linear-gradient(90deg, ${TH.primary}59 1px, transparent 1px)`,
                        backgroundSize: '26px 26px',
                      }} />
                      <MapRings accent={TH.primary} />
                      <span style={{
                        width: 12, height: 12, borderRadius: '50%', background: TH.primary,
                        animation: 'rg-halo 4s ease-out infinite',
                      }} />
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: TH.text }}>
                  {weddingData.venueName}
                </div>
                {/* Məkan qeydi (zal/mərtəbə) — YALNIZ doludursa */}
                {weddingData.venueNote && (
                  <div style={{ textAlign: 'center', marginTop: 5, fontSize: 12, color: TH.muted, lineHeight: 1.5 }}>
                    {weddingData.venueNote}
                  </div>
                )}
                <Stagger base={165} style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                  <a data-press href={weddingData.googleMapsUrl || '#'} target="_blank" rel="noopener noreferrer" style={btn(true)}>Maps</a>
                  <a data-press href={weddingData.wazeUrl || '#'} target="_blank" rel="noopener noreferrer" style={btn(false)}>Waze</a>
                  {weddingData.appleMapsUrl && (
                    <a data-press href={weddingData.appleMapsUrl} target="_blank" rel="noopener noreferrer" style={btn(false)}>Apple</a>
                  )}
                </Stagger>
              </Reveal>
            </section>

            {/* 07 — PROQRAM */}
            <section style={{ padding: '34px 26px', ...sectionBorder }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="Schedule" title={timeline.sectionLabel} />
                <Stagger base={55} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <span style={{
                    position: 'absolute', left: 63, top: 14, bottom: 14, width: 1,
                    background: `linear-gradient(180deg, transparent, ${TH.primary}59, transparent)`,
                  }} />
                  {timeline.events.map((ev, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <span style={{ width: 46, flex: '0 0 auto', textAlign: 'right', fontSize: 10, letterSpacing: '.12em', color: TH.muted, paddingTop: 9 }}>
                        {ev.time}
                      </span>
                      <span style={{
                        width: 34, height: 34, flex: '0 0 auto', border: `1px solid ${TH.primary}4D`,
                        borderRadius: 8, background: TH.background,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                      }}>{ev.icon}</span>
                      <span style={{ paddingTop: 7, fontFamily: serif, fontSize: 17, color: TH.text }}>{ev.label}</span>
                    </div>
                  ))}
                </Stagger>
              </Reveal>
            </section>

            {/* 08 — DRESS CODE (ikon əsaslı premium kart, theme-aware) */}
            <section style={{ padding: '34px 26px', ...sectionBorder }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="STYLE" title={tr.inv_dresscode} />
                <DressCodeSection
                  theme={TH}
                  paletteId={weddingData.dressCodePalette}
                  customLabels={weddingData.dressCodeLabels}
                  customGenders={weddingData.dressCodeGenders}
                  note={weddingData.dressCodeDescription}
                  lang={lang}
                  serif={serif}
                  align="center"
                  onDark
                />
              </Reveal>
            </section>

            {/* 09 — OTURMA PLANI */}
            {canShowSeating && !seating.isEmpty && (
              <section style={{ padding: '34px 26px', ...sectionBorder }}>
                <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                  <SectionHead kicker="SEATING" title={seating.labels.title} sub={seating.labels.sub} />

                  {/* ⚠ Təkliflər siyahısı normal document flow-dadır — overlap olmur */}
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
                      aria-controls="rg-seating-list"
                      aria-autocomplete="list"
                      autoComplete="off"
                      style={{
                        width: '100%', background: `${TH.primary}0A`, border: `1px solid ${TH.primary}33`,
                        padding: '13px 16px', fontSize: 13, color: TH.text, fontFamily: sans, outline: 'none',
                      }}
                    />
                    {seating.suggestions.length > 0 && (
                      <ul id="rg-seating-list" role="listbox" style={{
                        listStyle: 'none', margin: '8px 0 0', padding: 4,
                        background: TH.surface, border: `1px solid ${TH.primary}33`,
                        maxHeight: 300, overflowY: 'auto',
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
                              padding: '12px 14px', cursor: 'pointer',
                              background: i === seating.activeIdx ? `${TH.primary}1A` : 'transparent',
                            }}
                          >
                            <span style={{ fontSize: 13, color: TH.text }}>{g.full_name}</span>
                            <span style={{
                              background: TH.primary, color: '#1A1408', fontSize: 10,
                              letterSpacing: '.14em', padding: '4px 9px', whiteSpace: 'nowrap',
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
                    <div style={{ marginTop: 12, background: `${TH.primary}0F`, border: `1px solid ${TH.primary}2E`, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <span style={{ fontSize: 12.5, color: TH.text }}>{seating.selected.full_name}</span>
                        <span style={{
                          background: TH.primary, color: '#1A1408', fontSize: 10,
                          letterSpacing: '.14em', padding: '4px 9px', textTransform: 'uppercase', whiteSpace: 'nowrap',
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
                          fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase',
                          color: TH.primary, fontFamily: sans, minHeight: 44, padding: '0 8px 0 0',
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
              <section id="gallery-section" style={{ padding: '34px 26px', textAlign: 'center', ...sectionBorder }}>
                <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                  <SectionHead kicker="Gallery" title={tr.inv_gallery} />

                  {gallery.demoPhotos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 20 }}>
                      {gallery.demoPhotos.map((url, i) => (
                        <div key={i} style={{ aspectRatio: '3/2', overflow: 'hidden', background: '#1A1409' }}>
                          <img src={url} alt="" loading="lazy" onError={hidePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'sepia(.18)' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{
                    width: 128, height: 128, margin: '0 auto', border: `1px solid ${TH.primary}4D`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF',
                  }}>
                    <QRCodeSVG value={gallery.photoShareUrl} size={104} bgColor="#FFFFFF" fgColor="#1A1408" level="M" />
                  </div>
                  <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: `${TH.muted}99`, marginTop: 12 }}>
                    {tr.inv_scan_upload}
                  </div>

                  <a data-press href={gallery.photoShareUrl} style={{ ...btn(true), marginTop: 16, padding: 13 }}>
                    📷 {tr.inv_gallery_btn}
                  </a>
                  {/* ⚠ Phase 27: "Masa kartını yüklə" tamamilə silindi (QR + foto paylaşımı qalır) */}

                  <div style={{ fontSize: 12.5, color: TH.muted, marginTop: 16, lineHeight: 1.9 }}>
                    {tr.inv_gallery_desc}
                  </div>
                </Reveal>
              </section>
            )}

            {/* 11 — RSVP */}
            {canShowRsvp && (
              <section style={{ padding: '38px 26px 48px', textAlign: 'center', ...sectionBorder }}>
                <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: TH.primary }}>
                    <span style={{ width: 22, height: 1, background: `${TH.primary}99` }} />RSVP
                    <span style={{ width: 22, height: 1, background: `${TH.primary}99` }} />
                  </div>
                  <div style={{ fontFamily: serif, fontWeight: 300, fontSize: 'clamp(24px,7vw,28px)', color: TH.accent, lineHeight: 1.25, marginTop: 12 }}>
                    {rsvp.labels.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: TH.muted, margin: '10px 0 22px' }}>{rsvp.labels.subtitle}</div>

                  {rsvp.rsvpClosed && !rsvp.submitted ? (
                    <div style={{ border: `1px solid ${TH.primary}2E`, background: `${TH.primary}0D`, padding: 24 }}>
                      <div style={{ fontFamily: serif, fontSize: 18, color: TH.accent }}>{tr.rsvp_closed_title}</div>
                      <div style={{ fontSize: 11, color: TH.muted, marginTop: 6 }}>{tr.rsvp_closed_desc}</div>
                    </div>
                  ) : rsvp.alreadyDone ? (
                    <div style={{ border: `1px solid ${TH.primary}4D`, background: `${TH.primary}0D`, padding: 24 }}>
                      <div style={{ fontFamily: serif, fontSize: 18, color: TH.accent }}>{rsvp.labels.already_done}</div>
                      <div style={{ fontSize: 11, color: TH.muted, marginTop: 6 }}>{rsvp.selected?.full_name}</div>
                    </div>
                  ) : rsvp.submitted ? (
                    <div style={{ border: `1px solid ${TH.primary}4D`, background: `${TH.primary}0D`, padding: 24 }}>
                      <div style={{ fontFamily: serif, fontSize: 20, color: TH.accent }}>{rsvp.thanksMsg}</div>
                      <div style={{ fontSize: 11, color: TH.muted, marginTop: 6 }}>{rsvp.labels.thanks_sub}</div>
                    </div>
                  ) : (
                    <form onSubmit={rsvp.handleSubmit}>
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
                            width: '100%', background: `${TH.primary}0A`, border: `1px solid ${TH.primary}33`,
                            padding: '14px 16px', fontSize: 13, color: TH.text, fontFamily: sans,
                            outline: 'none', textAlign: 'center',
                          }}
                        />
                        {rsvp.suggestions.length > 0 && (
                          /* flow-da qalır — aşağıdakı elementləri örtmür */
                          <ul role="listbox" style={{
                            listStyle: 'none', margin: '8px 0 0', padding: 4, textAlign: 'left',
                            background: TH.surface, border: `1px solid ${TH.primary}33`,
                            maxHeight: 260, overflowY: 'auto',
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
                                  padding: '12px 14px', cursor: 'pointer',
                                  background: i === rsvp.activeIdx ? `${TH.primary}1A` : 'transparent',
                                }}
                              >
                                <span style={{ fontSize: 13, color: TH.text }}>{g.full_name}</span>
                                <span style={{ fontSize: 10, letterSpacing: '.12em', color: TH.primary }}>{g.table_id}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {rsvp.showNotFound && (
                          <div style={{ fontSize: 10, color: `${TH.primary}CC`, marginTop: 6 }}>{rsvp.labels.not_in_list}</div>
                        )}
                      </div>

                      <Stagger base={220} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[
                          { val: 'yes',   label: rsvp.labels.yes },
                          { val: 'no',    label: rsvp.labels.no },
                          { val: 'maybe', label: rsvp.labels.maybe },
                        ].map(({ val, label }) => {
                          const active = rsvp.status === val
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => rsvp.chooseStatus(val)}
                              data-press
                              style={{
                                flex: '1 1 40%', minHeight: 48, borderRadius: 100, cursor: 'pointer',
                                padding: '14px 8px', fontSize: 10.5, letterSpacing: '.14em',
                                textTransform: 'uppercase', fontFamily: sans,
                                background: active ? `linear-gradient(135deg, ${TH.primary}, #B8903A)` : 'transparent',
                                color: active ? '#FFFFFF' : TH.accent,
                                border: active ? '1px solid transparent' : `1px solid ${TH.primary}40`,
                              }}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </Stagger>

                      {rsvp.status === 'yes' && (
                        <div style={{ marginTop: 12, border: `1px solid ${TH.primary}2E`, background: `${TH.primary}0D`, padding: '22px 18px' }}>
                          <div style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: TH.muted }}>
                            {rsvp.labels.plusq}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, marginTop: 18 }}>
                            <button type="button" onClick={rsvp.decPlusOne} disabled={rsvp.plusOne === 0} data-press aria-label="Azalt"
                              style={{ width: 40, height: 40, border: `1px solid ${TH.primary}4D`, background: 'none', color: TH.muted, cursor: 'pointer', opacity: rsvp.plusOne === 0 ? .35 : 1 }}>
                              −
                            </button>
                            <span style={{ fontFamily: serif, fontSize: 34, color: TH.accent, width: 40, fontVariantNumeric: 'tabular-nums' }}>
                              {rsvp.plusOne}
                            </span>
                            <button type="button" onClick={rsvp.incPlusOne} disabled={rsvp.plusOne === rsvp.maxExtraGuests} data-press aria-label="Artır"
                              style={{ width: 40, height: 40, border: `1px solid ${TH.primary}4D`, background: 'none', color: TH.primary, cursor: 'pointer', opacity: rsvp.plusOne === rsvp.maxExtraGuests ? .35 : 1 }}>
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
                          marginTop: 12, width: '100%', minHeight: 50, border: 'none',
                          background: TH.primary, color: '#1A1408',
                          cursor: rsvp.canSubmit ? 'pointer' : 'not-allowed',
                          fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase',
                          fontFamily: sans, opacity: rsvp.canSubmit ? 1 : .35,
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
            <section style={{ padding: '34px 26px', ...sectionBorder }}>
              <Reveal style={{ maxWidth: 560, margin: '0 auto' }}>
                <SectionHead kicker="Guestbook" title={gbook.labels.title} />

                <form onSubmit={gbook.handleAdd} style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
                  <input
                    type="text"
                    value={gbook.name}
                    onChange={(e) => gbook.setName(e.target.value)}
                    placeholder={gbook.labels.namePh}
                    style={{
                      background: `${TH.primary}0A`, border: `1px solid ${TH.primary}33`,
                      padding: '13px 16px', fontSize: 13, color: TH.text, fontFamily: sans, outline: 'none',
                    }}
                  />
                  <textarea
                    value={gbook.text}
                    onChange={(e) => gbook.setText(e.target.value)}
                    placeholder={gbook.labels.msgPh}
                    rows={3}
                    style={{
                      background: `${TH.primary}0A`, border: `1px solid ${TH.primary}33`,
                      padding: '14px 16px', fontSize: 13, color: TH.text, fontFamily: sans,
                      outline: 'none', resize: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!gbook.canSubmit}
                    data-press
                    style={{
                      minHeight: 46, border: 'none', background: TH.primary, color: '#1A1408',
                      cursor: gbook.canSubmit ? 'pointer' : 'not-allowed',
                      fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase',
                      fontFamily: sans, opacity: gbook.canSubmit ? 1 : .35,
                    }}
                  >
                    {gbook.sending ? gbook.labels.sending : gbook.labels.btn}
                  </button>
                </form>

                <Stagger base={110} style={{ display: 'grid', gap: 14 }}>
                  {gbook.messages.map((raw, i) => {
                    const m = gbook.readMessage(raw)
                    return (
                      <div key={m.name + i} style={{ borderLeft: `1px solid ${TH.primary}4D`, padding: '6px 0 6px 14px' }}>
                        <div style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 15, color: '#D9CDB8', lineHeight: 1.6 }}>
                          “{m.text}”
                        </div>
                        <div style={{ fontSize: 10, color: TH.muted, marginTop: 6, letterSpacing: '.12em' }}>
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
