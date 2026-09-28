import { useState, useCallback, useMemo } from 'react'
import { reactToMedia } from '../../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   ReactionBar — media reaksiyaları (Phase 43)

   Dörd emoji: ❤️ 😍 👏 🎉. Bir qonaq · bir media · BİR reaksiya.
   Eyni emojiyə ikinci toxunuş reaksiyanı GERİ ALIR.

   ⚠ YÜNGÜLLÜK: ayrıca sorğu YOXDUR — sayğaclar qalereya manifesti ilə
   birlikdə gəlir (`get_photos.php` → `reactions`, `myReaction`). Bu komponent
   yalnız toxunuş zamanı bir POST edir.

   ⚠ OPTİMİSTİK YENİLƏMƏ: rəqəm dərhal dəyişir, server cavabı gəldikdə
   həqiqi dəyərlə əvəz olunur. Sorğu uğursuz olarsa əvvəlki vəziyyətə
   qaytarılır — qonaq heç vaxt «saydı, sonra saymadı» görmür.

   ⚠ ƏSAS AXINA TOXUNMUR: silmə, endirmə və seçim düymələri başqa
   komponentlərdədir. Reaksiya cədvəli boş olsa (və ya endpoint yoxdursa)
   çubuq sadəcə sıfır göstərir.
   ───────────────────────────────────────────────────────────────────────── */

export const REACTIONS = ['❤️', '😍', '👏', '🎉']

const REACTION_LABELS = {
  '❤️': { az: 'Bəyəndim',   en: 'Love',    ru: 'Нравится' },
  '😍': { az: 'Çox gözəl',  en: 'Adore',   ru: 'Восторг' },
  '👏': { az: 'Alqış',      en: 'Applaud', ru: 'Аплодисменты' },
  '🎉': { az: 'Təbriklər',  en: 'Celebrate', ru: 'Поздравляю' },
}

export default function ReactionBar({
  slug,
  item,
  onChange,
  lang = 'az',
  size = 'md',
  align = 'center',
}) {
  const [busy, setBusy] = useState(false)

  /* ⚠ `|| {}` hər render-də YENİ obyekt yaradırdı → `useCallback`
     asılılığı həmişə dəyişirdi və dörd düymə hər render-də yenidən
     qurulurdu. `useMemo` referansı sabitləyir. */
  const counts = useMemo(() => item?.reactions || {}, [item?.reactions])
  const mine   = item?.myReaction || null

  const handle = useCallback(async (emoji) => {
    if (busy || !slug || !item?.id) return

    /* Eyni emojiyə təkrar toxunuş → geri alma */
    const next = mine === emoji ? '' : emoji

    /* ── Optimistik ── */
    const optimistic = { ...counts }
    if (mine) optimistic[mine] = Math.max(0, (optimistic[mine] || 1) - 1)
    if (next) optimistic[next] = (optimistic[next] || 0) + 1
    Object.keys(optimistic).forEach(k => { if (!optimistic[k]) delete optimistic[k] })

    const prev = { reactions: counts, myReaction: mine }
    onChange?.(item.id, {
      reactions: optimistic,
      myReaction: next || null,
      reactionTotal: Object.values(optimistic).reduce((a, b) => a + b, 0),
    })

    setBusy(true)
    try {
      const res = await reactToMedia(slug, item.id, next)
      onChange?.(item.id, {
        reactions: res.counts || {},
        myReaction: res.mine || null,
        reactionTotal: res.total || 0,
      })
    } catch {
      /* Serverdə saxlanmadı → görünən vəziyyət geri qaytarılır.
         Səssiz geri qaytarma qəsdəndir: qonağa xəta banneri göstərmək
         toy gecəsində faydasız narahatlıqdır, düymə isə yenidən sınana bilər. */
      onChange?.(item.id, {
        ...prev,
        reactionTotal: Object.values(prev.reactions || {}).reduce((a, b) => a + b, 0),
      })
    } finally {
      setBusy(false)
    }
  }, [busy, slug, item, counts, mine, onChange])

  const px = size === 'sm' ? 26 : size === 'lg' ? 40 : 32
  const fs = size === 'sm' ? 13 : size === 'lg' ? 20 : 16

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        display: 'flex', gap: size === 'sm' ? 3 : 5,
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      {REACTIONS.map((emoji) => {
        const n      = counts[emoji] || 0
        const active = mine === emoji
        const label  = (REACTION_LABELS[emoji]?.[lang] || REACTION_LABELS[emoji]?.az || '')
        return (
          <button
            key={emoji}
            type="button"
            data-press
            disabled={busy}
            onClick={() => handle(emoji)}
            aria-pressed={active}
            aria-label={`${label}${n ? ` (${n})` : ''}`}
            title={label}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              /* ⚠ Toxunma hədəfi: barmaq üçün ən azı 30px, `sm` variantda da */
              minHeight: Math.max(px, 30), padding: `0 ${size === 'sm' ? 6 : 9}px`,
              border: `1px solid ${active ? 'rgba(197,160,89,0.85)' : 'rgba(197,160,89,0.26)'}`,
              background: active ? 'rgba(197,160,89,0.18)' : 'rgba(255,255,255,0.05)',
              borderRadius: 999,
              cursor: busy ? 'default' : 'pointer',
              opacity: busy ? 0.6 : 1,
              transition: 'background 0.16s, border-color 0.16s, transform 0.12s',
              lineHeight: 1,
              /* Emoji-lər sistem emoji şriftindən gəlsin */
              fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
              fontSize: fs,
            }}
          >
            <span aria-hidden="true">{emoji}</span>
            {n > 0 && (
              <span style={{
                fontFamily: '"Inter",system-ui,sans-serif',
                fontSize: size === 'sm' ? 9.5 : 11,
                fontWeight: 600,
                color: active ? 'rgba(150,118,54,1)' : 'rgba(140,123,107,0.9)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {n}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
