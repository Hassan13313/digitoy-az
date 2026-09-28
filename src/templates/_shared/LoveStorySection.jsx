import { useEffect, useMemo } from 'react'
import { hidePhoto } from '../../utils/photoGallery'
import { ensureScriptFont } from '../fonts'
import {
  STORY_FONTS as F, OCT, getStoryTheme, getStoryCopy, chapterLabel,
  frameStyle, heroStyle, chapterLayout, chapterAnchors, formatStoryDate, storyPhotos,
} from './loveStoryTheme'

/* ─────────────────────────────────────────────────────────────────────────────
   LOVE STORY — «Bizim Hekayəmiz» bölməsi (Phase 44 · Claude Design)

   Dizayn: «Love Story.dc.html». 16 şablonun hər biri öz çərçivəsi, əsas
   foto forması və fəsil nişanları ilə (bax ./loveStoryTheme.js).

   ⚠ ŞƏKİL SAYI SƏRBƏSTDİR: dizayndakı 4 fəsil maketi fəsildəki şəkil sayına
   görə seçilir (bax `chapterLayout`). Fəsil sayı da sabit deyil — nişanlar
   (I · 01 · A1 · ✦ I) generasiya olunur.
   ⚠ TAMAMİLƏ KÖNÜLLÜ: `story` boşdursa komponent `null` qaytarır.
   ⚠ ÇOXDİLLİLİK: istifadəçi mətnləri `resolveWeddingContent()`-dən ARTIQ
   tərcümə olunmuş gəlir; burada yalnız bölmənin öz mətnləri seçilir.
   ⚠ ŞƏKİL MƏNBƏYİ: Phase 44-dən fayl yolu (`/uploads/_story/…`), Phase 43
   data URI-ləri də göstərilir. Başqa sxemlər `storyPhotoSrc` ilə atılır.
   ───────────────────────────────────────────────────────────────────────── */

const Heart = ({ color }) => (
  <svg width="14" height="12" viewBox="0 0 24 21" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M12 21 1.5 10.5A6 6 0 0 1 12 3a6 6 0 0 1 10.5 7.5Z" fill={color} />
  </svg>
)

function Photo({ src, alt }) {
  return (
    <img
      src={src} alt={alt} loading="lazy" decoding="async" onError={hidePhoto}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  )
}

/** Çərçivəli şəkil: dizayndakı wrap → box → (lent) → outer → inner → yazı */
function Framed({ t, rot, ratio, src, alt, caption, tapeStyle, wrapStyle, record, recordStyle }) {
  const f = frameStyle(t, rot, ratio)
  return (
    <div style={{ position: 'relative', ...wrapStyle }}>
      {record && <div aria-hidden="true" style={recordStyle} />}
      <div style={f.box}>
        {f.tape && tapeStyle && <div aria-hidden="true" style={tapeStyle} />}
        <div style={f.outer}><div style={f.inner}><Photo src={src} alt={alt} /></div></div>
        {caption ? <div style={f.cap}>{caption}</div> : null}
      </div>
    </div>
  )
}

