import { useState, useEffect, useRef, useMemo, createElement } from 'react'
import { getGuests } from '../utils/api'
import HallPlan from '../components/seating/HallPlan'
import { normalizeLayout } from '../components/seating/seatingModel'
import { trackEvent } from '../utils/analytics'
import { normalizeAz } from '../utils/normalizeAz'

/* ─────────────────────────────────────────────────────────────────────────────
   useSeating — oturma planı axtarışı (UI-sız).

   SeatingSearch.jsx-dən çıxarılıb: API-dən qonaqlar, köhnə mətn formatına
   fallback, Azərbaycan hərfi normalizasiyası, autocomplete, klaviatura
   naviqasiyası, masa yoldaşları və analytics — hamısı burada.
   ───────────────────────────────────────────────────────────────────────── */

/* Azərbaycan hərfi normalizasiyası — utils/normalizeAz.js (köhnə import yolu qalır) */
export { normalizeAz }

/* İştirak statusu vizualizasiyası — şablonlar öz rənglərini verə bilər */
export const GUEST_STATUS = {
  GOING:       { dot: '🟢', color: 'rgba(60,140,60,0.85)',  label: { az: 'Gələcək',      en: 'Going',       ru: 'Придёт' } },
  NOT_GOING:   { dot: '🔴', color: 'rgba(180,50,40,0.8)',   label: { az: 'Gəlməyəcək',   en: 'Not going',   ru: 'Не придёт' } },
  MAYBE:       { dot: '🟡', color: 'rgba(180,140,20,0.85)', label: { az: 'Bəlkə',        en: 'Maybe',       ru: 'Возможно' } },
  NO_RESPONSE: { dot: '⚪', color: 'rgba(160,140,120,0.6)', label: { az: 'Cavab yoxdur', en: 'No response', ru: 'Нет ответа' } },
}

