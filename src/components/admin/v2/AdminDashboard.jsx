// ════════════════════════════════════════════════════════════════
// AdminDashboard — ümumi statistika (YALNIZ görünüş)
//
// Ən vacib iş öndədir: təsdiq gözləyən sifarişlər varsa, səhifənin başında aydın blok
// və «Sifarişlərə keç». Məlumatı olmayan qrafiklər böyük boş qutu əvəzinə yığcam
// boş vəziyyət kimi görünür.
// ════════════════════════════════════════════════════════════════
import {
  ArrowRight,
  BarChart3,
  CircleCheck,
  CircleX,
  Clock3,
  FileText,
  Heart,
  Image as ImageIcon,
  MonitorPlay,
  ScanLine,
  ShoppingBag,
  Star,
  Upload,
  Eye,
} from 'lucide-react';
import {
  BarList,
  Button,
  EmptyState,
  FOCUS,
  MiniBarChart,
  PageHeader,
  Panel,
  RefreshButton,
  Skeleton,
  StatCard,
  cx,
  formatNumber,
  formatPrice,
  isEmptySeries,
} from './adminUi';

/**
 * @typedef {{id:string,names:string,pkg:string,price?:number,date:string,code:string}} PendingOrder
 * @typedef {{label:string,value:number}} Point
 */

/**
 * @param {object} p
 * @param {{total:number,today?:number,pending:number,pending7d?:number,approved:number,rejected:number,invites:number,photos:number}} p.stats
 * @param {{count:number,items?:PendingOrder[]}} [p.pending]  Təsdiq gözləyən sifarişlər (ilk 3 göstərilir)
 * @param {()=>void} p.onOpenOrders   «Sifarişlərə keç»
 * @param {(o:PendingOrder)=>void} [p.onOpenOrder]  Gözləyən sifarişə klik
 * @param {Point[]} [p.packages]  Paket bölgüsü (VİP / Premium / Sadə)
 * @param {Point[]} [p.last7]     Son 7 gün — yeni sifarişlər
 * @param {object} [p.gallery]    Qalereya analitikası:
 *   { views, qrScans, uploads, reactions, featured, slideshows,
 *     views14: Point[], uploads14: Point[], byHour: number[24],
 *     top: {id,names,code,views,uploads}[] }
 * @param {(g:object)=>void} [p.onOpenGallery]  «Ən aktiv qalereyalar» sətrinə klik
 * @param {()=>void} [p.onRefresh]  @param {boolean} [p.refreshing]
 * @param {()=>void} [p.onGalleryRefresh]  @param {boolean} [p.galleryRefreshing]
 * @param {boolean} [p.loading]  İlk yüklənmə (skeleton)
 */
