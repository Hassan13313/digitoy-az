import { useState, useRef, useCallback } from 'react'
import {
  X, Upload, FileSpreadsheet, Loader2, Check, AlertTriangle, Users,
} from 'lucide-react'
import { readGuestFile } from '../../utils/guestSheet'
import { importGuests } from '../../utils/api'

/* ══════════════════════════════════════════════════
   EXCEL / CSV QONAQ İDXALI (Phase 43)

   Üç addım: fayl → yoxlama hesabatı → yazma.

   ⚠ FAYL SERVERƏ YÜKLƏNMİR. Parsing brauzerdədir (`utils/guestSheet.js`),
   serverə yalnız {name, table, phone} JSON sətirləri gedir. Ona görə:
     • serverdə yeni fayl qəbul yolu yoxdur (hücum səthi artmır),
     • istifadəçi GÖNDƏRMƏMİŞDƏN ÖNCƏ nəyin əlavə olunacağını görür.

   ⚠ İKİ ADDIMLI TƏSDİQ: əvvəlcə `dry_run` (heç nə yazılmır) hesabatı
   göstərilir — təkrarlar, boş adlar, səhv sütunlar. İstifadəçi razılaşandan
   sonra yazılır. Yazma TƏK TRANZAKSİYADADIR: ya hamısı, ya heç nə.

   ⚠ MÖVCUD AXIN TOXUNULMUR: `manage_guest.php` (bir-bir əlavə) və
   `migrate_guests.php` (oturma planı mətnindən köçürmə) olduğu kimi qalır.
   ══════════════════════════════════════════════════ */

const REASON_TEXT = {
  'TƏKRAR': 'Təkrarlanır',
  'AD_BOŞDUR': 'Ad boşdur',
  'AD_RƏQƏMDİR': 'Ad rəqəmdir (sütunlar qarışıb?)',
  'TELEFON_SÜTUNU_YOXDUR': 'Telefon sütunu bazada yoxdur — adlar əlavə olundu',
}

const CARD = {
  background: 'white', border: '1px solid oklch(88% 0.02 60)',
  borderRadius: 6, padding: '14px 16px',
}
const BTN = (primary, danger) => ({
  display: 'inline-flex', alignItems: 'center', gap: 7,
  minHeight: 40, padding: '0 16px', borderRadius: 4,
  border: primary ? 'none' : '1px solid oklch(85% 0.02 60)',
  background: primary ? (danger ? 'oklch(52% 0.14 25)' : 'oklch(68% 0.1 80)') : 'white',
  color: primary ? (danger ? 'white' : 'oklch(22% 0.03 70)') : 'oklch(45% 0.03 60)',
  cursor: 'pointer', fontSize: 10, letterSpacing: '0.1em',
  textTransform: 'uppercase', fontWeight: 600,
  fontFamily: '"Inter",system-ui,sans-serif',
})

