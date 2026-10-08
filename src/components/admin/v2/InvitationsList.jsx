// ════════════════════════════════════════════════════════════════
// InvitationsList — «Dəvətnamələr» siyahısı (YALNIZ görünüş)
//
// Hər sətirdə 2 əsas düymə yazı ilə görünür (Məzmun, Tərcümə); qalanları «⋯»
// menyusundadır. Təhlükəli əməliyyatlar (linki bağla, birdəfəlik sil) menyuda ayırıcı
// xəttdən sonra, qırmızı tonda durur. Linki bağlamaq aydın təsdiq pəncərəsi ilə olur;
// birdəfəlik silmə üçün PurgeInvitationDialog-u siz açırsınız (`onPurge(inv)`).
// ════════════════════════════════════════════════════════════════
import { useState } from 'react';
import {
  Check,
  ExternalLink,
  FileText,
  Languages,
  Link2,
  Power,
  SearchX,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import {
  ActionMenu,
  Button,
  ConfirmDialog,
  DataTable,
  EmptyState,
  PageHeader,
  StatusBadge,
  TemplateLabel,
  Toolbar,
  cx,
} from './adminUi';

/**
 * @typedef {object} InvitationRow
 * @property {string} id  @property {string} slug  aysel-ve-nicat-jpf2lc
 * @property {string} names  «Aysel & Nicat»
 * @property {{name:string,color:string}} template
 * @property {string} kind  «Toy» / «Nişan» / «Korporativ» …
 * @property {string} [venue]  @property {string} created  «7 okt 2026»
 * @property {boolean} active
 * @property {{en?:boolean,ru?:boolean}} [translations]  Tərcümə mövcuddurmu
 * @property {string} [url]  Dəvətnamənin ünvanı («Dəvətnaməni aç»)
 */

/** Tərcümə mövcudluğu: «EN ✓ RU» kiçik nişanlar (mətnlə, yalnız rəng deyil). */
export function TranslationPills({ translations = {}, className = '' }) {
  return (
    <span className={cx('inline-flex gap-1', className)}>
      {['en', 'ru'].map((l) => {
        const ok = Boolean(translations[l]);
        return (
          <span
            key={l}
            className={cx(
              'inline-flex h-5 items-center gap-0.5 rounded px-1.5 text-[11.5px] font-semibold',
              ok ? 'bg-olive-mist text-[#3D5530]' : 'bg-[#EFEBE5] text-[#6B5E54]',
            )}
          >
            {l.toUpperCase()}
            {ok && <Check className="h-3 w-3" aria-hidden="true" />}
            <span className="sr-only">{ok ? ' mövcuddur' : ' yoxdur'}</span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * @param {object} p
 * @param {InvitationRow[]} p.invitations  Axtarışa görə süzülmüş siyahı
 * @param {number} [p.total]  Başlıq altındakı say
 * @param {string} [p.search]  @param {(q:string)=>void} [p.onSearch]
 * @param {()=>void} [p.onRefresh]  @param {boolean} [p.refreshing]  @param {boolean} [p.loading]
 * @param {(inv:InvitationRow)=>void} p.onOpenContent    Məzmun meneceri
 * @param {(inv:InvitationRow)=>void} p.onOpenTranslate  Məzmun tərcüməsi
 * @param {(inv:InvitationRow, active:boolean)=>void|Promise<void>} p.onToggleActive
 *        false — linki bağla (təsdiqdən sonra), true — yenidən aç (birbaşa)
 * @param {(inv:InvitationRow)=>void} p.onPurge  «Birdəfəlik sil» (PurgeInvitationDialog-u açın)
 * @param {(inv:InvitationRow)=>void|Promise<void>} [p.onCopyLink]  Menyuda «Linki kopyala»
 * @param {string} [p.togglingId]  Status dəyişən sətir (təsdiq düyməsində spinner)
 */
export default function InvitationsList({
  invitations = [],
  total,
  search = '',
  onSearch,
  onRefresh,
  refreshing = false,
  loading = false,
  onOpenContent,
  onOpenTranslate,
  onToggleActive,
  onPurge,
  onCopyLink,
  togglingId,
}) {
  const [deactivate, setDeactivate] = useState(null);

  const menu = (inv) => [
    {
      id: 'open',
      label: 'Dəvətnaməni aç',
      icon: ExternalLink,
      onSelect: () => inv.url && window.open(inv.url, '_blank', 'noopener'),
      hidden: !inv.url,
    },
    {
      id: 'copy',
      label: 'Linki kopyala',
      icon: Link2,
      onSelect: () => onCopyLink?.(inv),
      hidden: !onCopyLink,
    },
    { id: 'div', divider: true },
    inv.active
      ? {
          id: 'off',
          label: 'Linki bağla (deaktiv et)',
          icon: Power,
          destructive: true,
          onSelect: () => setDeactivate(inv),
        }
      : { id: 'on', label: 'Linki yenidən aç', icon: Power, onSelect: () => onToggleActive?.(inv, true) },
    { id: 'purge', label: 'Birdəfəlik sil', icon: Trash2, destructive: true, onSelect: () => onPurge?.(inv) },
  ];

  const actions = (inv, mobile = false) => (
    <>
      <Button
        size="sm"
        icon={SlidersHorizontal}
        onClick={() => onOpenContent?.(inv)}
        className={mobile ? 'flex-1' : ''}
      >
        Məzmun
      </Button>
      <Button
        size="sm"
        icon={Languages}
        onClick={() => onOpenTranslate?.(inv)}
        className={mobile ? 'flex-1' : ''}
      >
        Tərcümə
        {!mobile && <TranslationPills translations={inv.translations} className="ml-0.5" />}
      </Button>
      <ActionMenu
        label={`${inv.names} — digər əməliyyatlar`}
        variant="secondary"
        size="sm"
        items={menu(inv)}
      />
    </>
  );

  const columns = [
    {
      key: 'names',
      header: 'Dəvətnamə',
      mobile: 'title',
      render: (inv) => (
        <span className="block min-w-0">
          <span className="block font-medium text-espresso">{inv.names}</span>
          <span className="block truncate font-mono text-[12.5px] text-[#6B5E54]">{inv.slug}</span>
        </span>
      ),
      mobileRender: (inv) => inv.names,
      cellClassName: 'max-w-[260px]',
    },
    {
      key: 'slug',
      header: 'Slug',
      mobile: 'code',
      colClassName: 'hidden',
      render: (inv) => <span className="font-mono text-[13px] text-[#3F342E]">{inv.slug}</span>,
    },
    {
      key: 'template',
      header: 'Şablon',
      mobile: 'meta',
      render: (inv) => (
        <span className="block min-w-0">
          <TemplateLabel {...inv.template} />
          <span className="block text-[13px] text-[#6B5E54]">{inv.kind}</span>
        </span>
      ),
      mobileRender: (inv) => <TemplateLabel {...inv.template} />,
      colClassName: 'max-xl:hidden',
      cellClassName: 'max-w-[170px] text-[#3F342E]',
    },
    { key: 'kind', header: 'Növ', mobile: 'meta', colClassName: 'hidden' },
    {
      key: 'tr',
      header: 'Tərcümə',
      mobile: 'meta',
      colClassName: 'hidden',
      render: (inv) => <TranslationPills translations={inv.translations} />,
    },
    {
      key: 'venue',
      header: 'Məkan',
      mobile: 'detail',
      colClassName: 'max-2xl:hidden',
      cellClassName: 'max-w-[180px] truncate text-[#3F342E]',
    },
    {
      key: 'created',
      header: 'Yaradılma',
      mobile: 'meta',
      nowrap: true,
      colClassName: 'max-[1400px]:hidden',
      cellClassName: 'text-[#5C4A3A] tabular-nums',
    },
    {
      key: 'status',
      header: 'Status',
      mobile: 'badge',
      nowrap: true,
      render: (inv) => <StatusBadge kind="invite" status={inv.active ? 'active' : 'inactive'} size="sm" />,
    },
    {
      key: 'actions',
      header: <span className="sr-only">Əməliyyatlar</span>,
      align: 'right',
      nowrap: true,
      mobile: 'footer',
      render: (inv) => <div className="flex justify-end gap-2">{actions(inv)}</div>,
      mobileRender: (inv) => actions(inv, true),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dəvətnamələr"
        subtitle={loading ? 'Yüklənir…' : `${total ?? invitations.length} dəvətnamə`}
      />
      <Toolbar
        search={{
          value: search,
          onChange: onSearch,
          placeholder: 'Slug, ad axtar...',
          label: 'Dəvətnamə axtar',
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        className="mb-4"
      />
      <DataTable
        caption="Dəvətnamələr"
        columns={columns}
        rows={invitations}
        loading={loading}
        empty={
          search ? (
            <EmptyState
              icon={SearchX}
              title={`«${search}» üzrə dəvətnamə tapılmadı`}
              action={<Button onClick={() => onSearch?.('')}>Axtarışı təmizlə</Button>}
            />
          ) : (
            <EmptyState
              icon={FileText}
              title="Hələ dəvətnamə yoxdur"
              text="Sifariş təsdiqlənəndə dəvətnamə burada görünür."
            />
          )
        }
      />

      <ConfirmDialog
        open={!!deactivate}
        title="Linki bağlamaq?"
        description={
          deactivate && (
            <>
              <strong className="font-semibold text-espresso">{deactivate.names}</strong> dəvətnaməsinin linki
              bağlanacaq. Qonaqlar «Bu dəvətnamə deaktiv edilmişdir» səhifəsini görəcək. Sonra yenidən aça
              bilərsiniz.
            </>
          )
        }
        confirmLabel="Linki bağla"
        busy={deactivate && togglingId === deactivate.id}
        onCancel={() => setDeactivate(null)}
        onConfirm={() =>
          Promise.resolve(onToggleActive?.(deactivate, false)).then(
            () => setDeactivate(null),
            () => {},
          )
        }
      />
    </div>
  );
}
