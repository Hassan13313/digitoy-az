/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/cb-1.webp', label: 'Açılış və örtük — sinifdə yaşıl lövhə', hint: 'Açılışda lövhə şəklin üstündən silinir.' },
  { key: 'detail', src: '/img/wedding/viral/cb-2.webp', label: 'Foto bloku — təbaşir və alma (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/cb-3.webp', label: 'Proqramın üstündəki şəkil — sinif süfrəsi', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/cb-4.webp', label: 'Final — gün batımında məktəb meydançası', hint: 'Gizlətsəniz yazılar açıq fonda qalır.' },
]
