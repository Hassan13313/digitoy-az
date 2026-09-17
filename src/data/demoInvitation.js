/* ── Demo data — statik, backend-ə sorğu getmir ── */

/* ── Demo tarixi — HƏMİŞƏ NÖVBƏTİ 13 MART ────────────────────────────────
   Həsənin tələbi «13 mart»dır, amma SABİT tarix yazmaq olmaz: 13 mart
   keçəndən sonra geri sayım mənfiyə düşər və demo sınar (məhz qorxulan hal).
   Ona görə tarix hesablanır — bu il 13 mart hələ gəlməyibsə bu il, gəlibsə
   növbəti il. Beləliklə demo HEÇ VAXT keçmiş tarix göstərmir və il-il
   yenilənməyə ehtiyac qalmır.

   ⚠ Əvvəlki məntiq «bu gün + 3 ay» idi (tarix hər gün sürüşürdü).
   ⚠ Ay indeksi 0-dan başlayır: 2 = mart. */
function nextMarch13() {
  const now = new Date()
  const y = now.getFullYear()
  /* Günü 13-dən BÖYÜK tutmuruq: 13 mart günü demo hələ «bu gün»ü göstərsin */
  const thisYear = new Date(y, 2, 13)
  const target = now <= thisYear ? thisYear : new Date(y + 1, 2, 13)
  /* ⚠ `toISOString()` UTC-yə çevirir və Bakı saatında (UTC+4) tarixi bir gün
     GERİ sürüşdürərdi (12 mart). Ona görə yerli komponentlərdən yığılır. */
  const mm = String(target.getMonth() + 1).padStart(2, '0')
  const dd = String(target.getDate()).padStart(2, '0')
  return `${target.getFullYear()}-${mm}-${dd}`
}

export const DEMO_DATE = nextMarch13()

export const demoInvitation = {
  eventType: 'toy',
  brideName:  'Aysel',
  groomName:  'Nicat',
  date:        DEMO_DATE,
  time:        '19:00',
  venueName:  'Buta Palace, Bakı',
  venueNote:  'Crystal Hall',

  googleMapsUrl: 'https://www.google.com/maps/search/Buta+Palace+Baku/@40.3975,49.8537',
  wazeUrl:       'https://waze.com/ul?q=Buta+Palace+Baku&navigate=yes',

  dressCodePalette: 'blacktie',
  dressCodeDescription:
    'Zəhmət olmasa ağ və açıq bej rənglərdən çəkinin — bu, gəlinin rəngidir.',

  seatingPlan: [
    'Masa 1: Nicat Əliyev, Rauf Babayev, Günel İsmayılova, Elnar Hüseynov',
    'Masa 2: Elnur Quliyev, Şəhla Qasımova, Orxan Nəcəfov, Türkan Muradova',
    'Masa 3: Kamran Hümbətov, Lalə Əhmədova, Bəhruz Süleymanov, Fidan Kərimova',
    'Masa 4: Nərmin Quliyeva, Araz Hüseynov, Sevinc Babayeva, Zaur İsmayılov',
    'Masa 5: Aytən Hüseynova, Elçin Əliyev, Röya Musayeva, Tural Məmmədov',
  ].join('; '),

  galleryLink: '',

  /* Demo musiqi: lokal MP3 preset nümayişi.
     ⚠ `playMode: 'auto'` QƏSDƏNdir — nümunə dəvətnamə məhsulun avtomatik
     başlayan musiqisini göstərməlidir. Müştərinin öz dəvətnaməsində bu seçim
     builder-dən gəlir (default: 'button' — tövsiyə olunan). */
  music: {
    type: 'track',
    provider: 'preset',
    id: 'a-thousand-years',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    file: '/music/a-thousand-years.mp3',
    duration: 286,
    startTime: 0,
    coverImage: null,
    isDefault: false,
    playMode: 'auto',
  },

  demoPhotos: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop&auto=format',
  ],

  programSteps: [
    { time: '18:00', icon: '🥂', activity: 'Qonaqların Möhtəşəm Qarşılanması' },
    { time: '19:00', icon: '💍', activity: 'Bəy və Gəlinin Möhtəşəm Girişi' },
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
