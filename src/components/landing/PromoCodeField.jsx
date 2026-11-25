import { useEffect, useId, useRef, useState } from 'react'
import { TicketPercent, LoaderCircle } from 'lucide-react'
import { Field, TextInput } from '../builder/fields'
import { checkPromo } from '../../utils/api'
import { promoCopy, promoDiscountLabel, getStoredPromo, clearStoredPromo } from '../../utils/promo'

/* ─────────────────────────────────────────────────────────────────────────────
   «Promokodunuz var?» — sifarişin son addımı (Preview) və VİDEO sifarişi (2026-11-25).

   • Bağlı halda sakit bir link; açanda xana + «Tətbiq et».
   • Tətbiq olunanda kupon kartı: kod, endirim, köhnə qiymət üstündən xətt, yeni qiymət.
   • `?kod=` linki ilə gələn kod (utils/promo › getStoredPromo) avtomatik yoxlanılır.
   • Paket dəyişəndə tətbiq olunmuş kod yenidən yoxlanılır (qiymət paketdən asılıdır).
   • Qiymət yalnız göstərmək üçündür — sifarişdə server yenidən hesablayır.

   value / onChange: tətbiq olunmuş nəticə { ok, code, kind, amount, price_base, price_final } və ya null.
   ───────────────────────────────────────────────────────────────────────── */
export default function PromoCodeField({ lang = 'az', pkg, sessionId = '', value, onChange }) {
  const c = promoCopy(lang)
  const inputId = useId()
  const [open, setOpen] = useState(() => !!value || !!getStoredPromo())
  const [text, setText] = useState(() => value?.code || getStoredPromo())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  /* yalnız istifadəçi açanda / «Sil»-dən sonra fokus (linklə gələndə klaviatura açılmasın) */
  const [focusInput, setFocusInput] = useState(false)
  const inputRef = useRef(null)
  const seq = useRef(0)

  const apply = async (raw = text) => {
    const code = String(raw || '').trim()
    if (!code) { setError(c.empty); inputRef.current?.focus(); return }
    const my = ++seq.current
    setBusy(true)
    setError('')
    let res
    try { res = await checkPromo(code, pkg, sessionId) } catch { res = { ok: false, reason: 'NETWORK' } }
    if (my !== seq.current) return            /* köhnə cavab — yenisi artıq yoldadır */
    setBusy(false)
    if (res?.ok) { onChange?.(res); setText(res.code) }
    else { onChange?.(null); setError(c.reasons[res?.reason] || c.reasons.NOT_FOUND) }
  }

  /* `?kod=` ilə gələn kodu bir dəfə avtomatik yoxla; paket dəyişəndə tətbiq olunmuşu yenilə */
  const applied = value?.code || ''
  useEffect(() => {
    const code = applied || (open && !error ? getStoredPromo() : '')
    if (!code) return undefined
    const timer = setTimeout(() => apply(code), 0)   /* render bitəndən sonra (StrictMode-da bir dəfə) */
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg])

  const remove = () => {
    seq.current++
    onChange?.(null)
    clearStoredPromo()
    setText('')
    setError('')
    setBusy(false)
    setFocusInput(true)
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => { setOpen(true); setFocusInput(true) }}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-1 text-[14px] font-medium text-gold-deep underline decoration-gold/40 underline-offset-4 transition-colors hover:text-espresso hover:decoration-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        <TicketPercent className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
        {c.toggle}
      </button>
    )
  }

  return (
    <div className="space-y-3">
      {value?.ok ? (
        <AppliedCoupon promo={value} c={c} onRemove={remove} />
      ) : (
        <Field id={inputId} label={c.label} error={error} lang={lang}>
          <form
            className="flex items-stretch gap-2.5"
            onSubmit={(e) => { e.preventDefault(); apply() }}
            noValidate
          >
            <div className="min-w-0 flex-1">
              <TextInput
                ref={inputRef}
                id={inputId}
                value={text}
                onChange={(v) => { setText(v); if (error) setError('') }}
                error={error}
                icon={TicketPercent}
                placeholder={c.placeholder}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={40}
                autoFocus={focusInput}
                lang="en"   /* latın kodu: AZ qaydası ilə «i» → «İ» olmasın */
                className="uppercase tracking-[0.08em] placeholder:normal-case placeholder:tracking-normal"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-espresso-grad px-5 text-[13px] font-semibold text-cream shadow-soft ring-1 ring-inset ring-gold/30 transition-[transform,box-shadow] duration-300 ease-luxe hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-70 sm:min-h-[56px] sm:px-6"
            >
              {busy && <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
              {busy ? c.checking : c.apply}
            </button>
          </form>
        </Field>
      )}
      {/* xəta Field-də role="alert" ilə oxunur — burada yalnız gedişat və uğur */}
      <p className="sr-only" aria-live="polite">
        {busy ? c.checking : value?.ok ? `${c.applied}: ${value.code}, ${c.total} ${value.price_final}₼` : ''}
      </p>
    </div>
  )
}

