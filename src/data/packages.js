/* Builder addım id-ləri: 0 Dizayn, 1 Tədbir, 9 Bölmələr, 10 Bizim Hekayəmiz, 2 Məkan,
   3 Proqram, 4 Geyim, 5 Musiqi, 6 Oturma Planı, 7 Foto Qalereya.

   Hər paket öz kilidlərini daşıyır:
     lockedSteps    — builder-dən çıxan addımlar
     lockedFeatures — addımı olmayan bölmələr ('rsvp', 'guestbook')
     web: false     — veb-dəvətnamə deyil (VIDEO: qısa sifariş forması → WhatsApp)
   Sıra artan qiymətdir; admin adı `packageLabel(id)`-dən gəlir.
   ⚠ PHP tərəfi: public/api/config.php › DIGITOY_PACKAGES ilə EYNİ olmalıdır. */
export const PACKAGE_DEFS = {
  VIDEO:   { id: 'VIDEO',   name: 'Videolu dəvətnamə', price: '29',  lockedSteps: [6, 7, 10], lockedFeatures: ['rsvp', 'guestbook'], popular: false, web: false },
  MINI:    { id: 'MINI',    name: 'Mini',              price: '39',  lockedSteps: [6, 7, 10], lockedFeatures: ['rsvp', 'guestbook'], popular: false, web: true },
  SADE:    { id: 'SADE',    name: 'Sadə',              price: '59',  lockedSteps: [6, 7],     lockedFeatures: ['rsvp'],              popular: false, web: true },
  VIP:     { id: 'VIP',     name: 'VİP',               price: '89',  lockedSteps: [7],        lockedFeatures: [],                    popular: true,  web: true },
  PREMIUM: { id: 'PREMIUM', name: 'Premium',           price: '129', lockedSteps: [],         lockedFeatures: [],                    popular: false, web: true },
}

/* Pricing kartlarında göstərilən veb-paketlər (artan qiymət) */
export const WEB_PACKAGE_IDS = Object.values(PACKAGE_DEFS).filter((d) => d.web).map((d) => d.id)

export const isVideoPackage = (pkgId) => PACKAGE_DEFS[pkgId]?.web === false

/** Admin və WhatsApp sifarişindəki ad: «Sadə (59₼)» */
export const packageLabel = (pkgId) => {
  const d = PACKAGE_DEFS[pkgId]
  return d ? `${d.name} (${d.price}₼)` : (pkgId || '—')
}

/* Paket kartlarının funksiyaları (2026-11-18 yenidən yazıldı): hər paket öz dəyərini
   TAM göstərir — «… paketdəki hər şey» kimi istinad sətirləri YOXDUR.
     highlights — bu paketin üstünlükləri (kartda ulduzla, önə çəkilir)
     base       — həmçinin daxildir (açıq-aydın sadalanır)
     locked     — daxil deyil (üstündən xətt) */
