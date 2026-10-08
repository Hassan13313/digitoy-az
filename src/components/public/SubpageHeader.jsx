// ════════════════════════════════════════════════════════════════
// Alt səhifələrin yapışqan başlığı və sadə footer-i (YALNIZ görünüş)
// /templates və hüquqi səhifələr bunu işlədir.
// ════════════════════════════════════════════════════════════════
import { ArrowLeft } from 'lucide-react';
import { FOCUS, Wordmark } from './shared';

/**
 * Yapışqan yuxarı panel: «← Ana səhifə», ortada Digitoy.az, sağda dil seçimi slotu.
 * @param {object} p
 * @param {(e:MouseEvent)=>void} p.onBack       «Ana səhifə» basılanda
 * @param {string} [p.backLabel='Ana səhifə']
 * @param {string} [p.backHref='/']             Link kimi göstərilir (yeni tabda açmaq mümkün olsun);
 *                                               onBack verilərsə klikdə e.preventDefault() edib onu çağırın
 * @param {React.ReactNode} [p.languageSwitcher] Sizin dil seçimi komponentiniz (≤ 130px en tövsiyə olunur)
 * @param {React.ReactNode} [p.progress]        Başlığın alt kənarında göstəriləcək zolaq (məs. <ReadingProgress/>)
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export default function SubpageHeader({
  onBack,
  backLabel = 'Ana səhifə',
  backHref = '/',
  languageSwitcher,
  progress,
  lang = 'az',
}) {
  return (
    <header
      lang={lang}
      className="sticky top-0 z-40 border-b border-gold/20 bg-cream/85 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="relative mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-8">
        <a
          href={backHref}
          onClick={onBack}
          className={`group -ml-1.5 inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-full px-2 text-[13px] font-medium text-brown-dark transition-colors hover:text-ink sm:px-3 ${FOCUS}`}
        >
          <ArrowLeft
            className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-x-0.5"
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <span className="hidden min-[440px]:inline">{backLabel}</span>
          <span className="sr-only min-[440px]:hidden">{backLabel}</span>
        </a>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[19px] sm:text-[23px]"
        >
          <Wordmark />
        </span>

        <div className="flex min-w-0 items-center justify-end">{languageSwitcher}</div>
      </div>
      {progress && <div className="absolute inset-x-0 -bottom-px">{progress}</div>}
    </header>
  );
}

/**
 * Alt səhifələrin sadə footer-i: hüquqi linklər + müəllif hüququ.
 * @param {object} p
 * @param {{href:string, label:string}[]} [p.links]
 * @param {(e:MouseEvent, href:string)=>void} [p.onNavigate]
 * @param {string} [p.copyright]   Default: «© {il} Digitoy.az. Bütün hüquqlar qorunur.»
 * @param {string} [p.navLabel='Hüquqi sənədlər']
 * @param {{label:string, onClick:()=>void}} [p.action]  Digitoy: «Kuki ayarları» kimi düymə (linklərin sonunda)
 * @param {'az'|'en'|'ru'} [p.lang='az']
 */
export function SubpageFooter({ links = [], onNavigate, copyright, navLabel = 'Hüquqi sənədlər', action, lang = 'az' }) {
  const year = new Date().getFullYear();
  return (
    <footer lang={lang} className="border-t border-gold/20 bg-cream">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-5 px-5 py-9 sm:flex-row sm:justify-between sm:px-8">
        {(links.length > 0 || action) && (
          <nav aria-label={navLabel}>
            <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 sm:justify-start">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => onNavigate?.(e, l.href)}
                    className={`inline-flex min-h-[44px] items-center rounded-[8px] px-2.5 text-[13px] text-brown-dark underline-offset-4 transition-colors hover:text-ink hover:underline ${FOCUS}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              {action && (
                <li>
                  <button
                    type="button"
                    onClick={action.onClick}
                    className={`inline-flex min-h-[44px] items-center rounded-[8px] px-2.5 text-[13px] text-brown-dark underline-offset-4 transition-colors hover:text-ink hover:underline ${FOCUS}`}
                  >
                    {action.label}
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}
        <p className="text-center text-[12.5px] tracking-[0.04em] text-brown-dark/90">
          {copyright ?? `© ${year} Digitoy.az. Bütün hüquqlar qorunur.`}
        </p>
      </div>
    </footer>
  );
}
