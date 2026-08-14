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
export default function OpeningFrame({
  theme, onOpen, children,
  label,                       /* CTA mətni */
  background,                  /* öz fonu (yoxdursa theme.background)        */
  exit = 'fade',               /* fade | up | zoom | curtain | iris          */
  duration = 950,
  hint = 'toxunun',
  ariaLabel = 'Dəvətnaməni aç',
}) {
  const [opening, setOpening] = useState(false)
  const [gone, setGone] = useState(false)

  const start = () => {
    if (opening) return
    unlockAudio()
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

  return (
    <motion.div
      onClick={start}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); start() } }}
      aria-label={ariaLabel}
      animate={opening ? EXITS[exit] : {}}
      transition={{ duration: duration / 1000, ease: [0.65, 0, 0.35, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 120, cursor: 'pointer', overflow: 'hidden',
        background: background || theme.background,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 clamp(18px, 6vw, 28px)',
        fontFamily: theme.fonts?.body,
      }}
    >
      {children}

      {label && (
        <div style={{
          marginTop: 'clamp(28px, 8vw, 40px)', display: 'inline-flex', alignItems: 'center', gap: 10,
          border: `1px solid ${alpha(theme.accent, 0.45)}`, borderRadius: 100,
          padding: 'clamp(12px, 3.5vw, 14px) clamp(20px, 6vw, 26px)',
          fontSize: 'clamp(9px, 2.6vw, 10px)', letterSpacing: '.22em', textTransform: 'uppercase',
          color: theme.accent, background: alpha(theme.primary, 0.1),
        }}>
          {label}<span>→</span>
        </div>
      )}

      <div style={{
        position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center',
        fontSize: 9, letterSpacing: '.18em', color: alpha(theme.muted, 0.75),
        animation: 'tpl-hint 2.6s ease-in-out infinite',
      }}>
        {hint}
      </div>
    </motion.div>
  )
}

/* Açılış ekranında istifadə olunan ortaq ad/tarix bloku */
export function OpeningNames({ theme, weddingData, isCouple, lang = 'az', style = {}, transform = 'none', italic = false }) {
  const names = isCouple
    ? `${weddingData.brideName || ''}\n& ${weddingData.groomName || ''}`
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
      <div style={{ fontSize: 'clamp(9px, 2.5vw, 10px)', letterSpacing: '.26em', textTransform: 'uppercase', color: theme.muted }}>
        {formatFullDateByLang(weddingData.date, lang)}
      </div>
    </>
  )
}
