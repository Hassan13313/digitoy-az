import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ════════════════════════════════════════════
   SIENA PARALLAX (SK1)
   Scroll etdikcə dəvətnamə preview-u kiçikdən
   tam ekrana böyüyür — sinematik lüks effekt
════════════════════════════════════════════ */
export default function SienaParallax({ lang = 'az' }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const scale     = useTransform(scrollYProgress, [0, 0.5], [0.72, 1.04])
  const opacity   = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const textY     = useTransform(scrollYProgress, [0.1, 0.45], [40, 0])
  const textOpac  = useTransform(scrollYProgress, [0.1, 0.35], [0, 1])
  const clipR     = useTransform(scrollYProgress, [0.05, 0.55], [18, 0])

  return (
    <section
      ref={containerRef}
      style={{
        height: '200vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'sticky', top: 0,
        height: '100vh', width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>

        {/* ── Main parallax frame ── */}
        <motion.div
          style={{
            scale,
            opacity,
            borderRadius: clipR,
            width: 'min(88vw, 960px)',
            maxWidth: '100%',
            aspectRatio: '16/9',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 40px 120px rgba(0,0,0,0.22), 0 8px 32px rgba(197,160,89,0.12)',
          }}
        >
          {/* Gradient background simulating dəvətnamə */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(145deg, #FDFBF7 0%, #F4EDE0 40%, #EAE0CC 70%, #F2EAD8 100%)',
          }} />

          {/* Corner ornaments */}
          {[
            { top: 24, left: 24, bt: true, bl: true },
            { top: 24, right: 24, bt: true, br: true },
            { bottom: 24, left: 24, bb: true, bl: true },
            { bottom: 24, right: 24, bb: true, br: true },
          ].map((o, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: o.top, left: o.left, right: o.right, bottom: o.bottom,
              width: 40, height: 40,
              borderTop:    o.bt ? '1px solid rgba(197,160,89,0.5)' : 'none',
              borderLeft:   o.bl ? '1px solid rgba(197,160,89,0.5)' : 'none',
              borderRight:  o.br ? '1px solid rgba(197,160,89,0.5)' : 'none',
              borderBottom: o.bb ? '1px solid rgba(197,160,89,0.5)' : 'none',
            }} />
          ))}

          {/* Top/bottom gold rules */}
          {[{ top: 0 }, { bottom: 0 }].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', left: 0, right: 0, height: 1, ...pos,
              background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.7) 30%, rgba(197,160,89,0.9) 50%, rgba(197,160,89,0.7) 70%, transparent)',
            }} />
          ))}

          {/* Central content */}
          <motion.div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              y: textY, opacity: textOpac,
            }}
          >
            <p style={{
              fontSize: 'clamp(9px,1.2vw,11px)',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(197,160,89,0.85)',
              fontFamily: 'Inter,system-ui,sans-serif',
              fontWeight: 500, marginBottom: 20,
            }}>
              {lang === 'az' ? 'Nümunə Dəvətnamə' : lang === 'en' ? 'Sample Invitation' : 'Образец приглашения'}
            </p>

            <div style={{
              width: 'clamp(40px,6vw,60px)', height: 1,
              background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.65), transparent)',
              marginBottom: 20,
            }} />

            <h2 style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 'clamp(28px,5.5vw,68px)',
              fontWeight: 300, color: '#1A1A1A',
              letterSpacing: '-0.02em', lineHeight: 1.1,
              textAlign: 'center', margin: '0 0 8px',
            }}>
              Aytən
            </h2>
            <p style={{
              fontFamily: '"Cormorant Garamond",Georgia,serif',
              fontSize: 'clamp(14px,2.5vw,24px)',
              fontStyle: 'italic', color: 'rgba(197,160,89,0.85)',
              fontWeight: 300, marginBottom: 8,
            }}>
              &amp;
            </p>
            <h2 style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
              fontSize: 'clamp(28px,5.5vw,68px)',
              fontWeight: 300, color: '#1A1A1A',
              letterSpacing: '-0.02em', lineHeight: 1.1,
              textAlign: 'center', margin: '0 0 24px',
            }}>
              Rauf
            </h2>

            <div style={{
              width: 'clamp(40px,6vw,60px)', height: 1,
              background: 'linear-gradient(to right, transparent, rgba(197,160,89,0.65), transparent)',
              marginBottom: 20,
            }} />

            <p style={{
              fontSize: 'clamp(9px,1.1vw,11px)',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(140,123,107,0.7)',
              fontFamily: 'Inter,system-ui,sans-serif', fontWeight: 400,
            }}>
              20 Sentyabr 2025 · Hilton Baku
            </p>
          </motion.div>

          {/* Subtle grain overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            opacity: 0.025,
            mixBlendMode: 'overlay',
          }} />
        </motion.div>

        {/* ── Scroll hint ── */}
        <motion.div
          style={{
            position: 'absolute', bottom: 40, left: '50%',
            transform: 'translateX(-50%)',
            opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]),
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}
        >
          <p style={{
            fontSize: 9, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: 'rgba(140,123,107,0.55)',
            fontFamily: 'Inter,system-ui,sans-serif',
          }}>
            {lang === 'az' ? 'Dəvətnaməni gör' : lang === 'en' ? 'See invitation' : 'Смотреть'}
          </p>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(197,160,89,0.5), transparent)' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
