// ════════════════════════════════════════════════════════════════
// GuestReportTab — «Qonaq hesabatı» (YALNIZ görünüş)
//
// Qruplaşdırma və filtrləmə SİZİN məntiqinizdədir: `groups`-u görünüşə (masalara /
// statusa görə) və filtrlərə uyğun hazırlayıb verin. Çap və CSV — callback.
// ════════════════════════════════════════════════════════════════
import { Download, Printer, SearchX, Users } from 'lucide-react';
import {
  ActionMenu,
  Button,
  DataTable,
  EmptyState,
  FilterChips,
  RefreshButton,
  RSVP_DOT,
  SearchInput,
  Select,
  Skeleton,
  StatCard,
  StatusBadge,
  Tabs,
  cx,
} from './adminUi';

/**
 * @typedef {{id:string,name:string,status:'yes'|'maybe'|'no'|'none',plus?:number,note?:string,date?:string}} ReportGuest
 * @typedef {{id:string,title:string,meta?:string,guests:ReportGuest[]}} ReportGroup
 */

const STATUS_CHIPS = [
  { id: 'all', label: 'Hamısı' },
  { id: 'yes', label: 'Gələcək', dot: RSVP_DOT.yes },
  { id: 'no', label: 'Gəlməyəcək', dot: RSVP_DOT.no },
  { id: 'maybe', label: 'Bəlkə', dot: RSVP_DOT.maybe },
  { id: 'none', label: 'Cavabsız', dot: RSVP_DOT.none },
];

/** Hər iki hesabat cədvəlində eyni sütunlar. */
export const guestColumns = [
  { key: 'name', header: 'Ad', mobile: 'title', width: '30%', cellClassName: 'font-medium break-words' },
  {
    key: 'status',
    header: 'Status',
    nowrap: true,
    width: '150px',
    mobile: 'badge',
    render: (g) => <StatusBadge kind="rsvp" status={g.status} size="sm" />,
  },
  {
    key: 'plus',
    header: 'Əlavə',
    width: '80px',
    align: 'center',
    mobile: 'meta',
    render: (g) =>
      g.plus > 0 ? (
        <span className="font-semibold tabular-nums">+{g.plus}</span>
      ) : (
        <span className="text-[#8A7D72]" aria-label="yoxdur">
          —
        </span>
      ),
    mobileRender: (g) => (g.plus > 0 ? `+${g.plus} qonaq` : null),
  },
  {
    key: 'note',
    header: 'Qeyd',
    mobile: 'detail',
    render: (g) => g.note || <span className="text-[#8A7D72]">—</span>,
    mobileRender: (g) => g.note || null,
    cellClassName: 'text-[#3F342E] max-w-[260px]',
  },
  {
    key: 'date',
    header: 'Tarix',
    nowrap: true,
    width: '110px',
    mobile: 'meta',
    render: (g) => g.date || <span className="text-[#8A7D72]">—</span>,
    mobileRender: (g) => g.date || null,
    cellClassName: 'text-[#5C4A3A] tabular-nums',
  },
];

/**
 * @param {object} p
 * @param {{total:number,yes:number,no:number,maybe:number,none:number,rate:number,plus:number,real:number}} p.stats
 *        rate — cavab faizi; real — real iştirak (gələcək + əlavə qonaq)
 * @param {'table'|'status'} p.view  @param {(v:'table'|'status')=>void} p.onView
 * @param {string} [p.search]  @param {(q:string)=>void} [p.onSearch]
 * @param {string} [p.tableFilter]  @param {(id:string)=>void} [p.onTableFilter]
 * @param {{value:string,label:string}[]} [p.tableOptions]  Birinci seçim: «Bütün masalar»
 * @param {'all'|'yes'|'no'|'maybe'|'none'} [p.statusFilter='all']  @param {(s:string)=>void} [p.onStatusFilter]
 * @param {Partial<Record<string,number>>} [p.statusCounts]
 * @param {ReportGroup[]} p.groups  @param {number} [p.shownCount]  «14 qonaq göstərilir»
 * @param {()=>void} [p.onResetFilters]  Boş nəticədə «Filtrləri sıfırla»
 * @param {()=>void} [p.onPrint]  @param {(by:'table'|'status')=>void} [p.onExportCsv]
 * @param {()=>void} [p.onRefresh]  @param {boolean} [p.refreshing]  @param {boolean} [p.loading]
 */
