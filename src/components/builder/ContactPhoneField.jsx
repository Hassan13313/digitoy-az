import { Phone } from 'lucide-react';
import t from '../../data/translations';
import { normalizeCustomerPhone } from '../../utils/customerPhone';
import { Field, TextInput } from './fields';

/* ─────────────────────────────────────────────────────────────────────────────
   Builder — «Əlaqə nömrəniz (tövsiyə olunur)» (Phase 50)

   MƏCBURİ DEYİL: boş buraxıb davam etmək olur, format səhvi də keçidi
   bloklamır — yalnız yumşaq qeyd göstərilir. Nömrə yalnız sifarişin
   özündə (draft_invitations.customer_phone) saxlanılır, dəvətnamədə yox.
   ───────────────────────────────────────────────────────────────────────── */

const tx = (lang) => t[lang] ?? t.az ?? {};

export default function ContactPhoneField({ value, onChange, lang = 'az', className = '' }) {
  const x = tx(lang);
  const id = 'builder-contact-phone';
  /* Yarımçıq nömrəyə dərhal «səhv» deməyək — yalnız 7+ simvoldan sonra */
  const looksWrong = value.trim().length >= 7 && normalizeCustomerPhone(value) === null;
  const hint = looksWrong ? x.contactPhoneCheck : x.contactPhoneHint;

  return (
    <Field id={id} label={x.contactPhoneLabel} recommended hint={hint} lang={lang} className={className}>
      <TextInput
        id={id}
        value={value}
        onChange={onChange}
        hint={hint}
        icon={Phone}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={24}
        placeholder="050 123 45 67"
      />
    </Field>
  );
}
