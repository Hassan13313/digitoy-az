/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/da-1.webp', label: 'Açılış və örtük — cəngəllikdə dino yumurtası', hint: 'Açılışda yumurta şəklin üstündə çatlayır.' },
  { key: 'detail', src: '/img/wedding/viral/da-2.webp', label: 'Foto bloku — qazıntı dəsti (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/da-3.webp', label: 'Proqramın üstündəki şəkil — cəngəllik süfrəsi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/da-4.webp', label: 'Final — gün batımında vadi', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