/* Kupon kartı — perforasiya xətti və iki yarımdairə ilə kəsilmiş bilet.
   Kəsiklər CSS mask-dır (əsl boşluq): kartın altındakı fon nə olursa olsun görünür.
   Sağ hissənin eni sabitdir ki, kəsik perforasiya xəttinin düz üstünə düşsün. */
const STUB_W = 116
const CUT = `calc(100% - ${STUB_W}px)`
const COUPON_MASK = [
  `radial-gradient(circle at ${CUT} 0, transparent 9px, #000 9.5px) top / 100% 51% no-repeat`,
  `radial-gradient(circle at ${CUT} 100%, transparent 9px, #000 9.5px) bottom / 100% 51% no-repeat`,
].join(', ')

function AppliedCoupon({ promo, c, onRemove }) {
  return (
    <div
      className="relative flex overflow-hidden rounded-2xl bg-gold-mist/70 ring-1 ring-inset ring-gold/35"
      style={{ WebkitMask: COUPON_MASK, mask: COUPON_MASK }}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-4 pl-5 pr-4">
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-olive">
          <TicketPercent className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          {c.applied}
        </span>
        <span lang="en" className="truncate text-[17px] font-semibold tracking-[0.08em] text-espresso">{promo.code}</span>
        <button
          type="button"
          onClick={onRemove}
          className="-ml-1 mt-0.5 inline-flex min-h-[44px] w-fit items-center rounded-full px-1 text-[13px] font-medium text-brown-dark underline decoration-brown-dark/30 underline-offset-4 hover:text-rust hover:decoration-rust/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep"
        >
          {c.remove}
        </button>
      </div>

      {/* perforasiya xətti (kəsiklərin arasında) */}
      <div aria-hidden="true" className="my-3 w-px shrink-0 border-l border-dashed border-gold/60" />

      <div
        className="flex shrink-0 flex-col items-end justify-center gap-0.5 py-4 pl-3 pr-5 text-right"
        style={{ width: STUB_W - 1 }}
      >
        <span className="rounded-full bg-espresso px-2.5 py-0.5 text-[12px] font-semibold tabular-nums text-gold-light">
          {promoDiscountLabel(promo)}
        </span>
        <span className="mt-1 text-[14px] tabular-nums text-brown-muted line-through decoration-rust/60">{promo.price_base}₼</span>
        <span className="flex items-start gap-0.5 leading-none">
          <span className="sr-only">{c.total}: </span>
          <span className="font-serif text-[40px] font-normal leading-[0.9] tracking-[-0.02em] text-ink lining-nums">{promo.price_final}</span>
          <span className="mt-0.5 font-sans text-[16px] font-medium text-gold-deep">₼</span>
        </span>
      </div>
    </div>
  )
}
