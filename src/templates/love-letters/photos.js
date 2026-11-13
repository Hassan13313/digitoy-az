/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/ll-1.webp', label: 'Açılış və örtük — məktub bağlaması', hint: 'Açılışda zərflər şəklin üstündən dağılır.' },
  { key: 'detail', src: '/img/wedding/viral/ll-2.webp', label: 'Foto bloku — qələm və möhür (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/ll-3.webp', label: 'Proqramın üstündəki şəkil — romantik süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/ll-4.webp', label: 'Final — pəncərə önündə məktublar', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
