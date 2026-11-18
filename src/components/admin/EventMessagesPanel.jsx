import { useCallback, useEffect, useState } from 'react'
import { CalendarHeart, Check, MessageCircle, MessageSquareHeart, RotateCcw } from 'lucide-react'
import { getEventMessages, markEventMessage } from '../../utils/api'
import { customerWaUrl, formatPhoneDisplay } from '../../utils/customerPhone'
import { azDate } from './adminFormat'
import { Button, Notice, Panel } from './v2/adminUi'

/* ─────────────────────────────────────────────────────────────────────────────
   Toy günü təbriki və rəy mesajları — YARI-AVTOMATİK (2026-11-18)
   Siyahını server hesablayır (api/event_messages.php): bu gün tədbiri olanlara
   təbrik, 2 gün əvvəl olanlara rəy sorğusu (buraxılsa 7 günə qədər qalır).
   «WhatsApp-da göndər» mesajı hazır mətnlə açır və sətri «göndərildi» işarələyir;
   mesajı admin özü göndərir — nömrə bloklanma riski yoxdur, xərc yoxdur.
   ───────────────────────────────────────────────────────────────────────── */

export default function EventMessagesPanel() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    getEventMessages()
      .then((d) => { setData(d); setError('') })
      .catch(() => setError('Bu günün mesajları yüklənmədi.'))
  }, [])
  useEffect(() => { load() }, [load])

  const mark = async (item, kind, sent) => {
    setData((d) => d && ({
      ...d,
      [kind]: d[kind].map((x) => (x.code === item.code ? { ...x, sentAt: sent ? new Date().toISOString() : null } : x)),
    }))
    try { await markEventMessage(item.code, kind, sent) } catch { load() }
  }

  if (error) return <Notice tone="warning" title={error} className="mb-4" />
  if (!data) return null
  const total = data.congrats.length + data.review.length
  if (total === 0) return null

  return (
    <Panel title="Bu günün mesajları" icon={CalendarHeart} className="mb-5"
      description="Düymə WhatsApp-ı hazır mətnlə açır — «Göndər»ə özünüz basırsınız. Göndərilənlər işarələnir.">
      <div className="grid gap-5 lg:grid-cols-2">
        <MessageGroup title="Toy günü təbriki" icon={CalendarHeart} items={data.congrats} kind="congrats" onMark={mark}
          empty="Bu gün tədbiri olan müştəri yoxdur." />
        <MessageGroup title="Rəy sorğusu (2 gün sonra)" icon={MessageSquareHeart} items={data.review} kind="review" onMark={mark}
          empty="Rəy göndəriləcək müştəri yoxdur." />
      </div>
    </Panel>
  )
}

function MessageGroup({ title, icon: Icon, items, kind, onMark, empty }) {
  return (
    <section aria-label={title}>
      <h3 className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-espresso">
        <Icon className="h-4 w-4 text-[#8A7D72]" aria-hidden="true" />
        {title}
        <span className="rounded-full bg-[#F3EEE6] px-2 py-0.5 text-[12px] font-medium text-[#6B5E54]">
          {items.filter((i) => !i.sentAt).length}
        </span>
      </h3>
      {items.length === 0 ? (
        <p className="text-[13.5px] text-[#6B5E54]">{empty}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((i) => {
            const wa = customerWaUrl(i.phone, encodeURIComponent(i.text))
            return (
              <li key={i.code} className={`rounded-[10px] px-3.5 py-3 ring-1 ring-inset ${i.sentAt ? 'bg-[#F6F3ED] ring-[#E5DED2]' : 'bg-white ring-[#D9CBB0]'}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="text-[14.5px] font-medium text-espresso">{i.names || i.code}</p>
                  <p className="text-[12.5px] text-[#6B5E54] tabular-nums">
                    {formatPhoneDisplay(i.phone)} · {azDate(i.date)}{i.late ? ' · gecikib' : ''}
                  </p>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-[#6B5E54]">{i.text}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {i.sentAt ? (
                    <>
                      <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#4F6B3A]">
                        <Check className="h-4 w-4" aria-hidden="true" /> Göndərildi
                      </span>
                      <Button size="sm" variant="ghost" icon={RotateCcw} onClick={() => onMark(i, kind, false)}>Geri al</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="primary" icon={MessageCircle} href={wa} target="_blank" rel="noopener noreferrer"
                        onClick={() => onMark(i, kind, true)}>
                        WhatsApp-da göndər
                      </Button>
                      <Button size="sm" variant="ghost" icon={Check} onClick={() => onMark(i, kind, true)}>Göndərilib</Button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
