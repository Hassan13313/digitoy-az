import { useState, useEffect, useCallback, useMemo } from 'react'
import { Upload } from 'lucide-react'
import { getGuests, manageGuest, migrateGuests } from '../../utils/api'
import GuestImportModal from './GuestImportModal'
import SeatingPlanner from '../seating/SeatingPlanner'
import { Button, Notice } from './v2/adminUi'

/* ─────────────────────────────────────────────────────────────────────────────
   Oturma planı — admin (2026-11-26: seating/SeatingPlanner — qonaq siyahısı,
   masalar, zal planı, qonaq görünüşü; qız/oğlan evi, qruplar).
   Server: get_guests.php, manage_guest.php (add | update | delete | move |
   bulk | layout), migrate_guests.php («Mövcud planı import et» — builder-dəki
   oturma planı MƏTNİNİ köçürür), Excel/CSV idxalı (GuestImportModal).
   ───────────────────────────────────────────────────────────────────────── */

/** Server xətası → istifadəçiyə aydın mətn */
const friendly = (p) => p.catch(() => { throw new Error('Əməliyyat alınmadı. Bağlantını yoxlayıb yenidən cəhd edin.') })

export default function AdminSeatingPlan({ slug, seatingPlan, eventType = '', title = '' }) {
  const [data,       setData]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [migrating,  setMigrating]  = useState(false)
  const [migrateMsg, setMigrateMsg] = useState('')
  /* Phase 43 — Excel/CSV idxal modalı */
  const [importOpen, setImportOpen] = useState(false)

  const load = useCallback(() => {
    if (!slug) return Promise.resolve()
    setLoading(true)
    setError('')
    return getGuests(slug)
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

  const api = useMemo(() => ({
    addGuest: (d) => friendly(manageGuest('add', {
      invitation_id: slug, full_name: d.name, table_id: d.table, notes: d.note || '', side: d.side || '', group_name: d.group || '',
    })),
    updateGuest: (id, d) => friendly(manageGuest('update', {
      id, full_name: d.name, table_id: d.table, notes: d.note || '', side: d.side || '', group_name: d.group || '',
    })),
    deleteGuest: (id) => friendly(manageGuest('delete', { id })),
    bulk: (ids, patch) => friendly(manageGuest('bulk', { invitation_id: slug, ids, patch })),
    saveLayout: (layout, extra) => friendly(manageGuest('layout', { invitation_id: slug, layout, ...extra })),
    /* v53 */
    assign: (pairs) => friendly(manageGuest('assign', { invitation_id: slug, pairs })),
    adopt: (responseId) => friendly(manageGuest('adopt', { invitation_id: slug, response_id: responseId })),
    venueLink: (rotate) => friendly(manageGuest('venue_link', { invitation_id: slug, rotate: !!rotate })).then((r) => r.key),
  }), [slug])

  if (!slug) return null

  const hasMigratableData = !!(seatingPlan && seatingPlan.trim() && !data?.guests?.length)

  return (
    <>
      {error && <Notice tone="danger" title={error} className="mb-4" />}
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

      <SeatingPlanner data={data} loading={loading} eventType={eventType} title={title} slug={slug}
        api={api} onReload={load} onImport={() => setImportOpen(true)} />

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
