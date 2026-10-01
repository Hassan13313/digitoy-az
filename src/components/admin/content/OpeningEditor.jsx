import { useMemo } from 'react'
import { RotateCcw } from 'lucide-react'
import t from '../../../data/translations'
import { resolveWeddingContent } from '../../../data/contentI18n'
import {
  getOpeningSpec, openingDefaults, autoMonogram, OPENING_SLOT_LABELS,
} from '../../../templates/_shared/openingSpec'
import { MONO_TEXT_MAX } from '../../../data/adminOverrides'
import { Card, FieldRow, Segmented, StickerPicker, ImageUpload, Thumb } from './ui'
import { C } from './style'

/* ─────────────────────────────────────────────────────────────────────────────
   «AÇILIŞ» REDAKTORU (Phase 45) — dəvətnamə açılmazdan əvvəlki ekran.

   Admin burada dəyişə bilir:
     • adların baş hərfləri (monoqram) — avtomatik / boş / mətn / stiker / şəkil
       (baş hərf olmayan şablonlarda mərkəzi nişan: almaz, daş, yarpaq, çiçək)
     • ekrandakı HƏR yazı — üst yazı, adlar, tarix sətri, düymə, «toxunun»…
       hər biri AZ/EN/RU üzrə, və göz düyməsi ilə tamamilə gizlədilə bilir.

   Hər sahənin placeholder-ı dəvətnamədə HAZIRDA görünən mətndir — mənbə
   şablonun özü ilə eynidir (templates/_shared/openingSpec.js).
   ⚠ Boş sahə = şablonun öz mətni. Heç nə itmir, «Hamısını sıfırla» ilə
   açılış tam əvvəlki halına qayıdır.
   ───────────────────────────────────────────────────────────────────────── */

const MODES = [
  ['auto', 'Avtomatik'],
  ['none', 'Boş'],
  ['text', 'Mətn'],
  ['sticker', 'Stiker'],
  ['image', 'Şəkil'],
]

const EMBLEM_NAMES = {
  'crystal-glass':  'brilyant',
  'luxury-jewelry': 'zümrüd daş',
  'nature-touch':   'yarpaq nişanı',
  'floral-garden':  'açan çiçək',
}

