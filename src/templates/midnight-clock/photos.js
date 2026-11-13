/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/mk-1.webp', label: 'Açılış və örtük — gecəyarısına yaxın zər saat', hint: 'Açılışda saat şəklin üstündədir.' },
  { key: 'detail', src: '/img/wedding/viral/mk-2.webp', label: 'Foto bloku — şampan və saat (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/mk-3.webp', label: 'Proqramın üstündəki şəkil — Yeni il süfrəsi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/mk-4.webp', label: 'Final — Bakı üzərində atəşfəşanlıq', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
