import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { resolveWeddingContent } from '../../../data/contentI18n'
import { STORY_TEXT_KEYS, STORY_MAX_CHAPTERS, STORY_MAX_PHOTOS } from '../../../data/adminOverrides'
import { getStoryCopy, getStoryTheme } from '../../../templates/_shared/loveStoryTheme'
import { Card, FieldRow, Toggle, StickerPicker, ImageUpload, Thumb } from './ui'
import { C, inputStyle, labelStyle } from './style'

/* ─────────────────────────────────────────────────────────────────────────────
   «BİZİM HEKAYƏMİZ» (LOVE STORY) REDAKTORU (Phase 45)

   Admin burada dəyişə bilir:
     • bölmənin öz yazıları — üst yazı, başlıq, alt başlıq, son sətirlər
     • müştərinin hər fəsli — başlıq, mətn, şəkil altı yazı (AZ/EN/RU),
       tarix, stiker, şəkillər (sil / əlavə et), fəsli gizlət
     • YENİ fəsillər əlavə etmək (mətn + şəkil + stiker)

   ⚠ MÜŞTƏRİNİN DATASI DƏYİŞMİR: hər şey `form_data.admin.story`-yə yazılır
   və render anında üstünə qoyulur (bax adminOverrides › applyStoryOverrides).
   Boş sahə = müştərinin mətni. «Hamısını sıfırla» ilə hekayə əvvəlki halına
   qayıdır.
   ⚠ Fəsil açarı `c<indeks>`-dir (tərcümə sistemi də indeksə görə işləyir).
   ───────────────────────────────────────────────────────────────────────── */

const TEXT_LABELS = {
  kicker: 'Üst yazı',
  title:  'Başlıq',
  sub:    'Alt başlıq',
  next:   'Son — kiçik yazı',
  end:    'Son — cümlə',
  endSub: 'Son — alt mətn',
  kpre:   'Fəsil nişanının prefiksi',
  photo:  '«Foto» sözü (şəkil altı)',
}

function photosOf(row) {
  if (!row || typeof row !== 'object') return []
  if (Array.isArray(row.photos)) return row.photos.filter((s) => typeof s === 'string' && s)
  return row.photo ? [row.photo] : []
}

/** Boş dəyərləri at — JSON təmiz qalsın, «boş = dəyişiklik yoxdur» */
function prune(obj) {
  const out = { ...obj }
  for (const k of Object.keys(out)) {
    const v = out[k]
    if (v === '' || v == null) delete out[k]
    else if (typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length) delete out[k]
  }
  return out
}

function withLang(bucket, lang, value) {
  const b = { ...(bucket || {}) }
  if (value) b[lang] = value
  else delete b[lang]
  return b
}

let seq = 0
const newId = () => `adm_${Date.now().toString(36)}${(seq++).toString(36)}`

