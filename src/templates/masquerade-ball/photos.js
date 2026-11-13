/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'hero', src: '/img/wedding/viral/mq-1.webp', label: 'Açılış və örtük — məxmərdə Venesiya maskası', hint: 'Açılışda foto maskanın gözlərindən görünür.' },
  { key: 'detail', src: '/img/wedding/viral/mq-2.webp', label: 'Foto bloku — maskalar və şampan (yazı ilə)', hint: 'Gizlətsəniz blok altındakı yazı ilə birlikdə yığışır.' },
  { key: 'program', src: '/img/wedding/viral/mq-3.webp', label: 'Proqramın üstündəki şəkil — maskarad ziyafəti', hint: 'Gizlətsəniz proqram şəkilsiz başlayır.' },
  { key: 'finale', src: '/img/wedding/viral/mq-4.webp', label: 'Final — çilçıraqlar altında rəqs', hint: 'Gizlətsəniz yazılar tünd fonda qalır.' },
]
