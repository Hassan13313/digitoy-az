import { motion, AnimatePresence } from 'framer-motion'
import { Music } from 'lucide-react'
import { buildWhatsAppUrl } from '../../utils/whatsappOrder'
import { WHATSAPP_NUMBER } from '../../data/constants'
import { submitDraft } from '../../utils/api'
import { alpha, readableOn } from './geo'

/* ─────────────────────────────────────────────────────────────────────────────
   TEMPLATE ACTIONS — bütün şablonların paylaşdığı 3 hərəkət elementi.

   Phase 27-ə qədər bunlar YALNIZ simple-luxury-də (sifariş CTA + musiqi
   bubble) və heç yerdə (önbaxış geri linki) var idi. Burada bir dəfə yazılır
   ki, yeni şablon əlavə ediləndə təkrar implementasiya lazım olmasın.

   Hamısı `theme` token-lərindən rənglənir — hardcode rəng yalnız WhatsApp
   brend yaşılıdır (tanınma üçün bütün şablonlarda eyni qalır).
   ───────────────────────────────────────────────────────────────────────── */

const UI = {
  az: {
    orderKicker: 'Digitoy.az · Premium',
    orderTitle:  'Dəvətnaməniz Hazırdır!',
    orderText:   'Dizaynı tamamladınız. İndi tək bir toxunuşla dəvətnamənizi sifariş verib canlıya ala bilərsiniz.',
    orderBtn:    'Dəvətnaməni sifariş et',
    orderNote:   'WhatsApp vasitəsilə birbaşa əlaqə',
    music:       'Musiqini Başlat',
    musicAria:   'Musiqini başlat',
  },
  en: {
    orderKicker: 'Digitoy.az · Premium',
    orderTitle:  'Your Invitation Is Ready!',
    orderText:   'The design is complete. One tap and your invitation goes live.',
    orderBtn:    'Order your invitation',
    orderNote:   'Direct contact via WhatsApp',
    music:       'Play music',
    musicAria:   'Play music',
  },
  ru: {
    orderKicker: 'Digitoy.az · Premium',
    orderTitle:  'Ваше приглашение готово!',
    orderText:   'Дизайн завершён. Одно нажатие — и приглашение станет активным.',
    orderBtn:    'Заказать приглашение',
    orderNote:   'Прямая связь через WhatsApp',
    music:       'Включить музыку',
    musicAria:   'Включить музыку',
  },
}

const tr = (lang) => UI[lang] || UI.az

/* ═══════════════════════════════════════════════════════════════════════════
   SİFARİŞ CTA — yalnız builder önbaxışında görünür.

   Görünmə şərti simple-luxury-dəki ilə eynidir: `!pageSlug && !isDemoMode`
   (yəni real /invite/... səhifəsində və demo-da GÖRÜNMÜR). Şərti çağıran
   şablon yox, komponentin özü yoxlayır ki, 9 şablonda fərqli davranış
   yaranmasın.
   ═══════════════════════════════════════════════════════════════════════════ */