/* ── Bir fəslin redaktə sahələri (müştəri fəsli və yeni fəsil üçün ortaq) ── */
function ChapterFields({
  narrow, lang, slug, values, placeholders, photos, onText, onDate, onIcon, onPhotosChange,
  dateHidden, iconState, onToggleDate, canResetPhotos, onResetPhotos, onFocus,
}) {
  const [pickIcon, setPickIcon] = useState(false)
  return (
    <div style={{ display: 'grid', gap: narrow ? 12 : 9, marginTop: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1fr 1fr', gap: narrow ? 12 : 9 }}>
        <div>
          <div style={labelStyle}>Tarix</div>
          <input
            type="text" value={values.date || ''} disabled={dateHidden}
            placeholder={placeholders.date || 'məs. 2019-06 və ya «ilk görüş»'}
            onChange={(e) => onDate(e.target.value)} onFocus={onFocus}
            style={{ ...inputStyle(narrow), opacity: dateHidden ? 0.45 : 1 }}
          />
          {onToggleDate && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: C.sub, marginTop: 6, minHeight: narrow ? 32 : undefined }}>
              <input type="checkbox" checked={dateHidden} onChange={onToggleDate} style={{ width: 16, height: 16 }} />
              Tarixi göstərmə
            </label>
          )}
        </div>
        <div>
          <div style={labelStyle}>Stiker</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <button
              type="button" onClick={() => setPickIcon((v) => !v)} aria-expanded={pickIcon}
              style={{
                width: narrow ? 46 : 38, height: narrow ? 46 : 38, borderRadius: 6, fontSize: 20,
                border: `1px solid ${C.line}`, background: 'white', cursor: 'pointer',
              }}
            >{iconState.value || <span style={{ fontSize: 14, color: C.faint }}>+</span>}</button>
            {iconState.canRemove && (
              <button type="button" onClick={() => onIcon(false)} style={smallBtn(narrow)}>Stikeri gizlət</button>
            )}
            {iconState.canReset && (
              <button type="button" onClick={() => onIcon(null)} style={smallBtn(narrow)}>Müştərinin stikeri</button>
            )}
          </div>
          {pickIcon && (
            <div style={{ marginTop: 8 }}>
              <StickerPicker narrow={narrow} value={iconState.value} onPick={(v) => { onIcon(v); if (v) setPickIcon(false) }} />
            </div>
          )}
        </div>
      </div>

      <FieldRow narrow={narrow} label={`Başlıq (${lang.toUpperCase()})`} value={values.title} placeholder={placeholders.title}
        onChange={(v) => onText('title', v)} onFocus={onFocus} />
      <FieldRow narrow={narrow} multiline label={`Mətn (${lang.toUpperCase()})`} value={values.text} placeholder={placeholders.text}
        onChange={(v) => onText('text', v)} onFocus={onFocus} />

      <div>
        <div style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Şəkillər ({photos.length}/{STORY_MAX_PHOTOS})</span>
          {canResetPhotos && (
            <button type="button" onClick={onResetPhotos} style={{ ...smallBtn(narrow), textTransform: 'none', letterSpacing: 0 }}>
              <RotateCcw size={11} strokeWidth={1.8} /> Müştərinin şəkilləri
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: 6 }}>
          {photos.map((src, j) => (
            <Thumb
              key={`${typeof src === 'string' ? src.slice(-24) : src}-${j}`} src={src} narrow={narrow} size={narrow ? 72 : 60}
              onRemove={() => onPhotosChange('remove', j)}
            />
          ))}
          {photos.length < STORY_MAX_PHOTOS && (
            <div style={{ width: narrow ? 72 : 60, height: narrow ? 72 : 60 }}>
              <ImageUpload slug={slug} narrow={narrow} compact label="Əlavə et" onUploaded={(url) => onPhotosChange('add', url)} />
            </div>
          )}
        </div>
      </div>

      {photos.length > 0 && (
        <FieldRow narrow={narrow} label={`Şəkil altı yazı (${lang.toUpperCase()})`} value={values.caption} placeholder={placeholders.caption}
          maxLength={80} onChange={(v) => onText('caption', v)} onFocus={onFocus} />
      )}
    </div>
  )
}

function smallBtn(narrow) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 4, border: `1px solid ${C.line}`, borderRadius: 5,
    background: 'white', color: C.sub, fontSize: narrow ? 12 : 10.5, cursor: 'pointer', fontFamily: 'inherit',
    padding: narrow ? '8px 10px' : '4px 8px', minHeight: narrow ? 36 : undefined,
  }
}

