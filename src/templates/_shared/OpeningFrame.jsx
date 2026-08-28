import { useState } from 'react'
import { motion } from 'framer-motion'
import { unlockAudio } from '../../utils/audioUnlock'
import { formatFullDateByLang } from '../../utils/dateFormat'
import { alpha } from './TemplateShell'

/* ─────────────────────────────────────────────────────────────────────────────
   OPENING FRAME — zərf açılışının ortaq davranış qatı.

   Ortaq olan: tam ekran örtük, toxunuş/klaviatura ilə açılma, audio unlock,
   çıxış animasiyası, "toxunun" ipucu, əlçatanlıq (role/tabIndex/aria).
   Fərqli olan: hər şablonun ÖZ vizual kompozisiyası (`children`) və çıxış
   effekti (`exit`).

   Rənglər `theme` token-lərindən gəlir — burada hardcode rəng yoxdur.
   ───────────────────────────────────────────────────────────────────────── */

/* Claude Design v2 — bütün açılış ekranlarında ortaq üç hərəkət.
   Bir dəfə burada elan olunur ki, 8 şablonun keyframe sətri təkrarlanmasın.
   `prefers-reduced-motion` TemplateShell-in qlobal qaydası ilə söndürülür. */
const OPENING_KEYFRAMES = `
@keyframes tpl-blurin   { from { opacity:0; filter:blur(12px); transform:translateY(16px) scale(.985) } to { opacity:1; filter:blur(0); transform:none } }
@keyframes tpl-halo     { 0%,100% { opacity:.22; transform:translate(-50%,-50%) scale(1) } 50% { opacity:.5; transform:translate(-50%,-50%) scale(1.1) } }
@keyframes tpl-slowring { from { transform:translate(-50%,-50%) rotate(0) } to { transform:translate(-50%,-50%) rotate(360deg) } }

/* «Açılış Ekranı düzəliş V1» — pərdə + ardıcıl giriş dili.
   Ekran birdən görünmür: pərdə əriyir, sonra elementlər sıra ilə yerinə düşür. */
@keyframes tpl-veil     { from { opacity:1 } to { opacity:0 } }
@keyframes tpl-rise     { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }
@keyframes tpl-drawx    { from { transform:scaleX(0) } to { transform:scaleX(1) } }
@keyframes tpl-drawy    { from { transform:scaleY(0) } to { transform:scaleY(1) } }
@keyframes tpl-letter   { from { opacity:0; transform:translateY(26px) rotateX(52deg); filter:blur(7px) } to { opacity:1; transform:none; filter:blur(0) } }
@keyframes tpl-cta      { from { opacity:0; transform:translateY(16px) scale(.94) } to { opacity:1; transform:none } }
@keyframes tpl-gleam    { 0% { transform:translateX(-140%) skewX(-18deg); opacity:0 } 22% { opacity:.9 } 100% { transform:translateX(300%) skewX(-18deg); opacity:0 } }
@keyframes tpl-twinkle  { 0%,100% { opacity:.15 } 50% { opacity:.9 } }
@keyframes tpl-shock    { 0% { opacity:0; transform:translate(-50%,-50%) scale(.3) } 12% { opacity:.85 } 100% { opacity:0; transform:translate(-50%,-50%) scale(3.1) } }

/* ⚠ TOXUNUŞDAN SONRA açılış xoreoqrafiyası DAYANDIRILIR.

   Səbəb: giriş ardıcıllığı 4–6 saniyə sürür və bütün ekranı tutan qradiyent/
   blur qatlarının üzərində işləyir. İstifadəçi ortasında toxunanda əsas axın
   hələ də bu kadrları çəkirdi və start()-dakı setTimeout(duration) VAXTINDA
   İŞLƏMİRDİ — ölçmə (6x throttle): 950 ms-lik gözləmə 3.2 saniyəyə, 20x-də
   6.6 saniyəyə uzanırdı. İstifadəçi bunu «donub, açılmır» kimi görürdü.

   paused seçilib, none yox: none, both fill-mode-lu qatları (məsələn pərdəni)
   ilkin vəziyyətinə qaytarıb ekranda sıçrayış yaradardı. paused hər şeyi olduğu
   kadrda dondurur — çıxış animasiyası isə framer-motion-un inline transform-udur,
   CSS animation-play-state ona toxunmur. */
[data-tpl-opening] * { animation-play-state: paused !important; }
`
export default function OpeningFrame({
  theme, onOpen, onOpenStart, children,
  label,                       /* CTA mətni */
  background,                  /* öz fonu (yoxdursa theme.background)        */
  exit = 'fade',               /* fade | up | zoom | curtain | iris          */
  duration = 950,
  hint = 'toxunun',
  ariaLabel = 'Dəvətnaməni aç',
  /* ── «Açılış Ekranı düzəliş V1» əlavələri ────────────────────────────────
     veil      — pərdə rəngi. Verilsə, ekran bu rənglə örtülü başlayır və
                 pərdə əriyir; qatlar ardıcıl açıldığı üçün kökün ümumi
                 `tpl-blurin` girişi söndürülür (ikiqat animasiya olmasın).
     orbs      — mərkəzdəki ortaq halo/halqa: 'both' | 'halo' | 'ring' | 'none'
     orbTop    — həmin qatların şaquli mərkəzi (design-də şablona görə dəyişir)
     ctaDelay  — CTA-nın giriş gecikməsi (san). Ardıcıllığın son həlqəsidir.
     hintDelay — «toxunun» ipucunun giriş gecikməsi (san).
     ──────────────────────────────────────────────────────────────────────── */
  veil,
  orbs = 'both',
  orbTop = '48%',
  ctaDelay,
  hintDelay,
  /* CTA və ipucu rəngləri default olaraq `theme.accent`/`theme.muted`-dən
     gəlir. Bəzi açılışlarda fon şablonun daxili palitrasından fərqlidir
     (məs. Nature Touch-un tünd meşəsi) — orada design öz rəngini verir. */
  ctaStyle = {},
  ctaGleam,                    /* CTA-nın üzərindən keçən işığın rəngi */
  hintColor,
}) {
  const [opening, setOpening] = useState(false)
  const [gone, setGone] = useState(false)

  const start = () => {
    if (opening) return
    unlockAudio()
    /* ⚠ MUSİQİ MƏHZ BURADA başlayır — toxunuş hadisəsinin İÇİNDƏ. `onOpen`
       çıxış animasiyasından sonra (setTimeout) işə düşür, yəni jest pəncərəsi
       artıq bağlı olur və iOS Safari play()-i bloklayır. */
    onOpenStart?.()
    setOpening(true)
    setTimeout(() => { setGone(true); onOpen() }, duration)
  }

  if (gone) return null

  const EXITS = {
    fade:    { opacity: 0 },
    up:      { y: '-100%' },
    zoom:    { opacity: 0, scale: 1.08 },
    curtain: { y: '-100%' },
    iris:    { opacity: 0, scale: 1.15 },
  }

  /* Konsentrik fon qatı — mərkəzdə nəfəs alan halo + çox yavaş dönən halqa.
     `isolation:isolate` ilə örtük öz stacking context-ini yaradır, ona görə
     zIndex:-1 qatları məzmunun ALTINDA, amma fonun ÜSTÜNDƏ qalır. */
  const orb = (size, extra) => ({
    position: 'absolute', left: '50%', top: orbTop, transform: 'translate(-50%, -50%)',
    width: size, height: size, borderRadius: '50%', pointerEvents: 'none', zIndex: -1,
    ...extra,
  })

  return (
    <motion.div
      onClick={start}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start() } }}
      aria-label={ariaLabel}
      data-tpl-opening={opening ? '' : undefined}
      animate={opening ? EXITS[exit] : {}}
      transition={{ duration: duration / 1000, ease: [0.65, 0, 0.35, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        background: background || theme.background,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 clamp(18px, 6vw, 28px)',
        fontFamily: theme.fonts?.body,
        isolation: 'isolate',
        /* ⚠ `both` fill-mode CSS transform-u inline stildən üstün tutur — açılış
           başlayanda söndürülməsə, framer-motion-un çıxış transformu (up/zoom/
           curtain/iris) işləməzdi. Giriş animasiyası onsuz da 1.15s-də bitir. */
        animation: (opening || veil) ? 'none' : 'tpl-blurin 1.15s cubic-bezier(.22,.61,.36,1) both',
      }}
    >
      {/* Ortaq açılış qatları — bütün şablonlarda eyni (Claude Design v2) */}
      <style>{OPENING_KEYFRAMES}</style>

      {/* Pərdə — ekranı örtür və əriyir, altdakı kompozisiya sıra ilə açılır */}
      {veil && (
        <span aria-hidden="true" style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: veil,
          animation: 'tpl-veil 1.05s ease-out .1s both',
        }} />
      )}

      {(orbs === 'both' || orbs === 'halo') && (
        <span style={orb('min(78vw, 320px)', {
          background: `radial-gradient(circle, ${alpha(theme.accent, 0.3)}, transparent 68%)`,
          filter: 'blur(26px)',
          animation: 'tpl-halo 8s ease-in-out infinite',
        })} />
      )}
      {(orbs === 'both' || orbs === 'ring') && (
        <span style={orb('min(62vw, 250px)', {
          border: `1px solid ${alpha(theme.accent, 0.3)}`, opacity: 0.4,
          animation: 'tpl-slowring 80s linear infinite',
        })} />
      )}

      {children}

      {label && (
        <div style={{
          position: 'relative', overflow: 'hidden',
          marginTop: 'clamp(28px, 8vw, 40px)', display: 'inline-flex', alignItems: 'center', gap: 10,
          border: `1px solid ${alpha(theme.accent, 0.45)}`, borderRadius: 100,
          padding: 'clamp(12px, 3.5vw, 14px) clamp(20px, 6vw, 26px)',
          fontSize: 'clamp(10px, 2.6vw, 10px)', letterSpacing: '.22em', textTransform: 'uppercase',
          color: theme.accent, background: alpha(theme.primary, 0.1),
          animation: ctaDelay == null ? undefined
            : `tpl-cta .9s cubic-bezier(.22,.61,.36,1) ${ctaDelay}s both`,
          ...ctaStyle,
        }}>
          {/* Üzərindən keçən işıq — CTA-nın «basılası» görünməsi üçün */}
          <Gleam delay={(ctaDelay || 0) + 1.1} color={ctaGleam || alpha(theme.accent, 0.35)} />
          <span style={{ position: 'relative' }}>{label}</span>
          <span style={{ position: 'relative' }}>→</span>
        </div>
      )}

      {hint && (
      <div style={{
        position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center',
        fontSize: 10, letterSpacing: '.14em', color: hintColor || alpha(theme.muted, 0.75),
        animation: hintDelay == null
          ? 'tpl-hint 2.6s ease-in-out infinite'
          : `tpl-rise .8s ease-out ${hintDelay}s both, tpl-hint 2.8s ease-in-out ${hintDelay + 0.8}s infinite`,
      }}>
        {hint}
      </div>
      )}
    </motion.div>
  )
}

