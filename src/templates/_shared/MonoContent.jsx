import { storyPhotoSrc } from '../../utils/api'

/* ═══════════════════════════════════════════════════════════════════════════
   MONOQRAM (Phase 45)

   Şablonun monoqram çərçivəsinin (romb, mum möhür, plyonka etiketi…) İÇİNDƏ
   nə göstəriləcəyini həll edir. Rejimi `openingSpec › makeOpeningText` verir:
     auto    → baş hərflər; korporativ/digər tədbirdə `text` null-dır və
               şablonun öz ornamenti (`ornament`) çəkilir
     none    → heç nə — çərçivə qalır («boş monoqram»)
     text    → admin-in yazdığı qısa mətn
     sticker → emoji, bir qədər böyük
     image   → şəkil çərçivəni doldurur; formanı çağıran `imgStyle` ilə verir

   ⚠ AYRICA FAYL: Royal Gold və Floral Garden `TemplateShell`-i yükləmir.
   Bu komponentlər OpeningFrame-də olsaydı, həmin iki şablonun chunk-ı
   TemplateShell-i (və onun hook-larını) da çəkərdi.
   ═══════════════════════════════════════════════════════════════════════════ */
export function MonoContent({ mono, ornament = null, stickerScale = 1.5, imgStyle = {} }) {
  if (!mono || mono.kind === 'none') return null
  if (mono.kind === 'image') {
    const src = storyPhotoSrc(mono.src)
    if (!src) return null
    return (
      <img
        src={src} alt="" draggable={false} decoding="async"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...imgStyle }}
      />
    )
  }
  if (mono.kind === 'sticker') {
    return <span style={{ fontSize: `${stickerScale}em`, lineHeight: 1, letterSpacing: 0, fontStyle: 'normal' }}>{mono.text}</span>
  }
  if (mono.text == null) return ornament
  return mono.text
}

/**
 * Baş hərf OLMAYAN açılışların dekorativ nişanı (almaz, daş, yarpaq, çiçək).
 * `auto` → şablonun öz nişanı (children) dəyişmədən; `none` → gizli;
 * mətn/stiker/şəkil → eyni yerdə dairəvi medalyon.
 */
export function EmblemSlot({ mono, children, size = 76, delay = 1.8, border, background, color, font, style = {} }) {
  if (!mono || mono.kind === 'auto') return children
  if (mono.kind === 'none') return null
  return (
    <div style={{
      position: 'relative', width: size, height: size, marginInline: 'auto', borderRadius: '50%',
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border, background, color, fontFamily: font, fontSize: Math.round(size * 0.3), lineHeight: 1,
      animation: `tpl-cta 1.2s cubic-bezier(.2,.9,.25,1) ${delay}s both`, ...style,
    }}>
      <MonoContent mono={mono} />
    </div>
  )
}
