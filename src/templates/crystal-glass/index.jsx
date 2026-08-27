import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { Kicker, NameRow, Ornament, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'

/* ─────────────────────────────────────────────────────────────────────────────
   CRYSTAL GLASS — Claude Design · t8

   Design dili: kristal refraksiya, şüşə effekti, platin aksentlər.

   «Açılış Ekranı düzəliş V1»: açılış artıq şüşə kart deyil — BRİLYANTIN
   ÖZÜDÜR. Buzlu pərdə əriyir, ekranın üstündən işıq sürüşür, arxada prizma
   halqası fırlanır, dörd kvadrat növbə ilə fırlanaraq kristal şəbəkəsini
   qurur — mərkəzdə kəsilmiş daş yerinə oturur və üzərindən parıltı keçir.
   Daxili fonda prizma dumanı və havada asılı kristal qırıqları var.

   ⚠ Ambient `blend: none` — qatın öz içində `soft-light` şüa qatları var,
   bütün qata blend verilsə onlar ikiqat hesablanardı.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('crystal-glass')

/* Design t8-in kristal aksenti — refraksiya mavisi (token accent-dən soyuqdur) */
const ICE = '#7C9FBA'
const INK = '#2D3B47'

const KEYFRAMES = `
@keyframes tpl-hint   { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq     { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes cg-shimmer { 0% { transform: translateX(-120%) skewX(-14deg) } 100% { transform: translateX(320%) skewX(-14deg) } }
@keyframes cr-in      { from { opacity:0; transform: rotate(-46deg) scale(.35) } to { opacity:1; transform: rotate(0) scale(1) } }
@keyframes cr-prism   { 0% { opacity:0 } 45% { opacity:.5 } 100% { opacity:0 } }
@keyframes cr-rot     { from { transform: translate(-50%,-50%) rotate(0) } to { transform: translate(-50%,-50%) rotate(360deg) } }
`

/* Prizma çeşidi — ambient dumanında və açılışın arxa halqasında eynidir */
const PRISM = 'rgba(190,150,220,.22), rgba(150,200,230,.22), rgba(220,190,160,.2), rgba(190,150,220,.22)'

/* Brilyant — yuxarıdan tac, aşağıdan pavilyon, üzərindən parıltı keçir */
function Diamond() {
  return (
    <div style={{
      position: 'relative', width: 92, height: 96, marginInline: 'auto',
      animation: 'tpl-cta 1.4s cubic-bezier(.2,.9,.25,1) 2.1s both',
    }}>
      {/* Daşın masaya saldığı kölgə */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', bottom: -4, width: 104, height: 20, marginLeft: -52,
        background: `radial-gradient(ellipse at 50% 50%, ${alpha(ICE, 0.45)}, transparent 70%)`,
        filter: 'blur(6px)',
      }} />
      {/* Prizma nəfəsi — daşın ətrafında arabir yanıb sönür */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: -22, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,.9), transparent 62%)',
        animation: 'cr-prism 6s ease-in-out 3s infinite',
      }} />

      <svg viewBox="0 0 96 100" width="92" height="96" fill="none" aria-hidden="true" style={{ position: 'relative', display: 'block' }}>
        <defs>
          <linearGradient id="cgCrown" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity=".96" />
            <stop offset=".45" stopColor="#DCE9F2" stopOpacity=".85" />
            <stop offset="1" stopColor="#A8C3D6" stopOpacity=".7" />
          </linearGradient>
          <linearGradient id="cgPav" x1=".2" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#E8F2F8" stopOpacity=".9" />
            <stop offset=".55" stopColor="#9FBED4" stopOpacity=".78" />
            <stop offset="1" stopColor="#5E86A3" stopOpacity=".62" />
          </linearGradient>
          <linearGradient id="cgTable" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E3EEF5" />
          </linearGradient>
          <linearGradient id="cgSpec" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset=".5" stopColor="#FFFFFF" stopOpacity=".85" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d="M4 34 L92 34 L48 94 Z" fill="url(#cgPav)" />
        <path d="M30 6 L66 6 L92 34 L4 34 Z" fill="url(#cgCrown)" />
        <path d="M30 6 L66 6 L70 12 L26 12 Z" fill="url(#cgTable)" opacity=".9" />

        {/* Faset xətləri — daşın kəsimi */}
        <g stroke={alpha(ICE, 0.5)} strokeWidth=".8" strokeLinejoin="round">
          <path d="M4 34 L92 34" />
          <path d="M30 6 L17 34 M66 6 L79 34 M39 6 L26 34 M57 6 L70 34 M48 6 L48 34" />
          <path d="M17 34 L48 94 M35 34 L48 94 M48 34 L48 94 M61 34 L48 94 M79 34 L48 94" />
        </g>

        <path d="M30 6 L66 6 L92 34 L4 34 Z" fill="none" stroke={ICE} strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M4 34 L92 34 L48 94 Z" fill="none" stroke={ICE} strokeWidth="1.1" strokeLinejoin="round" />
        <path d="M4 34 L92 34" stroke="#FFFFFF" strokeWidth="1.6" opacity=".85" />
        <path d="M30 6 L66 6" stroke="#FFFFFF" strokeWidth="1.4" opacity=".9" />

        {/* Üzərindən keçən parıltı */}
        <rect
          x="-46" y="4" width="34" height="92" fill="url(#cgSpec)" transform="skewX(-16)"
          style={{ animation: 'tpl-gleam 5.6s ease-in-out 3.4s infinite' }}
        />
      </svg>
    </div>
  )
}

