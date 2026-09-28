/* ─────────────────────────────────────────────────────────────────────────────
   QONAQ SİYAHISI FAYLI — XLSX / CSV oxucusu (Phase 43)

   NƏ ÜÇÜN BRAUZERDƏ: fayl serverə HEÇ VAXT yüklənmir. Parsing burada olur,
   serverə isə təmiz JSON gedir (`api.importGuests`). Bunun üç faydası var:
     • serverdə yeni fayl yükləmə yolu açılmır (yeni hücum səthi yoxdur),
     • PHP tərəfində ZIP/XML emalı yoxdur (zip-bomba riski yoxdur),
     • istifadəçi göndərməmişdən ƏVVƏL nəyin idxal olunacağını görür.

   NƏ ÜÇÜN YENİ KİTABXANA YOX: XLSX bir ZIP arxivdir və `jszip` LAYİHƏDƏ
   ONSUZ DA VAR (`package.json` → jszip, HD endirmə üçün). XML-i brauzerin
   öz `DOMParser`-i oxuyur. Yəni bu xüsusiyyət bundle ölçüsünə ~0 əlavə edir.

   ⚠ jszip DİNAMİK import edilir: idxal modalı açılmayan istifadəçi (yəni
   qonaqların hamısı) bu kodu heç vaxt yükləmir.
   ───────────────────────────────────────────────────────────────────────── */

/* Başlıq sətrindəki sütun adları — üç dildə + geniş yazılışlar */
const HEADER_MAP = {
  name: [
    'ad', 'adı', 'adi', 'ad soyad', 'adsoyad', 'ad və soyad', 'tam ad',
    'qonaq', 'qonağın adı', 'qonagin adi', 'soyad',
    'name', 'full name', 'fullname', 'guest', 'guest name',
    'имя', 'фио', 'гость', 'имя гостя',
  ],
  table: [
    'masa', 'masa nömrəsi', 'masa nomresi', 'masa №', 'masa no', 'stol',
    'table', 'table name', 'table no', 'table number', 'seat', 'seating',
    'стол', 'столик', 'номер стола',
  ],
  phone: [
    'telefon', 'tel', 'nömrə', 'nomre', 'mobil', 'əlaqə', 'elaqe',
    'phone', 'mobile', 'tel.', 'phone number', 'contact',
    'телефон', 'моб', 'номер',
  ],
}

/** Başlıq mətnini müqayisə üçün normallaşdır */
function normHeader(s) {
  return String(s || '')
    .toLowerCase()
    /* Excel/Google Sheets başlıqlarında kəsilməz boşluq (U+00A0) çox olur —
       escape ilə yazılır ki, mənbə kodda görünməz simvol qalmasın. */
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[.:#*]+$/g, '')
    .trim()
}

/* Hissəvi uyğunluq üçün maksimum xana uzunluğu.
   ⚠ Bu hədd OLMADAN «Qonaq siyahısı — Aysel & Ferid» kimi bəzək başlığı
   `qonaq` alias-ını tutub başlıq sətri sayılırdı (bax PATCH 30 qeydi). */
const MAX_HEADER_CELL = 28

/**
 * Bir sətri başlıq kimi qiymətləndir.
 * @returns {{columns: object, score: number}|null}
 */
function scoreHeaderRow(row) {
  if (!Array.isArray(row)) return null
  const found = {}
  let score = 0

  /* 1) DƏQİQ uyğunluq — «masa» sütunu «ad»dan öncə seçilməsin deyə
        sahələr HEADER_MAP sırası ilə gəzilir. */
  row.forEach((cell, i) => {
    const h = normHeader(cell)
    if (!h || h.length > MAX_HEADER_CELL) return
    for (const [field, aliases] of Object.entries(HEADER_MAP)) {
      if (found[field] !== undefined) continue
      if (aliases.includes(h)) { found[field] = i; score += 2; return }
    }
  })

  /* 2) HİSSƏVİ uyğunluq — yalnız qısa xanalarda («Qonağın adı (tam)») */
  row.forEach((cell, i) => {
    const h = normHeader(cell)
    if (!h || h.length > MAX_HEADER_CELL) return
    for (const [field, aliases] of Object.entries(HEADER_MAP)) {
      if (found[field] !== undefined) continue
      if (aliases.some(a => a.length > 2 && h.includes(a))) { found[field] = i; score += 1 }
    }
  })

  /* Başlıq sayılmaq üçün ən azı AD + bir başqa sütun tapılmalıdır:
     tək uyğunluq təsadüfi mətn ola bilər. */
  const others = (found.table !== undefined ? 1 : 0) + (found.phone !== undefined ? 1 : 0)
  if (found.name === undefined || others === 0) return null
  return { columns: found, score }
}

/* ── CSV ────────────────────────────────────────────────────────────────── */

/** Ayırıcını sətirlərdəki sayına görə təxmin et (vergül / nöqtəli vergül / tab) */
function guessDelimiter(text) {
  const sample = text.split(/\r?\n/).slice(0, 5).join('\n')
  const counts = { ',': 0, ';': 0, '\t': 0 }
  let inQuotes = false
  for (const ch of sample) {
    if (ch === '"') inQuotes = !inQuotes
    else if (!inQuotes && counts[ch] !== undefined) counts[ch]++
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][1] > 0
    ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    : ','
}

/** RFC4180 uyğun CSV parseri — sətir içi yeni sətir və "" qaçışını dəstəkləyir */
export function parseCsv(text) {
  /* BOM — Excel-in yazdığı UTF-8 CSV həmişə bununla başlayır */
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  const delim = guessDelimiter(text)

  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += c
      continue
    }

    if (c === '"' && field === '') { inQuotes = true; continue }
    if (c === delim) { row.push(field); field = ''; continue }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue }
    if (c === '\r') continue
    field += c
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }

  return rows.filter(r => r.some(c => String(c).trim() !== ''))
}

