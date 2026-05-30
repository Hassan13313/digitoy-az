/* ── Demo data — statik, backend-ə sorğu getmir ── */

const _d = new Date()
_d.setMonth(_d.getMonth() + 3)
export const DEMO_DATE = _d.toISOString().split('T')[0]

export const demoInvitation = {
  eventType: 'toy',
  brideName:  'Aysel',
  groomName:  'Nicat',
  date:        DEMO_DATE,
  time:        '19:00',
  venueName:  'Buta Palace, Bakı',

  googleMapsUrl: 'https://www.google.com/maps/search/Buta+Palace+Baku/@40.3975,49.8537',
  wazeUrl:       'https://waze.com/ul?q=Buta+Palace+Baku&navigate=yes',

  dressCodePalette: 'blacktie',
  dressCodeDescription:
    'Bəylər üçün: Black Tie / Tünd Kostyum. Xanımlar üçün: Zərif pastel tonlarında axşam libası.',

  seatingPlan: [
    'Masa 1: Nicat Əliyev, Rauf Babayev, Günel İsmayılova, Elnar Hüseynov',
    'Masa 2: Elnur Quliyev, Şəhla Qasımova, Orxan Nəcəfov, Türkan Muradova',
    'Masa 3: Kamran Hümbətov, Lalə Əhmədova, Bəhruz Süleymanov, Fidan Kərimova',
    'Masa 4: Nərmin Quliyeva, Araz Hüseynov, Sevinc Babayeva, Zaur İsmayılov',
    'Masa 5: Aytən Hüseynova, Elçin Əliyev, Röya Musayeva, Tural Məmmədov',
  ].join('; '),

  galleryLink: '',

  demoPhotos: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop&auto=format',
  ],

  programSteps: [
    { time: '18:00', icon: '🥂', activity: 'Qonaqların Möhtəşəm Qarşılanması' },
    { time: '19:00', icon: '💍', activity: 'Gəlin və Bəyin Möhtəşəm Girişi' },
    { time: '20:00', icon: '🍽️', activity: 'Şah Süfrəsi — Gala Ziyafəti' },
    { time: '21:00', icon: '💃', activity: 'Şah Naxış Rəqsi' },
    { time: '22:30', icon: '🎂', activity: 'Tort Kəsilməsi' },
    { time: '23:00', icon: '🎵', activity: 'Diskoteka və Yekun Proqram' },
  ],

  organizer: '',
  eventName:  '',
}

export const demoGuestbook = [
  {
    name: 'Ayan & Elnur',
    text: 'Nicat və Aysel, sizə ömür boyu xoşbəxtlik, sevgi və hüzur arzulayırıq! Bu gecə unutulmaz bir xatirəyə çevrilsin!',
  },
  {
    name: 'Kamran bəy',
    text: 'Təbrikimizi qəbul edin! Çox gözəl cütlüksünüz — birlikdə həmişə işıqlı olun.',
  },
  {
    name: 'Günel & Rauf',
    text: 'Bu xüsusi günün bütün çiçəklənməsiylə həyatınızı doldurmasını diləyirəm. Sevgilərimizlə!',
  },
  {
    name: 'Lalə xanım',
    text: 'Əziz Nicat və Aysel, toy gününüz mübarək! Birlikdə dünya qədər xoşbəxtlik tapasınız.',
  },
]
