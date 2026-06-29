import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, MoveRight, RefreshCw, Upload, Check, X } from 'lucide-react'
import { getGuests, manageGuest, migrateGuests } from '../../utils/api'

const STATUS_DOT = {
  GOING:       '🟢', NOT_GOING: '🔴', MAYBE: '🟡', NO_RESPONSE: '⚪',
}
const STATUS_AZ = {
  GOING: 'Gələcək', NOT_GOING: 'Gəlməyəcək', MAYBE: 'Bəlkə', NO_RESPONSE: 'Cavab yoxdur',
}

/* ── Kiçik form: qonaq əlavə et / redaktə et ── */
function GuestForm({ tableId, allTableIds, existingGuest, onSave, onCancel }) {
  const [name,  setName]  = useState(existingGuest?.full_name   || '')
  const [tbl,   setTbl]   = useState(existingGuest?.table_id    || tableId || '')
  const [notes, setNotes] = useState(existingGuest?.notes       || '')
  const [busy,  setBusy]  = useState(false)

  const handleSave = async () => {
    if (!name.trim() || !tbl.trim()) return
    setBusy(true)
    try {
      if (existingGuest) {
        await onSave({ id: existingGuest.id, full_name: name.trim(), table_id: tbl.trim(), notes: notes.trim() || null })
      } else {
        await onSave({ full_name: name.trim(), table_id: tbl.trim(), notes: notes.trim() || null })
      }
    } finally {
      setBusy(false)
    }
  }

  const inp = { width: '100%', padding: '7px 10px', border: '1px solid oklch(85% 0.02 60)', borderRadius: 3, fontSize: 12, color: 'oklch(22% 0.02 60)', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ background: 'oklch(97% 0.01 80)', border: '1px solid oklch(86% 0.03 75)', borderRadius: 5, padding: '14px 16px', marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input style={inp} placeholder="Ad Soyad *" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} autoFocus />
        <select style={{ ...inp, width: 'auto', minWidth: 120 }} value={tbl} onChange={e => setTbl(e.target.value)}>
          {allTableIds.map(id => <option key={id} value={id}>{id}</option>)}
        </select>
      </div>
      <input style={{ ...inp, marginBottom: 10 }} placeholder="Qeyd (isteğe bağlı)" value={notes} onChange={e => setNotes(e.target.value)} />
      <div style={{ display: 'flex', gap: 6 }}>
        <button type="button" onClick={handleSave} disabled={!name.trim() || busy}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: 'oklch(38% 0.1 145)', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
          <Check size={11} strokeWidth={2} />{busy ? '...' : existingGuest ? 'Yadda saxla' : 'Əlavə et'}
        </button>
        <button type="button" onClick={onCancel}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'white', color: 'oklch(45% 0.03 60)', border: '1px solid oklch(85% 0.02 60)', borderRadius: 3, cursor: 'pointer', fontSize: 11 }}>
          <X size={11} strokeWidth={2} />Ləğv et
        </button>
      </div>
    </div>
  )
}