export default function AdminDashboard({
  stats = {},
  pending = { count: 0, items: [] },
  onOpenOrders,
  onOpenOrder,
  packages = [],
  last7 = [],
  gallery = {},
  onOpenGallery,
  onRefresh,
  refreshing = false,
  onGalleryRefresh,
  galleryRefreshing = false,
  loading = false,
}) {
  const g = gallery;
  const hasPending = (pending?.count ?? 0) > 0;
  const hourData = (g.byHour ?? Array(24).fill(0)).map((v, h) => ({
    label: String(h).padStart(2, '0'),
    value: v,
  }));
  const views14 = g.views14 ?? [];
  const uploads14 = g.uploads14 ?? [];
  const galleryEmpty = isEmptySeries(views14) && isEmptySeries(uploads14) && isEmptySeries(hourData);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Ümumi statistika"
        actions={onRefresh && <RefreshButton onClick={onRefresh} refreshing={refreshing} />}
      />

      {/* ── 1. Ən vacib iş: gözləyən sifarişlər ── */}
      {!loading &&
        (hasPending ? (
          <PendingBlock pending={pending} onOpenOrders={onOpenOrders} onOpenOrder={onOpenOrder} />
        ) : (
          <div className="mb-5 flex items-center gap-3 rounded-[12px] bg-olive-mist px-4 py-3 text-[14px] text-[#2E3F24] ring-1 ring-inset ring-[#C9D6B8]">
            <CircleCheck className="h-5 w-5 shrink-0 text-olive" aria-hidden="true" />
            Təsdiq gözləyən sifariş yoxdur.
          </div>
        ))}

      {/* ── 2. Sifariş göstəriciləri ── */}
      <h2 className="sr-only">Sifariş göstəriciləri</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={ShoppingBag}
          value={stats.total}
          label="Ümumi sifariş"
          note={stats.today != null && `Bu gün: ${stats.today}`}
          loading={loading}
        />
        <StatCard
          icon={Clock3}
          tone="amber"
          value={stats.pending}
          label="Gözləyən"
          note={stats.pending7d != null && `Son 7 gün: ${stats.pending7d}`}
          loading={loading}
        />
        <StatCard
          icon={CircleCheck}
          tone="olive"
          value={stats.approved}
          label="Təsdiqlənmiş"
          loading={loading}
        />
        <StatCard icon={CircleX} tone="rust" value={stats.rejected} label="Rədd edildi" loading={loading} />
        <StatCard icon={FileText} value={stats.invites} label="Dəvətnamələr" loading={loading} />
        <StatCard icon={ImageIcon} value={stats.photos} label="Fotolar" loading={loading} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Paket bölgüsü">
          {loading ? (
            <ChartSkeleton rows />
          ) : packages.length && packages.some((p) => p.value) ? (
            <BarList
              items={packages}
              formatValue={(v, t) => `${v} · ${t ? Math.round((v / t) * 100) : 0}%`}
            />
          ) : (
            <EmptyState compact icon={BarChart3} title="Hələ sifariş yoxdur" />
          )}
        </Panel>
        <Panel title="Son 7 gün" description="Gün üzrə yeni sifarişlər">
          {loading ? (
            <ChartSkeleton />
          ) : isEmptySeries(last7) ? (
            <EmptyState compact icon={BarChart3} title="Son 7 gündə sifariş gəlməyib" />
          ) : (
            <MiniBarChart
              data={last7}
              title="Son 7 gün — gün üzrə yeni sifarişlər"
              height={104}
              formatValue={(v) => `${v} sifariş`}
            />
          )}
        </Panel>
      </div>

      {/* ── 3. Qalereya analitikası ── */}
      <section aria-labelledby="dash-gallery" className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="dash-gallery" className="text-[18px] font-semibold text-espresso">
              Qalereya analitikası
            </h2>
            <p className="mt-0.5 text-[14px] text-[#6B5E54]">Bütün toylar üzrə — baxış, QR skan, yükləmə</p>
          </div>
          {onGalleryRefresh && <RefreshButton onClick={onGalleryRefresh} refreshing={galleryRefreshing} />}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <StatCard icon={Eye} value={g.views ?? 0} label="Qalereya baxışı" loading={loading} />
          <StatCard icon={ScanLine} value={g.qrScans ?? 0} label="QR skan" loading={loading} />
          <StatCard icon={Upload} value={g.uploads ?? 0} label="Yükləmə" loading={loading} />
          <StatCard icon={Heart} value={g.reactions ?? 0} label="Reaksiya" loading={loading} />
          <StatCard icon={Star} value={g.featured ?? 0} label="Seçilmiş media" loading={loading} />
          <StatCard icon={MonitorPlay} value={g.slideshows ?? 0} label="Slayd şou" loading={loading} />
        </div>

        {!loading && galleryEmpty ? (
          <EmptyState
            compact
            icon={BarChart3}
            title="Qrafiklər üçün hələ məlumat yoxdur"
            text="Qonaqlar QR kodu skan edib şəkil göndərdikcə gün və saat üzrə aktivlik burada görünəcək."
            className="mt-4 bg-white ring-1 ring-inset ring-[#E5DED2]"
          />
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Panel title="Son 14 gün" description="Gün üzrə baxış və yükləmə">
              {loading ? (
                <ChartSkeleton />
              ) : (
                <div className="space-y-5">
                  <SeriesBlock label="Baxış" data={views14} unit="baxış" />
                  <SeriesBlock label="Yükləmə" data={uploads14} unit="yükləmə" />
                </div>
              )}
            </Panel>
            <Panel
              title="Saat üzrə aktivlik"
              description="Qonaqların şəkil göndərdiyi saatlar — toy proqramını planlaşdırarkən faydalıdır"
            >
              {loading ? (
                <ChartSkeleton />
              ) : isEmptySeries(hourData) ? (
                <EmptyState compact title="Hələ yükləmə olmayıb" />
              ) : (
                <MiniBarChart
                  data={hourData}
                  title="Saat üzrə yükləmə"
                  height={132}
                  formatValue={(v) => `${v} yükləmə`}
                />
              )}
            </Panel>
          </div>
        )}

        <Panel title="Ən aktiv qalereyalar" className="mt-4" flush={!!g.top?.length}>
          {loading ? (
            <ChartSkeleton rows />
          ) : g.top?.length ? (
            <ol className="divide-y divide-[#EEE8DF] border-t border-[#EEE8DF]">
              {g.top.map((t, i) => {
                const Row = onOpenGallery ? 'button' : 'div';
                return (
                  <li key={t.id}>
                    <Row
                      type={onOpenGallery ? 'button' : undefined}
                      onClick={onOpenGallery ? () => onOpenGallery(t) : undefined}
                      className={cx(
                        'flex w-full items-center gap-4 px-4 py-3 text-left sm:px-5',
                        onOpenGallery &&
                          cx(
                            'hover:bg-[#FBF9F5]',
                            FOCUS,
                            'focus-visible:ring-inset focus-visible:ring-offset-0',
                          ),
                      )}
                    >
                      <span className="w-6 shrink-0 text-[14px] font-semibold text-[#8A7D72] tabular-nums">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] font-medium text-espresso">
                          {t.names}
                        </span>
                        <span className="font-mono text-[12.5px] text-[#6B5E54]">{t.code}</span>
                      </span>
                      <span className="shrink-0 text-right text-[13.5px] text-[#5C4A3A] tabular-nums">
                        <span className="block">{formatNumber(t.views)} baxış</span>
                        <span className="block text-[#6B5E54]">{formatNumber(t.uploads)} yükləmə</span>
                      </span>
                    </Row>
                  </li>
                );
              })}
            </ol>
          ) : (
            <EmptyState compact icon={ImageIcon} title="Hələ qalereya aktivliyi qeydə alınmayıb" />
          )}
        </Panel>
      </section>
    </div>
  );
}

