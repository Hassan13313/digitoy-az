/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/cp-1.webp', label: 'Açılış və örtük — kinoteatr və qırmızı xalça', hint: 'Açılışda şəkil ensiz zolaqdan açılır. Öz şəklinizi qoysanız lampa işığı göstərilmir.' },
  { key: 'detail', src: '/img/wedding/viral/cp-2.webp', label: 'Foto bloku — biletlər və popkorn (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/cp-3.webp', label: 'Proqramın üstündəki şəkil — səhnə önündə süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/cp-4.webp', label: 'Final — qırmızı xalça', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
