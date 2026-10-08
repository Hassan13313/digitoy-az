// ════════════════════════════════════════════════════════════════
// SeatingPlanTab — «Oturma planı — qonaq idarəetməsi» (YALNIZ görünüş)
//
// Masa və qonaq məlumatı, əlavə/redaktə/köçürmə/silmə məntiqi SİZDƏDİR. Komponent
// yalnız pəncərələri açır və təsdiqdən sonra callback-ləri çağırır. Callback Promise
// qaytarsa, bitənə qədər pəncərə açıq qalır (spinner üçün `saving` verin).
//
// Çox masa (20+) üçün: axtarış, eni gördükcə 1/2/3 sütunlu şəbəkə; dar ekranda masalar
// yığılan siyahıdır («Hamısını aç / yığ»). Dar kartda qonaq əməliyyatları «⋯» menyusundadır.
// ════════════════════════════════════════════════════════════════
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRightLeft,
  ChevronDown,
  FileSpreadsheet,
  Pencil,
  Plus,
  SearchX,
  Armchair,
  Trash2,
  UserPlus,
} from 'lucide-react';
import {
  ActionMenu,
  Button,
  ConfirmDialog,
  EmptyState,
  Field,
  FOCUS_INSET,
  IconButton,
  Input,
  Modal,
  RefreshButton,
  RSVP_DOT,
  STATUS,
  SearchInput,
  Select,
  Skeleton,
  StatCard,
  StatusBadge,
  cx,
} from './adminUi';

/**
 * @typedef {object} Guest
 * @property {string} id  @property {string} name
 * @property {'yes'|'maybe'|'no'|'none'} status
 * @property {number} [plus]  Əlavə qonaq sayı (+1, +2)
 * @property {string} [phone]  @property {string} [note]
 * @typedef {{id:string,name:string,guests:Guest[]}} SeatTable
 * @typedef {{name:string,phone:string,status:Guest['status'],plus:number,tableId:string}} GuestInput
 */

const RSVP_OPTIONS = ['yes', 'maybe', 'no', 'none'].map((v) => ({ value: v, label: STATUS.rsvp[v].label }));
const lc = (s) => String(s ?? '').toLocaleLowerCase('az');

/** 6-dan az masa — hamısı açıq; çox masa — yalnız birincisi açıq (dar ekranda). */
const initialOpen = (tables) => new Set((tables.length > 6 ? tables.slice(0, 1) : tables).map((t) => t.id));

