import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   Honeypot — Phase 39 spam qorunması

   NƏ ÜÇÜN BELƏ: təbrik və RSVP formaları 8 fərqli yerdə render olunur
   (Guestbook.jsx, RSVPSection.jsx, TemplateShell + 3 fərdi şablon). Gizli
   sahəni hər birinə əl ilə əlavə etmək 8 şablon faylına toxunmaq deməkdir —
   məhz qaçınmaq istədiyimiz şey. Ona görə sahə formanı idarə edən HOOK-dan
   imperativ yaradılır: heç bir şablon dəyişmir, davranış hər yerdə eynidir.

   NECƏ İŞLƏYİR: sahə DOM-da real `<input>`-dur, ona görə səhifədəki bütün
   inputları dolduran bot onu da doldurur. İnsan onu görmür və toxuna bilmir:
   ekrandan kənarda, `aria-hidden`, `tabIndex=-1`, `autocomplete=off`.

   ⚠ `display:none` İSTİFADƏ EDİLMİR — bəzi botlar gizli sahələri məhz
   `display:none` ilə tanıyıb atlayır. Ekrandan kənara çıxarmaq daha
   etibarlıdır.
   ⚠ UX-ə TƏSİR ETMİR: klaviatura fokusuna düşmür, ekran oxuyucu oxumur,
   səhifə axınında yer tutmur.
   ───────────────────────────────────────────────────────────────────────── */

export function useHoneypot(name = 'website') {
  const ref = useRef(null)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const el = document.createElement('input')
    el.type = 'text'
    el.name = name
    el.tabIndex = -1
    el.autocomplete = 'off'
    el.setAttribute('aria-hidden', 'true')
    el.style.cssText =
      'position:absolute;left:-9999px;top:auto;width:1px;height:1px;opacity:0;pointer-events:none'

    document.body.appendChild(el)
    ref.current = el

    return () => {
      if (el.parentNode) el.parentNode.removeChild(el)
      ref.current = null
    }
  }, [name])

  /* Göndəriş anında oxunur. Boş deyilsə — bot. */
  return () => (ref.current ? ref.current.value : '')
}

export default useHoneypot
