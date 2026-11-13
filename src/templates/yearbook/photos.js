/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/yb-1.webp', label: 'Açılış və örtük — dəhlizdə varsity gödəkcəsi', hint: 'Açılışda dəftər vərəqi şəklin üstündən sürüşür.' },
  { key: 'detail', src: '/img/wedding/viral/yb-2.webp', label: 'Foto bloku — markerlər və yamaq (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/yb-3.webp', label: 'Proqramın üstündəki şəkil — məktəb süfrəsi', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/yb-4.webp', label: 'Final — günəşli məktəb dəhlizi', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