export default function GuestImportModal({ slug, onClose, onImported }) {
  const [stage,   setStage]   = useState('pick')   /* pick | review | done */
  const [busy,    setBusy]    = useState(false)
  const [error,   setError]   = useState('')
  const [fileName, setFileName] = useState('')
  const [parsed,  setParsed]  = useState(null)     /* readGuestFile nəticəsi */
  const [report,  setReport]  = useState(null)     /* dry_run hesabatı */
  const [result,  setResult]  = useState(null)     /* yekun nəticə */
  const fileRef = useRef(null)

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setError('')
    setBusy(true)
    setFileName(file.name)
    try {
      const p = await readGuestFile(file)
      if (!p.rows.length) {
        setError('Faylda qonaq sətri tapılmadı. Başlıq sətrini və sütunları yoxlayın.')
        setBusy(false)
        return
      }
      setParsed(p)

      /* Yoxlama hesabatı — serverdə heç nə yazılmır */
      const r = await importGuests(slug, p.rows, true)
      setReport(r)
      setStage('review')
    } catch (err) {
      const msgs = {
        FORMAT_XLS: 'Köhnə .xls formatı dəstəklənmir. Excel-də «Farklı saxla → .xlsx» seçin.',
        FORMAT_UNKNOWN: 'Yalnız .xlsx və .csv faylları qəbul edilir.',
        EMPTY: 'Fayl boşdur.',
        SHEET_NOT_FOUND: 'Faylın içində vərəq tapılmadı.',
        XML_PARSE: 'Fayl oxunmadı — zədələnmiş ola bilər.',
      }
      setError(msgs[err?.code] || msgs[err?.message] || err?.message || 'Fayl oxunmadı.')
    } finally {
      setBusy(false)
    }
  }, [slug])

  const runImport = async () => {
    if (!parsed) return
    setBusy(true)
    setError('')
    try {
      const r = await importGuests(slug, parsed.rows, false)
      setResult(r)
      setStage('done')
      if (r.inserted > 0) onImported?.(r)
    } catch (e) {
      setError(e?.message || 'İdxal alınmadı.')
    } finally {
      setBusy(false)
    }
  }

  const reset = () => {
    setStage('pick'); setParsed(null); setReport(null); setResult(null)
    setFileName(''); setError('')
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9997,
        background: 'oklch(20% 0.02 60 / 0.55)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 'clamp(12px, 4vw, 40px)', overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label="Excel qonaq idxalı"
        style={{
          width: '100%', maxWidth: 600, background: 'oklch(98% 0.005 80)',
          border: '1px solid oklch(88% 0.02 60)', borderRadius: 8,
          padding: 'clamp(18px, 5vw, 26px)',
          fontFamily: '"Inter",system-ui,sans-serif',
        }}
      >
        {/* Başlıq */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={{
              fontFamily: '"Cormorant Garamond","Playfair Display",serif',
              fontSize: 21, fontWeight: 300, color: 'oklch(20% 0.02 60)', margin: 0,
            }}>
              Excel / CSV idxalı
            </h2>
            <p style={{ fontFamily: 'monospace', fontSize: 10.5, color: 'oklch(58% 0.05 75)', marginTop: 4 }}>
              {slug}
            </p>
          </div>
          <button
            type="button" onClick={onClose} aria-label="Bağla"
            style={{
              width: 32, height: 32, flexShrink: 0, borderRadius: 4,
              background: 'white', border: '1px solid oklch(88% 0.02 60)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} strokeWidth={2} style={{ color: 'oklch(50% 0.03 60)' }} />
          </button>
        </div>

        {error && (
          <p role="alert" style={{
            marginBottom: 14, padding: '11px 13px', borderRadius: 4,
            border: '1px solid oklch(80% 0.08 25)', background: 'oklch(97% 0.03 25)',
            fontSize: 12, lineHeight: 1.6, color: 'oklch(42% 0.11 25)',
          }}>
            {error}
          </p>
        )}

        {/* ── ADDIM 1: fayl ── */}
        {stage === 'pick' && (
          <>
            <input
              ref={fileRef} type="file" style={{ display: 'none' }}
              accept=".xlsx,.xlsm,.csv,.txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]) }}
              style={{
                width: '100%', padding: '34px 20px', borderRadius: 6,
                border: '1px dashed oklch(82% 0.04 70)', background: 'white',
                cursor: busy ? 'default' : 'pointer', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              }}
            >
              {busy
                ? <Loader2 size={24} strokeWidth={1.4} style={{ color: 'oklch(68% 0.1 80)', animation: 'gi-rot 0.9s linear infinite' }} />
                : <FileSpreadsheet size={24} strokeWidth={1.3} style={{ color: 'oklch(68% 0.1 80)' }} />}
              <span style={{ fontSize: 13, color: 'oklch(32% 0.02 60)', fontWeight: 500 }}>
                {busy ? 'Fayl oxunur…' : 'Faylı seçin və ya bura sürükləyin'}
              </span>
              <span style={{ fontSize: 11, color: 'oklch(58% 0.03 60)' }}>
                .xlsx və ya .csv · maksimum 2000 sətir
              </span>
            </button>

            <div style={{ ...CARD, marginTop: 14 }}>
              <p style={{
                fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'oklch(50% 0.03 60)', fontWeight: 600, marginBottom: 8,
              }}>
                Faylın quruluşu
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.75, color: 'oklch(42% 0.02 60)' }}>
                Başlıq sətrində <strong>Ad Soyad</strong>, <strong>Masa</strong> və
                (istəyə görə) <strong>Telefon</strong> sütunları olsun. Sütunların
                sırası əhəmiyyətli deyil — başlıqlar AZ/EN/RU dillərində tanınır.
                Başlıq yoxdursa birinci sütun ad, ikinci masa, üçüncü telefon sayılır.
                Masa boş qalsa qonaq «Masa 1»-ə düşür.
              </p>
            </div>
          </>
        )}

        {/* ── ADDIM 2: yoxlama hesabatı ── */}
        {stage === 'review' && report && (
          <>
            <div style={{ ...CARD, marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: 'oklch(45% 0.02 60)', marginBottom: 10 }}>
                <strong style={{ color: 'oklch(25% 0.02 60)' }}>{fileName}</strong>
                {parsed && !parsed.headerDetected && (
                  <span style={{ display: 'block', marginTop: 6, color: 'oklch(48% 0.1 70)' }}>
                    ⚠ Başlıq sətri tapılmadı — sütun sırası fərz edildi (ad, masa, telefon).
                    Aşağıdaki önbaxışı diqqətlə yoxlayın.
                  </span>
                )}
              </p>

              <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))' }}>
                {[
                  { label: 'Əlavə olunacaq', value: report.willAdd, tone: 'oklch(42% 0.11 145)' },
                  { label: 'Təkrar',         value: report.skipped?.duplicate, tone: 'oklch(48% 0.09 70)' },
                  { label: 'Etibarsız',      value: report.skipped?.invalid,   tone: 'oklch(48% 0.12 25)' },
                  { label: 'Faylda cəmi',    value: report.total,              tone: 'oklch(45% 0.03 60)' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '8px 4px', background: 'oklch(97% 0.008 80)', borderRadius: 4 }}>
                    <div style={{ fontSize: 19, fontWeight: 300, color: s.tone, fontVariantNumeric: 'tabular-nums' }}>
                      {s.value ?? 0}
                    </div>
                    <div style={{ fontSize: 9.5, color: 'oklch(55% 0.03 60)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Önbaxış */}
            {report.preview?.length > 0 && (
              <div style={{ ...CARD, marginBottom: 12 }}>
                <p style={{
                  fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'oklch(50% 0.03 60)', fontWeight: 600, marginBottom: 9,
                }}>
                  İlk {report.preview.length} sətir
                </p>
                <div style={{ display: 'grid', gap: 5 }}>
                  {report.preview.map((r, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 10, alignItems: 'baseline',
                      fontSize: 12, color: 'oklch(35% 0.02 60)', flexWrap: 'wrap',
                    }}>
                      <span style={{ fontWeight: 500, minWidth: 0 }}>{r.name}</span>
                      <span style={{ fontSize: 10.5, color: 'oklch(58% 0.05 75)' }}>{r.table}</span>
                      {r.phone && (
                        <span style={{ fontSize: 10.5, color: 'oklch(60% 0.03 60)' }}>{r.phone}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buraxılan sətirlər */}
            {report.errors?.length > 0 && (
              <div style={{ ...CARD, marginBottom: 12 }}>
                <p style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'oklch(48% 0.09 70)', fontWeight: 600, marginBottom: 9,
                }}>
                  <AlertTriangle size={11} strokeWidth={2} />
                  Buraxılan sətirlər
                </p>
                <div style={{ display: 'grid', gap: 4, maxHeight: 150, overflowY: 'auto' }}>
                  {report.errors.map((e, i) => (
                    <div key={i} style={{ fontSize: 11.5, color: 'oklch(45% 0.03 60)' }}>
                      {e.line > 0 && <span style={{ color: 'oklch(62% 0.03 60)' }}>#{e.line} </span>}
                      {REASON_TEXT[e.reason] || e.reason}
                      {e.value && <span style={{ color: 'oklch(58% 0.03 60)' }}> — «{e.value}»</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button type="button" style={BTN(false)} onClick={reset} disabled={busy}>
                Başqa fayl
              </button>
              <button
                type="button"
                style={BTN(true)}
                onClick={runImport}
                disabled={busy || !report.willAdd}
              >
                {busy
                  ? <Loader2 size={12} strokeWidth={2} style={{ animation: 'gi-rot 0.9s linear infinite' }} />
                  : <Users size={12} strokeWidth={1.8} />}
                {report.willAdd ? `${report.willAdd} qonaq əlavə et` : 'Əlavə edilən yoxdur'}
              </button>
            </div>
          </>
        )}

        {/* ── ADDIM 3: nəticə ── */}
        {stage === 'done' && result && (
          <>
            <div style={{
              ...CARD, textAlign: 'center', padding: '28px 20px', marginBottom: 14,
            }}>
              <div style={{
                width: 44, height: 44, margin: '0 auto 14px', borderRadius: '50%',
                background: 'oklch(94% 0.06 145)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={20} strokeWidth={2} style={{ color: 'oklch(42% 0.12 145)' }} />
              </div>
              <p style={{ fontSize: 15, color: 'oklch(25% 0.02 60)', fontWeight: 500 }}>
                {result.inserted} qonaq əlavə olundu
              </p>
              <p style={{ fontSize: 12, color: 'oklch(55% 0.03 60)', marginTop: 6, lineHeight: 1.6 }}>
                {result.skipped?.duplicate > 0 && `${result.skipped.duplicate} təkrar buraxıldı. `}
                {result.skipped?.invalid > 0 && `${result.skipped.invalid} etibarsız sətir buraxıldı.`}
              </p>
            </div>

            {result.errors?.some(e => e.reason === 'TELEFON_SÜTUNU_YOXDUR') && (
              <p style={{
                marginBottom: 14, padding: '11px 13px', borderRadius: 4,
                border: '1px solid oklch(85% 0.06 70)', background: 'oklch(98% 0.02 70)',
                fontSize: 11.5, lineHeight: 1.6, color: 'oklch(45% 0.08 70)',
              }}>
                Telefon sütunu bazada tapılmadı, ona görə yalnız ad və masa yazıldı.
                Baxım bölməsindən sxem miqrasiyasını işə salın.
              </p>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button type="button" style={BTN(false)} onClick={reset}>
                <Upload size={12} strokeWidth={1.8} />
                Daha bir fayl
              </button>
              <button type="button" style={BTN(true)} onClick={onClose}>
                <Check size={12} strokeWidth={2.4} />
                Bitir
              </button>
            </div>
          </>
        )}

        <style>{`@keyframes gi-rot { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
