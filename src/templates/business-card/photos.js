/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/bc-1.webp', label: 'Açılış və örtük — minimal ofis lobbisi', hint: 'Açılışda vizit kartı şəklin üstündə çevrilir.' },
  { key: 'detail', src: '/img/wedding/viral/bc-2.webp', label: 'Foto bloku — vizit kartları (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/bc-3.webp', label: 'Proqramın üstündəki şəkil — biznes şam yeməyi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/bc-4.webp', label: 'Final — axşam ofis binası', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
