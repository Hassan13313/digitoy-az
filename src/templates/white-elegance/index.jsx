import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { OpeningNames } from '../_shared/OpeningFrame'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   WHITE ELEGANCE — Claude Design · t4

   Design story: ağ kağız, qabartma çap, heç nə artıq deyil. "Az, amma bahalı".
   Açılış: tam ağ kart, mərkəzdə monoqram dairəsi və caps adlar; kart yuxarı
   qaldırılır (y:-24px, kölgə 2x), sonra fade.
   Animasiya: ortaq motion sistemi (bax _shared/motion.jsx) — bu şablon
   yuxarıdan aşağı (down) girir, kağız kimi yerinə oturur.

   ⚠ Rənglər theme token-lərindən (templateConfig · white-elegance).
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('white-elegance')

const KEYFRAMES = `
@keyframes tpl-hint { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq   { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes we-draw  { from { stroke-dashoffset: 302 } to { stroke-dashoffset: 0 } }
`

function Monogram({ theme, weddingData, isCouple }) {
  const initials = isCouple
    ? `${(weddingData.groomName || '?')[0]}&${(weddingData.brideName || '?')[0]}`.toUpperCase()
    : ((weddingData.eventName || weddingData.brideName || '·')[0] || '·').toUpperCase()

  return (
    <div style={{ position: 'relative', width: 96, height: 96, margin: '0 auto clamp(20px, 5vw, 28px)' }}>
      <svg width="96" height="96" viewBox="0 0 96 96" style={{ position: 'absolute', inset: 0 }}>
        <circle
          cx="48" cy="48" r="47" fill="none"
          stroke={alpha(theme.accent, 0.55)} strokeWidth="1"
          strokeDasharray="302" style={{ animation: 'we-draw .9s ease-out forwards' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: theme.fonts?.heading, fontSize: 24, letterSpacing: '.06em', color: theme.accent,
      }}>
        {initials}
      </div>
    </div>
  )
}

function Opening(props) {
  const { theme, weddingData, isCouple, lang } = props
  return (
    <OpeningFrame
      {...props}
      exit="fade"
      duration={850}
      label="Dəvətnaməni aç"
      background={theme.primary /* saf ağ kart */}
    >
      <div style={{
        background: theme.surface, borderRadius: 2,
        padding: 'clamp(30px, 9vw, 46px) clamp(24px, 8vw, 44px)',
        boxShadow: `0 24px 60px ${alpha(theme.text, 0.10)}`,
        border: `1px solid ${alpha(theme.accent, 0.2)}`,
        maxWidth: 380, width: '100%',
      }}>
        <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: theme.muted, marginBottom: 'clamp(18px, 5vw, 26px)' }}>
          Dəvətnamə
        </div>
        <Monogram theme={theme} weddingData={weddingData} isCouple={isCouple} />
        <OpeningNames theme={theme} weddingData={weddingData} isCouple={isCouple} lang={lang} transform="uppercase" style={{ fontSize: 'clamp(20px, 6vw, 26px)', letterSpacing: '.12em' }} />
      </div>
    </OpeningFrame>
  )
}

export default function WhiteEleganceTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="white-elegance"
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
        map: { opacity: 0.42, filter: 'grayscale(1) brightness(1.28) contrast(.78)', tintOpacity: 0.3 },
        headingColor: TH.text,
        accentColor: TH.accent,
        ctaBg: TH.text,
        ctaText: TH.primary,
      }}
    />
  )
}
