import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { OpeningNames } from '../_shared/OpeningFrame'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   NIGHT SKY ROMANCE — Claude Design · t5

   Design story: toyun tarixindəki səma xəritəsi — "o gecə ulduzlar belə
   dayanmışdı". Açılış: ulduzlar tək-tək yanır (stagger), bürc xətti çəkilir,
   sonra kamera yaxınlaşır (scale 1→1.08).

   Design mobil qeydi: ulduz sayı mobil cihazda 40-dan çox olmasın (paint cost)
   → burada 28 ulduz, deterministik yerləşdirmə (render-dən-render sabit).

   ⚠ Rənglər theme token-lərindən (templateConfig · night-sky).
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('night-sky')

const KEYFRAMES = `
@keyframes tpl-hint    { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq      { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes ns-twinkle  { 0%,100% { opacity:.15 } 50% { opacity:.9 } }
@keyframes ns-rotate   { from { transform: rotate(0) } to { transform: rotate(360deg) } }
`

/* Deterministik ulduz sahəsi — hash əsaslı, hər render eyni (jitter yoxdur) */
function hash(n) { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x) }
const STARS = Array.from({ length: 28 }, (_, i) => ({
  left: `${(hash(i + 1) * 100).toFixed(2)}%`,
  top: `${(hash(i + 51) * 100).toFixed(2)}%`,
  size: hash(i + 101) > 0.75 ? 2.5 : 1.5,
  dur: (2.6 + hash(i + 151) * 2.8).toFixed(2),
  delay: (hash(i + 201) * 2.4).toFixed(2),
}))

function StarField({ theme, opacity = 1 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity }}>
      {STARS.map((s, i) => (
        <span key={i} style={{
          position: 'absolute', left: s.left, top: s.top,
          width: s.size, height: s.size, borderRadius: '50%', background: theme.accent,
          animation: `ns-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  )
}

function Opening(props) {
  const { theme, weddingData, isCouple, lang } = props
  return (
    <OpeningFrame
      {...props}
      exit="zoom"
      duration={1100}
      label="Dəvətnaməni aç"
      background={`radial-gradient(130% 100% at 50% 110%, ${theme.primary}, ${theme.background} 70%)`}
    >
      <StarField theme={theme} />

      {/* Yavaş dönən bürc dairəsi */}
      <span style={{
        position: 'absolute', width: 'min(78vw, 320px)', height: 'min(78vw, 320px)',
        border: `1px solid ${alpha(theme.accent, 0.16)}`, borderRadius: '50%',
        animation: 'ns-rotate 90s linear infinite', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 'clamp(9px, 2.6vw, 10px)', letterSpacing: '.3em', textTransform: 'uppercase', color: theme.muted, marginBottom: 'clamp(18px, 5vw, 24px)' }}>
          O gecə göy belə görünürdü
        </div>
        <OpeningNames theme={theme} weddingData={weddingData} isCouple={isCouple} lang={lang} />
        <div style={{ fontSize: 9, letterSpacing: '.24em', textTransform: 'uppercase', color: alpha(theme.accent, 0.7), marginTop: 10 }}>
          40°23′N · 49°52′E
        </div>
      </div>
    </OpeningFrame>
  )
}

export default function NightSkyTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="night-sky"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      ambient={
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <StarField theme={TH} opacity={0.55} />
        </div>
      }
      design={{
        radius: 14,
        buttonRadius: 100,
        align: 'center',
        headingTransform: 'none',
        kicker: '.32em',
        dark: true,
        alternate: true,
        motion: 'rise',
        headingColor: TH.text,
        accentColor: TH.accent,
        ctaBg: TH.accent,
        ctaText: TH.background,
      }}
    />
  )
}
