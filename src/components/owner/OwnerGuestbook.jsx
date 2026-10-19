import { useEffect, useMemo, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { EmptyState, Notice, Panel, SearchInput, Skeleton } from '../admin/v2/adminUi'
import { azDate } from '../admin/adminFormat'
import { getGuestResponses } from '../../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   Müştəri paneli — təbrik məktubları (Phase 50). YALNIZ OXU: silmə admindədir.
   Mənbə dəvətnamədəki ictimai siyahıdır (get_guest_responses.php) — müştəri
   qonaqların gördüyündən artıq heç nə görmür, sadəcə hamısı bir yerdədir.
   ───────────────────────────────────────────────────────────────────────── */

export default function OwnerGuestbook({ slug, refreshSignal = 0 }) {
  const [messages, setMessages] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let alive = true
    getGuestResponses(slug)
      .then((d) => { if (alive) { setMessages(d?.messages || []); setError('') } })
      .catch(() => { if (alive) setError('Təbriklər yüklənmədi. Bir az sonra yenidən yoxlayın.') })
    return () => { alive = false }
  }, [slug, refreshSignal])

  /* Ən yenisi yuxarıda */
  const list = useMemo(() => {
    const q = search.trim().toLowerCase()
    return [...(messages || [])].reverse().filter((m) =>
      !q || (m.name || '').toLowerCase().includes(q) || (m.text || '').toLowerCase().includes(q))
  }, [messages, search])

  const total = messages?.length ?? 0

  return (
    <Panel
      title="Təbrik məktubları"
      description={messages ? `${total} məktub` : undefined}
      icon={MessageSquare}
      actions={total > 3 ? <SearchInput value={search} onChange={setSearch} placeholder="Ad və ya mətn" className="w-full sm:w-64" /> : null}
    >
      {error && <Notice tone="danger" title={error} className="mb-4" />}

      {!messages && !error && (
        <div className="space-y-3" aria-busy="true">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {messages && total === 0 && (
        <EmptyState
          icon={MessageSquare}
          title="Hələ təbrik yoxdur"
          text="Qonaqlar dəvətnamədəki «Təbrik» bölməsindən yazanda məktublar burada görünəcək."
        />
      )}

      {messages && total > 0 && list.length === 0 && (
        <EmptyState compact icon={MessageSquare} title="Axtarışa uyğun məktub yoxdur" />
      )}

      {list.length > 0 && (
        <ul className="divide-y divide-[#EFE9DF]">
          {list.map((m, i) => (
            <li key={`${m.created_at}-${i}`} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-[14px] font-semibold text-espresso">{m.name || 'Qonaq'}</p>
                <time className="text-[12px] tabular-nums text-[#6B5E54]" dateTime={m.created_at}>
                  {azDate(m.created_at, { time: true })}
                </time>
              </div>
              <p className="mt-1 whitespace-pre-line break-words text-[14px] leading-relaxed text-[#3F342E]">{m.text}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
