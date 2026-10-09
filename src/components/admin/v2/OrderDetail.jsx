// ════════════════════════════════════════════════════════════════
// OrderDetail — sifariş detalı (YALNIZ görünüş)
//
// Desktop (≥1024px): solda yapışqan xülasə + əməliyyatlar, sağda qonaq tabları —
// ekranın bütün eni işlədilir. Mobil: başlıq yığcamdır, əsas əməliyyatlar aşağı
// naviqasiyanın üstündəki yapışqan paneldə + «⋯» menyusunda.
//
// Rədd et və Sil pəncərələri komponentin içindədir; təsdiqdən sonra `onReject(reason)` /
// `onDelete()` çağırılır. İstəsəniz `dialog` + `onDialogChange` ilə özünüz idarə edin.
// ════════════════════════════════════════════════════════════════
import { useState } from 'react';
import {
  Armchair,
  BarChart3,
  Calendar,
  CircleCheck,
  ClipboardCheck,
  LayoutTemplate,
  Lock,
  MapPin,
  MessageCircle,
  Package,
  PartyPopper,
  PencilLine,
  Phone,
  RotateCcw,
  Shirt,
  Trash2,
  X,
} from 'lucide-react';
import {
  ActionMenu,
  Button,
  ConfirmDialog,
  CopyField,
  Field,
  FOCUS,
  IconButton,
  InfoList,
  MobileActionBar,
  Modal,
  Notice,
  OrderCode,
  PageHeader,
  Panel,
  StatusBadge,
  TabPanel,
  Tabs,
  TemplateLabel,
  Textarea,
  cx,
  formatPrice,
  useControllable,
} from './adminUi';

export const ORDER_DETAIL_TABS = [
  { id: 'seating', label: 'Oturma planı', icon: Armchair },
  { id: 'report', label: 'Qonaq hesabatı', icon: BarChart3 },
  { id: 'rsvp', label: 'İştirak təsdiqi', icon: ClipboardCheck },
];

/**
 * @typedef {object} OrderDetailData
 * @property {string} code  @property {'new'|'approved'|'rejected'|'deleted'|'draft'} status
 * @property {string} names  @property {string} pkg  @property {number} [price]
 * @property {{name:string,color:string}} template
 * @property {string} [event]  «Toy»  @property {string} [date]  «12 iyun 2027, 19:00»
 * @property {string} [venue]  @property {string} [dressCode]  @property {string} [phone]
 * @property {string} [submittedAt]  «14 sentyabr 2026, 20:12»
 * @property {string} [inviteUrl]  Təsdiqlənmişdə dəvətnamə linki
 * @property {string} [rejectReason]
 */

/**
 * @param {object} p
 * @param {OrderDetailData} p.order
 * @param {()=>void} p.onBack  «← Sifarişlərə qayıt»
 * @param {()=>void} [p.onApprove]  «Təsdiq et» (yeni və rədd edilmiş sifarişdə)
 * @param {(reason:string)=>void|Promise<void>} [p.onReject]  Rədd pəncərəsində təsdiqdən sonra
 * @param {()=>void} [p.onEdit]  «Redaktə et»
 * @param {()=>void|Promise<void>} [p.onDelete]  Sil təsdiqindən sonra (sifariş «Silinmiş» tabına düşür)
 * @param {()=>void} [p.onRestore]  Silinmiş sifarişdə «Bərpa et» (verilməsə görünmür)
 * @param {(url:string)=>void|Promise<void>} [p.onCopyLink]  Dəvətnamə linkini kopyala
 * @param {string} [p.whatsappHref]  «WhatsApp-a yaz» linki (məs. https://wa.me/994…)
 * @param {()=>void} [p.onWhatsApp]  Link əvəzinə callback
 * @param {{approve?:boolean,reject?:boolean,delete?:boolean,restore?:boolean}} [p.busy]
 * @param {'reject'|'delete'|null} [p.dialog]  Pəncərəni xaricdən idarə etmək üçün (ixtiyari)
 * @param {(d:'reject'|'delete'|null)=>void} [p.onDialogChange]
 * @param {'seating'|'report'|'rsvp'} [p.tab]  @param {(t:string)=>void} [p.onTab]
 * @param {{seating?:import('react').ReactNode,report?:import('react').ReactNode,rsvp?:import('react').ReactNode}} [p.panels]
 *        Təsdiqlənmiş sifarişin tab məzmunu (SeatingPlanTab, GuestReportTab, RsvpTab)
 * @param {Partial<Record<'seating'|'report'|'rsvp',number>>} [p.tabCounts]
 * @param {import('react').ReactNode} [p.asideExtra]  Digitoy: xülasə sütununun sonunda əlavə blok
 */
