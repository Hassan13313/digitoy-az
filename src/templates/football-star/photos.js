/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/fs-1.webp', label: 'Açılış və örtük — gecə stadionunda kiçik futbolçu', hint: 'Açılışda projektorlar yanır; öz şəklinizi qoysanız da effekt qalır.' },
  { key: 'detail', src: '/img/wedding/viral/fs-2.webp', label: 'Foto bloku — top, butsi və kubok (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/fs-3.webp', label: 'Proqramın üstündəki şəkil — meydanda süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/fs-4.webp', label: 'Final — konfetti altında stadion', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
