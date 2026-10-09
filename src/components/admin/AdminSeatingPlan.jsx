import { useState, useEffect, useCallback, useMemo } from 'react'
import { Upload } from 'lucide-react'
import { getGuests, manageGuest, migrateGuests } from '../../utils/api'
import GuestImportModal from './GuestImportModal'
import SeatingPlanTab from './v2/SeatingPlanTab'
import { Button, Notice } from './v2/adminUi'

/* ─────────────────────────────────────────────────────────────────────────────
   Oturma planı — qonaq idarəetməsi (UI redesign 2026-10: v2/SeatingPlanTab)

   Məntiq dəyişməyib: get_guests.php, manage_guest.php (add | update | delete |
   move), migrate_guests.php («Mövcud planı import et» — builder-dəki oturma
   planı MƏTNİNİ köçürür), Excel/CSV idxalı (GuestImportModal). Yeni masa
   serverə yazılmır — ilk qonaq əlavə olunanda yaranır (köhnə davranış).
   ───────────────────────────────────────────────────────────────────────── */

const VIEW_STATUS = { GOING: 'yes', NOT_GOING: 'no', MAYBE: 'maybe', NO_RESPONSE: 'none' }

export default function AdminSeatingPlan({ slug, seatingPlan }) {
  const [data,       setData]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [saving,     setSaving]     = useState(false)
  const [opError,    setOpError]    = useState('')
  const [migrating,  setMigrating]  = useState(false)
  const [migrateMsg, setMigrateMsg] = useState('')
  /* Phase 43 — Excel/CSV idxal modalı */
  const [importOpen, setImportOpen] = useState(false)

  const load = useCallback(() => {
    if (!slug) return
    setLoading(true)
    setError('')
    getGuests(slug)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Qonaqlar yüklənmədi.'); setLoading(false) })
  }, [slug])

  useEffect(() => { load() }, [load])

  const handleMigrate = async () => {
    setMigrating(true)
    setMigrateMsg('')
    try {
      const res = await migrateGuests(slug)
      setMigrateMsg(`${res.total_added} qonaq əlavə edildi, ${res.total_skipped} artıq mövcud idi.`)
      load()
    } catch {
      setMigrateMsg('Köçürmə xətası.')
    } finally {
      setMigrating(false)
    }
  }

  /* Boş masa yalnız lokal göstərilir — istifadəçi sonra qonaq əlavə edəcək */
  const handleAddTable = (name) => {
    setData(prev => ({
      ...prev,
      tables: [...(prev?.tables ?? []), { table_id: name, total: 0, going: 0, not_going: 0, maybe: 0, no_response: 0, responded: 0 }],
      guests: prev?.guests ?? [],
    }))
  }

  /* Qonaq əməliyyatları: xəta olsa pəncərə açıq qalır (Promise rədd olunur) */
  const op = async (fn) => {
    setSaving(true)
    setOpError('')
    try {
      await fn()
      load()
    } catch (e) {
      setOpError(e?.message || 'Əməliyyat alınmadı.')
      throw e
    } finally {
      setSaving(false)
    }
  }

  const guests = useMemo(() => data?.guests ?? [], [data])
  const tables = useMemo(() => {
    /* Masa siyahısı (API + lokal əlavə) */
    const ids = [...new Set([
      ...guests.map(g => g.table_id),
      ...(data?.tables?.map(t => t.table_id) ?? []),
    ])].sort()
    return ids.map(tid => ({
      id: tid,
      name: tid,
      guests: guests.filter(g => g.table_id === tid).map(g => ({
        id: String(g.id),
        name: g.full_name,
        status: VIEW_STATUS[g.status] || 'none',
        plus: Number(g.extra_guests) || 0,
        /* Phase 43 — Excel idxalından gələn telefon (sütun yoxdursa null) */
        phone: g.phone || '',
        note: g.notes || '',
      })),
    }))
  }, [guests, data])

  if (!slug) return null

  const s = data?.stats || {}
  const hasMigratableData = !!(seatingPlan && seatingPlan.trim() && guests.length === 0)

  return (
    <>
      {error && <Notice tone="danger" title={error} className="mb-4" />}
      {opError && <Notice tone="danger" title={opError} className="mb-4" />}
      {hasMigratableData && !loading && (
        <Notice
          tone="info"
          title="Builder-də yazılmış oturma planı var"
          className="mb-4"
          action={
            <Button size="sm" icon={Upload} loading={migrating} onClick={handleMigrate}>
              Mövcud planı import et
            </Button>
          }
        >
          Müştərinin sifarişdə yazdığı masa və qonaqları bu siyahıya köçürə bilərsiniz.
        </Notice>
      )}
      {migrateMsg && <Notice tone="success" title={migrateMsg} className="mb-4" />}

      <SeatingPlanTab
        tables={tables}
        stats={{
          total: s.total ?? 0, yes: s.going ?? 0, no: s.not_going ?? 0, maybe: s.maybe ?? 0,
          none: s.no_response ?? 0, rate: s.response_rate ?? 0,
        }}
        onAddTable={handleAddTable}
        onAddGuest={(tableId, d) => op(() => manageGuest('add', {
          invitation_id: slug, full_name: d.name, table_id: tableId, notes: d.note || null,
        }))}
        onUpdateGuest={(id, d) => op(() => manageGuest('update', {
          id: Number(id), full_name: d.name, table_id: d.tableId, notes: d.note || null,
        }))}
        onMoveGuest={(id, to) => op(() => manageGuest('move', { id: Number(id), table_id: to }))}
        onDeleteGuest={(id) => op(() => manageGuest('delete', { id: Number(id) }))}
        saving={saving}
        onOpenImport={() => setImportOpen(true)}
        onRefresh={load}
        refreshing={loading && !!data}
        loading={loading && !data}
      />

      {/* Phase 43 — Excel/CSV idxal modalı */}
      {importOpen && (
        <GuestImportModal
          slug={slug}
          onClose={() => setImportOpen(false)}
          onImported={load}
        />
      )}
    </>
  )
}
