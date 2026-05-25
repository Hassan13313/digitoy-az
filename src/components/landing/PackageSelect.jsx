import { Check, Crown, Lock } from 'lucide-react'
import { PACKAGE_DEFS, PKG_FEATURES } from '../../data/packages'

const PKG_LABELS = {
  az: { SADE: 'Sadə', VIP: 'VİP', PREMIUM: 'Premium' },
  en: { SADE: 'Basic', VIP: 'VIP', PREMIUM: 'Premium' },
  ru: { SADE: 'Базовый', VIP: 'VIP', PREMIUM: 'Премиум' },
}

const UI = {
  az: { title: 'Paketinizi Seçin', subtitle: 'Toyunuza ən uyğun paketi seçin', popular: 'Ən Çox Seçilən', btn: 'İndi Başla', azn: '₼' },
  en: { title: 'Choose Your Package', subtitle: 'Select the best package for your event', popular: 'Most Popular', btn: 'Get Started', azn: 'AZN' },
  ru: { title: 'Выберите пакет', subtitle: 'Выберите лучший пакет для вашего мероприятия', popular: 'Самый популярный', btn: 'Начать', azn: 'AZN' },
}

/* ── Inline stil sabitləri — Tailwind purge-dan asılı deyil ── */
const S = {
  vipCard: {
    background: 'linear-gradient(155deg, #1a1105 0%, #2c1c08 55%, #2C2523 100%)',
    border: '2px solid rgba(197,160,89,0.48)',
    boxShadow: '0 16px 64px rgba(197,160,89,0.24), inset 0 1px 0 rgba(197,160,89,0.14)',
  },
  lightCard: {
    background: 'linear-gradient(155deg, #FDFBF7 0%, #F4F1EA 100%)',
    border: '1px solid rgba(221,213,200,0.7)',
  },
  badge: {
    background: 'linear-gradient(135deg, #C5A059 0%, #B8903A 100%)',
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 18px',
    zIndex: 10,
    whiteSpace: 'nowrap',
  },
  btnGold: {
    background: 'linear-gradient(135deg, #C5A059 0%, #B8903A 100%)',
    color: '#fff',
    border: 'none',
  },
  btnOutline: {
    background: 'transparent',
    border: '1px solid rgba(197,160,89,0.55)',
    color: '#C5A059',
  },
  dividerVip:   { height: 1, background: 'rgba(255,255,255,0.08)',   margin: '24px 0' },
  dividerLight: { height: 1, background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.32),transparent)', margin: '24px 0' },
}

export default function PackageSelect({ lang, onSelect }) {
  const ui     = UI[lang]         || UI.az
  const labels = PKG_LABELS[lang] || PKG_LABELS.az
  const feats  = PKG_FEATURES[lang] || PKG_FEATURES.az
  const pkgIds = ['SADE', 'VIP', 'PREMIUM']

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Başlıq */}
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#C5A059', marginBottom: 18, fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 500 }}>
          Pricing
        </p>
        <h2 style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontSize: 'clamp(26px,5vw,40px)', fontWeight: 300, letterSpacing: '-0.02em', color: '#1A1A1A', margin: '0 0 12px' }}>
          {ui.title}
        </h2>
        <p style={{ fontSize: 14, fontWeight: 300, letterSpacing: '0.04em', color: '#8C7B6B', fontFamily: 'Inter,system-ui,sans-serif', marginBottom: 24 }}>
          {ui.subtitle}
        </p>
        <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.38),transparent)', maxWidth: 160, margin: '0 auto' }} />
      </div>

      {/* Kart grid — mobil: 1 sütun, desktop: 3 sütun */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
        {pkgIds.map((pkgId) => {
          const def       = PACKAGE_DEFS[pkgId]
          const feat      = feats[pkgId]
          const isVip     = def.popular

          return (
            <div
              key={pkgId}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                padding: '40px 32px 32px',
                ...(isVip ? S.vipCard : S.lightCard),
              }}
            >
              {/* VİP tac nişanı */}
              {isVip && (
                <div style={S.badge}>
                  <Crown size={9} color="white" strokeWidth={1.5} />
                  <span style={{ color: 'white', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 600 }}>
                    {ui.popular}
                  </span>
                </div>
              )}

              {/* Paket adı */}
              <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: isVip ? '#C5A059' : '#8C7B6B', fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 600, marginBottom: 14 }}>
                {labels[pkgId]}
              </p>

              {/* Qiymət */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontSize: 'clamp(44px,8vw,62px)', fontWeight: 300, letterSpacing: '-0.02em', color: isVip ? '#fff' : '#1A1A1A', lineHeight: 1 }}>
                  {def.price}
                </span>
                <span style={{ fontSize: 16, fontWeight: 300, color: isVip ? 'rgba(197,160,89,0.9)' : '#8C7B6B', fontFamily: 'Inter,system-ui,sans-serif' }}>
                  {ui.azn}
                </span>
              </div>

              {/* Ayırıcı xətt */}
              <div style={isVip ? S.dividerVip : S.dividerLight} />

              {/* Xüsusiyyətlər */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {feat.included.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                    <Check size={13} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2, color: '#C5A059' }} />
                    <span style={{ fontSize: 13, lineHeight: 1.6, fontWeight: 300, color: isVip ? 'rgba(255,255,255,0.82)' : '#8C7B6B', fontFamily: 'Inter,system-ui,sans-serif' }}>
                      {f}
                    </span>
                  </li>
                ))}
                {feat.locked.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                    <Lock size={12} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2, color: isVip ? 'rgba(255,255,255,0.18)' : 'rgba(140,123,107,0.28)' }} />
                    <span style={{ fontSize: 13, lineHeight: 1.6, fontWeight: 300, textDecoration: 'line-through', color: isVip ? 'rgba(255,255,255,0.2)' : 'rgba(140,123,107,0.32)', fontFamily: 'Inter,system-ui,sans-serif' }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Seç düyməsi */}
              <button
                onClick={() => onSelect(pkgId)}
                style={{
                  ...(isVip ? S.btnGold : S.btnOutline),
                  width: '100%',
                  minHeight: 48,
                  padding: '12px 0',
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter,system-ui,sans-serif',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, background 0.2s, color 0.2s',
                  touchAction: 'manipulation',
                }}
                onMouseEnter={e => {
                  if (isVip) { e.currentTarget.style.opacity = '0.85' }
                  else { e.currentTarget.style.background = '#C5A059'; e.currentTarget.style.color = '#fff' }
                }}
                onMouseLeave={e => {
                  if (isVip) { e.currentTarget.style.opacity = '1' }
                  else { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C5A059' }
                }}
              >
                {ui.btn}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
