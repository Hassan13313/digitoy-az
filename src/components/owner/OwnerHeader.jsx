import { CalendarDays, ExternalLink, MapPin } from 'lucide-react'
import { Button, Notice, RefreshButton, Skeleton } from '../admin/v2/adminUi'
import { azDate } from '../admin/adminFormat'
import { formatTime24 } from '../../utils/dateFormat'
import t from '../../data/translations'

/* ─────────────────────────────────────────────────────────────────────────────
   Müştəri paneli — başlıq (Phase 50): adlar, tarix, məkan, «canlı» xətti.
   Yalnız görünüş; məlumat OwnerPanel-dən gəlir. Tədbir növü — builderdəki ad.
   ───────────────────────────────────────────────────────────────────────── */

const hhmm = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

export default function OwnerHeader({ panel, slug, updatedAt, refreshing, onRefresh }) {
  if (!panel) {
    return (
      <div className="mb-6 space-y-3" aria-busy="true">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-48" />
      </div>
    )
  }

  const { event = {}, active } = panel
  const time = event.time ? formatTime24(event.time) : ''
  const date = event.date ? azDate(event.date, { long: true }) : ''

  return (
    <header className="mb-6">
      <p className="text-[13px] font-medium text-[#6B5E54]">{t.az[`event_${event.type}`] || 'Dəvətnamə'}</p>
      <h1 className="mt-1 break-words font-serif text-[30px] font-medium leading-[1.1] text-espresso sm:text-[36px]">
        {event.names || 'Dəvətnaməniz'}
      </h1>

      <div className="mt-3 flex flex-col gap-1.5 text-[14px] text-[#5C4A3A] sm:flex-row sm:flex-wrap sm:gap-x-5">
        {date && (
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#6B5E54]" aria-hidden="true" />
            {time ? `${date}, saat ${time}` : date}
          </span>
        )}
        {event.venue && (
          <span className="inline-flex min-w-0 items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#6B5E54]" aria-hidden="true" />
            <span className="truncate">{event.venue}</span>
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <Button size="sm" icon={ExternalLink} href={`/invite/${encodeURIComponent(slug)}`} target="_blank" rel="noopener">
          Dəvətnaməni aç
        </Button>
        <span className="inline-flex items-center gap-2 text-[13px] text-[#6B5E54]" aria-live="polite">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#4F6B3A] opacity-40 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4F6B3A]" />
          </span>
          {updatedAt ? `Canlı — son yenilənmə ${hhmm(updatedAt)}` : 'Canlı'}
        </span>
        <RefreshButton onClick={onRefresh} refreshing={refreshing} />
      </div>

      {!active && (
        <Notice tone="warning" className="mt-5" title="Dəvətnamə hazırda bağlıdır">
          Qonaqlar linki açanda dəvətnaməni görmür. Məlumatlarınız burada qalır.
        </Notice>
      )}
    </header>
  )
}