export default function GuestReportTab({
  stats = {},
  view = 'table',
  onView,
  search = '',
  onSearch,
  tableFilter = '',
  onTableFilter,
  tableOptions = [{ value: '', label: 'Bütün masalar' }],
  statusFilter = 'all',
  onStatusFilter,
  statusCounts = {},
  groups = [],
  shownCount,
  onResetFilters,
  onPrint,
  onExportCsv,
  onRefresh,
  refreshing = false,
  loading = false,
}) {
  const shown = shownCount ?? groups.reduce((n, g) => n + g.guests.length, 0);
  return (
    <section aria-labelledby="report-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="report-title" className="text-[16px] font-semibold text-espresso">
          Qonaq hesabatı
        </h2>
        <div className="flex flex-wrap gap-2">
          {onPrint && (
            <Button size="sm" icon={Printer} onClick={onPrint}>
              Çap et
            </Button>
          )}
          {onExportCsv && (
            <ActionMenu
              buttonText={
                <>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  CSV yüklə
                </>
              }
              label="CSV yüklə"
              variant="secondary"
              size="sm"
              items={[
                { id: 'table', label: 'Masalara görə', onSelect: () => onExportCsv('table') },
                { id: 'status', label: 'Statusa görə', onSelect: () => onExportCsv('status') },
              ]}
            />
          )}
          {onRefresh && <RefreshButton onClick={onRefresh} refreshing={refreshing} />}
        </div>
      </div>

      <h3 className="sr-only">Göstəricilər</h3>
      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatCard size="sm" icon={Users} value={stats.total ?? 0} label="Ümumi qonaq" loading={loading} />
        <StatCard size="sm" value={stats.yes ?? 0} label="Gələcək" dot={RSVP_DOT.yes} loading={loading} />
        <StatCard size="sm" value={stats.no ?? 0} label="Gəlməyəcək" dot={RSVP_DOT.no} loading={loading} />
        <StatCard size="sm" value={stats.maybe ?? 0} label="Bəlkə" dot={RSVP_DOT.maybe} loading={loading} />
        <StatCard size="sm" value={stats.none ?? 0} label="Cavabsız" dot={RSVP_DOT.none} loading={loading} />
        <StatCard size="sm" value={`${stats.rate ?? 0}%`} label="Cavab faizi" loading={loading} />
        <StatCard size="sm" value={stats.plus ?? 0} label="Əlavə qonaq" loading={loading} />
        <StatCard
          size="sm"
          emphasis
          value={stats.real ?? 0}
          label="Real iştirak"
          note="Gələcək + əlavə qonaq"
          loading={loading}
        />
      </div>

      {/* Filtrlər */}
      <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center">
        <Tabs
          variant="segmented"
          label="Qruplaşdırma"
          value={view}
          onChange={onView}
          tabs={[
            { id: 'table', label: 'Masalara görə' },
            { id: 'status', label: 'Statusa görə' },
          ]}
          className="self-start"
        />
        <div className="flex min-w-0 flex-1 gap-2 lg:justify-end">
          <SearchInput
            value={search}
            onChange={onSearch}
            placeholder="Ad axtar..."
            label="Qonaq adı ilə axtar"
            className="min-w-0 flex-1 lg:max-w-[280px]"
          />
          {onTableFilter && (
            <div className="w-[40%] shrink-0 sm:w-48">
              <label htmlFor="report-table" className="sr-only">
                Masa filtri
              </label>
              <Select
                id="report-table"
                value={tableFilter}
                onValueChange={onTableFilter}
                options={tableOptions}
              />
            </div>
          )}
        </div>
      </div>
      <FilterChips
        label="Status filtri"
        value={statusFilter}
        onChange={onStatusFilter}
        items={STATUS_CHIPS.map((c) => ({ ...c, count: statusCounts[c.id] }))}
        className="mb-3"
      />
      <p className="mb-3 text-[13.5px] text-[#6B5E54]" aria-live="polite">
        {loading ? 'Yüklənir…' : `${shown} qonaq göstərilir`}
      </p>

      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-[12px] bg-white p-4 ring-1 ring-inset ring-[#E5DED2]">
              <Skeleton className="h-4 w-24" />
              {[0, 1, 2].map((j) => (
                <Skeleton key={j} className="mt-4 h-3.5 w-full" />
              ))}
            </div>
          ))}
        </div>
      ) : groups.length === 0 || shown === 0 ? (
        <div className="rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]">
          <EmptyState
            icon={SearchX}
            title="Bu filtrə uyğun qonaq yoxdur"
            action={onResetFilters && <Button onClick={onResetFilters}>Filtrləri sıfırla</Button>}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {groups
            .filter((g) => g.guests.length)
            .map((g) => (
              <ReportGroupCard key={g.id} group={g} />
            ))}
        </div>
      )}
    </section>
  );
}

/** Qrup kartı: başlıq zolağı + daxili cədvəl (mobildə sətir siyahısı). */
export function ReportGroupCard({ group, columns = guestColumns }) {
  return (
    <section aria-label={group.title} className="rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]">
      <header className={cx('flex items-center justify-between gap-3 rounded-t-[12px] bg-[#F8F5F0] px-4 py-3')}>
        <h4 className="text-[15px] font-semibold text-espresso">{group.title}</h4>
        {group.meta && <span className="text-[13px] text-[#5C4A3A] tabular-nums">{group.meta}</span>}
      </header>
      <DataTable
        embedded
        fixed
        stickyHeader={false}
        caption={group.title}
        columns={columns}
        rows={group.guests}
      />
    </section>
  );
}
