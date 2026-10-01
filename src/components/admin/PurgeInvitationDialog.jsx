import { useEffect, useState } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import { adminPurge } from '../../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   Phase 46 — dəvətnaməni BİRDƏFƏLİK silmə pəncərəsi.

   İkiqat təsdiq:
     1. Açılan kimi server «preview» qaytarır — nəyin silinəcəyi saylarla
        göstərilir (heç nə silinmir).
     2. «Birdəfəlik sil» yalnız dəvətnamənin kodu (slug) hərfbəhərf
        yazılandan sonra aktivləşir; server də eyni yoxlamanı edir.
   Uğursuz olsa siyahıdan heç nə çıxarılmır — xəta göstərilir.
   ───────────────────────────────────────────────────────────────────────── */

const red = 'oklch(48% 0.16 25)'

export default function PurgeInvitationDialog({ slug, names, onClose, onDone }) {
  const [info, setInfo]   = useState(null)
  const [error, setError] = useState('')
  const [typed, setTyped] = useState('')
  const [busy, setBusy]   = useState(false)

  useEffect(() => {
    adminPurge({ action: 'preview', slug })
      .then(setInfo)
      .catch(e => setError(e?.message || 'Məlumat yüklənmədi.'))
  }, [slug])

  const purge = async () => {
    setBusy(true)
    setError('')
    try {
      const res = await adminPurge({ action: 'invitation', slug, confirm: typed.trim() })
      onDone(slug, res)
    } catch (e) {
      setError(e?.message || 'Silinmədi.')
      setBusy(false)
    }
  }

  const ready = info && typed.trim() === slug && !busy
  const rows = info ? [
    ['Qonaq siyahısı', `${info.guests} nəfər`],
    ['RSVP / təbriklər', `${info.responses}`],
    ['Foto / video (qalereya)', `${info.photos}`],
    ['Serverdəki fayllar', `${info.files} fayl · ${info.mb} MB`],
    ['Bağlı sifariş', info.orders?.length ? info.orders.join(', ') : '—'],
  ] : []

  return (
    <div role="dialog" aria-modal="true" aria-label="Dəvətnaməni birdəfəlik sil"
      onClick={e => { if (e.target === e.currentTarget && !busy) onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'oklch(20% 0.02 60 / 0.45)', display: 'grid', placeItems: 'center', padding: 14 }}>
      <div style={{ width: 'min(460px, 100%)', background: 'white', borderRadius: 10, boxShadow: '0 18px 50px oklch(20% 0.02 60 / 0.25)', padding: '20px 20px 18px', fontFamily: 'inherit' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <AlertTriangle size={18} color={red} />
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'oklch(25% 0.02 60)' }}>Birdəfəlik silinsin?</h3>
          <button type="button" aria-label="Bağla" disabled={busy} onClick={onClose}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(55% 0.03 60)', display: 'flex', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ margin: '0 0 12px', fontSize: 13, color: 'oklch(40% 0.03 60)', lineHeight: 1.5 }}>
          <b>{names || slug}</b> dəvətnaməsi bütün məlumatları ilə silinəcək. Link işləməyəcək,
          şəkillər və qonaq siyahısı <b style={{ color: red }}>geri qaytarılmayacaq</b>.
        </p>

        <div style={{ border: '1px solid oklch(92% 0.01 75)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, minHeight: 40 }}>
          {!info && !error && <span style={{ fontSize: 12.5, color: 'oklch(55% 0.03 60)' }}>Yoxlanılır…</span>}
          {rows.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '4px 0', fontSize: 12.5 }}>
              <span style={{ color: 'oklch(50% 0.03 60)' }}>{k}</span>
              <span style={{ color: 'oklch(28% 0.02 60)', fontWeight: 600, textAlign: 'right', overflowWrap: 'anywhere' }}>{v}</span>
            </div>
          ))}
        </div>

        <label style={{ display: 'block', fontSize: 12, color: 'oklch(45% 0.03 60)', marginBottom: 6 }}>
          Təsdiq üçün kodu yazın: <code style={{ fontSize: 12, color: red, overflowWrap: 'anywhere' }}>{slug}</code>
        </label>
        <input
          type="text" value={typed} onChange={e => setTyped(e.target.value)} disabled={!info || busy}
          autoComplete="off" spellCheck={false} placeholder={slug}
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 14, border: '1px solid oklch(85% 0.02 60)', borderRadius: 8, outline: 'none', fontFamily: 'monospace' }}
        />

        {error && <p role="alert" style={{ margin: '10px 0 0', fontSize: 12.5, color: red }}>{error}</p>}

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button type="button" onClick={onClose} disabled={busy}
            style={{ flex: 1, minHeight: 42, borderRadius: 8, border: '1px solid oklch(88% 0.02 60)', background: 'white', cursor: 'pointer', fontSize: 13, color: 'oklch(40% 0.03 60)', fontFamily: 'inherit' }}>
            Ləğv et
          </button>
          <button type="button" onClick={purge} disabled={!ready}
            style={{ flex: 1.4, minHeight: 42, borderRadius: 8, border: 'none', background: red, color: 'white', cursor: ready ? 'pointer' : 'not-allowed', opacity: ready ? 1 : 0.4, fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit' }}>
            <Trash2 size={14} /> {busy ? 'Silinir…' : 'Birdəfəlik sil'}
          </button>
        </div>
      </div>
    </div>
  )
}
