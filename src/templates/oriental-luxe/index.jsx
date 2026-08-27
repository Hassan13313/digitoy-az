import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { Kicker, NameRow, Ornament, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient, Blob, Particles, RotRing } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'
import { formatFullDateByLang } from '../../utils/dateFormat'

/* ─────────────────────────────────────────────────────────────────────────────
   ORIENTAL LUXE — Claude Design · t6

   Design story: Azərbaycan toyunun öz dili — buta, girih, nar rəngi — 2025
   interfeys disiplini ilə. Ənənəvi motivlər ornament kimi deyil, sistem kimi.

   «Açılış Ekranı düzəliş V1»: açılış artıq MEHRAB TAĞIDIR. Nar rəngi pərdə
   əriyir, iki tağ konturu mərkəzdən yanlara açılır (or-open), lampa işığı
   nəfəs alır, romb monoqram fırlanaraq yerinə oturur (or-spin) — sonra adlar.
   Daxili fonda girih halqaları dönür, ulduzlar tağın ətrafında dolanır.

   Design mobil qeydi: pattern tile 18px-dən kiçik olmamalı (moiré) → 18px.

   ⚠ Rənglər theme token-lərindən (templateConfig · oriental-luxe).
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('oriental-luxe')

const KEYFRAMES = `
@keyframes tpl-hint { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq   { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes or-open  { from { clip-path: inset(0 50% 0 50%) } to { clip-path: inset(0 0 0 0) } }
@keyframes or-spin  { from { opacity:0; transform:translate(-50%,-50%) rotate(-110deg) scale(.45) } to { opacity:1; transform:translate(-50%,-50%) rotate(0) scale(1) } }
@keyframes or-lamp  { 0%,100% { opacity:.4 } 50% { opacity:.85 } }
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

/* Səkkizguşəli girih ulduzu — ambient orbitində dolanır */
function GirihStar({ size, color, duration, delay }) {
  return (
    <span style={{
      position: 'absolute', left: '50%', top: '38%', width: size, height: size,
      margin: `${-size / 2}px 0 0 ${-size / 2}px`,
      animation: `ab-orbit ${duration}s linear ${delay}s infinite`,
    }}>
      <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke={color} strokeWidth=".8" aria-hidden="true">
        <path d="M16 2 L22 10 L30 16 L22 22 L16 30 L10 22 L2 16 L10 10 Z" />
        <path d="M16 8 L20 13 L25 16 L20 19 L16 24 L12 19 L7 16 L12 13 Z" />
      </svg>
    </span>
  )
}

