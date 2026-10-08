// ════════════════════════════════════════════════════════════════
// OrdersList — sifarişlər siyahısı (YALNIZ görünüş)
//
// Filtrləmə, axtarış və silmə SİZİN məntiqinizdədir: komponentə aktiv taba uyğun
// `orders` massivini verin. Birdəfəlik silmə təsdiq pəncərələri komponentin içindədir
// (iki addımlı), təsdiqdən sonra `onPurge(order)` / `onPurgeAll()` çağırılır.
// ════════════════════════════════════════════════════════════════
import { useState } from 'react';
import { Inbox, SearchX, Trash2 } from 'lucide-react';
import {
  Button,
  ConfirmDialog,
  DataTable,
  EmptyState,
  IconButton,
  Notice,
  OrderCode,
  PageHeader,
  StatusBadge,
  Tabs,
  TemplateLabel,
  Toolbar,
  formatPrice,
} from './adminUi';

/**
 * @typedef {object} OrderRow
 * @property {string} id
 * @property {string} code        DT-99JCW9
 * @property {string} date        Göstəriləcək tarix: «7 okt, 10:18»
 * @property {string} names       «Sevinc & Rauf»
 * @property {string} pkg         «Premium»
 * @property {number} [price]     129
 * @property {{name:string,color:string}} template
 * @property {'new'|'approved'|'rejected'|'deleted'|'draft'} status
 */

export const ORDER_TABS = [
  { id: 'new', label: 'Yeni' },
  { id: 'approved', label: 'Təsdiqlənmiş' },
  { id: 'rejected', label: 'Rədd' },
  { id: 'all', label: 'Hamısı' },
  { id: 'deleted', label: 'Silinmiş' },
];

const EMPTY = {
  new: { title: 'Yeni sifariş yoxdur', text: 'Müştəri sifariş göndərəndə burada görünəcək.' },
  approved: { title: 'Təsdiqlənmiş sifariş yoxdur', text: 'Təsdiq etdiyiniz sifarişlər bu tabda toplanır.' },
  rejected: { title: 'Rədd edilmiş sifariş yoxdur' },
  all: { title: 'Hələ sifariş yoxdur', text: 'İlk sifariş gələndə burada görünəcək.' },
  deleted: {
    title: 'Silinmiş sifariş yoxdur',
    text: 'Sildiyiniz sifarişlər birdəfəlik silinənə qədər burada qalır.',
  },
};

/**
 * @param {object} p
 * @param {OrderRow[]} p.orders  Aktiv tab + axtarış + filtr üzrə artıq süzülmüş siyahı
 * @param {'new'|'approved'|'rejected'|'all'|'deleted'} p.tab  @param {(tab:string)=>void} p.onTab
 * @param {Partial<Record<string,number>>} [p.counts]  Tab sayları { new: 3, approved: 4, … }
 * @param {string} [p.search]  @param {(q:string)=>void} [p.onSearch]
 * @param {string} [p.template]  Seçilmiş şablon filtri ('' = hamısı)
 * @param {(v:string)=>void} [p.onTemplate]
 * @param {{value:string,label:string}[]} [p.templates]  Filtr seçimləri (birinci: «Bütün şablonlar»)
 * @param {()=>void} [p.onRefresh]  @param {boolean} [p.refreshing]  @param {boolean} [p.loading]
 * @param {(o:OrderRow)=>void} p.onOpen  Sətrə klik → detal
 * @param {(o:OrderRow)=>void|Promise<void>} [p.onPurge]  Silinmiş tabında birdəfəlik silmə (təsdiqdən sonra).
 *        Promise qaytarsanız, bitənə qədər pəncərə açıq qalır (`purging` ilə spinner).
 * @param {()=>void} [p.onPurgeAll]  «Hamısını birdəfəlik sil» (SİL yazıldıqdan sonra)
 * @param {boolean} [p.purging]  Silmə gedir (təsdiq düyməsində spinner)
 * @param {number} [p.total]  Başlıq altındakı ümumi say (default: orders.length)
 */
