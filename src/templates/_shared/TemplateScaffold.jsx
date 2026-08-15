import { useTemplate } from '../TemplateProvider'

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE SCAFFOLD — dizaynı hələ kodlaşdırılmayan şablonlar üçün yer tutucu.

   Design layihəsindəki tokenlərlə (theme) render olunur ki, önbaxışda şablonun
   rəng/şrift dili artıq görünsün.

   YALNIZ /demo/template/:id preview route-unda görünür. Production dəvətnamə
   linkləri bura HEÇ VAXT düşmür: TemplateRenderer preview olmayan rejimdə
   enabled=false şablonları simple-luxury-yə yönləndirir.
   ───────────────────────────────────────────────────────────────────────── */
export default function TemplateScaffold({ onBack }) {
  const { config } = useTemplate()
  const th = config?.theme || {}
  const bg = config?.preview?.background || th.background || '#FDFAF4'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px', textAlign: 'center',
        fontFamily: th.fonts?.body || 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: 440, width: '100%' }}>
        <p style={{
          fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase',
          color: th.accent, fontWeight: 600, marginBottom: 22,
        }}>
          Digitoy · Şablon Önbaxışı
        </p>

        <div style={{
          height: 1, width: 60, margin: '0 auto 26px',
          background: `linear-gradient(to right, transparent, ${th.accent}, transparent)`,
        }} />

        <h1 style={{
          fontFamily: th.fonts?.heading || 'Georgia, serif',
          fontSize: 'clamp(30px, 8vw, 46px)', fontWeight: 300,
          color: th.text, letterSpacing: '-.01em', marginBottom: 12, lineHeight: 1.1,
        }}>
          {config?.name || 'Şablon'}
        </h1>

        <p style={{
          fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase',
          color: th.muted, marginBottom: 18,
        }}>
          {config?.tagline}
        </p>

        <p style={{ fontSize: 14, fontWeight: 300, color: th.muted, lineHeight: 1.75, marginBottom: 30 }}>
          {config?.description}
        </p>

        {/* Palitra — design faylındakı Color palette bloku */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 30, flexWrap: 'wrap' }}>
          {[th.primary, th.accent, th.secondary, th.surface, th.text].filter(Boolean).map((color, i) => (
            <span
              key={`${color}-${i}`}
              title={color}
              style={{
                width: 34, height: 34, borderRadius: '50%', background: color,
                border: '1px solid rgba(127,127,127,0.3)', display: 'block',
              }}
            />
          ))}
        </div>

        <p style={{
          fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase',
          color: th.muted, marginBottom: 34,
        }}>
          Dizayn kodlaşdırılır · yalnız daxili test
        </p>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'transparent', cursor: 'pointer',
              border: `1px solid ${th.accent}`,
              color: th.accent,
              padding: '12px 32px', borderRadius: 999,
              fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            Geri
          </button>
        )}

        <div style={{
          height: 1, width: 60, margin: '34px auto 0',
          background: `linear-gradient(to right, transparent, ${th.accent}, transparent)`,
          opacity: .6,
        }} />
      </div>
    </div>
  )
}
