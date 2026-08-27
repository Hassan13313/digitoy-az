import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { NameRow, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient, Blob } from '../_shared/motion'
import { getTemplateTheme } from '../templateConfig'
import { formatFullDateByLang } from '../../utils/dateFormat'

/* ─────────────────────────────────────────────────────────────────────────────
   NATURE TOUCH — Claude Design · t7

   Design story: şəhərdən kənar toy (Qəbələ, Şəki, Qusar). Kətan toxuması,
   meşə yaşılı, terrakota.

   «Açılış Ekranı düzəliş V1»: açılış artıq açıq kətan deyil — AXŞAM MEŞƏSİDİR.
   Qonaq əvvəlcə tünd yaşıl alaqaranlığa düşür: aşağıdan otlar böyüyür və
   yellənir (nt-grow → nt-sway), yuxarıdan işıq düşür, mərkəzdə yarpaq nişanı
   yerinə oturur — sonra adlar qalxır. Dəvətnamənin İÇİ isə açıq qalır: qonaq
   qaranlıqdan işığa çıxır.

   ⚠ Açılışın tünd palitrası YALNIZ açılışdadır — daxili sxemin token-ləri
   (açıq kətan) toxunulmaz qalır.
   ⚠ Daxili fonda ağac kölgəsi (ab-sway) və düşən yarpaqlar `multiply` ilə.
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('nature-touch')

/* Design t7-nin açılış palitrası — meşə alaqaranlığı (yalnız açılış ekranı) */
const DUSK = { top: '#4C5B46', deep: '#2C3629', light: '#F2EFE6', sage: '#C7D2B4', mute: '#B6BEA8' }

const KEYFRAMES = `
@keyframes tpl-hint { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq   { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes nt-grow  { from { opacity:0; transform: translateY(24px) scaleY(.6) } to { opacity:1; transform: none } }
@keyframes nt-sway  { 0%,100% { transform: rotate(-3.5deg) } 50% { transform: rotate(3.5deg) } }
`

/* Yarpaq forması — bir küncü iti, biri yumru (design: `60% 0 60% 0`) */
function Leaf({ w, h, color, style = {} }) {
  return <span style={{ width: w, height: h, borderRadius: '60% 0 60% 0', background: color, ...style }} />
}

/* Aşağıdan böyüyən ot tarlası — üç sol, üç sağ, yanlarında yarpaqlar */
const BLADES = [
  { side: 'left', x: 18, h: 74, delay: 0.8, dur: 6 },
  { side: 'left', x: 44, h: 96, delay: 1.1, dur: 6.6 },
  { side: 'left', x: 70, h: 60, delay: 1.4, dur: 7.2 },
  { side: 'right', x: 18, h: 68, delay: 0.95, dur: 6.3 },
  { side: 'right', x: 44, h: 104, delay: 1.55, dur: 7.5 },
  { side: 'right', x: 70, h: 84, delay: 1.25, dur: 6.9 },
]
const SPROUTS = [
  { side: 'left', x: 26, y: 58, delay: 1.4, dur: 7.4 },
  { side: 'left', x: 58, y: 84, delay: 1.7, dur: 8 },
  { side: 'right', x: 58, y: 66, delay: 1.55, dur: 7.7 },
  { side: 'right', x: 30, y: 92, delay: 1.85, dur: 8.3 },
]