export const PKG_FEATURES = {
  az: {
    MINI: {
      highlights: ['Açılış animasiyalı premium dizayn', 'Google Maps və Waze ilə bir toxunuşla yol', 'Toya qalan vaxtı göstərən geri sayım'],
      base:       ['Tədbir proqramı və dress code', 'Sizin seçdiyiniz fon musiqisi', 'Azərbaycan, ingilis və rus dillərində', 'Limitsiz qonağa bir link'],
      locked:     ['Bizim Hekayəmiz (Love Story)', 'Təbrik Kitabı', 'İştirak Təsdiqi'],
    },
    SADE: {
      highlights: ['Bizim Hekayəmiz — şəkilli Love Story zaman xətti', 'Təbrik Kitabı — qonaqların arzuları sizdə qalır'],
      base:       ['Açılış animasiyalı premium dizayn', 'Google Maps və Waze ilə yol', 'Geri sayım, proqram və dress code', 'Sizin seçdiyiniz fon musiqisi', '3 dildə, limitsiz qonağa bir link'],
      locked:     ['İştirak Təsdiqi', 'Oturma Planı', 'QR Foto Paylaşım'],
    },
    VIP: {
      highlights: ['İştirak Təsdiqi — cavabları real vaxtda görün', 'Oturma Planı — qonaq masasını özü tapır', 'Qonaq siyahısı və canlı hesabat'],
      base:       ['Love Story və Təbrik Kitabı', 'Açılış animasiyalı premium dizayn', 'Google Maps, geri sayım, proqram, dress code', 'Fon musiqisi, 3 dil, limitsiz qonaq'],
      locked:     ['QR Foto Paylaşım', 'Qonaq Qalereyası'],
    },
    PREMIUM: {
      highlights: ['QR Foto Paylaşım — qonaqlar şəkil və video yükləyir', 'Sizə özəl qonaq qalereyası', 'Bütün şəkilləri bir kliklə ZIP endirin', 'Masalar üçün HD çap QR kartı', 'Prioritet hazırlama'],
      base:       ['İştirak Təsdiqi və Oturma Planı', 'Qonaq siyahısı və canlı hesabat', 'Love Story və Təbrik Kitabı', 'Premium dizayn, Maps, geri sayım, musiqi, 3 dil'],
      locked:     [],
    },
    VIDEO: {
      highlights: [],
      base:       ['Nümunəyə uyğun şaquli video (9:16)', 'Adlarınız, tarix, saat və məkan', 'Dəvət mətni sizin istəyinizlə', 'Fon musiqisi seçimi', 'WhatsApp və Instagram üçün hazır MP4'],
      locked:     [],
    },
  },
  en: {
    MINI: {
      highlights: ['Premium design with an opening animation', 'One-tap directions with Google Maps and Waze', 'Countdown to your big day'],
      base:       ['Event programme and dress code', 'Background music of your choice', 'In Azerbaijani, English and Russian', 'One link for unlimited guests'],
      locked:     ['Our Story (Love Story)', 'Guestbook', 'RSVP (guest confirmation)'],
    },
    SADE: {
      highlights: ['Our Story — a Love Story timeline with photos', 'Guestbook — your guests’ wishes stay with you'],
      base:       ['Premium design with an opening animation', 'Directions with Google Maps and Waze', 'Countdown, programme and dress code', 'Background music of your choice', '3 languages, one link for unlimited guests'],
      locked:     ['RSVP (guest confirmation)', 'Seating plan', 'QR photo sharing'],
    },
    VIP: {
      highlights: ['RSVP — see the answers in real time', 'Seating plan — guests find their own table', 'Guest list and live report'],
      base:       ['Love Story and Guestbook', 'Premium design with an opening animation', 'Google Maps, countdown, programme, dress code', 'Music, 3 languages, unlimited guests'],
      locked:     ['QR photo sharing', 'Guest gallery'],
    },
    PREMIUM: {
      highlights: ['QR photo sharing — guests upload photos and videos', 'Your own private guest gallery', 'Download every photo as a ZIP in one click', 'HD print-ready QR card for the tables', 'Priority preparation'],
      base:       ['RSVP and seating plan', 'Guest list and live report', 'Love Story and Guestbook', 'Premium design, Maps, countdown, music, 3 languages'],
      locked:     [],
    },
    VIDEO: {
      highlights: [],
      base:       ['Vertical video (9:16) in the style you pick', 'Your names, date, time and venue', 'Invitation text the way you want it', 'Background music of your choice', 'Ready MP4 for WhatsApp and Instagram'],
      locked:     [],
    },
  },
  ru: {
    MINI: {
      highlights: ['Премиальный дизайн с анимацией открытия', 'Маршрут в одно касание: Google Maps и Waze', 'Обратный отсчёт до вашего дня'],
      base:       ['Программа и дресс-код', 'Фоновая музыка на ваш выбор', 'На азербайджанском, английском и русском', 'Одна ссылка для любого числа гостей'],
      locked:     ['Наша история (Love Story)', 'Книга пожеланий', 'Подтверждение участия'],
    },
    SADE: {
      highlights: ['Наша история — Love Story с фотографиями', 'Книга пожеланий — пожелания гостей остаются с вами'],
      base:       ['Премиальный дизайн с анимацией открытия', 'Маршрут через Google Maps и Waze', 'Отсчёт, программа и дресс-код', 'Фоновая музыка на ваш выбор', '3 языка, одна ссылка для всех гостей'],
      locked:     ['Подтверждение участия', 'План рассадки', 'QR обмен фото'],
    },
    VIP: {
      highlights: ['Подтверждение участия — ответы в реальном времени', 'План рассадки — гость сам находит свой стол', 'Список гостей и живой отчёт'],
      base:       ['Love Story и книга пожеланий', 'Премиальный дизайн с анимацией открытия', 'Google Maps, отсчёт, программа, дресс-код', 'Музыка, 3 языка, без ограничения гостей'],
      locked:     ['QR обмен фото', 'Галерея гостей'],
    },
    PREMIUM: {
      highlights: ['QR обмен фото — гости загружают фото и видео', 'Ваша личная галерея гостей', 'Все фото одним ZIP-архивом в один клик', 'HD QR-карта для печати на столы', 'Приоритетная подготовка'],
      base:       ['Подтверждение участия и план рассадки', 'Список гостей и живой отчёт', 'Love Story и книга пожеланий', 'Премиум-дизайн, Maps, отсчёт, музыка, 3 языка'],
      locked:     [],
    },
    VIDEO: {
      highlights: [],
      base:       ['Вертикальное видео (9:16) в выбранном стиле', 'Ваши имена, дата, время и место', 'Текст приглашения по вашему желанию', 'Фоновая музыка на выбор', 'Готовый MP4 для WhatsApp и Instagram'],
      locked:     [],
    },
  },
}

export function getLockedSteps(pkgId) {
  return PACKAGE_DEFS[pkgId]?.lockedSteps ?? []
}

/* Paket ID-dən feature gates qaytarır — bütün komponentlər bu funksiyanı istifadə edir.
   ⚠ Boş ID SADE sayılır (köhnə dəvətnamələr); naməlum ID-də heç nə kilidlənmir
   (əvvəlki davranış). */
export function getPackageGates(pkgId) {
  const id       = pkgId || 'SADE'
  const locked   = getLockedSteps(id)
  const features = PACKAGE_DEFS[id]?.lockedFeatures ?? []
  return {
    allowRsvp:      !features.includes('rsvp'),
    allowSeating:   !locked.includes(6),
    allowGallery:   !locked.includes(7),
    allowLoveStory: !locked.includes(10),
    allowGuestbook: !features.includes('guestbook'),
  }
}
