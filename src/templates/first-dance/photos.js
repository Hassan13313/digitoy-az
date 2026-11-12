/* Şablonun şəkil yerləri (admin «Şəkillər» tabı, bax templates/templatePhotos.js).
   Hər yer gizlədilə və ya admin şəkli ilə əvəz edilə bilər; şablon `resolvePhotos`
   ilə oxuyur. `src` — standart foto (public/img/wedding/viral). */
export const PHOTOS = [
  { key: 'opening', src: '/img/wedding/viral/reqs-1.webp', label: 'Açılış — fişənglər', hint: 'Toxunmadan əvvəlki ilk kadr. Öz şəklinizi qoysanız fişəng qığılcımları göstərilmir.' },
  { key: 'hero', src: '/img/wedding/viral/reqs-3.webp', label: 'Örtük — konfetili ilk rəqs', hint: 'Açılışın son kadrı və səhifənin üst şəkli (ikisi eyni şəkildir).' },
  { key: 'dance', src: '/img/wedding/viral/reqs-2.webp', label: 'Foto bloku — fişəngli rəqs (yazı ilə)', hint: 'Gizlətsəniz blok üstündəki yazı ilə birlikdə yığışır.' },
  { key: 'chandelier', src: '/img/wedding/viral/reqs-5.webp', label: 'Foto bloku — çilçıraq altında rəqs', hint: 'Gizlətsəniz blok yığışır.' },
  { key: 'party', src: '/img/wedding/viral/reqs-4.webp', label: 'Foto bloku — rəqs edən gəlin (konfeti ilə)', hint: 'Gizlətsəniz blok yığışır.' },
  { key: 'finale', src: '/img/wedding/viral/reqs-1.webp', label: 'Final — sonuncu ekran', hint: 'Gizlətsəniz yazılar qara fonda qalır. Öz şəklinizi qoysanız qığılcımlar göstərilmir.' },
]
