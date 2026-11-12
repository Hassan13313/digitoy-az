/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/bp-1.webp', label: 'Açılış və örtük — şəxsi təyyarə', hint: 'Öz şəklinizi qoysanız salon işığı effekti göstərilmir.' },
  { key: 'detail', src: '/img/wedding/viral/bp-2.webp', label: 'Foto bloku — çamadan və pasport (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/bp-3.webp', label: 'Proqramın üstündəki şəkil — birinci sinif salon', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/bp-4.webp', label: 'Final — buludların üstündə', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
