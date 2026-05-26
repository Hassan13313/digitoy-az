/* Digitoy.az Phase 0 — Universal glass panel wrapper.
   Usage: <GlassPanel variant="light" hover glow> ... </GlassPanel>

   variants: 'light' | 'medium' | 'dark' | 'gold'
   hover:    adds spring lift on hover (Framer Motion)
   glow:     adds ambient gold glow in box-shadow              */

import { motion } from 'framer-motion'

const VARIANTS = {
  light: {
    background:   'rgba(255, 255, 255, 0.18)',
    border:       '1px solid rgba(255, 255, 255, 0.30)',
    boxShadow:    '0 8px 32px rgba(44,26,14,0.10), inset 0 1px 0 rgba(255,255,255,0.45)',
    shadowHover:  '0 20px 56px rgba(44,26,14,0.16), inset 0 1px 0 rgba(255,255,255,0.55)',
  },
  medium: {
    background:   'rgba(255, 255, 255, 0.10)',
    border:       '1px solid rgba(255, 255, 255, 0.20)',
    boxShadow:    '0 8px 32px rgba(44,26,14,0.08), inset 0 1px 0 rgba(255,255,255,0.30)',
    shadowHover:  '0 20px 56px rgba(44,26,14,0.14), inset 0 1px 0 rgba(255,255,255,0.40)',
  },
  dark: {
    background:   'rgba(26, 18, 9, 0.78)',
    border:       '1px solid rgba(197, 160, 89, 0.22)',
    boxShadow:    '0 8px 32px rgba(0,0,0,0.32), inset 0 1px 0 rgba(197,160,89,0.12)',
    shadowHover:  '0 20px 60px rgba(0,0,0,0.44), inset 0 1px 0 rgba(197,160,89,0.20)',
  },
  gold: {
    background:   'rgba(197, 160, 89, 0.10)',
    border:       '1px solid rgba(197, 160, 89, 0.38)',
    boxShadow:    '0 8px 32px rgba(44,26,14,0.10), inset 0 1px 0 rgba(255,255,255,0.30)',
    shadowHover:  '0 20px 56px rgba(44,26,14,0.16), 0 0 40px rgba(197,160,89,0.22)',
  },
}

const BLUR = 'blur(32px) saturate(180%)'

export default function GlassPanel({
  children,
  variant  = 'light',
  hover    = false,
  glow     = false,
  className = '',
  style    = {},
  ...props
}) {
  const v = VARIANTS[variant] ?? VARIANTS.light

  const glowSuffix = glow ? ', 0 0 48px rgba(197,160,89,0.20)' : ''

  const baseStyle = {
    backdropFilter:         BLUR,
    WebkitBackdropFilter:   BLUR,
    background:  v.background,
    border:      v.border,
    boxShadow:   v.boxShadow + glowSuffix,
    ...style,
  }

  if (hover) {
    return (
      <motion.div
        className={className}
        style={baseStyle}
        whileHover={{
          y: -6,
          boxShadow: v.shadowHover + glowSuffix,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={className} style={baseStyle} {...props}>
      {children}
    </div>
  )
}
