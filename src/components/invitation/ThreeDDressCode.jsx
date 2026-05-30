/* ══════════════════════════════════════════════════
   LUXURY DRESS CODE — Minimalist geyim siluetləri
   Bədən/baş yox — yalnız geyim xətləri (stroke only)
══════════════════════════════════════════════════ */
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Dress code image paths ─── */
const IMG = {
  TOY_M:    '/assets/dresscode/toy-kisi.gif',
  TOY_F:    '/assets/dresscode/toy-qadin.gif',
  CASUAL_M: '/assets/dresscode/casual-kisi.gif',
  CASUAL_F: '/assets/dresscode/casual-qadin.gif',
}

/* ─── Outfit map (blacktie → toy assets, others → casual) ─── */
const OUTFITS = {
  blacktie: {
    male: IMG.TOY_M, female: IMG.TOY_F,
    label: 'Black Tie',
    subtitle: 'Zərif / Rəsmi geyimlər (Smokin və rəsmi ziyafət libasları)',
  },
  cocktail: {
    male: IMG.CASUAL_M, female: IMG.CASUAL_F,
    label: 'Cocktail',
    subtitle: 'Yarı-rəsmi / Modern (Dəbə uyğun kostyum və kokteyl donları)',
  },
  smartcasual: {
    male: IMG.CASUAL_M, female: IMG.CASUAL_F,
    label: 'Smart Casual',
    subtitle: 'Şık / Rahat (Yüngül pencək, kətan şalvar və zərif gündəlik geyimlər)',
  },
  creative: {
    male: IMG.CASUAL_M, female: IMG.CASUAL_F,
    label: 'Creative',
    subtitle: 'Tematik / Yaradıcı (Məclisə uyğun xüsusi tonlar və sərbəst lüks üslub)',
  },
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

function FigureCard({ imgSrc, figureLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 112, height: 112,
        borderRadius: '50%',
        border: '1px solid rgba(212,175,55,0.22)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1), 0 0 18px rgba(217,119,6,0.22), inset 0 1px 0 rgba(255,255,255,0.12)',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(253,250,244,0.9)',
      }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={imgSrc}
            src={imgSrc}
            alt={figureLabel}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        {/* Gold rim overlay */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 10%, rgba(212,175,55,0.08) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />
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

export default function ThreeDDressCode({ palette, paletteId: rawId, lang = 'az' }) {
  /* rawId = weddingData.dressCodePalette (builder-dən gələn xam ID: 'blacktie','cocktail','smartcasual','creative')
     palette?.id = DRESS_CODE_PALETTES-dən gələn ID ('pastel','earth','blacktie','garden')
     rawId prioritetlidir çünki builder 4 düzgün ID-dən birini saxlayır */
  const paletteId = rawId || palette?.id || 'smartcasual'
  const outfit    = getOutfit(paletteId)
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
          {/* Outfit adı + subtitle */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <p style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 22, fontWeight: 300, fontStyle: 'italic',
              color: '#1C1610', letterSpacing: '0.04em', lineHeight: 1.2,
            }}>
              {outfit.label}
            </p>
            <div style={{
              height: 1, marginTop: 12,
              background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4) 30%, rgba(212,175,55,0.55) 50%, rgba(212,175,55,0.4) 70%, transparent)',
            }} />
            <p style={{
              marginTop: 10,
              fontSize: 11, fontWeight: 300, lineHeight: 1.6,
              color: 'rgba(80,68,58,0.7)',
              fontFamily: '"Inter",system-ui,sans-serif',
              letterSpacing: '0.01em',
            }}>
              {outfit.subtitle}
            </p>
          </div>

          {/* Geyim ikonları */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 28,
            position: 'relative',
          }}>
            <FigureCard imgSrc={outfit.male}   figureLabel={figures.male} />
            <FigureCard imgSrc={outfit.female} figureLabel={figures.female} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
