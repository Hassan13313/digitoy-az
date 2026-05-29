import { useState } from 'react'
import { motion } from 'framer-motion'
import { PACKAGE_DEFS, PKG_FEATURES } from '../../data/packages'
import BlurFade from '../ui/BlurFade'

const PKG_LABELS = {
  az: { SADE: 'SADƏ', VIP: 'VİP', PREMIUM: 'PREMIUM' },
  en: { SADE: 'BASIC', VIP: 'VIP', PREMIUM: 'PREMIUM' },
  ru: { SADE: 'БАЗОВЫЙ', VIP: 'VIP', PREMIUM: 'ПРЕМИУМ' },
}

const UI = {
  az: { title: 'Paketinizi Seçin', subtitle: 'Toyunuza ən uyğun paketi seçin — dəyər zərif detallarda yaşayır.', popular: '★ ƏN ÇOX SEÇİLƏN', btn: 'SEÇİM ET', pricing: 'PRICING' },
  en: { title: 'Choose Your Package', subtitle: 'Select the best package for your event.', popular: '★ MOST POPULAR', btn: 'GET STARTED', pricing: 'PRICING' },
  ru: { title: 'Выберите пакет', subtitle: 'Выберите лучший пакет для вашего мероприятия.', popular: '★ САМЫЙ ПОПУЛЯРНЫЙ', btn: 'НАЧАТЬ', pricing: 'PRICING' },
}

const STATS = {
  az: [{ value: '300+', label: 'Xoşbəxt cüt' }, { value: '850+', label: 'Dəvətnamə' }, { value: '3 dil', label: 'Dil dəstəyi' }],
  en: [{ value: '300+', label: 'Happy Couples' }, { value: '850+', label: 'Invitations' }, { value: '3 lang', label: 'Languages' }],
  ru: [{ value: '300+', label: 'Счастливых Пар' }, { value: '850+', label: 'Приглашений' }, { value: '3 яз', label: 'Языков' }],
}

