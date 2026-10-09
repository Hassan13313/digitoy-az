import { useState, useEffect } from 'react'
import { getMaintenanceStatus, cleanupDrafts, reindexMedia, getAdminAudit, runRetention } from '../../utils/api'
import MaintenancePage from './v2/MaintenancePage'
import { Button, Notice } from './v2/adminUi'
import { azDate } from './adminFormat'

/* ─────────────────────────────────────────────────────────────────────────────
   BAXIM — Phase 37/39/47 (UI redesign 2026-10: görünüş v2/MaintenancePage)

   ⚠ BACKUP SİSTEMİ QURULMUR. Panel yalnız serverdə arxiv faylı olub-olmadığını
   OXUYUR. Heç nə tapılmasa dürüst «məlum deyil» yazılır.
   ⚠ DRAFT TƏMİZLƏMƏ yalnız `status='draft'`, N gün toxunulmamış sətirləri
   və onların öz fayllarını silir. Sifariş HEÇ VAXT silinmir.
   ⚠ MƏLUMAT SAXLAMA: retention.php gündə bir dəfə özü işləyir. Əl ilə
   işlətmək üçün əvvəl önizləmə (dry run) lazımdır, sonra təsdiq.
   ───────────────────────────────────────────────────────────────────────── */

const formatDateTime = (iso) => azDate(iso, { time: true })
const n = (v) => (typeof v === 'number' ? v : v === 'error' ? 'xəta' : 0)

/** retention.php nəticəsi → kart sətirləri */
function retentionItems(r) {
  if (!r) return []
  return [
    { label: 'Audit jurnalında köhnə IP', count: n(r.audit_ip) },
    { label: 'Qalereya statistikasında IP izi', count: n(r.gallery_ip) },
    { label: 'Müvəqqəti fayl', count: n(r.temp_files) },
    { label: 'Köhnə log', count: n(r.media_logs) },
    { label: 'Tərk edilmiş draft', count: n(r.drafts?.drafts) },
    { label: 'Draftların faylları', count: n(r.drafts?.files) },
    ...(r.orphans?.buckets ? [{ label: `Sahibsiz qovluq (${r.orphans.mb} MB) — yalnız hesabat, silinmir`, count: r.orphans.buckets }] : []),
  ]
}
const retentionSummary = (r) => retentionItems(r)
  .filter(i => !String(i.label).startsWith('Sahibsiz'))
  .map(i => `${i.label}: ${i.count}`).join('; ')

