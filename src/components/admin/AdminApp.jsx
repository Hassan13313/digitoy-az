import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import AdminDashboard from './AdminDashboard'
import AdminOrdersList from './AdminOrdersList'
import AdminOrderDetail from './AdminOrderDetail'
import AdminInvitationsList from './AdminInvitationsList'
import AdminPhotosList from './AdminPhotosList'

export default function AdminApp({ lang = 'az', setLang }) {
  const [section,   setSection]   = useState('dashboard')
  const [draftCode, setDraftCode] = useState(null)

  /* URL-dən başlanğıc bölməni aşkar et */
  useEffect(() => {
    const match = window.location.pathname.match(/^\/admin(?:\/([^/?]+)(?:\/([^/?]+))?)?/)
    const sec = match?.[1] || 'dashboard'
    const id  = match?.[2] || null
    if (sec === 'orders' && id)  { setSection('order-detail'); setDraftCode(id) }
    else if (sec)                { setSection(sec) }
  }, [])

  const DETAIL_KEY = { orders: 'order-detail' }

  const navigate = (sec, id = null) => {
    const path = id ? `/admin/${sec}/${id}` : `/admin/${sec}`
    window.history.pushState({}, '', path)
    setSection(id ? (DETAIL_KEY[sec] || `${sec}-detail`) : sec)
    if (sec === 'orders' && id) setDraftCode(id)
  }

  const handleSelectOrder = (code) => navigate('orders', code)

  const handleBack = () => {
    window.history.pushState({}, '', '/admin/orders')
    setSection('orders')
    setDraftCode(null)
  }

  return (
    <AdminLayout section={section.replace('-detail', '')} onNavigate={(sec) => navigate(sec)}>
      {section === 'dashboard'    && <AdminDashboard />}
      {section === 'orders'       && <AdminOrdersList onSelectOrder={handleSelectOrder} />}
      {section === 'order-detail' && <AdminOrderDetail draftCode={draftCode} onBack={handleBack} lang={lang} />}
      {section === 'invitations'  && <AdminInvitationsList />}
      {section === 'photos'       && <AdminPhotosList />}
    </AdminLayout>
  )
}
