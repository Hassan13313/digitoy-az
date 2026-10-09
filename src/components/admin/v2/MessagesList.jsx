// ════════════════════════════════════════════════════════════════
// MessagesList — «Təbrik Məktubları» (YALNIZ görünüş)
//
// Mesajlar kartdır: uzun mətn rahat oxunur (sətir sonları və emoji saxlanılır, çox uzun
// mətn «Hamısını göstər» ilə açılır). Dəvətnaməyə görə filtr (select) və «Dəvətnaməyə
// görə» qruplaşdırma. Silmə təsdiqlə olur. Axtarış/filtrləmə SİZDƏDİR.
// ════════════════════════════════════════════════════════════════
import { useMemo, useState } from 'react';
import { ExternalLink, MessageSquare, SearchX, Trash2 } from 'lucide-react';
import {
  Button,
  ConfirmDialog,
  EmptyState,
  FOCUS,
  PageHeader,
  SearchInput,
  SegmentedControl,
  Select,
  Skeleton,
  RefreshButton,
  cx,
} from './adminUi';

/**
 * @typedef {object} GuestMessage
 * @property {string} id  @property {string} author  @property {string} text
 * @property {string} date  «7 okt 2026, 13:06»
 * @property {{slug:string,names?:string,url?:string}} invitation
 */

/**
 * @param {object} p
 * @param {GuestMessage[]} p.messages  Axtarış və filtrə görə süzülmüş
 * @param {number} [p.total]
 * @param {string} [p.search]  @param {(q:string)=>void} [p.onSearch]
 * @param {string} [p.invitationFilter]  '' = hamısı  @param {(slug:string)=>void} [p.onInvitationFilter]
 * @param {{value:string,label:string}[]} [p.invitationOptions]  Birinci: «Bütün dəvətnamələr»
 * @param {'list'|'grouped'} [p.view]  @param {(v:'list'|'grouped')=>void} [p.onView]
 * @param {(m:GuestMessage)=>void|Promise<void>} p.onDeleteMessage  Təsdiqdən sonra
 * @param {string} [p.deletingId]
 * @param {()=>void} [p.onRefresh]  @param {boolean} [p.refreshing]  @param {boolean} [p.loading]
 */
