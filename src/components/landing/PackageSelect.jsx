import { useRef, useState, useEffect } from 'react'
import { Check, Crown, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { PACKAGE_DEFS, PKG_FEATURES } from '../../data/packages'
import ThreeDCard from '../ui/ThreeDCard'
import CardSpotlight from '../ui/CardSpotlight'
import GlowingCard from '../ui/GlowingCard'
import BorderBeam from '../ui/BorderBeam'
import ShimmerButton from '../ui/ShimmerButton'
import SparklesText from '../ui/SparklesText'
import AnimatedShinyText from '../ui/AnimatedShinyText'
import AnimatedNumber from '../ui/AnimatedNumber'
import BlurFade from '../ui/BlurFade'

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

const S = {
  vipCard: {
    background: 'linear-gradient(155deg, rgba(26,17,5,0.88) 0%, rgba(44,28,8,0.82) 55%, rgba(44,37,35,0.88) 100%)',
    border: '2px solid rgba(197,160,89,0.55)',
    backdropFilter: 'blur(32px) saturate(180%)',
    WebkitBackdropFilter: 'blur(32px) saturate(180%)',
    boxShadow: '0 0 80px rgba(197,160,89,0.22), 0 16px 64px rgba(0,0,0,0.40), inset 0 1px 0 rgba(197,160,89,0.16)',
  },
  lightCard: {
    background: 'rgba(255,255,255,0.20)',
    border: '1px solid rgba(255,255,255,0.35)',
    backdropFilter: 'blur(32px) saturate(175%)',
    WebkitBackdropFilter: 'blur(32px) saturate(175%)',
    boxShadow: '0 8px 40px rgba(44,26,14,0.09), inset 0 1px 0 rgba(255,255,255,0.50)',
  },
  premiumCard: {
    background: 'rgba(255,255,255,0.22)',
    border: '1px solid rgba(197,160,89,0.25)',
    backdropFilter: 'blur(32px) saturate(175%)',
    WebkitBackdropFilter: 'blur(32px) saturate(175%)',
    boxShadow: '0 8px 40px rgba(197,160,89,0.10), inset 0 1px 0 rgba(255,255,255,0.50)',
  },
  dividerVip:   { height: 1, background: 'rgba(255,255,255,0.08)',   margin: '24px 0' },
  dividerLight: { height: 1, background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.32),transparent)', margin: '24px 0' },
}