/* Açılış ekranında istifadə olunan ortaq ad/tarix bloku */
export function OpeningNames({ theme, weddingData, isCouple, lang = 'az', style = {}, transform = 'none', italic = false }) {
  const names = isCouple
    ? `${weddingData.groomName || ''}\n& ${weddingData.brideName || ''}`
    : (weddingData.eventName || weddingData.brideName || '')
  return (
    <>
      <div style={{
        fontFamily: theme.fonts?.heading, fontStyle: italic ? 'italic' : 'normal', fontWeight: 300,
        fontSize: 'clamp(28px, 9vw, 40px)', color: theme.accent, lineHeight: 1.15,
        whiteSpace: 'pre-line', textTransform: transform, ...style,
      }}>
        {names}
      </div>
      <div style={{ width: 28, height: 1, background: theme.primary, margin: '14px auto' }} />
      <div style={{ fontSize: 'clamp(10px, 2.5vw, 10px)', letterSpacing: '.2em', textTransform: 'uppercase', color: theme.muted }}>
        {formatFullDateByLang(weddingData.date, lang)}
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   AÇILIŞ KOMPOZİSİYA DETALLARI — «Açılış Ekranı düzəliş V1»

   Design-də hər açılış ekranı eyni dörd tikinti daşından yığılır: üzərindən
   keçən işıq, yan xətli kicker, hərf-hərf qalxan adlar və ornament sətri.
   Fərq yalnız rəng/ritmdədir — ona görə burada bir dəfə yazılır.

   ⚠ Bunların keyframe-ləri OPENING_KEYFRAMES-dədir, yəni yalnız OpeningFrame
   mount olduqda mövcuddur. Kənarda işlədilməməlidir.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Üzərindən diaqonal keçən işıq zolağı — CTA, kart və çərçivələr üçün. */
export function Gleam({ delay = 0, duration = 4.6, width = '38%', color = 'rgba(255,255,255,.35)' }) {
  return (
    <span aria-hidden="true" style={{
      position: 'absolute', top: 0, bottom: 0, left: 0, width, pointerEvents: 'none',
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      animation: `tpl-gleam ${duration}s ease-in-out ${delay}s infinite`,
    }} />
  )
}

/** İki yan xətt arasında kiçik caps başlıq (design: «Toy Dəvətnaməsi»). */
export function Kicker({ text, color, lineColor, delay = 0, gap = 12, lineWidth = 22, style = {} }) {
  const line = lineColor && (
    <span style={{ width: lineWidth, height: 1, background: lineColor, flex: '0 0 auto' }} />
  )
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap,
      animation: `tpl-rise .9s cubic-bezier(.22,.61,.36,1) ${delay}s both`, ...style,
    }}>
      {line}
      <span style={{ fontSize: 'clamp(9px, 2.5vw, 9.5px)', letterSpacing: '.4em', textTransform: 'uppercase', color, whiteSpace: 'nowrap' }}>
        {text}
      </span>
      {line}
    </div>
  )
}

