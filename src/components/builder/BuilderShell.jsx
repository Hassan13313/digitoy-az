// ════════════════════════════════════════════════════════════════
// Builder qabığı: başlıq + StepNav + addım kartı + alt düymələr (YALNIZ görünüş)
//
// İstifadə:
//   <BuilderShell lang={lang} steps={visibleSteps} current={stepIndex} direction={dir}
//                 onStepClick={goTo} onPrev={prev} onNext={next} nextDisabled={!valid}
//                 notice={draftRestored && <Notice .../>}>
//     <StepCard title="Tədbir Haqqında" subtitle="...">…sahələr…</StepCard>
//   </BuilderShell>
// ════════════════════════════════════════════════════════════════
import { useEffect, useRef } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import t from '../../data/translations';
import { Eyebrow, Ornament } from '../landing/v2/ui';
import { Spinner } from './feedback';

const tx = (lang) => t[lang] ?? t.az ?? {};
const EASE = [0.22, 1, 0.36, 1];

/**
 * @typedef {{ id: string, label: string }} BuilderStep
 */

/**
 * Builder-in bütün çərçivəsi.
 * @param {object} p
 * @param {BuilderStep[]} p.steps        Paketə görə GÖRÜNƏN addımlar (say dəyişkəndir)
 * @param {number} p.current             Cari addımın indeksi (0-dan)
 * @param {string[]} [p.completed]       Tamamlanmış addım id-ləri (verilməsə: current-dən əvvəlkilər)
 * @param {(index:number)=>void} [p.onStepClick]  Verilərsə, tamamlanmış addımlara klik etmək olur
 * @param {1|-1} [p.direction=1]         Keçid animasiyasının istiqaməti (irəli/geri)
 * @param {()=>void} p.onPrev
 * @param {()=>void} p.onNext            Son addımda «Dəvətnaməni Yarat» də bunu çağırır
 * @param {boolean} [p.nextDisabled]
 * @param {boolean} [p.nextLoading]      Spinner göstərir (məs. yükləmə gedir)
 * @param {string} [p.nextLabel]         Default: «Növbəti» / son addımda «Dəvətnaməni Yarat»
 * @param {boolean} [p.isLast]           Default: current === steps.length - 1
 * @param {React.ReactNode} [p.notice]   Kartın üstündə bildiriş (məs. qaralama bərpa edildi)
 * @param {boolean} [p.hideHeader]       Başlığı gizlət (xülasə ekranı üçün)
 * @param {string} [p.eyebrow] @param {string} [p.title] @param {string} [p.subtitle]
 * @param {'az'|'en'|'ru'} [p.lang]
 * @param {boolean} [p.allowJump]       Digitoy: istənilən addıma keçid (köhnə builder davranışı)
 */
