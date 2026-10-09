// ════════════════════════════════════════════════════════════════
// MaintenancePage — «Baxım» (sistem sağlamlığı) (YALNIZ görünüş)
//
// Problemli kartlar öndə və geniş durur (qırmızı haşiyə + yuxarıda xülasə). Kartlar bir
// sətirdə eyni hündürlükdədir, əməliyyat düymələri kartın altına yığılır. Hər əməliyyatın
// vəziyyəti (işləyir / bitdi / xəta) düymənin yanında görünür; silən əməliyyat təsdiqlə olur.
// ════════════════════════════════════════════════════════════════
import { useState } from 'react';
import {
  AlertTriangle,
  CircleAlert,
  CircleCheck,
  Database,
  Eraser,
  Eye,
  HardDriveDownload,
  History,
  ScrollText,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import {
  Button,
  ConfirmDialog,
  DataTable,
  EmptyState,
  Modal,
  Notice,
  OpStatus,
  PageHeader,
  ProgressBar,
  RefreshButton,
  Skeleton,
  SummaryList,
  cx,
  formatNumber,
} from './adminUi';

const TONE = {
  danger: {
    ring: 'ring-[#E2B9AF] shadow-[inset_4px_0_0_#9A3B2E]',
    box: 'bg-rust-mist text-rust',
    pill: 'bg-rust-mist text-[#8A3125] ring-[#E8C7BF]',
    icon: CircleAlert,
  },
  warning: {
    ring: 'ring-[#EBD39C] shadow-[inset_4px_0_0_#B8903A]',
    box: 'bg-[#FBF1DC] text-[#6E5114]',
    pill: 'bg-[#FBF1DC] text-[#6E5114] ring-[#EBD39C]',
    icon: AlertTriangle,
  },
  ok: {
    ring: 'ring-[#E5DED2]',
    box: 'bg-olive-mist text-olive',
    pill: 'bg-olive-mist text-[#3D5530] ring-[#C9D6B8]',
    icon: CircleCheck,
  },
  neutral: {
    ring: 'ring-[#E5DED2]',
    box: 'bg-[#F3EEE6] text-[#5C4A3A]',
    pill: 'bg-[#EFEBE5] text-[#51483F] ring-[#DCD4C9]',
    icon: null,
  },
};
const RANK = { danger: 0, warning: 1, neutral: 2, ok: 3 };

/** Sağlamlıq kartı (ayrıca da işlədilə bilər). */
export function HealthCard({
  icon: Icon,
  title,
  tone = 'neutral',
  statusLabel,
  metrics = [],
  description,
  children,
  actions,
  wide = false,
  loading = false,
}) {
  const T = TONE[tone];
  const PillIcon = T.icon;
  const id = `hc-${title}`.replace(/\W+/g, '-');
  return (
    <section
      aria-labelledby={id}
      className={cx(
        'flex h-full min-w-0 flex-col rounded-[12px] bg-white p-4 ring-1 ring-inset sm:p-5',
        T.ring,
        wide && 'md:col-span-2',
      )}
    >
      <header className="flex items-start gap-3">
        <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px]', T.box)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 id={id} className="min-w-0 flex-1 pt-2 text-[16px] font-semibold leading-snug text-espresso">
          {title}
        </h2>
        {statusLabel && (
          <span
            className={cx(
              'mt-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-semibold ring-1 ring-inset',
              T.pill,
            )}
          >
            {PillIcon && <PillIcon className="h-3.5 w-3.5" aria-hidden="true" />}
            {statusLabel}
          </span>
        )}
      </header>
      {metrics.length > 0 && (
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <dt className="text-[12.5px] text-[#6B5E54]">{m.label}</dt>
              <dd
                className={cx(
                  'mt-0.5 font-semibold leading-tight text-espresso tabular-nums',
                  m.small ? 'text-[17px]' : 'text-[22px]',
                )}
              >
                {loading ? <Skeleton className="mt-1 h-6 w-16" /> : m.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {description && <p className="mt-3 text-[14px] leading-relaxed text-[#5C4A3A]">{description}</p>}
      {children && <div className="mt-3">{children}</div>}
      {actions && <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-4">{actions}</div>}
    </section>
  );
}

/**
 * @param {object} p
 * @param {string} [p.schemaVersion]  «v46»
 * @param {()=>void} [p.onRefresh]  @param {boolean} [p.refreshing]  @param {boolean} [p.loading]
 * @param {{status:'ok'|'unknown'|'stale',last:string,note?:string}} p.backup
 *        unknown — tapılmadı, stale — köhnədir; hər ikisi problem sayılır
 * @param {{expired:number,total:number,state?:'idle'|'running'|'done'|'error',resultText?:string}} p.drafts
 * @param {()=>void} p.onCleanupDrafts  Təsdiqdən sonra
 * @param {{lastRun:string,state?:'idle'|'running'|'done'|'error',items?:{label:string,count:number}[],errorText?:string}} p.retention
 *        items — önizləmə nəticəsi (heç nə silinmir)
 * @param {()=>void} p.onRetentionPreview
 * @param {()=>void} [p.onRetentionRun]  Digitoy: önizləmədən sonra real təmizləmə (təsdiqlə)
 * @param {{indexed:number,albums:number,built:boolean,state?:'idle'|'running'|'done'|'error',progress?:number,resultText?:string}} p.media
 * @param {()=>void} p.onReindex
 * @param {{state?:'idle'|'running'|'done'|'error',rows?:{id:string,date:string,action:string,object:string,ip:string}[],errorText?:string}} [p.audit]
 * @param {()=>void} p.onShowAudit  «Jurnalı göstər» — pəncərə açılır, siz `audit.rows`-u yükləyirsiniz
 * @param {Record<string,string>} [p.texts]  İzah mətnlərini dəyişmək üçün: backup, backupHelp, drafts, retention, media, audit
 */
export default function MaintenancePage({
  schemaVersion,
  onRefresh,
  refreshing = false,
  loading = false,
  backup = { status: 'unknown', last: 'Məlum deyil' },
  drafts = { expired: 0, total: 0 },
  onCleanupDrafts,
  retention = { lastRun: '—' },
  onRetentionPreview,
  onRetentionRun,
  media = { indexed: 0, albums: 0, built: false },
  onReindex,
  audit = {},
  onShowAudit,
  texts = {},
}) {
  const [confirmDrafts, setConfirmDrafts] = useState(false);
  const [confirmRetention, setConfirmRetention] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const t = {
    backup: 'Backup tapılmadı. Avtomatik arxiv qurulmayıbsa, media və baza qorunmur.',
    backupOk: 'Son backup tapıldı. Həftədə bir dəfə yeni backup alıb kompüterə endirməyi unutmayın.',
    backupHelp:
      'Yeni backup: DirectAdmin › Create/Restore Backups › «Create Backup» (sayt + bazalar). Həftədə bir dəfə edin və kompüterə endirin.',
    drafts:
      'Builder-i yarımçıq qoyan ziyarətçilərin qeydləri. Yalnız 30 gün toxunulmamış qaralamalar və onların öz şəkil/musiqi faylları silinir — sifarişlərə (göndərilmiş, təsdiqlənmiş, rədd edilmiş) toxunulmur.',
    retention:
      'Gündə bir dəfə özü işləyir: audit IP-ləri 90 gün, qalereya IP izləri 7 gün, loglar 30 gün, tərk edilmiş draft-lar 30 gün saxlanılır. Məxfilik siyasətindəki müddətlərlə eynidir.',
    media:
      'Sayğac hazırda BÜTÜN uploads ağacını gəzir. İndeksi bir dəfə qurun — panel sürətlənəcək, rəqəm dəyişməyəcək.',
    audit:
      'Dağıdıcı əməliyyatların izi: link aktiv/deaktiv, mesaj silmə, sifariş təsdiqi və rəddi, foto silmə.',
    ...texts,
  };

  const backupBad = backup.status !== 'ok';
  const cards = [
    {
      key: 'backup',
      tone: backupBad ? 'danger' : 'ok',
      node: (wide) => (
        <HealthCard
          icon={backupBad ? ShieldAlert : HardDriveDownload}
          title="Backup vəziyyəti"
          tone={backupBad ? 'danger' : 'ok'}
          statusLabel={backup.status === 'ok' ? 'OK' : backup.status === 'stale' ? 'Köhnədir' : 'Məlum deyil'}
          metrics={[{ label: 'Son backup', value: backup.last, small: true }]}
          description={backupBad ? t.backup : t.backupOk}
          wide={wide}
          loading={loading}
        >
          <div
            className={cx(
              'rounded-[8px] px-3.5 py-3 text-[14px] leading-relaxed',
              backupBad ? 'bg-rust-mist text-[#5A2119]' : 'bg-[#FAF8F4] text-[#3F342E]',
            )}
          >
            <p className="mb-1 font-semibold">Necə edilir</p>
            {t.backupHelp}
          </div>
        </HealthCard>
      ),
    },
    {
      key: 'drafts',
      tone: drafts.expired > 0 ? 'warning' : 'ok',
      node: (wide) => (
        <HealthCard
          icon={Trash2}
          title="Draft təmizləmə"
          tone={drafts.expired > 0 ? 'warning' : 'neutral'}
          statusLabel={drafts.expired > 0 ? `${drafts.expired} vaxtı keçib` : undefined}
          metrics={[
            { label: 'Vaxtı keçmiş', value: formatNumber(drafts.expired) },
            { label: 'Cəmi draft', value: formatNumber(drafts.total) },
          ]}
          description={t.drafts}
          wide={wide}
          loading={loading}
          actions={
            <>
              {drafts.expired > 0 ? (
                <Button
                  destructive
                  icon={Trash2}
                  loading={drafts.state === 'running'}
                  onClick={() => setConfirmDrafts(true)}
                >
                  {drafts.expired} draftı təmizlə
                </Button>
              ) : (
                <Button icon={Trash2} disabled>
                  Təmizlənəcək draft yoxdur
                </Button>
              )}
              <OpStatus
                state={drafts.state ?? 'idle'}
                text={drafts.resultText ?? (drafts.state === 'running' ? 'Təmizlənir…' : undefined)}
              />
            </>
          }
        />
      ),
    },
    {
      key: 'retention',
      tone: retention.state === 'error' ? 'danger' : 'ok',
      node: (wide) => (
        <HealthCard
          icon={Eraser}
          title="Məlumat saxlama"
          tone={retention.state === 'error' ? 'danger' : 'neutral'}
          metrics={[{ label: 'Son avtomatik təmizləmə', value: retention.lastRun, small: true }]}
          description={t.retention}
          wide={wide}
          loading={loading}
          actions={
            <>
              <Button icon={Eye} loading={retention.state === 'running'} onClick={onRetentionPreview}>
                Önizlə (heç nə silinmir)
              </Button>
              {retention.state === 'done' && retention.items && onRetentionRun && (
                <Button destructive icon={Trash2} onClick={() => setConfirmRetention(true)}>
                  Təsdiqlə və indi işlət
                </Button>
              )}
              {retention.state === 'error' && (
                <OpStatus state="error" text={retention.errorText ?? 'Önizləmə alınmadı'} />
              )}
              {retention.resultText && retention.state !== 'error' && (
                <OpStatus state="done" text={retention.resultText} />
              )}
            </>
          }
        >
          {retention.state === 'done' && retention.items && (
            <div>
              <p className="mb-2 text-[13px] font-semibold text-[#3F342E]">Növbəti təmizləmədə silinəcək:</p>
              <SummaryList
                items={retention.items.map((i) => ({ label: i.label, value: formatNumber(i.count) }))}
              />
              <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-[#3D5530]">
                <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Bu yalnız önizləmədir — heç nə silinməyib.
              </p>
            </div>
          )}
        </HealthCard>
      ),
    },
    {
      key: 'media',
      tone: media.built ? 'ok' : 'warning',
      node: (wide) => (
        <HealthCard
          icon={Database}
          title="Media indeksi"
          tone={media.built ? 'ok' : 'warning'}
          statusLabel={media.built ? 'Hazır' : 'Qurulmayıb'}
          metrics={[
            { label: 'İndekslənmiş', value: formatNumber(media.indexed) },
            { label: 'Albom', value: formatNumber(media.albums) },
          ]}
          description={t.media}
          wide={wide}
          loading={loading}
          actions={
            <>
              {media.state === 'running' && media.progress != null ? (
                <ProgressBar value={media.progress} label="İndeks qurulur" className="w-full" />
              ) : (
                <Button
                  icon={Database}
                  variant={media.built ? 'secondary' : 'primary'}
                  loading={media.state === 'running'}
                  onClick={onReindex}
                >
                  {media.built ? 'İndeksi yenilə' : 'Media indeksini qur'}
                </Button>
              )}
              {media.state !== 'running' && (
                <OpStatus state={media.state ?? 'idle'} text={media.resultText} />
              )}
            </>
          }
        />
      ),
    },
    {
      key: 'audit',
      tone: 'neutral',
      node: (wide) => (
        <HealthCard
          icon={ScrollText}
          title="Admin əməliyyatları"
          tone="neutral"
          description={t.audit}
          wide={wide}
          actions={
            <Button
              icon={History}
              onClick={() => {
                setAuditOpen(true);
                onShowAudit?.();
              }}
            >
              Jurnalı göstər
            </Button>
          }
        />
      ),
    },
  ];
  const sorted = [...cards].sort((a, b) => RANK[a.tone] - RANK[b.tone]);
  const problems = cards.filter((c) => c.tone === 'danger' || c.tone === 'warning');
  const names = {
    backup: 'Backup vəziyyəti',
    drafts: 'Vaxtı keçmiş draftlar',
    retention: 'Məlumat saxlama',
    media: 'Media indeksi qurulmayıb',
  };

  return (
    <div>
      <PageHeader
        title="Baxım"
        meta={
          schemaVersion && (
            <span className="rounded-[6px] bg-[#EFE9DF] px-2 py-0.5 font-mono text-[12.5px] text-[#3F342E]">
              sxem {schemaVersion}
            </span>
          )
        }
        subtitle="Sistemin sağlamlıq göstəriciləri və təhlükəsiz təmizləmə əməliyyatları."
        actions={onRefresh && <RefreshButton onClick={onRefresh} refreshing={refreshing} />}
      />

      {!loading && (
        <div className="mb-4">
          {problems.length ? (
            <Notice
              tone={problems.some((p) => p.tone === 'danger') ? 'danger' : 'warning'}
              title={`${problems.length} məsələ diqqət tələb edir`}
            >
              {problems.map((p) => names[p.key]).join(' · ')}
            </Notice>
          ) : (
            <Notice tone="success">Hər şey qaydasındadır.</Notice>
          )}
        </div>
      )}

      <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((c) => (
          <div key={c.key} className={cx('min-w-0', c.tone === 'danger' && 'md:col-span-2')}>
            {c.node(false)}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={confirmDrafts}
        title="Vaxtı keçmiş draftları təmizləmək?"
        description={`${drafts.expired} draft və onların öz şəkil/musiqi faylları silinəcək. Sifarişlərə toxunulmur.`}
        confirmLabel="Təmizlə"
        onCancel={() => setConfirmDrafts(false)}
        onConfirm={() => {
          setConfirmDrafts(false);
          onCleanupDrafts?.();
        }}
      />

      <ConfirmDialog
        open={confirmRetention}
        title="Təmizləməni indi işlətmək?"
        description="Önizləmədə göstərilənlər silinəcək (köhnə IP-lər, müvəqqəti fayllar, loglar, tərk edilmiş draftlar). Sifarişlərə və dəvətnamələrə toxunulmur."
        confirmLabel="İndi işlət"
        onCancel={() => setConfirmRetention(false)}
        onConfirm={() => {
          setConfirmRetention(false);
          onRetentionRun?.();
        }}
      />

      <Modal
        open={auditOpen}
        onClose={() => setAuditOpen(false)}
        size="xl"
        title="Admin əməliyyatları jurnalı"
        description="Dağıdıcı əməliyyatlar — ən yenilər öndə."
      >
        {audit.state === 'error' ? (
          <Notice tone="danger">{audit.errorText ?? 'Jurnalı yükləmək alınmadı.'}</Notice>
        ) : (
          <DataTable
            stickyHeader={false}
            caption="Admin əməliyyatları"
            loading={audit.state === 'running'}
            rows={audit.rows ?? []}
            columns={[
              {
                key: 'date',
                header: 'Tarix',
                nowrap: true,
                mobile: 'meta',
                cellClassName: 'text-[#5C4A3A] tabular-nums',
              },
              { key: 'action', header: 'Əməliyyat', mobile: 'title', cellClassName: 'font-medium' },
              {
                key: 'object',
                header: 'Obyekt',
                mobile: 'code',
                render: (r) => <span className="font-mono text-[13px] text-[#3F342E]">{r.object}</span>,
              },
              {
                key: 'ip',
                header: 'IP',
                nowrap: true,
                mobile: 'meta',
                render: (r) => <span className="font-mono text-[13px] text-[#5C4A3A]">{r.ip}</span>,
              },
            ]}
            empty={<EmptyState icon={ScrollText} title="Jurnalda hələ qeyd yoxdur" />}
          />
        )}
      </Modal>
    </div>
  );
}
