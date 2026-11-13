/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/gu-1.webp', label: 'Açılış və örtük — örtüklü zərli çərçivə', hint: 'Açılışda məxmər örtük şəklin üstündən düşür.' },
  { key: 'detail', src: '/img/wedding/viral/gu-2.webp', label: 'Foto bloku — fırça və palitra (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/gu-3.webp', label: 'Proqramın üstündəki şəkil — qalereya qəbulu', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/gu-4.webp', label: 'Final — boş ağ qalereya', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
