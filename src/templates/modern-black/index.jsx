import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { Gleam } from '../_shared/OpeningFrame'
import { Ambient, Blob, Beam, Scan } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'
import { formatTime24 } from '../../utils/dateFormat'

/* ─────────────────────────────────────────────────────────────────────────────
   MODERN BLACK LUXURY — Claude Design · t3

   Design story: dekorsuz lüks. Bütün ağırlıq tipoqrafiyada və boşluqdadır —
   ornament yoxdur. Radius 0, kəskin kontrast, mənfi letter-spacing.

   «Açılış Ekranı düzəliş V1»: açılış artıq sadə ad bloku deyil — texniki
   sənəd kimi qurulur. Şəbəkə fona hopur, qızıl zolaq bir dəfə yuxarıdan
   aşağı süzülür, adlar maskadan çıxır (biri sola, biri sağa hizalı), aralarında
   «VƏ» ayırıcısı. Daxili fon isə keçən şüa + tarama xətti ilə canlanır.

   ⚠ Qızıl (#C8A951) YALNIZ açılış və ambient qatındadır — daxili sxemin
   rəngləri (theme token-ləri) toxunulmaz qalır.
   ⚠ Biznes məntiqi yoxdur — TemplateShell 7 hook-u çağırır.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('modern-black')

/* Design t3-ün açılış aksenti — sənəd nömrəsi, ayırıcı və zolaq üçün. */
const GOLD = '#C8A951'

const KEYFRAMES = `
@keyframes tpl-hint { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq   { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes mb-bar    { 0% { top:-2px; opacity:0 } 8% { opacity:1 } 92% { opacity:1 } 100% { top:100%; opacity:0 } }
@keyframes mb-unmask { from { clip-path: inset(0 0 100% 0) } to { clip-path: inset(0 0 0 0) } }
@keyframes mb-track  { from { opacity:0; letter-spacing:.9em } to { opacity:1; letter-spacing:.26em } }
@keyframes mb-grid   { from { opacity:0 } to { opacity:1 } }
@keyframes mb-tick   { 0%,100% { opacity:.25 } 50% { opacity:.9 } }
`

const mono = { fontFamily: TH.fonts?.heading }