export default function OrderDetail({
  order,
  onBack,
  backLabel = 'Sifarişlərə qayıt',
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onRestore,
  onCopyLink,
  whatsappHref,
  onWhatsApp,
  busy = {},
  dialog: dialogProp,
  onDialogChange,
  tab: tabProp,
  onTab,
  panels = {},
  tabCounts = {},
  asideExtra,
}) {
  const [dialog, setDialog] = useControllable(dialogProp, onDialogChange, null);
  const [tab, setTab] = useControllable(tabProp, onTab, 'seating');
  const s = order.status;
  const isNew = s === 'new' || s === 'draft';
  const approved = s === 'approved';
  const rejected = s === 'rejected';
  const deleted = s === 'deleted';

  const info = [
    {
      icon: Package,
      label: 'Paket',
      value: `${order.pkg}${order.price != null ? ` (${formatPrice(order.price)})` : ''}`,
    },
    { icon: LayoutTemplate, label: 'Şablon', value: order.template && <TemplateLabel {...order.template} /> },
    { icon: PartyPopper, label: 'Hadisə', value: order.event },
    { icon: Calendar, label: 'Tarix', value: order.date },
    { icon: MapPin, label: 'Məkan', value: order.venue },
    { icon: Shirt, label: 'Dress code', value: order.dressCode },
    {
      icon: Phone,
      label: 'Telefon',
      value: order.phone && <span className="tabular-nums">{order.phone}</span>,
    },
    ...(order.extraInfo ?? []),
  ];

  const WaTag = whatsappHref ? 'a' : 'button';
  const waProps = whatsappHref
    ? { href: whatsappHref, target: '_blank', rel: 'noopener noreferrer' }
    : { type: 'button', onClick: onWhatsApp };
  const hasWa = Boolean(whatsappHref || onWhatsApp);

  const menuItems = [
    {
      id: 'edit',
      label: 'Redaktə et',
      icon: PencilLine,
      onSelect: onEdit,
      hidden: !onEdit || approved || deleted,
    },
    {
      id: 'wa',
      label: 'WhatsApp-a yaz',
      icon: MessageCircle,
      onSelect: () => (whatsappHref ? window.open(whatsappHref, '_blank', 'noopener') : onWhatsApp?.()),
      hidden: !hasWa || !approved,
    },
    {
      id: 'delete',
      label: 'Sil',
      icon: Trash2,
      destructive: true,
      onSelect: () => setDialog('delete'),
      hidden: !onDelete || deleted,
    },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <PageHeader
        back={{ label: backLabel, onClick: onBack }}
        meta={
          <>
            <OrderCode className="text-[14px]">{order.code}</OrderCode>
            <StatusBadge status={s} size="sm" />
          </>
        }
        title={order.names}
        className="lg:mb-7"
      />

      <div className="lg:grid lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)] lg:items-start lg:gap-6 xl:grid-cols-[400px_minmax(0,1fr)] xl:gap-8">
        {/* ── Sol: xülasə (desktopda yapışqan) ── */}
        <aside
          aria-label="Sifariş xülasəsi"
          className="space-y-4 lg:sticky lg:top-6 lg:-m-1 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto lg:overscroll-contain lg:p-1 lg:[scrollbar-width:thin]"
        >
          {/* Əməliyyatlar — yalnız desktop; mobildə aşağı paneldədir */}
          {!deleted && (
            <div className="hidden rounded-[12px] bg-white p-4 ring-1 ring-inset ring-[#E5DED2] lg:block">
              <h2 className="sr-only">Əməliyyatlar</h2>
              {(isNew || rejected) && onApprove && (
                <Button
                  variant="success"
                  block
                  icon={CircleCheck}
                  loading={busy.approve}
                  onClick={onApprove}
                  className="mb-2"
                >
                  Təsdiq et
                </Button>
              )}
              <div className="flex gap-2">
                {isNew && onReject && (
                  <Button destructive icon={X} className="flex-1" onClick={() => setDialog('reject')}>
                    Rədd et
                  </Button>
                )}
                {onEdit && (
                  <Button icon={PencilLine} className="flex-1" onClick={onEdit}>
                    Redaktə et
                  </Button>
                )}
                {onDelete && (
                  <IconButton
                    label="Sifarişi sil"
                    icon={Trash2}
                    variant="secondary"
                    destructive
                    tooltipAlign="end"
                    onClick={() => setDialog('delete')}
                  />
                )}
              </div>
            </div>
          )}

          {rejected && (
            <Notice tone="danger" title="Sifariş rədd edilib">
              {order.rejectReason ? `Səbəb: ${order.rejectReason}` : 'Səbəb qeyd olunmayıb.'} Statusu yenidən
              dəyişmək mümkündür.
            </Notice>
          )}
          {deleted && (
            <Notice
              tone="warning"
              icon={Trash2}
              title="Bu sifariş silinib"
              action={
                onRestore && (
                  <Button
                    size="sm"
                    icon={RotateCcw}
                    loading={busy.restore}
                    onClick={onRestore}
                    className="max-lg:hidden"
                  >
                    Bərpa et
                  </Button>
                )
              }
            >
              «Silinmiş» tabındadır — oradan birdəfəlik silinə bilər.
            </Notice>
          )}

          <Panel title="Sifariş məlumatı">
            <InfoList items={info} columns={1} className="sm:grid-cols-2 lg:grid-cols-1" />
            {(hasWa || order.submittedAt) && (
              <div className="mt-5 border-t border-[#EEE8DF] pt-4">
                {hasWa && (
                  <WaTag
                    {...waProps}
                    className={cx(
                      'inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-white text-[14px] font-medium text-espresso ring-1 ring-inset ring-[#D6CCBC] hover:bg-[#F6F3ED] sm:w-auto sm:px-4',
                      FOCUS,
                    )}
                  >
                    <MessageCircle className="h-4 w-4 text-[#1F7A4D]" aria-hidden="true" />
                    WhatsApp-a yaz
                    {whatsappHref && <span className="sr-only"> (yeni pəncərədə)</span>}
                  </WaTag>
                )}
                {order.submittedAt && (
                  <p className="mt-3 text-[13px] text-[#6B5E54]">Göndərilmə tarixi: {order.submittedAt}</p>
                )}
              </div>
            )}
          </Panel>

          {approved && order.inviteUrl && (
            <Panel>
              <CopyField value={order.inviteUrl} onCopy={onCopyLink} openHref={order.inviteUrl} />
            </Panel>
          )}
          {asideExtra}
        </aside>

        {/* ── Sağ: qonaq alətləri ── */}
        <div className="mt-8 min-w-0 lg:mt-0">
          {approved ? (
            <>
              <Tabs
                label="Qonaq alətləri"
                idPrefix="order"
                value={tab}
                onChange={setTab}
                tabs={ORDER_DETAIL_TABS.map((t) => ({ ...t, count: tabCounts[t.id] }))}
                className="mb-5"
              />
              <TabPanel idPrefix="order" id={tab}>
                {panels[tab]}
              </TabPanel>
            </>
          ) : (
            <div className="flex flex-col items-center rounded-[12px] border border-dashed border-[#D6CCBC] px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3EEE6] text-[#6B5E54]">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[16px] font-semibold text-espresso">
                Qonaq alətləri təsdiqdən sonra açılır
              </h2>
              <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-[#6B5E54]">
                Oturma planı, qonaq hesabatı və iştirak təsdiqi dəvətnamə aktiv olandan sonra burada
                görünəcək.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobil yapışqan əməliyyat paneli ── */}
      {!deleted ? (
        <MobileActionBar label="Sifariş əməliyyatları">
          {(isNew || rejected) && onApprove && (
            <Button
              variant="success"
              icon={CircleCheck}
              loading={busy.approve}
              onClick={onApprove}
              className="flex-1"
            >
              Təsdiq et
            </Button>
          )}
          {isNew && onReject && (
            <Button destructive icon={X} onClick={() => setDialog('reject')} className="flex-1">
              Rədd et
            </Button>
          )}
          {approved && onEdit && (
            <Button icon={PencilLine} onClick={onEdit} className="flex-1">
              Redaktə et
            </Button>
          )}
          {menuItems.some((i) => !i.hidden) && (
            <ActionMenu items={menuItems} side="top" variant="secondary" label="Digər əməliyyatlar" />
          )}
        </MobileActionBar>
      ) : (
        onRestore && (
          <MobileActionBar label="Sifariş əməliyyatları">
            <Button icon={RotateCcw} loading={busy.restore} onClick={onRestore} className="flex-1">
              Bərpa et
            </Button>
          </MobileActionBar>
        )
      )}

      <RejectDialog
        open={dialog === 'reject'}
        code={order.code}
        busy={busy.reject}
        onCancel={() => setDialog(null)}
        onConfirm={(reason) =>
          Promise.resolve(onReject?.(reason)).then(
            () => setDialog(null),
            () => {},
          )
        }
      />
      <ConfirmDialog
        open={dialog === 'delete'}
        title="Sifarişi silmək?"
        description={
          <>
            <OrderCode>{order.code}</OrderCode> · {order.names} «Silinmiş» tabına keçəcək. Birdəfəlik silmə
            yalnız oradan mümkündür.
          </>
        }
        confirmLabel="Sil"
        busy={busy.delete}
        onCancel={() => setDialog(null)}
        onConfirm={() =>
          Promise.resolve(onDelete?.()).then(
            () => setDialog(null),
            () => {},
          )
        }
      />
    </div>
  );
}

/**
 * «Sifarişi rədd et» pəncərəsi (ayrıca da işlədilə bilər).
 * @param {object} p
 * @param {boolean} p.open  @param {string} p.code  @param {boolean} [p.busy]
 * @param {(reason:string)=>void} p.onConfirm  @param {()=>void} p.onCancel
 */
export function RejectDialog({ open, code, busy = false, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setReason('');
  }
  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onCancel}
      title="Sifarişi rədd et"
      description={
        <>
          <OrderCode>{code}</OrderCode> — bu əməliyyat geri alına bilər (statusu yenidən dəyişmək mümkündür).
        </>
      }
      size="sm"
      footer={
        <>
          <Button onClick={onCancel} disabled={busy}>
            Ləğv et
          </Button>
          <Button variant="danger" loading={busy} onClick={() => onConfirm?.(reason.trim())}>
            Rədd et
          </Button>
        </>
      }
    >
      <Field label="Rədd səbəbi" labelHidden>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Rədd səbəbi (ixtiyari)..."
          rows={3}
          data-autofocus
        />
      </Field>
    </Modal>
  );
}
