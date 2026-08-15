import { motion } from 'framer-motion'
import { SOCIAL_LINKS } from '../../data/constants'
import { formatFullDateByLang } from '../../utils/dateFormat'
import { alpha, readableOn } from './geo'
import t from '../../data/translations'

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE OUTRO — 9 şablonun ORTAQ son hissəsi: demo CTA + footer.

   Əvvəl yalnız `simple-luxury`-də bu iki blok var idi; qalan 8 şablonun sonunda
   isə App.jsx-in "Dəvətnamə yaratmağa geri dön" lenti çıxırdı. Phase 27.4-də
   həmin lent tamamilə silindi və hər 9 şablon bu komponenti işlədir.

   ⚠ TEMA QORUNUR: struktur simple-luxury-nin eynisidir, rənglər isə şablonun
   `theme` token-lərindən gəlir (footer `footerBg`/`footerText`, CTA `surface`/
   `primary`). Ona görə Modern Black-də qara, Floral Garden-də adaçayı görünür,
   amma düzülüş, ölçülər və davranış hər yerdə eynidir.

   ⚠ «Paketlərə keç» birbaşa route dəyişmir — `digitoy:packages` hadisəsini
   yayımlayır, App onu tutub landing-in paket bölməsinə hamar scroll edir.
   Beləliklə builder state-i (sessionStorage snapshot) toxunulmaz qalır.
   ───────────────────────────────────────────────────────────────────────── */

const CTA = {
  az: {
    badge: 'Öz dəvətnamənizi hazırlayın',
    title: 'Sizə xüsusi hazırlansın',
    desc:  'Bu nümunəni bəyəndinizsə, paketinizi seçib öz dəvətnamənizi dəqiqələr ərzində hazırlaya bilərsiniz.',
    btn:   'Paketlərə keç',
  },
  en: {
    badge: 'Create your invitation',
    title: 'Make it yours',
    desc:  'If you liked this example, choose your package and create your invitation in minutes.',
    btn:   'Choose Package',
  },
  ru: {
    badge: 'Создайте своё приглашение',
    title: 'Сделайте своё',
    desc:  'Если вам понравился этот пример, выберите пакет и создайте своё приглашение за несколько минут.',
    btn:   'Выбрать пакет',
  },
}

const ICON_WRAP = {
  width: 40, height: 40, borderRadius: '50%',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  textDecoration: 'none', transition: 'border-color .2s, background .2s, transform .2s',
}

function SocialIcons({ color, border }) {
  const wrap = { ...ICON_WRAP, border: `1px solid ${border}` }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <a href={SOCIAL_LINKS.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" style={wrap}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.2" fill={color} stroke="none" />
        </svg>
      </a>
      <a href={SOCIAL_LINKS.tiktok} aria-label="TikTok" target="_blank" rel="noopener noreferrer" style={wrap}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill={color}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
        </svg>
      </a>
      <a href={SOCIAL_LINKS.whatsapp} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" style={wrap}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.18-1.62A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.85 0-3.67-.5-5.25-1.44l-.38-.22-3.67.96.98-3.58-.25-.38A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0 1 22 12c0 5.52-4.48 10-10 10z" fill={color} />
          <path d="M17.5 14.4c-.3-.15-1.75-.86-2.02-.96s-.47-.15-.67.15-.77.96-.94 1.16-.35.22-.64.07a8.08 8.08 0 0 1-2.38-1.47 8.93 8.93 0 0 1-1.64-2.05c-.17-.3 0-.46.13-.6l.44-.52c.14-.17.18-.3.27-.5s.05-.37-.02-.52-.67-1.6-.91-2.2c-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41s.25-1.29.17-1.41-.27-.2-.57-.35z" fill={color} />
        </svg>
      </a>
    </div>
  )
}

/**
 * @param {object}  theme       şablonun theme token-ləri
 * @param {object}  weddingData adlar + tarix üçün
 * @param {boolean} isDemoMode  CTA yalnız demo/önbaxışda görünür
 * @param {boolean} isCouple    cütlük adları göstərilsinmi
 * @param {boolean} isCorp      korporativ ad
 * @param {string}  eventLabel  tədbir adı (korporativ fallback)
 * @param {string}  serif       başlıq şrifti
 */
