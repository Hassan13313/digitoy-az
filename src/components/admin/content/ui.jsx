import { useRef, useState } from 'react'
import { Eye, EyeOff, ImagePlus, Loader2, X } from 'lucide-react'
import { prepareAdminImage, resizeErrorText } from '../../../utils/imageResize'
import { uploadAdminMedia, storyPhotoSrc } from '../../../utils/api'
import { C, inputStyle, labelStyle, STICKERS } from './style'

/* ─────────────────────────────────────────────────────────────────────────────
   «Məzmun meneceri»nin kiçik UI hissələri (Phase 45)

   Açılış və Hekayə redaktorları eyni sahə növlərini işlədir: dilə bağlı
   mətn, gizlətmə düyməsi, stiker seçici, şəkil yükləmə. Hamısı burada bir
   dəfə yazılır ki, iki redaktor eyni görünsün və eyni davransın.

   ⚠ TELEFON (S24 Ultra ≈ 384–412px): `narrow` rejimində yazı 15px, toxunma
   hədəfləri ən azı 40px olur — 12px-lik masaüstü sahələri barmaqla
   işlədilmirdi.
   ───────────────────────────────────────────────────────────────────────── */

/** Bölmə kartı — başlıq + (könüllü) izah */
export function Card({ title, hint, children, right = null }) {
  return (
    <div style={{ border: `1px solid ${C.hair}`, borderRadius: 8, padding: 12, background: 'white' }}>
      {(title || right) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: hint ? 4 : 10 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>{title}</div>
          {right}
        </div>
      )}
      {hint && <p style={{ fontSize: 11, color: C.faint, lineHeight: 1.55, margin: '0 0 10px' }}>{hint}</p>}
      {children}
    </div>
  )
}

/** Açıq/bağlı açarı (bölmələr siyahısındakı ilə eyni görünüş) */
export function Toggle({ on, onChange, disabled, label }) {
  return (
    <button
      type="button" role="switch" aria-checked={on} aria-label={label} disabled={disabled}
      onClick={() => onChange(!on)}
      style={{
        width: 34, height: 19, borderRadius: 10, position: 'relative', flex: '0 0 auto',
        border: `1px solid ${on ? C.gold : C.line}`,
        background: on ? C.gold : 'white',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, padding: 0,
        transition: 'background .15s, border-color .15s',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: on ? 17 : 2, width: 13, height: 13, borderRadius: '50%',
        background: on ? 'white' : C.line, transition: 'left .15s',
      }} />
    </button>
  )
}

/**
 * Bir sahə: etiket + mətn (input/textarea) + könüllü «gizlət» düyməsi.
 * `value` aktiv dilin mətnidir; boş = sistemin/şablonun öz mətni.
 */
export function FieldRow({
  label, hint, value, placeholder, onChange, onFocus, narrow,
  multiline = false, maxLength, hidden = false, onToggleHide = null,
}) {
  const base = inputStyle(narrow)
  const common = {
    value: value || '', placeholder: placeholder || '—', maxLength,
    onChange: (e) => onChange(e.target.value), onFocus,
    disabled: hidden,
    style: { ...base, ...(multiline ? { resize: 'vertical', minHeight: narrow ? 96 : 72 } : null), opacity: hidden ? 0.45 : 1 },
  }
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ ...labelStyle, marginBottom: 4 }}>
          {label}
          {hint && <span style={{ textTransform: 'none', letterSpacing: 0, marginLeft: 6, color: C.faint }}>· {hint}</span>}
        </div>
        {onToggleHide && (
          <button
            type="button" onClick={onToggleHide}
            title={hidden ? 'Göstər' : 'Gizlət'} aria-label={hidden ? `${label} — göstər` : `${label} — gizlət`}
            aria-pressed={hidden}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'none',
              color: hidden ? C.danger : C.faint, cursor: 'pointer', fontSize: 10.5, fontFamily: 'inherit',
              padding: narrow ? '6px 4px' : '2px 2px', minHeight: narrow ? 32 : undefined, marginBottom: 2,
            }}
          >
            {hidden ? <EyeOff size={13} strokeWidth={1.7} /> : <Eye size={13} strokeWidth={1.7} />}
            {hidden ? 'gizli' : ''}
          </button>
        )}
      </div>
      {multiline ? <textarea rows={3} {...common} /> : <input type="text" {...common} />}
    </div>
  )
}