export default function StoryEditor({
  templateId, wedding, lang, story, setStory, slug, narrow,
  sectionOn, onEnableSection, onFocusPreview,
}) {
  const [open, setOpen] = useState(() => new Set())

  const base = useMemo(() => (Array.isArray(wedding?.loveStory) ? wedding.loveStory : []), [wedding])
  const localized = useMemo(() => {
    const wd = resolveWeddingContent(wedding || {}, lang) || {}
    return Array.isArray(wd.loveStory) ? wd.loveStory : base
  }, [wedding, lang, base])

  const copy = getStoryCopy(templateId, lang)
  const theme = getStoryTheme(templateId)
  const textKeys = STORY_TEXT_KEYS.filter((k) => (k === 'kpre' ? theme.kpre : k === 'photo' ? theme.frame === 'clipping' : true))

  const ch = story.ch || {}
  const add = story.add || []
  const visibleBase = base.filter((_, i) => !ch['c' + i]?.hide).length
  const canAdd = visibleBase + add.length < STORY_MAX_CHAPTERS && add.length < STORY_MAX_CHAPTERS

  const commit = (fn) => setStory((prev) => prune(fn({ ...prev })))
  const focus = () => onFocusPreview?.()

  /* ── Bölmənin öz yazıları ── */
  const setHeadText = (key, value) => commit((s) => {
    const T = { ...(s.text || {}) }
    const b = withLang(T[key], lang, value)
    if (Object.keys(b).length) T[key] = b
    else delete T[key]
    s.text = T
    return s
  })

  /* ── Müştəri fəslinin override-ı ── */
  const setCh = (i, fn) => commit((s) => {
    const CH = { ...(s.ch || {}) }
    const key = 'c' + i
    const next = prune(fn({ ...(CH[key] || {}) }))
    if (Object.keys(next).length) CH[key] = next
    else delete CH[key]
    s.ch = CH
    return s
  })

  /* ── Admin-in yeni fəsli ── */
  const setAdd = (j, fn) => commit((s) => {
    const A = [...(s.add || [])]
    A[j] = fn({ ...A[j] })
    s.add = A
    return s
  })

  const toggleOpen = (k) => setOpen((prev) => {
    const n = new Set(prev)
    if (n.has(k)) n.delete(k)
    else n.add(k)
    return n
  })

  const headerRow = (k, label, summary, extra) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        type="button" onClick={() => toggleOpen(k)} aria-expanded={open.has(k)}
        style={{
          flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 6, textAlign: 'left',
          background: 'none', border: 'none', padding: narrow ? '6px 0' : '2px 0', minHeight: narrow ? 40 : undefined,
          cursor: 'pointer', fontFamily: 'inherit', color: C.ink,
        }}
      >
        {open.has(k) ? <ChevronDown size={15} strokeWidth={1.7} /> : <ChevronRight size={15} strokeWidth={1.7} />}
        <span style={{ fontSize: narrow ? 13.5 : 12.5, fontWeight: 600, flex: '0 0 auto' }}>{label}</span>
        <span style={{ fontSize: narrow ? 12.5 : 11.5, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {summary}
        </span>
      </button>
      {extra}
    </div>
  )

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <p style={{ fontSize: narrow ? 13 : 11.5, color: C.sub, lineHeight: 1.6, margin: 0 }}>
        Hekayənin bütün yazılarını, tarixləri, stikerləri və şəkilləri dəyişə, fəsil gizlədə
        və ya yeni fəsil əlavə edə bilərsiniz. Boş sahə müştərinin öz mətnini saxlayır.
      </p>

      {!sectionOn && (
        <div style={{
          border: `1px solid ${C.warn}`, background: 'oklch(97% 0.03 85)', borderRadius: 8,
          padding: '10px 12px', fontSize: narrow ? 13 : 11.5, color: C.text, lineHeight: 1.6,
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <span style={{ flex: '1 1 220px' }}>
            <b>Bu bölmə dəvətnamədə bağlıdır</b> — qonaqlar hekayəni görmür.
          </span>
          <button
            type="button" onClick={onEnableSection}
            style={{
              padding: narrow ? '10px 14px' : '6px 12px', minHeight: narrow ? 40 : undefined, border: 'none', borderRadius: 6,
              background: C.gold, color: 'white', fontSize: narrow ? 13 : 11.5, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >Bölməni aç</button>
        </div>
      )}

      <Card title={`Bölmənin yazıları (${lang.toUpperCase()})`} hint="Placeholder-da şablonun öz mətni var.">
        <div style={{ display: 'grid', gap: narrow ? 12 : 9 }}>
          {textKeys.map((k) => (
            <FieldRow
              key={k} narrow={narrow} label={TEXT_LABELS[k]}
              value={story.text?.[k]?.[lang] || ''} placeholder={copy[k] || '—'}
              onChange={(v) => setHeadText(k, v)} onFocus={focus}
            />
          ))}
        </div>
      </Card>

      <Card
        title={`Fəsillər (${visibleBase + add.length})`}
        hint={base.length ? 'Müştərinin yazdığı fəsillər. Açmaq üçün toxunun.' : 'Müştəri hekayə yazmayıb — aşağıdan fəsil əlavə edə bilərsiniz.'}
      >
        <div style={{ display: 'grid', gap: 8 }}>
          {base.map((row, i) => {
            const key = 'c' + i
            const o = ch[key] || {}
            const loc = localized[i] || row || {}
            const raw = photosOf(row)
            const current = Array.isArray(o.photos) ? o.photos.map((p) => (typeof p === 'number' ? raw[p] : p)).filter(Boolean) : raw
            const hidden = o.hide === true
            const effIcon = o.icon === false ? '' : (o.icon || row?.icon || '')
            const title = o.title?.[lang] || o.title?.az || loc.title || ''

            const photoList = () => (Array.isArray(o.photos) ? [...o.photos] : raw.map((_, k) => k))
            return (
              <div key={key} style={{ border: `1px solid ${C.hair}`, borderRadius: 7, padding: narrow ? '6px 10px 10px' : '6px 10px 8px', opacity: hidden ? 0.6 : 1 }}>
                {headerRow(
                  key,
                  `#${i + 1}`,
                  [effIcon, title || '(başlıqsız)'].filter(Boolean).join(' '),
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: hidden ? C.danger : C.ok, flex: '0 0 auto' }}>
                    {hidden ? 'gizli' : 'görünür'}
                    <Toggle label={`Fəsil ${i + 1} görünsün`} on={!hidden} onChange={(v) => { setCh(i, (c) => ({ ...c, hide: v ? undefined : true })); focus() }} />
                  </span>,
                )}
                {open.has(key) && !hidden && (
                  <ChapterFields
                    narrow={narrow} lang={lang} slug={slug}
                    values={{
                      title: o.title?.[lang] || '', text: o.text?.[lang] || '', caption: o.caption?.[lang] || '',
                      date: typeof o.date === 'string' ? o.date : '',
                    }}
                    placeholders={{ title: loc.title, text: loc.text, caption: loc.caption, date: row?.date }}
                    photos={current}
                    onFocus={focus}
                    onText={(f, v) => setCh(i, (c) => ({ ...c, [f]: withLang(c[f], lang, v) }))}
                    onDate={(v) => setCh(i, (c) => ({ ...c, date: v || undefined }))}
                    dateHidden={o.date === false}
                    onToggleDate={() => setCh(i, (c) => ({ ...c, date: c.date === false ? undefined : false }))}
                    iconState={{ value: effIcon, canRemove: !!effIcon, canReset: o.icon !== undefined }}
                    onIcon={(v) => setCh(i, (c) => ({ ...c, icon: v === null ? undefined : v }))}
                    canResetPhotos={Array.isArray(o.photos)}
                    onResetPhotos={() => setCh(i, (c) => ({ ...c, photos: undefined }))}
                    onPhotosChange={(action, arg) => setCh(i, (c) => {
                      const list = photoList()
                      if (action === 'remove') list.splice(arg, 1)
                      else if (list.length < STORY_MAX_PHOTOS) list.push(arg)
                      return { ...c, photos: list }
                    })}
                  />
                )}
              </div>
            )
          })}

          {add.map((a, j) => {
            const key = 'a' + (a.id || j)
            const title = a.title?.[lang] || a.title?.az || ''
            return (
              <div key={key} style={{ border: `1px dashed ${C.gold}`, borderRadius: 7, padding: narrow ? '6px 10px 10px' : '6px 10px 8px' }}>
                {headerRow(
                  key,
                  `Yeni #${j + 1}`,
                  [a.icon, title || '(başlıqsız)'].filter(Boolean).join(' '),
                  <button
                    type="button" aria-label="Fəsli sil"
                    onClick={() => { if (window.confirm('Bu fəsil silinsin?')) commit((s) => ({ ...s, add: (s.add || []).filter((_, k) => k !== j) })) }}
                    style={{ ...smallBtn(narrow), color: C.danger, flex: '0 0 auto' }}
                  >
                    <Trash2 size={12} strokeWidth={1.7} />{narrow ? '' : ' Sil'}
                  </button>,
                )}
                {open.has(key) && (
                  <ChapterFields
                    narrow={narrow} lang={lang} slug={slug}
                    values={{
                      title: a.title?.[lang] || '', text: a.text?.[lang] || '', caption: a.caption?.[lang] || '',
                      date: a.date || '',
                    }}
                    placeholders={{
                      title: lang !== 'az' ? (a.title?.az || 'Fəslin başlığı') : 'Fəslin başlığı',
                      text: lang !== 'az' ? (a.text?.az || 'Hekayə mətni') : 'Hekayə mətni',
                      caption: lang !== 'az' ? (a.caption?.az || '') : 'məs. ilk baxış',
                      date: '',
                    }}
                    photos={a.photos || []}
                    onFocus={focus}
                    onText={(f, v) => setAdd(j, (c) => ({ ...c, [f]: withLang(c[f], lang, v) }))}
                    onDate={(v) => setAdd(j, (c) => ({ ...c, date: v }))}
                    dateHidden={false}
                    iconState={{ value: a.icon || '', canRemove: !!a.icon, canReset: false }}
                    onIcon={(v) => setAdd(j, (c) => ({ ...c, icon: v || '' }))}
                    canResetPhotos={false}
                    onPhotosChange={(action, arg) => setAdd(j, (c) => {
                      const list = [...(c.photos || [])]
                      if (action === 'remove') list.splice(arg, 1)
                      else if (list.length < STORY_MAX_PHOTOS) list.push(arg)
                      return { ...c, photos: list }
                    })}
                  />
                )}
              </div>
            )
          })}
        </div>

        <button
          type="button" disabled={!canAdd}
          onClick={() => {
            const id = newId()
            commit((s) => ({ ...s, add: [...(s.add || []), { id, title: {}, text: {}, caption: {}, date: '', icon: '', photos: [] }] }))
            setOpen((prev) => new Set(prev).add('a' + id))
          }}
          style={{
            marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: narrow ? '11px 14px' : '7px 12px', minHeight: narrow ? 42 : undefined,
            border: `1px solid ${C.gold}`, borderRadius: 6, background: 'white', color: C.ink,
            fontSize: narrow ? 13 : 11.5, cursor: canAdd ? 'pointer' : 'not-allowed', opacity: canAdd ? 1 : 0.45,
            fontFamily: 'inherit',
          }}
        >
          <Plus size={14} strokeWidth={1.8} />
          Yeni fəsil əlavə et
        </button>
        {!canAdd && (
          <div style={{ fontSize: 11, color: C.faint, marginTop: 6 }}>Hekayədə ən çox {STORY_MAX_CHAPTERS} fəsil ola bilər.</div>
        )}
        <div style={{ fontSize: 11, color: C.faint, marginTop: 8, lineHeight: 1.55 }}>
          Yeni fəsil yalnız başlıq, mətn və ya şəkil olduqda görünür. Tarixi «2019-06» yazsanız ay adı dilə görə göstərilir.
        </div>
      </Card>
    </div>
  )
}