export default function OpeningEditor({
  templateId, wedding, lang, opening, setOpening, slug, narrow, onFocusPreview,
}) {
  const spec = getOpeningSpec(templateId)

  /* Dəvətnamədə indi görünən mətnlər (override-sız) — placeholder üçün */
  const ctx = useMemo(() => {
    const wd = resolveWeddingContent(wedding || {}, lang) || {}
    const tr = t[lang] || t.az
    const isCouple = ['toy', 'nishan'].includes(wd.eventType)
    const isCorp = ['corporate', 'other'].includes(wd.eventType)
    const eventLabel = ({
      toy: tr.event_toy, nishan: tr.event_nishan, birthday: tr.event_birthday,
      corporate: tr.event_corporate, other: wd.eventName || tr.event_other,
    })[wd.eventType] || tr.event_toy
    return { weddingData: wd, lang, isCouple, isCorp, eventLabel }
  }, [wedding, lang])
  const defaults = useMemo(() => openingDefaults(templateId, ctx), [templateId, ctx])

  const mono = opening.mono || { mode: 'auto' }
  const hide = opening.hide || []
  const texts = opening.text || {}

  /* ── Yazma köməkçiləri — boş dəyər açarı silir (JSON təmiz qalır) ── */
  const patch = (fn) => setOpening((prev) => {
    const next = fn({ ...prev })
    for (const k of Object.keys(next)) {
      const v = next[k]
      if (v == null || (typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length) || (Array.isArray(v) && !v.length)) delete next[k]
    }
    return next
  })

  const setMono = (m) => patch((o) => {
    if (!m || m.mode === 'auto') delete o.mono
    else o.mono = m
    return o
  })

  const setText = (slot, value) => patch((o) => {
    const T = { ...(o.text || {}) }
    const e = { ...(T[slot] || {}) }
    if (value) e[lang] = value
    else delete e[lang]
    if (Object.keys(e).length) T[slot] = e
    else delete T[slot]
    o.text = T
    return o
  })

  const toggleHide = (slot) => patch((o) => {
    const H = new Set(o.hide || [])
    if (H.has(slot)) H.delete(slot)
    else H.add(slot)
    o.hide = [...H]
    return o
  })

  /* «Avtomatik» rejimdə dəvətnamədə nə göründüyü */
  const autoText = spec.mono === 'initials'
    ? (autoMonogram(templateId, ctx) ?? 'şablonun ornamenti (girih ulduzu)')
    : `şablonun öz nişanı — ${EMBLEM_NAMES[templateId] || 'ornament'}`

  const hasCustom = !!(opening.mono || (opening.hide && opening.hide.length) || (opening.text && Object.keys(opening.text).length))

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <p style={{ fontSize: narrow ? 13 : 11.5, color: C.sub, lineHeight: 1.6, margin: 0 }}>
        Dəvətnamə açılmazdan əvvəl görünən ekran. Boş sahə şablonun öz mətnini saxlayır;
        göz işarəsi ilə yazını tamamilə gizlədə bilərsiniz. Dəyişikliklər
        {narrow ? ' «Önbaxış» bölməsində' : ' sağdakı önbaxışda'} dərhal görünür.
      </p>

      {spec.mono && (
        <Card
          title={spec.mono === 'initials' ? 'Adların baş hərfləri (monoqram)' : 'Mərkəzi nişan'}
          hint={spec.mono === 'initials'
            ? 'Çərçivənin içində nə görünsün? Korporativ və digər tədbirlərdə avtomatik rejim hərf yox, ornament göstərir.'
            : 'Bu şablonda baş hərf yoxdur — mərkəzdəki nişanı mətn, stiker və ya şəkillə əvəz edə, ya da gizlədə bilərsiniz.'}
        >
          <Segmented
            narrow={narrow}
            options={MODES}
            value={mono.mode || 'auto'}
            onChange={(mode) => {
              if (mode === 'auto' || mode === 'none') setMono({ mode })
              else if (mode === 'image') setMono({ mode, image: mono.mode === 'image' ? mono.image : '' })
              else setMono({ mode, value: mono.mode === mode ? mono.value : '' })
              onFocusPreview?.()
            }}
          />

          <div style={{ marginTop: 10 }}>
            {(mono.mode || 'auto') === 'auto' && (
              <div style={{ fontSize: narrow ? 13 : 11.5, color: C.sub }}>
                Hazırda: <b style={{ color: C.ink }}>{autoText}</b>
              </div>
            )}
            {mono.mode === 'none' && (
              <div style={{ fontSize: narrow ? 13 : 11.5, color: C.sub }}>
                {spec.mono === 'initials' ? 'Çərçivə boş qalacaq.' : 'Nişan göstərilməyəcək.'}
              </div>
            )}
            {mono.mode === 'text' && (
              <FieldRow
                narrow={narrow} label={`Mətn (ən çox ${MONO_TEXT_MAX} simvol)`}
                value={mono.value} placeholder="məs. T & A" maxLength={MONO_TEXT_MAX}
                onChange={(v) => setMono({ mode: 'text', value: v })}
              />
            )}
            {mono.mode === 'sticker' && (
              <StickerPicker narrow={narrow} value={mono.value} onPick={(v) => setMono({ mode: 'sticker', value: v })} />
            )}
            {mono.mode === 'image' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {mono.image && <Thumb src={mono.image} narrow={narrow} onRemove={() => setMono({ mode: 'image', image: '' })} />}
                <ImageUpload
                  slug={slug} narrow={narrow}
                  label={mono.image ? 'Başqa şəkil' : 'Şəkil və ya loqo yüklə'}
                  onUploaded={(url) => { setMono({ mode: 'image', image: url }); onFocusPreview?.() }}
                />
                <div style={{ flexBasis: '100%', fontSize: 11, color: C.faint, lineHeight: 1.5 }}>
                  Şəffaf PNG loqo şəffaf qalır. Şəkil çərçivənin formasına görə kəsilir.
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {!spec.mono && (
        <div style={{ fontSize: 11.5, color: C.faint, lineHeight: 1.55 }}>
          Bu şablonun açılışında monoqram (baş hərflər) yoxdur — aşağıda bütün yazıları dəyişə bilərsiniz.
        </div>
      )}

      <Card
        title={`Açılışdakı yazılar (${lang.toUpperCase()})`}
        hint="Placeholder-da dəvətnamədə indi görünən mətn var."
      >
        <div style={{ display: 'grid', gap: narrow ? 12 : 9 }}>
          {spec.slots.map((slot) => (
            <FieldRow
              key={slot}
              narrow={narrow}
              label={OPENING_SLOT_LABELS[slot] || slot}
              hint={spec.hints?.[slot]}
              value={texts[slot]?.[lang] || ''}
              placeholder={defaults[slot] || '—'}
              onChange={(v) => setText(slot, v)}
              onFocus={onFocusPreview}
              hidden={hide.includes(slot)}
              onToggleHide={() => { toggleHide(slot); onFocusPreview?.() }}
            />
          ))}
        </div>
      </Card>

      {hasCustom && (
        <button
          type="button"
          onClick={() => setOpening({})}
          style={{
            justifySelf: 'start', display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: narrow ? '10px 14px' : '6px 10px', minHeight: narrow ? 40 : undefined,
            border: `1px solid ${C.line}`, borderRadius: 6, background: 'white', color: C.sub,
            fontSize: narrow ? 13 : 11.5, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <RotateCcw size={13} strokeWidth={1.6} />
          Açılışı şablonun öz halına qaytar
        </button>
      )}
    </div>
  )
}