/**
 * Adlar — hər söz ayrıca qalxır (design: `rg-letter` ardıcıllığı).
 * `stacked` sətir-sətir (White Elegance), əks halda bir sətirdə yan-yana.
 */
export function NameRow({
  theme, weddingData, isCouple,
  delay = 0, step = 0.2, stacked = false,
  size = 'clamp(26px, 9vw, 36px)', ampSize = 'clamp(18px, 6vw, 23px)',
  ampColor, color, font, style = {},
}) {
  const first = isCouple
    ? (weddingData.groomName || '')
    : (weddingData.eventName || weddingData.brideName || '')
  const second = isCouple ? (weddingData.brideName || '') : ''

  const rise = (i) => ({
    display: 'inline-block',
    animation: `tpl-letter .95s cubic-bezier(.22,.61,.36,1) ${(delay + i * step).toFixed(2)}s both`,
  })

  return (
    <div style={{
      display: stacked ? 'block' : 'flex',
      alignItems: 'baseline', justifyContent: 'center', gap: stacked ? 0 : 11,
      fontFamily: font || theme.fonts?.heading, fontWeight: 300,
      fontSize: size, color: color || theme.accent,
      lineHeight: stacked ? 1.25 : 1, ...style,
    }}>
      <span style={rise(0)}>{first}</span>
      {second && (
        <>
          {stacked && <br />}
          <span style={{ ...rise(1), fontSize: ampSize, color: ampColor || theme.primary }}>&amp;</span>
          {stacked && <br />}
          <span style={rise(2)}>{second}</span>
        </>
      )}
    </div>
  )
}

