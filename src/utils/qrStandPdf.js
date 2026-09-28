/* ─────────────────────────────────────────────────────────────────────────────
   QR STEND — çap üçün yüksək keyfiyyətli PDF (Phase 43)

   NƏ ÜÇÜN BELƏ: üç yol var idi.

   1. `window.print()` — istifadəçini çap dialoquna atır, «PDF olaraq saxla»
      addımını ƏL İLƏ etməli olur. Fayl birbaşa endirilmir.
   2. `jspdf` + `html2canvas` — iki yeni asılılıq (~350 KB), həm də HTML→canvas
      çevirməsi şriftləri tez-tez səhv ölçür.
   3 (SEÇİLƏN). Stendi 300 DPI canvas-a ÇİZİB, JPEG-i əl ilə qurulmuş bir
      səhifəlik PDF-ə yerləşdirmək. Yeni asılılıq YOXDUR, fayl birbaşa
      endirilir və — ən vacibi — ŞRİFT PROBLEMİ YOXDUR: `Ə Ğ İ Ş Ö Ü Ç`
      hərfləri canvas-da brauzerin öz şrift zənciri ilə çizilir, PDF-ə isə
      şəkil kimi düşür. PDF-ə TTF subset yerləşdirmək lazım gəlmir (standart
      PDF şriftləri `Ə` hərfini ÜMUMİYYƏTLƏ saxlamır — bu, 2-ci yolun da
      gizli tələsidir).

   ⚠ 300 DPI: A5 (148×210 mm) → 1748×2480 px. Çap evində kifayətdir.
   ⚠ Canvas «tainted» olmasın: xarici ünvanlı şəkil `crossOrigin=anonymous`
     ilə yüklənir, alınmasa şəkil sadəcə buraxılır (stend yenə çıxır).
   ───────────────────────────────────────────────────────────────────────── */

/* ── Palitra — PRODUCT.md-dəki brend rəngləri ── */
const GOLD       = '#C5A059'
const GOLD_SOFT  = 'rgba(197,160,89,0.42)'
const GOLD_FAINT = 'rgba(197,160,89,0.16)'
const CREAM      = '#FDFAF4'
const CREAM_DEEP = '#F2EAD6'
const INK        = '#1A1A1A'
const MUTED      = 'rgba(120,104,84,0.85)'

const SERIF = '"Cormorant Garamond","Playfair Display",Georgia,"Times New Roman",serif'
const SANS  = '"Inter",system-ui,-apple-system,"Segoe UI",sans-serif'

/* A5 portret, millimetrlə */
export const STAND_MM = { w: 148, h: 210 }
export const STAND_LAYOUTS = ['classic', 'portrait', 'minimal', 'frame']

export const STAND_LAYOUT_LABELS = {
  az: { classic: 'Klassik', portrait: 'Böyük Foto', minimal: 'Minimal', frame: 'Çərçivə' },
  en: { classic: 'Classic',  portrait: 'Photo First', minimal: 'Minimal', frame: 'Framed' },
  ru: { classic: 'Классика', portrait: 'Большое фото', minimal: 'Минимал', frame: 'Рамка' },
}

/* ── Köməkçilər ─────────────────────────────────────────────────────────── */

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) { resolve(null); return }
    const img = new Image()
    /* ⚠ `crossOrigin` YALNIZ xarici origin üçün:
         • data: URI-də CORS anlayışı yoxdur;
         • eyni origin-də şəkil onsuz da canvas-ı «tainted» etmir, amma
           `crossOrigin` qoyulsa brauzer CORS-suz KEŞLƏNMİŞ cavabı rədd
           edə bilər və şəkil səbəbsiz yerə yüklənmir;
         • xarici origin-də isə şərtdir, əks halda `toBlob` istisna atır. */
    try {
      if (!src.startsWith('data:')) {
        const u = new URL(src, window.location.href)
        if (u.origin !== window.location.origin) img.crossOrigin = 'anonymous'
      }
    } catch {
      /* Ünvan analiz edilə bilmədi — ehtiyatlı davranıb CORS tələb edirik */
      if (!src.startsWith('data:')) img.crossOrigin = 'anonymous'
    }
    img.onload  = () => resolve(img)
    img.onerror = () => resolve(null)      /* şəkil olmasa stend yenə çıxır */
    img.src = src
  })
}

