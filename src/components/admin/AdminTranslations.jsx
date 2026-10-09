import { useState, useEffect, useCallback, useMemo } from 'react'
import { getInvitationTranslations, saveInvitationTranslations } from '../../utils/api'
import { TRANSLATABLE_FIELDS, translatePhrase } from '../../data/contentI18n'
import TranslationDialog from './v2/TranslationDialog'

/* ─────────────────────────────────────────────────────────────────────────────
   MƏZMUN TƏRCÜMƏSİ REDAKTORU (Phase 36/40; UI redesign 2026-10: v2/TranslationDialog)

   ⚠ SLUG-A TOXUNMUR: yazma `admin_translations.php`-ə gedir, o da yalnız
   `form_data.i18n` açarını yeniləyir — canlı link dəyişmir.
   ⚠ BOŞ SAHƏ = TƏRCÜMƏ YOXDUR: dəvətnamə əvvəlcə lüğətə, sonra AZ mətnə düşür.
   ── Phase 40 ──
   1. AÇILIŞDA AVTOMATİK DOLDURMA: saxlanılmış tərcüməsi OLMAYAN sahələr
      lüğətdən doldurulur və «avtomatik» işarələnir.
   2. SAXLANILMIŞ MƏTN TOXUNULMAZ: DB-də dəyəri olan sahə HEÇ VAXT yenidən
      tərcümə edilmir.
   3. `i18nMeta` (auto | manual) birlikdə saxlanılır: builder növbəti dəfə
      yalnız 'auto' sahələri yeniləyə bilir (bax `api/i18n_merge.php`).
   ───────────────────────────────────────────────────────────────────────── */

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

/** `i18nMeta` eyni forma daşıyır — `readValue` onu da oxuya bilir */
const readMeta = readValue

/** Bir qovaya sahə yaz / sil — `draft` və `meta` üçün eyni məntiq */
function writeBucket(bucket, key, index, value) {
  const next = { ...(bucket || {}) }
  if (index == null) {
    if (value) next[key] = value
    else delete next[key]
    return next
  }
  const steps = { ...(next.programSteps || {}) }
  if (value) steps[index] = value
  else delete steps[index]
  if (Object.keys(steps).length) next.programSteps = steps
  else delete next.programSteps
  return next
}

/* ── Açılışda avtomatik doldurma ──
   YALNIZ saxlanılmış dəyəri OLMAYAN sahələr doldurulur. Lüğətdə qarşılığı
   olmayan sərbəst cümlə boş qalır. */
function seedAuto(savedI18n, savedMeta, source) {
  const draft = { en: { ...(savedI18n.en || {}) }, ru: { ...(savedI18n.ru || {}) } }
  const meta  = { en: {}, ru: {} }

  for (const lang of ['en', 'ru']) {
    /* Saxlanılmış sahələrin metası: yoxdursa 'manual' sayılır */
    const savedBucket = savedI18n[lang] || {}
    for (const key of Object.keys(savedBucket)) {
      if (key === 'programSteps') continue
      meta[lang][key] = readMeta(savedMeta, lang, key) === 'auto' ? 'auto' : 'manual'
    }
    const savedSteps = savedBucket.programSteps || {}
    for (const idx of Object.keys(savedSteps)) {
      const m = readMeta(savedMeta, lang, null, idx) === 'auto' ? 'auto' : 'manual'
      meta[lang].programSteps = { ...(meta[lang].programSteps || {}), [idx]: m }
    }

    if (!source) continue

    for (const { key } of TRANSLATABLE_FIELDS) {
      if (key === 'brideName' || key === 'groomName') continue  /* adlar maşınla tərcümə olunmur */
      if (readValue(draft, lang, key)) continue
      const auto = translatePhrase(source[key], lang)
      if (!auto) continue
      draft[lang] = writeBucket(draft[lang], key, null, auto)
      meta[lang]  = writeBucket(meta[lang],  key, null, 'auto')
    }
    ;(source.programSteps || []).forEach((row, i) => {
      if (readValue(draft, lang, null, i)) return
      const auto = translatePhrase(row?.activity, lang)
      if (!auto) return
      draft[lang] = writeBucket(draft[lang], null, i, auto)
      meta[lang]  = writeBucket(meta[lang],  null, i, 'auto')
    })
  }

  return { draft, meta }
}

/* Görünüşün açarı: adi sahə → key, proqram sətri → «step:<indeks>» */
const parseKey = (k) => (k.startsWith('step:') ? { key: null, index: Number(k.slice(5)) } : { key: k, index: null })

