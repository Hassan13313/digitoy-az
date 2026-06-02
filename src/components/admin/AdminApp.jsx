import { useState, useEffect } from 'react'
import AdminLayout from './AdminLayout'
import AdminOrdersList from './AdminOrdersList'
import AdminOrderDetail from './AdminOrderDetail'

/* Placeholder-lar Phase 2-3-4 üçün */
function ComingSoon({ title }) {
  return (
    <div style={{ padding: '64px 36px', textAlign: 'center' }}>
      <p style={{
        fontFamily: '"Cormorant Garamond","Playfair Display",serif',
        fontSize: 22, fontWeight: 300, color: 'oklch(55% 0.03 60)',
        letterSpacing: '0.02em',
      }}>
        {title} — tezliklə
      </p>
    </div>
  )
}

export default function AdminApp({ lang = 'az', setLang }) {
  const [section,   setSection]   = useState('orders')
  const [draftCode, setDraftCode] = useState(null)

  /* URL-dən başlanğıc bölməni aşkar et */
  useEffect(() => {
    const match = window.location.pathname.match(/^\/admin(?:\/([^/?]+)(?:\/([^/?]+))?)?/)
    const sec = match?.[1] || 'orders'
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
      {section === 'orders'       && <AdminOrdersList onSelectOrder={handleSelectOrder} />}
      {section === 'order-detail' && <AdminOrderDetail draftCode={draftCode} onBack={handleBack} lang={lang} />}
      {section === 'invitations'  && <ComingSoon title="Dəvətnamələr" />}
      {section === 'photos'       && <ComingSoon title="Fotolar" />}
    </AdminLayout>
  )
}
