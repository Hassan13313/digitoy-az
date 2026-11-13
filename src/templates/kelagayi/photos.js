/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/kl-1.webp', label: 'Açılış və örtük — kəlağayılı gəlin', hint: 'Açılışda kəlağayı şəklin üstündə açılır; öz şəklinizi qoysanız da effekt qalır.' },
  { key: 'detail', src: '/img/wedding/viral/kl-2.webp', label: 'Foto bloku — kəlağayı və qəliblər (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/kl-3.webp', label: 'Proqramın üstündəki şəkil — şəbəkəli otaqda süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/kl-4.webp', label: 'Final — həyətdə kəlağayılar', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
