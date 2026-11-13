/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/lp-1.webp', label: 'Açılış və örtük — saray zalında kiçik şahzadə', hint: 'Açılışda pərdələr şəklin üstündən açılır; öz şəklinizi qoysanız da pərdə qalır.' },
  { key: 'detail', src: '/img/wedding/viral/lp-2.webp', label: 'Foto bloku — məxmər yastıqda tac (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/lp-3.webp', label: 'Proqramın üstündəki şəkil — saray süfrəsi', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/lp-4.webp', label: 'Final — eyvanda atəşfəşanlıq', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
