import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { OpeningNames } from '../_shared/OpeningFrame'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   ORIENTAL LUXE — Claude Design · t6

   Design story: Azərbaycan toyunun öz dili — buta, girih, nar rəngi — 2025
   interfeys disiplini ilə. Ənənəvi motivlər ornament kimi deyil, sistem kimi.
   Açılış: girih naxışı mərkəzdən açılır, romb monoqram 45°→0° dönür.

   Design mobil qeydi: pattern tile 18px-dən kiçik olmamalı (moiré) → 18px.
   Amiri başlıq üçün, body Jost (theme.fonts).

   ⚠ Rənglər theme token-lərindən (templateConfig · oriental-luxe).
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('oriental-luxe')

const KEYFRAMES = `
@keyframes tpl-hint  { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes ol-turn   { from { transform: rotate(45deg) scale(.9) } to { transform: rotate(0deg) scale(1) } }
@keyframes ol-iris   { from { clip-path: circle(0% at 50% 50%) } to { clip-path: circle(150% at 50% 50%) } }
`

/* Girih nöqtə şəbəkəsi — 18px tile (design mobil qeydi) */
function GirihPattern({ theme, opacity = 0.22 }) {
  return (
    <span style={{
      position: 'absolute', inset: 0, opacity, pointerEvents: 'none',
      backgroundImage: `radial-gradient(circle at 50% 50%, ${theme.accent} 1px, transparent 1.6px)`,
      backgroundSize: '18px 18px',
    }} />
  )
}

function Opening(props) {
  const { theme, weddingData, isCouple, lang } = props
  const initials = isCouple
    ? `${(weddingData.groomName || '?')[0]}&${(weddingData.brideName || '?')[0]}`.toUpperCase()
    : ((weddingData.eventName || weddingData.brideName || '·')[0] || '·').toUpperCase()

  return (
    <OpeningFrame {...props} exit="iris" duration={950} label="Dəvətnaməni aç" background={theme.primary}>
      <GirihPattern theme={theme} />

      <div style={{ position: 'relative', animation: 'ol-iris .9s ease-out' }}>
        <div style={{ fontSize: 'clamp(10px, 2.6vw, 10px)', letterSpacing: '.2em', textTransform: 'uppercase', color: alpha(theme.accent, 0.8), marginBottom: 'clamp(20px, 6vw, 28px)' }}>
          Toy mərasiminə dəvət
        </div>

        {/* Romb monoqram — 45°→0° dönür */}
        <div style={{
          width: 'clamp(64px, 20vw, 84px)', height: 'clamp(64px, 20vw, 84px)', margin: '0 auto clamp(20px, 6vw, 28px)',
          border: `1px solid ${alpha(theme.accent, 0.6)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'ol-turn 1s cubic-bezier(.22,1,.36,1) forwards',
        }}>
          <span style={{ fontFamily: theme.fonts?.heading, fontSize: 'clamp(17px, 5vw, 21px)', color: theme.accent }}>{initials}</span>
        </div>

        <OpeningNames theme={theme} weddingData={weddingData} isCouple={isCouple} lang={lang} />
      </div>
    </OpeningFrame>
  )
}

export default function OrientalLuxeTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="oriental-luxe"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      ambient={
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <GirihPattern theme={TH} opacity={0.1} />
        </div>
      }
      design={{
        radius: 4,
        buttonRadius: 0,
        align: 'center',
        headingTransform: 'none',
        kicker: '.2em',
        dark: true,
        alternate: true,
        /* Location — OSM tile mozaikasının şablona məxsus emalı */
        map: { opacity: 0.45, filter: 'grayscale(1) brightness(.45) contrast(1.2)', tintOpacity: 0.55 },
        headingColor: TH.text,
        accentColor: TH.accent,
        ctaBg: TH.accent,
        ctaText: TH.primary,
      }}
    />
  )
}
