import { useState, useEffect, useRef, useMemo } from 'react'
import AdminTranslations from './AdminTranslations'
import AdminContentManager from './AdminContentManager'
import PurgeInvitationDialog from './PurgeInvitationDialog'
import InvitationsList from './v2/InvitationsList'
import { Notice, Toast } from './v2/adminUi'
import { RotateOwnerLinkDialog } from './OwnerPanelLinkCard'
import { setInvitationActive, getAdminToken } from '../../utils/api'
import { getOwnerLink, rotateOwnerLink } from '../../utils/ownerApi'
import { azDate } from './adminFormat'
import { templateMeta } from './templateMeta'

/* ─────────────────────────────────────────────────────────────────────────────
   Dəvətnamələr — UI redesign 2026-10 (görünüş v2/InvitationsList)

   Məntiq dəyişməyib: get_invitations_list.php (400ms debounce axtarış),
   linki aç/bağla (yalnız `is_active`; slug, QR, qalereya, form_data
   toxunulmur — bağlamaq təsdiq pəncərəsi ilə), məzmun meneceri, məzmun
   tərcüməsi, birdəfəlik silmə (Phase 46, ikiqat təsdiq).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = import.meta.env.VITE_API_URL || '/api'

async function getInvitationsList(search = '', limit = 50, offset = 0) {
  const p = new URLSearchParams({ limit, offset })
  if (search) p.set('search', search)
  const token = getAdminToken()
  const res = await fetch(`${BASE}/get_invitations_list.php?${p}`, {
    headers: token ? { 'X-Admin-Token': token } : {},
  })
  if (!res.ok) throw new Error(`get_invitations_list: ${res.status}`)
  return res.json()
}

const EVENT_LABELS = {
  toy: 'Toy', nishan: 'Nişan', birthday: 'Ad günü', corporate: 'Korporativ', other: 'Digər',
}

export default function AdminInvitationsList() {
  const [items,     setItems]     = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [search,    setSearch]    = useState('')
  const [busySlug,  setBusySlug]  = useState(null)
  const [trSlug,    setTrSlug]    = useState(null)   /* açıq tərcümə modalı */
  /* Phase 42 — məzmun meneceri. Tərcümə modalından AYRIDIR: ikisi eyni
     `form_data`-nın FƏRQLİ açarlarına yazır (`i18n` ↔ `admin`). */
  const [cmSlug,    setCmSlug]    = useState(null)
  /* Phase 46 — birdəfəlik silmə pəncərəsi ({ slug, names }) */
  const [purgeInv,  setPurgeInv]  = useState(null)
  const [toast,     setToast]     = useState('')
  /* Phase 50 — «Müştəri paneli» linkini yeniləmə təsdiqi ({ slug, names }) */
  const [ownerAsk,  setOwnerAsk]  = useState(null)
  const [ownerBusy, setOwnerBusy] = useState(false)
  const debounceRef = useRef(null)

  /* Link serverdən gəlir; await-dən sonra clipboard bəzi brauzerlərdə rədd
     olunur — onda link pəncərədə göstərilir ki, əllə kopyalansın. */
  const copyOwnerLink = async (request, doneText) => {
    setError('')
    try {
      const { url } = await request
      try {
        await navigator.clipboard.writeText(url)
        setToast(doneText)
      } catch {
        window.prompt('Müştəri paneli linki — kopyalayın:', url)
      }
    } catch {
      setError('Müştəri paneli linki alınmadı.')
    }
  }

  const load = (q = '') => {
    setLoading(true)
    setError('')
    getInvitationsList(q)
      .then(d => { setItems(d.invitations || []); setTotal(d.total || 0) })
      .catch(() => setError('Dəvətnamələr yüklənmədi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearch = (val) => {
    setSearchVal(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearch(val); load(val) }, val ? 400 : 0)
  }

  /* ── Linki aç / bağla ── */
  const toggleActive = async (slug, nextActive) => {
    setBusySlug(slug)
    setError('')
    try {
      await setInvitationActive(slug, nextActive)
      setItems(prev => prev.map(x => (x.slug === slug ? { ...x, is_active: nextActive } : x)))
    } catch (e) {
      setError(e?.message || 'Status dəyişdirilə bilmədi.')
      throw e
    } finally {
      setBusySlug(null)
    }
  }

  const rows = useMemo(() => items.map(inv => ({
    id: inv.slug,
    slug: inv.slug,
    names: inv.names || '—',
    template: templateMeta(inv.template_id),
    kind: EVENT_LABELS[inv.event_type] || inv.event_type || '—',
    venue: inv.venue || '—',
    created: azDate(inv.created_at),
    /* Sahə yoxdursa (köhnə backend) AKTİV sayılır — link bağlı görünməsin */
    active: inv.is_active !== false,
    translations: inv.has_i18n || {},
    url: `/invite/${inv.slug}`,
  })), [items])

  return (
    <>
      {error && <Notice tone="danger" title={error} className="mb-4" />}
      <InvitationsList
        invitations={rows}
        total={total}
        search={searchVal}
        onSearch={handleSearch}
        onRefresh={() => load(search)}
        refreshing={loading}
        loading={loading}
        onOpenContent={(inv) => setCmSlug(inv.slug)}
        onOpenTranslate={(inv) => setTrSlug(inv.slug)}
        onToggleActive={(inv, next) => {
          const p = toggleActive(inv.slug, next)
          /* yenidən açmaq birbaşadır (pəncərə yoxdur) — xəta yuxarıda göstərilir */
          if (next) p.catch(() => {})
          return p
        }}
        onPurge={(inv) => setPurgeInv({ slug: inv.slug, names: inv.names })}
        onCopyLink={(inv) => navigator.clipboard.writeText(`${window.location.origin}/invite/${inv.slug}`)
          .then(() => setToast('Link kopyalandı.'))}
        onCopyOwnerLink={(inv) => copyOwnerLink(getOwnerLink(inv.slug), 'Müştəri paneli linki kopyalandı.')}
        onRotateOwnerLink={(inv) => setOwnerAsk({ slug: inv.slug, names: inv.names })}
        togglingId={busySlug}
      />

      <Toast open={!!toast} message={toast} onClose={() => setToast('')} />

      <RotateOwnerLinkDialog
        open={!!ownerAsk}
        names={ownerAsk?.names || ownerAsk?.slug}
        busy={ownerBusy}
        onCancel={() => setOwnerAsk(null)}
        onConfirm={async () => {
          setOwnerBusy(true)
          await copyOwnerLink(rotateOwnerLink(ownerAsk.slug), 'Yeni link kopyalandı — köhnəsi artıq açılmır.')
          setOwnerBusy(false)
          setOwnerAsk(null)
        }}
      />

      {purgeInv && (
        <PurgeInvitationDialog
          key={purgeInv.slug}
          slug={purgeInv.slug}
          names={purgeInv.names}
          onClose={() => setPurgeInv(null)}
          onDone={(slug) => {
            setItems(prev => prev.filter(x => x.slug !== slug))
            setTotal(t => Math.max(0, t - 1))
            setPurgeInv(null)
            setToast('Dəvətnamə birdəfəlik silindi.')
          }}
        />
      )}

      {cmSlug && (
        <AdminContentManager
          key={cmSlug}
          slug={cmSlug}
          onClose={() => setCmSlug(null)}
        />
      )}

      {trSlug && (
        <AdminTranslations
          key={trSlug}
          slug={trSlug}
          onClose={() => setTrSlug(null)}
          onSaved={(i18n) => setItems(prev => prev.map(x => (
            x.slug === trSlug
              ? { ...x, has_i18n: { en: !!i18n?.en, ru: !!i18n?.ru } }
              : x
          )))}
        />
      )}
    </>
  )
}
