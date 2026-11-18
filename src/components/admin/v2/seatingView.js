/* get_guests.php cavabı → SeatingPlanTab-ın gözlədiyi forma.
   Admin (AdminSeatingPlan) və müştəri paneli (OwnerSeating) eyni xəritəni işlədir. */

const VIEW_STATUS = { GOING: 'yes', NOT_GOING: 'no', MAYBE: 'maybe', NO_RESPONSE: 'none' }

export function seatingTables(data) {
  const guests = data?.guests ?? []
  /* Masa siyahısı: qonaqların masaları + API / lokal əlavə olunmuş boş masalar */
  const ids = [...new Set([...guests.map((g) => g.table_id), ...(data?.tables?.map((t) => t.table_id) ?? [])])].sort()
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

/** Boş masa yalnız lokal göstərilir — ilk qonaq əlavə olunanda serverdə yaranır */
export function withLocalTable(data, name) {
  return {
    ...data,
    tables: [...(data?.tables ?? []), { table_id: name, total: 0, going: 0, not_going: 0, maybe: 0, no_response: 0, responded: 0 }],
    guests: data?.guests ?? [],
  }
}
