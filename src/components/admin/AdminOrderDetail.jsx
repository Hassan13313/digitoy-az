import { useState, useEffect } from 'react'
import { Armchair, Clapperboard, LogIn, Music, PenLine, StickyNote } from 'lucide-react'
import { DEFAULT_TEMPLATE_ID } from '../../templates/templateConfig'
import { getDraftByCode, approveDraft, rejectDraft, deleteDraft, saveInvitation } from '../../utils/api'
import { computeInviteSlug } from '../../utils/inviteSlug'
import AdminSeatingPlan from './AdminSeatingPlan'
import AdminGuestReports from './AdminGuestReports'
import AdminRSVPBlock from './AdminRSVPBlock'
import OwnerPanelLinkCard from './OwnerPanelLinkCard'
import OrderDetail from './v2/OrderDetail'
import { customerWaUrl, formatPhoneDisplay } from '../../utils/customerPhone'
import { Button, ConfirmDialog, EmptyState, Notice, PageHeader, Panel, Skeleton } from './v2/adminUi'
import { azDate } from './adminFormat'
import { templateMeta } from './templateMeta'
import { describeVideoSource, sampleWatchUrl, videoMusicLabel } from '../../data/videoSamples'
import { isVideoPackage, packageLabel } from '../../data/packages'

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
const EVENT_LABELS = {
  toy: 'Toy', nishan: 'Nişan', birthday: 'Ad günü', corporate: 'Korporativ', other: 'Digər',
  xina: 'Xına gecəsi', sunnet: 'Sünnət toyu', baby: 'Baby shower', anniversary: 'İldönümü', graduation: 'Məzuniyyət', bachelorette: 'Qız gecəsi',
}
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

  /* 2026-11-18 — VİDEO sifarişində veb-dəvətnamə YOXDUR: yalnız status təsdiqlənir */
  const isVideo = isVideoPackage(draft?.package)

  const handleApprove = async () => {
    if (!isAdminTokenValid()) { setSessionError(true); return }
    setBusy(b => ({ ...b, approve: true }))
    setActionError('')
    try {
      if (isVideo) {
        await approveDraft(draftCode, '')
        setDraft(prev => ({ ...prev, status: 'approved' }))
      } else {
        await createInvitation()
      }
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

  const extraInfo = isVideo ? videoInfoRows(fd) : []
  if (fd.seatingMethod === 'digitory') extraInfo.push({ icon: Armchair, label: 'Oturma planı', value: 'DigiToy dolduracaq (+15 AZN)' })
  if (fd.seatingMethod === 'self' && fd.seatingPlan) extraInfo.push({ icon: Armchair, label: 'Oturma planı', value: 'Müştəri doldurdu' })

  const order = {
    code: draftCode,
    status: VIEW_STATUS[draft.status] || draft.status || 'draft',
    names: names || '—',
    pkg: packageLabel(draft.package),
    /* Phase 4 — şablon adı metadata-dan (hardcode yox) */
    template: templateMeta(fd.templateId || draft.template_id || DEFAULT_TEMPLATE_ID),
    event: EVENT_LABELS[fd.eventType] || fd.eventType || undefined,
    date: [dateStr, timeStr].filter(Boolean).join(', ') || undefined,
    venue: [fd.venueName, fd.venueNote].filter(Boolean).join(' — ') || undefined,
    dressCode: [fd.dressCodePalette, (fd.dressCodeLabels?.[fd.dressCodePalette] || '').trim()].filter(Boolean).join(' — ') || undefined,
    phone: formatPhoneDisplay(draft.customer_phone) || undefined,
    submittedAt: draft.submitted_at ? azDate(draft.submitted_at, { time: true, long: true }) : undefined,
    inviteUrl,
    rejectReason: draft.reject_reason || undefined,
    extraInfo,
  }

  /* Approved amma slug tapılmadı — dəvətnaməni sifarişin məlumatı ilə yarat */
  const missingInvite = !isVideo && draft.status === 'approved' && !inviteUrl ? (
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
        /* Phase 50 — 050… kimi yerli yazılışda da işləsin (əvvəl wa.me/050… idi) */
        whatsappHref={customerWaUrl(draft.customer_phone)}
        busy={busy}
        webInvite={!isVideo}
        mainPanel={isVideo ? <VideoOrderPanel fd={fd} approved={draft.status === 'approved'} /> : undefined}
        asideExtra={
          <>
            {missingInvite}
            {/* Phase 50 — müştəriyə BİR link: iştirak təsdiqi, təbriklər, şəkillər */}
            {draft.status === 'approved' && slug && <OwnerPanelLinkCard slug={slug} phone={draft.customer_phone} />}
          </>
        }
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
        description={isVideo
          ? `${draftCode} · ${names || '—'} — video sifarişi təsdiqlənəcək (veb-dəvətnamə yaradılmır). Hazır videonu müştəriyə WhatsApp-da göndərin.`
          : `${draftCode} · ${names || '—'} — dəvətnamə də yaradılacaq və müştəri linki aktiv olacaq.`}
        confirmLabel="Təsdiq et"
        busy={busy.approve}
        onCancel={() => setApproveAsk(false)}
        onConfirm={handleApprove}
      />
    </>
  )
}

/* ── VİDEO sifarişi (2026-11-18) — məlumat sətirləri və sağ panel ── */
function videoSampleValue(v) {
  const { sample, link } = describeVideoSource(v)
  if (sample) {
    return <a href={sampleWatchUrl(sample)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{sample.title.az}</a>
  }
  if (link) {
    return <a href={link} target="_blank" rel="noopener noreferrer" className="break-all underline underline-offset-2">Öz nümunəsi: {link}</a>
  }
  return 'WhatsApp-da göndəriləcək'
}

function videoInfoRows(fd) {
  return [
    { icon: Clapperboard, label: 'Video nümunəsi', value: videoSampleValue(fd.video) },
    { icon: Music, label: 'Musiqi', value: videoMusicLabel(fd.videoMusic, 'Siz seçin') },
    ...(fd.note ? [{ icon: StickyNote, label: 'Qeyd', value: fd.note }] : []),
  ]
}

function VideoOrderPanel({ fd, approved }) {
  return (
    <Panel title="Videodakı yazı" icon={PenLine}>
      <p className="whitespace-pre-line text-[14.5px] leading-relaxed text-espresso">
        {(fd.inviteText || '').trim() || 'Müştəri yazmayıb — tədbirə uyğun mətni siz yazın.'}
      </p>
      <Notice
        tone="info"
        className="mt-5"
        title={approved
          ? 'Sifariş təsdiqlənib. Hazır videonu (MP4) müştəriyə WhatsApp-da göndərin.'
          : 'Videolu dəvətnamə sifarişidir — veb-dəvətnamə və qonaq alətləri yoxdur. Video 2–3 saat ərzində hazırlanıb müştəriyə WhatsApp-da göndərilir.'}
      />
    </Panel>
  )
}
