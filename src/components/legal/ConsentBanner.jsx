import { useSyncExternalStore } from 'react'
import { consent } from '../../utils/consent'
import { legalUi, LEGAL_LINK } from '../../data/legal/ui'
import { spaClick } from '../../utils/siteRoutes'

/* ─────────────────────────────────────────────────────────────────────────────
   KUKİ BANNERİ (Phase 47)

   GA4 və PostHog YALNIZ «Qəbul et»dən sonra yüklənir (utils/analytics.js).
   Hansı səhifədə çıxdığını utils/consent.js → CONSENT_PROMPT_VIEWS həll edir:
   qonaqların açdığı dəvətnamələrdə çıxmır.

   • «Qəbul et» və «İmtina et» eyni ölçü və çəkidədir — imtina gizlədilmir.
   • Səhifəni bağlamır (modal deyil): oxumağa və sifarişə mane olmur.
   • Əsas bundle-dadır, ona görə framer-motion yox — tək CSS girişi
     (index.css → .dt-consent), prefers-reduced-motion-da söndürülür.
   ───────────────────────────────────────────────────────────────────────── */

const DEEP_GOLD = '#8A6A2E'   /* ağ mətnlə 5:1 — adi qızılı (#C5A059) 2.4:1 verir */

export default function ConsentBanner() {
  const snap = useSyncExternalStore(consent.subscribe, consent.getSnapshot, consent.getSnapshot)
  if (!snap.showBanner) return null
  const t = legalUi(snap.lang).consent

  const btn = 'flex-1 min-h-[44px] rounded-full px-5 text-[14px] font-medium font-sans cursor-pointer transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

  return (
    <section
      role="region" aria-label={t.title}
      className="dt-consent fixed z-[150] inset-x-3 sm:inset-x-auto sm:right-5 sm:max-w-[400px] rounded-2xl bg-[#FFFDF8] text-brown-dark border border-gold/40 px-5 pt-4 pb-5"
      style={{
        bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        boxShadow: '0 14px 44px rgba(60, 40, 12, 0.16), 0 2px 6px rgba(60, 40, 12, 0.06)',
      }}
    >
      <h2 className="font-serif text-[20px] text-ink leading-tight">{t.title}</h2>
      <p className="mt-1.5 text-[13.5px] leading-relaxed">
        {t.text}{' '}
        <a
          href="/mexfilik#kuki" onClick={(e) => spaClick(e, '/mexfilik#kuki')}
          className="underline underline-offset-4" style={{ color: LEGAL_LINK }}
        >
          {t.more}
        </a>
      </p>
      <div className="mt-4 flex gap-2.5">
        <button
          type="button" onClick={() => consent.setStatus('denied')}
          className={`${btn} bg-transparent text-ink border hover:bg-[#F5EEDF]`}
          style={{ borderColor: DEEP_GOLD, outlineColor: DEEP_GOLD }}
        >
          {t.decline}
        </button>
        <button
          type="button" onClick={() => consent.setStatus('granted')}
          className={`${btn} text-white border hover:brightness-110`}
          style={{ background: DEEP_GOLD, borderColor: DEEP_GOLD, outlineColor: DEEP_GOLD }}
        >
          {t.accept}
        </button>
      </div>
    </section>
  )
}
