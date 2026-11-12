/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/rp-1.webp', label: 'Açılış və örtük — saray pilləkəni və çilçıraq', hint: 'Açılış örtüyün özüdür. Öz şəklinizi qoysanız çilçıraq işığı effekti göstərilmir. Gizlətsəniz gecə mavisi fon qalır.' },
  { key: 'tiara', src: '/img/wedding/viral/rp-2.webp', label: 'Foto bloku — məxmər yastıqda tac (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/rp-3.webp', label: 'Proqramın üstündəki şəkil — saray ziyafəti', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/rp-4.webp', label: 'Final — saray qapıları', hint: 'Gizlətsəniz yazılar gecə mavisi fonda qalır.' },
]