export function OrderCta({ theme, weddingData, lang = 'az', pageSlug, isDemoMode, effectiveSlug, serif }) {
  if (pageSlug || isDemoMode) return null

  const t = tr(lang)
  const waUrl = buildWhatsAppUrl(weddingData, lang, WHATSAPP_NUMBER, effectiveSlug, '')

  /* Bölmə fonu şablondan asılıdır → kiçik mətnlərin rəngini ona görə seç.
     Aksent fonda oxunmursa (məs. simple-luxury: krem üzərində açıq qızıl
     1.2:1) mətn tokeninə düşür. Bax `geo.js › readableOn`. */
  const bg          = theme.surface || theme.background
  const kickerColor = readableOn(bg, theme.accent, theme.text)
  const bodyColor   = readableOn(bg, theme.muted,  theme.text)

  const handleOrder = () => {
    const sid = localStorage.getItem('digitoy_session_id') || ''
    const pkg = weddingData?.package || weddingData?.selectedPackage || 'SADE'
    submitDraft(sid, weddingData, pkg).catch(() => {})
  }

  return (
    <section style={{
      padding: 'clamp(56px, 14vw, 96px) clamp(18px, 6vw, 24px)',
      background: theme.surface || theme.background,
      borderTop: `1px solid ${alpha(theme.primary, 0.2)}`,
      textAlign: 'center', position: 'relative', overflow: 'hidden',
      fontFamily: theme.fonts?.body,
    }}>
      {/* Ambient glow — şablonun öz aksenti ilə */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 70% 50% at 50% 40%, ${alpha(theme.accent, 0.12)} 0%, transparent 70%)`,
      }} />

      <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative' }}>
        <div style={{
          fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase',
          color: kickerColor, fontWeight: 600, marginBottom: 18,
        }}>
          {t.orderKicker}
        </div>

        <div style={{
          width: 60, height: 1, margin: '0 auto 26px',
          background: alpha(theme.accent, 0.6),
        }} />

        <h2 style={{
          fontFamily: serif || theme.fonts?.heading,
          fontSize: 'clamp(26px, 8vw, 36px)', fontWeight: 300,
          color: theme.text, lineHeight: 1.15, margin: '0 0 16px',
        }}>
          {t.orderTitle}
        </h2>

        <p style={{
          fontSize: 13.5, lineHeight: 1.75, color: bodyColor,
          margin: '0 auto 34px', maxWidth: 380,
        }}>
          {t.orderText}
        </p>

        {/* WhatsApp düyməsi — brend yaşılı bütün şablonlarda eynidir */}
        <a
          data-press
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOrder}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            padding: 'clamp(15px, 4vw, 18px) clamp(24px, 8vw, 44px)',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            textDecoration: 'none', cursor: 'pointer',
            fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase',
            color: '#FFFFFF', fontWeight: 700,
            boxShadow: '0 12px 48px rgba(37,211,102,0.32), 0 4px 16px rgba(0,0,0,0.12)',
            marginBottom: 20, maxWidth: '100%',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {t.orderBtn}
        </a>

        <div style={{
          fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase',
          color: bodyColor,
        }}>
          {t.orderNote}
        </div>

        <div style={{
          width: 60, height: 1, margin: '26px auto 0',
          background: alpha(theme.accent, 0.4),
        }} />
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MUSİQİ BAŞLAT BUBBLE

   ⚠ Autoplay YOXDUR (Phase 27 tələbi) — musiqi YALNIZ bu düyməyə toxunanda
   başlayır. Audio engine `useMusicPlayer` hook-udur, burada yeni engine yoxdur.
   ═══════════════════════════════════════════════════════════════════════════ */
export function MusicStartBubble({ theme, lang = 'az', visible, onStart }) {
  const t = tr(lang)

  /* ⚠ Phase 27.1: bubble YALNIZ "başlat" köməkçisidir. Musiqi artıq çalırsa
     klik səsi DAYANDIRMIR/susdurmur — çağıran `playing` yoxlaması ilə
     `play()`-i buraxır və yalnız bubble gizlənir. Dayandırmaq üçün ayrıca
     musiqi toggle düyməsi var (sağ-aşağı künc). */

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.955 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onClick={onStart}
          aria-label={t.musicAria}
          style={{
            position: 'fixed',
            bottom: 'max(96px, calc(env(safe-area-inset-bottom, 20px) + 76px))',
            right: 20, zIndex: 54,
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px 10px 14px',
            background: alpha(theme.surface || theme.background, 0.94),
            border: `1px solid ${alpha(theme.accent, 0.4)}`,
            borderRadius: 99,
            boxShadow: '0 8px 28px rgba(0,0,0,0.16), 0 1px 3px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer', maxWidth: 'calc(100vw - 40px)',
            fontFamily: theme.fonts?.body,
          }}
        >
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
            background: alpha(theme.accent, 0.16),
          }}>
            <Music size={13} strokeWidth={1.5} style={{ color: theme.accent }} />
          </span>
          <span style={{
            fontSize: 12, letterSpacing: '.04em', fontWeight: 500,
            color: theme.text, whiteSpace: 'nowrap',
          }}>
            {t.music}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
