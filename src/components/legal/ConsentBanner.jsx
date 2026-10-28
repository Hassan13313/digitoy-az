import { useEffect, useSyncExternalStore } from 'react'
import { consent } from '../../utils/consent'
import { legalUi } from '../../data/legal/ui'
import { spaClick } from '../../utils/siteRoutes'
import CookieBanner from '../landing/v2/CookieBanner'

/* ─────────────────────────────────────────────────────────────────────────────
   KUKİ BANNERİ (Phase 47 məntiqi · UI redesign 2026-10 görünüşü)

   GA4 və PostHog YALNIZ «Qəbul et»dən sonra yüklənir (utils/analytics.js).
   Hansı səhifədə çıxdığını utils/consent.js → CONSENT_PROMPT_VIEWS həll edir:
   qonaqların açdığı dəvətnamələrdə çıxmır.

   • «Qəbul et» və «İmtina et» eyni ölçü və çəkidədir — imtina gizlədilmir.
   • Səhifəni bağlamır (modal deyil): oxumağa və sifarişə mane olmur.
   • Görünüş landing/v2/CookieBanner-dədir; mətnlər data/legal/ui.js-dən
     (3 dil), razılıq vəziyyəti utils/consent.js-dən gəlir.
   ───────────────────────────────────────────────────────────────────────── */

const MORE_HREF = '/mexfilik#kuki'
/* Açılış ekranlı səhifələrdə banner dəvətnamə açılana qədər gözləyir (bax
   utils/consent.js › CONSENT_DEFER_VIEWS); açılış siqnalı gəlməsə (məs. video
   açılışlı Simple Luxury) bu vaxtdan sonra özü çıxır. */
const DEFER_FALLBACK_MS = 20000

export default function ConsentBanner() {
  const snap = useSyncExternalStore(consent.subscribe, consent.getSnapshot, consent.getSnapshot)
  const t = legalUi(snap.lang).consent
  useEffect(() => {
    const timer = setTimeout(() => consent.reveal(), DEFER_FALLBACK_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <CookieBanner
      lang={snap.lang}
      visible={snap.showBanner}
      copy={{ title: t.title, text: t.text, accept: t.accept, reject: t.decline, more: t.more }}
      moreHref={MORE_HREF}
      onMore={(e) => spaClick(e, MORE_HREF)}
      onAccept={() => consent.setStatus('granted')}
      onReject={() => consent.setStatus('denied')}
    />
  )
}
