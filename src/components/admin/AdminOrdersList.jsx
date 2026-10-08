import { useState, useEffect, useRef, useMemo } from 'react'
import { listTemplates } from '../../templates/templateConfig'
import { getOrdersList, adminPurge } from '../../utils/api'
import OrdersList from './v2/OrdersList'
import { Notice } from './v2/adminUi'
import { azDate } from './adminFormat'
import { templateMeta } from './templateMeta'

/* ─────────────────────────────────────────────────────────────────────────────
   Sifarişlər siyahısı — UI redesign 2026-10 (görünüş v2/OrdersList)

   Məntiq dəyişməyib: status tabı + 400ms debounce axtarış + şablon filtri
   serverdə süzülür (get_orders_list.php, 50 sətir). «Silinmiş» tabında
   birdəfəlik silmə (Phase 46) — canlı dəvətnaməyə bağlı sifarişləri server
   saxlayır və onlar siyahıda qalır.
   ───────────────────────────────────────────────────────────────────────── */

/* Görünüşün tab id-ləri ↔ API statusları */
const TAB_TO_STATUS = { new: 'submitted', approved: 'approved', rejected: 'rejected', all: 'all', deleted: 'deleted' }
const VIEW_STATUS = { submitted: 'new' }

/* ⚠ `toLocaleDateString('az-AZ')` Chrome-da «M06 29» verirdi — bax adminFormat */
const formatDate = (iso) => azDate(iso, { time: true, year: false })

export default function AdminOrdersList({ onSelectOrder }) {
  const [orders,    setOrders]    = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [tab,       setTab]       = useState('new')
  const [search,    setSearch]    = useState('')
  const [searchVal, setSearchVal] = useState('')
  /* Phase 4 — şablon filtri ('' = hamısı) */
  const [templateFilter, setTemplateFilter] = useState('')
  const debounceRef = useRef(null)
  /* Phase 46 — birdəfəlik silmə */
  const [purgeBusy,  setPurgeBusy]  = useState(false)
  const [purgeError, setPurgeError] = useState('')
  const statusTab = TAB_TO_STATUS[tab]

  const fetchOrders = (status, q = '', tpl = templateFilter) => {
    setLoading(true)
    setError('')
    getOrdersList(status, 50, 0, q, tpl)
      .then(data => {
        setOrders(data.orders || [])
        setTotal(data.total || 0)
      })
      .catch(() => setError('Sifarişlər yüklənmədi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders(statusTab, search, templateFilter) }, [statusTab, templateFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Axtarış — 400ms debounce */
  const handleSearchChange = (val) => {
    setSearchVal(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(val)
      fetchOrders(statusTab, val)
    }, val ? 400 : 0)
  }

  const purge = async (payload, after) => {
    setPurgeBusy(true)
    setPurgeError('')
    try {
      after(await adminPurge(payload))
    } catch (e) {
      setPurgeError(e?.message || 'Silinmədi.')
    } finally {
      setPurgeBusy(false)
    }
  }
  const purgeOne = (code) => purge({ action: 'order', draft_code: code }, () => {
    setOrders(prev => prev.filter(o => o.draft_code !== code))
    setTotal(t => Math.max(0, t - 1))
  })
  /* Canlı dəvətnaməyə bağlı sifarişləri server saxlayır (kept) — siyahıda qalırlar */
  const purgeAll = () => purge({ action: 'deleted_orders' }, (res) => {
    const kept = res?.kept || []
    setOrders(prev => prev.filter(o => kept.includes(o.draft_code)))
    setTotal(kept.length)
    if (kept.length) {
      setPurgeError(`${kept.length} sifariş aktiv dəvətnaməyə bağlı olduğu üçün saxlanıldı — onları dəvətnamə ilə birlikdə «Dəvətnamələr»dən silin.`)
    }
  })

  const rows = useMemo(() => orders.map((o, i) => ({
    id: o.draft_code || `row-${i}`,
    code: o.draft_code || '—',
    date: formatDate(o.submitted_at),
    names: o.names || '—',
    pkg: o.package_label,
    template: templateMeta(o.template_id),
    status: VIEW_STATUS[o.status] || o.status || 'draft',
    /* Phase 48 — təsdiqlənmiş, amma dəvətnaməsi silinmiş/yaradılmamış sifariş.
       `null` = server yoxladı və tapmadı (köhnə API-də sahə yoxdur → göstərilmir). */
    note: o.status === 'approved' && o.invitation_slug === null ? 'Dəvətnamə yoxdur' : '',
  })), [orders])

  const templates = useMemo(() => [
    { value: '', label: 'Bütün şablonlar' },
    ...listTemplates().map(t => ({ value: t.id, label: t.name })),
  ], [])

  return (
    <>
      {error && <Notice tone="danger" title={error} className="mb-4" />}
      {purgeError && <Notice tone="warning" title={purgeError} className="mb-4" />}
      <OrdersList
        orders={rows}
        tab={tab}
        onTab={(t) => { setTab(t); setPurgeError('') }}
        search={searchVal}
        onSearch={handleSearchChange}
        template={templateFilter}
        onTemplate={setTemplateFilter}
        templates={templates}
        onRefresh={() => fetchOrders(statusTab, search, templateFilter)}
        refreshing={loading}
        loading={loading}
        total={total}
        onOpen={(o) => { if (o.code && o.code !== '—') onSelectOrder(o.code) }}
        onPurge={(o) => purgeOne(o.code)}
        onPurgeAll={purgeAll}
        purging={purgeBusy}
      />
    </>
  )
}