export default function AdminMaintenance() {
  const [data,     setData]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [drafts,   setDrafts]   = useState({ state: 'idle' })
  const [media,    setMedia]    = useState({ state: 'idle' })
  const [ret,      setRet]      = useState({ state: 'idle' })    /* state, preview, resultText, errorText */
  const [audit,    setAudit]    = useState({ state: 'idle' })

  const load = () => {
    setLoading(true); setError('')
    getMaintenanceStatus()
      .then(setData)
      .catch(() => setError('Baxım məlumatı yüklənmədi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const runCleanup = async () => {
    setDrafts({ state: 'running' })
    try {
      const r = await cleanupDrafts()
      setDrafts({ state: 'done', resultText: r.message || `${r.deleted} draft silindi.` })
      load()
    } catch (e) {
      setDrafts({ state: 'error', resultText: e?.message || 'Təmizləmə alınmadı.' })
    }
  }

  const runReindex = async () => {
    setMedia({ state: 'running' })
    try {
      const r = await reindexMedia()
      setMedia({ state: 'done', resultText: r.message || `${r.indexed} media indeksləndi.` })
      load()
    } catch (e) {
      setMedia({ state: 'error', resultText: e?.message || 'İndeks qurulmadı.' })
    }
  }

  const runRetentionStep = async (dry) => {
    setRet(s => ({ ...s, state: 'running', errorText: undefined, resultText: dry ? undefined : s.resultText }))
    try {
      const r = await runRetention(dry)
      if (dry) setRet({ state: 'done', preview: r.result })
      else { setRet({ state: 'idle', resultText: 'Təmizləmə tamamlandı — ' + retentionSummary(r.result) + '.' }); load() }
    } catch (e) {
      setRet({ state: 'error', errorText: e?.message || 'Təmizləmə alınmadı.' })
    }
  }

  const loadAudit = async () => {
    setAudit({ state: 'running' })
    try {
      const r = await getAdminAudit(50)
      setAudit({
        state: 'done',
        rows: (r.entries || []).map(e => ({
          id: String(e.id),
          date: formatDateTime(e.created_at),
          action: e.action,
          object: `${e.slug || '—'}${e.detail ? ` · ${e.detail}` : ''}`,
          ip: e.ip || '—',
        })),
      })
    } catch (e) {
      setAudit({ state: 'error', errorText: e?.message || 'Jurnalı yükləmək alınmadı.' })
    }
  }

  if (error && !data) {
    return (
      <Notice
        tone="danger"
        title={error}
        action={<Button size="sm" onClick={load}>Yenidən cəhd et</Button>}
      />
    )
  }

  const b  = data?.backup || {}
  const dr = data?.drafts || {}
  const md = data?.media  || {}
  const rt = data?.retention || {}
  const rp = rt.periods || {}

  const backupLast = b.last_at
    ? [formatDateTime(b.last_at), b.newest_file, b.size ? `${(b.size / 1048576).toFixed(0)} MB` : null, b.files ? `${b.files} fayl` : null]
      .filter(Boolean).join(' · ')
    : 'Məlum deyil'

  return (
    <>
      {error && data && <Notice tone="danger" title={error} className="mb-4" />}
      <MaintenancePage
        schemaVersion={data?.schema_version != null ? `v${data.schema_version}` : undefined}
        onRefresh={load}
        refreshing={loading && !!data}
        loading={loading && !data}
        backup={{ status: b.status === 'ok' ? 'ok' : b.status === 'stale' ? 'stale' : 'unknown', last: backupLast }}
        drafts={{ expired: dr.expired ?? 0, total: dr.total ?? 0, ...drafts }}
        onCleanupDrafts={runCleanup}
        retention={{
          lastRun: rt.last?.at ? formatDateTime(rt.last.at) : 'Hələ işləməyib',
          state: ret.state,
          items: ret.preview ? retentionItems(ret.preview) : undefined,
          errorText: ret.errorText,
          resultText: ret.resultText,
        }}
        onRetentionPreview={() => runRetentionStep(true)}
        onRetentionRun={() => runRetentionStep(false)}
        media={{
          indexed: md.indexed_rows ?? 0,
          albums: md.uploads?.albums ?? 0,
          built: !!md.indexed,
          state: media.state,
          resultText: media.resultText ?? (md.indexed_at ? `Son indeks: ${formatDateTime(md.indexed_at)}` : undefined),
        }}
        onReindex={runReindex}
        audit={audit}
        onShowAudit={loadAudit}
        texts={{
          ...(b.status !== 'ok' && b.message ? { backup: b.message } : {}),
          ...(b.status === 'ok' ? { backupHelp: 'Backup eyni serverdədir — disk nasazlığından qorumaq üçün DirectAdmin › Create/Restore Backups bölməsindən kompüterə də endirin.' } : {}),
          ...(rp.draft_days ? { drafts: `Builder-i yarımçıq qoyan ziyarətçilərin qeydləri. Yalnız ${rp.draft_days} gün toxunulmamış qaralamalar və onların öz şəkil/musiqi faylları silinir — sifarişlərə (göndərilmiş, təsdiqlənmiş, rədd edilmiş) toxunulmur.` } : {}),
          ...(rp.audit_ip_days ? { retention: `Gündə bir dəfə özü işləyir: audit IP-ləri ${rp.audit_ip_days} gün, qalereya IP izləri ${rp.gallery_ip_days} gün, loglar ${rp.media_log_days} gün, tərk edilmiş draft-lar ${rp.draft_days} gün saxlanılır. Məxfilik siyasətindəki müddətlərlə eynidir.` } : {}),
          media: md.indexed
            ? 'Dashboard foto sayğacı bazadan oxunur — fayl sistemi gəzilmir.'
            : 'Sayğac hazırda BÜTÜN uploads ağacını gəzir. İndeksi bir dəfə qurun — panel sürətlənəcək, rəqəm dəyişməyəcək.',
        }}
      />
    </>
  )
}
