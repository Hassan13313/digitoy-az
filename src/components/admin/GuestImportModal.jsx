import { useState, useCallback } from 'react'
import { readGuestFile } from '../../utils/guestSheet'
import { importGuests } from '../../utils/api'
import ImportDialog from './v2/ImportDialog'

/* ══════════════════════════════════════════════════
   EXCEL / CSV QONAQ İDXALI (Phase 43; UI redesign 2026-10: v2/ImportDialog)

   Üç addım: fayl → yoxlama hesabatı → yazma.

   ⚠ FAYL SERVERƏ YÜKLƏNMİR. Parsing brauzerdədir (`utils/guestSheet.js`),
   serverə yalnız {name, table, phone} JSON sətirləri gedir. Ona görə:
     • serverdə yeni fayl qəbul yolu yoxdur (hücum səthi artmır),
     • istifadəçi GÖNDƏRMƏMİŞDƏN ÖNCƏ nəyin əlavə olunacağını görür.

   ⚠ İKİ ADDIMLI TƏSDİQ: əvvəlcə `dry_run` (heç nə yazılmır) hesabatı
   göstərilir — təkrarlar, boş adlar, səhv sütunlar. İstifadəçi razılaşandan
   sonra yazılır. Yazma TƏK TRANZAKSİYADADIR: ya hamısı, ya heç nə.
   ══════════════════════════════════════════════════ */

const REASON_TEXT = {
  'TƏKRAR': 'Təkrarlanır',
  'AD_BOŞDUR': 'Ad boşdur',
  'AD_RƏQƏMDİR': 'Ad rəqəmdir (sütunlar qarışıb?)',
  'TELEFON_SÜTUNU_YOXDUR': 'Telefon sütunu bazada yoxdur — adlar əlavə olundu',
}

const FILE_ERRORS = {
  FORMAT_XLS: 'Köhnə .xls formatı dəstəklənmir. Excel-də «Farklı saxla → .xlsx» seçin.',
  FORMAT_UNKNOWN: 'Yalnız .xlsx və .csv faylları qəbul edilir.',
  EMPTY: 'Fayl boşdur.',
  SHEET_NOT_FOUND: 'Faylın içində vərəq tapılmadı.',
  XML_PARSE: 'Fayl oxunmadı — zədələnmiş ola bilər.',
}

export default function GuestImportModal({ slug, onClose, onImported }) {
  const [stage,    setStage]    = useState('pick')   /* pick | review | done */
  const [busy,     setBusy]     = useState(false)
  const [error,    setError]    = useState('')
  const [fileName, setFileName] = useState('')
  const [parsed,   setParsed]   = useState(null)     /* readGuestFile nəticəsi */
  const [report,   setReport]   = useState(null)     /* dry_run hesabatı */
  const [result,   setResult]   = useState(null)     /* yekun nəticə */

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
      setError(FILE_ERRORS[err?.code] || FILE_ERRORS[err?.message] || err?.message || 'Fayl oxunmadı.')
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

  const skipped = (report?.errors || [])
    .filter(e => e.reason !== 'TELEFON_SÜTUNU_YOXDUR')
    .map(e => ({
      row: e.line > 0 ? e.line : '—',
      reason: `${REASON_TEXT[e.reason] || e.reason}${e.value ? ` — «${e.value}»` : ''}`,
    }))

  const warning = stage === 'review' && parsed && !parsed.headerDetected
    ? 'Başlıq sətri tapılmadı — sütun sırası fərz edildi (ad, masa, telefon). Önbaxışı diqqətlə yoxlayın.'
    : stage === 'done' && result?.errors?.some(e => e.reason === 'TELEFON_SÜTUNU_YOXDUR')
      ? 'Telefon sütunu bazada tapılmadı, ona görə yalnız ad və masa yazıldı. Baxım bölməsindən sxem miqrasiyasını işə salın.'
      : ''

  return (
    <ImportDialog
      open
      onClose={onClose}
      step={stage}
      onPickFile={handleFile}
      parsing={busy && stage === 'pick'}
      error={error}
      fileName={fileName}
      preview={report?.preview || []}
      totalRows={report?.total}
      validRows={report?.willAdd}
      skipped={skipped}
      onConfirm={runImport}
      importing={busy && stage === 'review'}
      onReset={reset}
      result={result ? {
        added: result.inserted,
        skipped: (result.skipped?.duplicate || 0) + (result.skipped?.invalid || 0),
      } : undefined}
      hint="Başlıq sətrində «Ad Soyad», «Masa» və (istəyə görə) «Telefon» sütunları olsun — sıra əhəmiyyətli deyil, başlıqlar AZ/EN/RU dillərində tanınır. Başlıq yoxdursa birinci sütun ad, ikinci masa, üçüncü telefon sayılır. Masa boş qalsa qonaq «Masa 1»-ə düşür."
      warning={warning}
    />
  )
}