export default function LoveStorySection({
  story, templateId = 'simple-luxury', lang = 'az',
  kicker: kickerOverride = null, title: titleOverride = null, adminTheme = null,
}) {
  const chapters = useMemo(() => (
    (Array.isArray(story) ? story : [])
      .map(b => (b && typeof b === 'object' ? { ...b, pics: storyPhotos(b) } : null))
      .filter(b => b && (String(b.title || '').trim() || String(b.text || '').trim() || b.pics.length))
  ), [story])

  const t = useMemo(() => getStoryTheme(templateId, adminTheme), [templateId, adminTheme])
  const copy = getStoryCopy(templateId, lang)

  useEffect(() => { if (t.usesScript) ensureScriptFont() }, [t.usesScript])

  if (!chapters.length) return null

  /* ── Stil tokenləri (dizayndakı `s` obyekti) ── */
  const kicker = { fontFamily: t.body, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: t.hi, margin: 0 }
  const p = {
    fontFamily: t.textItalic ? t.head : t.body, fontStyle: t.textItalic ? 'italic' : 'normal',
    fontSize: t.textItalic ? 16 : 13, lineHeight: 1.55, color: t.mute, margin: 0,
    textWrap: 'pretty', overflowWrap: 'anywhere', whiteSpace: 'pre-line',
  }
  const s = {
    kickerHead: { ...kicker, letterSpacing: '0.35em' },
    title: {
      fontFamily: t.titleFont, fontSize: `clamp(${Math.round(t.titleSize * 0.72)}px, ${(t.titleSize / 4.3).toFixed(1)}vw, ${t.titleSize}px)`,
      fontStyle: t.titleItalic ? 'italic' : 'normal', textTransform: t.titleUpper ? 'uppercase' : 'none',
      letterSpacing: t.titleFont === F.bebas ? '0.06em' : (t.titleUpper ? '0.02em' : 0),
      fontWeight: t.titleFont === F.sg ? 700 : 400, lineHeight: 1.05, margin: 0,
      color: t.script ? (t.paper && t.paper !== '#FFFFFF' ? t.paper : t.ink) : t.ink,
    },
    sub: { fontFamily: t.textItalic ? t.head : t.body, fontStyle: t.textItalic ? 'italic' : 'normal', fontSize: t.textItalic ? 17 : 12, color: t.mute, margin: 0 },
    rule: { width: 48, height: 1, background: t.line },
    h: { fontFamily: t.head, fontSize: 'clamp(21px, 6.2vw, 26px)', lineHeight: 1.1, color: t.ink, margin: 0, overflowWrap: 'anywhere', fontWeight: t.head === F.sg || t.head === F.archivo ? 700 : 400 },
    p,
    card: {
      position: 'relative', zIndex: 2, background: t.surf, border: '1px solid ' + t.line + '73',
      borderRadius: t.frame === 'glass' ? 16 : (t.frame === 'ticket' ? 10 : 0),
      backdropFilter: t.frame === 'glass' ? 'blur(10px)' : 'none', WebkitBackdropFilter: t.frame === 'glass' ? 'blur(10px)' : 'none',
      padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: 6,
    },
    tape: { position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%) rotate(2deg)', width: 84, height: 24, background: t.hi + 'B0', zIndex: 2 },
    tapeR: { position: 'absolute', top: -10, right: 18, transform: 'rotate(-8deg)', width: 60, height: 20, background: t.hi + 'B0', zIndex: 2 },
    record: { position: 'absolute', top: '6%', right: '-20%', width: '78%', aspectRatio: '1', borderRadius: '50%', zIndex: 0, background: `radial-gradient(circle,#0E0E0E 0 2%,${t.hi} 2.5% 17%,transparent 17.5%),repeating-radial-gradient(circle,#111 0 2px,#1F1F1F 2px 4px)`, boxShadow: '0 12px 30px rgba(0,0,0,0.6)' },
    big: { fontFamily: t.script ? t.cap : t.head, fontStyle: !t.script && t.textItalic ? 'italic' : 'normal', fontWeight: t.head === F.sg ? 700 : 400, fontSize: `clamp(28px, 9vw, ${t.script ? 46 : t.bigSize}px)`, lineHeight: 1.05, color: t.script ? t.hi : t.ink, margin: 0, overflowWrap: 'anywhere' },
    end: { fontFamily: t.script ? t.cap : t.head, fontStyle: !t.script && t.textItalic ? 'italic' : 'normal', fontSize: t.script ? 'clamp(30px, 9vw, 40px)' : 'clamp(24px, 7vw, 30px)', lineHeight: 1.15, color: t.script ? t.hi : t.ink, textWrap: 'balance', margin: 0 },
  }
  const mark = (pos) => ({
    position: 'absolute', fontFamily: t.frame === 'film' ? F.bebas : t.head, fontSize: 'clamp(84px, 26vw, 110px)',
    lineHeight: 1, color: t.hi, opacity: 0.12, pointerEvents: 'none', whiteSpace: 'nowrap', ...pos,
  })

  const total = chapters.length

  /* Fəsil başlığı: (ikon) + prefiks nişan · tarix */
  const kickerEl = (ch, label, align) => {
    const date = formatStoryDate(ch.date, lang)
    const text = (t.kpre && copy.kpre ? `${copy.kpre} ${label}${date ? ' · ' : ''}` : '') + date
    if (!text && !ch.icon) return null
    return (
      <p style={{ ...kicker, display: 'flex', alignItems: 'center', gap: 8, justifyContent: align }}>
        {ch.icon && <span aria-hidden="true" style={{ fontSize: 16, letterSpacing: 0, lineHeight: 1 }}>{ch.icon}</span>}
        {text && <span>{text}</span>}
      </p>
    )
  }

  const capFor = (ch, label) => {
    const c = String(ch.caption || '').trim()
    if (t.frame === 'ticket') return label + (c ? ' · ' + c : '')
    if (t.frame === 'clipping') return c ? `${copy.photo}: ${c}` : ''
    return c
  }

  const textEl = (ch, label, align = 'flex-start', narrow = false) => (
    <>
      {kickerEl(ch, label, align)}
      {ch.title && <h3 style={s.h}>{ch.title}</h3>}
      {ch.text && <p style={{ ...s.p, maxWidth: narrow ? 260 : undefined, textAlign: align === 'flex-end' ? 'right' : (align === 'center' ? 'center' : 'left') }}>{ch.text}</p>}
    </>
  )

  const renderChapter = (ch, i) => {
    const label = chapterLabel(t.labels, i, total)
    const layout = chapterLayout(i, ch.pics.length)
    const alt = ch.title || ''
    const cap = capFor(ch, label)

    if (layout === 'feature') return (
      <div style={{ position: 'relative' }}>
        <div aria-hidden="true" style={mark({ right: 0, top: -18 })}>{label}</div>
        <Framed t={t} rot={-3} ratio="4/5" src={ch.pics[0]} alt={alt} caption={cap}
          tapeStyle={s.tape} wrapStyle={{ width: '78%' }} record={t.record} recordStyle={s.record} />
        <div style={{ ...s.card, width: '62%', margin: (t.frame === 'polaroid' || t.frame === 'mat' ? '-14px' : '10px') + ' 0 0 auto' }}>
          {textEl(ch, label)}
        </div>
      </div>
    )

    if (layout === 'duo') {
      const extras = ch.pics.slice(2)
      return (
        <div style={{ position: 'relative' }}>
          <div aria-hidden="true" style={mark({ left: 0, top: -24 })}>{label}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', textAlign: 'right', marginBottom: 26, position: 'relative' }}>
            {textEl(ch, label, 'flex-end', true)}
          </div>
          <div style={{ position: 'relative', aspectRatio: '382 / 340', marginBottom: cap ? 44 : 24 }}>
            <Framed t={t} rot={4} ratio="1/1" src={ch.pics[0]} alt={alt} record={t.record} recordStyle={s.record}
              wrapStyle={{ position: 'absolute', right: 4, top: 0, width: '60%' }} />
            <Framed t={t} rot={-6} ratio="1/1" src={ch.pics[1]} alt={alt} caption={cap} tapeStyle={s.tape}
              wrapStyle={{ position: 'absolute', left: 4, top: '35%', width: '52%', zIndex: 2 }} />
          </div>
          {extras.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '22px 16px', padding: '0 6px' }}>
              {extras.map((src, j) => {
                const lone = extras.length % 2 === 1 && j === extras.length - 1
                return (
                  <Framed key={src + j} t={t} rot={j % 2 ? 3 : -3} ratio="1/1" src={src} alt={alt}
                    wrapStyle={lone ? { gridColumn: '1 / -1', width: '56%', margin: '0 auto' } : undefined} />
                )
              })}
            </div>
          )}
        </div>
      )
    }

    if (layout === 'hero') {
      const h = heroStyle(t)
      return (
        <div style={{ position: 'relative', padding: t.hero === 'letterbox' ? 0 : '0 clamp(8px, 5vw, 40px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, textAlign: 'center' }}>
          <div aria-hidden="true" style={mark({ right: 0, top: -10 })}>{label}</div>
          <div style={h.outer}>
            <div style={h.inner}><Photo src={ch.pics[0]} alt={alt} /></div>
            {h.disc && <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '20%', aspectRatio: '1', borderRadius: '50%', background: `radial-gradient(circle,#0E0E0E 0 9%,${t.hi} 10%)`, pointerEvents: 'none' }} />}
            <div aria-hidden="true" style={{
              position: 'absolute', left: '50%', bottom: -18, transform: 'translateX(-50%)', width: 36, height: 36,
              borderRadius: t.frame === 'gem' ? 0 : '50%', clipPath: t.frame === 'gem' ? OCT : 'none',
              background: t.surf.startsWith('rgba') ? '#FFFFFF' : t.surf, border: '1px solid ' + t.line,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3, fontSize: 17, lineHeight: 1,
            }}>
              {ch.icon || <Heart color={t.hi} />}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', marginTop: 12, padding: '0 8px' }}>
            {kickerEl(ch, label, 'center')}
            {ch.title && <h3 style={s.big}>{ch.title}</h3>}
            {ch.text && <p style={{ ...s.p, maxWidth: 290, textAlign: 'center' }}>{ch.text}</p>}
          </div>
        </div>
      )
    }

    if (layout === 'split' || layout === 'splitR') {
      const mirror = layout === 'splitR'
      const photo = (
        <Framed t={t} rot={mirror ? -3 : 3} ratio="3/4" src={ch.pics[0]} alt={alt} caption={cap}
          tapeStyle={mirror ? { ...s.tapeR, right: 'auto', left: 18, transform: 'rotate(8deg)' } : s.tapeR} />
      )
      return (
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: mirror ? 'minmax(0,1.1fr) minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1.1fr)', gap: 18, alignItems: 'center' }}>
          <div aria-hidden="true" style={mark(mirror ? { right: 0, bottom: -44 } : { left: 0, bottom: -44 })}>{label}</div>
          {mirror && photo}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', alignItems: mirror ? 'flex-end' : 'flex-start', textAlign: mirror ? 'right' : 'left' }}>
            {textEl(ch, label, mirror ? 'flex-end' : 'flex-start')}
          </div>
          {!mirror && photo}
        </div>
      )
    }

    /* Şəkilsiz fəsil — kart, tərəfi növbələşir */
    const right = i % 2 === 0
    return (
      <div style={{ position: 'relative' }}>
        <div aria-hidden="true" style={mark(right ? { left: 0, top: -30 } : { right: 0, top: -30 })}>{label}</div>
        <div style={{ ...s.card, width: '86%', margin: right ? '0 0 0 auto' : '0 auto 0 0' }}>
          {textEl(ch, label)}
        </div>
      </div>
    )
  }

  const layouts = chapters.map((ch, i) => chapterLayout(i, ch.pics.length))

  /* ⚠ `lang`: səhifə həmişə lang="az"-dır və CSS `uppercase` ingiliscə «i»-ni
     «İ»-yə çevirir (FLIGHT → FLİGHT). Bölmə öz dilini elan edir ki, böyük
     hərflər hər dildə düzgün çıxsın (AZ-da i → İ yenə düzgündür). */
  return (
    <div lang={lang} style={{ position: 'relative', overflow: 'hidden', maxWidth: 440, margin: '0 auto', color: t.ink, textAlign: 'left', padding: '8px 0 12px' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative', padding: '0 8px' }}>
        <p style={s.kickerHead}>{kickerOverride || copy.kicker}</p>
        <h2 style={s.title}>{titleOverride || copy.title}</h2>
        <p style={s.sub}>{copy.sub}</p>
        <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <div style={s.rule} /><Heart color={t.hi} /><div style={s.rule} />
        </div>
      </div>

      <ol style={{ listStyle: 'none', margin: '56px 0 0', padding: 0 }}>
        {chapters.map((ch, i) => {
          const prev = i > 0 ? chapterAnchors(layouts[i - 1], i - 1).out : null
          const next = chapterAnchors(layouts[i], i).in
          return (
            <li key={ch.id || i} style={{ position: 'relative', minWidth: 0 }}>
              {prev !== null && (
                <svg width="100%" height="90" viewBox="0 0 430 90" preserveAspectRatio="none" aria-hidden="true" style={{ display: 'block', margin: '10px 0' }}>
                  <path d={`M${prev} 5 C ${prev} 60, ${next} 30, ${next} 85`} fill="none" stroke={t.line} strokeWidth="1"
                    strokeDasharray={t.dash} opacity="0.7" vectorEffect="non-scaling-stroke" />
                </svg>
              )}
              {renderChapter(ch, i)}
            </li>
          )
        })}
      </ol>

      <div style={{ marginTop: 88, padding: '0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
        <svg width="64" height="36" viewBox="0 0 64 36" aria-hidden="true">
          <circle cx="24" cy="18" r="14" fill="none" stroke={t.hi} strokeWidth="1.2" />
          <circle cx="40" cy="18" r="14" fill="none" stroke={t.hi} strokeWidth="1.2" />
        </svg>
        <p style={s.kickerHead}>{copy.next}</p>
        <p style={s.end}>{copy.end}</p>
        <p style={s.sub}>{copy.endSub}</p>
      </div>
    </div>
  )
}