export default function TemplateOutro({
  theme, weddingData, lang = 'az', isDemoMode = false,
  isCouple = true, isCorp = false, eventLabel = '', serif,
}) {
  const tr  = t[lang] || t.az
  const cta = CTA[lang] || CTA.az

  /* CTA fonu şablonun səthidir → mətn rəngləri ona görə seçilir */
  const ctaBg    = theme.surface || theme.background
  const badgeCol = readableOn(ctaBg, theme.primary, theme.text)
  const descCol  = readableOn(ctaBg, theme.muted, theme.text)

  const footerText = theme.footerText || theme.text
  const iconCol    = alpha(footerText, 0.85)
  const iconBorder = alpha(footerText, 0.18)

  const goToPackages = () => {
    window.dispatchEvent(new CustomEvent('digitoy:packages'))
  }

  const names = isCouple
    ? [weddingData?.groomName, weddingData?.brideName].filter(Boolean)
    : [weddingData?.eventName || weddingData?.brideName || eventLabel].filter(Boolean)

  return (
    <>
      {/* ── DEMO CTA — yalnız demo/önbaxış rejimində ── */}
      {isDemoMode && (
        <section style={{
          padding: 'clamp(44px, 12vw, 56px) clamp(18px, 6vw, 24px) clamp(56px, 15vw, 72px)',
          background: ctaBg, textAlign: 'center',
          borderTop: `1px solid ${alpha(theme.primary, 0.16)}`,
          fontFamily: theme.fonts?.body,
        }}>
          <p style={{
            fontSize: 10, letterSpacing: '.28em', textTransform: 'uppercase',
            color: badgeCol, fontWeight: 500, margin: '0 0 16px',
          }}>
            {cta.badge}
          </p>
          <p style={{
            fontFamily: serif || theme.fonts?.heading,
            fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 300,
            color: theme.text, margin: '0 0 12px', letterSpacing: '-.02em',
          }}>
            {cta.title}
          </p>
          <p style={{
            fontSize: 14, color: descCol, fontWeight: 300,
            maxWidth: 380, margin: '0 auto 36px', lineHeight: 1.7,
          }}>
            {cta.desc}
          </p>
          <motion.button
            type="button"
            onClick={goToPackages}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              minHeight: 48, padding: '14px clamp(28px, 9vw, 44px)',
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary || theme.primary} 100%)`,
              border: 'none', borderRadius: 999, cursor: 'pointer',
              fontFamily: theme.fonts?.body,
              fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase',
              fontWeight: 600, color: readableOn(theme.primary, theme.background, theme.text),
              boxShadow: `0 8px 28px ${alpha(theme.primary, 0.35)}`,
              maxWidth: '100%',
            }}
          >
            {cta.btn}
            <span style={{ fontSize: 14, letterSpacing: 0, fontWeight: 400 }}>→</span>
          </motion.button>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={{
        padding: 'clamp(44px, 11vw, 64px) clamp(18px, 6vw, 24px)',
        background: theme.footerBg || theme.text, textAlign: 'center',
        fontFamily: theme.fonts?.body,
      }}>
        <div style={{
          fontFamily: serif || theme.fonts?.heading,
          fontSize: 'clamp(16px, 4.5vw, 18px)', letterSpacing: '.04em',
          color: theme.primary, marginBottom: 12,
        }}>
          {names.length === 2 ? (
            <>
              {names[0]}
              <span style={{ color: alpha(footerText, 0.28), margin: '0 12px', fontStyle: 'italic' }}>&</span>
              {names[1]}
            </>
          ) : (names[0] || '')}
        </div>

        <p style={{
          fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase',
          color: alpha(footerText, 0.45), margin: '0 0 32px', fontWeight: 500,
        }}>
          {formatFullDateByLang(weddingData?.date, lang)}
        </p>

        <div style={{
          width: 120, height: 1, margin: '0 auto 32px',
          background: alpha(theme.primary, 0.28),
        }} />

        <p style={{
          fontSize: 10, letterSpacing: '.26em', textTransform: 'uppercase',
          color: alpha(footerText, 0.4), margin: '0 0 20px', fontWeight: 300,
        }}>
          {tr.footer_made}
        </p>

        <SocialIcons color={iconCol} border={iconBorder} />
      </footer>
    </>
  )
}
