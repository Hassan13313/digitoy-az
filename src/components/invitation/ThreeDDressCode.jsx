/* ══════════════════════════════════════════════════
   LUXURY DRESS CODE — Minimalist geyim siluetləri
   Bədən/baş yox — yalnız geyim xətləri (stroke only)
══════════════════════════════════════════════════ */
import { motion, AnimatePresence } from 'framer-motion'

/* ─── BLACK TIE ─── */
const MaleBlackTieIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 14 L22 28 L22 58 L36 58" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M36 14 L50 28 L50 58 L36 58" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M36 18 L32 28 L40 28 L36 18Z" stroke="#D4AF37" strokeWidth="0.8" strokeLinejoin="round" fill="rgba(197,160,89,0.06)"/>
    <path d="M36 30 L29 26 L29 33 L36 30Z" stroke="#D4AF37" strokeWidth="1.1" strokeLinejoin="round" fill="rgba(197,160,89,0.06)"/>
    <path d="M36 30 L43 26 L43 33 L36 30Z" stroke="#D4AF37" strokeWidth="1.1" strokeLinejoin="round" fill="rgba(197,160,89,0.06)"/>
    <circle cx="36" cy="30" r="2" stroke="#D4AF37" strokeWidth="1" fill="rgba(197,160,89,0.06)"/>
    <circle cx="36" cy="38" r="1" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
    <circle cx="36" cy="44" r="1" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
    <circle cx="36" cy="50" r="1" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
    <path d="M24 32 L24 36 L28 36 L28 33" stroke="#D4AF37" strokeWidth="0.8" fill="rgba(197,160,89,0.06)"/>
  </svg>
)

const FemaleLongGownIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 16 Q36 12 44 16 L50 36 L58 66 L14 66 L22 36 Z"
      stroke="#D4AF37" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(197,160,89,0.06)"/>
    <path d="M26 30 Q36 26 46 30" stroke="#D4AF37" strokeWidth="1" fill="none"/>
    <path d="M28 16 Q32 22 36 20 Q40 22 44 16" stroke="#D4AF37" strokeWidth="1.1" fill="none"/>
    <path d="M28 16 L26 10" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
    <path d="M44 16 L46 10" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
    <path d="M20 52 Q36 48 52 52" stroke="#D4AF37" strokeWidth="0.8" fill="none" opacity="0.6"/>
    <path d="M17 60 Q36 56 55 60" stroke="#D4AF37" strokeWidth="0.8" fill="none" opacity="0.4"/>
  </svg>
)

/* ─── COCKTAIL ─── */
const MaleCocktailIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 16 L20 26 L20 58 L36 58" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M36 16 L52 26 L52 58 L36 58" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M24 26 L30 20 L36 26 L33 32" stroke="#D4AF37" strokeWidth="1" fill="none"/>
    <path d="M48 26 L42 20 L36 26 L39 32" stroke="#D4AF37" strokeWidth="1" fill="none"/>
    <path d="M36 26 L34 30 L35 48 L36 52 L37 48 L38 30 L36 26Z"
      stroke="#D4AF37" strokeWidth="0.8" strokeLinejoin="round" fill="rgba(197,160,89,0.06)"/>
    <path d="M22 40 L22 46 L28 46 L28 40" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
    <path d="M44 40 L44 46 L50 46 L50 40" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
  </svg>
)

const FemaleKocktailDressIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M27 14 Q36 10 45 14 L50 30 L54 56 L18 56 L22 30 Z"
      stroke="#D4AF37" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(197,160,89,0.06)"/>
    <path d="M27 14 L36 26 L45 14" stroke="#D4AF37" strokeWidth="1.1" fill="none"/>
    <path d="M24 28 Q36 24 48 28" stroke="#D4AF37" strokeWidth="1" fill="none"/>
    <path d="M27 14 L24 8" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
    <path d="M45 14 L48 8" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
    <path d="M20 48 Q36 44 52 48" stroke="#D4AF37" strokeWidth="0.8" fill="none" opacity="0.55"/>
  </svg>
)

/* ─── SMART CASUAL ─── */
const MaleSmartCasualIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 20 L24 58 L48 58 L48 20" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    <path d="M24 20 L30 14 L36 18 L42 14 L48 20" stroke="#D4AF37" strokeWidth="1.1" strokeLinejoin="round" fill="none"/>
    <line x1="36" y1="22" x2="36" y2="54" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="2 4"/>
    <circle cx="36" cy="26" r="1.2" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
    <circle cx="36" cy="34" r="1.2" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
    <circle cx="36" cy="42" r="1.2" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
    <path d="M24 20 L14 34 L18 36 L24 28" stroke="#D4AF37" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
    <path d="M48 20 L58 34 L54 36 L48 28" stroke="#D4AF37" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
    <path d="M14 34 L18 36" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M54 36 L58 34" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const FemaleSmartCasualIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 14 Q36 10 46 14 L50 34 L22 34 Z"
      stroke="#D4AF37" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(197,160,89,0.06)"/>
    <path d="M26 14 Q30 20 36 18 Q42 20 46 14" stroke="#D4AF37" strokeWidth="1" fill="none"/>
    <path d="M26 14 L16 28" stroke="#D4AF37" strokeWidth="1.1" strokeLinecap="round"/>
    <path d="M46 14 L56 28" stroke="#D4AF37" strokeWidth="1.1" strokeLinecap="round"/>
    <path d="M22 34 L20 58 L34 58 L36 44 L38 58 L52 58 L50 34 Z"
      stroke="#D4AF37" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(212,175,55,0.04)"/>
    <path d="M22 34 L50 34" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
    <rect x="33" y="32" width="6" height="4" rx="1" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
  </svg>
)

