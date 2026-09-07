import { useState, useEffect } from 'react'
import { RefreshCw, ShieldCheck, ShieldAlert, HardDrive, Trash2, Database, ScrollText } from 'lucide-react'
import { getMaintenanceStatus, cleanupDrafts, reindexMedia, getAdminAudit } from '../../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   BAXIM — Phase 37/39.

   Dörd şey göstərir və iki əməliyyat icra edir. Tamamilə additivdir:
   mövcud bölmələrin heç biri bundan asılı deyil.

   ⚠ BACKUP SİSTEMİ QURULMUR. Panel yalnız serverdə arxiv faylı olub-olmadığını
   OXUYUR. Heç nə tapılmasa dürüst «məlum deyil» yazılır — «backup var»
   iddiası edilmir, çünki yanlış təhlükəsizlik hissi backup-ın olmamasından
   da pisdir.

   ⚠ DRAFT TƏMİZLƏMƏ yalnız `status='draft'` və vaxtı keçmiş sətirləri silir.
   Sifariş (submitted / approved / rejected) HEÇ VAXT silinmir.
   ───────────────────────────────────────────────────────────────────────── */

const C = {
  ink:    'oklch(20% 0.02 60)',
  text:   'oklch(25% 0.02 60)',
  sub:    'oklch(55% 0.03 60)',
  faint:  'oklch(60% 0.03 60)',
  line:   'oklch(88% 0.02 60)',
  hair:   'oklch(93% 0.01 75)',
  head:   'oklch(95% 0.01 75)',
  gold:   'oklch(45% 0.07 75)',
  ok:     'oklch(45% 0.11 150)',
  warn:   'oklch(52% 0.13 75)',
  danger: 'oklch(48% 0.15 25)',
}

