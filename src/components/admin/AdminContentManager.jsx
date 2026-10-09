import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Play } from 'lucide-react'
import { getInvitationContent, saveInvitationContent, getInvitation } from '../../utils/api'
import { getTemplateTheme, getTemplateName, FONT_STACKS } from '../../templates/templateConfig'
import {
  CONTENT_SECTIONS, THEME_KEYS, THEME_LABELS, FONT_CHOICES,
  FONT_SCALE_MIN, FONT_SCALE_MAX, safeColor, STRING_CATALOG,
} from '../../data/adminOverrides'
import { SECTION_DEFS, isSectionOn } from '../../data/sections'
import OpeningEditor from './content/OpeningEditor'
import StoryEditor from './content/StoryEditor'
import translations from '../../data/translations'
import { buildRsvpLabels } from '../../hooks/useRsvp'
import { GUESTBOOK_LABELS } from '../../hooks/useGuestbook'
import { SEATING_LABELS } from '../../hooks/useSeating'
import ContentManager from './v2/ContentManager'
import { Button, Modal, Notice, Spinner, useMediaQuery } from './v2/adminUi'

/* ─────────────────────────────────────────────────────────────────────────────
   INVITATION CONTENT MANAGER (Phase 42/45; UI redesign 2026-10: v2/ContentManager)

   Dəyişikliklər YALNIZ həmin dəvətnamənin `form_data.admin` açarına yazılır
   (`api/admin_invitation_content.php`) — slug, approval və builder datası
   dəyişmir. BOŞ SAHƏ = «dəyişiklik yoxdur» (açar JSON-dan silinir).

   ⚠ MƏLUMAT MODELİ DƏYİŞMİR: labels (kicker + başlıq/dil), strings (kataloq
   açarı/dil), theme, fonts (heading/body + headingScale/bodyScale), opening,
   story, sections. Yeni görünüşün sahələri bu modelə burada xəritələnir.
   «Açılış» və «Love Story» tablarında Phase 45 redaktorları işləyir.

   ⚠ RƏNG/ŞRİFT MƏHDUDİYYƏTİ: `simple-luxury`, `royal-gold`, `floral-garden`
   öz markup-larını yazır — orada rəng/şrift tabları açıq izahla bağlanır.

   ⚠ CANLI ÖNBAXIŞ ayrıca sənəddir (iframe /preview/live): data postMessage
   ilə 90 ms debounce-la gedir — yazmaq rəvan qalır, `vw` iframe eninə görədir.
   ───────────────────────────────────────────────────────────────────────── */

const BESPOKE_TEMPLATES = new Set(['simple-luxury', 'royal-gold', 'floral-garden'])
const LANG_IDS = ['az', 'en', 'ru']
const isEmptyObj = (o) => !o || Object.keys(o).length === 0
const sameJson = (a, b) => JSON.stringify(a ?? {}) === JSON.stringify(b ?? {})