export default function OrdersList({
  orders = [],
  tab,
  onTab,
  counts = {},
  search = '',
  onSearch,
  template = '',
  onTemplate,
  templates = [{ value: '', label: 'Bütün şablonlar' }],
  onRefresh,
  refreshing = false,
  loading = false,
  onOpen,
  onPurge,
  onPurgeAll,
  purging = false,
  total,
}) {
  const [confirm, setConfirm] = useState(null); // { type:'one', order } | { type:'all' }
  const deletedTab = tab === 'deleted';
  const filtered = Boolean(search || template);

  const columns = [
    {
      key: 'date',
      header: 'Tarix',
      nowrap: true,
      width: '128px',
      mobile: 'meta',
      cellClassName: 'text-[#5C4A3A] tabular-nums',
    },
    {
      key: 'names',
      header: 'Bəy / Gəlin',
      primary: true,
      mobile: 'title',
      /* Digitoy: təsdiqlənib, amma dəvətnaməsi yoxdur (Phase 48) — sətirdə qeyd */
      render: (o) =>
        o.note ? (
          <span className="grid gap-0.5">
            <span>{o.names}</span>
            <span className="text-[12.5px] font-semibold text-rust">{o.note}</span>
          </span>
        ) : (
          o.names
        ),
    },
    {
      key: 'pkg',
      header: 'Paket',
      nowrap: true,
      mobile: 'meta',
      render: (o) => `${o.pkg}${o.price != null ? ` (${formatPrice(o.price)})` : ''}`,
      cellClassName: 'text-[#3F342E]',
    },
    {
      key: 'template',
      header: 'Şablon',
      mobile: 'meta',
      render: (o) => <TemplateLabel name={o.template?.name} color={o.template?.color} />,
      cellClassName: 'text-[#3F342E] max-w-[180px]',
    },
    {
      key: 'code',
      header: 'Sifariş kodu',
      nowrap: true,
      mobile: 'code',
      render: (o) => <OrderCode>{o.code}</OrderCode>,
    },
    {
      key: 'status',
      header: 'Status',
      nowrap: true,
      mobile: 'badge',
      render: (o) => <StatusBadge status={o.status} size="sm" />,
    },
  ];
  if (deletedTab && onPurge) {
    columns.push({
      key: 'purge',
      header: <span className="sr-only">Əməliyyat</span>,
      width: '64px',
      align: 'right',
      mobile: 'action',
      render: (o) => (
        <IconButton
          label={`Birdəfəlik sil: ${o.names}`}
          icon={Trash2}
          destructive
          size="sm"
          tooltipAlign="end"
          onClick={() => setConfirm({ type: 'one', order: o })}
        />
      ),
    });
  }

  const empty = filtered ? (
    <EmptyState
      icon={SearchX}
      title={search ? `«${search}» üzrə nəticə tapılmadı` : 'Bu filtrə uyğun sifariş yoxdur'}
      text="DT kodunu, adı və ya telefonu yoxlayın, ya da filtri sıfırlayın."
      action={
        <Button
          onClick={() => {
            onSearch?.('');
            onTemplate?.('');
          }}
        >
          Axtarışı təmizlə
        </Button>
      }
    />
  ) : (
    <EmptyState icon={deletedTab ? Trash2 : Inbox} title={EMPTY[tab]?.title} text={EMPTY[tab]?.text} />
  );

  return (
    <div>
      <PageHeader title="Sifarişlər" subtitle={loading ? 'Yüklənir…' : `${total ?? orders.length} sifariş`} />

      <Toolbar
        search={{
          value: search,
          onChange: onSearch,
          placeholder: 'DT kodu, ad, telefon...',
          label: 'Sifariş axtar',
        }}
        filters={
          onTemplate
            ? [{ value: template, onChange: onTemplate, options: templates, label: 'Şablon filtri' }]
            : []
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
        className="mb-4"
      />

      <Tabs
        label="Sifariş statusu"
        value={tab}
        onChange={onTab}
        tabs={ORDER_TABS.map((t) => ({ ...t, count: counts[t.id] }))}
        className="mb-4"
      />

      {deletedTab && orders.length > 0 && !loading && (
        <Notice
          tone="danger"
          icon={Trash2}
          className="mb-4"
          action={
            onPurgeAll && (
              <Button variant="danger" size="sm" icon={Trash2} onClick={() => setConfirm({ type: 'all' })}>
                Hamısını birdəfəlik sil ({orders.length})
              </Button>
            )
          }
        >
          Silinmiş sifarişlər buradan birdəfəlik silinə bilər — bir daha heç yerdə görünməyəcək.
        </Notice>
      )}

      <DataTable
        caption="Sifarişlər"
        columns={columns}
        rows={orders}
        loading={loading}
        onRowClick={onOpen}
        rowLabel={(o) => `Sifarişi aç: ${o.names}, ${o.code}`}
        empty={empty}
      />

      <ConfirmDialog
        open={confirm?.type === 'one'}
        title="Sifarişi birdəfəlik silmək?"
        description={
          confirm?.order && (
            <>
              <strong className="font-semibold text-espresso">{confirm.order.names}</strong> ·{' '}
              <OrderCode>{confirm.order.code}</OrderCode> — sifariş və ona bağlı bütün məlumat silinəcək.
            </>
          )
        }
        guard="double"
        confirmLabel="Birdəfəlik sil"
        busy={purging}
        onCancel={() => setConfirm(null)}
        onConfirm={() =>
          Promise.resolve(onPurge?.(confirm.order)).then(
            () => setConfirm(null),
            () => {},
          )
        }
      />
      <ConfirmDialog
        open={confirm?.type === 'all'}
        title={`${orders.length} sifarişi birdəfəlik silmək?`}
        description="Silinmiş tabındakı bütün sifarişlər bir daha heç yerdə görünməyəcək. Bu əməliyyat geri qaytarılmır."
        guard="type"
        confirmLabel="Hamısını birdəfəlik sil"
        busy={purging}
        onCancel={() => setConfirm(null)}
        onConfirm={() =>
          Promise.resolve(onPurgeAll?.()).then(
            () => setConfirm(null),
            () => {},
          )
        }
      />
    </div>
  );
}
