/* ─────────────────────────────────────────────────────────────────────────────
   ŞABLON ŞRİFTLƏRİ — tələb olunduqda yüklənir.

   ⚠ Bu şriftlər QƏSDƏN index.html-də deyil: simple-luxury (bütün mövcud
   müştərilər) yalnız Cormorant Garamond + Inter işlədir və onlar artıq
   index.html-dədir. Əlavə 8 ailəni hər səhifə yükləsəydi landing-in LCP-si
   pisləşərdi.

   Bu funksiya yalnız (a) builder-in "Dizayn seç" qalereyası açılanda,
   (b) simple-luxury-dən fərqli şablon render olunanda çağırılır.
   ───────────────────────────────────────────────────────────────────────── */

const FONT_HREF =
  'https://fonts.googleapis.com/css2' +
  '?family=Marcellus' +
  '&family=Instrument+Serif:ital@0;1' +
  '&family=Newsreader:ital,opsz,wght@0,6..72,200..500;1,6..72,200..400' +
  '&family=Italiana' +
  '&family=Amiri:ital,wght@0,400;0,700;1,400' +
  '&family=Archivo:wght@300;400;500;600' +
  '&family=Jost:wght@200;300;400;500' +
  '&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500' +
  '&display=swap'

const LINK_ID = 'digitoy-template-fonts'

/** Şablon şrift dəstini bir dəfə <head>-ə əlavə edir (idempotent). */
export function ensureTemplateFonts() {
  if (typeof document === 'undefined') return
  if (document.getElementById(LINK_ID)) return

  const link = document.createElement('link')
  link.id   = LINK_ID
  link.rel  = 'stylesheet'
  link.href = FONT_HREF
  document.head.appendChild(link)
}
