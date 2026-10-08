// ════════════════════════════════════════════════════════════════
// 4) Statistika (cütlük) — YALNIZ görünüş
//   StatsSheet · StatTile · BarChart · HourChart · ReactionBreakdown
// Qrafiklər sadə div-lərlə qurulub (kitabxana yoxdur). Rəng: bir ton — qızılı (#A9822F,
// fona qarşı ≥ 3:1), ən yüksək dəyər tünd qızılı (#84652A) + üstündə rəqəm (yalnız rəngə güvənmir).
// Mətnlər rəngli deyil — mürəkkəb tonlarındadır. Hər qrafikdə toxunanda/hover-də dəqiq rəqəm görünür,
// klaviatura ilə ← → gəzmək olur, ekran oxuyucu üçün gizli cədvəl var.
// ════════════════════════════════════════════════════════════════
import { useId, useRef, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Eye,
  Film,
  Heart,
  Image as ImageIcon,
  Presentation,
  QrCode,
  RotateCw,
  Star,
  Upload,
} from 'lucide-react';
import Sheet from './Sheet';
import { useElementWidth } from './hooks';
import { Btn } from './shared';
import { FOCUS, formatNumber } from './tokens';

const BAR = '#A9822F';
const PEAK = '#84652A';
const ACTIVE = '#2C2523';

const TILE_DEFS = [
  { key: 'views', icon: Eye, label: 'Baxış' },
  { key: 'qrScans', icon: QrCode, label: 'QR skan' },
  { key: 'uploads', icon: Upload, label: 'Yükləmə' },
  { key: 'photos', icon: ImageIcon, label: 'Foto' },
  { key: 'videos', icon: Film, label: 'Video' },
  { key: 'featured', icon: Star, label: 'Seçilmiş' },
  { key: 'reactions', icon: Heart, label: 'Reaksiya' },
  { key: 'slideshows', icon: Presentation, label: 'Slayd şou' },
];

/**
 * @param {object} p
 * @param {boolean} p.open @param {()=>void} p.onClose
 * @param {'loading'|'error'|'empty'|'ready'} [p.state='ready']
 * @param {()=>void} [p.onRetry]
 * @param {string} [p.title='Qalereya Statistikası']
 * @param {React.ReactNode} [p.subtitle]                   «#aysel-ve-nicat · son 30 gün»
 * @param {{views?:number,qrScans?:number,uploads?:number,photos?:number,videos?:number,featured?:number,reactions?:number,slideshows?:number}} [p.totals]
 * @param {{label:string,value:number}[]} [p.viewsByDay]
 * @param {{label:string,value:number}[]} [p.uploadsByDay]
 * @param {number[]} [p.byHour]                            24 dəyər (00–23)
 * @param {{emoji:string,label:string,count:number}[]} [p.reactions]
 * @param {object} [p.labels]   { tiles:{views:'Baxış',…}, viewsByDay, uploadsByDay, byHour, reactions, error, retry, empty, emptyText, views, uploads, activity }
 */
