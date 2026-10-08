// ════════════════════════════════════════════════════════════════
// PurgeInvitationDialog — «Birdəfəlik silinsin?» (YALNIZ görünüş)
//
// Silinəcəklərin sayını SİZ hesablayırsınız (state='counting' → 'ready'). Kod (slug)
// düz yazılana qədər «Birdəfəlik sil» bağlıdır. Silmə zamanı pəncərə bağlanmır.
// ════════════════════════════════════════════════════════════════
import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button, Field, Input, Modal, Notice, OrderCode, SummaryList, formatNumber } from './adminUi';

/**
 * @param {object} p
 * @param {boolean} p.open
 * @param {{names:string,slug:string}} p.invitation
 * @param {{guests?:number,rsvp?:number,media?:number,files?:number,size?:string,order?:string}} [p.summary]
 *        Silinəcəklər: qonaq siyahısı, RSVP/təbriklər, foto/video, serverdəki fayllar (+ölçü), bağlı sifariş
 * @param {'counting'|'ready'|'deleting'|'error'} [p.state='ready']
 *        counting — saylar hesablanır · deleting — silinir · error — silmə alınmadı
 * @param {string} [p.errorText]
 * @param {()=>void} p.onConfirm  @param {()=>void} p.onCancel  @param {()=>void} [p.onRetry]  Xətada «Yenidən cəhd et»
 */
export default function PurgeInvitationDialog({
  open,
  invitation,
  summary = {},
  state = 'ready',
  errorText = 'Silmə alınmadı. Bir az sonra yenidən cəhd edin — heç nə silinməyib.',
  onConfirm,
  onCancel,
  onRetry,
}) {
  const [typed, setTyped] = useState('');
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTyped('');
  }
  const slug = invitation?.slug ?? '';
  const match = typed.trim().toLowerCase() === slug.toLowerCase();
  const counting = state === 'counting';
  const deleting = state === 'deleting';

  const items = [
    { label: 'Qonaq siyahısı', value: `${formatNumber(summary.guests ?? 0)} nəfər` },
    { label: 'RSVP / təbriklər', value: formatNumber(summary.rsvp ?? 0) },
    { label: 'Foto / video (qalereya)', value: formatNumber(summary.media ?? 0) },
    {
      label: 'Serverdəki fayllar',
      value: `${formatNumber(summary.files ?? 0)} fayl${summary.size ? ` · ${summary.size}` : ''}`,
    },
    {
      label: 'Bağlı sifariş',
      value: summary.order ? <OrderCode className="text-espresso">{summary.order}</OrderCode> : '—',
    },
  ];

  return (
    <Modal
      open={open}
      onClose={deleting ? () => {} : onCancel}
      dismissible={!deleting}
      size="sm"
      title="Birdəfəlik silinsin?"
      icon={
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rust-mist text-rust">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
      }
      description={
        invitation && (
          <>
            <strong className="font-semibold text-espresso">{invitation.names}</strong> dəvətnaməsi bütün
            məlumatları ilə silinəcək. Link işləməyəcək, şəkillər və qonaq siyahısı{' '}
            <strong className="font-semibold text-rust">geri qaytarılmayacaq</strong>.
          </>
        )
      }
      footer={
        <>
          <Button onClick={onCancel} disabled={deleting} data-autofocus>
            Ləğv et
          </Button>
          {state === 'error' && onRetry ? (
            <Button variant="danger" icon={Trash2} onClick={onRetry}>
              Yenidən cəhd et
            </Button>
          ) : (
            <Button
              variant="danger"
              icon={Trash2}
              loading={deleting}
              disabled={!match || counting}
              onClick={onConfirm}
            >
              {deleting ? 'Silinir…' : 'Birdəfəlik sil'}
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-[13px] font-semibold text-[#3F342E]">
            {counting ? 'Silinəcəklər hesablanır…' : 'Silinəcəklər'}
          </p>
          <SummaryList items={items} loading={counting} />
        </div>
        {state === 'error' && <Notice tone="danger">{errorText}</Notice>}
        <Field
          label={
            <>
              Təsdiq üçün kodu yazın:{' '}
              <span className="break-all font-mono font-medium text-rust">{slug}</span>
            </>
          }
        >
          <Input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={slug}
            disabled={deleting}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="font-mono"
          />
        </Field>
      </div>
    </Modal>
  );
}