/** URL-dən dəvətnamə slug-ı (yoxdursa null — demo/preview rejimi) */
export function getInviteSlug() {
  return (window.location.pathname.match(/\/invite\/([^/?#]+)/) || [])[1] || null
}

/** Köhnə format: "Masa 1: A, B; Masa 2: C" → qonaq massivi */
export function parseSeatingText(text) {
  if (!text) return []
  return text.split(';').map((e) => e.trim()).filter(Boolean).flatMap((entry) => {
    const ci = entry.indexOf(':')
    if (ci === -1) return []
    const tableId = entry.slice(0, ci).trim()
    const guests  = entry.slice(ci + 1).split(',').map((g) => g.trim()).filter(Boolean)
    return guests.map((name) => ({
      id: null, full_name: name, table_id: tableId, status: 'NO_RESPONSE', submitted_at: null,
    }))
  })
}

/* `again` (Phase 45) — nəticədən sonrakı «Yenidən axtar» düyməsi. Əvvəl
   şablonlarda sabit Azərbaycanca yazılmışdı və EN/RU-da da belə qalırdı. */
export const SEATING_LABELS = {
  az: { title: 'Masa Axtarışı',  sub: 'Adınızı yazın, masanızı tapın',       hint: 'Məsələn: Araz Hüseynov', again: 'Yenidən axtar' },
  en: { title: 'Find Your Seat', sub: 'Type your name to find your table',   hint: 'E.g: Araz Huseynov',     again: 'Search again' },
  ru: { title: 'Поиск столика',  sub: 'Введите имя, чтобы найти стол',       hint: 'Например: Араз Гусейнов', again: 'Искать снова' },
}

export function useSeating({ seatingPlan, lang = 'az' }) {
  const slug = getInviteSlug()

  /* slug yoxdursa (demo/preview) heç vaxt yükləmə olmayacaq → dərhal boş massiv */
  const [apiGuests, setApiGuests] = useState(slug ? null : [])   // null = yüklənir
  /* v52 — müştərinin seçimi: masa yoldaşları / zal planı (plan yoxdursa köhnə davranış) */
  const [seatCfg, setSeatCfg] = useState(null)
  const [query,     setQuery]     = useState('')
  const [selected,  setSelected]  = useState(null)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef(null)

  /* ── API-dən qonaqları yüklə; uğursuzsa köhnə formata keç ── */
  useEffect(() => {
    if (!slug) return
    getGuests(slug)
      .then((d) => {
        setApiGuests(d.guests ?? [])
        /* qonaq → `seating`; toy sahibi / admin (açarla) → tam `layout` — eyni seçim tətbiq olunsun */
        setSeatCfg(d.seating ?? (d.layout ? { showTablemates: d.layout.showTablemates !== false, showMap: d.layout.showMap === true, layout: d.layout } : null))
      })
      .catch(() => setApiGuests([]))
  }, [slug])

  /* ── Qonaq siyahısı: API > seatingPlan mətni ── */
  const allGuests = useMemo(() => {
    if (apiGuests === null) return []            // hələ yüklənir
    if (apiGuests.length > 0) return apiGuests.filter((g) => g.table_id)   // API; masası olmayanlar axtarışda çıxmır (v52)
    return parseSeatingText(seatingPlan)         // fallback
  }, [apiGuests, seatingPlan])

  const suggestions = useMemo(() => {
    if (selected || query.trim().length < 2) return []
    const nq = normalizeAz(query)
    return allGuests.filter((g) => normalizeAz(g.full_name).includes(nq)).slice(0, 8)
  }, [query, allGuests, selected])

  const showNotFound = !selected && query.trim().length >= 2 && suggestions.length === 0

  /* Analytics — hər axtarış sessiyası üçün bir dəfə */
  const searchFiredRef = useRef(false)
  useEffect(() => {
    if (query.trim().length >= 2 && !searchFiredRef.current) {
      searchFiredRef.current = true
      trackEvent('seating_search_used', { has_results: suggestions.length > 0 })
    } else if (query.trim().length < 2) {
      searchFiredRef.current = false
    }
  }, [query, suggestions.length])

  /* Masa yoldaşları: seçilmiş qonaqla eyni masadakılar (müştəri «Yox» seçibsə göstərilmir) */
  const showTablemates = seatCfg?.showTablemates !== false
  const tablemates = useMemo(() => {
    if (!selected || !showTablemates) return []
    return allGuests.filter((g) => g.table_id === selected.table_id)
  }, [selected, allGuests, showTablemates])

  /* Kiçik zal planı — müştəri «Hə» seçibsə; şablonlar `{seating.mapEl}` ilə yerləşdirir */
  const mapLayout = useMemo(() => (seatCfg?.showMap && seatCfg.layout
    ? normalizeLayout(seatCfg.layout, allGuests.map((g) => g.table_id))
    : null), [seatCfg, allGuests])
  const mapEl = useMemo(() => (mapLayout && selected
    ? createElement('div', { className: 'sp-mini-wrap', style: { margin: '16px auto 6px', maxWidth: 420, width: '100%' } },
      createElement(HallPlan, { layout: mapLayout, mini: true, highlight: selected.table_id }))
    : null), [mapLayout, selected])

  const pick  = (g) => { setSelected(g); setQuery(g.full_name); setActiveIdx(-1) }
  const reset = () => { setSelected(null); setQuery(''); setActiveIdx(-1); inputRef.current?.focus() }

  const onKeyDown = (e) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown')    { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter')   { e.preventDefault(); if (activeIdx >= 0) pick(suggestions[activeIdx]); else if (suggestions.length === 1) pick(suggestions[0]) }
    else if (e.key === 'Escape')  reset()
  }

  return {
    /* data */
    allGuests, suggestions, selected, tablemates, mapEl,
    /* vəziyyət */
    query, setQuery, activeIdx, setActiveIdx, setSelected,
    loading: apiGuests === null,
    /* SeatingSearch bölməsi ümumiyyətlə gizlədilməlidirmi? */
    isEmpty: !allGuests.length && apiGuests !== null,
    showNotFound,
    /* hərəkətlər */
    pick, reset, onKeyDown, inputRef,
    /* i18n */
    labels: SEATING_LABELS[lang] || SEATING_LABELS.az,
    statusMap: GUEST_STATUS,
  }
}

export default useSeating