function Opening(props) {
  const { theme, weddingData, isCouple } = props

  /* Design t8 tarixi rəqəmlərlə, nöqtə ayırıcı ilə verir: «21 · 11 · 2026» */
  const dateStr = (weddingData.date || '').split('-').reverse().join(' · ')

  return (
    <OpeningFrame
      {...props}
      exit="zoom"
      duration={900}
      label="Dəvətnaməni aç"
      ctaDelay={4.1}
      hintDelay={4.6}
      ctaStyle={{
        border: `1px solid ${alpha(ICE, 0.55)}`,
        color: INK, background: 'rgba(255,255,255,.6)',
      }}
      ctaGleam="rgba(255,255,255,.95)"
      hintColor="rgba(122,139,153,.9)"
      orbs="none"
      veil="#E9F0F6"
      background="linear-gradient(150deg, #F4F8FB, #D6E3ED 54%, #EAF1F6)"
    >
      {/* Buzun üzərindən sürüşən işıq */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(100deg, transparent 36%, rgba(255,255,255,.95) 50%, transparent 64%)',
        animation: 'cg-shimmer 7s linear 1.4s infinite',
      }} />

      {/* Prizma dumanı — arxada çox yavaş fırlanır */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%,-50%)',
        width: 'min(84vw, 290px)', height: 'min(84vw, 290px)', borderRadius: '50%', pointerEvents: 'none',
        background: `conic-gradient(from 0deg, ${PRISM})`,
        filter: 'blur(34px)', animation: 'cr-rot 44s linear infinite',
      }} />

      {/* Kristal şəbəkəsi — dörd kvadrat növbə ilə fırlanaraq yerinə düşür */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%,-50%)',
        width: 150, height: 150, pointerEvents: 'none',
      }}>
        {[0, 45, 90, 135].map((deg, i) => (
          <span key={deg} style={{ position: 'absolute', inset: 0, transform: `rotate(${deg}deg)` }}>
            <span style={{
              display: 'block', width: '100%', height: '100%',
              border: `1px solid ${alpha(ICE, 0.32)}`,
              animation: `cr-in 1.5s cubic-bezier(.2,.9,.25,1) ${(0.9 + i * 0.18).toFixed(2)}s both`,
            }} />
          </span>
        ))}
      </span>

      {/* Çox yavaş dönən platin halqa */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '44%', width: 190, height: 190,
        borderRadius: '50%', border: `1px solid ${alpha(ICE, 0.2)}`, pointerEvents: 'none',
        animation: 'tpl-slowring 90s linear infinite',
      }} />

      <div style={{ position: 'relative' }}>
        <Diamond />

        <Kicker text="Dəvətnamə" color="#7A8B99" delay={2.5} style={{ marginTop: 28 }} />

        <NameRow
          theme={theme} weddingData={weddingData} isCouple={isCouple}
          delay={2.9} step={0.2}
          size="clamp(24px, 8.5vw, 34px)" ampSize="clamp(24px, 8.5vw, 34px)"
          color={INK} ampColor={ICE}
          style={{ marginTop: 18, letterSpacing: '.1em', textTransform: 'uppercase', lineHeight: 1.2 }}
        />

        <Ornament color={ICE} mark="rhomb" delay={3.6} width={30} style={{ marginTop: 18 }} />

        <OpeningMeta text={dateStr} color="#7A8B99" delay={3.8} style={{ marginTop: 14, letterSpacing: '.26em' }} />
      </div>
    </OpeningFrame>
  )
}

