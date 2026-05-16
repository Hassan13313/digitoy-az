export const DRESS_CODE_PALETTES = [
  {
    id: 'pastel',
    label: { az: 'Pastel', en: 'Pastel', ru: 'Пастель' },
    colors: ['#F8C8D4', '#D4C8F8', '#C8F8E8', '#F8ECC8'],
    description: {
      az: 'Açıq çəhrayı, lavanda, mint, krem tonları',
      en: 'Soft pink, lavender, mint, cream tones',
      ru: 'Нежно-розовый, лаванда, мята, кремовый',
    },
  },
  {
    id: 'earth',
    label: { az: 'Torpaq Tonları', en: 'Earth Tones', ru: 'Земляные тона' },
    colors: ['#C4956A', '#8B6347', '#D4B896', '#A0785A'],
    description: {
      az: 'Terrakota, krem bej, qəhvəyi tonları',
      en: 'Terracotta, cream beige, warm brown tones',
      ru: 'Терракота, кремовый бежевый, тёплый коричневый',
    },
  },
  {
    id: 'blacktie',
    label: { az: 'Black Tie', en: 'Black Tie', ru: 'Чёрный галстук' },
    colors: ['#1A1A1A', '#F5F5F5', '#C9A84C', '#8C8C8C'],
    description: {
      az: 'Klassik qara, ağ, qızılı aksent',
      en: 'Classic black, white, gold accent',
      ru: 'Классический чёрный, белый, золотой акцент',
    },
  },
  {
    id: 'garden',
    label: { az: 'Çiçəkli Bağ', en: 'Floral Garden', ru: 'Цветочный сад' },
    colors: ['#8FAF8F', '#D4A5A5', '#F5F0E8', '#B5C9A8'],
    description: {
      az: 'Adaçayı yaşılı, toz gülü, krem tonları',
      en: 'Sage green, dusty rose, cream tones',
      ru: 'Шалфей, пыльная роза, кремовый',
    },
  },
]

export const EVENT_TYPES = [
  { id: 'toy', icon: 'Heart' },
  { id: 'nishan', icon: 'Diamond' },
  { id: 'birthday', icon: 'Cake' },
  { id: 'corporate', icon: 'Briefcase' },
]

export const PRICING = [
  {
    id: 'basic',
    price: '49',
    features: {
      az: [
        'Geri sayım saatı',
        'Google Maps & Waze',
        'Dress code bölməsi',
        'Paylaşıla bilən link',
        '6 ay aktivlik',
      ],
      en: [
        'Countdown timer',
        'Google Maps & Waze',
        'Dress code section',
        'Shareable link',
        '6 months active',
      ],
      ru: [
        'Таймер обратного отсчёта',
        'Google Maps & Waze',
        'Раздел дресс-кода',
        'Ссылка для отправки',
        'Активность 6 месяцев',
      ],
    },
  },
  {
    id: 'premium',
    price: '89',
    popular: true,
    features: {
      az: [
        'Əsas paketin hər şeyi',
        'Ambient musiqi',
        'Foto qalereya QR',
        'Premium dizayn',
        '1 il aktivlik',
      ],
      en: [
        'Everything in Basic',
        'Ambient music toggle',
        'Gallery QR code',
        'Premium design',
        '1 year active',
      ],
      ru: [
        'Всё из Базового',
        'Кнопка фоновой музыки',
        'QR-код галереи',
        'Премиум дизайн',
        'Активность 1 год',
      ],
    },
  },
  {
    id: 'vip',
    price: '149',
    features: {
      az: [
        'Premium paketin hər şeyi',
        'İnteraktiv oturma planı',
        'Xüsusi animasiyalar',
        'Prioritet dəstək',
        'Limitsiz aktivlik',
      ],
      en: [
        'Everything in Premium',
        'Interactive seating plan',
        'Custom animations',
        'Priority support',
        'Unlimited active',
      ],
      ru: [
        'Всё из Премиум',
        'Интерактивный план рассадки',
        'Кастомные анимации',
        'Приоритетная поддержка',
        'Безлимитная активность',
      ],
    },
  },
]

export const WHATSAPP_NUMBER = '994555696549'
