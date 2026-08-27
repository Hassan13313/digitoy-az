import TemplateShell, { alpha } from '../_shared/TemplateShell'
import OpeningFrame, { Kicker, NameRow, Ornament, OpeningMeta } from '../_shared/OpeningFrame'
import { Ambient, Blob, Particles } from '../_shared/motion'
import { parseLatLon } from '../_shared/geo'
import { getTemplateTheme } from '../templateConfig'
import { formatFullDateByLang } from '../../utils/dateFormat'

/* ─────────────────────────────────────────────────────────────────────────────
   NIGHT SKY ROMANCE — Claude Design · t5

   Design story: toyun tarixindəki səma xəritəsi — «o gecə ulduzlar belə
   dayanmışdı».

   «Açılış Ekranı düzəliş V1»: açılış indi bir HADİSƏ kimi gedir. Aşağıdan ay
   işığı qalxır, ulduzlar tək-tək yanır (ns-pop), sonra aralarında bürc xətti
   ÇƏKİLİR (ns-draw), yalnız bundan sonra adlar görünür. Daxili fonda isə
   ulduz tozu, iki soyuq işıq ləkəsi və arabir keçən axan ulduzlar var.

   Design mobil qeydi: ulduz sayı mobil cihazda 40-dan çox olmasın (paint cost)
   → açılışda 10 bürc ulduzu, ambient-də 22 ulduz.

   ⚠ Rənglər theme token-lərindən (templateConfig · night-sky).
   ───────────────────────────────────────────────────────────────────────── */

const TH = getTemplateTheme('night-sky')

const KEYFRAMES = `
@keyframes tpl-hint  { 0%,100% { transform: translateY(0); opacity:.35 } 50% { transform: translateY(6px); opacity:1 } }
@keyframes tpl-eq    { 0%,100% { transform: scaleY(.35) } 50% { transform: scaleY(1) } }
@keyframes ns-draw   { from { stroke-dashoffset: 520 } to { stroke-dashoffset: 0 } }
@keyframes ns-pop    { 0% { opacity:0; transform:scale(0) } 66% { transform:scale(1.7) } 100% { opacity:1; transform:scale(1) } }
@keyframes ns-moon   { from { opacity:0; transform:translateY(52px) scale(.9) } to { opacity:1; transform:none } }
`

/* Bürc — design-dəki 10 ulduzun koordinatları (370×380 kətan).
   SVG olduğu üçün ekran enindən asılı olmayaraq nisbətini saxlayır. */
const CONSTELLATION = [
  [58, 110], [122, 86], [168, 64], [212, 140], [286, 96],
  [312, 178], [248, 232], [196, 296], [84, 208],
]
const LINE = CONSTELLATION.map(([x, y]) => `${x} ${y}`).join(' L ')

function Constellation({ theme }) {
  /* ⚠ Bürc telefon kətanına (370px) görə çəkilib — geniş ekranda `width:100%`
     onu nəhəngləşdirir, ona görə eni 400px-ə bağlanıb və mərkəzə alınıb. */
  return (
    <svg
      viewBox="0 0 370 380" width="100%" height="auto" fill="none" aria-hidden="true"
      style={{
        position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)',
        width: 'min(100%, 400px)', pointerEvents: 'none',
      }}
    >
      <path
        d={`M ${LINE} L 58 110`}
        stroke={alpha(theme.accent, 0.42)} strokeWidth="1" strokeDasharray="520"
        style={{ animation: 'ns-draw 3.4s cubic-bezier(.4,0,.2,1) 1.6s both' }}
      />
      {CONSTELLATION.map(([x, y], i) => (
        <g key={i} style={{
          transformOrigin: `${x}px ${y}px`,
          animation: `ns-pop .9s cubic-bezier(.2,1.4,.4,1) ${(1 + i * 0.7).toFixed(2)}s both,`
            + ` tpl-twinkle ${(3 + i * 0.35).toFixed(2)}s ease-in-out ${(2.5 + i * 0.7).toFixed(2)}s infinite`,
        }}>
          <circle cx={x} cy={y} r="5" fill={alpha(theme.text, 0.18)} />
          <circle cx={x} cy={y} r="1.6" fill={theme.text} />
        </g>
      ))}
    </svg>
  )
}

