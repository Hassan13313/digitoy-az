import { useState, useEffect, useRef, useMemo } from 'react'
import { getAdminGuestbook, deleteGuestbookMessage } from '../../utils/api'
import MessagesList from './v2/MessagesList'
import { Notice } from './v2/adminUi'
import { azDate } from './adminFormat'

/* ─────────────────────────────────────────────────────────────────────────────
   TƏBRİK MƏKTUBLARI — admin moderasiyası (Phase 36;
   UI redesign 2026-10: görünüş v2/MessagesList)

   ⚠ QONAĞIN AXINI DƏYİŞMİR: yazma forması, `submit_guest_response.php` və
   dəvətnamədəki `Guestbook` bölməsi toxunulmur.
   ⚠ SİLMƏ RSVP-ni MƏHV ETMİR: eyni sətirdə iştirak cavabı varsa yalnız mesaj
   mətni silinir (backend qərar verir — bax `admin_guestbook.php`). Kartda
   «İştirak» nişanı göstərilir ki, admin nə olacağını bilsin.
   ⚠ Silmə server təsdiqindən SONRA siyahıdan çıxır (optimistik deyil).
   ───────────────────────────────────────────────────────────────────────── */

export default function AdminGuestbook() {
  const [items,     setItems]     = useState([])
  const [total,     setTotal]     = useState(0)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [search,    setSearch]    = useState('')
  const [slug,      setSlug]      = useState('')
  const [slugs,     setSlugs]     = useState([])   /* filtr seçimləri (filtrsiz yükləmədən) */
  const [busyId,    setBusyId]    = useState(null)
  const debounceRef = useRef(null)

  const load = (q = '', s = '') => {
    setLoading(true)
    setError('')
    getAdminGuestbook({ search: q, slug: s })
      .then((d) => {
        const list = d.messages || []
        setItems(list)
        setTotal(d.total || 0)
        if (!s) setSlugs(prev => [...new Set([...prev, ...list.map(m => m.slug)])].sort())
      })
      .catch(() => setError('Mesajlar yüklənmədi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearch = (val) => {
    setSearchVal(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearch(val); load(val, slug) }, val ? 400 : 0)
  }

  const handleSlug = (s) => {
    setSlug(s)
    load(search, s)
  }

  const handleDelete = async (id) => {
    setBusyId(id)
    try {
      await deleteGuestbookMessage(id)
      setItems((prev) => prev.filter((m) => m.id !== id))
      setTotal((n) => Math.max(0, n - 1))
    } catch (e) {
      setError(e?.message || 'Mesaj silinmədi.')
      throw e
    } finally {
      setBusyId(null)
    }
  }

  const messages = useMemo(() => items.map(m => ({
    id: m.id,
    author: m.name || '—',
    text: m.text || '',
    date: azDate(m.created_at, { time: true }),
    hasRsvp: !!m.has_rsvp,
    invitation: { slug: m.slug, url: `/invite/${m.slug}` },
  })), [items])

  return (
    <>
      {error && <Notice tone="danger" title={error} className="mb-4" />}
      <MessagesList
        messages={messages}
        total={total}
        search={searchVal}
        onSearch={handleSearch}
        invitationFilter={slug}
        onInvitationFilter={handleSlug}
        invitationOptions={[{ value: '', label: 'Bütün dəvətnamələr' }, ...slugs.map(s => ({ value: s, label: s }))]}
        onDeleteMessage={(m) => handleDelete(m.id)}
        deletingId={busyId}
        onRefresh={() => load(search, slug)}
        refreshing={loading}
        loading={loading}
      />
    </>
  )
}