export default function StatsSheet({
  open,
  onClose,
  state = 'ready',
  onRetry,
  title = 'Qalereya Statistikası',
  subtitle,
  totals = {},
  viewsByDay = [],
  uploadsByDay = [],
  byHour = [],
  reactions = [],
  labels = {},
  lang = 'az',
}) {
  const L = {
    viewsByDay: 'Gün üzrə baxış',
    uploadsByDay: 'Gün üzrə yükləmə',
    byHour: 'Saat üzrə aktivlik',
    reactions: 'Reaksiyalar',
    error: 'Statistikanı yükləmək alınmadı.',
    retry: 'Yenidən cəhd et',
    empty: 'Hələ statistika yoxdur',
    emptyText: 'Qonaqlar qalereyaya baxıb şəkil göndərdikcə rəqəmlər burada görünəcək.',
    views: 'baxış',
    uploads: 'yükləmə',
    activity: 'hərəkət',
    ...labels,
    tiles: {
      ...Object.fromEntries(TILE_DEFS.map((t) => [t.key, t.label])),
      ...(labels.tiles ?? {}),
    },
  };

  return (
    <Sheet open={open} onClose={onClose} title={title} subtitle={subtitle} size="lg" lang={lang}>
      {state === 'loading' && <StatsSkeleton />}
      {state === 'error' && (
        <div role="alert" className="flex flex-col items-center py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-rust-mist text-rust">
            <AlertTriangle className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
          </span>
          <p className="mt-4 text-[16px] font-medium text-ink">{L.error}</p>
          {onRetry && (
            <Btn variant="primary" icon={RotateCw} onClick={onRetry} className="mt-6">
              {L.retry}
            </Btn>
          )}
        </div>
      )}
      {state === 'empty' && (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-mist text-gold-deep">
            <BarChart3 className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="mt-4 font-serif text-[24px] text-ink">{L.empty}</p>
          <p className="mt-2 max-w-[38ch] text-[14.5px] leading-relaxed text-brown-dark">{L.emptyText}</p>
        </div>
      )}
      {state === 'ready' && (
        <div className="space-y-5">
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {TILE_DEFS.map((t) => (
              <li key={t.key}>
                <StatTile icon={t.icon} value={totals[t.key] ?? 0} label={L.tiles[t.key]} />
              </li>
            ))}
          </ul>
          {viewsByDay.length > 0 && (
            <ChartCard title={L.viewsByDay}>
              <BarChart
                data={viewsByDay}
                title={L.viewsByDay}
                formatValue={(v) => `${formatNumber(v)} ${L.views}`}
              />
            </ChartCard>
          )}
          {uploadsByDay.length > 0 && (
            <ChartCard title={L.uploadsByDay}>
              <BarChart
                data={uploadsByDay}
                title={L.uploadsByDay}
                formatValue={(v) => `${formatNumber(v)} ${L.uploads}`}
              />
            </ChartCard>
          )}
          {byHour.length > 0 && (
            <ChartCard title={L.byHour}>
              <HourChart
                data={byHour}
                title={L.byHour}
                formatValue={(v) => `${formatNumber(v)} ${L.activity}`}
              />
            </ChartCard>
          )}
          {reactions.length > 0 && (
            <ChartCard title={L.reactions}>
              <ReactionBreakdown items={reactions} />
            </ChartCard>
          )}
        </div>
      )}
    </Sheet>
  );
}

