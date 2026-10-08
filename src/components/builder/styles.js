// Builder sahələrinin ortaq stil sinifləri — yeni komponentlər (fields.jsx) və
// köhnə BuilderForm köməkçiləri (Label/Input/Textarea) EYNİ görünüşü işlədir.
// ⚠ Qlobal `.luxury-input` sinfinə toxunulmur: o, dəvətnamədəki RSVP və
// Təbrik kitabı formalarında da işlənir.

export const inputBase =
  'block w-full rounded-2xl bg-white text-[16px] text-ink placeholder:text-brown-muted/80 shadow-[inset_0_1px_2px_rgba(44,37,35,0.04)] ring-1 ring-inset transition-[box-shadow,background-color] duration-300 ease-luxe focus:outline-none disabled:cursor-not-allowed disabled:bg-beige/60 disabled:text-brown-muted';

export const ringState = (error) =>
  error
    ? 'ring-rust/70 focus:ring-2 focus:ring-rust focus:shadow-[0_0_0_4px_rgba(154,59,46,0.12)]'
    : 'ring-beige-dark hover:ring-gold/60 focus:ring-2 focus:ring-gold-deep focus:shadow-[0_0_0_4px_rgba(197,160,89,0.18)]';

export const describedBy = (id, error, hint) =>
  [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

export const labelClass = 'mb-2.5 block text-[11px] font-semibold uppercase tracking-label text-brown-dark';

/** Kiçik köməkçi mətn (sahə altı izah) */
export const hintClass = 'text-[13px] leading-snug text-brown-dark/85';
