import { useCallback, useEffect, useState } from 'react'
import { BellRing, Check, Copy, Undo2 } from 'lucide-react'
import { Button, Notice, Panel, RefreshButton } from './v2/adminUi'
import { azDate } from './adminFormat'
import { adminHeaders } from '../../utils/api'

/* ─────────────────────────────────────────────────────────────────────────────
   Admin «Albom saxlama» (2026-11) — məxfilik siyasəti §7 / şərtlər §5.

   Albom tədbirdən 30 gün sonra silinir, amma YALNIZ sifarişçiyə xəbərdarlıq
   göndərildikdən sonra: admin WhatsApp mətnini kopyalayıb göndərir və
   «Xəbərdarlıq göndərildi» basır. Gec göndərilsə silinmə bildirişdən ən azı
   7 gün sonradır. Silmənin özü avtomatikdir (retention.php → album_retention.php).
   ───────────────────────────────────────────────────────────────────────── */

const BASE = import.meta.env.VITE_API_URL || '/api'

const STATE = {
  due:        { label: 'Silinmə vaxtıdır',        tone: 'text-[#9A3B2E] bg-[#F7E9E5]' },
  notice_due: { label: 'Xəbərdarlıq lazımdır',    tone: 'text-[#8A5A12] bg-[#FBF1DC]' },
  notified:   { label: 'Xəbərdarlıq göndərilib',  tone: 'text-[#4F6B3A] bg-[#EDF2E6]' },
  active:     { label: 'Saxlanılır',              tone: 'text-[#5C4A3A] bg-[#F3EEE6]' },
  no_date:    { label: 'Tədbir tarixi yoxdur',    tone: 'text-[#5C4A3A] bg-[#F3EEE6]' },
  forever:    { label: 'Müddətsiz (ödənişli)',    tone: 'text-[#4F6B3A] bg-[#EDF2E6]' },
  purged:     { label: 'Silinib',                 tone: 'text-[#6B5E54] bg-[#F1EFEC]' },
}

/* Ödənişli uzadılma — server: album_retention.php › ALBUM_EXTEND_OPTIONS */
const EXTEND = [
  { id: '3m', label: '+3 ay' },
  { id: '6m', label: '+6 ay' },
  { id: '1y', label: '+1 il' },
  { id: 'forever', label: 'Müddətsiz' },
]