/** Ornament sətri — solub gedən iki xətt və ortada nişan (ulduz/nöqtə/romb). */
export function Ornament({ color, mark = 'star', delay = 0, width = 34, gap = 9, style = {} }) {
  const marks = {
    star: <svg viewBox="0 0 12 12" width="7" height="7" aria-hidden="true"><path d="M6 0 L7.6 4.4 L12 6 L7.6 7.6 L6 12 L4.4 7.6 L0 6 L4.4 4.4 Z" fill={color} /></svg>,
    dot:  <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />,
    glow: <span style={{ width: 3, height: 3, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />,
    rhomb: <span style={{ width: 6, height: 6, border: `1px solid ${color}`, transform: 'rotate(45deg)' }} />,
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap,
      animation: `tpl-rise .8s ease-out ${delay}s both`, ...style,
    }}>
      <span style={{ width, height: 1, background: `linear-gradient(90deg, transparent, ${color})` }} />
      {marks[mark] || marks.star}
      <span style={{ width, height: 1, background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  )
}

/** Açılışdakı tarix/yer sətri — ardıcıllığın adlardan sonrakı həlqəsi. */
export function OpeningMeta({ text, color, delay = 0, style = {} }) {
  return (
    <div style={{
      fontSize: 'clamp(10px, 2.7vw, 10.5px)', letterSpacing: '.24em', textTransform: 'uppercase',
      color, animation: `tpl-rise .8s ease-out ${delay}s both`, ...style,
    }}>
      {text}
    </div>
  )
}
