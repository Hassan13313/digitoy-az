import { useState, useEffect, useCallback } from 'react'
import { X, Languages, Wand2, Check } from 'lucide-react'
import { getInvitationTranslations, saveInvitationTranslations } from '../../utils/api'
import { TRANSLATABLE_FIELDS, translatePhrase } from '../../data/contentI18n'

/* ─────────────────────────────────────────────────────────────────────────────
   MƏZMUN TƏRCÜMƏSİ REDAKTORU (Phase 36) — admin panel modalı.

   NƏ ÜÇÜN: `contentI18n.js` lüğəti toy sektorunun standart ifadələrini
   avtomatik tərcümə edir, amma cütlüyün fərdi cümlələri (məkan qeydi,
   xüsusi geyim izahı) lüğətdə ola bilməz. Bu redaktor həmin boşluğu doldurur:
   admin EN/RU qarşılığını əl ilə yazır, dəvətnamə dərhal onu göstərir.

   ⚠ SLUG-A TOXUNMUR: yazma `admin_translations.php`-ə gedir, o da yalnız
   `form_data.i18n` açarını yeniləyir — `save_invitation.php`-dəki slug
   allokasiya məntiqi ÇAĞIRILMIR, canlı link dəyişmir.

   ⚠ BOŞ SAHƏ = TƏRCÜMƏ YOXDUR: sahə boş buraxılsa dəvətnamə əvvəlcə lüğətə,
   sonra orijinal AZ mətnə düşür. Yəni boş qoymaq heç nəyi pozmur.
   ───────────────────────────────────────────────────────────────────────── */

const C = {
  ink:   'oklch(20% 0.02 60)',
  text:  'oklch(28% 0.02 60)',
  sub:   'oklch(52% 0.03 60)',
  faint: 'oklch(62% 0.03 60)',
  line:  'oklch(88% 0.02 60)',
  hair:  'oklch(93% 0.01 75)',
  gold:  'oklch(55% 0.09 80)',
  danger:'oklch(48% 0.15 25)',
}

const LANGS = [
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Русский' },
]

const inputStyle = {
  width: '100%', padding: '8px 10px', border: `1px solid ${C.line}`, borderRadius: 4,
  fontSize: 12.5, color: C.text, background: 'white', outline: 'none',
  fontFamily: 'inherit', lineHeight: 1.5,
}

/** i18n obyektində bir sahəni oxu (proqram sətirləri indeksə görə saxlanılır) */
function readValue(i18n, lang, key, index) {
  const bucket = i18n?.[lang]
  if (!bucket) return ''
  if (index == null) return typeof bucket[key] === 'string' ? bucket[key] : ''
  const steps = bucket.programSteps
  if (!steps) return ''
  const v = steps[index] ?? steps[String(index)]
  return typeof v === 'string' ? v : ''
}

