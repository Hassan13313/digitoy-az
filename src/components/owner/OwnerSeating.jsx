import { useCallback, useEffect, useMemo, useState } from 'react'
import { History, KeyRound, LockKeyhole, Undo2 } from 'lucide-react'
import SeatingPlanTab from '../admin/v2/SeatingPlanTab'
import { Button, Notice, Panel } from '../admin/v2/adminUi'
import { getGuests } from '../../utils/api'
import { clearSeatToken, getSeatToken, ownerSeating } from '../../utils/ownerApi'

/* ─────────────────────────────────────────────────────────────────────────────
   Müştəri paneli › Oturma planı (2026-11-18)
   Baxmaq üçün link kifayətdir; redaktə üçün DigiToy-un ayrıca göndərdiyi
   6 rəqəmli PİN lazımdır (link ailə qrupunda paylaşılsa belə plan pozulmasın).
   Hər dəyişiklik tarixçəyə yazılır — «Son dəyişikliyi geri qaytar» düyməsi.
   Server: api/owner_seating.php (yalnız VİP / Premium).
   ───────────────────────────────────────────────────────────────────────── */

const ERR = {
  BAD_PIN: 'PİN yanlışdır. DigiToy-un göndərdiyi 6 rəqəmli kodu yoxlayın.',
  NO_PIN: 'Redaktə hələ aktiv edilməyib — PİN üçün DigiToy ilə əlaqə saxlayın.',
  TOO_MANY_ATTEMPTS: 'Çox sayda cəhd edildi. 15 dəqiqə sonra yenidən yoxlayın.',
  EDIT_LOCKED: 'Redaktə vaxtı bitdi — PİN-i yenidən daxil edin.',
  SEATING_NOT_IN_PACKAGE: 'Oturma planının redaktəsi bu paketdə yoxdur.',
  NAME_AND_TABLE_REQUIRED: 'Qonağın adı və masası boş ola bilməz.',
  TOO_MANY_GUESTS: 'Qonaq sayı limitə çatıb.',
  NOTHING_TO_UNDO: 'Geri qaytarılacaq dəyişiklik yoxdur.',
}
const errText = (e) => ERR[e?.code] || 'Əməliyyat alınmadı. Bağlantını yoxlayıb yenidən cəhd edin.'

const ACTION_LABEL = { add: 'əlavə edildi', delete: 'silindi', update: 'dəyişdirildi', move: 'masası dəyişdi' }