function useWidth(ref) {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

/**
 * @param {object} p
 * @param {SeatTable[]} p.tables
 * @param {{total:number,yes:number,no:number,maybe:number,none:number,rate:number}} p.stats  rate — cavab faizi (0–100)
 * @param {(name:string)=>void|Promise<void>} p.onAddTable
 * @param {boolean} [p.addingTable]
 * @param {(tableId:string, data:GuestInput)=>void|Promise<void>} p.onAddGuest
 * @param {(guestId:string, data:GuestInput)=>void|Promise<void>} p.onUpdateGuest
 * @param {(guestId:string, toTableId:string)=>void|Promise<void>} p.onMoveGuest
 * @param {(guestId:string)=>void|Promise<void>} p.onDeleteGuest
 * @param {(tableId:string)=>void|Promise<void>} [p.onDeleteTable]  Verilsə masa menyusunda «Masanı sil»
 * @param {boolean} [p.saving]  Qonaq pəncərəsində yadda saxlama gedir
 * @param {()=>void} [p.onOpenImport]  «Excel / CSV idxalı» (ImportDialog-u siz açırsınız)
 * @param {()=>void} [p.onRefresh]  @param {boolean} [p.refreshing]  @param {boolean} [p.loading]
 */
export default function SeatingPlanTab({
  tables = [],
  stats = {},
  onAddTable,
  addingTable = false,
  onAddGuest,
  onUpdateGuest,
  onMoveGuest,
  onDeleteGuest,
  onDeleteTable,
  saving = false,
  onOpenImport,
  onRefresh,
  refreshing = false,
  loading = false,
}) {
  const [newTable, setNewTable] = useState('');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(null); // { mode:'add'|'edit', tableId, guest? }
  const [move, setMove] = useState(null); // { guest, tableId }
  const [del, setDel] = useState(null); // { guest, table } | { table }
  const [openIds, setOpenIds] = useState(() => initialOpen(tables));
  const inited = useRef(tables.length > 0);
  useEffect(() => {
    // Masalar sonradan yüklənirsə (loading → data), açıq masaları bir dəfə təyin et
    if (!inited.current && tables.length) {
      inited.current = true;
      setOpenIds(initialOpen(tables));
    }
  }, [tables]);
  const grid = useRef(null);
  const width = useWidth(grid);
  const cols = width >= 1040 ? 3 : width >= 620 ? 2 : 1;
  const cardW = width ? (width - (cols - 1) * 16) / cols : 360;
  const compactRows = cardW < 440;
  const collapsible = cols === 1;

  const close = (setter) => () => setter(null);
  const run = (fn, done) => Promise.resolve(fn).then(done, () => {});

  const visible = useMemo(() => {
    const q = lc(query.trim());
    if (!q) return tables;
    return tables
      .map((t) =>
        lc(t.name).includes(q)
          ? t
          : { ...t, guests: t.guests.filter((g) => lc(g.name).includes(q) || lc(g.phone).includes(q)) },
      )
      .filter((t) => lc(t.name).includes(q) || t.guests.length);
  }, [tables, query]);

  const allOpen = visible.every((t) => openIds.has(t.id));
  const toggle = (id) =>
    setOpenIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const tableOptions = tables.map((t) => ({ value: t.id, label: t.name }));

  return (
    <section aria-labelledby="seat-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="seat-title" className="text-[16px] font-semibold text-espresso">
          Oturma planı — qonaq idarəetməsi
        </h2>
        <div className="flex flex-wrap gap-2">
          {onOpenImport && (
            <Button size="sm" icon={FileSpreadsheet} onClick={onOpenImport}>
              Excel / CSV idxalı
            </Button>
          )}
          {onRefresh && <RefreshButton onClick={onRefresh} refreshing={refreshing} />}
        </div>
      </div>

      {/* Masa əlavə et */}
      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const name = newTable.trim();
          if (!name) return;
          run(onAddTable?.(name), () => setNewTable(''));
        }}
      >
        <label htmlFor="seat-new-table" className="sr-only">
          Yeni masa adı
        </label>
        <Input
          id="seat-new-table"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          placeholder="Yeni masa adı (məs. Masa 5)"
          className="min-w-0 flex-1"
        />
        <Button type="submit" variant="primary" icon={Plus} loading={addingTable} disabled={!newTable.trim()}>
          <span className="max-[380px]:sr-only">Masa əlavə et</span>
        </Button>
      </form>

      {/* Göstəricilər */}
      <h3 className="sr-only">Cavab göstəriciləri</h3>
      <div className="mb-5 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        <StatCard size="sm" value={stats.total ?? 0} label="Ümumi" loading={loading} />
        <StatCard size="sm" value={stats.yes ?? 0} label="Gələcək" dot={RSVP_DOT.yes} loading={loading} />
        <StatCard size="sm" value={stats.no ?? 0} label="Gəlməyəcək" dot={RSVP_DOT.no} loading={loading} />
        <StatCard size="sm" value={stats.maybe ?? 0} label="Bəlkə" dot={RSVP_DOT.maybe} loading={loading} />
        <StatCard size="sm" value={stats.none ?? 0} label="Cavabsız" dot={RSVP_DOT.none} loading={loading} />
        <StatCard size="sm" value={`${stats.rate ?? 0}%`} label="Cavab %" loading={loading} />
      </div>

      {tables.length > 4 && (
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Qonaq və ya masa axtar…"
            label="Oturma planında axtar"
            className="sm:max-w-[340px] sm:flex-1"
          />
          {collapsible && visible.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronDown}
              className={cx('sm:ml-auto', allOpen && '[&>svg]:rotate-180')}
              onClick={() => setOpenIds(allOpen ? new Set() : new Set(visible.map((t) => t.id)))}
            >
              {allOpen ? 'Hamısını yığ' : 'Hamısını aç'}
            </Button>
          )}
        </div>
      )}

      <div ref={grid}>
        {loading ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
            {[0, 1].map((i) => (
              <div key={i} className="rounded-[12px] bg-white p-4 ring-1 ring-inset ring-[#E5DED2]">
                <Skeleton className="h-4 w-28" />
                {[0, 1, 2].map((j) => (
                  <Skeleton key={j} className="mt-4 h-3.5 w-full" />
                ))}
              </div>
            ))}
          </div>
        ) : tables.length === 0 ? (
          <div className="rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]">
            <EmptyState
              icon={Armchair}
              title="Hələ masa yoxdur"
              text="Yuxarıdan masa əlavə edin və ya qonaq siyahısını Excel / CSV faylından idxal edin."
              action={
                onOpenImport && (
                  <Button icon={FileSpreadsheet} onClick={onOpenImport}>
                    Excel / CSV idxalı
                  </Button>
                )
              }
            />
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]">
            <EmptyState
              icon={SearchX}
              title={`«${query}» üzrə qonaq tapılmadı`}
              action={<Button onClick={() => setQuery('')}>Axtarışı təmizlə</Button>}
            />
          </div>
        ) : (
          <ul
            className="grid items-start gap-4"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
          >
            {visible.map((t) => (
              <TableCard
                key={t.id}
                table={t}
                full={tables.find((x) => x.id === t.id) ?? t}
                open={!collapsible || openIds.has(t.id) || Boolean(query)}
                collapsible={collapsible && !query}
                onToggle={() => toggle(t.id)}
                compact={compactRows}
                onAdd={() => setForm({ mode: 'add', tableId: t.id })}
                onEdit={(g) => setForm({ mode: 'edit', tableId: t.id, guest: g })}
                onMove={(g) => setMove({ guest: g, tableId: t.id })}
                onDelete={(g) => setDel({ guest: g, table: t })}
                onDeleteTable={onDeleteTable ? () => setDel({ table: t }) : undefined}
              />
            ))}
          </ul>
        )}
      </div>

      <GuestFormDialog
        open={!!form}
        mode={form?.mode}
        initial={form?.guest ? { ...form.guest, tableId: form.tableId } : { tableId: form?.tableId }}
        tables={tableOptions}
        busy={saving}
        onCancel={close(setForm)}
        onSubmit={(data) =>
          run(
            form.mode === 'add' ? onAddGuest?.(data.tableId, data) : onUpdateGuest?.(form.guest.id, data),
            () => setForm(null),
          )
        }
      />
      <MoveGuestDialog
        open={!!move}
        guest={move?.guest}
        currentTableId={move?.tableId}
        tables={tables}
        busy={saving}
        onCancel={close(setMove)}
        onSubmit={(to) => run(onMoveGuest?.(move.guest.id, to), () => setMove(null))}
      />
      <ConfirmDialog
        open={!!del}
        title={del?.guest ? 'Qonağı silmək?' : 'Masanı silmək?'}
        description={
          del?.guest
            ? `${del.guest.name} «${del.table.name}» masasından və qonaq siyahısından silinəcək.`
            : del?.table &&
              `«${del.table.name}» masası silinəcək. Masadakı ${del.table.guests.length} qonaq da siyahıdan çıxacaq.`
        }
        confirmLabel="Sil"
        guard={del?.table && !del?.guest && del.table.guests.length > 0 ? 'double' : 'none'}
        secondStepText="Masadakı bütün qonaqlar da silinəcək. Əminsiniz?"
        secondConfirmLabel="Bəli, masanı sil"
        busy={saving}
        onCancel={close(setDel)}
        onConfirm={() =>
          run(del.guest ? onDeleteGuest?.(del.guest.id) : onDeleteTable?.(del.table.id), () => setDel(null))
        }
      />
    </section>
  );
}