export default function AdminTranslations({ slug, onClose, onSaved }) {
  const [source,  setSource]  = useState(null)   /* form_data */
  const [draft,   setDraft]   = useState({ en: {}, ru: {} })
  /* Hansı sahə lüğətdən gəlib ('auto'), hansını admin yazıb ('manual') */
  const [meta,    setMeta]    = useState({ en: {}, ru: {} })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saveState, setSaveState] = useState('idle')
  const [saveError, setSaveError] = useState('')
  const [edits,   setEdits]   = useState(0)

  useEffect(() => {
    let alive = true
    /* modal hər slug üçün yenidən mount olunur (parent-də `key={slug}`) */
    getInvitationTranslations(slug)
      .then((d) => {
        if (!alive) return
        const fd = d.form_data || {}
        const i  = d.i18n     && !Array.isArray(d.i18n)     ? d.i18n     : {}
        const m  = d.i18nMeta && !Array.isArray(d.i18nMeta) ? d.i18nMeta : {}
        const seeded = seedAuto({ en: i.en || {}, ru: i.ru || {} }, m, fd)
        setSource(fd)
        setDraft(seeded.draft)
        setMeta(seeded.meta)
      })
      .catch((e) => { if (alive) setLoadError(e?.message || 'Yüklənmədi.') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [slug])

  /* Admin bir sahəyə toxundusa o sahə ARTIQ 'manual'dır: builder onu bir daha
     avtomatik tərcümə ilə əvəz edə bilməz. Sahə boşaldılsa meta da silinir. */
  const setField = useCallback((lang, viewKey, value) => {
    const { key, index } = parseKey(viewKey)
    setSaveState('idle')
    setEdits(n => n + 1)
    setDraft((prev) => ({ ...prev, [lang]: writeBucket(prev[lang], key, index, value) }))
    setMeta((prev)  => ({ ...prev, [lang]: writeBucket(prev[lang], key, index, value ? 'manual' : '') }))
  }, [])

  /* ── Lüğətlə avtomatik doldurma ── yalnız BOŞ sahələri doldurur */
  const autoFill = () => {
    if (!source) return
    setSaveState('idle')
    const seeded = seedAuto(draft, meta, source)
    setDraft(seeded.draft)
    setMeta(seeded.meta)
  }

  const handleSave = async () => {
    setSaveState('saving')
    setSaveError('')
    try {
      const res = await saveInvitationTranslations(slug, draft, meta)
      setSaveState('saved')
      setEdits(0)
      onSaved?.(res.i18n)
    } catch (e) {
      setSaveError(e?.message || 'Saxlanılmadı.')
      setSaveState('error')
    }
  }

  /* ── Sahələr ── */
  const groups = useMemo(() => {
    if (!source) return []
    const textFields = TRANSLATABLE_FIELDS
      .filter((f) => typeof source[f.key] === 'string' && source[f.key].trim())
      .map((f) => ({ key: f.key, label: f.az, source: source[f.key], multiline: f.key === 'venueNote' || f.key === 'dressCodeDescription' }))
    const steps = (source.programSteps || [])
      .map((row, i) => ({ i, time: row?.time, activity: row?.activity }))
      .filter((r) => typeof r.activity === 'string' && r.activity.trim())
      .map((r) => ({ key: `step:${r.i}`, source: r.activity, time: r.time || '—' }))
    return [
      ...(textFields.length ? [{ id: 'text', fields: textFields }] : []),
      ...(steps.length ? [{ id: 'program', title: 'Tədbir proqramı', fields: steps }] : []),
    ]
  }, [source])

  const allKeys = groups.flatMap(g => g.fields.map(f => f.key))
  const values = {}
  const auto = {}
  for (const lang of ['en', 'ru']) {
    values[lang] = {}
    auto[lang] = []
    for (const k of allKeys) {
      const { key, index } = parseKey(k)
      values[lang][k] = readValue(draft, lang, key, index)
      if (readMeta(meta, lang, key, index) === 'auto') auto[lang].push(k)
    }
  }

  return (
    <TranslationDialog
      open
      onClose={onClose}
      slug={slug}
      groups={groups}
      values={values}
      auto={auto}
      onChange={setField}
      onAutofill={source ? autoFill : undefined}
      onSave={handleSave}
      saveState={saveState}
      saveError={saveError}
      dirty={edits}
      canSave={!loading && groups.length > 0 && saveState !== 'saving'}
      loading={loading}
      loadError={loadError}
    />
  )
}
