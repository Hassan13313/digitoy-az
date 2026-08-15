import { useEffect } from 'react'
import { Check, Lock, Eye } from 'lucide-react'
import { listTemplates, isTemplateSelectable, getStatusMeta } from '../../templates/templateConfig'
import { trackTemplateSelected, trackTemplatePreviewed } from '../../templates/templateAnalytics'
import { ensureTemplateFonts } from '../../templates/fonts'

/* ─────────────────────────────────────────────────────────────────────────────
   DİZAYN SEÇ — builder-in şablon seçimi bloku.

   Thumbnail kompozisiyaları Claude Design layihəsindəki "Builder qalereyası"
   bölməsindən götürülüb (Digitoy Templates.dc.html) — hər şablonun öz vizual
   dili var, ümumi şablon deyil.

   ⚠ Bu blok HEÇ NƏ yazmır: seçim üst komponentin lokal state-indədir,
   `data` obyektinə düşmür → autosave/draft/API/sifariş axını toxunulmaz qalır.
   ───────────────────────────────────────────────────────────────────────── */

const UI = {
  az: { preview: 'Önbaxış', title: 'Dizayn seç', hint: 'Dəvətnamənizin görünüşünü seçin. Yeni dizaynlar mütəmadi əlavə olunur.', soon: 'Tezliklə', selected: 'Seçildi' },
  en: { preview: 'Preview', title: 'Choose a design', hint: 'Pick how your invitation looks. New designs are added regularly.', soon: 'Soon', selected: 'Selected' },
  ru: { preview: 'Просмотр', title: 'Выберите дизайн', hint: 'Выберите оформление приглашения. Новые дизайны добавляются регулярно.', soon: 'Скоро', selected: 'Выбрано' },
}

/* Nümunə cütlük — design faylındakı ilə eyni */
const SAMPLE = { a: 'Nigar', b: 'Rauf', date: '12 İyul 2025' }

const serif  = "'Cormorant Garamond', Georgia, serif"
const fill   = { position: 'absolute', inset: 0 }
const center = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 10px' }

