import { useEffect, useRef, useState } from 'react'

/**
 * Element ekrana girəndə bir dəfə `visible` qaytarır (sonra observer sönür).
 *
 * @param {number|{threshold?:number, rootMargin?:string}} options
 *   Köhnə çağırış forması (`useScrollReveal(0.2)`) saxlanılıb.
 *
 * ⚠ `rootMargin` alt kənardan -8%: bölmə ekranın lap kənarına toxunanda yox,
 * bir az içəri girəndə açılır — telefonda hərəkət daha təbii oxunur.
 */
export function useScrollReveal(options = 0.12) {
  const { threshold = 0.12, rootMargin = '0px 0px -8% 0px' } =
    typeof options === 'number' ? { threshold: options } : (options || {})

  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.unobserve(el)
  }, [threshold, rootMargin])

  return [ref, visible]
}
