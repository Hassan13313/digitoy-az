/* Phase 25.2 — Digitoy tərəfdaş proqramı.
   Yeni partnyor əlavə etmək üçün massivə yeni obyekt əlavə etmək kifayətdir —
   Builder-in "Partnyor Endirimləri" bölməsi və WhatsApp sifariş mesajı
   bütün aktiv partnyorları avtomatik render edir.
   Endirimlər yalnız sifariş axınında göstərilir, dəvətnamənin özündə heç vaxt görünmür. */
export const PARTNERS = [
  {
    id: 'vagzali',
    name: 'Vagzali.az',
    description: {
      az: 'Azərbaycanın tanınmış gəlinlik və toy xidmətləri platformalarından biridir.',
      en: 'One of Azerbaijan’s well-known bridal and wedding services platforms.',
      ru: 'Одна из известных платформ свадебных платьев и услуг в Азербайджане.',
    },
    discounts: { SADE: '5%', VIP: '10%', PREMIUM: '15%' },
    instagram: 'https://www.instagram.com/vagzali.azerbaijan/',
    whatsapp: 'https://wa.me/994774471030',
    logo: null, /* gələcək üçün */
    isActive: true,
  },
]

export const ACTIVE_PARTNERS = PARTNERS.filter(p => p.isActive)

export function getPartner(id) {
  return PARTNERS.find(p => p.id === id) || null
}