export default function AdminContentManager({ slug, onClose, onSaved }) {
  const [loading, setLoading]     = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saveState, setSaveState] = useState('idle')
  const [saveError, setSaveError] = useState('')

  const [tab, setTab]       = useState('texts')
  const [lang, setLang]     = useState('az')
  const [device, setDevice] = useState('phone')
  const isNarrow = useMediaQuery('(max-width: 900px)')

  const frameRef = useRef(null)
  /* iframe «hazıram» siqnalı verməmiş postMessage göndərmək mənasızdır */
  const [frameReady, setFrameReady] = useState(false)

  /* Redaktə olunan vəziyyət (köhnə model) */
  const [theme, setTheme]       = useState({})
  const [fonts, setFonts]       = useState({})
  const [labels, setLabels]     = useState({})
  const [strings, setStrings]   = useState({})
  const [sections, setSections] = useState({})
  const [opening, setOpening]   = useState({})
  const [story, setStory]       = useState({})
  /* Son saxlanmış vəziyyət — «dəyişib» nişanları üçün */
  const [saved, setSaved] = useState({ theme: {}, fonts: {}, labels: {}, strings: {}, sections: {}, opening: {}, story: {} })

  const [wedding, setWedding]     = useState(null)
  const [templateId, setTemplate] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [content, inv] = await Promise.all([
          getInvitationContent(slug),
          /* Önbaxış real məzmunla olsun deyə dəvətnamənin özü də çəkilir */
          getInvitation(slug).catch(() => null),
        ])
        if (!alive) return
        const a = content.admin || {}
        const snap = {
          theme: a.theme || {}, fonts: a.fonts || {}, labels: a.labels || {}, strings: a.strings || {},
          opening: a.opening || {}, story: a.story || {}, sections: content.sections || {},
        }
        setTheme(snap.theme); setFonts(snap.fonts); setLabels(snap.labels); setStrings(snap.strings)
        setOpening(snap.opening); setStory(snap.story); setSections(snap.sections)
        setSaved(snap)
        /* ⚠ `getInvitation` `{ data, active }` qaytarır; şablon id-si content endpoint-indən */
        const invData = inv?.data || null
        setTemplate(content.template_id || invData?.template || invData?.templateId || null)
        setWedding(invData)
      } catch (e) {
        if (alive) setLoadError(e?.message || 'Yüklənmədi')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [slug])

  const bespoke = templateId && BESPOKE_TEMPLATES.has(templateId)
  const baseTheme = useMemo(() => (templateId ? getTemplateTheme(templateId) : null) || {}, [templateId])

  /* Saxlanılacaq / önbaxışa gedəcək `admin` obyekti — boş açarlar düşmür */
  const buildAdmin = useCallback(() => {
    const admin = {}
    if (!isEmptyObj(theme))   admin.theme   = theme
    if (!isEmptyObj(fonts))   admin.fonts   = fonts
    if (!isEmptyObj(labels))  admin.labels  = labels
    if (!isEmptyObj(strings)) admin.strings = strings
    if (!isEmptyObj(opening)) admin.opening = opening
    if (!isEmptyObj(story))   admin.story   = story
    return admin
  }, [theme, fonts, labels, strings, opening, story])

  const previewData = useMemo(() => {
    if (!wedding) return null
    const admin = buildAdmin()
    return {
      ...wedding,
      sections: !isEmptyObj(sections) ? sections : wedding.sections,
      admin: !isEmptyObj(admin) ? admin : undefined,
    }
  }, [wedding, sections, buildAdmin])

  /* «Açılış» tabında önbaxış açılış ekranını göstərir (Phase 45) */
  const previewView = tab === 'opening' ? 'opening' : 'content'

  useEffect(() => {
    if (!previewData || !frameReady) return undefined
    const t = setTimeout(() => {
      try {
        frameRef.current?.contentWindow?.postMessage({
          type: 'digitoy:preview:data',
          template: templateId,
          weddingData: previewData,
          lang,
          view: previewView,
        }, window.location.origin)
      } catch { /* iframe bağlanıb — susuruq */ }
    }, 90)
    return () => clearTimeout(t)
  }, [previewData, frameReady, templateId, lang, previewView])

  /* iframe «hazıram» dedikdə ilk datanı göndər */
  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type === 'digitoy:preview:ready') setFrameReady(true)
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  const post = useCallback((msg) => {
    try { frameRef.current?.contentWindow?.postMessage(msg, window.location.origin) } catch { /* susuruq */ }
  }, [])

  /* Açılış animasiyasını əvvəldən oynat */
  const replayOpening = useCallback(() => post({ type: 'digitoy:preview:replay' }), [post])

  /* Redaktə olunan bölməni önbaxışda göstər (sürüşmə iframe-in özündə hesablanır) */
  const focusSection = useCallback((key) => {
    if (!frameReady) return
    post({ type: 'digitoy:preview:scroll', section: key })
  }, [frameReady, post])

  /* «Love Story» tabı açılanda önbaxış hekayə bölməsinə sürüşsün */
  useEffect(() => {
    if (tab !== 'story' || !frameReady) return undefined
    const tm = setTimeout(() => focusSection('lovestory'), 450)
    return () => clearTimeout(tm)
  }, [tab, frameReady, focusSection])

  const setLabelField = useCallback((key, field, lg, value) => {
    setLabels((prev) => {
      const entry = { ...(prev[key] || {}) }
      if (field === 'kicker') {
        if (value) entry.kicker = value
        else delete entry.kicker
      } else {
        const title = { ...(entry.title || {}) }
        if (value) title[lg] = value
        else delete title[lg]
        if (Object.keys(title).length) entry.title = title
        else delete entry.title
      }
      const next = { ...prev }
      if (Object.keys(entry).length) next[key] = entry
      else delete next[key]
      return next
    })
  }, [])

  const setStringField = useCallback((key, lg, value) => {
    setStrings((prev) => {
      const entry = { ...(prev[key] || {}) }
      if (value) entry[lg] = value
      else delete entry[lg]
      const next = { ...prev }
      if (Object.keys(entry).length) next[key] = entry
      else delete next[key]
      return next
    })
  }, [])

  /* Placeholder-da dəvətnamədə HAZIRDA görünən sistem mətni (Phase 45) */
  const systemText = useCallback((key, lg) => {
    const dot = key.indexOf('.')
    if (dot < 0) return (translations[lg] || translations.az)[key] || ''
    const [prefix, sub] = [key.slice(0, dot), key.slice(dot + 1)]
    if (prefix === 'rsvp')    return buildRsvpLabels(lg, wedding)[sub] || ''
    if (prefix === 'gbook')   return (GUESTBOOK_LABELS[lg] || GUESTBOOK_LABELS.az)[sub] || ''
    if (prefix === 'seating') return (SEATING_LABELS[lg] || SEATING_LABELS.az)[sub] || ''
    return ''
  }, [wedding])

  /* ── Köhnə model → yeni görünüşün dəyərləri ── */
  const toView = useCallback((s) => {
    const texts = {}
    for (const lg of LANG_IDS) {
      const t = {}
      for (const sec of CONTENT_SECTIONS) {
        t[`k:${sec.key}`] = s.labels[sec.key]?.kicker || ''
        t[`t:${sec.key}`] = s.labels[sec.key]?.title?.[lg] || ''
        for (const [key] of STRING_CATALOG[sec.key] || []) t[`s:${key}`] = s.strings[key]?.[lg] || ''
      }
      texts[lg] = t
    }
    const colors = {}
    for (const k of THEME_KEYS) colors[k] = s.theme[k] || baseTheme[k] || ''
    const typography = {
      heading: s.fonts.heading || '',
      body: s.fonts.body || '',
      headingScale: Math.round((s.fonts.headingScale ?? 1) * 100),
      bodyScale: Math.round((s.fonts.bodyScale ?? 1) * 100),
    }
    /* ⚠ Açar YOXDURSA bölmənin default vəziyyəti `isSectionOn`-dan oxunur
       («Bizim Hekayəmiz» default BAĞLIDIR — Phase 45 qaydası) */
    const secs = {}
    for (const def of SECTION_DEFS) secs[def.id] = isSectionOn({ sections: s.sections }, def.id)
    return { texts, colors, typography, sections: secs }
  }, [baseTheme])

  const current = { theme, fonts, labels, strings, sections }
  const values = toView(current)
  const savedValues = toView(saved)

  const defaults = useMemo(() => {
    const texts = {}
    for (const lg of LANG_IDS) {
      const t = {}
      for (const sec of CONTENT_SECTIONS) {
        t[`k:${sec.key}`] = '—'
        t[`t:${sec.key}`] = 'Şablonun öz mətni'
        for (const [key] of STRING_CATALOG[sec.key] || []) t[`s:${key}`] = systemText(key, lg) || 'Sistemin öz mətni'
      }
      texts[lg] = t
    }
    return { texts, colors: { ...baseTheme }, typography: { heading: '', body: '' } }
  }, [systemText, baseTheme])

  const schema = useMemo(() => {
    const fontOptions = [
      { value: '', label: 'Şablonun öz şrifti', family: 'inherit' },
      ...FONT_CHOICES.map((f) => ({ value: f, label: f, family: FONT_STACKS[f] })),
    ]
    return {
      textSections: CONTENT_SECTIONS.map((sec) => ({
        id: sec.key,
        title: sec.az,
        hint: sec.hint,
        fields: [
          { key: `k:${sec.key}`, label: 'Üst etiket', short: true },
          { key: `t:${sec.key}`, label: 'Başlıq', localized: true, short: true },
          ...(STRING_CATALOG[sec.key] || []).map(([key, name]) => ({ key: `s:${key}`, label: name, localized: true })),
        ],
      })),
      colorTokens: THEME_KEYS.map((k) => ({ key: k, label: THEME_LABELS[k]?.az || k })),
      fonts: { heading: fontOptions, body: fontOptions },
      scale: { min: Math.round(FONT_SCALE_MIN * 100), max: Math.round(FONT_SCALE_MAX * 100), step: 5 },
      scaleFields: [
        { key: 'headingScale', label: 'Başlıq ölçüsü' },
        { key: 'bodyScale', label: 'Mətn ölçüsü', hint: 'Ölçü sabit piksel deyil, əmsaldır — şablonun responsiv tipoqrafiyası (mobil/desktop) toxunulmaz qalır.' },
      ],
      sections: SECTION_DEFS.map((def) => ({ id: def.id, label: def.labels?.az || def.id, hint: def.hints?.az })),
      lockedNote: bespoke
        ? `«${getTemplateName(templateId)}» şablonunda rəng və şrift dəyişikliyi işləmir — bu şablon öz markup-ını yazır və rənglər/şriftlər kodun içindədir. Mətn düzəlişləri və bölmə görünürlüyü isə normal işləyir.`
        : undefined,
    }
  }, [bespoke, templateId])

  /* ── Yeni görünüşdən gələn dəyişiklik → köhnə model ── */
  const handleChange = (next, path) => {
    setSaveState('idle')
    const [group, a, b] = path
    const v = path.reduce((o, k) => (o == null ? undefined : o[k]), next)
    if (group === 'texts') {
      const key = b
      if (key.startsWith('k:')) setLabelField(key.slice(2), 'kicker', null, v)   /* üst etiket dildən asılı deyil */
      else if (key.startsWith('t:')) setLabelField(key.slice(2), 'title', a, v)
      else if (key.startsWith('s:')) setStringField(key.slice(2), a, v)
    } else if (group === 'colors') {
      setTheme((prev) => {
        const n = { ...prev }
        const c = safeColor(v)
        if (!v || (baseTheme[a] && String(v).toUpperCase() === String(baseTheme[a]).toUpperCase())) delete n[a]
        else if (c) n[a] = c
        return n
      })
    } else if (group === 'typography') {
      setFonts((prev) => {
        const n = { ...prev }
        if (a === 'heading' || a === 'body') {
          if (v) n[a] = v
          else delete n[a]
        } else {
          const x = Number(v) / 100
          if (!Number.isFinite(x) || Math.abs(x - 1) < 0.001) delete n[a]
          else n[a] = x
        }
        return n
      })
    } else if (group === 'sections') {
      setSections((prev) => ({ ...prev, [a]: v }))
      focusSection(a)
    }
  }

  const handleSave = async () => {
    setSaveState('saving')
    setSaveError('')
    try {
      const admin = buildAdmin()
      const res = await saveInvitationContent(slug, admin, sections)
      setSaved({ theme, fonts, labels, strings, sections, opening, story })
      setSaveState('saved')
      onSaved?.(res)
    } catch (e) {
      setSaveError(e?.message || 'Saxlanılmadı')
      setSaveState('error')
    }
  }

  /* Bölmə görünürlüyü sıfırlanmır (köhnə davranış) */
  const resetAll = () => {
    setSaveState('idle')
    setTheme({}); setFonts({}); setLabels({}); setStrings({}); setOpening({}); setStory({})
  }

  /* ── Phase 45: açılış ekranı və «Bizim Hekayəmiz» ── */
  const effectiveSections = !isEmptyObj(sections) ? sections : (wedding?.sections || {})
  const storyOn = isSectionOn({ sections: effectiveSections }, 'lovestory')

  if (loading || loadError) {
    return (
      <Modal open onClose={onClose} title="Dəvətnamə məzmunu" description={<span className="font-mono text-[13px]">/{slug}</span>}>
        {loadError
          ? <Notice tone="danger" title={loadError} />
          : <p className="flex items-center justify-center gap-2 py-10 text-[14px] text-[#6B5E54]" role="status"><Spinner /> Yüklənir…</p>}
      </Modal>
    )
  }

  return (
    <ContentManager
      open
      onClose={onClose}
      slug={slug}
      templateName={templateId ? getTemplateName(templateId) : undefined}
      values={values}
      savedValues={savedValues}
      defaults={defaults}
      schema={schema}
      onChange={handleChange}
      onSave={handleSave}
      saveState={saveState}
      saveError={saveError}
      onResetAll={resetAll}
      tab={tab}
      onTab={setTab}
      lang={lang}
      onLang={setLang}
      device={device}
      /* Cihaz dəyişəndə iframe yenidən yaranır — «hazıram» siqnalını yenidən gözlə */
      onDevice={(d) => { setFrameReady(false); setDevice(d) }}
      onFocusSection={focusSection}
      extraDirty={{
        opening: sameJson(opening, saved.opening) ? 0 : 1,
        story: sameJson(story, saved.story) ? 0 : 1,
      }}
      customTabs={{
        opening: (
          <>
            <div className="flex justify-end">
              <Button size="sm" icon={Play} onClick={replayOpening}>Açılışı yenidən oynat</Button>
            </div>
            <OpeningEditor
              templateId={templateId} wedding={wedding} lang={lang}
              opening={opening} setOpening={(fn) => { setSaveState('idle'); setOpening(fn) }}
              slug={slug} narrow={isNarrow}
            />
          </>
        ),
        story: (
          <StoryEditor
            templateId={templateId} wedding={wedding} lang={lang}
            story={story} setStory={(fn) => { setSaveState('idle'); setStory(fn) }}
            slug={slug} narrow={isNarrow}
            sectionOn={storyOn}
            onEnableSection={() => {
              setSections((prev) => ({ ...(!isEmptyObj(prev) ? prev : (wedding?.sections || {})), lovestory: true }))
              focusSection('lovestory')
            }}
            onFocusPreview={() => focusSection('lovestory')}
          />
        ),
      }}
      previewLoading={!frameReady}
      previewSlot={
        <iframe
          ref={frameRef}
          title="Dəvətnamə önbaxışı"
          src="/preview/live"
          className="block h-full w-full border-0 bg-white"
        />
      }
    />
  )
}
