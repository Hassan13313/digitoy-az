/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/ct-1.webp', label: 'Açılış və örtük — havaya atılan papaqlar', hint: 'Açılışda papaqlar şəklin üstündən uçub gedir.' },
  { key: 'detail', src: '/img/wedding/viral/ct-2.webp', label: 'Foto bloku — diplom və medal (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/ct-3.webp', label: 'Proqramın üstündəki şəkil — məzun süfrəsi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/ct-4.webp', label: 'Final — axşam universitet binası', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
