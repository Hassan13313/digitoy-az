/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/pb-1.webp', label: 'Açılış və örtük — çiçək tağı və beşik', hint: 'Açılışda akvarel kağızı şəklin üstündən əriyir.' },
  { key: 'detail', src: '/img/wedding/viral/pb-2.webp', label: 'Foto bloku — toxunma başmaqlar (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/pb-3.webp', label: 'Proqramın üstündəki şəkil — pastel süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/pb-4.webp', label: 'Final — pəncərə önündə çiçəklər', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
