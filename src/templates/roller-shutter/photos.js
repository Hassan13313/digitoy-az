/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/rs-1.webp', label: 'Açılış və örtük — yarıaçıq jalüzlü vitrin', hint: 'Açılışda jalüz şəklin üstündən qalxır.' },
  { key: 'detail', src: '/img/wedding/viral/rs-2.webp', label: 'Foto bloku — açarlar və lent (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/rs-3.webp', label: 'Proqramın üstündəki şəkil — loft masası', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/rs-4.webp', label: 'Final — gecə işıqlı mağaza', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
