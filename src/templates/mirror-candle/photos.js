/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/mc-1.webp', label: 'Açılış və örtük — zər güzgü və iki şam', hint: 'Açılışda şəkil oval güzgüdə görünür; şam işığı bu fotoya bağlıdır.' },
  { key: 'detail', src: '/img/wedding/viral/mc-2.webp', label: 'Foto bloku — əl güzgüsü və üzük (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/mc-3.webp', label: 'Proqramın üstündəki şəkil — güzgülü süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/mc-4.webp', label: 'Final — güzgüdə iki alov', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