export default function AdminTranslations({ slug, onClose, onSaved }) {
  const [lang,    setLang]    = useState('en')
  const [source,  setSource]  = useState(null)   /* form_data */
  const [draft,   setDraft]   = useState({ en: {}, ru: {} })
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const [saved,   setSaved]   = useState(false)

  useEffect(() => {
    let alive = true
    /* `loading` onsuz da `true` ilə başlayır və modal hər slug üçün yenidən
       mount olunur (parent-də `key={slug}`), ona görə burada setLoading(true)
       lazım deyil — kaskad render yaratmadan eyni nəticə. */
    getInvitationTranslations(slug)
      .then((d) => {
        if (!alive) return
        setSource(d.form_data || {})
        const i = d.i18n && !Array.isArray(d.i18n) ? d.i18n : {}
        setDraft({ en: i.en || {}, ru: i.ru || {} })
      })
      .catch((e) => { if (alive) setError(e?.message || 'Yüklənmədi.') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [slug])

  /* Esc ilə bağlanma — modal davranışının minimum tələbi */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const setField = useCallback((key, value, index) => {
    setSaved(false)
    setDraft((prev) => {
      const bucket = { ...(prev[lang] || {}) }
      if (index == null) {
        if (value) bucket[key] = value
        else delete bucket[key]
      } else {
        const steps = { ...(bucket.programSteps || {}) }
        if (value) steps[index] = value
        else delete steps[index]
        if (Object.keys(steps).length) bucket.programSteps = steps
        else delete bucket.programSteps
      }
      return { ...prev, [lang]: bucket }
    })
  }, [lang])

  /* ── Lüğətlə avtomatik doldurma ──
     Yalnız BOŞ sahələri doldurur — adminin öz yazdığını heç vaxt üstələmir.
     Lüğətdə qarşılığı olmayan mətn toxunulmadan qalır. */
  const autoFill = () => {
    if (!source) return
    setSaved(false)
    setDraft((prev) => {
      const bucket = { ...(prev[lang] || {}) }
      for (const { key } of TRANSLATABLE_FIELDS) {
        if (key === 'brideName' || key === 'groomName') continue  /* adlar maşınla tərcümə olunmur */
        if (bucket[key]) continue
        const auto = translatePhrase(source[key], lang)
        if (auto) bucket[key] = auto
      }
      const steps = { ...(bucket.programSteps || {}) }
      ;(source.programSteps || []).forEach((row, i) => {
        if (steps[i]) return
        const auto = translatePhrase(row?.activity, lang)
        if (auto) steps[i] = auto
      })
      if (Object.keys(steps).length) bucket.programSteps = steps
      return { ...prev, [lang]: bucket }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await saveInvitationTranslations(slug, draft)
      setSaved(true)
      onSaved?.(res.i18n)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setError(e?.message || 'Saxlanılmadı.')
    } finally {
      setSaving(false)
    }
  }

  const textFields = TRANSLATABLE_FIELDS
    .map((f) => ({ ...f, original: source?.[f.key] }))
    .filter((f) => typeof f.original === 'string' && f.original.trim())

  const steps = (source?.programSteps || [])
    .map((row, i) => ({ i, time: row?.time, activity: row?.activity }))
    .filter((r) => typeof r.activity === 'string' && r.activity.trim())

  const isEmpty = !loading && textFields.length === 0 && steps.length === 0

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Məzmun tərcüməsi"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'oklch(20% 0.02 60 / 0.42)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div style={{
        width: '100%', maxWidth: 720, maxHeight: '88vh', background: 'white',
        border: `1px solid ${C.line}`, borderRadius: 8, display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 60px oklch(20% 0.02 60 / 0.22)',
      }}>
        {/* Başlıq */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${C.hair}` }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",serif',
              fontSize: 19, fontWeight: 300, color: C.ink, margin: 0, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Languages size={16} strokeWidth={1.4} style={{ color: C.gold }} />
              Məzmun tərcüməsi
            </h2>
            <p style={{ fontSize: 11, color: C.faint, margin: '3px 0 0', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>{slug}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Bağla" style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.sub, display: 'flex', padding: 4 }}>
            <X size={16} strokeWidth={1.6} />
          </button>
        </div>

        {/* Dil tabları */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 20px', borderBottom: `1px solid ${C.hair}`, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {LANGS.map((l) => (
              <button
                key={l.id} type="button" onClick={() => setLang(l.id)}
                aria-pressed={lang === l.id}
                style={{
                  padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 11,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  border: `1px solid ${lang === l.id ? C.gold : C.line}`,
                  background: lang === l.id ? 'oklch(96% 0.03 80)' : 'white',
                  color: lang === l.id ? C.gold : C.sub,
                  fontWeight: lang === l.id ? 600 : 400,
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            type="button" onClick={autoFill} disabled={loading || isEmpty}
            title="Lüğətdən yalnız BOŞ sahələri doldurur"
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              border: `1px solid ${C.line}`, borderRadius: 4, background: 'white',
              cursor: loading || isEmpty ? 'not-allowed' : 'pointer', fontSize: 11, color: C.sub,
              letterSpacing: '0.05em', textTransform: 'uppercase', opacity: loading || isEmpty ? 0.5 : 1,
            }}
          >
            <Wand2 size={12} strokeWidth={1.5} />
            Lüğətlə doldur
          </button>
        </div>

        {/* Gövdə */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: C.faint, fontSize: 13 }}>Yüklənir...</div>
          ) : isEmpty ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: C.faint, fontSize: 13 }}>
              Bu dəvətnamədə tərcümə ediləsi fərdi mətn yoxdur.
            </div>
          ) : (
            <>
              <p style={{ fontSize: 11.5, color: C.faint, lineHeight: 1.6, margin: '0 0 16px' }}>
                Boş buraxılan sahə üçün dəvətnamə əvvəlcə daxili lüğətə, o da tapmasa
                orijinal Azərbaycan mətninə düşür — boş qoymaq heç nəyi pozmur.
              </p>

              {textFields.map((f) => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label htmlFor={`tr-${f.key}`} style={{ display: 'block', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.sub, marginBottom: 4 }}>
                    {f.az}
                  </label>
                  <p style={{ fontSize: 12, color: C.faint, margin: '0 0 5px', fontStyle: 'italic', wordBreak: 'break-word' }}>
                    {f.original}
                  </p>
                  <input
                    id={`tr-${f.key}`} type="text"
                    value={readValue(draft, lang, f.key)}
                    onChange={(e) => setField(f.key, e.target.value)}
                    placeholder={lang === 'en' ? 'English translation…' : 'Перевод на русский…'}
                    style={inputStyle}
                  />
                </div>
              ))}

              {steps.length > 0 && (
                <div style={{ marginTop: 22 }}>
                  <h3 style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.sub, margin: '0 0 10px', paddingBottom: 6, borderBottom: `1px solid ${C.hair}` }}>
                    Tədbir proqramı
                  </h3>
                  {steps.map((r) => (
                    <div key={r.i} style={{ marginBottom: 12 }}>
                      <p style={{ fontSize: 12, color: C.faint, margin: '0 0 5px', fontStyle: 'italic' }}>
                        <span style={{ fontFamily: 'monospace', marginRight: 8, color: C.gold }}>{r.time || '—'}</span>
                        {r.activity}
                      </p>
                      <input
                        type="text"
                        aria-label={`Proqram sətri ${r.i + 1}`}
                        value={readValue(draft, lang, null, r.i)}
                        onChange={(e) => setField(null, e.target.value, r.i)}
                        placeholder={lang === 'en' ? 'English translation…' : 'Перевод на русский…'}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Alt panel */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 20px', borderTop: `1px solid ${C.hair}` }}>
          <span style={{ fontSize: 11.5, color: error ? C.danger : C.faint, minHeight: 16 }}>
            {error || (saved ? 'Saxlanıldı.' : '')}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 14px', border: `1px solid ${C.line}`, borderRadius: 4, background: 'white', cursor: 'pointer', fontSize: 11, color: C.sub, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Bağla
            </button>
            <button
              type="button" onClick={handleSave} disabled={saving || loading || isEmpty}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 4,
                border: 'none', cursor: saving || loading || isEmpty ? 'not-allowed' : 'pointer',
                background: 'oklch(45% 0.07 75)', color: 'white', fontSize: 11,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                opacity: saving || loading || isEmpty ? 0.55 : 1,
              }}
            >
              {saved ? <Check size={12} strokeWidth={2} /> : null}
              {saving ? 'Saxlanılır...' : 'Saxla'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
