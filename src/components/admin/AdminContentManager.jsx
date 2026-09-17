import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { X, Check, RotateCcw, Smartphone, Monitor, Type, Palette, Layout, FileText } from 'lucide-react'
import { getInvitationContent, saveInvitationContent, getInvitation } from '../../utils/api'
import { getTemplateTheme, getTemplateName, FONT_STACKS } from '../../templates/templateConfig'
import {
  CONTENT_SECTIONS, THEME_KEYS, THEME_LABELS, FONT_CHOICES,
  FONT_SCALE_MIN, FONT_SCALE_MAX, safeColor, STRING_CATALOG,
} from '../../data/adminOverrides'
import { SECTION_DEFS } from '../../data/sections'

/* ─────────────────────────────────────────────────────────────────────────────
   INVITATION CONTENT MANAGER (Phase 42) — admin panel modalı.

   NƏ ÜÇÜN: builder dəvətnaməni yaradır, sonra admin mətni/rəngi/şrifti
   düzəltmək istəyə bilər. Builder-ə toxunmaq olmaz (müştəri axını pozular),
   şablon faylına toxunmaq olmaz (dəyişiklik BÜTÜN dəvətnamələrə keçər).
   Bu modal dəyişiklikləri YALNIZ həmin dəvətnamənin `form_data.admin`
   açarına yazır (`api/admin_invitation_content.php`).

   ⚠ SLUG-A TOXUNMUR: yazma `save_invitation.php`-yə getmir, ona görə canlı
   link, approval vəziyyəti və builder məlumatları dəyişmir.

   ⚠ BOŞ SAHƏ = «dəyişiklik yoxdur»: sahə boşaldılanda açar JSON-dan tamamilə
   silinir və dəvətnamə şablonun öz dəyərinə qayıdır. Yəni heç bir dəyişiklik
   geri dönülməz deyil.

   ⚠ RƏNG/ŞRİFT MƏHDUDİYYƏTİ: bu override-lar `TemplateShell` üzərində qurulan
   şablonlarda işləyir (16-dan 13-ü). `simple-luxury`, `royal-gold` və
   `floral-garden` öz markup-larını yazır və rəngləri kod daxilindədir —
   orada rəng seçiciləri SÖNDÜRÜLÜR (səssizcə işləməməkdənsə açıq deyilir).
   Mətn və bölmə görünürlüyü isə HƏR ŞABLONDA işləyir.
   ───────────────────────────────────────────────────────────────────────── */

const C = {
  ink:   'oklch(20% 0.02 60)',
  text:  'oklch(28% 0.02 60)',
  sub:   'oklch(52% 0.03 60)',
  faint: 'oklch(62% 0.03 60)',
  line:  'oklch(88% 0.02 60)',
  hair:  'oklch(93% 0.01 75)',
  gold:  'oklch(55% 0.09 80)',
  warn:  'oklch(58% 0.12 70)',
  danger:'oklch(48% 0.15 25)',
}

/* Rəng override-ı YALNIZ TemplateShell əsaslı şablonlarda işləyir.
   Bu üçü öz markup-ını yazır (tarixi səbəb — bax şablon başlıqları). */
const BESPOKE_TEMPLATES = new Set(['simple-luxury', 'royal-gold', 'floral-garden'])

const LANGS = [
  { id: 'az', label: 'AZ' },
  { id: 'en', label: 'EN' },
  { id: 'ru', label: 'RU' },
]

const TABS = [
  { id: 'content',  icon: FileText, az: 'Mətnlər' },
  { id: 'theme',    icon: Palette,  az: 'Rənglər' },
  { id: 'type',     icon: Type,     az: 'Tipoqrafiya' },
  { id: 'sections', icon: Layout,   az: 'Bölmələr' },
]

const input = {
  width: '100%', padding: '7px 9px', border: `1px solid ${C.line}`, borderRadius: 4,
  fontSize: 12.5, color: C.text, background: 'white', outline: 'none',
  fontFamily: 'inherit', lineHeight: 1.5,
}

const label = { fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: C.faint, marginBottom: 4 }

/* ── Kiçik köməkçi komponentlər ──────────────────────────────────────── */

function Row({ children, gap = 8 }) {
  return <div style={{ display: 'flex', gap, alignItems: 'flex-end', flexWrap: 'wrap' }}>{children}</div>
}

