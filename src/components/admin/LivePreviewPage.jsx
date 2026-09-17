import { useEffect, useState } from 'react'
import TemplateRenderer from '../../templates/TemplateRenderer'

/* ─────────────────────────────────────────────────────────────────────────────
   CANLI ÖNBAXIŞ SƏHİFƏSİ (Phase 42.1 · #6) — `/preview/live`

   NƏ ÜÇÜN AYRICA SƏHİFƏ (iframe): admin panelin içində, adi `<div>`-də
   göstərilən önbaxış «telefon görünüşü» verə BİLMİR. Səbəb şablonlardadır:
   ölçülər `clamp(15px, 4.4vw, 17px)` şəklindədir və `vw` KONTEYNERƏ yox,
   BRAUZER PƏNCƏRƏSİNƏ görə hesablanır. Yəni 390px-lik div-in içində də mətn
   1440px-lik ekrana görə ölçülür — nəticə heç vaxt real mobil olmur.

   iframe-də isə `vw` = iframe-in eni. Ona görə telefon/desktop keçidi
   HƏQİQİ olur. Əlavə olaraq iframe öz scroll-unu alır (əvvəlki qutu
   `overflow:hidden` idi və aşağı bölmələrə ümumiyyətlə çatmaq olmurdu).

   ⚠ BU SƏHİFƏ ŞƏBƏKƏYƏ SORĞU GÖNDƏRMİR: dəvətnamə datası valideyn pəncərədən
   `postMessage` ilə gəlir. Yəni admin YAZDIQCA — saxlamadan — göstərir.

   ⚠ TƏHLÜKƏSİZLİK: yalnız EYNİ ORIGIN-dən gələn mesaj qəbul edilir. Bu səhifə
   heç bir şey yazmır, yalnız render edir; `robots.txt`-ə də düşməsin deyə
   `noindex` meta qoyulur.
   ───────────────────────────────────────────────────────────────────────── */

const MSG_DATA   = 'digitoy:preview:data'
const MSG_SCROLL = 'digitoy:preview:scroll'
const MSG_READY  = 'digitoy:preview:ready'

export default function LivePreviewPage() {
  const [payload, setPayload] = useState(null)

  useEffect(() => {
    /* Axtarış motorları bu səhifəni indeksləməsin */
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)

    const onMessage = (e) => {
      /* ⚠ Origin yoxlaması MƏCBURİDİR — başqa sayt bu iframe-ə məzmun
         göndərə bilməsin. */
      if (e.origin !== window.location.origin) return
      const d = e.data
      if (!d || typeof d !== 'object') return

      if (d.type === MSG_DATA) {
        setPayload({ template: d.template, weddingData: d.weddingData, lang: d.lang })
        return
      }

      if (d.type === MSG_SCROLL && d.section) {
        /* ⚠ `data-section` lövbərləri `TemplateShell`-dədir (Phase 43).
           Bölmə hələ render olunmayıbsa (məs. söndürülübsə) heç nə etmirik. */
        const el = document.querySelector(`[data-section="${d.section}"]`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    window.addEventListener('message', onMessage)
    /* Valideynə «hazıram» de — o, ilk datanı göndərsin.
       ⚠ iframe `onLoad`-dan ƏVVƏL də mesaj gələ bilər, ona görə hazır
       siqnalı biz göndəririk, valideyn gözləmir. */
    try { window.parent?.postMessage({ type: MSG_READY }, window.location.origin) } catch { /* ayrı origin */ }

    return () => {
      window.removeEventListener('message', onMessage)
      meta.remove()
    }
  }, [])

  if (!payload?.weddingData || !payload?.template) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#8C7B6B', background: '#FDFAF4',
        padding: 24, textAlign: 'center', lineHeight: 1.7,
      }}>
        Önbaxış hazırlanır…
      </div>
    )
  }

  return (
    <TemplateRenderer
      template={payload.template}
      isPreview
      weddingData={payload.weddingData}
      lang={payload.lang || 'az'}
      isDemoMode
      onBack={() => {}}
      setLang={() => {}}
      /* ⚠ Açılış ekranı atlanır: admin redaktə etdiyi bölmələri dərhal
         görməlidir, zərf animasiyasını hər dəyişiklikdə izləməməlidir. */
      startOpened
    />
  )
}