function Opening(props) {
  const { theme, weddingData, isCouple, lang } = props
  const initials = isCouple
    ? `${(weddingData.groomName || '?')[0]}&${(weddingData.brideName || '?')[0]}`.toLocaleUpperCase('az')
    : ((weddingData.eventName || weddingData.brideName || '·')[0] || '·').toLocaleUpperCase('az')

  const place = weddingData.venueName ? String(weddingData.venueName).split(',').pop().trim() : ''

  /* Mehrab tağı — yuxarısı yarımdairə, aşağısı düz künc */
  const arch = (w, h, r, border, delay) => ({
    position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
    width: w, height: h, maxWidth: '72vw', pointerEvents: 'none',
    border: `1px solid ${border}`, borderRadius: `${r}px ${r}px 6px 6px`,
    animation: `or-open 1.5s cubic-bezier(.22,.61,.36,1) ${delay}s both`,
  })

  return (
    <OpeningFrame
      {...props}
      exit="iris"
      duration={950}
      label="Dəvətnaməni aç"
      ctaDelay={4.3}
      hintDelay={4.8}
      ctaStyle={{
        border: `1px solid ${alpha(theme.accent, 0.55)}`,
        color: theme.text, background: alpha(theme.accent, 0.1),
      }}
      orbs="none"
      veil={theme.background}
      background={`radial-gradient(120% 82% at 50% 38%, ${theme.secondary}, ${theme.background} 76%)`}
    >
      <GirihPattern theme={theme} opacity={0.14} />

      {/* Vinyet — diqqəti tağın içinə yığır */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: 'min(84vw, 300px)', height: 420, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 50%, ${alpha(theme.background, 0.82)}, transparent 72%)`,
      }} />

      {/* Lampa işığı — nəfəs alır */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '42%', transform: 'translate(-50%,-50%)',
        width: 'min(92vw, 330px)', height: 'min(92vw, 330px)', borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, ${alpha(theme.accent, 0.26)}, transparent 68%)`,
        filter: 'blur(28px)', animation: 'or-lamp 7s ease-in-out 1.2s infinite',
      }} />

      <span style={arch(236, 400, 118, alpha(theme.accent, 0.4), 0.7)} />
      <span style={arch(212, 376, 106, alpha(theme.accent, 0.2), 0.95)} />

      <div style={{ position: 'relative' }}>
        {/* Romb monoqram — iki kvadrat fırlanaraq üst-üstə düşür */}
        <div style={{ position: 'relative', width: 64, height: 64, margin: '0 auto' }}>
          <span style={{
            position: 'absolute', left: '50%', top: '50%', width: 64, height: 64,
            border: `1px solid ${alpha(theme.accent, 0.55)}`,
            transform: 'translate(-50%,-50%) rotate(45deg)',
            animation: 'or-spin 1.5s cubic-bezier(.2,.9,.25,1) 1.8s both',
          }} />
          <span style={{
            position: 'absolute', left: '50%', top: '50%', width: 64, height: 64,
            border: `1px solid ${alpha(theme.accent, 0.35)}`,
            transform: 'translate(-50%,-50%)',
            animation: 'or-spin 1.5s cubic-bezier(.2,.9,.25,1) 2s both',
          }} />
          <span style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: theme.fonts?.heading, fontSize: 17, lineHeight: 1, color: theme.text,
            animation: 'tpl-cta 1s ease-out 2.6s both',
          }}>
            {initials}
          </span>
        </div>

        <Kicker text={props.eventLabel} color={theme.muted} delay={2.8} style={{ marginTop: 30 }} />

        <NameRow
          theme={theme} weddingData={weddingData} isCouple={isCouple}
          delay={3.1} step={0.2}
          size="clamp(26px, 9.5vw, 36px)" ampSize="clamp(17px, 6vw, 23px)"
          color={theme.text} ampColor={theme.accent}
          style={{ marginTop: 20, lineHeight: 1.3 }}
        />

        <Ornament color={theme.accent} mark="rhomb" delay={3.8} width={26} gap={8} style={{ marginTop: 18 }} />

        <OpeningMeta
          text={[formatFullDateByLang(weddingData.date, lang), place].filter(Boolean).join(' · ')}
          color={theme.muted} delay={4} style={{ marginTop: 14 }}
        />
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
      /* Daxili arxa fon — lampa işığı, dönən girih halqaları, orbitdə ulduzlar */
      ambientBlend="screen"
      ambient={
        <Ambient>
          <span style={{
            position: 'absolute', left: '50%', top: '-14%', width: 320, height: 320, marginLeft: -160,
            borderRadius: '50%', background: `radial-gradient(circle, ${alpha(TH.accent, 0.4)}, transparent 66%)`,
            filter: 'blur(38px)', animation: 'ab-pulse 5.5s ease-in-out infinite',
          }} />
          <Blob color="rgba(199,124,88,.24)" right="-22%" bottom="10%" w="66%" h="30%" blur={44} duration={24} delay={7} reverse />
          <RotRing color={alpha(TH.accent, 0.16)} size={330} duration={48} dashed />
          <RotRing color={alpha(TH.accent, 0.1)} size={230} duration={38} reverse />
          <GirihStar size={26} color="rgba(232,201,138,.5)" duration={26} delay={0} />
          <GirihStar size={20} color="rgba(232,201,138,.35)" duration={34} delay={8} />
          <GirihStar size={16} color="rgba(232,201,138,.3)" duration={44} delay={16} />
          <Particles kind="up" count={4} color="#E8C98A" size={2} seed={13} minDur={13} maxDur={16} />
        </Ambient>
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