/** Rəng seçici — `<input type=color>` + hex mətn sahəsi (ikisi sinxron) */
function ColorField({ name, value, fallback, disabled, onChange }) {
  const shown = value || fallback || '#000000'
  return (
    <div style={{ flex: '1 1 150px', minWidth: 140, opacity: disabled ? 0.45 : 1 }}>
      <div style={label}>{name}</div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <input
          type="color" value={shown} disabled={disabled}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          style={{
            width: 30, height: 30, padding: 0, border: `1px solid ${C.line}`,
            borderRadius: 4, background: 'white', cursor: disabled ? 'not-allowed' : 'pointer', flex: '0 0 auto',
          }}
          aria-label={name}
        />
        <input
          type="text" value={value || ''} placeholder={fallback || ''} disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...input, fontFamily: 'ui-monospace, monospace', fontSize: 11.5 }}
        />
        {value && !disabled && (
          <button
            type="button" onClick={() => onChange('')} title="Şablonun öz rənginə qaytar"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.faint, padding: 2, display: 'flex' }}
          >
            <RotateCcw size={12} strokeWidth={1.6} />
          </button>
        )}
      </div>
    </div>
  )
}

function Toggle({ on, onChange, disabled }) {
  return (
    <button
      type="button" role="switch" aria-checked={on} disabled={disabled}
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

/* ── Əsas komponent ──────────────────────────────────────────────────── */

export default function AdminContentManager({ slug, onClose, onSaved }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState(null)
  const [saved, setSaved]     = useState(false)

  const [tab, setTab]   = useState('content')
  const [lang, setLang] = useState('az')
  const [device, setDevice] = useState('mobile')

  /* ── Mobil admin (S24 Ultra ≈ 412×915 dp) ──────────────────────────────
     Redaktor + önbaxış yan-yana ən azı ~880px tələb edir. Telefonda onlar
     YAN-YANA SIĞMIR, ona görə dar ekranda şaquli yığılır və yuxarıdakı iki
     nişanla keçid edilir. Eni 900px-dən böyük ekranlarda davranış əvvəlki
     kimi qalır. */
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)').matches : false,
  )
  const [mobileTab, setMobileTab] = useState('edit')

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const onChange = (e) => setIsNarrow(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* ── Canlı önbaxış (Phase 43 · ISSUE #5) ──────────────────────────────
     `previewData` hər klaviatura vuruşunda yenidən qurulur; onu BİRBAŞA
     render etsək bütün dəvətnamə ağacı hər simvolda yenidən çəkilir və
     yazmaq «yapışqan» olur. Ona görə 90 ms debounce var — istifadəçi üçün
     dərhal görünür, amma render sayı kəskin azalır. */
  const frameRef = useRef(null)
  /* iframe «hazıram» siqnalı verməmiş postMessage göndərmək mənasızdır */
  const [frameReady, setFrameReady] = useState(false)

  /* Redaktə olunan vəziyyət */
  const [theme, setTheme]       = useState({})
  const [fonts, setFonts]       = useState({})
  const [labels, setLabels]     = useState({})
  const [strings, setStrings]   = useState({})
  const [sections, setSections] = useState({})

  /* Önbaxış üçün real dəvətnamə datası */
  const [wedding, setWedding]     = useState(null)
  const [templateId, setTemplate] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [content, inv] = await Promise.all([
          getInvitationContent(slug),
          /* Önbaxış real məzmunla olsun deyə dəvətnamənin özünü də çəkirik.
             Uğursuz olsa modal yenə işləyir — sadəcə önbaxış boş qalır. */
          getInvitation(slug).catch(() => null),
        ])
        if (!alive) return
        const a = content.admin || {}
        setTheme(a.theme || {})
        setFonts(a.fonts || {})
        setLabels(a.labels || {})
        setStrings(a.strings || {})
        setSections(content.sections || {})
        /* ⚠ `getInvitation` `{ data, active }` qaytarır — dəvətnamə obyekti
           `data`-dadır. Şablon id-si isə content endpoint-indən gəlir
           (DB sütunu), çünki `form_data`-da olmaya bilər. */
        const inv_data = inv?.data || null
        setTemplate(content.template_id || inv_data?.template || inv_data?.templateId || null)
        setWedding(inv_data)
      } catch (e) {
        if (alive) setError(e?.message || 'Yüklənmədi')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [slug])

  const bespoke = templateId && BESPOKE_TEMPLATES.has(templateId)
  const baseTheme = useMemo(() => (templateId ? getTemplateTheme(templateId) : null), [templateId])

  /* Önbaxışa göndərilən data — dəyişiklik etdikcə dərhal yenilənir (PART 7).
     ⚠ `admin` açarı məhz render qatının gözlədiyi formadadır, yəni önbaxış
     saxlanılmış dəvətnamə ilə EYNİ yolu keçir — «önbaxışda başqa, canlıda
     başqa» problemi yaranmır. */
  const previewData = useMemo(() => {
    if (!wedding) return null
    const admin = {}
    if (Object.keys(theme).length)  admin.theme  = theme
    if (Object.keys(fonts).length)  admin.fonts  = fonts
    if (Object.keys(labels).length) admin.labels = labels
    if (Object.keys(strings).length) admin.strings = strings
    return {
      ...wedding,
      sections: Object.keys(sections).length ? sections : wedding.sections,
      admin: Object.keys(admin).length ? admin : undefined,
    }
  }, [wedding, theme, fonts, labels, strings, sections])

  /* ── Debounce (maks. 100 ms tələbi) ───────────────────────────────────
     `previewData` hər klaviatura vuruşunda yeni obyektdir. Onu birbaşa
     render etsək bütün dəvətnamə ağacı hər simvolda yenidən çəkilir və
     yazmaq «yapışqan» olur. 90 ms gözləmə gözlə görünmür, amma render
     sayını kəskin azaldır.
     ⚠ setState `setTimeout` içindədir (sinxron deyil) — kaskad render
     yaratmır. */
  /* ⚠ Datanı React state-i kimi SAXLAMIRIQ — birbaşa iframe-ə göndəririk.
     Əvvəl önbaxış bu komponentin ağacında render olunurdu və hər simvolda
     bütün dəvətnamə yenidən çəkilirdi. İndi iframe ayrı sənəddir: valideyn
     yalnız mesaj göndərir, yazmaq tamamilə rəvan qalır. */
  useEffect(() => {
    if (!previewData || !frameReady) return undefined
    const t = setTimeout(() => {
      try {
        frameRef.current?.contentWindow?.postMessage({
          type: 'digitoy:preview:data',
          template: templateId,
          weddingData: previewData,
          lang,
        }, window.location.origin)
      } catch { /* iframe bağlanıb — susuruq */ }
    }, 90)
    return () => clearTimeout(t)
  }, [previewData, frameReady, templateId, lang])

  /* iframe «hazıram» dedikdə ilk datanı göndər */
  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type === 'digitoy:preview:ready') setFrameReady(true)
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  /**
   * Redaktə olunan bölməni önbaxışda göstər.
   * ⚠ DOM-dan sürüşdürmə MÜMKÜN DEYİL — önbaxış artıq ayrı sənəddədir
   * (iframe). Ona görə sürüşmə əmri mesajla göndərilir; hesablamanı
   * `LivePreviewPage` öz koordinat sistemində aparır — miqyas düzəlişi
   * lazım gəlmir.
   */
  const focusSection = useCallback((key) => {
    if (!frameReady) return
    try {
      frameRef.current?.contentWindow?.postMessage(
        { type: 'digitoy:preview:scroll', section: key },
        window.location.origin,
      )
    } catch { /* susuruq */ }
    /* Telefonda redaktor və önbaxış eyni anda görünmür — fokus önbaxışa keçsin */
    if (isNarrow) setMobileTab('preview')
  }, [frameReady, isNarrow])

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

  const handleSave = async () => {
    setSaving(true); setError(null); setSaved(false)
    try {
      const admin = {}
      if (Object.keys(theme).length)  admin.theme  = theme
      if (Object.keys(fonts).length)  admin.fonts  = fonts
      if (Object.keys(labels).length) admin.labels = labels
      if (Object.keys(strings).length) admin.strings = strings
      const res = await saveInvitationContent(slug, admin, sections)
      setSaved(true)
      onSaved?.(res)
      setTimeout(() => setSaved(false), 2200)
    } catch (e) {
      setError(e?.message || 'Saxlanılmadı')
    } finally {
      setSaving(false)
    }
  }

  const resetAll = () => {
    if (!window.confirm('Bütün admin düzəlişləri silinsin? Dəvətnamə şablonun öz görünüşünə qayıdacaq.')) return
    setTheme({}); setFonts({}); setLabels({}); setStrings({})
  }

  /* ── Panellər ─────────────────────────────────────────────────────── */

  const contentPanel = (
    <div style={{ display: 'grid', gap: 14 }}>
      <p style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.6, margin: 0 }}>
        Bölmə başlıqlarını dəyişə bilərsiniz. Boş buraxılan sahə şablonun öz
        mətnini saxlayır — heç nə itmir.
      </p>
      {CONTENT_SECTIONS.map((sec) => {
        const entry = labels[sec.key] || {}
        return (
          <div key={sec.key} style={{ border: `1px solid ${C.hair}`, borderRadius: 6, padding: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.ink, marginBottom: 8 }}>{sec.az}</div>
            <Row>
              <div style={{ flex: '0 0 130px' }}>
                <div style={label}>Üst etiket</div>
                <input
                  type="text" value={entry.kicker || ''} placeholder="—"
                  onChange={(e) => setLabelField(sec.key, 'kicker', null, e.target.value)}
                  onFocus={() => focusSection(sec.key)}
                  style={{ ...input, textTransform: 'uppercase' }}
                />
              </div>
              <div style={{ flex: '1 1 220px' }}>
                <div style={label}>Başlıq ({lang.toUpperCase()})</div>
                <input
                  type="text" value={entry.title?.[lang] || ''} placeholder="Şablonun öz mətni"
                  onChange={(e) => setLabelField(sec.key, 'title', lang, e.target.value)}
                  onFocus={() => focusSection(sec.key)}
                  style={input}
                />
              </div>
            </Row>

            {/* ── Bölmənin bütün mətnləri (Phase 42.1 · #7) ───────────────
                Əvvəl yalnız başlıq redaktə oluna bilirdi; düymə mətnləri,
                cavab variantları, boş/uğur halları sabit qalırdı. İndi
                kataloqdakı hər sətir buradadır. Boş sahə = sistemin öz
                mətni (heç nə saxlanılmır). */}
            {(STRING_CATALOG[sec.key] || []).length > 0 && (
              <div style={{ marginTop: 10, borderTop: `1px solid ${C.hair}`, paddingTop: 9, display: 'grid', gap: 7 }}>
                {STRING_CATALOG[sec.key].map(([key, name]) => (
                  <div key={key}>
                    <div style={label}>{name}</div>
                    <input
                      type="text"
                      value={strings[key]?.[lang] || ''}
                      placeholder="Sistemin öz mətni"
                      onChange={(e) => setStringField(key, lang, e.target.value)}
                      onFocus={() => focusSection(sec.key)}
                      style={input}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  const themePanel = (
    <div style={{ display: 'grid', gap: 12 }}>
      {bespoke && (
        <div style={{
          border: `1px solid ${C.warn}`, background: 'oklch(97% 0.03 85)', borderRadius: 6,
          padding: '9px 11px', fontSize: 11.5, color: C.text, lineHeight: 1.6,
        }}>
          <b>«{getTemplateName(templateId)}» şablonunda rəng dəyişikliyi işləmir.</b><br />
          Bu şablon öz markup-ını yazır və rənglər kodun içindədir. Mətn
          düzəlişləri və bölmə görünürlüyü isə normal işləyir.
        </div>
      )}
      <Row gap={10}>
        {THEME_KEYS.map((k) => (
          <ColorField
            key={k}
            name={THEME_LABELS[k]?.az || k}
            value={theme[k] || ''}
            fallback={baseTheme?.[k]}
            disabled={bespoke}
            onChange={(v) => setTheme((prev) => {
              const next = { ...prev }
              const c = safeColor(v)
              if (c) next[k] = c
              else if (!v) delete next[k]
              else next[k] = v.toUpperCase()   /* yazılarkən aralıq vəziyyət */
              return next
            })}
          />
        ))}
      </Row>
      <p style={{ fontSize: 11, color: C.faint, lineHeight: 1.6, margin: 0 }}>
        Yalnız <code>#RRGGBB</code> formatı qəbul edilir. Boş buraxılan rəng
        şablonun öz tokenində qalır.
      </p>
    </div>
  )

  const typePanel = (
    <div style={{ display: 'grid', gap: 14 }}>
      {bespoke && (
        <div style={{
          border: `1px solid ${C.warn}`, background: 'oklch(97% 0.03 85)', borderRadius: 6,
          padding: '9px 11px', fontSize: 11.5, color: C.text, lineHeight: 1.6,
        }}>
          Bu şablonda şrift dəyişikliyi qismən işləyir (başlıq ailəsi), ölçü
          əmsalları tətbiq olunmur.
        </div>
      )}
      <Row gap={10}>
        {[['heading', 'Başlıq şrifti'], ['body', 'Mətn şrifti']].map(([k, name]) => (
          <div key={k} style={{ flex: '1 1 180px' }}>
            <div style={label}>{name}</div>
            <select
              value={fonts[k] || ''}
              onChange={(e) => setFonts((prev) => {
                const next = { ...prev }
                if (e.target.value) next[k] = e.target.value
                else delete next[k]
                return next
              })}
              style={{ ...input, cursor: 'pointer' }}
            >
              <option value="">Şablonun öz şrifti</option>
              {FONT_CHOICES.map((f) => (
                <option key={f} value={f} style={{ fontFamily: FONT_STACKS[f] }}>{f}</option>
              ))}
            </select>
          </div>
        ))}
      </Row>
      <Row gap={10}>
        {[['headingScale', 'Başlıq ölçüsü'], ['bodyScale', 'Mətn ölçüsü']].map(([k, name]) => {
          const val = fonts[k] ?? 1
          return (
            <div key={k} style={{ flex: '1 1 200px' }}>
              <div style={label}>{name} — {Math.round(val * 100)}%</div>
              <input
                type="range" min={FONT_SCALE_MIN} max={FONT_SCALE_MAX} step={0.05} value={val}
                onChange={(e) => setFonts((prev) => {
                  const n = Number(e.target.value)
                  const next = { ...prev }
                  if (Math.abs(n - 1) < 0.001) delete next[k]
                  else next[k] = n
                  return next
                })}
                style={{ width: '100%', accentColor: C.gold }}
              />
            </div>
          )
        })}
      </Row>
      <p style={{ fontSize: 11, color: C.faint, lineHeight: 1.6, margin: 0 }}>
        Ölçü sabit piksel deyil, <b>əmsaldır</b> — şablonun responsiv
        tipoqrafiyası (mobil/desktop uyğunlaşması) toxunulmaz qalır.
      </p>
    </div>
  )

  const sectionsPanel = (
    <div style={{ display: 'grid', gap: 8 }}>
      <p style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.6, margin: 0 }}>
        Söndürülən bölmə dəvətnamədə görünmür. Məlumat <b>silinmir</b> —
        yenidən açanda olduğu kimi qayıdır.
      </p>
      {SECTION_DEFS.map((def) => {
        /* ⚠ Açar YOXDURSA bölmə AÇIQdır — Phase 35 qaydası (`isSectionOn`).
           Ona görə `!== false` yazılır, `=== true` yox: köhnə dəvətnamələrdə
           `sections` ümumiyyətlə olmaya bilər və hamısı açıq görünməlidir. */
        const on = sections[def.id] !== false
        return (
          <div key={def.id} style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: 10, padding: '8px 9px', border: `1px solid ${C.hair}`, borderRadius: 5,
          }}>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 12.5, color: C.text }}>{def.labels?.az || def.id}</span>
              {def.hints?.az && (
                <span style={{ display: 'block', fontSize: 10.5, color: C.faint, marginTop: 2, lineHeight: 1.5 }}>
                  {def.hints.az}
                </span>
              )}
            </span>
            <Toggle on={on} onChange={(v) => { setSections((prev) => ({ ...prev, [def.id]: v })); focusSection(def.id) }} />
          </div>
        )
      })}
    </div>
  )

  const panels = { content: contentPanel, theme: themePanel, type: typePanel, sections: sectionsPanel }

  /* ── Render ───────────────────────────────────────────────────────── */

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Dəvətnamə məzmunu"
      style={{
        position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(20,16,12,.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isNarrow ? 0 : 14,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        /* ⚠ Telefonda (S24 Ultra ≈ 412×915 dp) modal TAM EKRAN olur:
           kənar boşluq və künc radiusu 412px-də yer itirir. */
        background: 'white',
        borderRadius: isNarrow ? 0 : 8,
        width: isNarrow ? '100%' : 'min(1120px, 100%)',
        height: isNarrow ? '100%' : undefined,
        maxHeight: isNarrow ? '100%' : '92vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,.28)',
      }}>
        {/* Başlıq */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 14px', borderBottom: `1px solid ${C.line}`, flex: '0 0 auto',
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>Dəvətnamə məzmunu</div>
            <div style={{ fontSize: 11, color: C.faint, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              /{slug}{templateId ? ` · ${getTemplateName(templateId)}` : ''}
            </div>
          </div>
          <button
            type="button" onClick={onClose} aria-label="Bağla"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.sub, padding: 4, display: 'flex' }}
          >
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* ── Telefonda panel keçidi (S24 Ultra) ──────────────────────────
            Redaktor və önbaxış yan-yana ~880px tələb edir; 412px-də yalnız
            biri göstərilir. Sahəyə toxunanda avtomatik önbaxışa keçir
            (bax `focusSection`), geri qayıtmaq üçün bu nişanlar var. */}
        {isNarrow && !loading && (
          <div style={{ display: 'flex', gap: 6, padding: '8px 10px', borderBottom: `1px solid ${C.line}`, flex: '0 0 auto' }}>
            {[['edit', 'Redaktə'], ['preview', 'Önbaxış']].map(([id, name]) => {
              const on = mobileTab === id
              return (
                <button
                  key={id} type="button" onClick={() => setMobileTab(id)}
                  style={{
                    flex: 1, padding: '9px 8px', borderRadius: 6,
                    border: `1px solid ${on ? C.gold : C.line}`,
                    background: on ? C.gold : 'white',
                    color: on ? 'white' : C.sub,
                    fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                    /* ⚠ Toxunma hədəfi ən azı 40px — barmaq üçün */
                    minHeight: 40,
                  }}
                >{name}</button>
              )
            })}
          </div>
        )}

        {loading ? (
          <div style={{ padding: 36, textAlign: 'center', fontSize: 12.5, color: C.sub }}>Yüklənir…</div>
        ) : (
          <div style={{
            display: 'flex', minHeight: 0, flex: 1,
            /* Telefonda yan-yana ~880px lazımdır — sığmır, ona görə yığılır */
            flexDirection: isNarrow ? 'column' : 'row',
          }}>
            {/* ── Sol: redaktor ── */}
            <div style={{
              flex: '1 1 460px', minWidth: 0, display: 'flex', flexDirection: 'column',
              borderRight: isNarrow ? 'none' : `1px solid ${C.line}`,
              /* Dar ekranda yalnız seçilmiş nişan görünür */
              ...(isNarrow && mobileTab !== 'edit' ? { display: 'none' } : null),
            }}>
              {/* Tablar */}
              <div style={{ display: 'flex', gap: 2, padding: '8px 10px 0', flex: '0 0 auto', flexWrap: 'wrap' }}>
                {TABS.map((t) => {
                  const Icon = t.icon
                  const on = tab === t.id
                  return (
                    <button
                      key={t.id} type="button" onClick={() => setTab(t.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px',
                        border: `1px solid ${on ? C.gold : 'transparent'}`,
                        borderRadius: 5, background: on ? 'oklch(97% 0.02 85)' : 'transparent',
                        color: on ? C.ink : C.sub, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      <Icon size={12} strokeWidth={1.6} />{t.az}
                    </button>
                  )
                })}
                {tab === 'content' && (
                  <div style={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
                    {LANGS.map((l) => (
                      <button
                        key={l.id} type="button" onClick={() => setLang(l.id)}
                        style={{
                          padding: '5px 9px', border: `1px solid ${lang === l.id ? C.gold : C.line}`,
                          borderRadius: 4, background: lang === l.id ? C.gold : 'white',
                          color: lang === l.id ? 'white' : C.sub, fontSize: 10.5, cursor: 'pointer',
                          fontFamily: 'inherit', letterSpacing: '.06em',
                        }}
                      >{l.label}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Panel */}
              <div style={{ padding: 12, overflowY: 'auto', flex: 1, minHeight: 0 }}>
                {panels[tab]}
              </div>

              {/* Alt sətir */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                borderTop: `1px solid ${C.line}`, flex: '0 0 auto', flexWrap: 'wrap',
              }}>
                <button
                  type="button" onClick={resetAll}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px',
                    border: `1px solid ${C.line}`, borderRadius: 5, background: 'white',
                    color: C.sub, fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <RotateCcw size={12} strokeWidth={1.6} />Hamısını sıfırla
                </button>

                {error && <span style={{ fontSize: 11.5, color: C.danger }}>{error}</span>}
                {saved && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'oklch(45% 0.1 150)' }}>
                    <Check size={12} strokeWidth={2} />Saxlanıldı
                  </span>
                )}

                <button
                  type="button" onClick={handleSave} disabled={saving}
                  style={{
                    marginLeft: 'auto', padding: '7px 16px', border: 'none', borderRadius: 5,
                    background: C.gold, color: 'white', fontSize: 12, cursor: saving ? 'wait' : 'pointer',
                    fontFamily: 'inherit', opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Saxlanılır…' : 'Saxla'}
                </button>
              </div>
            </div>

            {/* ── Sağ: canlı önbaxış (PART 7) ── */}
            <div style={{
              flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column',
              background: 'oklch(96% 0.005 80)',
              ...(isNarrow && mobileTab !== 'preview' ? { display: 'none' } : null),
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px',
                borderBottom: `1px solid ${C.line}`, flex: '0 0 auto',
              }}>
                <span style={{ fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase', color: C.faint }}>
                  Canlı önbaxış
                </span>
                <div style={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
                  {[['mobile', Smartphone], ['desktop', Monitor]].map(([id, Icon]) => (
                    <button
                      key={id} type="button" onClick={() => setDevice(id)}
                      aria-label={id === 'mobile' ? 'Mobil' : 'Desktop'}
                      style={{
                        padding: 5, border: `1px solid ${device === id ? C.gold : C.line}`,
                        borderRadius: 4, background: device === id ? 'oklch(97% 0.02 85)' : 'white',
                        color: device === id ? C.ink : C.sub, cursor: 'pointer', display: 'flex',
                      }}
                    >
                      <Icon size={13} strokeWidth={1.6} />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                flex: 1, minHeight: 0, overflow: 'hidden', padding: isNarrow ? 0 : 12,
                display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
                background: 'oklch(94% 0.005 80)',
              }}>
                {/* ── CANLI ÖNBAXIŞ — ayrıca sənəd (iframe) ──────────────
                    ⚠ NƏ ÜÇÜN iframe: şablonlar ölçüləri `clamp(…vw…)` ilə
                    verir və `vw` KONTEYNERƏ yox, BRAUZER PƏNCƏRƏSİNƏ görə
                    hesablanır. Adi div-in içində 412px-lik qutu qursaq da
                    mətn tam ekrana görə ölçülərdi — «telefon görünüşü»
                    heç vaxt real olmazdı. iframe-də `vw` = iframe eni.
                    ⚠ Üstəlik iframe öz scroll-unu alır: əvvəlki qutu
                    `overflow:hidden` idi və aşağı bölmələrə çatmaq olmurdu.
                    ⚠ Data şəbəkədən YOX, postMessage ilə gəlir → admin
                    yazdıqca, saxlamadan görünür. */}
                <div style={{
                  /* Qabıq miqyaslanmış ÖLÇÜNÜ tutur ki, scroll düzgün işləsin */
                  width: (device === 'mobile' ? 412 : 1280) * (device === 'mobile' ? 0.82 : 0.32),
                  height: '100%',
                  flex: '0 0 auto', overflow: 'hidden',
                  border: isNarrow ? 'none' : `1px solid ${C.line}`,
                  borderRadius: isNarrow ? 0 : (device === 'mobile' ? 14 : 4),
                  background: 'white',
                }}>
                  <iframe
                    ref={frameRef}
                    title="Dəvətnamə önbaxışı"
                    src="/preview/live"
                    style={{
                      width: device === 'mobile' ? 412 : 1280,
                      height: device === 'mobile' ? '122%' : '312%',
                      border: 0, display: 'block',
                      transform: `scale(${device === 'mobile' ? 0.82 : 0.32})`,
                      transformOrigin: 'top left',
                    }}
                  />
                </div>
              </div>            </div>
          </div>
        )}
      </div>
    </div>
  )
}
