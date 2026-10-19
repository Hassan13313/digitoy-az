import { useEffect, useMemo, useState } from 'react'
import { ClipboardCheck, Images, MessageSquare, Users } from 'lucide-react'
import AdminRSVPBlock from '../admin/AdminRSVPBlock'
import AdminGuestReports from '../admin/AdminGuestReports'
import StatusPage from '../public/StatusPage'
import { Wordmark } from '../public/shared'
import { EmptyState, TabPanel, Tabs } from '../admin/v2/adminUi'
import OwnerHeader from './OwnerHeader'
import OwnerGuestbook from './OwnerGuestbook'
import OwnerPhotos from './OwnerPhotos'
import { getOwnerPanel } from '../../utils/ownerApi'
import { clearOwnerKey, getOwnerKey, storeOwnerKey, takeKeyFromLocation } from '../../utils/ownerKey'
import { useAutoRefresh } from '../../hooks/useAutoRefresh'
import { getSectionVisibility } from '../../data/sections'
import { SOCIAL_LINKS } from '../../data/constants'

/* ─────────────────────────────────────────────────────────────────────────────
   «Müştəri paneli» — /invite/<slug>/panel#k=<açar>  (Phase 50)

   Dəvətnamə sahibi admindən heç nə istəmədən öz məlumatını CANLI görür:
   iştirak təsdiqi, qonaq hesabatı, təbriklər, şəkillər. Hamısı YALNIZ OXU
   (şəkil idarəsi istisna — o, qalereya səhifəsinin öz icazəsidir).

   Hesabat tabları admin paneldəki komponentlərin ÖZÜDÜR (AdminRSVPBlock,
   AdminGuestReports): müştəri admin ilə eyni rəqəmləri görür. Server açarı
   X-Owner-Token başlığından tanıyır (utils/api.js › ownerHeaders).

   Hər 60 s-dən bir (yalnız tab görünəndə) yenilənir. Admin linki yeniləyibsə
   növbəti yoxlamada 401 gəlir → «Link etibarsızdır», açar silinir.
   ───────────────────────────────────────────────────────────────────────── */

const REFRESH_MS = 60000
const TAB_ID = 'owner'

