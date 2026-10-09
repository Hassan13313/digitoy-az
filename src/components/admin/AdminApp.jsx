import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import AdminDashboard from './AdminDashboard'
import AdminOrdersList from './AdminOrdersList'
import AdminOrderDetail from './AdminOrderDetail'
import AdminInvitationsList from './AdminInvitationsList'
import AdminPhotosList from './AdminPhotosList'
import AdminQrStand from './AdminQrStand'
import AdminGuestbook from './AdminGuestbook'
import AdminMaintenance from './AdminMaintenance'
import { pushView, goBackOr, savedScroll, restoreScroll } from '../../utils/navHistory'

/** /admin/orders/DT-X → { section: 'order-detail', draftCode: 'DT-X' } */
function parseAdminUrl() {
  const match = window.location.pathname.match(/^\/admin(?:\/([^/?]+)(?:\/([^/?]+))?)?/)
  const sec = match?.[1] || 'dashboard'
  const id  = match?.[2] || null
  return sec === 'orders' && id ? { section: 'order-detail', draftCode: id } : { section: sec, draftCode: null }
}

export default function AdminApp({ lang = 'az', setLang }) {
  const [section,   setSection]   = useState(() => parseAdminUrl().section)
  const [draftCode, setDraftCode] = useState(() => parseAdminUrl().draftCode)

  /* Brauzerin GERİ/İRƏLİ düymələri (2026-10-09: əvvəl popstate dinlənilmirdi,
     GERİ yalnız URL-i dəyişirdi, ekran eyni qalırdı) */
  useEffect(() => {
    const onPop = () => {
      if (!window.location.pathname.startsWith('/admin')) return
      const r = parseAdminUrl()
      setSection(r.section)
      setDraftCode(r.draftCode)
      const y = savedScroll()
      if (y != null) restoreScroll(y)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const DETAIL_KEY = { orders: 'order-detail' }

  const navigate = (sec, id = null) => {
    const path = id ? `/admin/${sec}/${id}` : `/admin/${sec}`
    pushView(path)
    setSection(id ? (DETAIL_KEY[sec] || `${sec}-detail`) : sec)
    if (sec === 'orders' && id) setDraftCode(id)
    window.scrollTo(0, 0)
  }

  const handleSelectOrder = (code) => navigate('orders', code)

  /* Siyahıdan gəlinibsə — ora, eyni scroll mövqeyinə; birbaşa linkdə siyahını aç */
  const handleBack = () => goBackOr(() => navigate('orders'), '/admin/orders')

  return (
    <AdminLayout section={section.replace('-detail', '')} onNavigate={(sec) => navigate(sec)}>
      {section === 'dashboard'    && <AdminDashboard onNavigate={(sec) => navigate(sec)} />}
      {section === 'orders'       && <AdminOrdersList onSelectOrder={handleSelectOrder} />}
      {section === 'order-detail' && <AdminOrderDetail draftCode={draftCode} onBack={handleBack} lang={lang} />}
      {section === 'invitations'  && <AdminInvitationsList />}
      {section === 'photos'       && <AdminPhotosList />}
      {section === 'qrstand'      && <AdminQrStand />}
      {section === 'guestbook'    && <AdminGuestbook />}
      {section === 'maintenance'  && <AdminMaintenance />}
    </AdminLayout>
  )
}