function TableCard({
  table,
  full,
  open,
  collapsible,
  onToggle,
  compact,
  onAdd,
  onEdit,
  onMove,
  onDelete,
  onDeleteTable,
}) {
  const total = full.guests.length;
  const answered = full.guests.filter((g) => g.status !== 'none').length;
  const yes = full.guests.filter((g) => g.status === 'yes').length;
  const meta = `${answered}/${total} cavab · ${yes} gələcək`;
  const listId = `seat-${table.id}`;
  const Title = (
    <span className="min-w-0">
      <span className="block truncate text-[15px] font-semibold text-espresso">{table.name}</span>
      <span className="block text-[13px] text-[#6B5E54]">{meta}</span>
    </span>
  );
  return (
    <li className="min-w-0 rounded-[12px] bg-white ring-1 ring-inset ring-[#E5DED2]">
      <div
        className={cx(
          'flex items-center gap-2 bg-[#FAF8F4] py-2 pl-2 pr-2',
          open ? 'rounded-t-[12px] border-b border-[#EEE8DF]' : 'rounded-[12px]',
        )}
      >
        {collapsible ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={listId}
            onClick={onToggle}
            className={cx(
              'flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[8px] px-2 text-left',
              FOCUS_INSET,
            )}
          >
            <ChevronDown
              className={cx('h-5 w-5 shrink-0 text-[#6B5E54] transition-transform', open ? '' : '-rotate-90')}
              aria-hidden="true"
            />
            {Title}
          </button>
        ) : (
          <div className="flex min-h-11 min-w-0 flex-1 items-center px-2">{Title}</div>
        )}
        <Button size="sm" icon={UserPlus} onClick={onAdd}>
          Əlavə et<span className="sr-only">: {table.name} masasına qonaq</span>
        </Button>
        {onDeleteTable && (
          <ActionMenu
            label={`${table.name} — masa əməliyyatları`}
            size="sm"
            items={[
              { id: 'del', label: 'Masanı sil', icon: Trash2, destructive: true, onSelect: onDeleteTable },
            ]}
          />
        )}
      </div>
      {open && (
        <ul id={listId} aria-label={`${table.name} qonaqları`}>
          {table.guests.length === 0 && (
            <li className="px-4 py-4 text-[14px] text-[#6B5E54]">Bu masada hələ qonaq yoxdur.</li>
          )}
          {table.guests.map((g) => (
            <li
              key={g.id}
              className="flex min-h-14 items-center gap-2 border-b border-[#EEE8DF] py-1.5 pl-4 pr-2 last:border-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-medium text-espresso">
                  {g.name}
                  {g.plus > 0 && (
                    <span className="ml-1.5 text-[13px] font-normal text-[#6B5E54]">
                      +{g.plus}
                      <span className="sr-only"> əlavə qonaq</span>
                    </span>
                  )}
                </p>
                {g.phone && !compact && (
                  <p className="text-[12.5px] text-[#6B5E54] tabular-nums">{g.phone}</p>
                )}
              </div>
              <StatusBadge kind="rsvp" status={g.status} size="sm" />
              {compact ? (
                <ActionMenu
                  label={`${g.name} — əməliyyatlar`}
                  size="sm"
                  items={[
                    { id: 'edit', label: 'Redaktə et', icon: Pencil, onSelect: () => onEdit(g) },
                    {
                      id: 'move',
                      label: 'Başqa masaya köçür',
                      icon: ArrowRightLeft,
                      onSelect: () => onMove(g),
                    },
                    { id: 'del', label: 'Sil', icon: Trash2, destructive: true, onSelect: () => onDelete(g) },
                  ]}
                />
              ) : (
                <div className="flex shrink-0">
                  <IconButton
                    size="sm"
                    icon={Pencil}
                    label={`Redaktə et: ${g.name}`}
                    onClick={() => onEdit(g)}
                  />
                  <IconButton
                    size="sm"
                    icon={ArrowRightLeft}
                    label={`Başqa masaya köçür: ${g.name}`}
                    onClick={() => onMove(g)}
                  />
                  <IconButton
                    size="sm"
                    icon={Trash2}
                    destructive
                    tooltipAlign="end"
                    label={`Sil: ${g.name}`}
                    onClick={() => onDelete(g)}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Qonaq əlavə et / redaktə et pəncərəsi.
 * @param {object} p
 * @param {boolean} p.open  @param {'add'|'edit'} [p.mode='add']
 * @param {Partial<GuestInput>} [p.initial]  @param {{value:string,label:string}[]} p.tables
 * @param {(data:GuestInput)=>void} p.onSubmit  @param {()=>void} p.onCancel  @param {boolean} [p.busy]
 */
export function GuestFormDialog({
  open,
  mode = 'add',
  initial = {},
  tables = [],
  onSubmit,
  onCancel,
  busy = false,
}) {
  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onCancel}
      title={mode === 'edit' ? 'Qonağı redaktə et' : 'Qonaq əlavə et'}
      size="sm"
    >
      {open && (
        <GuestForm
          key={initial.id ?? 'new'}
          initial={initial}
          tables={tables}
          onSubmit={onSubmit}
          onCancel={onCancel}
          busy={busy}
          mode={mode}
        />
      )}
    </Modal>
  );
}

function GuestForm({ initial, tables, onSubmit, onCancel, busy, mode }) {
  const [v, setV] = useState({
    name: initial.name ?? '',
    phone: initial.phone ?? '',
    status: initial.status ?? 'none',
    plus: initial.plus ?? 0,
    tableId: initial.tableId ?? tables[0]?.value ?? '',
  });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e?.target ? e.target.value : e }));
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!v.name.trim()) {
          setErr('Ad boş ola bilməz');
          return;
        }
        onSubmit?.({ ...v, name: v.name.trim(), plus: Number(v.plus) || 0 });
      }}
      className="space-y-4"
    >
      <Field label="Ad, soyad" required error={err}>
        <Input
          value={v.name}
          onChange={(e) => {
            setErr('');
            set('name')(e);
          }}
          autoComplete="off"
          data-autofocus
        />
      </Field>
      <Field label="Telefon" hint="İxtiyari">
        <Input
          value={v.phone}
          onChange={set('phone')}
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="+994 50 000 00 00"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Status">
          <Select value={v.status} onValueChange={set('status')} options={RSVP_OPTIONS} />
        </Field>
        <Field label="Əlavə qonaq">
          <Input type="number" min={0} max={20} inputMode="numeric" value={v.plus} onChange={set('plus')} />
        </Field>
      </div>
      <Field label="Masa">
        <Select value={v.tableId} onValueChange={set('tableId')} options={tables} />
      </Field>
      <div className="flex flex-col-reverse gap-2 border-t border-[#EEE8DF] pt-4 sm:flex-row sm:justify-end">
        <Button onClick={onCancel} disabled={busy}>
          Ləğv et
        </Button>
        <Button type="submit" variant="primary" loading={busy}>
          {mode === 'edit' ? 'Yadda saxla' : 'Əlavə et'}
        </Button>
      </div>
    </form>
  );
}