function PendingBlock({ pending, onOpenOrders, onOpenOrder }) {
  const items = (pending.items ?? []).slice(0, 3);
  return (
    <section
      aria-labelledby="dash-pending"
      className="mb-5 rounded-[12px] bg-[#FBF3E2] ring-1 ring-inset ring-[#E9D3A1]"
    >
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white text-[#6E5114] ring-1 ring-inset ring-[#E9D3A1]">
            <Clock3 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="dash-pending" className="text-[16px] font-semibold text-[#3F2F0C]">
              {pending.count} yeni sifariş təsdiq gözləyir
            </h2>
            <p className="mt-0.5 text-[13.5px] text-[#5E4A1C]">
              Təsdiq olunana qədər müştərinin dəvətnaməsi aktiv olmur.
            </p>
          </div>
        </div>
        <Button variant="primary" iconRight={ArrowRight} onClick={onOpenOrders} className="max-sm:w-full">
          Sifarişlərə keç
        </Button>
      </div>
      {items.length > 0 && (
        <ul className="divide-y divide-[#EEDDB6] border-t border-[#EEDDB6]">
          {items.map((o) => {
            const Row = onOpenOrder ? 'button' : 'div';
            return (
              <li key={o.id}>
                <Row
                  type={onOpenOrder ? 'button' : undefined}
                  onClick={onOpenOrder ? () => onOpenOrder(o) : undefined}
                  className={cx(
                    'flex w-full flex-wrap items-center gap-x-4 gap-y-0.5 px-4 py-3 text-left sm:flex-nowrap sm:px-5',
                    onOpenOrder &&
                      cx('hover:bg-[#F8EBCF]', FOCUS, 'focus-visible:ring-inset focus-visible:ring-offset-0'),
                  )}
                >
                  <span className="min-w-0 flex-1 truncate text-[14.5px] font-medium text-espresso">
                    {o.names}
                  </span>
                  <span className="text-[13.5px] text-[#5E4A1C]">
                    {o.pkg}
                    {o.price != null && ` (${formatPrice(o.price)})`}
                  </span>
                  <span className="text-[13.5px] text-[#5E4A1C] tabular-nums">{o.date}</span>
                  <span className="font-mono text-[12.5px] tracking-wide text-[#5E4A1C] max-sm:hidden">
                    {o.code}
                  </span>
                </Row>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function SeriesBlock({ label, data, unit }) {
  return (
    <div>
      <p className="mb-1 text-[13px] font-semibold text-[#3F342E]">{label}</p>
      {isEmptySeries(data) ? (
        <p className="rounded-[8px] bg-[#FAF8F4] px-3 py-2.5 text-[13.5px] text-[#6B5E54]">
          Bu dövrdə {unit} olmayıb.
        </p>
      ) : (
        <MiniBarChart
          data={data}
          title={`Son 14 gün — gün üzrə ${unit}`}
          height={84}
          formatValue={(v) => `${formatNumber(v)} ${unit}`}
        />
      )}
    </div>
  );
}

function ChartSkeleton({ rows = false }) {
  if (rows)
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="mt-2 h-2 w-full" />
          </div>
        ))}
      </div>
    );
  return (
    <div className="flex h-[120px] items-end gap-1.5">
      {[30, 55, 20, 70, 45, 90, 60].map((h, i) => (
        <Skeleton key={i} className="w-full" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}
