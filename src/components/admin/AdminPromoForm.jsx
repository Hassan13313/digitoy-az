import { useState } from 'react'
import { Button, Field, Input, Modal, Notice, Select, Textarea } from './v2/adminUi'
import { PACKAGE_DEFS } from '../../data/packages'
import { savePromoCode } from '../../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   Promokod yaratma / redaktə pəncərəsi (admin «Promokodlar», 2026-11-25).
   Qaydalar serverdədir (api/promo_lib.php › promoValidateInput) — burada yalnız
   rahat forma və canlı nümunə qiymət. Kod yaradılandan sonra dəyişmir (sifarişlərdə izi var).
   ───────────────────────────────────────────────────────────────────────── */

const PKG_IDS = Object.keys(PACKAGE_DEFS)
const KIND_OPTIONS = [
  { value: 'percent', label: 'Faizlə (%)' },
  { value: 'fixed', label: 'Manatla (₼)' },
]

const toForm = (item) => item ? {
  id: item.id,
  code: item.code,
  kind: item.kind,
  amount: String(item.amount),
  packages: item.packages.length ? item.packages : PKG_IDS,
  starts_on: item.starts_on || '',
  ends_on: item.ends_on || '',
  max_uses: item.max_uses == null ? '' : String(item.max_uses),
  owner: item.owner || '',
  note: item.note || '',
} : { code: '', kind: 'percent', amount: '', packages: PKG_IDS, starts_on: '', ends_on: '', max_uses: '', owner: '', note: '' }

/** Server ilə eyni hesab (promo_lib › promoPrice) — yalnız nümunə üçün */
const discounted = (base, kind, amount) =>
  kind === 'percent' ? Math.round(base * (100 - amount) / 100) : Math.max(0, base - amount)

export default function AdminPromoForm({ item, open, onClose, onSaved }) {
  const [form, setForm] = useState(() => toForm(item))
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState('')
  const set = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })) }
  const togglePkg = (id) => set('packages')(form.packages.includes(id) ? form.packages.filter((p) => p !== id) : [...form.packages, id])

  const amount = Number(form.amount) || 0
  const sample = PKG_IDS.filter((id) => form.packages.includes(id)).map((id) => PACKAGE_DEFS[id])
    .map((d) => `${d.name} ${d.price}₼ → ${discounted(Number(d.price), form.kind, amount)}₼`)

  const submit = async (e) => {
    e?.preventDefault()
    setBusy(true)
    setFail('')
    try {
      const res = await savePromoCode(form)
      onSaved(res.item, !item)
    } catch (err) {
      setErrors(err.fields || {})
      if (!err.fields || !Object.keys(err.fields).length) setFail(err.message || 'Saxlanılmadı')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={item ? `${item.code} — redaktə` : 'Yeni promokod'}
      description="Müştəri kodu sifarişin son addımında yazır və ya ?kod= linki ilə gəlir. Yekun qiyməti server hesablayır."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Ləğv et</Button>
          <Button variant="primary" loading={busy} onClick={submit}>{item ? 'Yadda saxla' : 'Kodu yarat'}</Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        {fail && <Notice tone="danger" title={fail} />}

        <Field label="Kod" required error={errors.code}
          hint={item ? 'Kod yaradılandan sonra dəyişmir.' : 'Latın hərfləri və rəqəmlər, 3–32 simvol. Məs. QARACUMA, AYSEL10.'}>
          <Input
            value={form.code}
            onChange={(e) => set('code')(e.target.value)}
            disabled={!!item}
            maxLength={40}
            lang="en"
            autoComplete="off"
            spellCheck={false}
            className="uppercase tracking-[0.06em]"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Endirim növü" error={errors.kind}>
            <Select options={KIND_OPTIONS} value={form.kind} onValueChange={set('kind')} />
          </Field>
          <Field label={form.kind === 'fixed' ? 'Endirim (₼)' : 'Endirim (%)'} required error={errors.amount}
            hint={form.kind === 'fixed' ? '1–200 ₼' : '1–90 %'}>
            <Input type="number" inputMode="numeric" min={1} max={form.kind === 'fixed' ? 200 : 90}
              value={form.amount} onChange={(e) => set('amount')(e.target.value)} />
          </Field>
        </div>

        <fieldset>
          <legend className="mb-1.5 text-[13px] font-semibold text-[#3F342E]">Paketlər</legend>
          <div className="flex flex-wrap gap-2">
            {PKG_IDS.map((id) => {
              const on = form.packages.includes(id)
              return (
                <label key={id} className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-[14px] ${on ? 'border-[#2C2523] bg-[#F5F0E8] text-[#2B2723]' : 'border-[#DDD5C8] text-[#6B5E54]'}`}>
                  <input type="checkbox" checked={on} onChange={() => togglePkg(id)} className="h-4 w-4 accent-[#2C2523]" />
                  {PACKAGE_DEFS[id].name} <span className="text-[#6B5E54]">{PACKAGE_DEFS[id].price}₼</span>
                </label>
              )
            })}
          </div>
          <p className="mt-1.5 text-[12.5px] text-[#6B5E54]">
            {errors.packages || (form.packages.length === 0 || form.packages.length === PKG_IDS.length ? 'Bütün paketlərə aiddir.' : 'Yalnız seçilmiş paketlərə aiddir.')}
          </p>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Başlanğıc tarixi" error={errors.starts_on} hint="Boş — dərhal başlayır.">
            <Input type="date" value={form.starts_on} onChange={(e) => set('starts_on')(e.target.value)} />
          </Field>
          <Field label="Bitmə tarixi" error={errors.ends_on} hint="Bu gün daxil (Bakı vaxtı). Boş — müddətsiz.">
            <Input type="date" value={form.ends_on} onChange={(e) => set('ends_on')(e.target.value)} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Limit (sifariş sayı)" error={errors.max_uses} hint="Boş — limitsiz.">
            <Input type="number" inputMode="numeric" min={1} value={form.max_uses} onChange={(e) => set('max_uses')(e.target.value)} />
          </Field>
          <Field label="Kimin kodu" error={errors.owner} hint="İnfluenser və ya partnyor (hesabat üçün). Boş ola bilər.">
            <Input value={form.owner} maxLength={80} onChange={(e) => set('owner')(e.target.value)} />
          </Field>
        </div>

        <Field label="Qeyd" error={errors.note}>
          <Textarea rows={2} maxLength={255} value={form.note} onChange={(e) => set('note')(e.target.value)} />
        </Field>

        {amount > 0 && sample.length > 0 && (
          <div className="rounded-lg bg-[#F5F0E8] px-4 py-3 text-[13.5px] leading-relaxed text-[#3F342E]">
            <p className="mb-1 font-semibold">Müştəri belə görəcək</p>
            {sample.map((s) => <p key={s} className="tabular-nums">{s}</p>)}
          </div>
        )}
        <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  )
}
