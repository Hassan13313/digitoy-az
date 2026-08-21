import { useCallback, useEffect, useRef, useState } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   useMusicPrompt — "Musiqini Başlat" bubble-ının görünmə məntiqi.

   9 şablonun HAMISI eyni qaydanı işlədir:
     • dəvətnamə açılandan `delay` ms sonra çıxır
     • qonaq SCROLL etməyə başlayan kimi yox olur (scroll boyu qalmır)
     • bubble-a toxunanda yox olur (`dismiss`)
   Bir dəfə gedəndən sonra geri qayıtmır.

   ⚠ Bubble musiqini YALNIZ YANDIRIR — səsi dayandırmaq işi sağ-aşağıdakı
   toggle düyməsinindir. Bu hook yalnız görünürlüyə baxır, audio-ya toxunmur.
   ───────────────────────────────────────────────────────────────────────── */
export function useMusicPrompt({ enabled = false, delay = 900 } = {}) {
  const [visible, setVisible] = useState(false)
  const doneRef = useRef(false)

  const dismiss = useCallback(() => {
    doneRef.current = true
    setVisible(false)
  }, [])

  /* Açılışdan `delay` sonra göstər */
  useEffect(() => {
    if (!enabled || doneRef.current) return
    const id = setTimeout(() => { if (!doneRef.current) setVisible(true) }, delay)
    return () => clearTimeout(id)
  }, [enabled, delay])

  /* İlk scroll — bubble dərhal gedir.
     ⚠ Qonaq bubble çıxmamışdan əvvəl scroll edərsə `doneRef` artıq true olur,
     yəni bubble ümumiyyətlə görünmür (onsuz da dəvətnaməyə keçib). */
  useEffect(() => {
    if (!enabled) return
    const onScroll = () => dismiss()
    window.addEventListener('scroll', onScroll, { passive: true, once: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled, dismiss])

  return [visible, dismiss]
}

export default useMusicPrompt