const addDays = (ymd, n) => {
  const d = new Date(ymd + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Bu gün göndərilsə silinmə tarixi: saxlanma tarixi, amma bu gündən ən azı N gün sonra */
function deleteDateIfNotifiedToday(album, today, minDays) {
  const earliest = addDays(today, minDays)
  const keep = album.schedule.keepUntil
  return keep && keep > earliest ? keep : earliest
}

function noticeText(album, date) {
  const who = album.names ? `«${album.names}» dəvətnaməsinin` : 'Dəvətnamənizin'
  return `Salam! DigiToy-dan yazırıq. ${who} qonaq foto albomu ${azDate(date, { long: true })} tarixində silinəcək `
    + '(albom tədbirdən sonra 1 ay saxlanılır). Şəkil və videoları ondan əvvəl Müştəri panelinizin «Qonaq şəkilləri» '
    + 'bölməsindən endirə bilərsiniz. Albomu daha uzun saxlamaq istəsəniz, əlavə ödənişlə müddəti uzada bilərik. Təşəkkür edirik!'
}

async function api(method, body) {
  const res = await fetch(`${BASE}/admin_album_retention.php`, {
    method,
    headers: { ...adminHeaders(), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || `album_retention: ${res.status}`)
  return json
}

export default function AlbumRetention() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null)
  const [copied, setCopied] = useState(null)

  const fetchList = useCallback(() => api('GET')
    .then((d) => { setData(d); setError('') })
    .catch(() => setError('Albom saxlama siyahısı yüklənmədi.'))
    .finally(() => setLoading(false)), [])
  const load = () => { setLoading(true); fetchList() }

  useEffect(() => { fetchList() }, [fetchList])

  const act = async (slug, action, option) => {
    setBusy(slug)
    try { await api('POST', { slug, action, option }); load() }
    catch (e) { setError(e.message) }
    finally { setBusy(null) }
  }

  const copy = (album) => {
    const text = noticeText(album, deleteDateIfNotifiedToday(album, data.today, data.rules.minNoticeDays))
    navigator.clipboard?.writeText(text).then(
      () => { setCopied(album.slug); setTimeout(() => setCopied(null), 2200) },
      () => window.prompt('Bu mətni kopyalayıb WhatsApp ilə göndərin:', text),
    )
  }

  const albums = data?.albums || []
  const pending = albums.filter((a) => a.schedule.state === 'notice_due').length

  return (
    <Panel
      title="Albom saxlama"
      description={data
        ? `Albom tədbirdən ${data.rules.keepDays} gün sonra silinir. Xəbərdarlıq ${data.rules.noticeDays} gün əvvəl göndərilir; gecikərsə, silinmə bildirişdən ən azı ${data.rules.minNoticeDays} gün sonradır. Xəbərdarlıq qeyd edilməyən albom silinmir.`
        : undefined}
      icon={BellRing}
      actions={<RefreshButton onClick={load} refreshing={loading && !!data} />}
      className="mb-5"
    >
      <div className="space-y-3 px-4 pb-4 sm:px-5">
        {error && <Notice tone="danger" title={error} />}
        {pending > 0 && <Notice tone="warning" title={`${pending} albom üçün xəbərdarlıq göndərmək vaxtıdır.`} />}
        {data && albums.length === 0 && <p className="text-[13px] text-[#6B5E54]">Hələ qonaq albomu yoxdur.</p>}
        {albums.map((a) => {
          const s = a.schedule
          const st = STATE[s.state] || STATE.active
          return (
            <div key={a.slug} className="flex flex-col gap-3 rounded-[10px] bg-[#FAF8F4] p-3 ring-1 ring-inset ring-[#EFE9DF] sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-espresso">{a.names || a.slug}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-[#6B5E54]">
                  {a.files} fayl · {a.mb} MB
                  {s.event && <> · tədbir {azDate(s.event)}</>}
                  {s.keepUntil && s.state !== 'purged' && <> · saxlanma {azDate(s.keepUntil)}-dək{s.extended && ' (uzadılıb)'}</>}
                  {s.noticeAt && <> · xəbər {azDate(s.noticeAt)}</>}
                  {s.deleteAt && s.state !== 'purged' && <> · <strong className="text-espresso">silinmə {azDate(s.deleteAt)}</strong></>}
                </p>
              </div>
              <span className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${st.tone}`}>{st.label}</span>
              {s.state !== 'purged' && (
                <div className="flex shrink-0 flex-wrap gap-2">
                  <select
                    aria-label={`${a.names || a.slug} — ödənişli uzadılma`}
                    value=""
                    disabled={busy === a.slug}
                    onChange={(e) => { if (e.target.value) act(a.slug, 'extend', e.target.value) }}
                    className="h-9 rounded-[8px] bg-white px-2 text-[12.5px] text-espresso ring-1 ring-inset ring-[#E5DED2]"
                  >
                    <option value="">Uzat (ödənişli)…</option>
                    {EXTEND.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                    {s.extended && <option value="clear">Uzadılmanı ləğv et</option>}
                  </select>
                  {s.state !== 'no_date' && s.state !== 'forever' && !s.noticeAt && (
                    <>
                      <Button size="sm" icon={copied === a.slug ? Check : Copy} onClick={() => copy(a)}>
                        {copied === a.slug ? 'Kopyalandı' : 'WhatsApp mətni'}
                      </Button>
                      <Button size="sm" variant="primary" loading={busy === a.slug} onClick={() => act(a.slug, 'notice')}>
                        Xəbərdarlıq göndərildi
                      </Button>
                    </>
                  )}
                  {s.noticeAt && s.state !== 'forever' && (
                    <Button size="sm" variant="ghost" icon={Undo2} loading={busy === a.slug} onClick={() => act(a.slug, 'undo')}>
                      Geri al
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