function ChartCard({ title, children }) {
  return (
    <section className="rounded-[20px] bg-white p-4 shadow-soft ring-1 ring-inset ring-beige-dark/80 sm:p-5">
      <h3 lang="az" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brown-dark">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Göstərici xanası.
 * @param {object} p
 * @param {React.ComponentType} p.icon
 * @param {number|string} p.value
 * @param {string} p.label
 */
export function StatTile({ icon: Icon, value, label }) {
  return (
    <div className="flex h-full items-center gap-3 rounded-[18px] bg-white p-3.5 shadow-soft ring-1 ring-inset ring-beige-dark/80 sm:p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-gold-mist text-gold-deep">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-[28px] font-medium leading-none text-ink lining-nums tabular-nums">
          {formatNumber(value)}
        </span>
        <span className="mt-1 block truncate text-[12.5px] text-brown-dark">{label}</span>
      </span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
/**
 * Sütunlu qrafik (bir seriya). Bir Tab dayanacağı: fokusda ← → ilə sütunlar arasında gəzilir.
 * @param {object} p
 * @param {{label:string, value:number, tooltipLabel?:string}[]} p.data
 * @param {string} p.title                         Ekran oxuyucu üçün qrafikin adı
 * @param {number} [p.highlight]                   Vurğulanan sütun (default: ən böyük dəyər)
 * @param {(v:number)=>string} [p.formatValue]     Tooltip rəqəmi: «412 baxış»
 * @param {number} [p.height=132]
 * @param {number} [p.labelEvery]                  Hər neçə sütundan bir etiket (default: enə görə)
 */
export function BarChart({
  data,
  title,
  highlight,
  formatValue = (v) => formatNumber(v),
  height = 132,
  labelEvery,
}) {
  const wrapRef = useRef(null);
  const width = useElementWidth(wrapRef);
  const tableId = useId();
  const [active, setActive] = useState(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const peak = highlight ?? data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);
  const fit = Math.max(2, Math.floor((width || 320) / 42));
  const step = labelEvery ?? Math.max(1, Math.ceil(data.length / fit));
  const n = data.length;

  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const d = e.key === 'ArrowRight' ? 1 : -1;
      setActive((a) => Math.min(n - 1, Math.max(0, (a ?? peak) + (a == null ? 0 : d))));
    } else if (e.key === 'Escape') setActive(null);
  };

  const a = active != null ? data[active] : null;
  const tipAlign =
    active == null ? '' : active < 2 ? 'left-0' : active > n - 3 ? 'right-0' : '-translate-x-1/2';

  return (
    <div ref={wrapRef}>
      <div
        role="img"
        tabIndex={0}
        aria-label={`${title}. ← → ilə dəyərlərə baxın.`}
        aria-describedby={tableId}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        className={`relative rounded-[8px] ${FOCUS}`}
        style={{ paddingTop: 26 }}
      >
        {/* tooltip */}
        {a && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 z-10 whitespace-nowrap rounded-[8px] bg-espresso px-2.5 py-1.5 text-[12px] font-medium text-cream shadow-lift ${tipAlign}`}
            style={active >= 2 && active <= n - 3 ? { left: `${((active + 0.5) / n) * 100}%` } : undefined}
          >
            <span className="text-sand">{a.tooltipLabel ?? a.label}</span> ·{' '}
            <span className="lining-nums">{formatValue(a.value)}</span>
          </div>
        )}

        <div className="flex items-end gap-[2px] border-b border-beige-dark" style={{ height }}>
          {data.map((d, i) => {
            const h = d.value > 0 ? Math.max(4, (d.value / max) * height) : 2;
            const isPeak = i === peak && d.value > 0;
            const isActive = i === active;
            return (
              <div
                key={`${d.label}-${i}`}
                className="relative flex h-full flex-1 cursor-pointer items-end"
                onPointerEnter={() => setActive(i)}
                onPointerDown={() => setActive(i)}
              >
                {isPeak && !isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[11.5px] font-semibold text-ink lining-nums"
                    style={{ bottom: h + 4 }}
                  >
                    {formatNumber(d.value)}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className="block w-full rounded-t-[4px] transition-[height,background-color] duration-500 ease-luxe"
                  style={{
                    height: h,
                    backgroundColor: d.value === 0 ? '#DDD5C8' : isActive ? ACTIVE : isPeak ? PEAK : BAR,
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex gap-[2px]" aria-hidden="true">
          {data.map((d, i) => (
            <span
              key={`${d.label}-l-${i}`}
              className={`flex-1 overflow-visible whitespace-nowrap text-center text-[10.5px] lining-nums tabular-nums ${
                i === active ? 'font-semibold text-ink' : 'text-brown-dark'
              }`}
            >
              {i % step === 0 ? d.label : ''}
            </span>
          ))}
        </div>
      </div>
      {/* ekran oxuyucu üçün cədvəl */}
      <table id={tableId} className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((d, i) => (
            <tr key={`${d.label}-t-${i}`}>
              <th scope="row">{d.tooltipLabel ?? d.label}</th>
              <td>{formatValue(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Saat üzrə aktivlik (00–23). Etiketlər hər 3 saatdan bir.
 * @param {object} p
 * @param {number[]} p.data       24 dəyər
 * @param {string} p.title
 * @param {(v:number)=>string} [p.formatValue]
 */
export function HourChart({ data, title, formatValue }) {
  const rows = Array.from({ length: 24 }, (_, h) => ({
    label: String(h).padStart(2, '0'),
    tooltipLabel: `${String(h).padStart(2, '0')}:00–${String((h + 1) % 24).padStart(2, '0')}:00`,
    value: data[h] ?? 0,
  }));
  return <BarChart data={rows} title={title} formatValue={formatValue} labelEvery={3} height={110} />;
}

// ════════════════════════════════════════════════════════════════
/**
 * Reaksiyaların bölgüsü (çoxdan aza).
 * @param {object} p
 * @param {{emoji:string, label:string, count:number}[]} p.items
 */
export function ReactionBreakdown({ items = [] }) {
  const sorted = [...items].sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...sorted.map((r) => r.count));
  const total = sorted.reduce((s, r) => s + r.count, 0);
  return (
    <ul className="space-y-3.5">
      {sorted.map((r) => (
        <li key={r.emoji}>
          <div className="flex items-baseline justify-between gap-3 text-[14px]">
            <span className="flex items-center gap-2 text-ink">
              <span aria-hidden="true" className="text-[17px] leading-none">
                {r.emoji}
              </span>
              {r.label}
            </span>
            <span className="font-semibold text-ink lining-nums tabular-nums">
              {formatNumber(r.count)}
              {total > 0 && (
                <span className="ml-1.5 font-normal text-brown-dark">
                  ({Math.round((r.count / total) * 100)}%)
                </span>
              )}
            </span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-beige" aria-hidden="true">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(r.count / max) * 100}%`,
                backgroundColor: BAR,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatsSkeleton() {
  return (
    <div role="status" aria-label="Yüklənir" className="space-y-5">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="block h-[74px] rounded-[18px] bg-beige motion-safe:animate-pulse" />
        ))}
      </div>
      {[150, 150, 130].map((h, i) => (
        <span
          key={i}
          className="block rounded-[20px] bg-beige motion-safe:animate-pulse"
          style={{ height: h + 50 }}
        />
      ))}
    </div>
  );
}
