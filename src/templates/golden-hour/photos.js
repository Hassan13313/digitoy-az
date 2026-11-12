/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/gh-1.webp', label: 'Açılış və örtük — bağda toy tağı', hint: 'Açılış örtüyün özüdür. Öz şəklinizi qoysanız tağın arxasındakı günəş işığı göstərilmir. Gizlətsəniz krem fon qalır.' },
  { key: 'bouquet', src: '/img/wedding/viral/gh-3.webp', label: 'Foto bloku — buket (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'table', src: '/img/wedding/viral/gh-2.webp', label: 'Foto bloku — zeytun ağacları altında süfrə', hint: 'Gizlətsəniz blok yığışır.' },
  { key: 'finale', src: '/img/wedding/viral/gh-4.webp', label: 'Final — gün batımı', hint: 'Gizlətsəniz yazılar krem fonda qalır.' },
]
