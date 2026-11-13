/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/gr-1.webp', label: 'Açılış və örtük — açılan hədiyyə qutusu', hint: 'Açılışda qutu və şarlar şəklin üstündədir.' },
  { key: 'detail', src: '/img/wedding/viral/gr-2.webp', label: 'Foto bloku — mavi və çəhrayı şirniyyat (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/gr-3.webp', label: 'Proqramın üstündəki şəkil — iki rəngli süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/gr-4.webp', label: 'Final — səmada şarlar', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
