import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { OpeningNames } from '../_shared/OpeningFrame'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   NATURE TOUCH — Claude Design · t7

   Design story: şəhərdən kənar toy (Qəbələ, Şəki, Qusar). Kətan toxuması,
   meşə yaşılı, terrakota. Açılış: kətan qatı yuxarı qalxır — pərdə kimi.
   Kompozisiya: mərkəzdə şaquli xətt + serif adlar, altda yerin adı.

   ⚠ Rənglər theme token-lərindən (templateConfig · nature-touch).
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('nature-touch')

const KEYFRAMES = `
@keyframes tpl-hint { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq   { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes nt-grow  { from { transform: scaleY(0) } to { transform: scaleY(1) } }
`

/* Kətan toxuması — iki istiqamətli incə xətt şəbəkəsi (şəkil yüklənmir) */
function LinenTexture({ theme, opacity = 0.5 }) {
  return (
    <span style={{
      position: 'absolute', inset: 0, opacity, pointerEvents: 'none',
      backgroundImage:
        `repeating-linear-gradient(0deg, ${alpha(theme.primary, 0.05)} 0 1px, transparent 1px 4px),` +
        `repeating-linear-gradient(90deg, ${alpha(theme.primary, 0.05)} 0 1px, transparent 1px 4px)`,
    }} />
  )
}

function Opening(props) {
  const { theme, weddingData, isCouple, lang } = props
  const place = weddingData.venueName ? String(weddingData.venueName).split(',').pop().trim() : ''

  return (
    <OpeningFrame
      {...props}
      exit="curtain"
      duration={850}
      label="Dəvətnaməni aç"
      background={`linear-gradient(165deg, ${theme.background}, ${theme.surface})`}
    >
      <LinenTexture theme={theme} />

      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 'clamp(9px, 2.6vw, 10px)', letterSpacing: '.3em', textTransform: 'uppercase', color: theme.muted }}>
          Açıq havada toy
        </div>

        {/* Şaquli xətt — aşağıdan böyüyür */}
        <span style={{
          display: 'block', width: 1, height: 'clamp(30px, 8vw, 42px)', background: theme.primary,
          margin: 'clamp(18px, 5vw, 24px) auto', transformOrigin: 'top',
          animation: 'nt-grow .8s cubic-bezier(.22,1,.36,1) forwards',
        }} />

        <OpeningNames theme={theme} weddingData={weddingData} isCouple={isCouple} lang={lang} />

        {place && (
          <div style={{ fontSize: 9, letterSpacing: '.26em', textTransform: 'uppercase', color: theme.accent, marginTop: 10 }}>
            {place}
          </div>
        )}
      </div>
    </OpeningFrame>
  )
}

export default function NatureTouchTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="nature-touch"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      ambient={
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <LinenTexture theme={TH} opacity={0.7} />
        </div>
      }
      design={{
        radius: 10,
        buttonRadius: 100,
        align: 'center',
        headingTransform: 'none',
        kicker: '.3em',
        dark: false,
        alternate: true,
        motion: 'settle',
        headingColor: TH.text,
      }}
    />
  )
}