function Opening(props) {
  const { theme, weddingData, isCouple, lang } = props

  /* Koordinatlar məkanın xəritə linkindən oxunur; link yoxdursa Bakı. */
  const ll = parseLatLon(weddingData)
  const dms = (v, pos, neg) => {
    const d = Math.floor(Math.abs(v))
    const m = Math.round((Math.abs(v) - d) * 60)
    return `${d}°${String(m).padStart(2, '0')}′${v >= 0 ? pos : neg}`
  }
  const coords = ll ? `${dms(ll[0], 'N', 'S')} · ${dms(ll[1], 'E', 'W')}` : '40°23′N · 49°52′E'

  return (
    <OpeningFrame
      {...props}
      exit="zoom"
      duration={1100}
      label="Dəvətnaməni aç"
      ctaDelay={5.2}
      hintDelay={5.7}
      ctaStyle={{
        border: `1px solid ${alpha(theme.accent, 0.42)}`,
        color: theme.text, background: alpha(theme.accent, 0.07),
      }}
      orbs="ring"
      orbTop="46%"
      veil={theme.background}
      background={`radial-gradient(130% 95% at 50% 108%, ${theme.primary}, ${theme.background} 66%)`}
    >
      {/* Ay işığı — aşağıdan qalxır və üfüqü açır */}
      <span aria-hidden="true" style={{
        position: 'absolute', left: '50%', bottom: -40, transform: 'translateX(-50%)',
        width: 'min(96vw, 360px)', height: 220, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 100%, ${alpha(theme.secondary, 0.75)}, transparent 70%)`,
        filter: 'blur(24px)', animation: 'ns-moon 2s cubic-bezier(.22,.61,.36,1) .6s both',
      }} />

      <Constellation theme={theme} />

      <div style={{ position: 'relative' }}>
        <Kicker text="O gecə göy belə görünürdü" color={theme.muted} delay={3.6} />

        <NameRow
          theme={theme} weddingData={weddingData} isCouple={isCouple}
          delay={4} step={0.2}
          size="clamp(28px, 10vw, 38px)" ampSize="clamp(18px, 6vw, 24px)"
          color={theme.text} ampColor={alpha(theme.accent, 0.85)}
          style={{ marginTop: 26 }}
        />

        <Ornament color={alpha(theme.accent, 0.7)} mark="glow" delay={4.7} width={32} style={{ marginTop: 18 }} />

        <OpeningMeta
          text={`${formatFullDateByLang(weddingData.date, lang)} · ${coords}`}
          color={theme.muted} delay={4.9} style={{ marginTop: 14 }}
        />
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
      /* Daxili arxa fon — ulduz tozu, soyuq işıq ləkələri, axan ulduzlar */
      ambientBlend="screen"
      ambient={
        <Ambient>
          <Blob color="rgba(120,140,210,.34)" left="-20%" top="2%" w="76%" h="34%" blur={42} duration={23} />
          <Blob color="rgba(160,150,215,.3)" right="-22%" bottom="8%" w="70%" h="30%" blur={46} duration={28} delay={10} reverse />
          <Particles kind="twinkle" count={22} color={TH.text} size={2} seed={7} minDur={2.3} maxDur={3.5} />
          {[
            { left: '6%', top: '6%', rot: 34, dur: 8, delay: 0 },
            { left: '62%', top: '3%', rot: 28, dur: 11, delay: 5.5 },
            { left: '24%', top: '52%', rot: 40, dur: 13, delay: 9 },
          ].map((s, i) => (
            <span key={i} style={{
              position: 'absolute', left: s.left, top: s.top, width: 64, height: 1,
              transform: `rotate(${s.rot}deg)`, transformOrigin: '0 50%',
              background: `linear-gradient(90deg, ${alpha(TH.text, 0.9)}, transparent)`,
              animation: `ab-shoot ${s.dur}s cubic-bezier(.2,.6,.3,1) ${s.delay}s infinite`,
            }} />
          ))}
        </Ambient>
      }
      design={{
        radius: 14,
        buttonRadius: 100,
        align: 'center',
        headingTransform: 'none',
        kicker: '.2em',
        dark: true,
        alternate: true,
        /* Location — OSM tile mozaikasının şablona məxsus emalı */
        map: { opacity: 0.5, filter: 'grayscale(1) brightness(.38) contrast(1.2)', tintOpacity: 0.5 },
        headingColor: TH.text,
        accentColor: TH.accent,
        ctaBg: TH.accent,
        ctaText: TH.background,
      }}
    />
  )
}
