import { useEffect, useState } from 'react'
import { adminPurge } from '../../utils/api'
import PurgeView from './v2/PurgeInvitationDialog'

/* ─────────────────────────────────────────────────────────────────────────────
   Phase 46 — dəvətnaməni BİRDƏFƏLİK silmə pəncərəsi
   (UI redesign 2026-10: görünüş v2/PurgeInvitationDialog)

   İkiqat təsdiq:
     1. Açılan kimi server «preview» qaytarır — nəyin silinəcəyi saylarla
        göstərilir (heç nə silinmir).
     2. «Birdəfəlik sil» yalnız dəvətnamənin kodu (slug) yazılandan sonra
        aktivləşir; server də eyni yoxlamanı edir (`confirm`).
   Uğursuz olsa siyahıdan heç nə çıxarılmır — xəta göstərilir.
   ───────────────────────────────────────────────────────────────────────── */

export default function PurgeInvitationDialog({ slug, names, onClose, onDone }) {
  const [info,  setInfo]  = useState(null)
  const [error, setError] = useState(null)   /* { kind: 'preview'|'purge', text } */
  const [busy,  setBusy]  = useState(false)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let alive = true
    adminPurge({ action: 'preview', slug })
      .then(d => { if (alive) { setInfo(d); setError(null) } })
      .catch(e => { if (alive) setError({ kind: 'preview', text: e?.message || 'Məlumat yüklənmədi.' }) })
    return () => { alive = false }
  }, [slug, nonce])

  const purge = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await adminPurge({ action: 'invitation', slug, confirm: slug })
      onDone(slug, res)
    } catch (e) {
      setError({ kind: 'purge', text: e?.message || 'Silinmədi.' })
      setBusy(false)
    }
  }

  const state = busy ? 'deleting' : error ? 'error' : info ? 'ready' : 'counting'

  return (
    <PurgeView
      open
      invitation={{ slug, names: names || slug }}
      summary={info ? {
        guests: info.guests, rsvp: info.responses, media: info.photos,
        files: info.files, size: info.mb != null ? `${info.mb} MB` : undefined,
        order: info.orders?.length ? info.orders.join(', ') : undefined,
      } : {}}
      state={state}
      errorText={error?.text}
      onConfirm={purge}
      onCancel={() => { if (!busy) onClose() }}
      onRetry={error?.kind === 'preview' ? () => { setError(null); setNonce(n => n + 1) } : purge}
    />
  )
}
