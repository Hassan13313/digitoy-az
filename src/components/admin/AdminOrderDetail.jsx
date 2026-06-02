import { useState, useEffect } from 'react'
import { ArrowLeft, Package, User, Calendar, MapPin, Shirt, ExternalLink, MessageCircle } from 'lucide-react'
import { getDraftByCode } from '../../utils/api'

const PKG_LABEL = { SADE: 'Sadə (59₼)', VIP: 'VİP (89₼)', PREMIUM: 'Premium (129₼)' }
const STATUS_COLOR = {
  submitted: 'oklch(45% 0.08 70)', approved: 'oklch(38% 0.1 145)',
  rejected: 'oklch(40% 0.12 25)', draft: 'oklch(50% 0.03 60)',
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 12 }}>
      <Icon size={14} strokeWidth={1.5} style={{ color: 'oklch(65% 0.06 80)', marginTop: 1, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'oklch(60% 0.03 60)', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 13, color: 'oklch(22% 0.02 60)', fontWeight: 500 }}>
          {value}
        </div>
      </div>
    </div>
  )
}

export default function AdminOrderDetail({ draftCode, onBack, lang = 'az' }) {
  const [draft,   setDraft]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (!draftCode) return
    setLoading(true)
    getDraftByCode(draftCode)
      .then(d => { setDraft(d); setLoading(false) })
      .catch(() => { setError('Sifariş yüklənmədi.'); setLoading(false) })
  }, [draftCode])

  const handleEdit = () => {
    const adminKey = import.meta.env.VITE_ADMIN_KEY || ''
    window.location.href = `/?admin=${adminKey}&draft=${draftCode}`
  }

  if (loading) return (
    <div style={{ padding: '64px 36px', textAlign: 'center', color: 'oklch(60% 0.03 60)', fontSize: 13 }}>
      Yüklənir...
    </div>
  )

  if (error || !draft?.found) return (
    <div style={{ padding: '64px 36px' }}>
      <button type="button" onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(55% 0.04 70)', fontSize: 12, marginBottom: 24 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Geri
      </button>
      <p style={{ color: 'oklch(45% 0.1 25)', fontSize: 13 }}>{error || 'Sifariş tapılmadı.'}</p>
    </div>
  )

  const fd = draft.form_data || {}
  const isCouple = ['toy', 'nishan'].includes(fd.eventType)
  const isCorp = ['corporate', 'other'].includes(fd.eventType)
  const names = isCouple
    ? `${fd.brideName || ''} & ${fd.groomName || ''}`.trim()
    : isCorp ? (fd.eventName || '') : (fd.brideName || '')

  const dateStr = fd.date ? new Date(fd.date).toLocaleDateString('az-AZ', { day: '2-digit', month: 'long', year: 'numeric' }) : ''
  const timeStr = fd.time || ''

  return (
    <div style={{ padding: '32px 36px', maxWidth: 640 }}>
      {/* Header */}
      <button type="button" onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(55% 0.04 70)', fontSize: 12, marginBottom: 28, letterSpacing: '0.04em' }}>
        <ArrowLeft size={13} strokeWidth={1.5} /> Sifarişlərə qayıt
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: 'oklch(45% 0.07 75)', letterSpacing: '0.06em' }}>
              {draftCode}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: STATUS_COLOR[draft.status] || STATUS_COLOR.draft,
              background: 'oklch(95% 0.02 80)', padding: '2px 8px', borderRadius: 3,
            }}>
              {draft.status}
            </span>
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",serif',
            fontSize: 22, fontWeight: 300, color: 'oklch(18% 0.02 60)',
            margin: 0, letterSpacing: '-0.01em',
          }}>
            {names || '—'}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleEdit}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '10px 20px',
            background: 'oklch(72% 0.12 80)',
            border: 'none', borderRadius: 3, cursor: 'pointer',
            fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'white', fontWeight: 600, flexShrink: 0,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          <ExternalLink size={12} strokeWidth={2} />
          Redaktə et
        </button>
      </div>

      {/* Details card */}
      <div style={{
        background: 'white', border: '1px solid oklch(88% 0.02 60)',
        borderRadius: 6, padding: '24px 28px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px',
      }}>
        <InfoRow icon={Package}  label="Paket"  value={PKG_LABEL[draft.package] || draft.package} />
        <InfoRow icon={User}     label="Hadisə" value={fd.eventType} />
        <InfoRow icon={Calendar} label="Tarix"  value={[dateStr, timeStr].filter(Boolean).join(', ')} />
        <InfoRow icon={MapPin}   label="Məkan"  value={fd.venueName} />
        <InfoRow icon={Shirt}    label="Dress Code" value={fd.dressCodePalette} />
        {draft.customer_phone && (
          <InfoRow icon={User} label="Telefon" value={draft.customer_phone} />
        )}
      </div>

      {/* WhatsApp düyməsi — yalnız telefon varsa */}
      {draft.customer_phone && (
        <div style={{ marginTop: 20 }}>
          <a
            href={`https://wa.me/${draft.customer_phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              borderRadius: 4, textDecoration: 'none',
              fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'white', fontWeight: 700,
              boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            <MessageCircle size={14} strokeWidth={2} />
            WhatsApp-a Yaz
          </a>
          <span style={{ fontSize: 11, color: 'oklch(55% 0.03 60)', marginLeft: 12 }}>
            {draft.customer_phone}
          </span>
        </div>
      )}

      {/* Submitted at */}
      {draft.submitted_at && (
        <p style={{ fontSize: 11, color: 'oklch(60% 0.03 60)', marginTop: 16, letterSpacing: '0.04em' }}>
          Göndərilmə tarixi: {new Date(draft.submitted_at).toLocaleString('az-AZ')}
        </p>
      )}
    </div>
  )
}
