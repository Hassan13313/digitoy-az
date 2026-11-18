import { useState } from 'react'
import { KeyRound, LayoutDashboard, MessageCircle, RotateCcw } from 'lucide-react'
import { Button, ConfirmDialog, CopyField, Notice, Panel, Skeleton, Toast } from './v2/adminUi'
import { useOwnerLink } from './useOwnerLink'
import { customerWaUrl } from '../../utils/customerPhone'
import { createSeatingPin } from '../../utils/ownerApi'

/* ─────────────────────────────────────────────────────────────────────────────
   Sifariş detalı → «Müştəri paneli» kartı (Phase 50).

   Bir link: iştirak təsdiqi, qonaq hesabatı, təbriklər, şəkillər (idarə,
   yükləmə QR, slayd şou). Əvvəl müştəriyə bunlar ayrı-ayrı göndərilirdi.
   ───────────────────────────────────────────────────────────────────────── */

const waMessage = (url, pin) => encodeURIComponent(
  `Salam! Dəvətnamənizin müştəri paneli:\n${url}\n\n`
  + 'Burada iştirak təsdiqlərini, qonaq hesabatını, təbrikləri və şəkilləri canlı izləyə bilərsiniz. '
  + 'Link yalnız sizə məxsusdur — başqası ilə paylaşmayın.'
  + (pin ? `\n\nOturma planını özünüz dəyişmək üçün «Oturma planı» bölməsində bu PİN-i daxil edin: ${pin}\nPİN-i heç kimlə paylaşmayın.` : ''),
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

export default function OwnerPanelLinkCard({ slug, phone, seating = false }) {
  const { url, error, loading, rotating, rotate } = useOwnerLink(slug)
  const [ask, setAsk] = useState(false)
  const [toast, setToast] = useState(null)
  /* 2026-11-18 — oturma planı redaktə PİN-i: yalnız yaradılanda göstərilir (serverdə hash) */
  const [pin, setPin] = useState('')
  const [pinBusy, setPinBusy] = useState(false)
  const waHref = url ? customerWaUrl(phone, waMessage(url, pin)) : undefined
  const makePin = async () => {
    setPinBusy(true)
    try {
      const r = await createSeatingPin(slug)
      setPin(r.pin)
      setToast({ tone: 'success', message: 'Yeni PİN hazırdır — WhatsApp mesajına əlavə olundu. Köhnə PİN artıq işləmir.' })
    } catch {
      setToast({ tone: 'error', message: 'PİN yaradılmadı. Yenidən cəhd edin.' })
    } finally {
      setPinBusy(false)
    }
  }

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
            {seating && (
              <Button size="sm" variant="ghost" icon={KeyRound} loading={pinBusy} onClick={makePin}>
                {pin ? 'Yeni PİN' : 'Oturma redaktə PİN-i'}
              </Button>
            )}
            <Button size="sm" variant="ghost" destructive icon={RotateCcw} onClick={() => setAsk(true)}>
              Linki yenilə
            </Button>
          </div>
          {pin && (
            <p className="rounded-[10px] bg-[#F3EEE6] px-3.5 py-2.5 text-[13.5px] text-espresso">
              Oturma planı redaktə PİN-i: <strong className="tabular-nums tracking-[0.2em]">{pin}</strong> — yalnız indi göstərilir, müştəriyə göndərin.
            </p>
          )}
        </div>
      )}

      <RotateOwnerLinkDialog open={ask} busy={rotating} onCancel={() => setAsk(false)} onConfirm={onRotate} />
      <Toast open={!!toast} tone={toast?.tone} message={toast?.message} onClose={() => setToast(null)} />
    </Panel>
  )
}
