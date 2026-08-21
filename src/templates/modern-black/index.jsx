import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame from '../_shared/OpeningFrame'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   MODERN BLACK LUXURY — Claude Design · t3

   Design story: dekorsuz lüks. Bütün ağırlıq tipoqrafiyada və boşluqdadır —
   ornament yoxdur, qızıl yoxdur. Radius 0, kəskin kontrast, mənfi letter-spacing.
   Açılış: aşağı sol küncdə nəhəng iki sətirlik ad tipoqrafiyası, "sürüşdürüb açın".

   ⚠ Bütün rənglər theme token-lərindən (templateConfig · modern-black).
   ⚠ Biznes məntiqi yoxdur — TemplateShell 7 hook-u çağırır.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('modern-black')

const KEYFRAMES = `
@keyframes tpl-hint { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq   { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes mb-slide { 0% { transform: translateX(0) } 60% { transform: translateX(10px) } 100% { transform: translateX(0) } }
`

function Opening(props) {
  const { theme, weddingData, isCouple } = props
  const nameA = isCouple ? weddingData.groomName : (weddingData.eventName || weddingData.brideName)
  const nameB = isCouple ? weddingData.brideName : ''
  const dateStr = (weddingData.date || '').split('-').reverse().join('.')

  return (
    <OpeningFrame {...props} exit="up" duration={800} hint="sürüşdürüb açın" ariaLabel="Dəvətnaməni aç">
      {/* Sol-alt hizalanmış tipoqrafik kompozisiya (design t3) */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'clamp(22px, 7vw, 34px)', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: theme.muted }}>
          <span>Dəvətnamə</span><span>№ 012</span>
        </div>

        <div>
          <div style={{
            fontFamily: theme.fonts?.heading, fontWeight: 500,
            fontSize: 'clamp(40px, 15vw, 62px)', lineHeight: 0.94, letterSpacing: '-.04em',
            color: theme.accent, textTransform: 'uppercase',
          }}>
            {nameA}{nameB ? <><br />{nameB}</> : null}
          </div>
          <div style={{ fontSize: 'clamp(10px, 3vw, 11px)', letterSpacing: '.14em', color: theme.muted, marginTop: 'clamp(14px, 4vw, 20px)' }}>
            bir axşam, bir söz
          </div>
          <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: theme.secondary, marginTop: 8 }}>
            {dateStr}{weddingData.venueName ? ` — ${String(weddingData.venueName).split(',').pop().trim().toUpperCase()}` : ''}
          </div>

          {/* Sürüşdürmə göstəricisi — radius 0, tam en */}
          <div style={{
            marginTop: 'clamp(22px, 6vw, 30px)', height: 56, border: `1px solid ${alpha(theme.accent, 0.3)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px',
            fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: theme.accent,
          }}>
            Aç
            <span style={{ animation: 'mb-slide 1.8s ease-in-out infinite' }}>→</span>
          </div>
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
