import { EyeOff, Eye, RotateCcw } from 'lucide-react'
import { storyPhotoSrc } from '../../../utils/api'
import { templatePhotoSlots } from '../../../templates/templatePhotos'
import { Card, ImageUpload } from './ui'
import { C } from './style'

/* ─────────────────────────────────────────────────────────────────────────────
   «Şəkillər» tabı (2026-11) — foto ilə qurulmuş şablonların şəkil yerləri

   Hər yer (`<şablon>/photos.js › PHOTOS`) üçün: gizlət / göstər, öz şəklini yüklə,
   orijinal fotoya qaytar. Model: `admin.images = { açar: {hide:true} | {src} | {hide:false} }`.
   Dəvətnamə rejimində `inherited` — şablon səviyyəsində («Şablonlar») edilmiş seçim;
   dəvətnamənin öz seçimi onun üstündədir, `{hide:false}` isə orijinal fotonu qaytarır.
   ───────────────────────────────────────────────────────────────────────── */

/* Önbaxışda sürüşdürüləcək bölmə (foto blokları bir neçə dənədir — onlarda sürüşmə yoxdur) */
const FOCUS = { hero: 'hero', invite: 'invite', finale: 'finale', rsvpDone: 'rsvp', rsvp: 'rsvp', program: 'program' }

function Preview({ src, hidden, narrow }) {
  const w = narrow ? 84 : 72
  const box = { width: w, height: Math.round(w * 4 / 3), flex: '0 0 auto', borderRadius: 6, overflow: 'hidden', border: `1px solid ${C.line}`, background: C.hair }
  if (hidden || !src) {
    return (
      <div style={{ ...box, display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', color: C.faint }}>
        <EyeOff size={18} strokeWidth={1.6} aria-label="Gizlədilib" />
      </div>
    )
  }
  return <div style={box}><img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
}

function SmallButton({ onClick, icon: Icon, children, narrow, tone = 'ink' }) {
  return (
    <button
      type="button" onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, padding: narrow ? '10px 12px' : '6px 10px', minHeight: narrow ? 42 : 30,
        border: `1px solid ${C.line}`, borderRadius: 6, background: 'white', color: tone === 'danger' ? C.danger : C.ink,
        fontSize: narrow ? 13 : 11.5, cursor: 'pointer', fontFamily: 'inherit',
      }}
    >
      <Icon size={14} strokeWidth={1.7} aria-hidden="true" />{children}
    </button>
  )
}

export default function PhotosEditor({ templateId, images, setImages, inherited = null, slug, narrow, templateMode = false, onFocusPreview }) {
  const slots = templatePhotoSlots(templateId)
  if (!slots.length) return null

  const put = (key, val) => {
    setImages((prev) => {
      const next = { ...prev }
      if (val) next[key] = val
      else delete next[key]
      return next
    })
    if (FOCUS[key]) onFocusPreview?.(FOCUS[key])
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <p style={{ margin: 0, fontSize: 12, color: C.sub, lineHeight: 1.6 }}>
        Hər şəkli gizlədə və ya öz şəklinizlə əvəz edə bilərsiniz. Şaquli (telefon ekranı kimi) foto daha yaxşı oturur.
        Açılış şəkilləri önbaxışda «Açılış» tabında görünür.
        {/* Şablon rejimində bunu yuxarıdakı xəbərdarlıq onsuz da deyir */}
        {!templateMode && ' Bu seçim yalnız bu dəvətnaməyə aiddir.'}
      </p>
      {slots.map((p) => {
        const own = images?.[p.key] || null
        const base = templateMode ? null : (inherited?.[p.key] || null)
        const eff = own || base
        const hidden = !!eff?.hide
        const custom = !hidden && eff?.src ? eff.src : null
        const shown = hidden ? null : (custom ? storyPhotoSrc(custom) : p.src)
        const state = hidden ? 'Gizlədilib' : custom ? 'Öz şəkliniz' : 'Şablonun fotosu'
        const fromTemplate = !own && !!base
        /* Orijinal fotoya qaytar: şablon səviyyəsində dəyişiklik varsa açıq «orijinal» lazımdır */
        const original = () => put(p.key, base ? { hide: false } : null)
        return (
          <Card key={p.key} title={p.label} hint={p.hint}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Preview src={shown} hidden={hidden} narrow={narrow} />
              <div style={{ display: 'grid', gap: 8, minWidth: 0 }}>
                <div style={{ fontSize: narrow ? 13 : 11.5, color: hidden ? C.danger : C.sub }}>
                  {state}{fromTemplate ? ' · şablon səviyyəsində' : ''}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {hidden
                    ? <SmallButton icon={Eye} narrow={narrow} onClick={original}>Göstər</SmallButton>
                    : <SmallButton icon={EyeOff} narrow={narrow} tone="danger" onClick={() => put(p.key, { hide: true })}>Gizlət</SmallButton>}
                  <ImageUpload
                    slug={slug} narrow={narrow}
                    label={custom ? 'Başqa şəkil' : 'Öz şəklini yüklə'}
                    onUploaded={(url) => put(p.key, { src: url })}
                  />
                  {custom && <SmallButton icon={RotateCcw} narrow={narrow} onClick={original}>Orijinal foto</SmallButton>}
                  {own && base && (
                    <SmallButton icon={RotateCcw} narrow={narrow} onClick={() => put(p.key, null)}>Şablondakı kimi</SmallButton>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
