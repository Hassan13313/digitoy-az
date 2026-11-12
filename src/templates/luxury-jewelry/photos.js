/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/lj-1.webp', label: 'Açılış və örtük — vitrində zümrüd kəsimli üzük', hint: 'Öz şəklinizi qoysanız brilyant parıltısı göstərilmir.' },
  { key: 'detail', src: '/img/wedding/viral/lj-2.webp', label: 'Foto bloku — üzüklü əl (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/lj-3.webp', label: 'Proqramın üstündəki şəkil — zümrüd süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/lj-4.webp', label: 'Final — zümrüd salon', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
