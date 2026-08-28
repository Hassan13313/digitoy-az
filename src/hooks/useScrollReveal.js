import { useEffect, useRef, useState } from 'react'

/**
 * Element ekrana girəndə bir dəfə `visible` qaytarır (sonra observer sönür).
 *
 * @param {number|{threshold?:number, rootMargin?:string}} options
 *   Köhnə çağırış forması (`useScrollReveal(0.2)`) saxlanılıb.
 *
 * ⚠ `rootMargin` alt kənardan -8%: bölmə ekranın lap kənarına toxunanda yox,
 * bir az içəri girəndə açılır — telefonda hərəkət daha təbii oxunur.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠⚠ BU HOOK FAIL-SAFE OLMALIDIR — bax index.css › `[data-reveal]`.
 *
 * Bölmə `opacity: 0` ilə BAŞLAYIR və yalnız burada `visible` true olanda
 * görünür. Yəni bu hook işə düşməsə, bölmə İSTİFADƏÇİ ÜÇÜN HƏMİŞƏLİK YOX OLUR
 * — səhifə açılır, amma məzmun görünmür. Ona görə üç qat qoruma var:
 *
 *   1) `threshold: 0` — HÜNDÜR bölmələr üçün MƏCBURİDİR.
 *      Köhnə `threshold: 0.12` bölmənin 12%-nin görünməsini tələb edirdi.
 *      Kəsişmə nisbəti = görünən hündürlük / BÖLMƏNİN hündürlüyü, ona görə
 *      bölmə ekrandan ~8 dəfə hündür olanda bu nisbətə HEÇ VAXT çatmır:
 *          viewport 844px → 6471px-dən hündür bölmə heç vaxt açılmır
 *          viewport 600px → 4600px-dən hündür bölmə heç vaxt açılmır
 *      Təbrik Kitabı mesaj sayı ilə böyüyür — çox təbrik yığılan toylarda
 *      bölmə məhz bu həddi keçib görünməz qalırdı.
 *      `threshold: 0` + alt `rootMargin` eyni vizual ritmi verir (bölmənin
 *      üstü ekranın 92%-ni keçəndə açılır), amma hündürlükdən ASILI DEYİL.
 *
 *   2) IntersectionObserver yoxdursa (köhnə/qeyri-adi brauzer, bəzi WebView)
 *      dərhal göstər — animasiyasız, amma GÖRÜNƏN.
 *
 *   3) Təhlükəsizlik toru: observer ilk kadrda işə düşməyə bilər (element ağır
 *      kadrın içində mount olanda baş verir). 1200ms sonra əl ilə bir dəfə
 *      `getBoundingClientRect()` yoxlanılır — element ekrandadırsa göstərilir.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export function useScrollReveal(options = 0) {
  const { threshold = 0, rootMargin = '0px 0px -8% 0px' } =
    typeof options === 'number' ? { threshold: options } : (options || {})

  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /* (2) Observer dəstəklənmir → gizli qalmaqdansa dərhal göstər */
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }

    let done = false
    const show = () => { if (!done) { done = true; setVisible(true) } }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { show(); observer.unobserve(el) }
      },
      { threshold, rootMargin }
    )
    observer.observe(el)

    /* (3) Təhlükəsizlik toru — yalnız element HƏQİQƏTƏN ekrandadırsa işləyir,
       yəni aşağıdakı bölmələr vaxtından əvvəl açılmır, scroll animasiyası qalır. */
    const safety = setTimeout(() => {
      if (done || !ref.current) return
      const r = ref.current.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      if (r.top < vh && r.bottom > 0) { show(); observer.unobserve(el) }
    }, 1200)

    return () => { clearTimeout(safety); observer.unobserve(el) }
  }, [threshold, rootMargin])

  return [ref, visible]
}
