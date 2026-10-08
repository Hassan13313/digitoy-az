// ════════════════════════════════════════════════════════════════
// Kuki banneri — YALNIZ görünüş. Razılıq məntiqi sizdə qalır.
// İstifadə:
//   <CookieBanner lang={lang} visible={!consentGiven} onAccept={accept} onReject={reject} moreHref="/privacy#cookies" />
// Qeyd: "Qəbul et" və "İmtina et" eyni ölçüdədir və yan-yanadır (GDPR: imtina da qəbul qədər asan olmalıdır).
// ════════════════════════════════════════════════════════════════
import { useId } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import t from '../../../data/translations';

export default function CookieBanner({
  lang = 'az',
  visible = true,
  onAccept = () => {},
  onReject = () => {},
  moreHref = '/privacy',
  /* İnteqrasiya: copy = { title, text, accept, reject, more } (hüquqi mətnlər data/legal/ui.js-dədir),
     onMore(e) — «Ətraflı» linki SPA keçidi ilə açılsın */
  copy = {},
  onMore,
}) {
  const x = {
    ...(t[lang] ?? t.az ?? {}),
    ...(copy.title ? { cookieTitle: copy.title } : null),
    ...(copy.text ? { cookieText: copy.text } : null),
    ...(copy.accept ? { cookieAccept: copy.accept } : null),
    ...(copy.reject ? { cookieReject: copy.reject } : null),
    ...(copy.more ? { cookieMore: copy.more } : null),
  };
  const reduce = useReducedMotion();
  const titleId = useId();
  const descId = useId();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="dt-site fixed inset-x-0 bottom-0 z-[1000] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] sm:inset-x-auto sm:left-6 sm:max-w-[420px] sm:px-0 sm:pb-6"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          /* Çıxış dərhal başlasın — girişdəki 0.8s gecikmə «Qəbul et»dən sonra tətbiq olunmasın */
          exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 24, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
          transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grain relative overflow-hidden rounded-[24px] bg-cream/95 p-5 shadow-luxe backdrop-blur-xl sm:p-6">
            <span aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gold-line" />
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-mist text-gold-deep"
              >
                <Cookie className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <h2 id={titleId} className="font-serif text-[22px] font-medium leading-tight text-ink">
                  {x.cookieTitle ?? 'Kukilər'}
                </h2>
                <p id={descId} className="mt-1.5 text-[13.5px] leading-relaxed text-brown-dark">
                  {x.cookieText ??
                    'Saytı yaxşılaşdırmaq üçün ziyarət statistikası (Google Analytics, PostHog) toplamaq istəyirik. Razılıq versəniz analitika kukiləri qurulur. Saytın işləməsi üçün zəruri olanlar onsuz da işləyir.'}{' '}
                  <a
                    href={moreHref}
                    onClick={onMore}
                    className="font-medium text-gold-deep underline decoration-gold/50 underline-offset-[3px] hover:decoration-gold-deep"
                  >
                    {x.cookieMore ?? 'Ətraflı'}
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={onReject}
                className="h-11 rounded-full border border-espresso/25 bg-white/70 text-[13px] font-semibold text-ink transition-colors duration-300 hover:border-espresso/50 hover:bg-white"
              >
                {x.cookieReject ?? 'İmtina et'}
              </button>
              <button
                type="button"
                onClick={onAccept}
                className="h-11 rounded-full bg-espresso text-[13px] font-semibold text-cream shadow-soft ring-1 ring-inset ring-gold/30 transition-colors duration-300 hover:bg-espresso-soft"
              >
                {x.cookieAccept ?? 'Qəbul et'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