function Undergrowth() {
  return (
    <span aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1 }}>
      {BLADES.map((b, i) => (
        <span key={`b${i}`} style={{
          position: 'absolute', [b.side]: b.x, bottom: 0, width: 1, height: b.h,
          background: `linear-gradient(180deg, transparent, ${alpha(TH.background, 0.5)})`,
          transformOrigin: '50% 100%',
          animation: `nt-grow 1.4s cubic-bezier(.22,.61,.36,1) ${b.delay}s both,`
            + ` nt-sway ${b.dur}s ease-in-out ${b.delay + 1.2}s infinite`,
        }} />
      ))}
      {SPROUTS.map((s, i) => (
        <Leaf
          key={`s${i}`} w={14} h={22} color={alpha(TH.secondary, 0.55)}
          style={{
            position: 'absolute', [s.side]: s.x, bottom: s.y, transformOrigin: '0 100%',
            animation: `nt-grow 1.3s cubic-bezier(.22,.61,.36,1) ${s.delay}s both,`
              + ` nt-sway ${s.dur}s ease-in-out ${s.delay + 1.2}s infinite`,
          }}
        />
      ))}
    </span>
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
      ctaDelay={3.6}
      hintDelay={4.1}
      ctaStyle={{
        border: `1px solid ${alpha(theme.background, 0.45)}`,
        color: DUSK.light, background: alpha(theme.background, 0.09),
      }}
      ctaGleam={alpha(DUSK.light, 0.35)}
      hintColor={alpha(DUSK.mute, 0.85)}
      orbs="none"
      veil={theme.primary}
      background={`radial-gradient(120% 86% at 50% 24%, ${DUSK.top}, ${DUSK.deep} 78%)`}
    >
      {/* Kətan toxuması — alaqaranlıqda güclə sezilir */}
      <span aria-hidden="true" style={{
        position: 'absolute', inset: 0, opacity: 0.14, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(90deg, ${alpha(theme.background, 0.5)} 0 1px, transparent 1px 4px)`,
      }} />

      {/* Ağacların arasından düşən işıq */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '34%', transform: 'translate(-50%,-50%)',
        width: 'min(90vw, 320px)', height: 'min(90vw, 320px)', borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(240,230,200,.24), transparent 66%)',
        filter: 'blur(30px)', animation: 'tpl-halo 12s ease-in-out 1s infinite',
      }} />

      <Undergrowth />

      <div style={{ position: 'relative' }}>
        {/* Şaquli sarmaşıq — yuxarıdan sallanır */}
        <span style={{
          display: 'block', width: 1, height: 44, margin: '0 auto',
          background: `linear-gradient(180deg, transparent, ${alpha(theme.background, 0.6)})`,
          transformOrigin: '50% 0', animation: 'tpl-drawy 1.2s cubic-bezier(.22,.61,.36,1) 1s both',
        }} />

        {/* Yarpaq nişanı — dairənin içində yellənir */}
        <div style={{
          width: 44, height: 44, marginTop: 14, marginInline: 'auto', borderRadius: '50%',
          border: `1px solid ${alpha(theme.background, 0.45)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'tpl-cta 1.1s cubic-bezier(.2,.9,.25,1) 1.6s both',
        }}>
          <Leaf w={12} h={20} color="rgba(213,224,196,.75)" style={{ transformOrigin: '0 100%', animation: 'nt-sway 5.5s ease-in-out 2.4s infinite' }} />
        </div>

        <NameRow
          theme={theme} weddingData={weddingData} isCouple={isCouple}
          delay={2.4} step={0.2}
          size="clamp(28px, 10vw, 38px)" ampSize="clamp(18px, 6vw, 24px)"
          color={DUSK.light} ampColor={DUSK.sage}
          style={{ marginTop: 18, lineHeight: 1.22 }}
        />

        {/* Ornament — ortada yarpaq */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 18,
          animation: 'tpl-rise .9s ease-out 3.1s both',
        }}>
          <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, transparent, ${DUSK.sage})` }} />
          <Leaf w={9} h={14} color={DUSK.sage} />
          <span style={{ width: 30, height: 1, background: `linear-gradient(90deg, ${DUSK.sage}, transparent)` }} />
        </div>

        {/* Design t7-də əvvəl YER, sonra tarix gəlir — açıq havada toyun vurğusu */}
        <OpeningMeta
          text={[place, formatFullDateByLang(weddingData.date, lang)].filter(Boolean).join(' · ')}
          color={DUSK.mute} delay={3.3} style={{ marginTop: 14 }}
        />
      </div>
    </OpeningFrame>
  )
}

/* Ağac kölgəsi — yarpaqların arasından süzülən ləkəli işıq */
const DAPPLE = [
  '40px 26px at 18% 12%', '52px 30px at 72% 30%', '36px 24px at 40% 58%',
  '46px 28px at 84% 76%', '40px 26px at 12% 88%',
].map((spec, i) => `radial-gradient(ellipse ${spec}, rgba(90,104,80,${[0.16, 0.13, 0.15, 0.12, 0.14][i]}), transparent 70%)`).join(',')

/* Düşən yarpaqlar — hər biri fırlanaraq aşağı süzülür */
const FALLING_LEAVES = [
  { left: '10%', w: 13, dur: 12.35, delay: 0, fill: 'rgba(122,140,104,.5)' },
  { left: '32%', w: 16, dur: 15.2, delay: 5, fill: 'rgba(150,164,124,.45)' },
  { left: '54%', w: 14, dur: 13.3, delay: 10, fill: 'rgba(104,124,88,.5)' },
  { left: '74%', w: 18, dur: 17.1, delay: 3, fill: 'rgba(140,156,116,.42)' },
  { left: '90%', w: 15, dur: 14.25, delay: 14, fill: 'rgba(122,140,104,.45)' },
]

export default function NatureTouchTemplate(props) {
  return (
    <TemplateShell
      {...props}
      templateId="nature-touch"
      theme={TH}
      Opening={Opening}
      keyframes={KEYFRAMES}
      /* Daxili arxa fon — ağac kölgəsi, isti işıq və düşən yarpaqlar */
      ambientBlend="multiply"
      ambient={
        <Ambient>
          <span style={{
            position: 'absolute', inset: '-10%', opacity: 0.55,
            backgroundImage: DAPPLE, animation: 'ab-sway 7s ease-in-out infinite',
          }} />
          <Blob color="rgba(122,140,104,.2)" left="-16%" top="6%" w="70%" h="32%" blur={40} duration={22} />
          <Blob color="rgba(150,140,110,.18)" right="-18%" bottom="12%" w="64%" h="28%" blur={44} duration={27} delay={9} reverse />
          {FALLING_LEAVES.map((l, i) => (
            <span key={i} style={{
              position: 'absolute', left: l.left, top: '-12%',
              animation: `ab-leaf ${l.dur}s linear ${l.delay}s infinite`,
            }}>
              <svg viewBox="0 0 20 28" width={l.w} height={l.w * 1.4} fill="none" aria-hidden="true">
                <path d="M10 1 C17 8 18 18 10 27 C2 18 3 8 10 1 Z" fill={l.fill} />
                <path d="M10 3 V25" stroke="rgba(70,86,62,.35)" strokeWidth=".7" />
              </svg>
            </span>
          ))}
        </Ambient>
      }
      design={{
        radius: 10,
        buttonRadius: 100,
        align: 'center',
        headingTransform: 'none',
        kicker: '.2em',
        dark: false,
        alternate: true,
        /* Location — OSM tile mozaikasının şablona məxsus emalı */
        map: { opacity: 0.5, filter: 'grayscale(1) brightness(1.05) contrast(.95)', tintOpacity: 0.45 },
        headingColor: TH.text,
      }}
    />
  )
}