function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(String(iso).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return String(iso)
  return d.toLocaleString('az-AZ', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const card = {
  border: `1px solid ${C.line}`, borderRadius: 10, background: '#fff',
  padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10,
}
const btn = (tone = 'gold') => ({
  display: 'inline-flex', alignItems: 'center', gap: 7,
  padding: '9px 15px', borderRadius: 7, cursor: 'pointer',
  border: `1px solid ${tone === 'danger' ? C.danger : C.line}`,
  background: tone === 'danger' ? C.danger : '#fff',
  color: tone === 'danger' ? '#fff' : C.text,
  fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
})

function Stat({ label, value, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <span style={{ fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase', color: C.faint, fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 19, fontWeight: 700, color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {hint && <span style={{ fontSize: 12, color: C.sub }}>{hint}</span>}
    </div>
  )
}

export default function AdminMaintenance() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [busy,    setBusy]    = useState('')      /* 'drafts' | 'media' */
  const [result,  setResult]  = useState('')
  const [audit,   setAudit]   = useState(null)

  const load = () => {
    setLoading(true); setError('')
    getMaintenanceStatus()
      .then(setData)
      .catch(() => setError('Baxım məlumatı yüklənmədi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const runCleanup = async () => {
    setBusy('drafts'); setResult('')
    try {
      const r = await cleanupDrafts()
      setResult(r.message || `${r.deleted} draft silindi.`)
      load()
    } catch (e) {
      setResult(e?.message || 'Təmizləmə alınmadı.')
    } finally { setBusy('') }
  }

  const runReindex = async () => {
    setBusy('media'); setResult('')
    try {
      const r = await reindexMedia()
      setResult(r.message || `${r.indexed} media indeksləndi.`)
      load()
    } catch (e) {
      setResult(e?.message || 'İndeks qurulmadı.')
    } finally { setBusy('') }
  }

  const loadAudit = async () => {
    try {
      const r = await getAdminAudit(50)
      setAudit(r.entries || [])
    } catch { setAudit([]) }
  }

  if (loading) {
    return <div style={{ padding: 40, color: C.sub, fontSize: 14 }}>Yüklənir…</div>
  }
  if (error) {
    return (
      <div style={{ padding: 30 }}>
        <p style={{ color: C.danger, fontSize: 14, marginBottom: 12 }}>{error}</p>
        <button type="button" style={btn()} onClick={load}><RefreshCw size={14} /> Yenidən cəhd et</button>
      </div>
    )
  }

  const b  = data?.backup || {}
  const dr = data?.drafts || {}
  const md = data?.media  || {}

  const backupTone = b.status === 'ok' ? C.ok : b.status === 'stale' ? C.warn : C.danger
  const BackupIcon = b.status === 'ok' ? ShieldCheck : ShieldAlert

  return (
    <div style={{ padding: '4px 0 40px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
        <h2 style={{ margin: 0, fontSize: 21, fontWeight: 700, color: C.ink }}>Baxım</h2>
        <span style={{ fontSize: 12, color: C.sub }}>sxem v{data?.schema_version ?? '—'}</span>
        <button type="button" style={{ ...btn(), marginLeft: 'auto' }} onClick={load}>
          <RefreshCw size={14} /> Yenilə
        </button>
      </div>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: C.sub, maxWidth: '68ch' }}>
        Sistemin sağlamlıq göstəriciləri və təhlükəsiz təmizləmə əməliyyatları.
      </p>

      {result && (
        <div style={{
          border: `1px solid ${C.line}`, background: C.head, borderRadius: 8,
          padding: '11px 15px', marginBottom: 18, fontSize: 13.5, color: C.text,
        }}>{result}</div>
      )}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

        {/* ── BACKUP ── */}
        <div style={{ ...card, borderLeft: `4px solid ${backupTone}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <BackupIcon size={17} color={backupTone} />
            <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: C.ink }}>Backup vəziyyəti</h3>
            <span style={{
              marginLeft: 'auto', fontSize: 10, fontWeight: 700, letterSpacing: '.08em',
              textTransform: 'uppercase', color: backupTone,
              border: `1px solid ${backupTone}`, borderRadius: 4, padding: '2px 7px',
            }}>
              {b.status === 'ok' ? 'Var' : b.status === 'stale' ? 'Köhnəlmiş' : 'Məlum deyil'}
            </span>
          </div>
          <Stat label="Son backup" value={b.last_at ? formatDateTime(b.last_at) : 'Məlum deyil'}
                hint={b.age_hours != null ? `${b.age_hours} saat əvvəl · ${b.files} fayl` : null} />
          <p style={{ margin: 0, fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>{b.message}</p>
          {b.status === 'unknown' && (
            <p style={{ margin: 0, fontSize: 12, color: C.danger, lineHeight: 1.5 }}>
              Media və baza üçün avtomatik arxiv qurulmayıbsa, disk nasazlığında
              bütün toy şəkilləri itər. Bu panel yalnız xəbərdarlıq edir — arxivi
              hostinq tərəfdən qurmaq lazımdır.
            </p>
          )}
        </div>

        {/* ── DRAFT TƏMİZLƏMƏ ── */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Trash2 size={17} color={C.gold} />
            <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: C.ink }}>Draft təmizləmə</h3>
          </div>
          <div style={{ display: 'flex', gap: 26 }}>
            <Stat label="Vaxtı keçmiş" value={dr.expired ?? 0} />
            <Stat label="Cəmi draft" value={dr.total ?? 0} />
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>
            Builder-i yarımçıq qoyan ziyarətçilərin qeydləri. Yalnız vaxtı keçmiş
            <b> qaralamalar</b> silinir — sifarişlərə (göndərilmiş, təsdiqlənmiş,
            rədd edilmiş) toxunulmur.
          </p>
          <div>
            <button type="button" style={btn(dr.expired > 0 ? 'danger' : 'gold')}
                    onClick={runCleanup} disabled={busy === 'drafts' || !dr.expired}>
              <Trash2 size={14} />
              {busy === 'drafts' ? 'Silinir…' : dr.expired > 0 ? `${dr.expired} draft-ı sil` : 'Təmizlənəcək draft yoxdur'}
            </button>
          </div>
        </div>

        {/* ── MEDIA İNDEKSİ ── */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Database size={17} color={C.gold} />
            <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: C.ink }}>Media indeksi</h3>
            <span style={{
              marginLeft: 'auto', fontSize: 10, fontWeight: 700, letterSpacing: '.08em',
              textTransform: 'uppercase', color: md.indexed ? C.ok : C.warn,
              border: `1px solid ${md.indexed ? C.ok : C.warn}`, borderRadius: 4, padding: '2px 7px',
            }}>{md.indexed ? 'Qurulub' : 'Qurulmayıb'}</span>
          </div>
          <div style={{ display: 'flex', gap: 26 }}>
            <Stat label="İndekslənmiş" value={md.indexed_rows ?? 0} />
            <Stat label="Albom" value={md.uploads?.albums ?? 0} />
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>
            {md.indexed
              ? 'Dashboard foto sayğacı bazadan oxunur — fayl sistemi gəzilmir.'
              : 'Sayğac hazırda BÜTÜN uploads ağacını gəzir. İndeksi bir dəfə qurun — panel sürətlənəcək, rəqəm dəyişməyəcək.'}
          </p>
          <div>
            <button type="button" style={btn()} onClick={runReindex} disabled={busy === 'media'}>
              <HardDrive size={14} />
              {busy === 'media' ? 'İndekslənir…' : md.indexed ? 'İndeksi yenilə' : 'Media indeksini qur'}
            </button>
          </div>
          {md.indexed_at && (
            <span style={{ fontSize: 11.5, color: C.faint }}>Son indeks: {formatDateTime(md.indexed_at)}</span>
          )}
        </div>

        {/* ── AUDİT JURNALI ── */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <ScrollText size={17} color={C.gold} />
            <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: C.ink }}>Admin əməliyyatları</h3>
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: C.sub, lineHeight: 1.5 }}>
            Dağıdıcı əməliyyatların izi: link aktiv/deaktiv, mesaj silmə,
            sifariş təsdiqi və rəddi, foto silmə.
          </p>
          {audit === null ? (
            <div>
              <button type="button" style={btn()} onClick={loadAudit}>
                <ScrollText size={14} /> Jurnalı göstər
              </button>
            </div>
          ) : audit.length === 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: C.faint }}>Hələ qeyd yoxdur.</p>
          ) : (
            <div style={{ maxHeight: 260, overflowY: 'auto', border: `1px solid ${C.hair}`, borderRadius: 7 }}>
              {audit.map((e) => (
                <div key={e.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: '2px 12px',
                  padding: '8px 11px', borderBottom: `1px solid ${C.hair}`, fontSize: 12.5,
                }}>
                  <span style={{ color: C.ink, fontWeight: 600 }}>{e.action}</span>
                  <span style={{ color: C.faint, whiteSpace: 'nowrap' }}>{formatDateTime(e.created_at)}</span>
                  <span style={{ color: C.sub, wordBreak: 'break-all' }}>
                    {e.slug || '—'}{e.detail ? ` · ${e.detail}` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
