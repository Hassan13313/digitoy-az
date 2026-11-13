/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/pl-1.webp', label: 'Açılış və örtük — biplanın yanında kiçik pilot', hint: 'Açılışda buludlar şəklin üstündən çəkilir; öz şəklinizi qoysanız da effekt qalır.' },
  { key: 'detail', src: '/img/wedding/viral/pl-2.webp', label: 'Foto bloku — pilot eynəyi və kompas (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/pl-3.webp', label: 'Proqramın üstündəki şəkil — anqarda süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/pl-4.webp', label: 'Final — buludlar üstündə təyyarə', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
