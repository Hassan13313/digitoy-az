/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/mb-1.webp', label: 'Açılış və örtük — işıq şüasında qara kallalar', hint: 'Öz şəklinizi qoysanız işıq şüası effekti göstərilmir.' },
  { key: 'detail', src: '/img/wedding/viral/mb-2.webp', label: 'Foto bloku — qara badələr (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/mb-3.webp', label: 'Proqramın üstündəki şəkil — qara süfrə', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/mb-4.webp', label: 'Final — gecə şəhəri', hint: 'Gizlətsəniz yazılar qara fonda qalır.' },
]
