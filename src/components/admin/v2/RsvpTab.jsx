// ════════════════════════════════════════════════════════════════
// RsvpTab — «İştirak təsdiqi cavabları» (qonaq siyahısı olmayan sadə RSVP)
// YALNIZ görünüş: süzülmüş `rows`-u siz verirsiniz; CSV / çap — callback.
// ════════════════════════════════════════════════════════════════
import { ClipboardCheck, Download, Printer, SearchX, UsersRound } from 'lucide-react';
import {
  Button,
  DataTable,
  EmptyState,
  RefreshButton,
  RSVP_DOT,
  SearchInput,
  StatCard,
  Tabs,
} from './adminUi';
import { guestColumns } from './GuestReportTab';

const RSVP_TABS = [
  { id: 'all', label: 'Hamısı' },
  { id: 'yes', label: 'Gələcək' },
  { id: 'maybe', label: 'Bəlkə' },
  { id: 'no', label: 'Gəlməyəcək' },
];

/** RSVP-də «Əlavə» sütunu «Qonaq» adlanır; qeyd sütunu yoxdur. */
const rsvpColumns = guestColumns
  .filter((c) => c.key !== 'note')
  .map((c) =>
    c.key === 'plus' ? { ...c, header: 'Qonaq' } : c.key === 'date' ? { ...c, width: '140px' } : c,
  );

/**
 * @param {object} p
 * @param {{yes:number,maybe:number,no:number,plus:number,total:number}} p.stats
 *        total — ümumi iştirakçı (gələcək + əlavə qonaq)
 * @param {{id:string,name:string,status:'yes'|'maybe'|'no',plus?:number,date?:string}[]} p.rows  Süzülmüş cavablar
 * @param {'all'|'yes'|'maybe'|'no'} p.tab  @param {(t:string)=>void} p.onTab
 * @param {Partial<Record<string,number>>} [p.counts]  Tab sayları
 * @param {string} [p.search]  @param {(q:string)=>void} [p.onSearch]
 * @param {()=>void} [p.onExportCsv]  @param {()=>void} [p.onPrint]
 * @param {()=>void} [p.onRefresh]  @param {boolean} [p.refreshing]  @param {boolean} [p.loading]
 */
export default function RsvpTab({
  stats = {},
  rows = [],
  tab = 'all',
  onTab,
  counts = {},
  search = '',
  onSearch,
  onExportCsv,
  onPrint,
  onRefresh,
  refreshing = false,
  loading = false,
}) {
  const noAnswers = !loading && !search && tab === 'all' && rows.length === 0;
  return (
    <section aria-labelledby="rsvp-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="rsvp-title" className="flex items-center gap-2 text-[16px] font-semibold text-espresso">
          İştirak təsdiqi cavabları
        </h2>
        <div className="flex flex-wrap gap-2">
          {onExportCsv && (
            <Button size="sm" icon={Download} onClick={onExportCsv}>
              CSV yüklə
            </Button>
          )}
          {onPrint && (
            <Button size="sm" icon={Printer} onClick={onPrint}>
              Çap et
            </Button>
          )}
          {onRefresh && <RefreshButton onClick={onRefresh} refreshing={refreshing} />}
        </div>
      </div>

      <h3 className="sr-only">Göstəricilər</h3>
      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.35fr)]">
        <StatCard size="sm" value={stats.yes ?? 0} label="Gələcək" dot={RSVP_DOT.yes} loading={loading} />
        <StatCard size="sm" value={stats.maybe ?? 0} label="Bəlkə" dot={RSVP_DOT.maybe} loading={loading} />
        <StatCard size="sm" value={stats.no ?? 0} label="Gəlməyəcək" dot={RSVP_DOT.no} loading={loading} />
        <StatCard size="sm" value={stats.plus ?? 0} label="Əlavə qonaq" loading={loading} />
        <StatCard
          emphasis
          icon={UsersRound}
          tone="gold"
          value={stats.total ?? 0}
          label="Ümumi iştirakçı"
          note={`${stats.yes ?? 0} gələcək + ${stats.plus ?? 0} əlavə qonaq`}
          loading={loading}
          className="col-span-2 sm:col-span-4 xl:col-span-1"
        />
      </div>

      {noAnswers ? (
        <div className="rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]">
          <EmptyState
            icon={ClipboardCheck}
            title="Hələ cavab yoxdur"
            text="Qonaqlar dəvətnamədə iştirakı təsdiq etdikcə cavablar burada görünəcək."
          />
        </div>
      ) : (
        <>
          <SearchInput
            value={search}
            onChange={onSearch}
            placeholder="Ad axtar..."
            label="Ad ilə axtar"
            className="mb-3 sm:max-w-[360px]"
          />
          <Tabs
            label="Cavab statusu"
            value={tab}
            onChange={onTab}
            tabs={RSVP_TABS.map((t) => ({ ...t, count: counts[t.id] }))}
            className="mb-4"
          />
          <DataTable
            caption="İştirak təsdiqi cavabları"
            columns={rsvpColumns}
            rows={rows}
            loading={loading}
            empty={
              <EmptyState
                icon={SearchX}
                title={search ? `«${search}» üzrə cavab tapılmadı` : 'Bu statusda cavab yoxdur'}
                action={search && <Button onClick={() => onSearch?.('')}>Axtarışı təmizlə</Button>}
              />
            }
          />
        </>
      )}
    </section>
  );
}
