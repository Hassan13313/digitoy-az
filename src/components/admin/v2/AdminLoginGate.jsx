// ════════════════════════════════════════════════════════════════
// AdminLoginGate — admin giriş ekranı (YALNIZ görünüş)
//
// Token yoxlaması, cəhd sayğacı və kilid müddəti SİZİN məntiqinizdədir:
//   <AdminLoginGate state={state} attemptsLeft={left} onSubmit={(pw) => login(pw)} />
// ════════════════════════════════════════════════════════════════
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { Button, FOCUS, FOCUS_INSET, Field, Input, Notice, cx } from './adminUi';

/**
 * @param {object} p
 * @param {'idle'|'loading'|'error'|'locked'} [p.state='idle']
 *   loading — yoxlanılır · error — yanlış açar söz · locked — çox cəhd, giriş bağlıdır
 * @param {(password:string)=>void} p.onSubmit
 * @param {number} [p.attemptsLeft]  Xəta altında «N cəhd qalıb»
 * @param {string} [p.errorText='Açar söz yanlışdır. Yenidən yoxlayın.']
 * @param {string} [p.lockedText='Çox sayda cəhd. 15 dəqiqə sonra yenidən yoxlayın.']
 * @param {()=>void} [p.onBackToSite]  @param {string} [p.backToSiteHref]
 * @param {string} [p.title='Digitoy']  @param {string} [p.subtitle='Admin panel']
 * @param {string} [p.label='Açar söz']  @param {string} [p.submitLabel='Daxil ol']
 */
export default function AdminLoginGate({
  state = 'idle',
  onSubmit,
  attemptsLeft,
  errorText = 'Açar söz yanlışdır. Yenidən yoxlayın.',
  lockedText = 'Çox sayda cəhd. 15 dəqiqə sonra yenidən yoxlayın.',
  onBackToSite,
  backToSiteHref,
  title = 'Digitoy',
  subtitle = 'Admin panel',
  label = 'Açar söz',
  submitLabel = 'Daxil ol',
  loadingLabel = 'Yoxlanılır…',
  showLabel = 'Açar sözü göstər',
  hideLabel = 'Açar sözü gizlət',
  backToSiteLabel = 'Sayta qayıt',
}) {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const input = useRef(null);
  const locked = state === 'locked';
  const loading = state === 'loading';

  // Yanlış açar sözdən sonra sahəni seç ki, yenidən yazmaq rahat olsun
  useEffect(() => {
    if (state === 'error') input.current?.select();
  }, [state]);

  const BackTag = backToSiteHref ? 'a' : 'button';

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F6F3ED] px-4 py-10 font-sans text-espresso">
      <div className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(44,37,35,0.04),0_16px_40px_-24px_rgba(44,37,35,0.25)] ring-1 ring-inset ring-[#E5DED2] sm:p-8">
        <div className="text-center">
          <h1 className="font-serif text-[32px] font-medium leading-none text-espresso">{title}</h1>
          <p
            lang="az"
            className="mt-2 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-gold-deep"
          >
            {subtitle}
          </p>
        </div>

        <form
          className="mt-8 space-y-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!value || loading || locked) return;
            onSubmit?.(value);
          }}
        >
          {locked && (
            <Notice tone="danger" icon={Lock}>
              {lockedText}
            </Notice>
          )}

          <Field label={label} error={state === 'error' ? errorText : undefined}>
            <PasswordInput
              ref={input}
              value={value}
              onChange={setValue}
              show={show}
              onToggle={() => setShow((s) => !s)}
              disabled={locked}
              showLabel={showLabel}
              hideLabel={hideLabel}
            />
          </Field>
          {state === 'error' && attemptsLeft != null && (
            <p className="-mt-2 text-[13px] text-[#6B5E54]" aria-live="polite">
              {attemptsLeft} cəhd qalıb
            </p>
          )}

          <Button type="submit" variant="primary" block loading={loading} disabled={locked || !value}>
            {loading ? loadingLabel : submitLabel}
          </Button>
        </form>
      </div>

      {(onBackToSite || backToSiteHref) && (
        <BackTag
          href={backToSiteHref}
          type={backToSiteHref ? undefined : 'button'}
          onClick={onBackToSite}
          className={cx(
            'mt-6 inline-flex h-11 items-center gap-2 rounded-[8px] px-3 text-[14px] font-medium text-[#5C4A3A] hover:text-espresso',
            FOCUS,
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backToSiteLabel}
        </BackTag>
      )}
    </div>
  );
}

/** Açar söz sahəsi + göstər/gizlət düyməsi (Field-dən gələn id/aria-ları input-a ötürür). */
function PasswordInput({ value, onChange, show, onToggle, disabled, showLabel, hideLabel, ref, ...aria }) {
  return (
    <div className="relative">
      <Input
        ref={ref}
        {...aria}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete="current-password"
        autoFocus
        spellCheck={false}
        className="pr-12"
      />
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={show ? hideLabel : showLabel}
        aria-pressed={show}
        className={cx(
          'absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-[8px] text-[#6B5E54] hover:text-espresso disabled:opacity-50',
          FOCUS_INSET,
        )}
      >
        {show ? (
          <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" />
        ) : (
          <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
