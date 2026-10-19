import { memo, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Images, MonitorPlay, QrCode } from 'lucide-react'
import { Button, CopyField, Panel } from '../admin/v2/adminUi'
import { useGalleryMeta } from '../../hooks/useGalleryMeta'
import { triggerDownload } from '../../utils/qrStandPdf'

/* ─────────────────────────────────────────────────────────────────────────────
   Müştəri paneli — şəkillər (Phase 50).

   Əvvəl müştəriyə üç ayrı link göndərilirdi (idarəetmə ?k=…, yükləmə, slayd).
   İndi hamısı buradadır. «İdarə et» səhifəsinə açar LAZIM DEYİL: panel açarı
   bu brauzerdə saxlanılıb və qalereya serveri onu da qəbul edir.
   Sayğaclar bir dəfə yüklənir (gallery_meta qovluğu skan edir — hər dəqiqə yox).
   ───────────────────────────────────────────────────────────────────────── */

const copy = (value) => navigator.clipboard.writeText(value)

function Block({ icon: Icon, title, text, children }) {
  return (
    <div className="rounded-[10px] bg-[#FAF8F4] p-4 ring-1 ring-inset ring-[#EFE9DF] sm:p-5">
      <h3 className="flex items-center gap-2 text-[15px] font-semibold text-espresso">
        <Icon className="h-4 w-4 text-[#6B5E54]" aria-hidden="true" />
        {title}
      </h3>
      <p className="mt-1 max-w-[60ch] text-[13px] leading-relaxed text-[#6B5E54]">{text}</p>
      <div className="mt-4">{children}</div>
    </div>
  )
}

/* memo: qrcode.react hər render-də canvas-ı yenidən çəkir — panel dəqiqədə
   bir neçə dəfə render olunur, QR isə dəyişmir */
const UploadQr = memo(function UploadQr({ url, slug }) {
  const ref = useRef(null)
  const download = () => ref.current?.toBlob((blob) => blob && triggerDownload(blob, `qr-foto-${slug}.png`))
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="w-fit shrink-0 rounded-[8px] bg-white p-3 ring-1 ring-inset ring-[#E5DED2]">
        <QRCodeCanvas
          ref={ref}
          value={url}
          size={512}
          level="M"
          marginSize={0}
          bgColor="#FFFFFF"
          fgColor="#141414"
          style={{ width: 132, height: 132 }}
          aria-label="Şəkil yükləmə linkinin QR kodu"
          role="img"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <CopyField label="Yükləmə linki" value={url} onCopy={copy} openHref={url} />
        <Button size="sm" icon={Download} onClick={download}>QR kodu endir (PNG)</Button>
      </div>
    </div>
  )
})

export default function OwnerPhotos({ slug }) {
  const { meta, counts } = useGalleryMeta(slug, { interval: 0 })

  const base = `${window.location.origin}/invite/${encodeURIComponent(slug)}`
  const slideUrl = `${base}/slayd`

  return (
    <Panel
      title="Qonaq şəkilləri"
      description={meta ? `${counts.photos} şəkil, ${counts.videos} video` : undefined}
      icon={Images}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Block
          icon={Images}
          title="Şəkilləri idarə et"
          text="Qonaqların yüklədiyi şəkil və videolara baxın, endirin, lazım olmayanları silin, üz qapağını seçin."
        >
          <Button variant="primary" size="sm" icon={Images} href={`${base}/qalereya-idare`} target="_blank" rel="noopener">
            Qalereyanı aç
          </Button>
        </Block>

        <Block
          icon={MonitorPlay}
          title="Slayd şou"
          text="Zaldakı ekranda və ya proyektorda açın — qonaqların yüklədiyi yeni şəkillər özü əlavə olunur."
        >
          <CopyField label="Slayd şou linki" value={slideUrl} onCopy={copy} openHref={slideUrl} />
        </Block>

        <div className="lg:col-span-2">
          <Block
            icon={QrCode}
            title="Qonaqlar üçün yükləmə linki"
            text="Bu linki və ya QR kodu qonaqlarla paylaşın: skan edən qonaq şəkillərini qeydiyyatsız yükləyir."
          >
            <UploadQr url={`${base}/foto`} slug={slug} />
          </Block>
        </div>
      </div>
    </Panel>
  )
}