/** Mətni verilmiş enə sığdır — sözlərə görə sətirlərə bölür */
function wrapText(ctx, text, maxWidth, maxLines = 4) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const lines = []
  let line = words[0]
  for (let i = 1; i < words.length; i++) {
    const test = line + ' ' + words[i]
    if (ctx.measureText(test).width <= maxWidth) line = test
    else { lines.push(line); line = words[i] }
    if (lines.length === maxLines - 1 && i < words.length - 1) {
      /* Son sətir — qalanını yığ, YALNIZ sığmayanda kəs.
         ⚠ «…» şərtsiz əlavə edilməməlidir: mətn tam sığanda belə
         «…göndərin….» kimi çirkin nəticə çıxırdı. */
      const rest = words.slice(i + 1).join(' ')
      let tail = rest ? line + ' ' + rest : line
      if (ctx.measureText(tail).width <= maxWidth) {
        lines.push(tail)
        return lines
      }
      while (tail.length > 1 && ctx.measureText(tail + '…').width > maxWidth) {
        tail = tail.slice(0, -1)
      }
      lines.push(tail.replace(/[s.,;:]+$/, '') + '…')
      return lines
    }
  }
  lines.push(line)
  return lines
}

/** Sətirləri çiz, istifadə olunan hündürlüyü qaytar */
function drawLines(ctx, lines, cx, y, lineHeight) {
  lines.forEach((l, i) => ctx.fillText(l, cx, y + i * lineHeight))
  return lines.length * lineHeight
}

/** Yuxarıdan-aşağı qradiyentli fon */
function paintBackground(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, CREAM)
  g.addColorStop(1, CREAM_DEEP)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

/** Ortadan solan qızıl ayırıcı xətt */
function goldRule(ctx, cx, y, width, thickness) {
  const g = ctx.createLinearGradient(cx - width / 2, 0, cx + width / 2, 0)
  g.addColorStop(0,    'rgba(197,160,89,0)')
  g.addColorStop(0.5,  GOLD)
  g.addColorStop(1,    'rgba(197,160,89,0)')
  ctx.fillStyle = g
  ctx.fillRect(cx - width / 2, y, width, Math.max(1, thickness))
}

/** Künc ornamentləri (masa kartındakı dil ilə eyni) */
function cornerOrnaments(ctx, x, y, w, h, arm, lw) {
  ctx.strokeStyle = GOLD_SOFT
  ctx.lineWidth = lw
  const pts = [
    [x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1],
  ]
  for (const [px, py, sx, sy] of pts) {
    ctx.beginPath()
    ctx.moveTo(px + arm * sx, py)
    ctx.lineTo(px, py)
    ctx.lineTo(px, py + arm * sy)
    ctx.stroke()
  }
}

/** Şəkli dairə içində «cover» kimi çiz */
function drawCircleImage(ctx, img, cx, cy, r) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  coverDraw(ctx, img, cx - r, cy - r, r * 2, r * 2)
  ctx.restore()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.strokeStyle = GOLD_SOFT
  ctx.lineWidth = Math.max(1, r * 0.018)
  ctx.stroke()
}

/** `object-fit: cover` davranışı */
function coverDraw(ctx, img, dx, dy, dw, dh) {
  const ir = img.width / img.height
  const dr = dw / dh
  let sw, sh, sx, sy
  if (ir > dr) { sh = img.height; sw = sh * dr; sx = (img.width - sw) / 2; sy = 0 }
  else         { sw = img.width;  sh = sw / dr; sx = 0; sy = (img.height - sh) / 2 }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}