export default function PackageSelect({ lang, onSelect }) {
  const ui     = UI[lang]         || UI.az
  const labels = PKG_LABELS[lang] || PKG_LABELS.az
  const feats  = PKG_FEATURES[lang] || PKG_FEATURES.az
  const stats  = STATS[lang]      || STATS.az
  const pkgIds = ['SADE', 'VIP', 'PREMIUM']

  return (
    <section id="paketler" className="relative bg-transparent py-[120px]">
      <div className="max-w-[1240px] mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.32, 0, 0.68, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.42em] uppercase text-gold-dark mb-4">
            <span className="w-6 h-px bg-gold opacity-60" />
            {ui.pricing}
            <span className="w-6 h-px bg-gold opacity-60" />
          </div>
          <h2 className="font-serif font-normal text-espresso mt-0 mb-2.5" style={{ fontSize: 'clamp(40px, 5vw, 60px)', lineHeight: 1.05 }}>
            {ui.title}
          </h2>
          <p className="text-brown-dark text-base leading-[1.6] max-w-[540px] mx-auto">
            {ui.subtitle}
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0, 0.68, 1] }}
          className="glass rounded-[22px] max-w-[760px] mx-auto mb-14"
          style={{ padding: '22px 28px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-serif italic text-[44px] leading-none text-gold-gradient">{s.value}</div>
              <div className="mt-1.5 font-mono text-[10px] tracking-[0.32em] text-brown-muted uppercase">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Cards */}
        <div className="digitoy-pkg-grid grid gap-[22px]" style={{ gridTemplateColumns: '1fr 1.08fr 1fr', alignItems: 'stretch' }}>
          {pkgIds.map((pkgId, idx) => {
            const def   = PACKAGE_DEFS[pkgId]
            const feat  = feats[pkgId]
            return (
              <BlurFade key={pkgId} delay={idx * 0.1}>
                <PackageCard
                  pkgId={pkgId}
                  label={labels[pkgId]}
                  price={def.price}
                  isVip={def.popular}
                  feat={feat}
                  popular={ui.popular}
                  btn={ui.btn}
                  onSelect={() => onSelect(pkgId)}
                />
              </BlurFade>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) { .digitoy-pkg-grid { grid-template-columns: 1fr !important; } }
        @keyframes digitoy-premium-spin { to { transform: rotate(360deg); } }
        @keyframes digitoy-beam         { to { transform: rotate(360deg); } }
        @keyframes digitoy-shimmer-bg   { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      `}</style>
    </section>
  )
}

function PackageCard({ pkgId, label, price, isVip, feat, popular, btn, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const isPremium = pkgId === 'PREMIUM'

  const cardBase = 'relative flex flex-col overflow-hidden transition-all duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]'

  const cardVariant = isVip
    ? 'glass-dark border-gold/[0.52] -translate-y-2.5'
    : isPremium
    ? 'glass border-gold/30'
    : 'glass border-beige-dark/50'

  const cardShadow = isVip
    ? (hovered ? '0 32px 80px rgba(197,160,89,0.30), 0 0 80px rgba(197,160,89,0.25), inset 0 1px 0 rgba(197,160,89,0.18)' : '0 24px 64px rgba(0,0,0,0.30), 0 0 60px rgba(197,160,89,0.18), inset 0 1px 0 rgba(197,160,89,0.16)')
    : (hovered ? '0 28px 70px rgba(44,26,14,0.18), inset 0 1px 0 rgba(255,255,255,0.7)' : '0 12px 36px rgba(44,26,14,0.08), inset 0 1px 0 rgba(255,255,255,0.55)')

  return (
    <div className="relative h-full">
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: isVip ? -10 : -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`${cardBase} ${cardVariant} p-10 rounded-[26px] h-full`}
        style={{ boxShadow: cardShadow, zIndex: 1 }}
      >
        {/* PREMIUM shimmer border */}
        {isPremium && (
          <span aria-hidden="true" style={{
            position: 'absolute', inset: -1, borderRadius: 26, padding: 1,
            background: 'conic-gradient(from 0deg, rgba(197,160,89,0.3), rgba(224,210,170,0.6), rgba(197,160,89,0.3), rgba(224,210,170,0.6), rgba(197,160,89,0.3))',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor', maskComposite: 'exclude',
            opacity: hovered ? 1 : 0,
            animation: 'digitoy-premium-spin 6s linear infinite',
            transition: 'opacity 400ms ease', pointerEvents: 'none',
          }} />
        )}

        {/* VIP BorderBeam */}
        {isVip && (
          <span aria-hidden="true" style={{
            position: 'absolute', inset: -1, borderRadius: 26, padding: 1,
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(197,160,89,0.7) 12%, transparent 25%, transparent 60%, rgba(245,235,211,0.45) 72%, transparent 85%)',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor', maskComposite: 'exclude',
            animation: 'digitoy-beam 6s linear infinite', pointerEvents: 'none',
          }} />
        )}

        {/* "Most Popular" badge */}
        {isVip && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap z-[2] px-5 py-2 rounded-full font-mono text-[10px] tracking-[0.32em] font-semibold text-espresso"
            style={{
              background: 'linear-gradient(135deg, #E8D5A3 0%, #C5A059 50%, #E8D5A3 100%)',
              backgroundSize: '200% 100%',
              boxShadow: '0 10px 24px rgba(197,160,89,0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
              animation: 'digitoy-shimmer-bg 3s linear infinite',
            }}
          >{popular}</div>
        )}

        {/* Package name */}
        <div className={`font-mono text-[11px] tracking-[0.42em] uppercase mb-4 ${isVip ? 'text-gold-light' : 'text-gold-dark'}`}>
          {label}
        </div>

        {/* Price */}
        <div className="font-serif font-normal text-[80px] leading-none flex items-baseline gap-1">
          <span className={isVip ? 'text-gold-light' : 'text-gold-gradient'}>{price}</span>
          <span className={`text-[26px] ${isVip ? 'text-gold-light' : 'text-gold-dark'}`}>₼</span>
        </div>

        {/* Divider */}
        <hr className="border-none h-px my-6 gold-divider" />

        {/* Included features */}
        <ul className="list-none m-0 mb-6 p-0 grid gap-3 flex-1">
          {feat.included.map((f, i) => (
            <li key={`inc-${i}`} className={`flex gap-3 items-start text-sm leading-[1.5] ${isVip ? 'text-[rgba(245,235,211,0.88)]' : 'text-espresso'}`}>
              <span className="flex-[0_0_18px] w-[18px] h-[18px] rounded-full grid place-items-center text-[10px] font-bold mt-px"
                style={{ background: 'linear-gradient(135deg, #C5A059, #A8843E)', color: '#fff', boxShadow: '0 0 12px rgba(197,160,89,0.4)' }}
              >✓</span>
              <span>{f}</span>
            </li>
          ))}
          {feat.locked.map((f, i) => (
            <li key={`lck-${i}`} className={`flex gap-3 items-start text-sm leading-[1.5] ${isVip ? 'text-[rgba(245,235,211,0.4)]' : 'text-brown-muted'}`}>
              <span className="flex-[0_0_18px] w-[18px] h-[18px] rounded-full grid place-items-center text-[10px] font-bold mt-px"
                style={{ background: 'rgba(139,111,94,0.18)', color: '#8B6F5E' }}
              >–</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <motion.button
          onClick={onSelect}
          className={`w-full min-h-[52px] ${isVip ? 'btn-gold' : 'btn-outline-gold'}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
        >
          {btn}
        </motion.button>
      </motion.div>
    </div>
  )
}