/* Fractal dot grid background — CU6 */
function FractalDotGrid() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const setupCanvas = (canvas) => {
    if (!canvas) return
    canvasRef.current = canvas
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const spacing = 28
    const cols = Math.ceil(W / spacing) + 1
    const rows = Math.ceil(H / spacing) + 1

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing
          const y = r * spacing
          const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2)
          const influence = Math.max(0, 1 - dist / 160)
          const size = 1.2 + influence * 3.5
          const alpha = 0.08 + influence * 0.35

          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(197,160,89,${alpha})`
          ctx.fill()
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    canvas.parentElement.addEventListener('mousemove', onMouse)
    return () => {
      cancelAnimationFrame(animRef.current)
      canvas.parentElement?.removeEventListener('mousemove', onMouse)
    }
  }

  return (
    <canvas
      ref={setupCanvas}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        opacity: 0.85,
      }}
    />
  )
}

/* Stats row — CU7 Animated Numbers */
function StatsRow({ lang }) {
  const stats = lang === 'az'
    ? [
        { value: 300, suffix: '+', label: 'Xoşbəxt Cüt' },
        { value: 850, suffix: '+', label: 'Dəvətnamə' },
        { value: 3,   suffix: ' dil', label: 'Dil Dəstəyi' },
      ]
    : lang === 'en'
    ? [
        { value: 300, suffix: '+', label: 'Happy Couples' },
        { value: 850, suffix: '+', label: 'Invitations' },
        { value: 3,   suffix: ' lang', label: 'Languages' },
      ]
    : [
        { value: 300, suffix: '+', label: 'Счастливых Пар' },
        { value: 850, suffix: '+', label: 'Приглашений' },
        { value: 3,   suffix: ' яз', label: 'Языков' },
      ]

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 40, flexWrap: 'wrap' }}>
      {stats.map(({ value, suffix, label }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
            fontSize: 36, fontWeight: 300, color: '#C5A059', lineHeight: 1,
          }}>
            <AnimatedNumber value={value} suffix={suffix} duration={1.8} />
          </div>
          <p style={{
            fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#8C7B6B', marginTop: 6, fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 500,
          }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  )
}

export default function PackageSelect({ lang, onSelect }) {
  const ui     = UI[lang]         || UI.az
  const labels = PKG_LABELS[lang] || PKG_LABELS.az
  const feats  = PKG_FEATURES[lang] || PKG_FEATURES.az
  const pkgIds = ['SADE', 'VIP', 'PREMIUM']

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', padding: '0 8px' }}>

      {/* ── Başlıq ── */}
      <BlurFade delay={0} style={{ textAlign: 'center', marginBottom: 36 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#C5A059', marginBottom: 18, fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 500 }}>
          Pricing
        </p>
        <h2 style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontSize: 'clamp(26px,5vw,40px)', fontWeight: 300, letterSpacing: '-0.02em', color: '#1A1A1A', margin: '0 0 12px' }}>
          {ui.title}
        </h2>
        <p style={{ fontSize: 14, fontWeight: 300, letterSpacing: '0.04em', color: '#8C7B6B', fontFamily: 'Inter,system-ui,sans-serif', marginBottom: 24 }}>
          {ui.subtitle}
        </p>
        <div style={{ height: 1, background: 'linear-gradient(to right,transparent,rgba(197,160,89,0.38),transparent)', maxWidth: 160, margin: '0 auto 32px' }} />

        {/* Stats — CU7 */}
        <StatsRow lang={lang} />
      </BlurFade>

      {/* Fractal dot grid background — CU6 */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <FractalDotGrid />
        </div>

        {/* VİP ambient glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 380, height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197,160,89,0.18) 0%, transparent 68%)',
          filter: 'blur(50px)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Kart grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 20, position: 'relative', zIndex: 1 }}>
          {pkgIds.map((pkgId, idx) => {
            const def   = PACKAGE_DEFS[pkgId]
            const feat  = feats[pkgId]
            const isVip = def.popular

            return (
              <BlurFade key={pkgId} delay={idx * 0.1}>
                {/* GlowingCard wrapper — kənar glow */}
                <GlowingCard
                  glowColor={isVip ? 'rgba(197,160,89,0.6)' : 'rgba(197,160,89,0.35)'}
                  style={{ borderRadius: 0, height: '100%' }}
                >
                  {/* 3D Card tilt */}
                  <ThreeDCard intensity={isVip ? 8 : 10} style={{ height: '100%' }}>

                    {/* Card inner with Spotlight */}
                    <CardSpotlight
                      spotColor={isVip ? 'rgba(197,160,89,0.12)' : 'rgba(197,160,89,0.07)'}
                      style={{
                        position: 'relative',
                        display: 'flex', flexDirection: 'column',
                        padding: '44px 32px 32px',
                        ...(isVip ? S.vipCard : pkgId === 'PREMIUM' ? S.premiumCard : S.lightCard),
                        ...(isVip ? { '--border-beam-bg': '#1a1105' } : {}),
                      }}
                    >
                      {/* VİP Border Beam */}
                      {isVip && (
                        <BorderBeam duration={4} colorFrom="#C5A059" colorTo="#E8D5A3" />
                      )}

                      {/* VİP badge */}
                      {isVip && (
                        <div style={{
                          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                          background: 'linear-gradient(135deg, #C5A059 0%, #B8903A 100%)',
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '5px 18px', zIndex: 10, whiteSpace: 'nowrap',
                        }}>
                          <Crown size={9} color="white" strokeWidth={1.5} />
                          <AnimatedShinyText style={{
                            color: 'white', fontSize: 9, letterSpacing: '0.25em',
                            textTransform: 'uppercase', fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 600,
                          }}>
                            {ui.popular}
                          </AnimatedShinyText>
                        </div>
                      )}

                      {/* Paket adı */}
                      <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: isVip ? '#C5A059' : '#8C7B6B', fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 600, marginBottom: 14, position: 'relative', zIndex: 2 }}>
                        {isVip
                          ? <SparklesText color="#C5A059" density={3}>{labels[pkgId]}</SparklesText>
                          : labels[pkgId]
                        }
                      </p>

                      {/* Qiymət */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6, position: 'relative', zIndex: 2 }}>
                        <span style={{ fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif', fontSize: 'clamp(44px,8vw,62px)', fontWeight: 300, letterSpacing: '-0.02em', color: isVip ? '#fff' : '#1A1A1A', lineHeight: 1 }}>
                          {def.price}
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 300, color: isVip ? 'rgba(197,160,89,0.9)' : '#8C7B6B', fontFamily: 'Inter,system-ui,sans-serif' }}>
                          {ui.azn}
                        </span>
                      </div>

                      {/* Divider */}
                      <div style={{ ...(isVip ? S.dividerVip : S.dividerLight), position: 'relative', zIndex: 2 }} />

                      {/* Features */}
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 11, position: 'relative', zIndex: 2 }}>
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

                      {/* Shimmer Button */}
                      <div style={{ position: 'relative', zIndex: 2 }}>
                        <ShimmerButton
                          onClick={() => onSelect(pkgId)}
                          variant={isVip ? 'gold' : 'outline'}
                          style={{ width: '100%', minHeight: 48, padding: '12px 0' }}
                        >
                          {ui.btn}
                        </ShimmerButton>
                      </div>

                    </CardSpotlight>
                  </ThreeDCard>
                </GlowingCard>
              </BlurFade>
            )
          })}
        </div>
      </div>
    </div>
  )
}
