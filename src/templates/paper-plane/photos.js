/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/pa-1.webp', label: 'Açılış və örtük — səmada kağız təyyarə', hint: 'Açılışda dəftər vərəqi şəklin üstündən uçur.' },
  { key: 'detail', src: '/img/wedding/viral/pa-2.webp', label: 'Foto bloku — vərəq və qlobus (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/pa-3.webp', label: 'Proqramın üstündəki şəkil — səma rəngli süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/pa-4.webp', label: 'Final — gün batımına uçan təyyarələr', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