/* ── Masa kartı ── */
function TableCard({ tableId, guests, allTableIds, onRefresh, slug }) {
  const [addMode,    setAddMode]    = useState(false)
  const [editGuest,  setEditGuest]  = useState(null)
  const [moveGuest,  setMoveGuest]  = useState(null)
  const [moveTarget, setMoveTarget] = useState('')
  const [busy,       setBusy]       = useState(false)

  const handleAdd = async (data) => {
    await manageGuest('add', { ...data, invitation_id: slug })
    setAddMode(false)
    onRefresh()
  }

  const handleUpdate = async (data) => {
    await manageGuest('update', data)
    setEditGuest(null)
    onRefresh()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu qonağı silmək istəyirsiniz?')) return
    setBusy(true)
    try { await manageGuest('delete', { id }) } finally { setBusy(false) }
    onRefresh()
  }

  const handleMove = async () => {
    if (!moveGuest || !moveTarget) return
    setBusy(true)
    try { await manageGuest('move', { id: moveGuest.id, table_id: moveTarget }) } finally { setBusy(false) }
    setMoveGuest(null)
    onRefresh()
  }

  const going = guests.filter(g => g.status === 'GOING').length
  const responded = guests.filter(g => g.status !== 'NO_RESPONSE').length

  return (
    <div style={{ border: '1px solid oklch(88% 0.02 60)', borderRadius: 6, overflow: 'hidden', marginBottom: 12 }}>
      {/* Table header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'oklch(95% 0.01 75)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'oklch(25% 0.03 60)' }}>{tableId}</span>
          <span style={{ fontSize: 10, color: 'oklch(55% 0.03 60)' }}>
            {responded}/{guests.length} cavab · {going} gələcək
          </span>
        </div>
        <button type="button" onClick={() => { setAddMode(true); setEditGuest(null) }}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'oklch(45% 0.08 75)', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>
          <Plus size={10} strokeWidth={2} />Əlavə et
        </button>
      </div>

      {/* Add form */}
      {addMode && (
        <div style={{ padding: '10px 12px' }}>
          <GuestForm tableId={tableId} allTableIds={allTableIds} onSave={handleAdd} onCancel={() => setAddMode(false)} />
        </div>
      )}

      {/* Guest rows */}
      <div>
        {guests.map(g => (
          <div key={g.id} style={{ borderTop: '1px solid oklch(92% 0.01 60)', padding: '9px 16px' }}>
            {editGuest?.id === g.id ? (
              <GuestForm tableId={tableId} allTableIds={allTableIds} existingGuest={g} onSave={handleUpdate} onCancel={() => setEditGuest(null)} />
            ) : moveGuest?.id === g.id ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'oklch(30% 0.02 60)', minWidth: 120 }}>{g.full_name}</span>
                <MoveRight size={12} strokeWidth={1.5} style={{ color: 'oklch(55% 0.05 75)' }} />
                <select value={moveTarget} onChange={e => setMoveTarget(e.target.value)}
                  style={{ padding: '4px 8px', border: '1px solid oklch(82% 0.03 75)', borderRadius: 3, fontSize: 11, color: 'oklch(25% 0.02 60)' }}>
                  <option value="">Masa seçin...</option>
                  {allTableIds.filter(id => id !== tableId).map(id => <option key={id} value={id}>{id}</option>)}
                </select>
                <button type="button" onClick={handleMove} disabled={!moveTarget || busy}
                  style={{ padding: '4px 10px', background: 'oklch(42% 0.09 75)', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>
                  Köçür
                </button>
                <button type="button" onClick={() => setMoveGuest(null)}
                  style={{ padding: '4px 8px', background: 'white', border: '1px solid oklch(85% 0.02 60)', borderRadius: 3, cursor: 'pointer', fontSize: 10 }}>
                  Ləğv
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 14 }}>{STATUS_DOT[g.status] || '⚪'}</span>
                  <span style={{ fontSize: 13, color: 'oklch(22% 0.02 60)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.full_name}</span>
                  {g.notes && <span style={{ fontSize: 10, color: 'oklch(58% 0.03 60)', fontStyle: 'italic' }}>— {g.notes}</span>}
                </div>
                <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                  <span style={{ fontSize: 9, color: 'oklch(52% 0.03 60)', whiteSpace: 'nowrap' }}>{STATUS_AZ[g.status] || g.status}</span>
                  <button type="button" onClick={() => { setEditGuest(g); setMoveGuest(null) }} title="Redaktə et"
                    style={{ padding: '3px 7px', background: 'none', border: '1px solid oklch(86% 0.02 60)', borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Pencil size={10} strokeWidth={1.5} style={{ color: 'oklch(50% 0.05 75)' }} />
                  </button>
                  <button type="button" onClick={() => { setMoveGuest(g); setEditGuest(null); setMoveTarget('') }} title="Masanı dəyiş"
                    style={{ padding: '3px 7px', background: 'none', border: '1px solid oklch(86% 0.02 60)', borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <MoveRight size={10} strokeWidth={1.5} style={{ color: 'oklch(50% 0.07 225)' }} />
                  </button>
                  <button type="button" onClick={() => handleDelete(g.id)} disabled={busy} title="Sil"
                    style={{ padding: '3px 7px', background: 'none', border: '1px solid oklch(88% 0.04 25)', borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={10} strokeWidth={1.5} style={{ color: 'oklch(45% 0.12 25)' }} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {guests.length === 0 && (
          <div style={{ padding: '12px 16px', fontSize: 11, color: 'oklch(62% 0.03 60)', fontStyle: 'italic' }}>
            Hələ qonaq əlavə edilməyib.
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Əsas komponent ── */
export default function AdminSeatingPlan({ slug, seatingPlan }) {
  const [data,      setData]      = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [migrating, setMigrating] = useState(false)
  const [migrateMsg, setMigrateMsg] = useState('')
  const [newTableName, setNewTableName] = useState('')

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

  const handleAddTable = async () => {
    const name = newTableName.trim()
    if (!name) return
    /* Boş masa yaratmaq üçün placeholder qonaq əlavə etmə — istifadəçi sonra qonaq əlavə edəcək */
    setNewTableName('')
    /* Lokal olaraq masanı göstər */
    setData(prev => ({
      ...prev,
      tables: [...(prev?.tables ?? []), { table_id: name, total: 0, going: 0, not_going: 0, maybe: 0, no_response: 0, responded: 0 }],
      guests: prev?.guests ?? [],
    }))
  }

  if (!slug) return null

  const guests    = data?.guests ?? []
  const tableIds  = [...new Set(guests.map(g => g.table_id))]
  /* Masa siyahısı (API + lokal əlavə) */
  const allTableIds = [...new Set([
    ...tableIds,
    ...(data?.tables?.map(t => t.table_id) ?? []),
  ])].sort()

  /* Qonaqları masa üzrə qruplaşdır */
  const byTable = {}
  for (const tid of allTableIds) byTable[tid] = []
  for (const g of guests) {
    if (byTable[g.table_id]) byTable[g.table_id].push(g)
    else byTable[g.table_id] = [g]
  }

  const hasMigratableData = !!(seatingPlan && seatingPlan.trim() && guests.length === 0)

  return (
    <div style={{ marginTop: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'oklch(45% 0.03 60)', fontWeight: 600 }}>
          Oturma Planı — Qonaq İdarəetməsi
        </span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {hasMigratableData && (
            <button type="button" onClick={handleMigrate} disabled={migrating}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'oklch(42% 0.09 75)', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 10, fontWeight: 600 }}>
              <Upload size={10} strokeWidth={2} />{migrating ? 'Köçürülür...' : 'Mövcud planı import et'}
            </button>
          )}
          <button type="button" onClick={load}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'white', border: '1px solid oklch(85% 0.02 60)', borderRadius: 3, cursor: 'pointer', fontSize: 10, color: 'oklch(50% 0.03 60)' }}>
            <RefreshCw size={10} strokeWidth={1.5} />Yenilə
          </button>
        </div>
      </div>

      {migrateMsg && (
        <div style={{ padding: '10px 14px', background: 'oklch(95% 0.04 145)', border: '1px solid oklch(82% 0.08 145)', borderRadius: 4, fontSize: 11, color: 'oklch(35% 0.1 145)', marginBottom: 12 }}>
          {migrateMsg}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 12, color: 'oklch(60% 0.03 60)' }}>Yüklənir...</div>
      ) : error ? (
        <div style={{ padding: '14px', background: 'oklch(97% 0.02 25)', borderRadius: 4, fontSize: 12, color: 'oklch(42% 0.1 25)' }}>{error}</div>
      ) : (
        <>
          {/* Yeni masa əlavə et */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              value={newTableName}
              onChange={e => setNewTableName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTable()}
              placeholder="Yeni masa adı (məs. Masa 5)"
              style={{ flex: 1, padding: '7px 10px', border: '1px solid oklch(85% 0.02 60)', borderRadius: 3, fontSize: 12, outline: 'none' }}
            />
            <button type="button" onClick={handleAddTable} disabled={!newTableName.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'oklch(45% 0.08 75)', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
              <Plus size={11} strokeWidth={2} />Masa əlavə et
            </button>
          </div>

          {/* Summary stats */}
          {data?.stats && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              {[
                { label: 'Ümumi',        value: data.stats.total,         color: 'oklch(40% 0.03 60)' },
                { label: '🟢 Gələcək',   value: data.stats.going,         color: 'oklch(35% 0.1 145)' },
                { label: '🔴 Gəlməyəcək', value: data.stats.not_going,   color: 'oklch(38% 0.12 25)' },
                { label: '🟡 Bəlkə',     value: data.stats.maybe,         color: 'oklch(42% 0.08 70)' },
                { label: '⚪ Cavabsız',  value: data.stats.no_response,   color: 'oklch(52% 0.03 60)' },
                { label: 'Cavab %',      value: `${data.stats.response_rate}%`, color: 'oklch(38% 0.09 80)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center', padding: '8px 12px', border: '1px solid oklch(88% 0.02 60)', borderRadius: 4, minWidth: 70 }}>
                  <div style={{ fontSize: 20, fontWeight: 300, color, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(58% 0.03 60)', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Masa kartları */}
          {allTableIds.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: 12, color: 'oklch(60% 0.03 60)', border: '1px solid oklch(88% 0.02 60)', borderRadius: 5 }}>
              {seatingPlan ? 'Yuxarıdakı "Import et" düyməsi ilə mövcud planı yükləyin.' : 'Hələ qonaq əlavə edilməyib. Masa yaradın və qonaqları əlavə edin.'}
            </div>
          ) : (
            allTableIds.map(tid => (
              <TableCard
                key={tid}
                tableId={tid}
                guests={byTable[tid] ?? []}
                allTableIds={allTableIds}
                onRefresh={load}
                slug={slug}
              />
            ))
          )}
        </>
      )}
    </div>
  )
}
