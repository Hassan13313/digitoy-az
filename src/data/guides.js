/* ══════════════════════════════════════════════════════════════════════════
   Phase 52 — bələdçi / dəvətnamə mətnləri səhifələri (/toy-devetnamesi-metnleri …)

   Mətnin özü public/guides/<slug>.json-dadır: həm GuidePage (fetch), həm də
   public/seo.php (crawler meta, schema, <noscript>) EYNİ faylı oxuyur.
   Burada yalnız marşrut, footer/«Digər bələdçilər» linki və <head> üçün
   lazım olanlar var. ⚠ title/description/label JSON ilə HƏRFBƏHƏRF eynidir
   (tests/guides_test.mjs). Yeni bələdçi: JSON + bu siyahı + sitemap + llms.txt.
   ══════════════════════════════════════════════════════════════════════ */

export const GUIDES = [
  {
    slug: 'online-devetname-nece-hazirlanir',
    label: 'Online dəvətnamə necə hazırlanır',
    title: 'Online Dəvətnamə Necə Hazırlanır? Addım-addım Bələdçi | DigiToy',
    description: 'Online (elektron) dəvətnamə nədir, kağızdan nə ilə fərqlənir, necə hazırlanır və WhatsApp-da necə göndərilir — 5 addımda sadə bələdçi və qiymətlər.',
  },
  {
    slug: 'toy-devetnamesi-metnleri',
    label: 'Toy dəvətnaməsi mətnləri',
    title: 'Toy Dəvətnaməsi Mətnləri və Nümunələri (2026) | DigiToy',
    description: 'Toy dəvətnaməsi üçün hazır mətnlər: rəsmi, romantik, şeirli, qısa WhatsApp mesajı və kəbin mərasimi nümunələri. Kopyalayın və online dəvətnamədə işlədin.',
  },
  {
    slug: 'nisan-devetnamesi-metnleri',
    label: 'Nişan dəvətnaməsi mətnləri',
    title: 'Nişan Dəvətnaməsi Mətnləri və Nümunələri (2026) | DigiToy',
    description: 'Nişan dəvətnaməsi üçün hazır mətnlər: ailələrin adından, romantik, şeirli və qısa WhatsApp nümunələri. Kopyalayın və online nişan dəvətnaməsi hazırlayın.',
  },
  {
    slug: 'xina-devetnamesi-metnleri',
    label: 'Xına dəvətnaməsi mətnləri',
    title: 'Xına Dəvətnaməsi Mətnləri və Nümunələri (2026) | DigiToy',
    description: 'Xına gecəsi üçün hazır dəvətnamə mətnləri: ənənəvi, şeirli, qızlar gecəsi və qısa WhatsApp nümunələri. Kopyalayın və online xına dəvətnaməsi hazırlayın.',
  },
  {
    slug: 'ad-gunu-devetnamesi-metnleri',
    label: 'Ad günü dəvətnaməsi mətnləri',
    title: 'Ad Günü Dəvətnaməsi Mətnləri: Uşaq, 1 Yaş, Yubiley | DigiToy',
    description: 'Ad günü dəvətnaməsi üçün hazır mətnlər: uşaq ad günü, 1 yaş, yubiley, sürpriz parti və qısa WhatsApp mesajı. Kopyalayın və online dəvətnamə hazırlayın.',
  },
  {
    slug: 'korporativ-devetname-metnleri',
    label: 'Korporativ dəvətnamə mətnləri',
    title: 'Korporativ Tədbir Dəvətnaməsi Mətnləri və Nümunələri | DigiToy',
    description: 'Korporativ tədbirlər üçün rəsmi dəvətnamə mətnləri: konfrans, açılış, qala gecəsi, yeni il şənliyi və seminar. Kopyalayın və online dəvətnamə ilə göndərin.',
  },
]

/** '/toy-devetnamesi-metnleri/' → 'toy-devetnamesi-metnleri'; bələdçi deyilsə null */
export function matchGuideRoute(pathname) {
  const p = String(pathname || '').split(/[?#]/)[0].replace(/\/+$/, '')
  return GUIDES.find((g) => `/${g.slug}` === p)?.slug ?? null
}

export const findGuide = (slug) => GUIDES.find((g) => g.slug === slug) ?? null