/** Yuxarısı tağlı (arch) maska ilə şəkil */
function drawArchImage(ctx, img, x, y, w, h) {
  ctx.save()
  ctx.beginPath()
  const r = w / 2
  ctx.moveTo(x, y + h)
  ctx.lineTo(x, y + r)
  ctx.arc(x + r, y + r, r, Math.PI, 0)
  ctx.lineTo(x + w, y + h)
  ctx.closePath()
  ctx.clip()
  coverDraw(ctx, img, x, y, w, h)
  ctx.restore()
  ctx.beginPath()
  ctx.moveTo(x, y + h)
  ctx.lineTo(x, y + r)
  ctx.arc(x + r, y + r, r, Math.PI, 0)
  ctx.lineTo(x + w, y + h)
  ctx.strokeStyle = GOLD_SOFT
  ctx.lineWidth = Math.max(1, w * 0.008)
  ctx.stroke()
}

/* ── Stend rəsmi ────────────────────────────────────────────────────────── */

/**
 * Stendi canvas-a çiz.
 *
 * @param {object}  o
 * @param {'classic'|'portrait'|'minimal'|'frame'} o.layout
 * @param {string}  o.names        «Fərid & Aysel»
 * @param {string}  o.dateLabel    «11 Oktyabr 2026»
 * @param {string}  o.title        redaktə olunan başlıq
 * @param {string}  o.description  redaktə olunan izah
 * @param {string}  o.urlLabel     QR-ın altında göstərilən qısa ünvan
 * @param {HTMLCanvasElement} o.qrCanvas   hazır QR canvas-ı (qrcode.react)
 * @param {string}  o.photoSrc     data URI və ya ünvan (könüllü)
 * @param {boolean} o.showPhoto
 * @param {boolean} o.showDate
 * @param {number}  o.dpi          default 300
 */