function readBoot() {
  const m = window.location.pathname.match(/^\/invite\/([^/?#]+)\/panel\/?$/)
  const slug = m ? decodeURIComponent(m[1]) : ''
  const fromUrl = takeKeyFromLocation(window.location)
  return { slug, ...fromUrl, key: fromUrl.key || (slug ? getOwnerKey(slug) : null) }
}

const goHome = () => { window.location.href = '/' }
const openWhatsApp = () => { window.open(SOCIAL_LINKS.whatsapp, '_blank', 'noopener') }

export default function OwnerPanel() {
  const [boot] = useState(readBoot)
  const { slug, key } = boot
  const [panel, setPanel] = useState(null)       /* { data, at } — son uğurlu cavab */
  const [error, setError] = useState('')         /* '' | 'invalid' | 'network' */
  const [doneTick, setDoneTick] = useState(-1)   /* son cavab gəlmiş yenilənmə */
  const [tab, setTab] = useState('')
  const invalid = !key || error === 'invalid'
  const [tick, refresh] = useAutoRefresh(REFRESH_MS, !invalid)
  const busy = doneTick !== tick

  /* Açarı saxla və ünvan sətrindən sil (ekran görüntüsündə görünməsin) */
  useEffect(() => {
    if (key) storeOwnerKey(slug, key)
    const { pathname, search, hash } = window.location
    if (boot.cleanUrl !== pathname + search + hash) window.history.replaceState(window.history.state, '', boot.cleanUrl)
  }, [boot, slug, key])

  /* Eyni tabda YENİ link açılanda (məs. yenilənmiş link) yalnız #k dəyişir və
     səhifə yenidən yüklənmir — açarı təzədən oxumaq üçün yenidən yüklə */
  useEffect(() => {
    const onHash = () => { if (takeKeyFromLocation(window.location).key) window.location.reload() }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  /* Başlıq + açar yoxlaması: ilk açılışda və hər yenilənmədə */
  useEffect(() => {
    if (!key) return undefined
    let alive = true
    getOwnerPanel(slug)
      .then((d) => {
        if (!alive) return
        setPanel({ data: d, at: new Date() })
        setError('')
      })
      .catch((e) => {
        if (!alive) return
        /* 429 də yalnız SƏHV açara qaytarılır (düzgün açar limitdən əvvəl yoxlanılır) */
        const revoked = e.status === 401 || e.status === 400 || e.status === 429
        if (revoked) clearOwnerKey(slug)
        /* şəbəkə xətası: köhnə məlumat varsa göstərilməyə davam edir */
        setError(revoked ? 'invalid' : 'network')
      })
      .finally(() => { if (alive) setDoneTick(tick) })
    return () => { alive = false }
  }, [slug, key, tick])

  const data = panel?.data
  const tabs = useMemo(() => {
    if (!data) return []
    const vis = getSectionVisibility({ sections: data.sections || {} }, data.package)
    return [
      vis.rsvp && { id: 'rsvp', label: 'İştirak təsdiqi', icon: ClipboardCheck },
      (vis.rsvp || vis.seating) && { id: 'guests', label: 'Qonaq hesabatı', icon: Users },
      vis.guestbook && { id: 'guestbook', label: 'Təbriklər', icon: MessageSquare },
      vis.gallery && { id: 'photos', label: 'Şəkillər', icon: Images },
    ].filter(Boolean)
  }, [data])
  const activeTab = tabs.some((t) => t.id === tab) ? tab : tabs[0]?.id

  if (invalid) {
    return (
      <StatusPage
        variant="invite-not-found"
        title="Bu link etibarsızdır."
        text="Link yenilənib və ya tam kopyalanmayıb. Yeni müştəri paneli linki üçün DigiToy ilə əlaqə saxlayın."
        primaryLabel="WhatsApp ilə yaz"
        onPrimary={openWhatsApp}
        secondaryLabel="Ana səhifə"
        onSecondary={goHome}
      />
    )
  }
  if (error === 'network' && !data) {
    return (
      <StatusPage
        variant="not-found"
        code=""
        title="Panel açılmadı."
        text="Bağlantını yoxlayıb səhifəni yeniləyin. Problem qalsa, DigiToy ilə əlaqə saxlayın."
        primaryLabel="Yenidən cəhd et"
        onPrimary={() => window.location.reload()}
        secondaryLabel="WhatsApp ilə yaz"
        onSecondary={openWhatsApp}
      />
    )
  }

  const names = data?.event?.names || ''
  const dateStr = data?.event?.date || ''

  return (
    <div className="dt-page min-h-[100svh] bg-[#F6F3ED] text-espresso">
      <div className="border-b border-[#E5DED2] bg-white">
        <div className="mx-auto flex h-14 max-w-[960px] items-center justify-between px-4 sm:px-6">
          <a href="/" className="text-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9822F]" aria-label="Digitoy.az ana səhifə">
            <Wordmark />
          </a>
          <span className="text-[13px] font-medium text-[#6B5E54]">Müştəri paneli</span>
        </div>
      </div>

      <main className="mx-auto max-w-[960px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <OwnerHeader panel={data} slug={slug} updatedAt={panel?.at} refreshing={busy} onRefresh={refresh} />

        {data && tabs.length === 0 && (
          <EmptyState
            title="Bu paketdə hesabat bölməsi yoxdur"
            text="İştirak təsdiqi, təbriklər və şəkil bölmələri dəvətnamənizdə bağlıdır. Əlavə etmək üçün DigiToy ilə əlaqə saxlayın."
          />
        )}

        {data && tabs.length > 0 && (
          <>
            <Tabs tabs={tabs} value={activeTab} onChange={setTab} label="Panel bölmələri" idPrefix={TAB_ID} className="mb-5" />
            <TabPanel idPrefix={TAB_ID} id={activeTab}>
              {activeTab === 'rsvp' && <AdminRSVPBlock slug={slug} names={names} refreshSignal={tick} />}
              {activeTab === 'guests' && <AdminGuestReports slug={slug} names={names} dateStr={dateStr} refreshSignal={tick} />}
              {activeTab === 'guestbook' && <OwnerGuestbook slug={slug} refreshSignal={tick} />}
              {activeTab === 'photos' && <OwnerPhotos slug={slug} />}
            </TabPanel>
          </>
        )}

        <p className="mt-10 max-w-[62ch] text-[13px] leading-relaxed text-[#6B5E54]">
          Bu link yalnız sizə məxsusdur — onu qonaqlarla paylaşmayın. Səhifə hər dəqiqə özü yenilənir.
          Sualınız olsa,{' '}
          <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener" className="font-medium text-[#7D5B1F] underline underline-offset-2">
            WhatsApp-da yazın
          </a>.
        </p>
      </main>
    </div>
  )
}
