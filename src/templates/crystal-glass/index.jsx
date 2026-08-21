import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { OpeningNames } from '../_shared/OpeningFrame'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   CRYSTAL GLASS — Claude Design · t8

   Design dili: kristal refraksiya, şüşə effekti, platin aksentlər.
   Buz mavisi qradiyent üzərində şəffaf kartlar + üzərindən keçən işıq sweep-i.
   Tipoqrafika: Italiana caps (geniş letter-spacing).

   ⚠ Design faylında t8-in spec paneli kəsilib — rənglər maketdən götürülüb və
   artıq templateConfig-də token kimi saxlanılır.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('crystal-glass')

const KEYFRAMES = `
@keyframes tpl-hint    { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq      { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes cg-shimmer  { 0% { transform: translateX(-120%) skewX(-14deg) } 100% { transform: translateX(320%) skewX(-14deg) } }
`

function Shimmer({ duration = 6 }) {
  return (
    <span style={{
      position: 'absolute', top: 0, bottom: 0, width: '45%', pointerEvents: 'none',
      background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,.55) 50%, transparent 100%)',
      animation: `cg-shimmer ${duration}s linear infinite`,
    }} />
  )
}

function Opening(props) {
  const { theme, weddingData, isCouple, lang } = props
  return (
    <OpeningFrame
      {...props}
      exit="zoom"
      duration={900}
      label="Açmaq üçün toxunun"
      background={`linear-gradient(150deg, ${theme.background}, ${theme.secondary} 60%, ${theme.surface})`}
    >
      <Shimmer />

      {/* Şüşə kart */}
      <div style={{
        position: 'relative',
        background: 'rgba(255,255,255,.55)',
        border: '1px solid rgba(255,255,255,.9)',
        boxShadow: `0 20px 50px ${alpha(theme.accent, 0.25)}`,
        backdropFilter: 'blur(8px)',
        padding: 'clamp(28px, 8vw, 44px) clamp(22px, 7vw, 40px)',
        maxWidth: 380, width: '100%', overflow: 'hidden',
      }}>
        <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: theme.accent, marginBottom: 'clamp(16px, 5vw, 24px)' }}>
          Dəvətnamə
        </div>

        {/* Kristal dairə */}
        <span style={{
          display: 'block', width: 'clamp(48px, 14vw, 62px)', height: 'clamp(48px, 14vw, 62px)',
          margin: '0 auto clamp(18px, 5vw, 24px)', borderRadius: '50%',
          border: `1px solid ${alpha(theme.accent, 0.5)}`, background: 'rgba(255,255,255,.5)',
        }} />

        <OpeningNames
          theme={theme} weddingData={weddingData} isCouple={isCouple} lang={lang}
          transform="uppercase" style={{ fontSize: 'clamp(19px, 5.6vw, 24px)', letterSpacing: '.12em' }}
        />
      </div>
    </OpeningFrame>
  )
}

export default function CrystalGlassTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="crystal-glass"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      design={{
        radius: 2,
        buttonRadius: 0,
        align: 'center',
        headingTransform: 'uppercase',
        kicker: '.2em',
        dark: false,
        alternate: true,
        /* Location — OSM tile mozaikasının şablona məxsus emalı */
        map: { opacity: 0.45, filter: 'grayscale(1) brightness(1.2) contrast(.8)', tintOpacity: 0.35 },
        headingColor: TH.text,
      }}
    />
  )
}