/**
 * «Başqa masaya köçür» pəncərəsi — masalar radio siyahısıdır (cari masa bağlıdır).
 * @param {object} p
 * @param {boolean} p.open  @param {Guest} [p.guest]  @param {string} [p.currentTableId]
 * @param {SeatTable[]} p.tables  @param {(tableId:string)=>void} p.onSubmit  @param {()=>void} p.onCancel
 */
export function MoveGuestDialog({
  open,
  guest,
  currentTableId,
  tables = [],
  onSubmit,
  onCancel,
  busy = false,
}) {
  const [to, setTo] = useState('');
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTo('');
  }
  const shown = to;
  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onCancel}
      title="Başqa masaya köçür"
      description={
        guest && (
          <>
            Hansı masaya köçürülsün: <strong className="font-semibold text-espresso">{guest.name}</strong>?
          </>
        )
      }
      size="sm"
      footer={
        <>
          <Button onClick={onCancel} disabled={busy}>
            Ləğv et
          </Button>
          <Button
            variant="primary"
            icon={ArrowRightLeft}
            loading={busy}
            disabled={!shown}
            onClick={() => onSubmit?.(shown)}
          >
            Köçür
          </Button>
        </>
      }
    >
      <fieldset>
        <legend className="sr-only">Masa seçin</legend>
        <div className="max-h-[50dvh] space-y-1.5 overflow-y-auto pr-1">
          {tables.map((t) => {
            const current = t.id === currentTableId;
            const yes = t.guests.filter((g) => g.status === 'yes').length;
            return (
              <label
                key={t.id}
                className={cx(
                  'flex min-h-14 cursor-pointer items-center gap-3 rounded-[8px] px-3.5 ring-1 ring-inset transition-colors',
                  current
                    ? 'cursor-not-allowed bg-[#F6F3ED] ring-[#E5DED2] opacity-70'
                    : shown === t.id
                      ? 'bg-gold-mist/70 ring-[#A9822F]'
                      : 'ring-[#E5DED2] hover:bg-[#FAF8F4]',
                  'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#A9822F]',
                )}
              >
                <input
                  type="radio"
                  name="move-table"
                  value={t.id}
                  checked={shown === t.id}
                  disabled={current}
                  onChange={() => setTo(t.id)}
                  className="h-4 w-4 accent-[#2C2523]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-medium text-espresso">
                    {t.name}
                    {current && <span className="font-normal text-[#6B5E54]"> (indiki masa)</span>}
                  </span>
                  <span className="block text-[13px] text-[#6B5E54]">
                    {t.guests.length} qonaq · {yes} gələcək
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </Modal>
  );
}