/* ── XLSX ───────────────────────────────────────────────────────────────── */

/** "BC12" → 28 (0-əsaslı sütun indeksi) */
function colIndex(ref) {
  const m = /^([A-Z]+)/.exec(ref || '')
  if (!m) return 0
  let n = 0
  for (const ch of m[1]) n = n * 26 + (ch.charCodeAt(0) - 64)
  return n - 1
}

/** `<si>` elementindən mətni çıxar (sadə `<t>` və ya zəngin `<r><t>` parçaları) */
function siText(si) {
  const ts = si.getElementsByTagName('t')
  let out = ''
  for (let i = 0; i < ts.length; i++) out += ts[i].textContent
  return out
}

function xmlDoc(str) {
  const doc = new DOMParser().parseFromString(str, 'application/xml')
  if (doc.getElementsByTagName('parsererror').length) throw new Error('XML_PARSE')
  return doc
}

/**
 * XLSX faylını sətir massivinə çevir.
 * Yalnız BİRİNCİ vərəq oxunur — qonaq siyahısı praktikada tək vərəqdədir.
 */
export async function parseXlsx(file) {
  const { default: JSZip } = await import('jszip')
  const zip = await JSZip.loadAsync(file)

  /* ── Birinci vərəqin faylını tap ──
     Vərəq adları `xl/workbook.xml`-də, fayl yolları isə rels-dədir. Sadə
     `sheet1.xml` fərziyyəsi Google Sheets ixracında bəzən səhv olur. */
  let sheetPath = 'xl/worksheets/sheet1.xml'
  try {
    const wbStr = await zip.file('xl/workbook.xml')?.async('string')
    const relStr = await zip.file('xl/_rels/workbook.xml.rels')?.async('string')
    if (wbStr && relStr) {
      const sheets = xmlDoc(wbStr).getElementsByTagName('sheet')
      const rid = sheets[0]?.getAttribute('r:id') || sheets[0]?.getAttribute('id')
      const rels = xmlDoc(relStr).getElementsByTagName('Relationship')
      for (let i = 0; i < rels.length; i++) {
        if (rels[i].getAttribute('Id') === rid) {
          const target = rels[i].getAttribute('Target') || ''
          sheetPath = target.startsWith('/')
            ? target.slice(1)
            : `xl/${target.replace(/^\.\//, '')}`
          break
        }
      }
    }
  } catch { /* fallback sheet1.xml ilə davam */ }

  const sheetStr = await (zip.file(sheetPath) || zip.file('xl/worksheets/sheet1.xml'))?.async('string')
  if (!sheetStr) throw new Error('SHEET_NOT_FOUND')

  /* ── Paylaşılan mətn cədvəli (`t="s"` xanaları buna istinad edir) ── */
  const shared = []
  try {
    const ssStr = await zip.file('xl/sharedStrings.xml')?.async('string')
    if (ssStr) {
      const sis = xmlDoc(ssStr).getElementsByTagName('si')
      for (let i = 0; i < sis.length; i++) shared.push(siText(sis[i]))
    }
  } catch { /* paylaşılan mətn yoxdursa inline dəyərlər işlənir */ }

  const rowsEl = xmlDoc(sheetStr).getElementsByTagName('row')
  const rows = []

  for (let r = 0; r < rowsEl.length; r++) {
    const cells = rowsEl[r].getElementsByTagName('c')
    const out = []
    for (let c = 0; c < cells.length; c++) {
      const cell = cells[c]
      const idx = colIndex(cell.getAttribute('r'))
      const type = cell.getAttribute('t')
      let val

      if (type === 's') {
        const vEl = cell.getElementsByTagName('v')[0]
        val = shared[parseInt(vEl?.textContent || '-1', 10)] ?? ''
      } else if (type === 'inlineStr') {
        val = siText(cell.getElementsByTagName('is')[0] || cell)
      } else {
        const vEl = cell.getElementsByTagName('v')[0]
        val = vEl?.textContent ?? ''
      }

      out[idx] = String(val).trim()
    }
    /* Boş xanalar `undefined` qalır — massivi bərabərləşdiririk */
    for (let i = 0; i < out.length; i++) if (out[i] === undefined) out[i] = ''
    if (out.some(v => v !== '')) rows.push(out)
  }

  return rows
}