export default function BuilderShell({
  lang = 'az',
  steps,
  current,
  completed,
  onStepClick,
  direction = 1,
  onPrev,
  onNext,
  nextDisabled = false,
  nextLoading = false,
  nextLabel,
  isLast,
  notice,
  hideHeader = false,
  eyebrow,
  title,
  subtitle,
  allowJump = false,
  children,
}) {
  const x = tx(lang);
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const first = useRef(true);
  const step = steps[current];
  const last = isLast ?? current === steps.length - 1;

  // Addım dəyişəndə: builder-in yuxarısına sürüşdür və fokusu addım başlığına ver
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = rootRef.current;
    if (root && root.getBoundingClientRect().top < 0) {
      const top = root.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    }
    const id = setTimeout(
      () => cardRef.current?.querySelector('[data-step-heading]')?.focus({ preventScroll: true }),
      reduce ? 0 : 380,
    );
    return () => clearTimeout(id);
  }, [step?.id, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className="relative mx-auto w-full max-w-[1040px]">
        {!hideHeader && (
          <header className="text-center">
            <Eyebrow>{eyebrow ?? x.builderEyebrow ?? 'Builder'}</Eyebrow>
            <h2 className="mt-4 font-serif text-[2.25rem] font-medium leading-[1.08] text-ink sm:text-5xl">
              {title ?? x.builderTitle ?? 'Dəvətnaməni Yarat'}
            </h2>
            <Ornament className="mt-5" />
            <p className="mt-5 text-[15px] text-brown-dark sm:text-base">
              {subtitle ?? x.builderSubtitle ?? 'Addım-addım məlumatlarınızı daxil edin'}
            </p>
          </header>
        )}

        <div className={hideHeader ? '' : 'mt-10 sm:mt-14'}>
          <StepNav lang={lang} steps={steps} current={current} completed={completed} onStepClick={onStepClick} allowJump={allowJump} />
        </div>

        <div className="mx-auto mt-5 max-w-[780px] sm:mt-10">
          {notice && <div className="mb-5">{notice}</div>}

          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-[28px] bg-white/90 shadow-luxe backdrop-blur-sm"
          >
            <span aria-hidden="true" className="absolute inset-x-12 top-0 h-px bg-gold-line" />
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={step?.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -20 }}
                transition={{ duration: 0.38, ease: EASE }}
                className="px-5 pb-7 pt-6 sm:px-10 sm:py-11"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Alt naviqasiya — mobildə ekranın altına yapışır (builder görünən müddətdə) */}
          <div data-avoid-scroll-progress className="sticky bottom-0 z-20 -mx-5 mt-5 border-t border-gold/15 bg-cream/90 px-5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 backdrop-blur-xl sm:bottom-5 sm:mx-0 sm:mt-8 sm:rounded-full sm:border sm:bg-cream/80 sm:p-2 sm:shadow-lift">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onPrev}
                disabled={current === 0}
                className="inline-flex h-12 min-w-[48px] items-center justify-center gap-2 rounded-full px-4 text-[12px] font-semibold uppercase tracking-label text-brown-dark ring-1 ring-inset ring-beige-dark transition-[background-color,color,box-shadow] duration-300 hover:bg-white hover:text-ink hover:ring-gold/60 disabled:pointer-events-none disabled:opacity-0 sm:px-6"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span className="hidden min-[400px]:inline">{x.builderPrev ?? 'Əvvəlki'}</span>
                <span className="sr-only min-[400px]:hidden">{x.builderPrev ?? 'Əvvəlki'}</span>
              </button>

              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled || nextLoading}
                aria-busy={nextLoading || undefined}
                className={`group relative inline-flex h-12 flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 text-[12px] font-semibold uppercase tracking-label shadow-lift ring-1 ring-inset transition-[transform,box-shadow,opacity] duration-300 ease-luxe hover:-translate-y-0.5 hover:shadow-luxe active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 sm:h-14 sm:flex-none sm:px-9 sm:text-[13px] ${
                  last ? 'bg-gold text-espresso ring-gold-dark/30' : 'bg-espresso-grad text-cream ring-gold/30'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-[left] duration-700 ease-luxe group-hover:left-[120%] motion-reduce:hidden"
                />
                {nextLoading && <Spinner size="sm" tone={last ? 'dark' : 'light'} lang={lang} />}
                <span className="relative">
                  {nextLabel ?? (last ? (x.builderSubmit ?? 'Dəvətnaməni Yarat') : (x.builderNext ?? 'Növbəti'))}
                </span>
                {!nextLoading &&
                  (last ? (
                    <Sparkles className="relative h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                  ) : (
                    <ArrowRight
                      className="relative h-4 w-4 text-gold-light transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

/**
 * Addım naviqasiyası. Desktop (lg+): nömrəli dairələr + birləşdirici xətt.
 * Mobil: «5 / 10» + seqmentli zolaq + cari və növbəti addımın adı.
 * @param {object} p
 * @param {BuilderStep[]} p.steps
 * @param {number} p.current
 * @param {string[]} [p.completed]
 * @param {(index:number)=>void} [p.onStepClick]
 * @param {'az'|'en'|'ru'} [p.lang]
 */
export function StepNav({ steps, current, completed, onStepClick, allowJump = false, lang = 'az' }) {
  const x = tx(lang);
  const isDone = (s, i) => (completed ? completed.includes(s.id) : i < current);
  const next = steps[current + 1];

  return (
    <nav aria-label={x.builderStepsLabel ?? 'Sifariş addımları'}>
      {/* ── Mobil / planşet ─────────────────────────────────── */}
      <div className="lg:hidden">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-sans text-[12px] font-semibold tracking-[0.14em] text-gold-deep">
            <span className="lining-nums tabular-nums">
              {current + 1} / {steps.length}
            </span>
          </p>
          <p className="truncate text-right font-serif text-[19px] leading-none text-ink" aria-current="step">
            {steps[current]?.label}
          </p>
        </div>
        {allowJump && onStepClick ? (
          /* Digitoy: zolaqlar kliklənir — görünən zolaq 4px, toxunma hədəfi 44px */
          <div className="mt-3 flex gap-1">
            {steps.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onStepClick(i)}
                aria-label={`${i + 1}. ${s.label}`}
                aria-current={i === current ? 'step' : undefined}
                className="-my-5 min-w-0 flex-1 touch-manipulation py-5"
              >
                <span
                  className={`block h-1 w-full rounded-full transition-colors duration-500 ease-luxe ${
                    i === current ? 'bg-gold-deep' : isDone(s, i) ? 'bg-gold/60' : 'bg-beige-dark/70'
                  }`}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex gap-1" aria-hidden="true">
            {steps.map((s, i) => (
              <span
                key={s.id}
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ease-luxe ${
                  i === current ? 'bg-gold-deep' : isDone(s, i) ? 'bg-gold/60' : 'bg-beige-dark/70'
                }`}
              />
            ))}
          </div>
        )}
        <p className="mt-2.5 h-4 text-right text-[12px] text-brown-dark/85">
          {next && (
            <>
              {x.builderNextStep ?? 'Növbəti:'} <span className="text-brown-dark">{next.label}</span>
            </>
          )}
        </p>
      </div>

      {/* ── Desktop ─────────────────────────────────────────── */}
      <ol className="hidden lg:flex">
        {steps.map((s, i) => {
          const done = isDone(s, i);
          const cur = i === current;
          const clickable = !!onStepClick && !cur && (allowJump || done);
          const circle = (
            <span
              className={`relative z-10 grid h-9 w-9 place-items-center rounded-full text-[13px] font-semibold lining-nums tabular-nums transition-[background-color,box-shadow,color] duration-500 ease-luxe ${
                cur
                  ? 'bg-white text-ink shadow-[0_0_0_4px_rgba(197,160,89,0.18)] ring-2 ring-gold-deep'
                  : done
                    ? 'bg-espresso text-gold-light'
                    : 'bg-white text-brown-dark ring-1 ring-inset ring-beige-dark'
              }`}
            >
              {done && !cur ? <Check className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" /> : i + 1}
            </span>
          );
          const label = (
            <span
              className={`mt-3 block px-1 text-[10.5px] font-semibold uppercase leading-[1.35] tracking-[0.1em] ${
                cur ? 'text-ink' : done ? 'text-brown-dark' : 'text-brown-dark/80'
              }`}
            >
              {s.label}
            </span>
          );
          return (
            <li key={s.id} className="relative min-w-0 flex-1 text-center">
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-[18px] h-px w-full transition-colors duration-500 ${
                    done ? 'bg-gold/70' : 'bg-beige-dark'
                  }`}
                />
              )}
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick(i)}
                  className="group flex w-full flex-col items-center rounded-[12px] pb-1 focus-visible:outline-offset-2"
                  aria-label={`${s.label} — ${x.builderEditStep ?? 'redaktə et'}`}
                >
                  <span className="transition-transform duration-300 group-hover:-translate-y-0.5">{circle}</span>
                  {label}
                </button>
              ) : (
                <div className="flex flex-col items-center pb-1" aria-current={cur ? 'step' : undefined}>
                  {circle}
                  {label}
                  <span className="sr-only">
                    {cur ? `(${x.builderCurrent ?? 'cari addım'})` : done ? `(${x.builderDone ?? 'tamamlanıb'})` : ''}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Addımın başlığı + alt mətn + məzmun. Başlıq addım dəyişəndə fokus alır (ekran oxuyucu üçün).
 * @param {object} p
 * @param {string} p.title
 * @param {string} [p.subtitle]
 * @param {React.ComponentType} [p.icon]
 * @param {React.ReactNode} [p.action]   Başlığın sağında (məs. «Şablonu dəyiş»)
 */
export function StepCard({ title, subtitle, icon: Icon, action, children }) {
  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3
            data-step-heading
            tabIndex={-1}
            className="flex items-center gap-3 font-serif text-[26px] font-medium leading-tight text-ink focus:outline-none sm:text-[34px]"
          >
            {Icon && (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-mist text-gold-deep sm:h-10 sm:w-10">
                <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </span>
            )}
            {title}
          </h3>
          {subtitle && <p className="mt-1.5 max-w-[56ch] text-[14px] leading-relaxed text-brown-dark/90 sm:mt-2 sm:text-[15px]">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div aria-hidden="true" className="my-5 h-px bg-gradient-to-r from-gold/30 via-gold/15 to-transparent sm:my-8" />
      <div className="space-y-6 sm:space-y-7">{children}</div>
    </section>
  );
}

/** Kiçik ikinci dərəcəli düymə (StepCard action, «Hamısını aç», «Şablonu dəyiş» və s.) */
export function GhostButton({ onClick, icon: Icon, children, disabled, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 text-[11.5px] font-semibold uppercase tracking-label text-gold-deep ring-1 ring-inset ring-gold/40 transition-colors hover:bg-gold-mist/60 hover:ring-gold disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />}
      {children}
    </button>
  );
}
