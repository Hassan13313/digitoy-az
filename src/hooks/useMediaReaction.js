import { useState, useCallback, useMemo } from 'react'
import { reactToMedia } from '../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   useMediaReaction — media reaksiyaları (Phase 43; UI redesign 2026-10-da
   köhnə ReactionBar komponentindən məntiq olaraq ayrılıb, görünüş indi
   guest-photos/Lightbox › ReactionBar-dadır).

   Dörd emoji: ❤️ 😍 👏 🎉. Bir qonaq · bir media · BİR reaksiya.
   Eyni emojiyə ikinci toxunuş reaksiyanı GERİ ALIR.

   ⚠ YÜNGÜLLÜK: ayrıca sorğu YOXDUR — sayğaclar qalereya manifesti ilə
   birlikdə gəlir (`get_photos.php` → `reactions`, `myReaction`). Yalnız
   toxunuş zamanı bir POST edilir.

   ⚠ OPTİMİSTİK YENİLƏMƏ: rəqəm dərhal dəyişir, server cavabı gəldikdə
   həqiqi dəyərlə əvəz olunur. Sorğu uğursuz olarsa əvvəlki vəziyyətə
   qaytarılır — qonaq heç vaxt «saydı, sonra saymadı» görmür.
   ───────────────────────────────────────────────────────────────────────── */

export const REACTIONS = ['❤️', '😍', '👏', '🎉']

export function useMediaReaction(slug, item, onChange) {
  const [busy, setBusy] = useState(false)

  /* `|| {}` hər render-də YENİ obyekt yaradardı — referans sabitlənir */
  const counts = useMemo(() => item?.reactions || {}, [item?.reactions])
  const mine   = item?.myReaction || null

  const react = useCallback(async (emoji) => {
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

  return { counts, mine, busy, react }
}

export default useMediaReaction
