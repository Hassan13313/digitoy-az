// ════════════════════════════════════════════════════════════════
// ImportDialog — Excel / CSV qonaq idxalı, 3 mərhələ (YALNIZ görünüş)
//
//   pick   → fayl seç / sürüklə          (onPickFile(file) — faylı SİZ oxuyursunuz)
//   review → önizləmə + buraxılan sətirlər (onConfirm() — idxalı SİZ edirsiniz)
//   done   → nəticə
// Mərhələni (`step`) siz idarə edirsiniz; komponent yalnız göstərir.
// ════════════════════════════════════════════════════════════════
import { useId, useRef, useState } from 'react';
import { CircleCheck, FileSpreadsheet, RotateCcw, Upload } from 'lucide-react';
import { Button, Modal, Notice, Spinner, cx, formatNumber } from './adminUi';

const STEPS = [
  { id: 'pick', label: 'Fayl seç' },
  { id: 'review', label: 'Yoxla' },
  { id: 'done', label: 'Hazır' },
];

/**
 * @param {object} p
 * @param {boolean} p.open  @param {()=>void} p.onClose
 * @param {'pick'|'review'|'done'} p.step
 * @param {(file:File)=>void} p.onPickFile   Seçilən / sürüklənən fayl
 * @param {boolean} [p.parsing]   Fayl oxunur (pick mərhələsində spinner)
 * @param {string} [p.error]      Oxuma xətası (məs. «Fayl oxunmadı: format dəstəklənmir»)
 * @param {string} [p.fileName]   Seçilən faylın adı (review)
 * @param {{name:string,table?:string,phone?:string}[]} [p.preview]  İlk N sətir
 * @param {number} [p.totalRows]  Fayldakı ümumi sətir sayı
 * @param {number} [p.validRows]  İdxal olunacaq sətir sayı
 * @param {{row:number,reason:string}[]} [p.skipped]  Buraxılan sətirlər və səbəbi
 * @param {()=>void} p.onConfirm  «İdxal et»  @param {boolean} [p.importing]
 * @param {()=>void} [p.onReset]  «Başqa fayl seç» (review → pick)
 * @param {{added:number,skipped:number,newTables?:number}} [p.result]  done mərhələsi
 * @param {number} [p.maxRows=2000]
 * @param {string} [p.hint]  Fayl seçimi altında qısa izah (sütunlar)
 * @param {string} [p.warning]  Digitoy: review/done mərhələsində xəbərdarlıq (məs. başlıq tapılmadı)
 */
