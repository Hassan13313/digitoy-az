import { useState, useEffect } from 'react'
import { Armchair, LogIn } from 'lucide-react'
import { DEFAULT_TEMPLATE_ID } from '../../templates/templateConfig'
import { getDraftByCode, approveDraft, rejectDraft, deleteDraft, saveInvitation } from '../../utils/api'
import { computeInviteSlug } from '../../utils/inviteSlug'
import AdminSeatingPlan from './AdminSeatingPlan'
import AdminGuestReports from './AdminGuestReports'
import AdminRSVPBlock from './AdminRSVPBlock'
import OrderDetail from './v2/OrderDetail'
import { Button, ConfirmDialog, EmptyState, Notice, PageHeader, Skeleton } from './v2/adminUi'
import { azDate } from './adminFormat'
import { templateMeta } from './templateMeta'

/* ─────────────────────────────────────────────────────────────────────────────
   Sifariş detalı — UI redesign 2026-10 (görünüş v2/OrderDetail)

   Məntiq dəyişməyib:
   • Təsdiq dəvətnaməni də yaradır (Phase 46 — save_invitation → approve_draft,
     builder-in «Sifarişi təsdiqlə» düyməsi ilə eyni ardıcıllıq). Təsdiqdən
     əvvəl soruşulur (köhnə window.confirm → təsdiq pəncərəsi).
   • Rədd et (səbəb ixtiyari), Sil (status «deleted»), Redaktə → /?draft=KOD.
   • Admin tokeni client-də yoxlanılır; bitibsə «Yenidən daxil ol».
   • Təsdiqlənmiş, amma dəvətnaməsi olmayan sifariş → «Dəvətnaməni yarat».
   • Qonaq alətləri (oturma planı, hesabat, iştirak təsdiqi) yalnız təsdiqdən sonra.
   ───────────────────────────────────────────────────────────────────────── */

/* Tədbir növü — əvvəl xam açar («corporate») göstərilirdi */
const EVENT_LABELS = { toy: 'Toy', nishan: 'Nişan', birthday: 'Ad günü', corporate: 'Korporativ', other: 'Digər' }
const PKG_LABEL = { SADE: 'Sadə (59₼)', VIP: 'VİP (89₼)', PREMIUM: 'Premium (129₼)' }
const VIEW_STATUS = { submitted: 'new' }

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