/* ── Stiker seçici (siyahı: style.js › STICKERS) ── */
export function StickerPicker({ value, onPick, narrow, allowCustom = true }) {
  const cell = narrow ? 44 : 34
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${cell}px, 1fr))`, gap: 4 }}>
        {STICKERS.map((s) => (
          <button
            key={s} type="button" onClick={() => onPick(s)} aria-pressed={value === s}
            style={{
              height: cell, borderRadius: 6, fontSize: narrow ? 22 : 18, lineHeight: 1, cursor: 'pointer',
              border: `1px solid ${value === s ? C.gold : C.hair}`, background: value === s ? C.goldBg : 'white',
            }}
          >{s}</button>
        ))}
      </div>
      {allowCustom && (
        <input
          type="text" value={STICKERS.includes(value) ? '' : (value || '')} maxLength={16}
          placeholder="və ya istədiyiniz emojini yazın"
          onChange={(e) => onPick(e.target.value)}
          style={{ ...inputStyle(narrow), marginTop: 6 }}
        />
      )}
    </div>
  )
}

/**
 * Şəkil yükləmə düyməsi — seçilən faylı hazırlayıb admin qovluğuna yükləyir
 * və URL-i qaytarır. PNG loqonun şəffaflığı qorunur.
 */
export function ImageUpload({ slug, onUploaded, narrow, label = 'Şəkil yüklə', compact = false }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const onFile = async (file) => {
    if (!file) return
    setBusy(true); setErr('')
    try {
      const { blob, name } = await prepareAdminImage(file)
      const { url } = await uploadAdminMedia(slug, blob, name)
      onUploaded(url)
    } catch (e) {
      setErr(e?.code && !['NOT_IMAGE', 'TOO_LARGE', 'DECODE_FAILED', 'STILL_TOO_LARGE', 'NO_FILE'].includes(e.code)
        ? (e.message || 'Şəkil yüklənmədi.') : resizeErrorText(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <input
        ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" hidden
        onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }}
      />
      <button
        type="button" disabled={busy} onClick={() => ref.current?.click()}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: compact ? '100%' : undefined, height: compact ? '100%' : undefined,
          flexDirection: compact ? 'column' : 'row',
          padding: compact ? 4 : (narrow ? '10px 14px' : '7px 12px'), minHeight: narrow ? 42 : 32,
          border: `1px dashed ${C.gold}`, borderRadius: 6, background: C.goldBg, color: C.ink,
          fontSize: compact ? 9.5 : (narrow ? 13 : 11.5), cursor: busy ? 'wait' : 'pointer', fontFamily: 'inherit',
        }}
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} strokeWidth={1.6} />}
        {busy ? 'Yüklənir…' : label}
      </button>
      {err && <div role="alert" style={{ fontSize: 11, color: C.danger, marginTop: 5, lineHeight: 1.45 }}>{err}</div>}
    </div>
  )
}

/** Kiçik şəkil + silmə düyməsi */
export function Thumb({ src, onRemove, size = 64, narrow }) {
  const url = storyPhotoSrc(src)
  return (
    <div style={{ position: 'relative', width: size, height: size, flex: '0 0 auto' }}>
      {url
        ? <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, border: `1px solid ${C.line}`, background: C.hair, display: 'block' }} />
        : <div style={{ width: '100%', height: '100%', borderRadius: 6, background: C.hair }} />}
      {onRemove && (
        <button
          type="button" onClick={onRemove} aria-label="Şəkli sil"
          style={{
            position: 'absolute', top: -7, right: -7, width: narrow ? 28 : 22, height: narrow ? 28 : 22,
            borderRadius: '50%', border: `1px solid ${C.line}`, background: 'white', color: C.danger,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
            boxShadow: '0 1px 4px rgba(0,0,0,.12)',
          }}
        >
          <X size={narrow ? 14 : 12} strokeWidth={2.2} />
        </button>
      )}
    </div>
  )
}

/** Seqment düymələri (monoqram rejimi və s.) */
export function Segmented({ options, value, onChange, narrow }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {options.map(([id, name]) => {
        const on = value === id
        return (
          <button
            key={id} type="button" onClick={() => onChange(id)} aria-pressed={on}
            style={{
              flex: narrow ? '1 1 30%' : '0 0 auto', padding: narrow ? '10px 8px' : '6px 11px', minHeight: narrow ? 40 : undefined,
              borderRadius: 6, border: `1px solid ${on ? C.gold : C.line}`,
              background: on ? C.gold : 'white', color: on ? 'white' : C.sub,
              fontSize: narrow ? 13 : 11.5, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >{name}</button>
        )
      })}
    </div>
  )
}