export async function renderStandCanvas(o) {
  const dpi   = o.dpi || 300
  const scale = dpi / 25.4                       /* mm → px */
  const W = Math.round(STAND_MM.w * scale)
  const H = Math.round(STAND_MM.h * scale)
  const u = W / 100                              /* 1 vahid = enin 1%-i */

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  paintBackground(ctx, W, H)

  const photo = (o.showPhoto !== false && o.photoSrc) ? await loadImage(o.photoSrc) : null
  const layout = STAND_LAYOUTS.includes(o.layout) ? o.layout : 'classic'
  const cx = W / 2
  const pad = u * 10

  /* ══ 1. ÖLÇ ══
     Mətn blokunun DƏQİQ hündürlüyü. `wrapText` şriftdən asılıdır, ona görə
     hər ölçmədən əvvəl `ctx.font` təyin olunur və nəticə saxlanılır —
     çizərkən eyni sətirlər işlədilir (iki dəfə hesablanmır). */
  const textW  = W - pad * 4.2
  const descW  = W - pad * 5

  ctx.font = `300 ${u * 8.4}px ${SERIF}`
  const nameLines = o.names ? wrapText(ctx, o.names, textW, 2) : []

  ctx.font = `400 ${u * 5}px ${SERIF}`
  const titleLines = o.title ? wrapText(ctx, o.title, textW, 2) : []

  ctx.font = `400 ${u * 3.1}px ${SANS}`
  const descLines = o.description ? wrapText(ctx, o.description, descW, 3) : []

  const showDate = o.showDate !== false && Boolean(o.dateLabel)

  /* ⚠ ŞAQULİ RİTM — TƏK MƏNBƏ.
     Ölçmə və çizim MƏHZ bu sabitlərdən oxuyur; birini dəyişmək kifayətdir,
     uyğunsuzluq (mətnin QR üzərinə düşməsi) struktur olaraq mümkün deyil. */
  const LH = {
    kicker:  u * 4.4,   /* kicker sətrindən sonra */
    rule:    u * 4.4,   /* qızıl ayırıcıdan sonra */
    name:    u * 9.2,   /* ad sətri */
    nameGap: u * 1.2,
    date:    u * 5.2,
    title:   u * 5.8,   /* başlıq sətri */
    titleGap: u * 2,
    desc:    u * 4.3,   /* izah sətri */
    descGap: u * 2,
  }

  const headH  = LH.kicker + LH.rule
  const namesH = nameLines.length ? nameLines.length * LH.name + LH.nameGap : 0
  const dateH  = showDate ? LH.date : 0
  const titleH = titleLines.length ? titleLines.length * LH.title + LH.titleGap : 0
  const descH  = descLines.length ? descLines.length * LH.desc + LH.descGap : 0
  const textBlockH = headH + namesH + dateH + titleH + descH

  /* ══ 2. BÖL ══
     Alt blok (QR + ünvan + ayırıcı + digitoy.az) səhifənin DİBİNƏ
     lövbərlənir: stendin dibi bütün maketlərdə eyni yerdədir (çap kəsimi),
     QR isə heç vaxt səhifədən kənara çıxa bilmir. */
  /* ⚠ QR 32% — 300 DPI-də təxminən 45 mm. Telefon kamerası 20–30 sm-dən
     rahat oxuyur; daha böyük QR səhifənin yarısını yeyir və şəkilə yer
     qalmır (bax bu faylın PATCH 28 qeydi). */
  const qrSize    = layout === 'minimal' ? W * 0.46 : W * 0.30
  const qrPadBox  = u * 3
  const qrBoxSize = qrSize + qrPadBox * 2
  const footerH   = u * 3 + (o.urlLabel ? u * 4 : 0) + u * 2.6 + u * 5
  const bottomPad = u * 4
  const qrTop     = H - bottomPad - footerH - qrBoxSize

  const topPad = layout === 'portrait' ? 0 : pad * 0.9
  /* Şəkil üçün qalan boşluq: mətn HEÇ VAXT kiçilmir, güzəşti şəkil verir. */
  const freeForPhoto = qrTop - u * 4 - topPad - textBlockH - u * 5

  let photoH = 0
  let photoW = 0
  if (photo && layout === 'portrait') {
    photoH = Math.max(u * 16, Math.min(H * 0.38, freeForPhoto + u * 5))
    photoW = W
  } else if (photo && layout === 'classic') {
    const r = Math.max(u * 7, Math.min(u * 15, freeForPhoto / 2))
    photoH = r * 2
    photoW = r * 2
  } else if (photo && layout === 'frame') {
    photoH = Math.max(u * 16, Math.min(W * 0.42 * 1.22, freeForPhoto))
    photoW = Math.min(W * 0.42, photoH / 1.22)
  }
  /* Şəkil minimumdan da aşağı düşsə ümumiyyətlə göstərilmir — yarım
     kəsilmiş şəkil çap stendində ən pis nəticədir. */
  const drawPhoto = photo && photoH >= u * 14 && freeForPhoto > u * 10

  /* ══ 3. ÇİZ ══ */
  /* Çərçivələr */
  if (layout === 'frame') {
    ctx.strokeStyle = GOLD_SOFT
    ctx.lineWidth = u * 0.5
    ctx.strokeRect(pad * 0.55, pad * 0.55, W - pad * 1.1, H - pad * 1.1)
    ctx.strokeStyle = GOLD_FAINT
    ctx.lineWidth = u * 0.22
    ctx.strokeRect(pad * 0.95, pad * 0.95, W - pad * 1.9, H - pad * 1.9)
    cornerOrnaments(ctx, pad * 1.35, pad * 1.35, W - pad * 2.7, H - pad * 2.7, u * 5, u * 0.35)
  } else if (layout !== 'portrait') {
    ctx.strokeStyle = GOLD_FAINT
    ctx.lineWidth = u * 0.28
    ctx.strokeRect(pad * 0.6, pad * 0.6, W - pad * 1.2, H - pad * 1.2)
  }

  let y = topPad

  /* ── PORTRAIT: yuxarıda tam enli foto ── */
  if (layout === 'portrait') {
    if (drawPhoto) {
      coverDraw(ctx, photo, 0, 0, photoW, photoH)
      /* Aşağıya doğru krem keçid — mətn şəkil üzərində oxunaqlı qalsın */
      const fadeH = Math.min(u * 14, photoH * 0.4)
      const fade = ctx.createLinearGradient(0, photoH - fadeH, 0, photoH)
      fade.addColorStop(0, 'rgba(253,250,244,0)')
      fade.addColorStop(1, CREAM)
      ctx.fillStyle = fade
      ctx.fillRect(0, photoH - fadeH, W, fadeH)
      y = photoH + u * 4
    } else {
      y = pad * 1.9
    }
  }

  /* ── Kicker ── */
  ctx.fillStyle = GOLD
  ctx.font = `600 ${u * 2.5}px ${SANS}`
  ctx.letterSpacing = `${u * 0.6}px`
  ctx.fillText('FOTO · PAYLAŞIM', cx, y)
  ctx.letterSpacing = '0px'
  y += LH.kicker

  goldRule(ctx, cx, y, W * 0.34, u * 0.22)
  y += LH.rule

  /* ── Adlar ── */
  if (nameLines.length) {
    ctx.fillStyle = INK
    ctx.font = `300 ${u * 8.4}px ${SERIF}`
    y += drawLines(ctx, nameLines, cx, y, LH.name)
    y += LH.nameGap
  }

  /* ── Tarix ── */
  if (showDate) {
    ctx.fillStyle = MUTED
    ctx.font = `400 ${u * 3.1}px ${SANS}`
    ctx.letterSpacing = `${u * 0.35}px`
    ctx.fillText(o.dateLabel, cx, y)
    ctx.letterSpacing = '0px'
    y += LH.date
  }

  /* ── Foto (klassik / çərçivə) ── */
  if (drawPhoto && layout === 'classic') {
    const r = photoH / 2
    drawCircleImage(ctx, photo, cx, y + r, r)
    y += photoH + u * 5
  } else if (drawPhoto && layout === 'frame') {
    drawArchImage(ctx, photo, cx - photoW / 2, y, photoW, photoH)
    y += photoH + u * 5
  } else if (layout !== 'portrait') {
    y += u * 2
  }

  /* ── Başlıq ── */
  if (titleLines.length) {
    ctx.fillStyle = INK
    ctx.font = `400 ${u * 5}px ${SERIF}`
    y += drawLines(ctx, titleLines, cx, y, LH.title)
    y += LH.titleGap
  }

  /* ── İzah ──
     ⚠ `y`-dən istifadə edən SON elementdir: QR və altlıq dibə lövbərlənib. */
  if (descLines.length) {
    ctx.fillStyle = MUTED
    ctx.font = `400 ${u * 3.1}px ${SANS}`
    drawLines(ctx, descLines, cx, y, LH.desc)
  }

  /* ── QR ── */
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(cx - qrBoxSize / 2, qrTop, qrBoxSize, qrBoxSize)
  ctx.strokeStyle = GOLD_SOFT
  ctx.lineWidth = u * 0.25
  ctx.strokeRect(cx - qrBoxSize / 2, qrTop, qrBoxSize, qrBoxSize)

  if (o.qrCanvas) {
    /* QR kvadratları kəskin qalsın — hamarlaşdırma modulları bulandırır */
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(o.qrCanvas, cx - qrSize / 2, qrTop + qrPadBox, qrSize, qrSize)
    ctx.imageSmoothingEnabled = true
  }

  let by = qrTop + qrBoxSize + u * 3
  if (o.urlLabel) {
    ctx.fillStyle = MUTED
    ctx.font = `400 ${u * 2.5}px ${SANS}`
    ctx.fillText(o.urlLabel, cx, by)
    by += u * 4
  }

  goldRule(ctx, cx, by, W * 0.3, u * 0.2)
  by += u * 2.6
  ctx.fillStyle = GOLD
  ctx.font = `600 ${u * 2.2}px ${SANS}`
  ctx.letterSpacing = `${u * 0.5}px`
  ctx.fillText('digitoy.az', cx, by)
  ctx.letterSpacing = '0px'

  return canvas
}

