/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/nb-1.webp', label: 'Açılış və örtük — ulduzlu səma altında tonqal', hint: 'Açılışda alov şəklin üstündə qalxır.' },
  { key: 'detail', src: '/img/wedding/viral/nb-2.webp', label: 'Foto bloku — mis çıraq və quru meyvə (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/nb-3.webp', label: 'Proqramın üstündəki şəkil — Novruz süfrəsi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/nb-4.webp', label: 'Final — gecə həyətində tonqallar', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
