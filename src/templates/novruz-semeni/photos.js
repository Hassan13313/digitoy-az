/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/se-1.webp', label: 'Açılış və örtük — lentli səməni', hint: 'Açılışda səməni şəklin üstündə boy atır.' },
  { key: 'detail', src: '/img/wedding/viral/se-2.webp', label: 'Foto bloku — boyalı yumurtalar (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/se-3.webp', label: 'Proqramın üstündəki şəkil — bayram süfrəsi', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/se-4.webp', label: 'Final — çiçəkli bahar həyəti', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