/* ── Canvas → PDF ───────────────────────────────────────────────────────── */

function ascii(str) {
  const a = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) a[i] = str.charCodeAt(i) & 0xff
  return a
}

/**
 * Bir səhifəlik PDF qur: səhifə + içinə yerləşdirilmiş JPEG.
 *
 * PDF-in `DCTDecode` filtri JPEG-i OLDUĞU KİMİ qəbul edir, yəni şəkil
 * yenidən kodlaşdırılmır — keyfiyyət canvas-dakı ilə eynidir.
 * Şrift yerləşdirilmir: bütün mətn artıq şəklin içindədir (bax fayl başlığı).
 */
export function jpegToPdf(jpegBytes, pxW, pxH, mmW, mmH) {
  const ptW = (mmW / 25.4) * 72
  const ptH = (mmH / 25.4) * 72

  const chunks = []
  let length = 0
  const push = (data) => {
    const bytes = typeof data === 'string' ? ascii(data) : data
    chunks.push(bytes)
    length += bytes.length
    return length
  }

  const offsets = []
  const startObj = (n) => { offsets[n] = length }

  push('%PDF-1.4\n')
  /* Binar şərh — bəzi oxucular faylı mətn kimi qəbul etməsin */
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]))

  startObj(1)
  push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')

  startObj(2)
  push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n')

  startObj(3)
  push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '
     + ptW.toFixed(2) + ' ' + ptH.toFixed(2) + '] '
     + '/Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n')

  startObj(4)
  push('4 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + pxW
     + ' /Height ' + pxH
     + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '
     + jpegBytes.length + ' >>\nstream\n')
  push(jpegBytes)
  push('\nendstream\nendobj\n')

  /* Şəkli səhifənin tam ölçüsünə uzat */
  const content = 'q\n' + ptW.toFixed(2) + ' 0 0 ' + ptH.toFixed(2) + ' 0 0 cm\n/Im0 Do\nQ\n'
  startObj(5)
  push('5 0 obj\n<< /Length ' + content.length + ' >>\nstream\n' + content + 'endstream\nendobj\n')

  const xrefPos = length
  let xref = 'xref\n0 6\n0000000000 65535 f \n'
  for (let i = 1; i <= 5; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n'
  }
  push(xref)
  push('trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xrefPos + '\n%%EOF\n')

  return new Blob(chunks, { type: 'application/pdf' })
}

