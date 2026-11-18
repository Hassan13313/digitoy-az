/* get_guests.php cavabı → SeatingPlanTab-ın gözlədiyi forma.
   Admin (AdminSeatingPlan) və müştəri paneli (OwnerSeating) eyni xəritəni işlədir. */

const VIEW_STATUS = { GOING: 'yes', NOT_GOING: 'no', MAYBE: 'maybe', NO_RESPONSE: 'none' }

/** `localTables` — istifadəçinin yenicə əlavə etdiyi, hələ qonağı olmayan masalar.
    Serverdə masa yalnız qonaqla yaranır, ona görə bunlar ayrıca state-də saxlanılır:
    hər əməliyyatdan sonra `data` yenidən yüklənəndə itməsinlər. */
export function seatingTables(data, localTables = []) {
  const guests = data?.guests ?? []
  const ids = [...new Set([...guests.map((g) => g.table_id), ...(data?.tables?.map((t) => t.table_id) ?? []), ...localTables])].sort()
  return ids.map((tid) => ({
    id: tid,
    name: tid,
    guests: guests.filter((g) => g.table_id === tid).map((g) => ({
      id: String(g.id),
      name: g.full_name,
      status: VIEW_STATUS[g.status] || 'none',
      plus: Number(g.extra_guests) || 0,
      phone: g.phone || '',        /* Phase 43 — Excel idxalından (sütun yoxdursa boş) */
      note: g.notes || '',
    })),
  }))
}

export function seatingStats(data) {
  const s = data?.stats || {}
  return {
    total: s.total ?? 0, yes: s.going ?? 0, no: s.not_going ?? 0, maybe: s.maybe ?? 0,
    none: s.no_response ?? 0, rate: s.response_rate ?? 0,
  }
}

export const addLocalTable = (name) => (list) => (list.includes(name) ? list : [...list, name])
