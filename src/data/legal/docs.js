/* ══════════════════════════════════════════════════════════════════════════
   Phase 47 — hüquqi sənədlərin siyahısı (marşrut + SEO).

   ⚠ public/seo.php → seoLegalPages() ilə HƏRFBƏHƏRF eyni olmalıdır: crawler
   meta-nı serverdən, brauzer isə buradan alır. public/sitemap.xml-də də
   hər path olmalıdır (tests/site_routes_test.mjs yoxlayır).
   Mətnlərin özü: src/data/legal/<id>/<dil>.js (lazy chunk).
   ══════════════════════════════════════════════════════════════════════ */

export const LEGAL_UPDATED = '2026-10-06'

export const LEGAL_DOCS = [
  {
    id: 'privacy',
    path: '/mexfilik',
    title: 'Məxfilik Siyasəti | DigiToy',
    description: 'DigiToy hansı məlumatları toplayır, nə üçün istifadə edir, kimlərlə paylaşır və nə qədər saxlayır — kukilər və hüquqlarınız daxil.',
  },
  {
    id: 'terms',
    path: '/sertler',
    title: 'İstifadə Şərtləri və Public Oferta | DigiToy',
    description: 'DigiToy rəqəmsal dəvətnamə xidmətindən istifadə qaydaları: sifariş, qiymət, linkin müddəti, məzmun və tərəflərin məsuliyyəti.',
  },
  {
    id: 'refund',
    path: '/geri-qaytarma',
    title: 'Ödəniş və Geri Qaytarma Qaydaları | DigiToy',
    description: 'DigiToy-da ödəniş nə vaxt edilir və hansı hallarda pul qaytarılır — fərdi rəqəmsal xidmət üçün aydın qaydalar.',
  },
]

export const legalDoc = (id) => LEGAL_DOCS.find((d) => d.id === id) || null
