import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { Gleam, NameRow, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient, Blob, Particles } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   WHITE ELEGANCE — Claude Design · t4

   Design story: ağ kağız, qabartma çap, heç nə artıq deyil. «Az, amma bahalı».

   «Açılış Ekranı düzəliş V1»: açılış artıq ekran deyil — MASANIN ÜSTÜNDƏKİ
   KARTDIR. Ağ pərdə əriyir, kart yuxarıdan basılıb yerinə oturur (we-press),
   monoqram hərf aralığı yığılaraq görünür (we-mono), üzərindən kağız işığı
   keçir. Adlar sətir-sətir qalxır. Daxili fon isə kağız tozu və isti kölgə.

   ⚠ Rənglər theme token-lərindən (templateConfig · white-elegance).
   ⚠ Ambient `multiply` rejimindədir — açıq şablonda yalnız kölgələyir.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('white-elegance')

const KEYFRAMES = `
@keyframes tpl-hint { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq   { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes we-press { from { opacity:0; transform:scale(1.07); filter:blur(6px) } to { opacity:1; transform:scale(1); filter:blur(0) } }
@keyframes we-mono  { from { opacity:0; transform:scale(1.6); letter-spacing:.6em } to { opacity:1; transform:scale(1); letter-spacing:.1em } }
`

function Opening(props) {
  const { theme, weddingData, isCouple } = props
  const initials = isCouple
    ? `${(weddingData.groomName || '?')[0]}&${(weddingData.brideName || '?')[0]}`.toLocaleUpperCase('az')
    : ((weddingData.eventName || weddingData.brideName || '·')[0] || '·').toLocaleUpperCase('az')

  /* Design t4 tarixi rəqəmlərlə, nöqtə ayırıcı ilə verir: «21 · 11 · 2026» */
  const dateStr = (weddingData.date || '').split('-').reverse().join(' · ')

  return (
    <OpeningFrame
      {...props}
      exit="fade"
      duration={850}
      hint="toxunun"
      hintDelay={4.1}
      orbs="none"
      veil={theme.background}
      background={`radial-gradient(120% 80% at 50% 20%, ${theme.primary}, #EDEAE4 78%)`}
    >
      {/* Kağızın üstünə düşən yumşaq işıq */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '46%', width: 'min(84vw, 300px)', height: 'min(84vw, 300px)',
        transform: 'translate(-50%,-50%)', borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, ${alpha(theme.primary, 0.95)}, transparent 66%)`,
        filter: 'blur(24px)', animation: 'tpl-halo 11s ease-in-out 1s infinite',
      }} />

      {/* Kart — basılıb yerinə oturur */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 300,
        background: theme.primary, padding: 'clamp(34px, 11vw, 46px) clamp(22px, 8vw, 30px)',
        boxShadow: '0 40px 90px rgba(90,80,70,.14), 0 2px 6px rgba(0,0,0,.04)',
        overflow: 'hidden',
        animation: 'we-press 1.4s cubic-bezier(.22,.61,.36,1) .7s both',
      }}>
        {/* Qabartma çərçivə */}
        <span style={{
          position: 'absolute', inset: 10, border: `1px solid ${alpha(theme.accent, 0.28)}`,
          pointerEvents: 'none', animation: 'tpl-rise 1s ease-out 1.6s both',
        }} />
        <Gleam delay={2.6} duration={5.5} width="40%" color={alpha(theme.primary, 0.9)} />

        <div style={{
          position: 'relative', fontFamily: theme.fonts?.heading,
          fontSize: 'clamp(19px, 6vw, 22px)', letterSpacing: '.1em', color: theme.accent,
          animation: 'we-mono 1.3s cubic-bezier(.22,.61,.36,1) 1.5s both',
        }}>
          {initials}
        </div>

        <span style={{
          display: 'block', position: 'relative', width: 24, height: 1, margin: '16px auto',
          background: alpha(theme.accent, 0.5), transformOrigin: '50% 50%',
          animation: 'tpl-drawx .9s ease-out 2.1s both',
        }} />

        <div style={{
          position: 'relative', fontSize: 'clamp(9px, 2.5vw, 9.5px)', letterSpacing: '.4em',
          textTransform: 'uppercase', color: alpha(theme.muted, 0.85),
          animation: 'tpl-rise .9s ease-out 2.3s both',
        }}>
          Dəvətnamə
        </div>

        <NameRow
          theme={theme} weddingData={weddingData} isCouple={isCouple}
          stacked delay={2.6} step={0.2}
          size="clamp(24px, 8vw, 30px)" ampSize="clamp(16px, 5vw, 20px)"
          color={theme.text} ampColor={theme.accent}
          style={{ position: 'relative', marginTop: 20 }}
        />

        <OpeningMeta
          text={dateStr} delay={3.3} color={alpha(theme.muted, 0.85)}
          style={{ position: 'relative', marginTop: 22, letterSpacing: '.26em' }}
        />

        {/* CTA — design-də düz künclü çərçivə, kartın enində */}
        <div style={{
          position: 'relative', overflow: 'hidden', marginTop: 30,
          border: `1px solid ${alpha(theme.accent, 0.45)}`, padding: '13px 8px',
          fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', color: theme.text,
          animation: 'tpl-cta .9s cubic-bezier(.22,.61,.36,1) 3.6s both',
        }}>
          <Gleam delay={4.8} width="38%" color={alpha(theme.accent, 0.2)} />
          <span style={{ position: 'relative' }}>Dəvətnaməni aç</span>
        </div>
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
      /* Daxili arxa fon — isti kağız kölgəsi və havada asılı toz zərrəcikləri */
      ambientBlend="multiply"
      ambient={
        <Ambient>
          <Blob color={alpha(TH.accent, 0.2)} left="-16%" top="6%" w="70%" h="32%" blur={42} duration={21} />
          <Blob color={alpha(TH.muted, 0.18)} right="-18%" bottom="12%" w="62%" h="28%" blur={44} duration={26} delay={9} reverse />
          <span style={{
            position: 'absolute', left: '-20%', top: '14%', width: '140%', opacity: 0.55,
            animation: 'ab-ribbon 11s ease-in-out infinite',
          }}>
            <svg viewBox="0 0 400 120" width="100%" height="120" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <path d="M0 60 C70 14 130 106 200 60 C270 14 330 106 400 60" stroke={alpha(TH.accent, 0.5)} strokeWidth="1.1" />
              <path d="M0 84 C70 38 130 130 200 84 C270 38 330 130 400 84" stroke={alpha(TH.accent, 0.25)} strokeWidth="1" />
            </svg>
          </span>
          <Particles kind="twinkle" count={10} color={alpha(TH.muted, 0.7)} size={5} seed={40} glow={false} minDur={7} maxDur={16} />
        </Ambient>
      }
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