export default function MessagesList({
  messages = [],
  total,
  search = '',
  onSearch,
  invitationFilter = '',
  onInvitationFilter,
  invitationOptions = [{ value: '', label: 'Bütün dəvətnamələr' }],
  view: viewProp,
  onView,
  onDeleteMessage,
  deletingId,
  onRefresh,
  refreshing = false,
  loading = false,
}) {
  const [viewInner, setViewInner] = useState('list');
  const view = viewProp ?? viewInner;
  const [del, setDel] = useState(null);

  const groups = useMemo(() => {
    const m = new Map();
    messages.forEach((msg) => {
      const k = msg.invitation?.slug ?? '—';
      if (!m.has(k)) m.set(k, { invitation: msg.invitation, items: [] });
      m.get(k).items.push(msg);
    });
    return [...m.values()];
  }, [messages]);

  const filtered = Boolean(search || invitationFilter);

  return (
    <div>
      <PageHeader
        title="Təbrik Məktubları"
        subtitle={loading ? 'Yüklənir…' : `${total ?? messages.length} mesaj`}
      />

      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center">
        <SearchInput
          value={search}
          onChange={onSearch}
          placeholder="Ad, mətn, slug axtar..."
          label="Mesaj axtar"
          className="lg:max-w-[360px] lg:flex-1"
        />
        <div className="flex min-w-0 gap-2 lg:ml-auto">
          {onInvitationFilter && (
            <div className="min-w-0 flex-1 lg:w-60 lg:flex-none">
              <label htmlFor="msg-inv" className="sr-only">
                Dəvətnamə filtri
              </label>
              <Select
                id="msg-inv"
                value={invitationFilter}
                onValueChange={onInvitationFilter}
                options={invitationOptions}
              />
            </div>
          )}
          {onRefresh && <RefreshButton onClick={onRefresh} refreshing={refreshing} className="lg:h-11" />}
        </div>
      </div>
      <SegmentedControl
        label="Görünüş"
        value={view}
        onChange={(v) => {
          setViewInner(v);
          onView?.(v);
        }}
        options={[
          { value: 'list', label: 'Ən yenilər öndə' },
          { value: 'grouped', label: 'Dəvətnaməyə görə' },
        ]}
        className="mb-4"
      />

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-[12px] bg-white p-4 ring-1 ring-inset ring-[#E5DED2]">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-3 h-3.5 w-full" />
              <Skeleton className="mt-2 h-3.5 w-2/3" />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]">
          {filtered ? (
            <EmptyState
              icon={SearchX}
              title="Bu axtarışa uyğun mesaj yoxdur"
              action={
                <Button
                  onClick={() => {
                    onSearch?.('');
                    onInvitationFilter?.('');
                  }}
                >
                  Filtrləri sıfırla
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="Hələ təbrik yoxdur"
              text="Qonaqlar dəvətnamədə təbrik yazdıqca burada görünəcək."
            />
          )}
        </div>
      ) : view === 'grouped' ? (
        <div className="space-y-6">
          {groups.map((g) => (
            <section key={g.invitation?.slug} aria-label={g.invitation?.names ?? g.invitation?.slug}>
              <header className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="text-[16px] font-semibold text-espresso">
                  {g.invitation?.names ?? g.invitation?.slug}
                </h2>
                <InvitationLink invitation={g.invitation} />
                <span className="ml-auto text-[13.5px] text-[#6B5E54]">{g.items.length} mesaj</span>
              </header>
              <ul className="grid items-start gap-3 md:grid-cols-2">
                {g.items.map((m) => (
                  <MessageCard
                    key={m.id}
                    message={m}
                    hideInvitation
                    onDelete={() => setDel(m)}
                    deleting={deletingId === m.id}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <ul className="grid items-start gap-3 md:grid-cols-2">
          {messages.map((m) => (
            <MessageCard key={m.id} message={m} onDelete={() => setDel(m)} deleting={deletingId === m.id} />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!del}
        title="Mesajı silmək?"
        description={
          del && (
            <>
              <strong className="font-semibold text-espresso">{del.author}</strong> yazdığı təbrik
              dəvətnamədən də silinəcək:
              <span className="mt-2 block rounded-[8px] bg-[#FAF8F4] px-3 py-2 italic text-[#3F342E]">
                «{del.text.length > 120 ? `${del.text.slice(0, 120)}…` : del.text}»
              </span>
              {del.hasRsvp && (
                <span className="mt-2 block">Bu sətirdə iştirak cavabı da var — yalnız mətn silinir, cavab qalır.</span>
              )}
            </>
          )
        }
        confirmLabel="Mesajı sil"
        busy={del && deletingId === del.id}
        onCancel={() => setDel(null)}
        onConfirm={() =>
          Promise.resolve(onDeleteMessage?.(del)).then(
            () => setDel(null),
            () => {},
          )
        }
      />
    </div>
  );
}

function InvitationLink({ invitation }) {
  if (!invitation) return null;
  const inner = (
    <>
      <span className="truncate font-mono text-[12.5px]">{invitation.slug}</span>
      {invitation.url && <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
    </>
  );
  return invitation.url ? (
    <a
      href={invitation.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        'inline-flex min-h-11 max-w-full items-center gap-1.5 rounded lg:min-h-8 text-[#5C4A3A] underline-offset-4 hover:text-espresso hover:underline',
        FOCUS,
      )}
    >
      {inner}
      <span className="sr-only"> — dəvətnaməni yeni pəncərədə aç</span>
    </a>
  ) : (
    <span className="inline-flex max-w-full items-center gap-1.5 text-[#5C4A3A]">{inner}</span>
  );
}

/** Mesaj kartı. 280 simvoldan uzun mətn 6 sətirdə kəsilir, «Hamısını göstər» ilə açılır. */
export function MessageCard({ message: m, onDelete, deleting = false, hideInvitation = false }) {
  const [expanded, setExpanded] = useState(false);
  const long = m.text.length > 280;
  return (
    <li className="flex min-w-0 flex-col rounded-[12px] bg-white p-4 ring-1 ring-inset ring-[#E5DED2]">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-[15px] font-semibold text-espresso">
          {m.author}
          {m.hasRsvp && (
            <span
              title="Bu sətirdə iştirak cavabı da var — silinəndə yalnız mətn gedir, cavab qalır"
              className="ml-2 inline-flex h-5 items-center rounded bg-olive-mist px-1.5 align-middle text-[11.5px] font-semibold text-[#3D5530]"
            >
              İştirak
            </span>
          )}
        </p>
        <time className="shrink-0 text-[13px] text-[#6B5E54] tabular-nums">{m.date}</time>
      </div>
      {!hideInvitation && (
        <div className="mt-0.5">
          <InvitationLink invitation={m.invitation} />
        </div>
      )}
      <blockquote
        className={cx(
          'mt-2.5 whitespace-pre-line break-words text-[15px] leading-relaxed text-[#2C2523]',
          long && !expanded && 'line-clamp-6',
        )}
        style={{
          fontFamily:
            'Inter, system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
        }}
      >
        {m.text}
      </blockquote>
      <div className="mt-3 flex items-center justify-between gap-2">
        {long ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="-ml-2"
          >
            {expanded ? 'Qısalt' : 'Hamısını göstər'}
          </Button>
        ) : (
          <span />
        )}
        <Button
          variant="ghost"
          destructive
          size="sm"
          icon={Trash2}
          loading={deleting}
          onClick={onDelete}
          className="-mr-2"
        >
          Sil<span className="sr-only">: {m.author} mesajı</span>
        </Button>
      </div>
    </li>
  );
}