/* ── Ümumi giriş nöqtəsi ───────────────────────────────────────────────── */

/**
 * Faylı oxu və qonaq sətirlərinə çevir.
 *
 * @returns {Promise<{rows: Array<{name,table,phone}>, columns: object,
 *                    headerDetected: boolean, rawCount: number, sheetRows: Array}>}
 */
export async function readGuestFile(file) {
  const name = (file?.name || '').toLowerCase()
  const isCsv = name.endsWith('.csv') || name.endsWith('.txt')
  const isXlsx = name.endsWith('.xlsx') || name.endsWith('.xlsm')

  if (name.endsWith('.xls') && !isXlsx) {
    /* Köhnə ikili .xls formatı ZIP deyil — açıq mesaj veririk ki, istifadəçi
       «niyə işləmir» sualı ilə qalmasın. */
    const err = new Error('FORMAT_XLS')
    err.code = 'FORMAT_XLS'
    throw err
  }
  if (!isCsv && !isXlsx) {
    const err = new Error('FORMAT_UNKNOWN')
    err.code = 'FORMAT_UNKNOWN'
    throw err
  }

  const sheetRows = isCsv ? parseCsv(await file.text()) : await parseXlsx(file)
  if (!sheetRows.length) {
    const err = new Error('EMPTY')
    err.code = 'EMPTY'
    throw err
  }

  /* ── Başlıq sətrini tap ──
     İlk 8 sətrə baxılır: Excel siyahılarında başlıqdan əvvəl tez-tez
     bəzək mətni, logo sətri və ya boş sətirlər olur.
     ⚠ İLK uyğun sətir DEYİL, ƏN YÜKSƏK BALLI sətir seçilir — əks halda
     bəzək başlığı əsl başlıq sətrini üstələyir (bax PATCH 30). */
  let columns = null
  let headerRow = -1
  let bestScore = 0
  for (let i = 0; i < Math.min(8, sheetRows.length); i++) {
    const det = scoreHeaderRow(sheetRows[i])
    if (det && det.score > bestScore) {
      bestScore = det.score
      columns = det.columns
      headerRow = i
    }
  }

  /* Başlıq tapılmadı → sütun sırası fərz edilir: A=ad, B=masa, C=telefon */
  const headerDetected = columns !== null
  if (!columns) columns = { name: 0, table: 1, phone: 2 }

  const dataRows = sheetRows.slice(headerRow + 1)
  const rows = dataRows.map(r => ({
    name:  String(r[columns.name]  ?? '').trim(),
    table: String(r[columns.table] ?? '').trim(),
    phone: String(r[columns.phone] ?? '').trim(),
  })).filter(r => r.name !== '' || r.table !== '' || r.phone !== '')

  return { rows, columns, headerDetected, rawCount: sheetRows.length, sheetRows }
}

export default readGuestFile