export default function OwnerSeating({ slug }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unlocked, setUnlocked] = useState(() => !!getSeatToken(slug))
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)
  const [history, setHistory] = useState([])

  /* İlk yükləmə effektdə (loading artıq true-dur); sonrakılar `load` ilə */
  const fetchGuests = useCallback(() => getGuests(slug)
    .then((d) => setData(d))
    .catch(() => setNotice({ tone: 'danger', text: 'Qonaq siyahısı yüklənmədi.' }))
    .finally(() => setLoading(false)), [slug])
  const load = useCallback(() => { setLoading(true); fetchGuests() }, [fetchGuests])
  const loadHistory = useCallback(() => {
    if (!getSeatToken(slug)) return
    ownerSeating(slug, 'history').then((r) => setHistory(r.items || [])).catch(() => {})
  }, [slug])
  useEffect(() => { fetchGuests() }, [fetchGuests])
  useEffect(() => { if (unlocked) loadHistory() }, [unlocked, loadHistory])

  const op = async (action, payload) => {
    setSaving(true)
    setNotice(null)
    try {
      await ownerSeating(slug, action, payload)
      load()
      loadHistory()
    } catch (e) {
      if (e?.code === 'EDIT_LOCKED') { clearSeatToken(slug); setUnlocked(false) }
      setNotice({ tone: 'danger', text: errText(e) })
      throw e
    } finally {
      setSaving(false)
    }
  }

  const [extraTables, setExtraTables] = useState([])
  const tables = useMemo(() => {
    const guests = data?.guests ?? []
    const ids = [...new Set([...guests.map((g) => g.table_id), ...(data?.tables?.map((t) => t.table_id) ?? []), ...extraTables])].sort()
    return ids.map((tid) => ({
      id: tid,
      name: tid,
      guests: guests.filter((g) => g.table_id === tid).map((g) => ({
        id: String(g.id), name: g.full_name, status: 'none', plus: 0, phone: '', note: g.notes || '',
      })),
    }))
  }, [data, extraTables])

  const s = data?.stats || {}
  const stats = { total: s.total ?? (data?.guests?.length || 0), yes: s.going ?? 0, no: s.not_going ?? 0, maybe: s.maybe ?? 0, none: s.no_response ?? 0, rate: s.response_rate ?? 0 }

  return (
    <div className="space-y-4">
      {notice && <Notice tone={notice.tone} title={notice.text} />}

      {!unlocked ? (
        <PinGate slug={slug} onUnlocked={() => { setUnlocked(true); setNotice({ tone: 'success', text: 'Redaktə açıldı — 12 saat ərzində dəyişiklik edə bilərsiniz.' }) }} />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] bg-white px-4 py-3 ring-1 ring-inset ring-[#E5DED2]">
          <p className="text-[13.5px] text-[#6B5E54]">Dəyişikliklər dəvətnamədəki «masanı tap» axtarışına dərhal düşür.</p>
          <Button size="sm" icon={Undo2} disabled={!history.length} loading={saving} onClick={() => op('undo').catch(() => {})}>
            Son dəyişikliyi geri qaytar
          </Button>
        </div>
      )}

      <div className={unlocked ? '' : 'pointer-events-none select-none opacity-60'} aria-disabled={!unlocked || undefined}>
        <SeatingPlanTab
          tables={tables}
          stats={stats}
          onAddTable={(name) => setExtraTables((t) => (t.includes(name) ? t : [...t, name]))}
          onAddGuest={(tableId, d) => op('add', { table_id: tableId, full_name: d.name, notes: d.note || '' })}
          onUpdateGuest={(id, d) => op('update', { id: Number(id), full_name: d.name, table_id: d.tableId, notes: d.note || '' })}
          onMoveGuest={(id, to) => op('move', { id: Number(id), table_id: to })}
          onDeleteGuest={(id) => op('delete', { id: Number(id) })}
          saving={saving}
          onRefresh={load}
          refreshing={loading && !!data}
          loading={loading && !data}
        />
      </div>

      {unlocked && history.length > 0 && (
        <Panel title="Son dəyişiklikləriniz" icon={History}>
          <ul className="space-y-1.5 text-[13.5px] text-espresso">
            {history.slice(0, 8).map((h) => {
              const g = h.after || h.before || {}
              return (
                <li key={h.id} className="flex flex-wrap justify-between gap-x-3">
                  <span>{g.full_name} — {ACTION_LABEL[h.action] || h.action}{h.action === 'move' && h.after ? ` (${h.before?.table_id} → ${h.after.table_id})` : ''}</span>
                  <span className="tabular-nums text-[#6B5E54]">{String(h.at || '').slice(11, 16)}</span>
                </li>
              )
            })}
          </ul>
        </Panel>
      )}
    </div>
  )
}

function PinGate({ slug, onUnlocked }) {
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (pin.length !== 6) { setErr('PİN 6 rəqəmdən ibarətdir.'); return }
    setBusy(true)
    setErr('')
    try {
      await ownerSeating(slug, 'unlock', { pin })
      onUnlocked()
    } catch (e2) {
      setErr(errText(e2))
    } finally {
      setBusy(false)
    }
  }
  return (
    <form onSubmit={submit} className="rounded-[12px] bg-white p-4 ring-1 ring-inset ring-[#E5DED2] sm:p-5">
      <p className="flex items-center gap-2 text-[15px] font-semibold text-espresso">
        <LockKeyhole className="h-4 w-4 text-[#8A7D72]" aria-hidden="true" />
        Redaktə üçün PİN daxil edin
      </p>
      <p className="mt-1 text-[13.5px] leading-relaxed text-[#6B5E54]">
        Planı hamı görə bilər, dəyişmək isə yalnız DigiToy-un sizə göndərdiyi 6 rəqəmli PİN ilə mümkündür.
      </p>
      <div className="mt-3 flex flex-wrap items-start gap-2">
        <label htmlFor="seat-pin" className="sr-only">Redaktə PİN-i</label>
        <input
          id="seat-pin"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? 'seat-pin-err' : undefined}
          className="h-11 w-36 rounded-[10px] bg-white px-3 text-center text-[18px] tracking-[0.35em] text-espresso ring-1 ring-inset ring-[#D6CCBC] focus:outline-none focus:ring-2 focus:ring-[#A9822F]"
          placeholder="••••••"
        />
        <Button type="submit" variant="primary" icon={KeyRound} loading={busy}>Redaktəni aç</Button>
      </div>
      {err && <p id="seat-pin-err" role="alert" className="mt-2 text-[13px] text-[#9A3B2E]">{err}</p>}
    </form>
  )
}