export default function AdminOrderDetail({ draftCode, onBack }) {
  const [draft,        setDraft]        = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [busy,         setBusy]         = useState({})
  const [actionError,  setActionError]  = useState('')
  const [approveAsk,   setApproveAsk]   = useState(false)
  const [creating,     setCreating]     = useState(false)
  const [sessionError, setSessionError] = useState(() => !isAdminTokenValid())

  useEffect(() => {
    if (!draftCode) return
    setLoading(true)
    getDraftByCode(draftCode)
      .then(d => { setDraft(d); setLoading(false) })
      .catch(() => { setError('Sifariş yüklənmədi.'); setLoading(false) })
  }, [draftCode])

  const handleEdit = () => {
    window.location.href = `/?draft=${draftCode}`
  }

  /* Phase 46 — SİNXRON: təsdiq dəvətnaməni də yaradır. */
  const createInvitation = async () => {
    const fd = draft?.form_data
    if (!fd) throw new Error('Sifarişin məlumatı tapılmadı.')
    const saved = await saveInvitation(computeInviteSlug(fd), fd, draftCode)
    const slug = saved?.slug || ''
    await approveDraft(draftCode, slug)
    setDraft(prev => ({ ...prev, status: 'approved', approved_slug: slug || prev.approved_slug }))
  }

  const handleApprove = async () => {
    if (!isAdminTokenValid()) { setSessionError(true); return }
    setBusy(b => ({ ...b, approve: true }))
    setActionError('')
    try {
      await createInvitation()
      setApproveAsk(false)
    } catch {
      setActionError('Xəta: təsdiq edilmədi.')
      setApproveAsk(false)
    } finally {
      setBusy(b => ({ ...b, approve: false }))
    }
  }

  const handleReject = async (reason) => {
    if (!isAdminTokenValid()) { setSessionError(true); return }
    setBusy(b => ({ ...b, reject: true }))
    setActionError('')
    try {
      await rejectDraft(draftCode, reason)
      setDraft(prev => ({ ...prev, status: 'rejected', reject_reason: reason || prev.reject_reason }))
    } catch (e) {
      setActionError('Xəta: rədd edilmədi.')
      throw e
    } finally {
      setBusy(b => ({ ...b, reject: false }))
    }
  }

  const handleDelete = async () => {
    if (!isAdminTokenValid()) { setSessionError(true); return }
    setBusy(b => ({ ...b, delete: true }))
    setActionError('')
    try {
      await deleteDraft(draftCode)
      onBack()
    } catch (err) {
      setBusy(b => ({ ...b, delete: false }))
      if (err?.message?.includes('401')) setSessionError(true)
      else setActionError('Xəta: sifariş silinmədi. (' + (err?.message || '') + ')')
    }
  }

  /* Sessiya bitib → yenidən giriş */
  if (sessionError) return (
    <div className="mx-auto max-w-[520px] pt-10">
      <div className="rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]">
        <EmptyState
          icon={LogIn}
          title="Admin sessiyası bitib"
          text="Admin token 8 saat etibarlıdır. Yenidən daxil olmaq üçün aşağıdakı düyməni klikləyin."
          action={<Button variant="primary" onClick={redirectToLogin}>Yenidən daxil ol</Button>}
        />
      </div>
    </div>
  )

  if (loading) return (
    <div role="status" aria-label="Yüklənir" className="space-y-4">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-9 w-72" />
      <Skeleton className="h-[320px] w-full max-w-[400px]" />
    </div>
  )

  if (error || !draft?.found) return (
    <div>
      <PageHeader back={{ label: 'Sifarişlərə qayıt', onClick: onBack }} title="Sifariş" />
      <Notice tone="danger" title={error || 'Sifariş tapılmadı.'} />
    </div>
  )

  const fd = draft.form_data || {}
  const isCouple = ['toy', 'nishan'].includes(fd.eventType)
  const isCorp = ['corporate', 'other'].includes(fd.eventType)
  const names = isCouple
    ? `${fd.brideName || ''} & ${fd.groomName || ''}`.trim()
    : isCorp ? (fd.eventName || '') : (fd.brideName || '')

  const dateStr = fd.date ? azDate(fd.date, { long: true }) : ''
  const timeStr = fd.time || ''
  const slug = draft.approved_slug
  const inviteUrl = slug ? `https://digitoy.az/invite/${slug}` : undefined

  const extraInfo = []
  if (fd.seatingMethod === 'digitory') extraInfo.push({ icon: Armchair, label: 'Oturma planı', value: 'DigiToy dolduracaq (+15 AZN)' })
  if (fd.seatingMethod === 'self' && fd.seatingPlan) extraInfo.push({ icon: Armchair, label: 'Oturma planı', value: 'Müştəri doldurdu' })

  const order = {
    code: draftCode,
    status: VIEW_STATUS[draft.status] || draft.status || 'draft',
    names: names || '—',
    pkg: PKG_LABEL[draft.package] || draft.package,
    /* Phase 4 — şablon adı metadata-dan (hardcode yox) */
    template: templateMeta(fd.templateId || draft.template_id || DEFAULT_TEMPLATE_ID),
    event: EVENT_LABELS[fd.eventType] || fd.eventType || undefined,
    date: [dateStr, timeStr].filter(Boolean).join(', ') || undefined,
    venue: [fd.venueName, fd.venueNote].filter(Boolean).join(' — ') || undefined,
    dressCode: [fd.dressCodePalette, (fd.dressCodeLabels?.[fd.dressCodePalette] || '').trim()].filter(Boolean).join(' — ') || undefined,
    phone: draft.customer_phone || undefined,
    submittedAt: draft.submitted_at ? azDate(draft.submitted_at, { time: true, long: true }) : undefined,
    inviteUrl,
    rejectReason: draft.reject_reason || undefined,
    extraInfo,
  }

  /* Approved amma slug tapılmadı — dəvətnaməni sifarişin məlumatı ilə yarat */
  const missingInvite = draft.status === 'approved' && !inviteUrl ? (
    <Notice
      tone="warning"
      title="Dəvətnamə linki tapılmadı"
      action={
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm" variant="success" loading={creating}
            onClick={async () => {
              setCreating(true)
              setActionError('')
              try { await createInvitation() } catch (e) { setActionError(e?.message || 'Yaradılmadı.') } finally { setCreating(false) }
            }}
          >
            Dəvətnaməni yarat
          </Button>
          <Button size="sm" onClick={handleEdit}>Builder-də aç</Button>
        </div>
      }
    >
      Sifariş təsdiqlənib, amma dəvətnaməsi yaradılmayıb. «Dəvətnaməni yarat» onu sifarişin məlumatları ilə indi yaradır.
    </Notice>
  ) : null

  return (
    <>
      {actionError && <Notice tone="danger" title={actionError} className="mb-4" />}
      <OrderDetail
        order={order}
        onBack={onBack}
        onApprove={() => { if (!isAdminTokenValid()) { setSessionError(true); return } setApproveAsk(true) }}
        onReject={handleReject}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCopyLink={(url) => navigator.clipboard.writeText(url)}
        whatsappHref={draft.customer_phone ? `https://wa.me/${draft.customer_phone.replace(/\D/g, '')}` : undefined}
        busy={busy}
        asideExtra={missingInvite}
        panels={slug ? {
          seating: <AdminSeatingPlan slug={slug} seatingPlan={fd.seatingPlan || ''} />,
          report: <AdminGuestReports slug={slug} names={names} dateStr={dateStr} />,
          /* Phase 48 — siyahısız (adını yazıb) verilən cavablar; hesabat yalnız siyahını oxuyur */
          rsvp: <AdminRSVPBlock slug={slug} names={names} />,
        } : {
          seating: missingInvite, report: missingInvite, rsvp: missingInvite,
        }}
      />
      <ConfirmDialog
        open={approveAsk}
        tone="success"
        title="Sifarişi təsdiqləmək?"
        description={`${draftCode} · ${names || '—'} — dəvətnamə də yaradılacaq və müştəri linki aktiv olacaq.`}
        confirmLabel="Təsdiq et"
        busy={busy.approve}
        onCancel={() => setApproveAsk(false)}
        onConfirm={handleApprove}
      />
    </>
  )
}
