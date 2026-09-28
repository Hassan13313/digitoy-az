import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Film } from 'lucide-react'
import { formatAzDate } from '../../utils/dateFormat'

/* ─────────────────────────────────────────────────────────────────────────────
   GalleryCover — qalereyanın üz qapağı (Phase 43)

   Qonaq QR-i skan edib gələndə ilk gördüyü ekran. Dörd şey deyir:
   kimin toyu, nə vaxt, nə qədər foto, nə qədər video.

   ⚠ MOBİL-FIRST: hündürlük `svh` ilə ölçülür (`vh` iOS Safari-də ünvan
   sətri gizlənəndə səhifəni sıçradır), ölçülər `clamp()` ilə axır.
   ⚠ ŞƏKİL KÖNÜLLÜDÜR: qapaq şəkli yoxdursa qradiyent fon + monoqram qalır,
   yəni yeni toyda (hələ foto yüklənməmiş) da səhifə tam görünür.
   ⚠ Sayğaclar CANLI: `useGalleryMeta` onları 20 saniyəlik intervalda
   yeniləyir, rəqəm dəyişəndə isə yumşaq keçidlə artır.
   ───────────────────────────────────────────────────────────────────────── */

const GOLD = 'rgba(197,160,89,'

function CountPill({ icon: Icon, value, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'clamp(6px, 2vw, 9px)',
      padding: 'clamp(8px, 2.4vw, 11px) clamp(12px, 3.6vw, 18px)',
      border: `1px solid ${GOLD}0.34)`,
      background: 'rgba(12,9,6,0.34)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: 2,
      minWidth: 0,
    }}>
      <Icon size={14} strokeWidth={1.5} style={{ color: `${GOLD}0.95)`, flexShrink: 0 }} />
      <span style={{
        fontFamily: '"Inter",system-ui,sans-serif',
        fontSize: 'clamp(15px, 4.6vw, 19px)', fontWeight: 300,
        color: '#FFF', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: '"Inter",system-ui,sans-serif',
        fontSize: 'clamp(7.5px, 2.2vw, 9px)', letterSpacing: '0.2em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.62)',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </div>
  )
}

export default function GalleryCover({
  names,
  title,
  date,
  venue,
  photos = 0,
  videos = 0,
  coverUrl = null,
  subtitle = '',
  lang = 'az',
  compact = false,
  children,
}) {
  const { formattedDate } = useMemo(
    () => (date ? formatAzDate(date, lang) : { formattedDate: '' }),
    [date, lang],
  )

  const heading = names || title || ''
  const L = {
    az: { photo: 'Foto', video: 'Video', kicker: 'Xatirə Qalereyası' },
    en: { photo: 'Photos', video: 'Videos', kicker: 'Memory Gallery' },
    ru: { photo: 'Фото', video: 'Видео', kicker: 'Галерея' },
  }[lang] || { photo: 'Foto', video: 'Video', kicker: 'Xatirə Qalereyası' }

  return (
    <section
      aria-label={L.kicker}
      style={{
        position: 'relative',
        /* ⚠ `svh`: iOS-da ünvan sətri gizlənəndə `vh` dəyişir və qapaq
           sıçrayır. `svh` sabit «kiçik viewport»-u götürür. */
        minHeight: compact ? 'clamp(210px, 34svh, 300px)' : 'clamp(300px, 52svh, 460px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(28px, 7vw, 48px) clamp(16px, 5vw, 32px)',
        overflow: 'hidden',
        background: '#14100A',
        isolation: 'isolate',
      }}
    >
      {/* Qapaq şəkli */}
      {coverUrl && (
        <img
          src={coverUrl}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 32%',
            /* Mətn HƏMİŞƏ oxunaqlı qalsın — şəklin parlaqlığından asılı olmayaraq */
            filter: 'brightness(0.52) saturate(0.92)',
          }}
        />
      )}

      {/* Qradiyent örtük — şəkil olmasa da qapağa dərinlik verir */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: coverUrl
          ? 'linear-gradient(to bottom, rgba(10,8,5,0.62) 0%, rgba(10,8,5,0.24) 42%, rgba(10,8,5,0.82) 100%)'
          : `radial-gradient(ellipse 80% 60% at 50% 32%, ${GOLD}0.16) 0%, transparent 70%), linear-gradient(160deg, #1A140C 0%, #0D0A06 100%)`,
      }} />

      {/* Məzmun */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ position: 'relative', textAlign: 'center', maxWidth: 620, width: '100%' }}
      >
        <p style={{
          fontFamily: '"Inter",system-ui,sans-serif',
          fontSize: 'clamp(7.5px, 2.3vw, 9px)', letterSpacing: '0.34em',
          textTransform: 'uppercase', color: `${GOLD}0.92)`,
          marginBottom: 'clamp(10px, 3vw, 16px)',
        }}>
          {L.kicker}
        </p>

        {heading && (
          <h1 style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",Georgia,serif',
            fontSize: compact ? 'clamp(24px, 7vw, 34px)' : 'clamp(30px, 9vw, 52px)',
            fontWeight: 300, lineHeight: 1.12, color: '#FFFFFF',
            margin: 0, letterSpacing: '-0.01em',
            textShadow: coverUrl ? '0 2px 24px rgba(0,0,0,0.55)' : 'none',
            /* Uzun adlar mobil ekranda kənara çıxmasın */
            overflowWrap: 'anywhere',
          }}>
            {heading}
          </h1>
        )}

        {(formattedDate || venue) && (
          <p style={{
            fontFamily: '"Inter",system-ui,sans-serif',
            fontSize: 'clamp(9.5px, 2.8vw, 11px)', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)',
            marginTop: 'clamp(10px, 3vw, 15px)',
          }}>
            {[formattedDate, venue].filter(Boolean).join(' · ')}
          </p>
        )}

        {subtitle && (
          <p style={{
            fontFamily: '"Inter",system-ui,sans-serif',
            fontSize: 'clamp(11.5px, 3.3vw, 13px)', lineHeight: 1.65,
            color: 'rgba(255,255,255,0.8)', marginTop: 'clamp(10px, 3vw, 14px)',
            maxWidth: 440, marginLeft: 'auto', marginRight: 'auto',
          }}>
            {subtitle}
          </p>
        )}

        {/* Qızıl ayırıcı */}
        <div aria-hidden="true" style={{
          width: 'clamp(54px, 16vw, 90px)', height: 1, margin: 'clamp(16px, 4.5vw, 24px) auto',
          background: `linear-gradient(to right, transparent, ${GOLD}0.85), transparent)`,
        }} />

        {/* Canlı sayğaclar */}
        <div
          role="status" aria-live="polite"
          style={{
            display: 'flex', flexWrap: 'wrap', gap: 'clamp(7px, 2.4vw, 11px)',
            justifyContent: 'center',
          }}
        >
          <CountPill icon={ImageIcon} value={photos} label={L.photo} />
          {/* Video xanası yalnız video varsa göstərilir — «0 Video» boş söz deyil */}
          {videos > 0 && <CountPill icon={Film} value={videos} label={L.video} />}
        </div>

        {children && (
          <div style={{ marginTop: 'clamp(16px, 4.5vw, 24px)' }}>{children}</div>
        )}
      </motion.div>
    </section>
  )
}
