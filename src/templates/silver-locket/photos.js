/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/sv-1.webp', label: 'Açılış və örtük — qızılgül bağında cütlük', hint: 'Açılışda medalyon şəklin üstündə açılır.' },
  { key: 'detail', src: '/img/wedding/viral/sv-2.webp', label: 'Foto bloku — açıq medalyon (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/sv-3.webp', label: 'Proqramın üstündəki şəkil — gümüş süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/sv-4.webp', label: 'Final — ləçəkdə iki üzük', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