/* ── Hər şablonun öz thumbnail kompozisiyası ── */
const THUMBS = {
  /* Digitoy-un mövcud (canlı) krem-qızıl dəvətnaməsi */
  'simple-luxury': () => (
    <div style={{ ...fill, background: 'linear-gradient(160deg,#FDFAF4 0%,#F2EAD6 55%,#E8DCC0 100%)' }}>
      <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(197,160,89,.32)' }} />
      <div style={center}>
        <span style={{ fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#C5A059', marginBottom: 8 }}>Toy</span>
        <span style={{ fontFamily: serif, fontSize: 16, color: '#1A1A1A', lineHeight: 1.2 }}>{SAMPLE.a}</span>
        <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 10, color: '#C5A059', margin: '2px 0' }}>və</span>
        <span style={{ fontFamily: serif, fontSize: 16, color: '#1A1A1A', lineHeight: 1.2 }}>{SAMPLE.b}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
          <span style={{ width: 14, height: 1, background: 'rgba(197,160,89,.5)' }} />
          <span style={{ width: 3, height: 3, background: '#C5A059', transform: 'rotate(45deg)' }} />
          <span style={{ width: 14, height: 1, background: 'rgba(197,160,89,.5)' }} />
        </span>
        <span style={{ fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8C7B6B', marginTop: 8 }}>{SAMPLE.date}</span>
      </div>
    </div>
  ),

  /* Royal Gold — tünd fon, möhürlənmiş zərf (Claude Design t1) */
  'royal-gold': () => (
    <div style={{ ...fill, background: 'radial-gradient(120% 90% at 50% 0%, #241B0E, #0B0906)' }}>
      <div style={{ position: 'absolute', inset: 9, border: '1px solid rgba(197,160,89,.28)' }} />
      <div style={center}>
        <span style={{ width: 17, height: 17, border: '1px solid rgba(197,160,89,.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, color: '#C5A059', marginBottom: 6 }}>✦</span>
        <span style={{ fontFamily: serif, fontSize: 15, color: '#E8D5A3', lineHeight: 1.25 }}>{SAMPLE.a}<br />&amp; {SAMPLE.b}</span>
        <span style={{ width: 18, height: 1, background: '#C5A059', margin: '7px 0' }} />
        <span style={{ fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8C7B6B' }}>{SAMPLE.date}</span>
      </div>
    </div>
  ),

  'floral-garden': () => (
    <div style={{ ...fill, background: 'linear-gradient(170deg,#FBF7F2,#EFE7DE)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle,rgba(201,143,132,.4),transparent 68%)', top: -34, left: -26, filter: 'blur(11px)' }} />
      <div style={{ position: 'absolute', width: 104, height: 104, borderRadius: '50%', background: 'radial-gradient(circle,rgba(126,140,110,.34),transparent 68%)', bottom: -34, right: -22, filter: 'blur(11px)' }} />
      <div style={center}>
        <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, color: '#4A4139', lineHeight: 1.25 }}>{SAMPLE.a}<br />&amp; {SAMPLE.b}</span>
        <span style={{ width: 26, height: 1, background: '#C98F84', margin: '8px 0' }} />
        <span style={{ fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8A8175' }}>Bağ mərasimi</span>
      </div>
    </div>
  ),

  'modern-black': () => (
    <div style={{ ...fill, background: '#0A0A0A', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 12, gap: 5 }}>
      <span style={{ fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#6C6C6C' }}>12.07.25 — BAKI</span>
      <span style={{ fontFamily: "'Archivo','Inter',sans-serif", fontWeight: 500, fontSize: 20, lineHeight: .94, letterSpacing: '-.04em', color: '#FFF', textTransform: 'uppercase' }}>
        NİGAR<br />RAUF
      </span>
    </div>
  ),

  'white-elegance': () => (
    <div style={{ ...fill, background: '#FFFFFF' }}>
      <div style={center}>
        <span style={{ width: 38, height: 38, borderRadius: '50%', background: '#FAF8F5', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.06),0 8px 20px rgba(0,0,0,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Marcellus',Georgia,serif", fontSize: 11, color: '#A79C90', marginBottom: 9 }}>N&amp;R</span>
        <span style={{ fontFamily: "'Marcellus',Georgia,serif", fontSize: 10.5, letterSpacing: '.14em', color: '#2B2723', textTransform: 'uppercase' }}>{SAMPLE.a} &amp; {SAMPLE.b}</span>
        <span style={{ fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#A79C90', marginTop: 7 }}>Sadəlik · Zəriflik</span>
      </div>
    </div>
  ),

  'night-sky': () => (
    <div style={{ ...fill, background: 'radial-gradient(130% 100% at 50% 110%,#1B2340,#070B18 70%)', overflow: 'hidden' }}>
      <span style={{ position: 'absolute', width: 2, height: 2, borderRadius: '50%', background: '#C8CEE0', top: 22, left: 26, opacity: .8 }} />
      <span style={{ position: 'absolute', width: 1.5, height: 1.5, borderRadius: '50%', background: '#C8CEE0', top: 44, right: 24, opacity: .55 }} />
      <span style={{ position: 'absolute', width: 1.5, height: 1.5, borderRadius: '50%', background: '#C8CEE0', bottom: 34, left: 40, opacity: .65 }} />
      <div style={center}>
        <span style={{ fontFamily: serif, fontSize: 15, color: '#E4E9F5', letterSpacing: '.02em', lineHeight: 1.25 }}>{SAMPLE.a}<br />&amp; {SAMPLE.b}</span>
        <span style={{ fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#8F98B0', marginTop: 8 }}>40°23′N · 49°52′E</span>
      </div>
    </div>
  ),

  'oriental-luxe': () => (
    <div style={{ ...fill, background: '#4A0F1C', overflow: 'hidden' }}>
      <div style={{ ...fill, opacity: .22, backgroundImage: 'radial-gradient(circle at 50% 50%,#D9B36C 1px,transparent 1.6px)', backgroundSize: '13px 13px' }} />
      <div style={center}>
        <span style={{ width: 28, height: 28, border: '1px solid rgba(217,179,108,.6)', transform: 'rotate(45deg)', marginBottom: 12 }} />
        <span style={{ fontFamily: "'Amiri',Georgia,serif", fontSize: 14, color: '#E9CE96', lineHeight: 1.3 }}>{SAMPLE.a}<br />&amp; {SAMPLE.b}</span>
        <span style={{ fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#B98F72', marginTop: 7 }}>Şərq zərifliyi</span>
      </div>
    </div>
  ),

  'nature-touch': () => (
    <div style={{ ...fill, background: 'linear-gradient(165deg,#EDE8DE,#DCD5C6)' }}>
      <div style={center}>
        <span style={{ width: 1, height: 22, background: '#3E4A3A', marginBottom: 9 }} />
        <span style={{ fontFamily: "'Newsreader',Georgia,serif", fontSize: 15, color: '#2F3A2C', lineHeight: 1.25 }}>{SAMPLE.a}<br />&amp; {SAMPLE.b}</span>
        <span style={{ fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7A7566', marginTop: 8 }}>Açıq havada</span>
      </div>
    </div>
  ),

  'crystal-glass': () => (
    <div style={{ ...fill, background: 'linear-gradient(150deg,#F4F7FA,#DCE6EE 60%,#EAF0F4)', overflow: 'hidden' }}>
      <div style={{ ...fill, background: 'linear-gradient(100deg,transparent 40%,rgba(255,255,255,.85) 50%,transparent 60%)' }} />
      <div style={center}>
        <span style={{ width: 32, height: 32, border: '1px solid rgba(120,145,165,.5)', borderRadius: '50%', background: 'rgba(255,255,255,.5)', marginBottom: 10 }} />
        <span style={{ fontFamily: "'Italiana',Georgia,serif", fontSize: 11, letterSpacing: '.1em', color: '#3A4650' }}>NIGAR &amp; RAUF</span>
        <span style={{ fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7E8D99', marginTop: 8 }}>Kristal · İşıq</span>
      </div>
    </div>
  ),
}

/* Status badge — rəng/mətn tamamilə metadata-dan (getStatusMeta) */
const TONE_STYLES = {
  positive: { color: '#3F7A46', background: 'rgba(63,122,70,0.10)', border: '1px solid rgba(63,122,70,0.28)' },
  info:     { color: '#8A6A2E', background: 'rgba(197,160,89,0.14)', border: '1px solid rgba(197,160,89,0.35)' },
  muted:    { color: '#8C7B6B', background: 'rgba(140,123,107,0.10)', border: '1px solid rgba(140,123,107,0.22)' },
}

function StatusBadge({ badge }) {
  const tone = TONE_STYLES[badge.tone] || TONE_STYLES.muted
  return (
    <span
      style={{
        ...tone,
        display: 'inline-flex', alignItems: 'center', gap: 3,
        padding: '2px 6px', borderRadius: 3,
        fontSize: 7.5, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600,
      }}
    >
      {badge.status === 'coming_soon' && <Lock size={7} strokeWidth={2.4} />}
      {badge.label}
    </span>
  )
}

function TemplateThumbnail({ tpl, selected, locked }) {
  const Art = THUMBS[tpl.id]

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3 / 4', background: tpl.preview?.background || '#FDFBF7' }}>
      {Art ? <Art /> : null}

      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center shadow-[0_2px_8px_rgba(197,160,89,0.5)] z-10">
          <Check size={11} strokeWidth={3} className="text-white" />
        </span>
      )}

      {locked && (
        <span
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center z-10"
          style={{ background: 'rgba(20,18,14,0.55)', backdropFilter: 'blur(3px)' }}
        >
          <Lock size={9} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.85)' }} />
        </span>
      )}
    </div>
  )
}

export default function TemplateSelect({ value, onChange, lang = 'az' }) {
  const ui = UI[lang] || UI.az
  const templates = listTemplates()

  /* Thumbnail-lar 8 fərqli şrift ailəsi işlədir — yalnız bu blok
     görünəndə yüklənir, landing-in ilk yüklənməsinə təsir etmir. */
  useEffect(() => { ensureTemplateFonts() }, [])

  return (
    /* id — önbaxışdan qayıdanda scroll hədəfi (App.goToBuilder) */
    <div id="template-select">
      <div className="mb-4">
        <p className="text-[10px] tracking-[0.22em] uppercase text-brown-muted/70 font-sans font-medium mb-1.5">
          {ui.title}
        </p>
        <p className="text-[11.5px] text-brown-muted/55 font-sans font-light leading-relaxed">
          {ui.hint}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label={ui.title}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3"
      >
        {templates.map((tpl) => {
          const selected  = value === tpl.id
          /* Seçilə bilmə YALNIZ statusdan gəlir — hardcode yoxdur */
          const available = isTemplateSelectable(tpl.id)
          const badge     = getStatusMeta(tpl.status, lang)

          const handleSelect = () => {
            if (!available) return
            onChange?.(tpl.id)
            trackTemplateSelected(tpl.id, { source: 'builder' })
          }

          /* ⚠ Phase 27.1: önbaxış EYNİ tabda açılır (əvvəl `window.open(_blank)`
             idi → yeni tab təmiz mount olurdu və qayıdanda paket seçimi
             yenidən soruşulurdu). Qayıdış konteksti sessionStorage-a yazılır;
             `App.goToBuilder` onu oxuyub builder-i paket seçmədən bərpa edir. */
          const handlePreview = (e) => {
            e.stopPropagation()
            trackTemplatePreviewed(tpl.id, { source: 'builder' })
            try {
              sessionStorage.setItem('digitoy_preview_return', JSON.stringify({
                origin: 'builder',
                pkg: localStorage.getItem('selected_package') || null,
                templateId: tpl.id,
                scrollY: Math.round(window.scrollY),
              }))
            } catch { /* private mode — sadəcə paket bərpası olmayacaq */ }
            window.dispatchEvent(new CustomEvent('digitoy:preview', { detail: { id: tpl.id } }))
          }

          return (
            <div
              key={tpl.id}
              className={`group relative border transition-all duration-250 ${
                selected
                  ? 'border-gold shadow-[0_8px_28px_rgba(197,160,89,0.18)]'
                  : available
                    ? 'border-beige-dark/55 hover:border-gold/45 hover:shadow-[0_4px_18px_rgba(197,160,89,0.1)]'
                    : 'border-beige-dark/40'
              }`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                aria-disabled={!available}
                disabled={!available}
                title={available ? tpl.description : `${tpl.name} — ${badge.label}`}
                onClick={handleSelect}
                className={`block w-full text-left touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 ${
                  available ? '' : 'cursor-not-allowed'
                }`}
              >
                {/* Thumbnail rəngləri həmişə həqiqi qalır — kilid vəziyyəti
                    opacity ilə deyil, künc nişanı ilə bildirilir. */}
                <TemplateThumbnail tpl={tpl} selected={selected} locked={!available} />

                {/* Başlıq zolağı — bütün mətnlər metadata-dan */}
                <div className="px-2.5 pt-2.5 bg-cream border-t border-beige-dark/35">
                  <p className={`font-serif text-[13px] leading-tight truncate ${selected ? 'text-gold' : 'text-ink/80'}`}>
                    {tpl.name}
                  </p>
                  <p className="mt-0.5 text-[8.5px] text-brown-muted/45 font-sans truncate">
                    {tpl.shortDescription?.[lang] || tpl.shortDescription?.az || tpl.tagline}
                  </p>

                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    {/* ⚠ Phase 27.1: "Premium" nişanı tamamilə silindi —
                        müştəriyə yalnız status göstərilir (Canlı/Beta/Tezliklə). */}
                    <StatusBadge badge={badge} />
                    {selected && (
                      <span className="text-[7.5px] tracking-[0.16em] uppercase font-sans font-semibold text-gold">
                        · {ui.selected}
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Önbaxış — metadata-dakı mövcud /demo/template/:id route-u */}
              <div className="px-2.5 pb-2.5 pt-1.5 bg-cream">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="w-full flex items-center justify-center gap-1 min-h-[38px] border border-beige-dark/50 hover:border-gold/50 hover:text-gold text-brown-muted/70 transition-colors duration-200 text-[8.5px] tracking-[0.18em] uppercase font-sans font-medium touch-manipulation"
                  title={`${tpl.name} — ${ui.preview}`}
                >
                  <Eye size={9} strokeWidth={1.8} />
                  {ui.preview}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
