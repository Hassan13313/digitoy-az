/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/rv-1.webp', label: 'Açılış və örtük — qırmızı örpəkli gəlin', hint: 'Açılışda örpək şəklin üstündən qalxır; öz şəklinizi qoysanız da örpək effekti qalır.' },
  { key: 'detail', src: '/img/wedding/viral/rv-2.webp', label: 'Foto bloku — məxmər örpək və xına (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/rv-3.webp', label: 'Proqramın üstündəki şəkil — şamlı süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/rv-4.webp', label: 'Final — şamlı dəhliz', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
