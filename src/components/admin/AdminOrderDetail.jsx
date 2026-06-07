import { useState, useEffect } from 'react'
import { ArrowLeft, Package, User, Users, Calendar, MapPin, Shirt, ExternalLink, MessageCircle, CheckCircle, XCircle, Trash2, Copy, Link2 } from 'lucide-react'
import { getDraftByCode, approveDraft, rejectDraft, deleteDraft } from '../../utils/api'
import AdminRSVPBlock from './AdminRSVPBlock'

const PKG_LABEL = { SADE: 'Sadə (59₼)', VIP: 'VİP (89₼)', PREMIUM: 'Premium (129₼)' }
const STATUS_COLOR = {
  submitted: 'oklch(45% 0.08 70)', approved: 'oklch(38% 0.1 145)',
  rejected: 'oklch(40% 0.12 25)', draft: 'oklch(50% 0.03 60)', deleted: 'oklch(40% 0.02 0)',
}

const STATUS_LABELS = {
  submitted: 'Yeni', approved: 'Təsdiqləndi', rejected: 'Rədd edildi',
  deleted: 'Silinmiş', draft: 'Qaralama',
}

function InviteLinkBlock({ draftCode, approvedSlug, status, onEdit }) {
  const [copied, setCopied] = useState(false)
  const inviteUrl = approvedSlug ? `https://digitoy.az/invite/${approvedSlug}` : null

  const handleCopy = () => {
    if (!inviteUrl) return
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <div style={{
      marginTop: 20,
      background: 'oklch(97% 0.01 80)',
      border: '1px solid oklch(88% 0.02 60)',
      borderRadius: 6, padding: '18px 22px',
    }}>
      {/* Sifariş Kodu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'oklch(55% 0.03 60)', minWidth: 96 }}>
          Sifariş Kodu
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: 'oklch(38% 0.08 75)', letterSpacing: '0.08em' }}>
          {draftCode}
        </span>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: inviteUrl ? 16 : 0 }}>
        <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'oklch(55% 0.03 60)', minWidth: 96 }}>
          Status
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: STATUS_COLOR[status] || STATUS_COLOR.draft,
        }}>
          {STATUS_LABELS[status] || status}
        </span>
      </div>

      {/* Dəvətnamə Linki — yalnız approve + slug varsa */}
      {inviteUrl && (
        <div>
          <div style={{ height: 1, background: 'oklch(88% 0.02 60)', margin: '0 0 14px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Link2 size={12} strokeWidth={1.5} style={{ color: 'oklch(55% 0.07 145)', flexShrink: 0 }} />
            <span style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'oklch(55% 0.03 60)' }}>
              Dəvətnamə Linki
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'monospace', fontSize: 12, color: 'oklch(38% 0.1 220)',
                textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', flex: 1,
              }}
            >
              {inviteUrl}
            </a>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', flexShrink: 0,
                background: copied ? 'oklch(38% 0.1 145)' : 'oklch(45% 0.08 75)',
                border: 'none', borderRadius: 3, cursor: 'pointer',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'white', transition: 'background 0.2s',
              }}
            >
              <Copy size={11} strokeWidth={2} />
              {copied ? 'Kopyalandı!' : 'Kopyala'}
            </button>
          </div>
        </div>
      )}

      {/* Approved amma slug tapılmadı — yenidən saxlama tələb olunur */}
      {status === 'approved' && !inviteUrl && (
        <div style={{ marginTop: 12, padding: '14px 16px', background: 'oklch(96% 0.025 75)', borderRadius: 4, border: '1px solid oklch(84% 0.05 75)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'oklch(40% 0.05 75)', margin: '0 0 6px' }}>
            Dəvətnamə linki tapılmadı
          </p>
          <p style={{ fontSize: 11, color: 'oklch(52% 0.03 60)', margin: '0 0 12px', lineHeight: 1.5 }}>
            Linki əldə etmək üçün sifarişi yenidən açıb saxla.
          </p>
          <button
            type="button"
            onClick={onEdit}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', background: 'oklch(45% 0.08 75)',
              border: 'none', borderRadius: 3, cursor: 'pointer',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'white',
            }}
          >
            Sifarişi yenidən aç və saxla
          </button>
        </div>
      )}
    </div>
  )
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

