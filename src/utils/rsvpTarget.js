import { normalizeAz } from './normalizeAz.js'

/* İştirak təsdiqi kimin adına gedir (Phase 48) — qonaq siyahısından ASILI DEYİL.
   Seçilmiş və ya adı siyahıda TƏK adla tam üst-üstə düşən qonaq → attendance;
   qalan hər ad (siyahı yox / adı yoxdur / yarımçıq / təkrarlanan) → sərbəst cavab.
   @returns {{kind:'guest', guest} | {kind:'free', name} | null}  null = ad yoxdur */
export function rsvpTarget({ guestList, selected, query }) {
  if (selected) return { kind: 'guest', guest: selected }
  const name = (query || '').trim()
  if (!name) return null
  const nq   = normalizeAz(name)
  const same = (guestList || []).filter((g) => normalizeAz(g.full_name) === nq)
  return same.length === 1 ? { kind: 'guest', guest: same[0] } : { kind: 'free', name }
}