function Opening(props) {
  const { theme, weddingData, isCouple } = props
  const nameA = isCouple ? weddingData.groomName : (weddingData.eventName || weddingData.brideName)
  const nameB = isCouple ? weddingData.brideName : ''
  const dateStr = (weddingData.date || '').split('-').reverse().join('.')
  const place = weddingData.venueName
    ? String(weddingData.venueName).split(',').pop().trim().toLocaleUpperCase('az')
    : ''
  const timeStr = weddingData.time ? formatTime24(weddingData.time) : ''

  /* Ölçü xətti — adların altında və üstündə çəkilir (design: `rg-drawx`) */
  const rule = (delay, origin) => ({
    height: 1, background: alpha(theme.accent, 0.14), transformOrigin: `${origin} 50%`,
    animation: `tpl-drawx 1.2s cubic-bezier(.76,0,.24,1) ${delay}s both`,
  })

  const bigName = {
    ...mono, fontWeight: 200, fontSize: 'clamp(38px, 14vw, 52px)', lineHeight: 0.95,
    letterSpacing: '-.02em', color: theme.accent, textTransform: 'uppercase',
  }

  return (
    <OpeningFrame
      {...props}
      exit="up"
      duration={800}
      hint={false}
      orbs="none"
      ariaLabel="Dəvətnaməni aç"
      background="#060606"
    >
      {/* Texniki şəbəkə — 46px tile, fona güclə sezilən qalınlıqda hopur */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,.028) 0 1px, transparent 1px 46px),' +
          'repeating-linear-gradient(90deg, rgba(255,255,255,.028) 0 1px, transparent 1px 46px)',
        animation: 'mb-grid 1.4s ease-out .3s both',
      }} />

      {/* Qızıl zolaq — bir dəfə yuxarıdan aşağı süzülür (skan kimi) */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: 0, right: 0, height: 1, pointerEvents: 'none',
        background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        boxShadow: `0 0 24px 3px ${alpha(GOLD, 0.45)}`,
        animation: 'mb-bar 3.4s cubic-bezier(.5,0,.5,1) .4s both',
      }} />

      <div style={{ position: 'absolute', inset: 0, textAlign: 'left' }}>
        {/* Sənəd başlığı */}
        <div style={{
          position: 'absolute', left: 'clamp(20px, 6vw, 24px)', right: 'clamp(20px, 6vw, 24px)',
          top: 'clamp(40px, 12vw, 56px)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          ...mono, fontSize: 9.5, letterSpacing: '.3em', textTransform: 'uppercase',
          color: alpha(theme.muted, 0.9),
          animation: 'mb-unmask 1s cubic-bezier(.16,1,.3,1) 1.1s both',
        }}>
          <span>Digitoy</span><span style={{ color: GOLD }}>№ 012</span>
        </div>

        {/* Tipoqrafik nüvə */}
        <div style={{
          position: 'absolute', left: 'clamp(20px, 6vw, 24px)', right: 'clamp(20px, 6vw, 24px)',
          top: '50%', transform: 'translateY(-50%)',
        }}>
          <div style={{
            ...mono, fontSize: 9.5, letterSpacing: '.26em', textTransform: 'uppercase',
            color: alpha(theme.muted, 1),
            animation: 'mb-track 1.2s cubic-bezier(.16,1,.3,1) 1.6s both',
          }}>
            {props.eventLabel}
          </div>

          <div style={{ ...rule(1.9, '0'), margin: '18px 0 22px' }} />

          <div style={{ ...bigName, animation: 'mb-unmask 1.1s cubic-bezier(.16,1,.3,1) 2.2s both' }}>
            {nameA}
          </div>

          {nameB && (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14, margin: '6px 0',
                animation: 'tpl-rise .9s ease-out 2.5s both',
              }}>
                <span style={{ flex: 1, height: 1, background: alpha(GOLD, 0.5) }} />
                <span style={{ ...mono, fontSize: 11, letterSpacing: '.3em', color: GOLD }}>VƏ</span>
                <span style={{ flex: 1, height: 1, background: alpha(GOLD, 0.5) }} />
              </div>
              <div style={{
                ...bigName, textAlign: 'right',
                animation: 'mb-unmask 1.1s cubic-bezier(.16,1,.3,1) 2.75s both',
              }}>
                {nameB}
              </div>
            </>
          )}

          <div style={{ ...rule(3.1, '100%'), margin: '24px 0 18px' }} />

          <div style={{
            display: 'flex', justifyContent: 'space-between', gap: 12,
            ...mono, fontSize: 10, letterSpacing: '.26em', textTransform: 'uppercase',
            color: alpha(theme.muted, 1),
            animation: 'tpl-rise .9s ease-out 3.4s both',
          }}>
            <span>{dateStr}</span>
            {(place || timeStr) && (
              <span style={{ color: GOLD }}>{[place, timeStr].filter(Boolean).join(' · ')}</span>
            )}
          </div>
        </div>

        {/* Açma zolağı — radius 0, yanında döyünən üç cizgi */}
        <div style={{
          position: 'absolute', left: 'clamp(20px, 6vw, 24px)', right: 'clamp(20px, 6vw, 24px)',
          bottom: 34, display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            position: 'relative', flex: '1 1 auto', overflow: 'hidden',
            border: `1px solid ${alpha(theme.accent, 0.2)}`, padding: '15px 0', textAlign: 'center',
            ...mono, fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase',
            color: theme.accent, whiteSpace: 'nowrap',
            animation: 'tpl-cta .9s cubic-bezier(.16,1,.3,1) 3.7s both',
          }}>
            <Gleam delay={5} width="36%" color={alpha(GOLD, 0.34)} />
            <span style={{ position: 'relative' }}>Dəvəti aç</span>
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 3, animation: 'tpl-rise .8s ease-out 4s both' }}>
            {[0, 0.3, 0.6].map((d) => (
              <span key={d} style={{ width: 16, height: 1, background: GOLD, animation: `mb-tick 2.2s ease-in-out ${d}s infinite` }} />
            ))}
          </div>
        </div>

        <div style={{
          position: 'absolute', left: 'clamp(20px, 6vw, 24px)', bottom: 16,
          ...mono, fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase',
          color: alpha(theme.muted, 0.95),
          animation: 'tpl-rise .8s ease-out 4.3s both, tpl-hint 2.8s ease-in-out 5.2s infinite',
        }}>
          toxunun
        </div>
      </div>
    </OpeningFrame>
  )
}

export default function ModernBlackTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="modern-black"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      /* Daxili arxa fon — qara üzərində keçən işıq, tarama xətti və şəbəkə */
      ambientBlend="screen"
      ambient={
        <Ambient>
          <span style={{
            position: 'absolute', inset: 0, opacity: 0.5,
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 1px, transparent 1px 46px)',
            animation: 'ab-wander 26s ease-in-out infinite',
          }} />
          <Blob color="rgba(255,255,255,.12)" left="-14%" top="10%" w="64%" h="30%" blur={40} duration={20} />
          <Blob color={alpha(GOLD, 0.2)} right="-16%" bottom="16%" w="58%" h="28%" blur={42} duration={25} delay={7} reverse />
          <Beam color="rgba(255,255,255,.09)" width="22%" duration={13} />
          <Beam color={alpha(GOLD, 0.16)} width="14%" duration={19} delay={5} />
          <Scan color={alpha(GOLD, 0.65)} duration={7.5} delay={2} />
        </Ambient>
      }
      design={{
        radius: 0,
        buttonRadius: 0,
        align: 'left',
        headingTransform: 'uppercase',
        kicker: '.2em',
        dark: true,
        alternate: false,
        /* Location — OSM tile mozaikasının şablona məxsus emalı */
        map: { opacity: 0.28, filter: 'grayscale(1) brightness(.4) contrast(1.5) invert(1)', blend: 'multiply', tintOpacity: 0.25 },
        accentColor: TH.secondary,
        ctaBg: TH.accent,
        ctaText: TH.primary,
      }}
    />
  )
}
