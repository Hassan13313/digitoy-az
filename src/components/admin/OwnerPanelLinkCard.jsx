import { useState } from 'react'
import { LayoutDashboard, MessageCircle, RotateCcw } from 'lucide-react'
import { Button, ConfirmDialog, CopyField, Notice, Panel, Skeleton, Toast } from './v2/adminUi'
import { useOwnerLink } from './useOwnerLink'
import { customerWaUrl } from '../../utils/customerPhone'

/* ─────────────────────────────────────────────────────────────────────────────
   Sifariş detalı → «Müştəri paneli» kartı (Phase 50).

   Bir link: iştirak təsdiqi, qonaq hesabatı, təbriklər, şəkillər (idarə,
   yükləmə QR, slayd şou). Əvvəl müştəriyə bunlar ayrı-ayrı göndərilirdi.
   ───────────────────────────────────────────────────────────────────────── */

const waMessage = (url) => encodeURIComponent(
  `Salam! Dəvətnamənizin müştəri paneli:\n${url}\n\n`
  + 'Burada iştirak təsdiqlərini, qonaq hesabatını, təbrikləri və şəkilləri canlı izləyə bilərsiniz. '
  + 'Link yalnız sizə məxsusdur — başqası ilə paylaşmayın.',
)

/** «Linki yenilə» təsdiqi — sifariş detalı və «Dəvətnamələr» menyusu eyni mətni göstərir */
export function RotateOwnerLinkDialog({ open, names, busy, onCancel, onConfirm }) {
  return (
    <ConfirmDialog
      open={open}
      tone="danger"
      title="Müştəri paneli linkini yeniləmək?"
      description={`${names ? `${names} — ` : ''}köhnə link dərhal işləməyəcək. Müştəriyə yeni linki göndərməli olacaqsınız.`}
      confirmLabel="Linki yenilə"
      busy={busy}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}

export default function OwnerPanelLinkCard({ slug, phone }) {
  const { url, error, loading, rotating, rotate } = useOwnerLink(slug)
  const [ask, setAsk] = useState(false)
  const [toast, setToast] = useState(null)
  const waHref = url ? customerWaUrl(phone, waMessage(url)) : undefined

  const onRotate = async () => {
    const ok = await rotate()
    setAsk(false)
    setToast(ok
      ? { tone: 'success', message: 'Yeni link hazırdır. Köhnə link artıq açılmır.' }
      : { tone: 'error', message: 'Link yenilənmədi. Yenidən cəhd edin.' })
  }

  return (
    <Panel
      title="Müştəri paneli"
      icon={LayoutDashboard}
      description="Müştəri bu linklə iştirak təsdiqini, təbrikləri və şəkilləri canlı görür. Yalnız baxış — şəkil idarəsi istisna."
    >
      {loading && <Skeleton className="h-11 w-full" />}
      {error && <Notice tone="danger" title={error} />}
      {url && (
        <div className="space-y-3">
          <CopyField label="Müştəri paneli linki" value={url} onCopy={(v) => navigator.clipboard.writeText(v)} openHref={url} />
          <div className="flex flex-wrap gap-2">
            {waHref && (
              <Button size="sm" icon={MessageCircle} href={waHref} target="_blank" rel="noopener">
                WhatsApp ilə göndər
              </Button>
            )}
            <Button size="sm" variant="ghost" destructive icon={RotateCcw} onClick={() => setAsk(true)}>
              Linki yenilə
            </Button>
          </div>
        </div>
      )}

      <RotateOwnerLinkDialog open={ask} busy={rotating} onCancel={() => setAsk(false)} onConfirm={onRotate} />
      <Toast open={!!toast} tone={toast?.tone} message={toast?.message} onClose={() => setToast(null)} />
    </Panel>
  )
}