export default function ImportDialog({
  open,
  onClose,
  step = 'pick',
  onPickFile,
  parsing = false,
  error,
  fileName,
  preview = [],
  totalRows,
  validRows,
  skipped = [],
  onConfirm,
  importing = false,
  onReset,
  result,
  maxRows = 2000,
  hint = 'Faylda «Ad», «Masa» və «Telefon» sütunları olsun.',
  warning,
}) {
  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const footer =
    step === 'review' ? (
      <>
        <Button onClick={onClose} disabled={importing}>
          Ləğv et
        </Button>
        <Button variant="primary" icon={Upload} loading={importing} disabled={!validRows} onClick={onConfirm}>
          İdxal et{validRows ? ` (${formatNumber(validRows)})` : ''}
        </Button>
      </>
    ) : step === 'done' ? (
      <Button variant="primary" onClick={onClose}>
        Bağla
      </Button>
    ) : (
      <Button onClick={onClose}>Ləğv et</Button>
    );

  return (
    <Modal
      open={open}
      onClose={importing ? () => {} : onClose}
      title="Excel / CSV idxalı"
      description="Qonaq siyahısını fayldan oturma planına əlavə edin."
      size="lg"
      footer={footer}
    >
      <ol className="mb-5 flex items-center gap-2" aria-label="Mərhələlər">
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const cur = i === stepIndex;
          return (
            <li
              key={s.id}
              className="flex min-w-0 flex-1 items-center gap-2"
              aria-current={cur ? 'step' : undefined}
            >
              <span
                className={cx(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold',
                  cur
                    ? 'bg-espresso text-cream'
                    : done
                      ? 'bg-olive-mist text-olive'
                      : 'bg-[#EFE9DF] text-[#6B5E54]',
                )}
              >
                {done ? <CircleCheck className="h-4 w-4" aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={cx(
                  'truncate text-[13.5px]',
                  cur ? 'font-semibold text-espresso' : 'text-[#6B5E54]',
                )}
              >
                {s.label}
                {done && <span className="sr-only"> (tamamlandı)</span>}
              </span>
              {i < STEPS.length - 1 && (
                <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-[#E5DED2]" />
              )}
            </li>
          );
        })}
      </ol>

      {step === 'pick' && (
        <PickStep onPickFile={onPickFile} parsing={parsing} error={error} maxRows={maxRows} hint={hint} />
      )}

      {step !== 'pick' && (error || warning) && (
        <div className="mb-4 space-y-2">
          {error && <Notice tone="danger">{error}</Notice>}
          {warning && <Notice tone="warning">{warning}</Notice>}
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 rounded-[8px] bg-[#FAF8F4] px-3.5 py-2.5">
            <FileSpreadsheet className="h-5 w-5 shrink-0 text-olive" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-espresso">{fileName}</span>
            {onReset && (
              <Button size="sm" variant="ghost" icon={RotateCcw} onClick={onReset} disabled={importing}>
                Başqa fayl seç
              </Button>
            )}
          </div>

          <p className="text-[14px] text-[#3F342E]">
            <strong className="font-semibold">{formatNumber(totalRows ?? preview.length)}</strong> sətir
            tapıldı · <strong className="font-semibold text-[#3D5530]">{formatNumber(validRows ?? 0)}</strong>{' '}
            idxal olunacaq
            {skipped.length > 0 && (
              <>
                {' '}
                · <strong className="font-semibold text-[#8A3125]">
                  {formatNumber(skipped.length)}
                </strong>{' '}
                buraxılacaq
              </>
            )}
          </p>

          <div>
            <h3 className="mb-2 text-[14px] font-semibold text-espresso">İlk {preview.length} sətir</h3>
            <div className="max-h-[260px] overflow-auto rounded-[8px] ring-1 ring-inset ring-[#E5DED2]">
              <table className="w-full min-w-[420px] border-separate border-spacing-0 text-[14px]">
                <thead>
                  <tr>
                    {['#', 'Ad', 'Masa', 'Telefon'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="sticky top-0 h-10 border-b border-[#E5DED2] bg-[#F8F5F0] px-3 text-left text-[12.5px] font-semibold text-[#5C4A3A]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((r, i) => (
                    <tr key={i}>
                      <td className="h-11 border-b border-[#EEE8DF] px-3 text-[13px] text-[#6B5E54] tabular-nums">
                        {i + 1}
                      </td>
                      <td className="h-11 border-b border-[#EEE8DF] px-3 font-medium text-espresso">
                        {r.name}
                      </td>
                      <td className="h-11 border-b border-[#EEE8DF] px-3 text-[#3F342E]">{r.table || '—'}</td>
                      <td className="h-11 border-b border-[#EEE8DF] px-3 text-[#3F342E] tabular-nums">
                        {r.phone || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {skipped.length > 0 && (
            <div>
              <h3 className="mb-2 text-[14px] font-semibold text-espresso">
                Buraxılan sətirlər ({skipped.length})
              </h3>
              <ul className="max-h-[180px] divide-y divide-[#F0E1DC] overflow-auto rounded-[8px] bg-rust-mist/60 ring-1 ring-inset ring-[#E8C7BF]">
                {skipped.map((s, i) => (
                  <li key={`${s.row}-${i}`} className="flex gap-3 px-3.5 py-2.5 text-[13.5px]">
                    <span className="w-16 shrink-0 font-semibold text-[#8A3125] tabular-nums">
                      Sətir {s.row}
                    </span>
                    <span className="text-[#5A2119]">{s.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {step === 'done' && result && (
        <div className="flex flex-col items-center py-6 text-center" role="status">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-olive-mist text-olive">
            <CircleCheck className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[18px] font-semibold text-espresso">
            {formatNumber(result.added)} qonaq əlavə olundu
          </p>
          <p className="mt-1.5 text-[14px] text-[#5C4A3A]">
            {result.skipped > 0
              ? `${formatNumber(result.skipped)} sətir buraxıldı`
              : 'Heç bir sətir buraxılmadı'}
            {result.newTables > 0 && ` · ${result.newTables} yeni masa yaradıldı`}
          </p>
        </div>
      )}
    </Modal>
  );
}

function PickStep({ onPickFile, parsing, error, maxRows, hint }) {
  const [over, setOver] = useState(false);
  const input = useRef(null);
  const id = useId();
  const take = (files) => {
    const f = files?.[0];
    if (f) onPickFile?.(f);
  };
  return (
    <div className="space-y-4">
      {error && <Notice tone="danger">{error}</Notice>}
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          take(e.dataTransfer.files);
        }}
        className={cx(
          'flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed px-6 py-8 text-center transition-colors',
          over ? 'border-[#A9822F] bg-gold-mist/50' : 'border-[#D6CCBC] bg-[#FAF8F4] hover:border-[#C2B6A4]',
          'has-[:focus-visible]:border-[#A9822F] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#A9822F]/30',
          parsing && 'pointer-events-none opacity-70',
        )}
      >
        <input
          ref={input}
          id={id}
          type="file"
          accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          className="sr-only"
          disabled={parsing}
          onChange={(e) => {
            take(e.target.files);
            e.target.value = '';
          }}
        />
        {parsing ? (
          <>
            <Spinner className="h-7 w-7 text-[#6B5E54]" />
            <span className="mt-3 text-[15px] font-medium text-espresso">Fayl oxunur…</span>
          </>
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-olive ring-1 ring-inset ring-[#E5DED2]">
              <FileSpreadsheet className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="mt-3 text-[15px] font-semibold text-espresso">
              Faylı seçin və ya buraya sürükləyin
            </span>
            <span className="mt-1 text-[13.5px] text-[#6B5E54]">
              .xlsx və ya .csv · maksimum {formatNumber(maxRows)} sətir
            </span>
            <span className="mt-4 inline-flex h-11 items-center gap-2 rounded-[8px] bg-espresso px-4 text-[14px] font-medium text-cream">
              <Upload className="h-4 w-4" aria-hidden="true" />
              Fayl seç
            </span>
          </>
        )}
      </label>
      {hint && <p className="text-[13px] leading-relaxed text-[#6B5E54]">{hint}</p>}
    </div>
  );
}