/* ─── CREATIVE ─── */
const MaleCreativeIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 14 L18 22 L18 58 L36 58" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M36 14 L54 20 L54 58 L36 58" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M20 22 L32 14 L38 24" stroke="#D4AF37" strokeWidth="1.1" fill="none" strokeLinejoin="round"/>
    <path d="M30 14 Q36 20 42 14" stroke="#D4AF37" strokeWidth="1.2" fill="none"/>
    <circle cx="38" cy="36" r="2" stroke="#D4AF37" strokeWidth="1" fill="rgba(197,160,89,0.06)"/>
    <path d="M40 46 L46 42 M40 50 L46 46 M40 54 L46 50"
      stroke="#D4AF37" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
    <path d="M18 22 L16 58" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5"/>
  </svg>
)

const FemaleCreativeIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 12 Q36 8 44 12 L52 34 L56 66 L40 66 L36 40 L30 58 L16 58 L22 34 Z"
      stroke="#D4AF37" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(197,160,89,0.06)"/>
    <path d="M20 16 Q36 10 52 16" stroke="#D4AF37" strokeWidth="1.2" fill="none"/>
    <path d="M22 34 L16 58" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M52 34 L56 66" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M26 28 Q36 24 46 28" stroke="#D4AF37" strokeWidth="0.8" fill="none"/>
    <path d="M18 50 Q28 46 36 50" stroke="#D4AF37" strokeWidth="0.8" fill="none" opacity="0.55"/>
    <path d="M40 56 Q48 52 56 58" stroke="#D4AF37" strokeWidth="0.8" fill="none" opacity="0.45"/>
    <circle cx="36" cy="20" r="2.5" stroke="#D4AF37" strokeWidth="1" fill="rgba(197,160,89,0.06)"/>
    <circle cx="36" cy="20" r="1" fill="rgba(212,175,55,0.5)" stroke="none"/>
  </svg>
)

/* ─── Outfit map ─── */
const OUTFITS = {
  blacktie:    { male: <MaleBlackTieIcon />,     female: <FemaleLongGownIcon />,       label: 'Black Tie' },
  cocktail:    { male: <MaleCocktailIcon />,     female: <FemaleKocktailDressIcon />,  label: 'Cocktail' },
  smartcasual: { male: <MaleSmartCasualIcon />,  female: <FemaleSmartCasualIcon />,    label: 'Smart Casual' },
  creative:    { male: <MaleCreativeIcon />,     female: <FemaleCreativeIcon />,       label: 'Creative' },
}

/* Palette ID → outfit tier mapping */
const PALETTE_TO_OUTFIT = {
  pastel:      'cocktail',
  earth:       'smartcasual',
  blacktie:    'blacktie',
  garden:      'creative',
  /* direct keys also pass through */
  cocktail:    'cocktail',
  smartcasual: 'smartcasual',
  creative:    'creative',
}

const getOutfit = (paletteId) =>
  OUTFITS[PALETTE_TO_OUTFIT[paletteId] ?? paletteId] ?? OUTFITS.smartcasual

function FigureCard({ icon, figureLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 112, height: 112,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(212,175,55,0.22)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1), 0 0 18px rgba(217,119,6,0.22), inset 0 1px 0 rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 28%, rgba(212,175,55,0.14) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        {icon}
      </div>
      <p style={{
        fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
        color: 'rgba(212,175,55,0.75)', fontFamily: '"Inter",system-ui,sans-serif',
        fontWeight: 500,
      }}>
        {figureLabel}
      </p>
    </div>
  )
}

const FIGURE_LABELS = {
  az: { male: 'Kişi', female: 'Xanım' },
  en: { male: 'Groom', female: 'Bride' },
  ru: { male: 'Мужчина', female: 'Женщина' },
}

export default function ThreeDDressCode({ palette, lang = 'az' }) {
  const paletteId = palette?.id || 'smartcasual'
  const outfit    = getOutfit(paletteId)
  const label     = palette?.label?.[lang] || palette?.label?.az || outfit.label
  const figures   = FIGURE_LABELS[lang] || FIGURE_LABELS.az

  return (
    <div style={{
      maxWidth: 420, margin: '0 auto',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(212,175,55,0.15)',
      borderRadius: 20,
      boxShadow: '0 8px 48px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.12)',
      padding: '28px 28px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 20,
        background: 'radial-gradient(ellipse 70% 40% at 50% 15%, rgba(212,175,55,0.07) 0%, transparent 70%)',
      }} />

      {/* Üst qızılı xətt */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
        background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.7) 40%, rgba(212,175,55,0.9) 50%, rgba(212,175,55,0.7) 60%, transparent)',
      }} />

      {/* Başlıq — sabit qalır */}
      <div style={{ textAlign: 'center', marginBottom: 4, position: 'relative' }}>
        <p style={{
          fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase',
          color: 'rgba(212,175,55,0.7)', fontFamily: '"Inter",system-ui,sans-serif',
          fontWeight: 600, marginBottom: 8,
        }}>
          Dress Code
        </p>
      </div>

      {/* Animate edilən hissə: etiket + ikonlar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={paletteId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: 'easeInOut' }}
        >
          {/* Outfit adı */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <p style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 22, fontWeight: 300, fontStyle: 'italic',
              color: '#1C1610', letterSpacing: '0.04em', lineHeight: 1.2,
            }}>
              {label}
            </p>
            <div style={{
              height: 1, marginTop: 14,
              background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4) 30%, rgba(212,175,55,0.55) 50%, rgba(212,175,55,0.4) 70%, transparent)',
            }} />
          </div>

          {/* Geyim ikonları */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 28,
            position: 'relative',
          }}>
            <FigureCard icon={outfit.male}   figureLabel={figures.male} />
            <FigureCard icon={outfit.female} figureLabel={figures.female} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