/* Token client-side yoxla — server round-trip olmadan */
function isAdminTokenValid() {
  try {
    const token = sessionStorage.getItem('adminToken')
    const exp   = parseInt(sessionStorage.getItem('adminTokenExp') || '0', 10)
    return !!(token && exp && Date.now() < exp * 1000)
  } catch { return false }
}

function redirectToLogin() {
  sessionStorage.removeItem('adminToken')
  sessionStorage.removeItem('adminTokenExp')
  window.location.href = '/admin'
}

export default function AdminOrderDetail({ draftCode, onBack, lang = 'az' }) {
  const [draft,         setDraft]         = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionDone,    setActionDone]    = useState('')
  const [rejectModal,   setRejectModal]   = useState(false)
  const [rejectReason,  setRejectReason]  = useState('')
  const [deleteModal,   setDeleteModal]   = useState(false)
  const [sessionError,  setSessionError]  = useState(false)

  /* Komponent yükləndikdə token yoxla */
  useEffect(() => {
    if (!isAdminTokenValid()) setSessionError(true)
  }, [])

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

  const handleApprove = async () => {
    if (!isAdminTokenValid()) { setSessionError(true); return }
    if (!window.confirm('Bu sifarişi TƏSDİQLƏYİRSİNİZ?')) return
    setActionLoading(true)
    try {
      await approveDraft(draftCode)
      setDraft(prev => ({ ...prev, status: 'approved' }))
      setActionDone('approved')
    } catch {
      alert('Xəta: təsdiq edilmədi.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectConfirm = async () => {
    if (!isAdminTokenValid()) { setSessionError(true); setRejectModal(false); return }
    setActionLoading(true)
    try {
      await rejectDraft(draftCode, rejectReason)
      setDraft(prev => ({ ...prev, status: 'rejected' }))
      setActionDone('rejected')
      setRejectModal(false)
    } catch {
      alert('Xəta: rədd edilmədi.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!isAdminTokenValid()) { setSessionError(true); setDeleteModal(false); return }
    setActionLoading(true)
    try {
      await deleteDraft(draftCode)
      setDeleteModal(false)
      onBack()
    } catch (err) {
      setActionLoading(false)
      setDeleteModal(false)
      const is401 = err?.message?.includes('401')
      if (is401) { setSessionError(true) }
      else { alert('Xəta: sifariş silinmədi. (' + (err?.message || '') + ')') }
    }
  }

  /* Sessiya bitib → tam ekran prompt */
  if (sessionError) return (
    <div style={{ padding: '64px 36px', maxWidth: 420 }}>
      <div style={{
        background: 'oklch(96% 0.03 70)', border: '1px solid oklch(85% 0.06 75)',
        borderRadius: 6, padding: '24px 28px',
      }}>
        <p style={{ fontSize: 14, color: 'oklch(30% 0.03 60)', margin: '0 0 16px', fontWeight: 500 }}>
          Admin sessiyası bitib
        </p>
        <p style={{ fontSize: 12, color: 'oklch(50% 0.03 60)', margin: '0 0 20px', lineHeight: 1.5 }}>
          Admin token 8 saat etibarlıdır. Yenidən daxil olmaq üçün aşağıdakı düyməni kliklə.
        </p>
        <button
          type="button"
          onClick={redirectToLogin}
          style={{
            padding: '10px 22px', background: 'oklch(45% 0.08 75)',
            border: 'none', borderRadius: 3, cursor: 'pointer',
            fontSize: 12, color: 'white', fontWeight: 600, letterSpacing: '0.06em',
          }}
        >
          Yenidən daxil ol
        </button>
      </div>
    </div>
  )

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
  const rsvpDeadlineStr = fd.rsvpDeadline ? new Date(fd.rsvpDeadline).toLocaleDateString('az-AZ', { day: '2-digit', month: 'long', year: 'numeric' }) : ''

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
            {actionDone === 'approved' && (
              <span style={{ fontSize: 11, color: 'oklch(38% 0.1 145)', fontWeight: 600 }}>✓ Təsdiqləndi</span>
            )}
            {actionDone === 'rejected' && (
              <span style={{ fontSize: 11, color: 'oklch(40% 0.12 25)', fontWeight: 600 }}>✗ Rədd edildi</span>
            )}
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond","Playfair Display",serif',
            fontSize: 22, fontWeight: 300, color: 'oklch(18% 0.02 60)',
            margin: 0, letterSpacing: '-0.01em',
          }}>
            {names || '—'}
          </h1>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {/* Approve — yalnız submitted vəziyyətdə */}
          {draft.status === 'submitted' && (
            <button
              type="button"
              onClick={handleApprove}
              disabled={actionLoading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', background: 'oklch(38% 0.1 145)',
                border: 'none', borderRadius: 3, cursor: actionLoading ? 'not-allowed' : 'pointer',
                fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'white', fontWeight: 600, opacity: actionLoading ? 0.6 : 1,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { if (!actionLoading) e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { if (!actionLoading) e.currentTarget.style.opacity = '1' }}
            >
              <CheckCircle size={13} strokeWidth={2} />
              Təsdiq et
            </button>
          )}

          {/* Reject — submitted vəziyyətdə */}
          {draft.status === 'submitted' && (
            <button
              type="button"
              onClick={() => setRejectModal(true)}
              disabled={actionLoading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', background: 'white',
                border: '1px solid oklch(75% 0.08 25)', borderRadius: 3,
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'oklch(40% 0.12 25)', fontWeight: 600,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!actionLoading) e.currentTarget.style.background = 'oklch(97% 0.02 25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
            >
              <XCircle size={13} strokeWidth={2} />
              Rədd et
            </button>
          )}

          {/* Edit */}
          <button
            type="button"
            onClick={handleEdit}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 18px', background: 'oklch(72% 0.12 80)',
              border: 'none', borderRadius: 3, cursor: 'pointer',
              fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'white', fontWeight: 600,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            <ExternalLink size={12} strokeWidth={2} />
            Redaktə et
          </button>

          {/* Delete — hər zaman mövcuddur (artıq silinmiş deyilsə) */}
          {draft.status !== 'deleted' && (
            <button
              type="button"
              onClick={() => setDeleteModal(true)}
              disabled={actionLoading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 14px', background: 'white',
                border: '1px solid oklch(80% 0.04 25)', borderRadius: 3,
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                fontSize: 11, color: 'oklch(48% 0.1 25)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!actionLoading) e.currentTarget.style.background = 'oklch(97% 0.02 25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
              title="Sifarişi sil"
            >
              <Trash2 size={13} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Delete modal */}
      {deleteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: 'white', borderRadius: 8, padding: '32px 36px',
            width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'oklch(95% 0.03 25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={14} strokeWidth={1.5} style={{ color: 'oklch(45% 0.1 25)' }} />
              </div>
              <h2 style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: 19, fontWeight: 400, margin: 0, color: 'oklch(20% 0.02 60)' }}>
                Sifarişi sil
              </h2>
            </div>
            <p style={{ fontSize: 13, color: 'oklch(40% 0.03 60)', margin: '0 0 6px', lineHeight: 1.5 }}>
              Sifarişi silmək istədiyinizə əminsiniz?
            </p>
            <p style={{ fontSize: 11, color: 'oklch(60% 0.03 60)', margin: '0 0 24px' }}>
              <strong style={{ fontFamily: 'monospace' }}>{draftCode}</strong> — bu əməliyyat geri alına bilər (status yenidən dəyişilə bilər).
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setDeleteModal(false)}
                style={{ padding: '9px 20px', background: 'white', border: '1px solid oklch(82% 0.02 60)', borderRadius: 3, cursor: 'pointer', fontSize: 12, color: 'oklch(45% 0.03 60)' }}>
                Ləğv et
              </button>
              <button type="button" onClick={handleDeleteConfirm} disabled={actionLoading}
                style={{
                  padding: '9px 20px',
                  background: actionLoading ? 'oklch(70% 0.06 25)' : 'oklch(45% 0.1 25)',
                  border: 'none', borderRadius: 3,
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  fontSize: 12, color: 'white', fontWeight: 600, letterSpacing: '0.04em',
                }}>
                {actionLoading ? 'Silinir...' : 'Bəli, sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white', borderRadius: 8, padding: '32px 36px',
            width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          }}>
            <h2 style={{
              fontFamily: '"Cormorant Garamond",serif', fontSize: 20, fontWeight: 400,
              margin: '0 0 8px', color: 'oklch(20% 0.02 60)',
            }}>
              Sifarişi rədd et
            </h2>
            <p style={{ fontSize: 12, color: 'oklch(55% 0.03 60)', margin: '0 0 20px' }}>
              <strong style={{ fontFamily: 'monospace' }}>{draftCode}</strong> — bu əməliyyat geri alına bilər (statusu yenidən dəyişmək mümkündür).
            </p>
            <textarea
              placeholder="Rədd səbəbi (ixtiyari)..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', fontSize: 13,
                border: '1px solid oklch(82% 0.02 60)', borderRadius: 4,
                resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit', color: 'oklch(25% 0.02 60)',
              }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => { setRejectModal(false); setRejectReason('') }}
                style={{
                  padding: '9px 20px', background: 'white',
                  border: '1px solid oklch(82% 0.02 60)', borderRadius: 3,
                  cursor: 'pointer', fontSize: 12, color: 'oklch(45% 0.03 60)',
                }}
              >
                Ləğv et
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={actionLoading}
                style={{
                  padding: '9px 20px',
                  background: actionLoading ? 'oklch(75% 0.06 25)' : 'oklch(45% 0.12 25)',
                  border: 'none', borderRadius: 3,
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  fontSize: 12, color: 'white', fontWeight: 600, letterSpacing: '0.06em',
                }}
              >
                {actionLoading ? 'Göndərilir...' : 'Rədd et'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details card */}
      <div style={{
        background: 'white', border: '1px solid oklch(88% 0.02 60)',
        borderRadius: 6, padding: '24px 28px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 32px',
      }}>
        <InfoRow icon={Package}  label="Paket"  value={PKG_LABEL[draft.package] || draft.package} />
        <InfoRow icon={User}     label="Hadisə" value={fd.eventType} />
        <InfoRow icon={Calendar} label="Tarix"  value={[dateStr, timeStr].filter(Boolean).join(', ')} />
        {rsvpDeadlineStr && (
          <InfoRow icon={Calendar} label="RSVP Son Tarix" value={rsvpDeadlineStr} />
        )}
        <InfoRow icon={MapPin}   label="Məkan"  value={fd.venueName} />
        <InfoRow icon={Shirt}    label="Dress Code" value={fd.dressCodePalette} />
        {fd.seatingMethod === 'digitory' && (
          <InfoRow icon={Users} label="Oturma Planı" value="DigiToy dolduracaq (+15 AZN)" />
        )}
        {fd.seatingMethod === 'self' && fd.seatingPlan && (
          <InfoRow icon={Users} label="Oturma Planı" value="Müştəri doldurdu" />
        )}
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

      {/* ── Sifariş Kodu + Dəvətnamə Linki bloku ── */}
      <InviteLinkBlock draftCode={draftCode} approvedSlug={draft.approved_slug} status={draft.status} onEdit={handleEdit} />

      {/* ── RSVP Cavabları — yalnız approved + slug varsa ── */}
      {draft.status === 'approved' && draft.approved_slug && (
        <AdminRSVPBlock slug={draft.approved_slug} names={names} />
      )}
    </div>
  )
}