function canvasToJpegBytes(canvas, quality = 0.94) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) { reject(new Error('CANVAS_TO_BLOB_FAILED')); return }
        blob.arrayBuffer().then(buf => resolve(new Uint8Array(buf))).catch(reject)
      },
      'image/jpeg',
      quality,
    )
  })
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  /* Safari endirməni dərhal başlatmır — URL-i bir qədər sonra buraxırıq */
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

/** Stendi PDF olaraq endir. `renderStandCanvas` ilə eyni parametrlər. */
export async function downloadStandPdf(opts, filename = 'qr-stend.pdf') {
  const canvas = await renderStandCanvas(opts)
  const jpeg   = await canvasToJpegBytes(canvas, opts.quality || 0.94)
  const pdf    = jpegToPdf(jpeg, canvas.width, canvas.height, STAND_MM.w, STAND_MM.h)
  triggerDownload(pdf, filename)
  return { bytes: pdf.size, width: canvas.width, height: canvas.height }
}

/** Sosial şəbəkə / sürətli önbaxış üçün PNG variantı */
export async function downloadStandPng(opts, filename = 'qr-stend.png') {
  const canvas = await renderStandCanvas(opts)
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'))
  if (!blob) throw new Error('CANVAS_TO_BLOB_FAILED')
  triggerDownload(blob, filename)
  return { bytes: blob.size }
}