/* Havada asılı kristal qırıqları — çox yavaş çevrilib parıldayırlar */
const SHARDS = [
  { left: '12%', top: '14%', rot: -18, w: 16, dur: 9, delay: 0 },
  { left: '78%', top: '26%', rot: 24, w: 22, dur: 12, delay: 2 },
  { left: '34%', top: '58%', rot: 40, w: 14, dur: 10, delay: 5 },
  { left: '88%', top: '68%', rot: -32, w: 18, dur: 13, delay: 3.5 },
  { left: '56%', top: '86%', rot: 12, w: 20, dur: 11, delay: 7 },
]

/* Səhifə boyu sürüşən refraksiya şüaları */
const BEAMS = [
  { gradient: 'linear-gradient(108deg, transparent 42%, rgba(255,255,255,.55) 50%, transparent 58%)', opacity: 0.32, dur: 12, delay: 0, reverse: false },
  { gradient: 'linear-gradient(96deg, transparent 45%, rgba(150,200,230,.42) 50%, rgba(220,190,160,.34) 53%, transparent 59%)', opacity: 0.3, dur: 17, delay: 6, reverse: true },
]

export default function CrystalGlassTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="crystal-glass"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      /* Daxili arxa fon — prizma dumanı, kristal qırıqları, refraksiya şüaları */
      ambientBlend="none"
      ambient={
        <Ambient>
          <span style={{
            position: 'absolute', left: '50%', top: '34%', width: 400, height: 400,
            margin: '-200px 0 0 -200px', borderRadius: '50%', opacity: 0.34,
            background: 'conic-gradient(from 0deg, rgba(190,150,220,.28), rgba(150,200,230,.28), rgba(220,190,160,.24), rgba(160,220,205,.24), rgba(190,150,220,.28))',
            filter: 'blur(48px)', animation: 'ab-rot 30s linear infinite',
          }} />

          {SHARDS.map((s, i) => (
            <span key={i} style={{
              position: 'absolute', left: s.left, top: s.top, transform: `rotate(${s.rot}deg)`,
              animation: `ab-shard ${s.dur}s ease-in-out ${s.delay}s infinite`,
            }}>
              <svg viewBox="0 0 20 30" width={s.w} height={s.w * 1.5} fill="none" aria-hidden="true">
                <path d="M10 0 L19 11 L10 30 L1 11 Z" fill="rgba(255,255,255,.34)" stroke={alpha(ICE, 0.34)} strokeWidth=".7" />
                <path d="M1 11 H19 M10 0 L6 11 L10 30 M10 0 L14 11 L10 30" stroke={alpha(ICE, 0.32)} strokeWidth=".5" />
              </svg>
            </span>
          ))}

          {BEAMS.map((b, i) => (
            <span key={i} style={{
              position: 'absolute', left: '-40%', top: '-40%', width: '180%', height: '180%',
              opacity: b.opacity, mixBlendMode: 'soft-light', background: b.gradient,
              animation: `ab-diag ${b.dur}s cubic-bezier(.45,0,.55,1) ${b.delay}s infinite${b.reverse ? ' reverse' : ''}`,
            }} />
          ))}
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
        map: { opacity: 0.45, filter: 'grayscale(1) brightness(1.2) contrast(.8)', tintOpacity: 0.35 },
        headingColor: TH.text,
      }}
    />
  )
}
