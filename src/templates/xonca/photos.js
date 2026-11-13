/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/xn-1.webp', label: 'Açılış və örtük — şamlı mis xonça', hint: 'Şamların alışması bu fotoya bağlıdır; öz şəklinizi qoysanız yalnız qığılcımlar qalır.' },
  { key: 'detail', src: '/img/wedding/viral/xn-2.webp', label: 'Foto bloku — xonça aparan əllər (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/xn-3.webp', label: 'Proqramın üstündəki şəkil — xonçalı süfrə', hint: 'Gizlətsəniz proqram kartı şəkilsiz qalır.' },
  { key: 'finale', src: '/img/wedding/viral/xn-4.webp', label: 'Final — sönməkdə olan şamlar', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
